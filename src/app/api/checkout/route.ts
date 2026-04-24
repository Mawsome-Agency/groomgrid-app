import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { createCheckoutSession, getCheckoutSession, getStripeErrorMessage } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackPaymentInitiatedServer } from '@/lib/ga4-server';
import { ensureEnv } from '@/lib/validation';
import { PLAN_DATA_CENTS } from '@/app/pricing/pricing-data';

/** Validate plan type */
export function validatePlan(planType: string): boolean {
  return Object.hasOwn(PLAN_DATA_CENTS, planType);
}

/** Idempotency helper */
export async function ensureIdempotentLockout(userId: string, paymentId: string): Promise<string | null> {
  const existing = await prisma.paymentLockout.findFirst({ where: { userId, paymentId } });
  return existing ? existing.sessionId : null;
}

export async function POST(req: NextRequest) {
  try {
    // Validate env
    ensureEnv('stripe');
    ensureEnv('app');

    // ── Authentication check ──────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required', errorType: 'generic' }, { status: 401 });
    }

    const { userId, planType, customerEmail, clientId, coupon: rawCoupon } = await req.json();

    if (!userId || !planType) {
      return NextResponse.json({ error: 'Missing required fields', errorType: 'generic' }, { status: 400 });
    }

    // Verify that the authenticated user matches the requested userId
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'User ID mismatch', errorType: 'generic' }, { status: 403 });
    }

    // Sanitize coupon: uppercase, alphanumeric only, max 20 chars
    const coupon = rawCoupon
      ? String(rawCoupon).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20) || undefined
      : undefined;

    if (!validatePlan(planType)) {
      return NextResponse.json({ error: 'Invalid plan type', errorType: 'generic' }, { status: 400 });
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
      return NextResponse.json({ error: 'Profile not found', errorType: 'generic' }, { status: 404 });
    }

    const checkoutSession = await createCheckoutSession({
      userId,
      planType: planType as 'solo' | 'salon' | 'enterprise',
      customerEmail: customerEmail || `${userId}@groomgrid.app`,
      businessName: profile.businessName,
      planData: PLAN_DATA_CENTS[planType],
      clientId,
      couponCode: coupon,
    });

    await trackPaymentInitiatedServer(userId, checkoutSession.id, planType);

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    const errorDetails = getStripeErrorMessage(error);
    return NextResponse.json({ error: errorDetails.message, errorType: errorDetails.type, declineCode: errorDetails.declineCode }, { status: 500 });
  }
}
