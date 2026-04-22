import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireEnvVar } from '@/lib/validation';

const VALID_PLANS = ['solo', 'salon', 'enterprise'] as const;
type PlanType = typeof VALID_PLANS[number];

function getStripe(): Stripe {
  return new Stripe(requireEnvVar('STRIPE_SECRET_KEY'), {
    apiVersion: '2023-10-16',
  });
}

function getPriceId(plan: PlanType): string {
  const priceMap: Record<PlanType, string> = {
    solo: requireEnvVar('STRIPE_PRICE_SOLO'),
    salon: requireEnvVar('STRIPE_PRICE_SALON'),
    enterprise: requireEnvVar('STRIPE_PRICE_ENTERPRISE'),
  };
  return priceMap[plan];
}

/**
 * GET /api/checkout/session?plan=solo|salon|enterprise
 *
 * Creates a Stripe Checkout session with BETA50 coupon pre-applied and
 * redirects (307) the user directly to the Stripe-hosted checkout page.
 * Requires authentication — userId is passed via session for webhook processing.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get('plan');

  if (!plan) {
    return NextResponse.json({ error: 'Missing plan parameter' }, { status: 400 });
  }

  if (!(VALID_PLANS as readonly string[]).includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan. Must be solo, salon, or enterprise.' }, { status: 400 });
  }

  const validPlan = plan as PlanType;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getgroomgrid.com';

  try {
    const stripe = getStripe();
    const priceId = getPriceId(validPlan);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      // Pre-apply BETA50 coupon. Note: allow_promotion_codes cannot be set when
      // discounts is specified — Stripe enforces mutual exclusivity.
      discounts: [{ coupon: 'BETA50' }],
      // Include metadata and trial so webhook can process the session properly
      metadata: {
        userId: 'anonymous', // Will need to be linked post-checkout
        planType: validPlan,
        isTrial: 'true',
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: { planType: validPlan },
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/plans`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    return NextResponse.redirect(session.url, 307);
  } catch (error: any) {
    console.error('[/api/checkout/session] Stripe error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
