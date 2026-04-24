import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { createCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { ensureEnv } from '@/lib/validation';
import { PLAN_DATA_CENTS } from '@/app/pricing/pricing-data';

/**
 * GET /api/checkout/session?plan=solo|salon|enterprise
 *
 * Creates a Stripe Checkout session with BETA50 coupon pre-applied and
 * redirects (307) the user directly to the Stripe-hosted checkout page.
 * Requires authentication — userId from session is embedded in metadata
 * so the webhook can link the payment to a real user.
 */
export async function GET(req: NextRequest) {
  // ── Authentication check ──────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', '/plans');
    return NextResponse.redirect(loginUrl, 302);
  }

  const { searchParams } = new URL(req.url);
  const plan = searchParams.get('plan');

  if (!plan) {
    return NextResponse.json({ error: 'Missing plan parameter' }, { status: 400 });
  }

  if (!Object.hasOwn(PLAN_DATA_CENTS, plan)) {
    return NextResponse.json({ error: 'Invalid plan. Must be solo, salon, or enterprise.' }, { status: 400 });
  }

  try {
    ensureEnv('stripe');
    ensureEnv('app');

    // Look up profile for business name
    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Please complete signup first.' }, { status: 404 });
    }

    // Use the shared createCheckoutSession so metadata, trial, and URLs
    // are consistent with the POST /api/checkout flow
    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      planType: plan as 'solo' | 'salon' | 'enterprise',
      customerEmail: session.user.email || `${session.user.id}@groomgrid.app`,
      businessName: profile.businessName,
      planData: PLAN_DATA_CENTS[plan],
      couponCode: 'BETA50',
    });

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.redirect(checkoutSession.url, 307);
  } catch (error: any) {
    console.error('[/api/checkout/session] Stripe error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
