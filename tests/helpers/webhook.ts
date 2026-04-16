import { Page } from '@playwright/test';
import Stripe from 'stripe';
import {
  mockStripeWebhookEvent,
  mockStripeEvents,
  generateStripeSignature,
  createMockStripeEvent,
} from '@/lib/stripe';

export interface WebhookTestEvent {
  type: string;
  data: Record<string, unknown>;
}

/**
 * Creates a test webhook event with customizable properties
 *
 * @param type - The Stripe event type (e.g., 'checkout.session.completed')
 * @param overrides - Optional overrides for the event data
 * @returns A Stripe.Event object suitable for testing
 */
export function createTestWebhookEvent(
  type: 'checkout.session.completed' |
         'customer.subscription.updated' |
         'customer.subscription.deleted' |
         'invoice.payment_succeeded' |
         'invoice.payment_failed',
  overrides?: Record<string, unknown>
): Stripe.Event {
  const baseEvents: Record<string, Stripe.Event> = {
    'checkout.session.completed': mockStripeEvents.checkoutSessionCompleted,
    'customer.subscription.updated': mockStripeEvents.subscriptionUpdated,
    'customer.subscription.deleted': mockStripeEvents.subscriptionDeleted,
    'invoice.payment_succeeded': mockStripeEvents.invoicePaymentSucceeded,
    'invoice.payment_failed': mockStripeEvents.invoicePaymentFailed,
  };

  const baseEvent = baseEvents[type] || mockStripeWebhookEvent;

  if (overrides) {
    return createMockStripeEvent({
      ...baseEvent,
      ...overrides,
    });
  }

  return baseEvent;
}

/**
 * Creates a signed webhook payload for testing signature verification
 *
 * @param event - The Stripe event to sign
 * @param secret - The webhook secret (defaults to test secret)
 * @returns Object with payload string and signature header value
 */
export function createSignedWebhookPayload(
  event: Stripe.Event,
  secret: string = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
): { payload: string; signature: string } {
  const payload = JSON.stringify(event);
  const signature = generateStripeSignature(payload, secret);
  return { payload, signature };
}

/**
 * Sends a webhook request to the Stripe webhook endpoint
 *
 * @param page - Playwright page instance
 * @param event - The Stripe event to send
 * @param options - Optional configuration
 */
export async function sendWebhookRequest(
  page: Page,
  event: Stripe.Event,
  options?: {
    secret?: string;
    testKey?: string;
    useTestMode?: boolean;
  }
): Promise<Response> {
  const { payload, signature } = createSignedWebhookPayload(
    event,
    options?.secret
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.useTestMode) {
    headers['x-test-webhook-key'] = options.testKey || process.env.STRIPE_WEBHOOK_TEST_KEY || 'test_key';
  } else {
    headers['stripe-signature'] = signature;
  }

  return page.evaluate(
    ({ url, body, reqHeaders }) => {
      return fetch(url, {
        method: 'POST',
        headers: reqHeaders,
        body,
      });
    },
    {
      url: '/api/stripe/webhook',
      body: payload,
      reqHeaders: headers,
    }
  );
}

/**
 * Mocks a webhook request for Playwright E2E tests
 * This function intercepts the request and returns a mock response
 *
 * @param page - Playwright page instance
 * @param event - The Stripe event to mock
 * @param options - Optional configuration
 */
export async function mockWebhookRequest(
  page: Page,
  event: Stripe.Event,
  options?: {
    testKey?: string;
  }
): Promise<void> {
  const testKey = options?.testKey || process.env.STRIPE_WEBHOOK_TEST_KEY || 'test_key';

  await page.route('/api/stripe/webhook', async (route) => {
    const request = route.request();
    const headers = await request.allHeaders();

    // Verify test key in test mode
    if (headers['x-test-webhook-key'] !== testKey) {
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Invalid test key' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      body: JSON.stringify({ received: true }),
    });
  });

  // Trigger the webhook via fetch
  await page.evaluate(
    ({ url, body, key }) => {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-test-webhook-key': key,
        },
        body,
      });
    },
    {
      url: '/api/stripe/webhook',
      body: JSON.stringify(event),
      key: testKey,
    }
  );
}

/**
 * Waits for webhook processing to complete
 * Useful when testing async webhook handlers
 *
 * @param page - Playwright page instance
 * @param timeout - Maximum wait time in ms (default: 5000)
 */
export async function waitForWebhookProcessing(
  page: Page,
  timeout: number = 5000
): Promise<void> {
  await page.waitForTimeout(500); // Basic debounce

  // Optionally wait for specific network idle or DOM changes
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Helper to create a complete checkout session completed event for E2E testing
 *
 * @param params - Parameters for the checkout session
 * @returns A complete Stripe.Event for checkout.session.completed
 */
export function createCheckoutSessionCompletedEvent(params: {
  userId: string;
  planType: string;
  sessionId?: string;
  paymentIntentId?: string;
  customerId?: string;
}): Stripe.Event {
  return createMockStripeEvent({
    id: `evt_${Date.now()}`,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: params.sessionId || `cs_test_${Date.now()}`,
        object: 'checkout.session',
        payment_intent: params.paymentIntentId || `pi_test_${Date.now()}`,
        customer: params.customerId || `cus_test_${Date.now()}`,
        metadata: {
          userId: params.userId,
          planType: params.planType,
        },
        amount_total: params.planType === 'solo' ? 2900 : params.planType === 'salon' ? 7900 : 14900,
        currency: 'usd',
        status: 'complete',
        payment_status: 'paid',
      },
    },
  }) as Stripe.Event;
}
