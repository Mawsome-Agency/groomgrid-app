import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export interface CreateCheckoutSessionParams {
  userId: string;
  planType: 'solo' | 'salon' | 'enterprise';
  customerEmail: string;
  businessName: string;
  planData?: { name: string; price: number };
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
  planData,
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
        planName: planData?.name || planType,
        planPrice: planData?.price?.toString() || '0',
        isTrial: 'true',
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?plan=${planType}`,
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

/**
 * Maps Stripe decline codes to GroomGrid error types for the error page
 */
export function mapStripeErrorToErrorType(declineCode?: string): 'declined' | 'insufficient' | 'expired' | 'generic' {
  if (!declineCode) return 'generic';
  
  switch (declineCode) {
    case 'insufficient_funds':
      return 'insufficient';
    case 'expired_card':
      return 'expired';
    case 'card_declined':
    case 'generic_decline':
    case 'processing_error':
      return 'declined';
    default:
      return 'generic';
  }
}

/**
 * Extracts error details from a Stripe error for client-side display
 */
export function getStripeErrorMessage(error: any): { type: string; message: string; declineCode?: string } {
  if (!error) {
    return { type: 'generic', message: 'An unknown error occurred' };
  }

  // Handle Stripe API errors
  if (error.type) {
    const stripeError = error as Stripe.StripeRawError;
    
    switch (stripeError.type) {
      case 'card_error':
        const cardError = stripeError as Stripe.StripeRawError & { code?: string };
        return {
          type: mapStripeErrorToErrorType(cardError.code),
          message: cardError.message || 'Payment failed',
          declineCode: cardError.code,
        };
      case 'rate_limit_error':
        return {
          type: 'generic',
          message: 'Too many requests. Please try again later.',
        };
      case 'invalid_request_error':
        return {
          type: 'generic',
          message: 'Invalid request. Please check your input.',
        };
      case 'api_error':
        return {
          type: 'generic',
          message: 'Payment processing error. Please try again.',
        };
      default:
        return {
          type: 'generic',
          message: stripeError.message || 'An error occurred',
        };
    }
  }

  // Handle generic errors
  return {
    type: 'generic',
    message: error.message || 'An error occurred',
  };
}

export { stripe };
