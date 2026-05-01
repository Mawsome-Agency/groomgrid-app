import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { createCheckoutSession, getCheckoutSession, getStripeErrorMessage } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackPaymentInitiatedServer } from '@/lib/ga4-server';
import { ensureEnv } from '@/lib/validation';
import { PLANS } from '@/app/pricing/pricing-data';
import { apiError } from '@/lib/api-errors';
import type { PlanType } from '@/types';

// Derive plan data from the single source of truth (pricing-data.ts).
// Prices are stored in cents for Stripe.
const PLAN_DATA = Object.fromEntries(
  PLANS.map((plan) => [plan.type, { name: plan.name, price: plan.price * 100 }])
) as Record<PlanType, { name: string; price: number }>;

/** Validate plan type */
export function validatePlan(planType: string): boolean {
  return Object.keys(PLAN_DATA).includes(planType);
}

/** Idempotency helper */
export async function ensureIdempotentLockout(userId: string, paymentId: string): Promise<string | null> {
  const existing = await prisma.paymentLockout.findFirst({ where: { userId, paymentId } });
  return existing ? existing.sessionId : null;
}

export async function POST(req: NextRequest) {
  try {
    // ── Authentication check ──────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return apiError('Authentication required', 401);
    }

    // Validate env (after auth so unauthenticated requests get 401, not 500)
    ensureEnv('stripe');
    ensureEnv('app');

    const { userId, planType, customerEmail, clientId, coupon: rawCoupon } = await req.json();

    if (!userId || !planType) {
      return apiError('Missing required fields', 400);
    }

    // Verify that the authenticated user matches the requested userId
    if (session.user.id !== userId) {
      return apiError('User ID mismatch', 403);
    }

    // Sanitize coupon: uppercase, alphanumeric only, max 20 chars
    const coupon = rawCoupon
      ? String(rawCoupon).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20) || undefined
      : undefined;

    if (!validatePlan(planType)) {
      return apiError('Invalid plan type', 400);
    }

    // Idempotency check — retrieve the live session URL from Stripe rather than
    // constructing it, so we never return an expired or malformed URL.
    const existingSessionId = await ensureIdempotentLockout(userId, planType);
    if (existingSessionId) {
      const existingSession = await getCheckoutSession(existingSessionId);
      return NextResponse.json({ url: existingSession.url, sessionId: existingSessionId });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return apiError('Profile not found', 404);
    }

    // All users proceed to Stripe checkout — trial is handled via subscription_data.trial_period_days
    const checkoutSession = await createCheckoutSession({
      userId,
      planType: planType as PlanType,
      customerEmail: customerEmail || `${userId}@groomgrid.app`,
      businessName: profile.businessName,
      planData: PLAN_DATA[planType as PlanType],
      clientId,
      couponCode: coupon,
    });

    await trackPaymentInitiatedServer(userId, checkoutSession.id, planType);

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const errorDetails = getStripeErrorMessage(error);
    return apiError(errorDetails.message, 500, { type: errorDetails.type, declineCode: errorDetails.declineCode });
  }
}
