import Stripe from 'stripe';
import { requireEnvVar } from './validation';
import crypto from 'crypto';

// Lazy Stripe initialization — avoids crashing at module-eval time when
// STRIPE_SECRET_KEY is absent (e.g. staging builds, test environments).
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(requireEnvVar('STRIPE_SECRET_KEY'), {
      apiVersion: "2023-10-16",
    });
  }
  return _stripe;
}

// Lazy PRICE_IDS — same reason: don't throw at import time.
function getPriceIds() {
  return {
    solo: requireEnvVar('STRIPE_PRICE_SOLO'),
    salon: requireEnvVar('STRIPE_PRICE_SALON'),
    enterprise: requireEnvVar('STRIPE_PRICE_ENTERPRISE'),
  } as const;
}

export interface CreateCheckoutSessionParams {
  userId: string;
  planType: 'solo' | 'salon' | 'enterprise';
  customerEmail: string;
  businessName: string;
  planData?: { name: string; price: number };
  clientId?: string;
}

export async function createCheckoutSession({
  userId,
  planType,
  customerEmail,
  businessName,
  planData,
  clientId,
}: CreateCheckoutSessionParams) {
  const stripe = getStripe();
  const priceId = getPriceIds()[planType];

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
    // Session-level metadata: read by webhook handler and success handler via session.metadata
    metadata: {
      userId,
      planType,
      businessName,
      planName: planData?.name || planType,
      planPrice: planData?.price?.toString() || '0',
      isTrial: 'true',
      clientId: clientId || '',
    },
    subscription_data: {
      trial_period_days: 14,
      // Subscription-level metadata: read by subscription.updated/deleted events
      metadata: { userId, planType },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?plan=${planType}`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    // Note: customer_update requires an existing Stripe customer ID.
    // New users don't have one yet — add to billing portal flow instead.
  });

  return session;
}

export async function getCheckoutSession(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await getStripe().billingPortal.sessions.create({
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

/** @deprecated Use getStripe() for lazy initialization */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

/**
 * Base mock checkout session object matching Stripe.Checkout.Session shape
 */
const mockCheckoutSession: Stripe.Checkout.Session = {
  id: "cs_test_123",
  object: "checkout.session",
  amount_subtotal: 2900,
  amount_total: 2900,
  currency: "usd",
  status: "complete",
  payment_status: "paid",
  payment_intent: "pi_test_456",
  customer: "cus_test_789",
  subscription: "sub_test_abc",
  metadata: {
    userId: "test_user_id",
    planType: "solo",
    businessName: "Test Business",
  },
  client_reference_id: null,
  client_secret: null,
  consent: null,
  consent_collection: null,
  created: Math.floor(Date.now() / 1000),
  customer_creation: null,
  customer_details: null,
  customer_email: null,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  livemode: false,
  locale: null,
  mode: "subscription",
  payment_link: null,
  payment_method_collection: null,
  payment_method_options: null,
  phone_number_collection: null,
  recovered_by: null,
  setup_intent: null,
  shipping_address_collection: null,
  shipping_cost: null,
  shipping_details: null,
  submit_type: null,
  subscription_data: null,
  success_url: "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "http://localhost:3000/checkout/cancel",
  total_details: null,
  url: null,
  after_expiration: null,
  allow_promotion_codes: null,
  automatic_tax: null,
  billing_address_collection: null,
  custom_fields: [],
  custom_text: null,
  invoice: null,
  invoice_creation: null,
  line_items: null,
  on_behalf_of: null,
  payment_intent_data: null,
  payment_method_configuration: null,
  permit_promotion_codes: null,
  plan: null,
  return_url: null,
  saved_payment_method_options: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  tax_id_collection: null,
  transfer_data: null,
  ui_mode: null,
} as unknown as Stripe.Checkout.Session;

/**
 * Mock Stripe webhook event used in test environment.
 * This object mirrors the minimal shape required by the webhook handler.
 */
export const mockStripeWebhookEvent: Stripe.Event = {
  id: "evt_test_checkout_session_completed",
  object: "event",
  api_version: "2024-08-15",
  created: Math.floor(Date.now() / 1000),
  data: {
    object: mockCheckoutSession,
  },
  livemode: false,
  pending_webhooks: 0,
  type: "checkout.session.completed",
  request: null,
};

/**
 * Mock event variants for different webhook event types
 */
export const mockStripeEvents = {
  checkoutSessionCompleted: mockStripeWebhookEvent,

  subscriptionUpdated: {
    id: "evt_test_subscription_updated",
    object: "event",
    api_version: "2024-08-15",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: "sub_test_abc",
        object: "subscription",
        status: "active",
        metadata: {
          userId: "test_user_id",
          planType: "solo",
        },
        customer: "cus_test_789",
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      },
    },
    livemode: false,
    pending_webhooks: 0,
    type: "customer.subscription.updated",
    request: null,
  } as unknown as Stripe.Event,

  subscriptionDeleted: {
    id: "evt_test_subscription_deleted",
    object: "event",
    api_version: "2024-08-15",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: "sub_test_abc",
        object: "subscription",
        status: "canceled",
        metadata: {
          userId: "test_user_id",
        },
        customer: "cus_test_789",
      },
    },
    livemode: false,
    pending_webhooks: 0,
    type: "customer.subscription.deleted",
    request: null,
  } as unknown as Stripe.Event,

  invoicePaymentSucceeded: {
    id: "evt_test_invoice_succeeded",
    object: "event",
    api_version: "2024-08-15",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: "in_test_123",
        object: "invoice",
        amount_paid: 2900,
        customer: "cus_test_789",
        status: "paid",
      },
    },
    livemode: false,
    pending_webhooks: 0,
    type: "invoice.payment_succeeded",
    request: null,
  } as unknown as Stripe.Event,

  invoicePaymentFailed: {
    id: "evt_test_invoice_failed",
    object: "event",
    api_version: "2024-08-15",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: "in_test_123",
        object: "invoice",
        amount_paid: 0,
        customer: "cus_test_789",
        status: "open",
        last_payment_error: {
          message: "Card declined",
        },
      },
    },
    livemode: false,
    pending_webhooks: 0,
    type: "invoice.payment_failed",
    request: null,
  } as unknown as Stripe.Event,
};

/**
 * Creates a customizable mock Stripe event for testing
 */
export function createMockStripeEvent(overrides?: Partial<Stripe.Event>): Stripe.Event {
  return {
    ...mockStripeWebhookEvent,
    ...overrides,
    data: {
      ...mockStripeWebhookEvent.data,
      object: {
        ...mockStripeWebhookEvent.data.object,
        ...(overrides?.data?.object || {}),
      },
    },
  } as Stripe.Event;
}

/**
 * Generates a Stripe webhook signature for testing
 * Follows Stripe's signature format: t=timestamp,v1=signature
 *
 * @param payload - The raw JSON payload
 * @param secret - The webhook secret
 * @returns The signature header value
 */
export function generateStripeSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

/**
 * Creates a signed webhook payload for E2E and unit tests
 *
 * @param event - The Stripe event to sign
 * @param secret - The webhook secret
 * @returns Object with payload string and signature header
 */
export function createSignedWebhookPayload(
  event: Stripe.Event,
  secret: string
): { payload: string; signature: string } {
  const payload = JSON.stringify(event);
  const signature = generateStripeSignature(payload, secret);
  return { payload, signature };
}
