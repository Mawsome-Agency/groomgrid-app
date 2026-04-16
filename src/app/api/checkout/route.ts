import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, getStripeErrorMessage } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackPaymentInitiatedServer } from '@/lib/ga4-server';
import { ensureEnv } from '@/lib/validation';

// Plan data for metadata
const PLAN_DATA = {
  solo: { name: 'Solo', price: 2900 },
  salon: { name: 'Salon', price: 7900 },
  enterprise: { name: 'Enterprise', price: 14900 },
} as const;

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
    // Validate env
    ensureEnv('stripe');
    ensureEnv('app');

    const { userId, planType, customerEmail, clientId } = await req.json();

    if (!userId || !planType) {
      return NextResponse.json({ error: 'Missing required fields', errorType: 'generic' }, { status: 400 });
    }

    if (!validatePlan(planType)) {
      return NextResponse.json({ error: 'Invalid plan type', errorType: 'generic' }, { status: 400 });
    }

    // Idempotency check
    const existingSessionId = await ensureIdempotentLockout(userId, planType);
    if (existingSessionId) {
      return NextResponse.json({ url: `https://checkout.stripe.com/pay/${existingSessionId}`, sessionId: existingSessionId });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found', errorType: 'generic' }, { status: 404 });
    }

    const session = await createCheckoutSession({
      userId,
      planType: planType as keyof typeof PLAN_DATA,
      customerEmail: customerEmail || `${userId}@groomgrid.app`,
      businessName: profile.businessName,
      planData: PLAN_DATA[planType as keyof typeof PLAN_DATA],
      clientId,
    });

    await trackPaymentInitiatedServer(userId, session.id, planType);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    const errorDetails = getStripeErrorMessage(error);
    return NextResponse.json({ error: errorDetails.message, errorType: errorDetails.type, declineCode: errorDetails.declineCode }, { status: 500 });
  }
}
