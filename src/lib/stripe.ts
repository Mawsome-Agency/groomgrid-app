import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-01-27.acacia',
});

export interface CreateCheckoutSessionParams {
  userId: string;
  planType: 'solo' | 'salon' | 'enterprise';
  customerEmail: string;
  businessName: string;
}

const PRICE_IDS = {
  solo: process.env.STRIPE_PRICE_SOLO!,
  salon: process.env.STRIPE_PRICE_SALON!,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
} as const;

export async function createCheckoutSession({
  userId,
  planType,
  customerEmail,
  businessName,
}: CreateCheckoutSessionParams) {
  const priceId = PRICE_IDS[planType];
  
  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        userId,
        planType,
        businessName,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
  });
  
  return session;
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });
  
  return session;
}

export { stripe };
