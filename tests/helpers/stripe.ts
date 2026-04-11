/**
 * Stripe test helpers for E2E tests
 *
 * Provides utilities for testing Stripe checkout flows in test mode
 */

import { APIRequestContext, Page } from '@playwright/test';

export interface TestCheckoutSession {
  sessionId: string;
  url: string;
  planType: string;
  customerEmail: string;
}

export interface TestSubscription {
  id: string;
  status: string;
  planType: string;
  trialEnd: string;
}

/**
 * Stripe test card numbers
 */
export const STRIPE_TEST_CARDS = {
  success: '4242424242424242',
  decline: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expired: '4000000000000069',
  cvcFail: '4000000000000127',
};

/**
 * Create a test checkout session via API
 */
export async function createTestCheckoutSession(
  request: APIRequestContext,
  baseURL: string,
  userId: string,
  planType: string,
  customerEmail: string
): Promise<TestCheckoutSession> {
  const response = await request.post(`${baseURL}/api/checkout`, {
    data: {
      userId,
      planType,
      customerEmail,
    },
  });

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to create checkout session: ${error}`);
  }

  const data = await response.json();

  return {
    sessionId: data.sessionId || '',
    url: data.url || '',
    planType,
    customerEmail,
  };
}

/**
 * Complete a test payment using Stripe test card
 */
export async function completeTestPayment(
  page: Page,
  cardNumber: string = STRIPE_TEST_CARDS.success,
  expiry: string = '12/34',
  cvc: string = '123',
  postalCode: string = '12345'
): Promise<void> {
  // Wait for Stripe checkout to load
  await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 10000 });

  // Get Stripe iframe
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();

  // Fill in card number
  await stripeFrame.locator('input[name="cardnumber"]').fill(cardNumber);

  // Fill in expiry
  await stripeFrame.locator('input[name="exp-date"]').fill(expiry);

  // Fill in CVC
  await stripeFrame.locator('input[name="cvc"]').fill(cvc);

  // Fill in postal code
  await stripeFrame.locator('input[name="postal"]').fill(postalCode);

  // Submit payment
  await page.getByRole('button', { name: /Pay/i }).click();

  // Wait for redirect
  await page.waitForURL(/checkout\/success/, { timeout: 30000 });
}

/**
 * Cancel a test payment
 */
export async function cancelTestPayment(page: Page): Promise<void> {
  // Click cancel button on Stripe checkout
  await page.getByRole('button', { name: /Cancel/i }).click();

  // Wait for redirect to cancel page
  await page.waitForURL(/checkout\/cancel/, { timeout: 30000 });
}

/**
 * Get test subscription details
 */
export async function getTestSubscription(
  request: APIRequestContext,
  baseURL: string,
  subscriptionId: string
): Promise<TestSubscription> {
  // Note: This would require a subscription API endpoint
  // For now, this is a placeholder
  return {
    id: subscriptionId,
    status: 'trial',
    planType: 'solo',
    trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Wait for Stripe checkout to load
 */
export async function waitForStripeCheckout(page: Page): Promise<void> {
  await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 10000 });
}

/**
 * Verify Stripe checkout is loaded
 */
export async function isStripeCheckoutLoaded(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get Stripe test card by error type
 */
export function getStripeTestCard(errorType: 'success' | 'decline' | 'insufficient' | 'expired' | 'cvc_fail'): string {
  switch (errorType) {
    case 'success':
      return STRIPE_TEST_CARDS.success;
    case 'decline':
      return STRIPE_TEST_CARDS.decline;
    case 'insufficient':
      return STRIPE_TEST_CARDS.insufficientFunds;
    case 'expired':
      return STRIPE_TEST_CARDS.expired;
    case 'cvc_fail':
      return STRIPE_TEST_CARDS.cvcFail;
    default:
      return STRIPE_TEST_CARDS.success;
  }
}

/**
 * Mock the checkout API to return a test Stripe session URL
 */
export async function mockCheckoutApi(
  page: import('@playwright/test').Page,
  options: {
    sessionId?: string;
    shouldFail?: boolean;
    errorType?: string;
  } = {}
): Promise<void> {
  const { sessionId = 'test_cs_mock_123', shouldFail = false, errorType = 'generic' } = options;

  await page.route('/api/checkout', async (route) => {
    if (shouldFail) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Checkout failed',
          errorType,
          declineCode: '',
        }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: `https://checkout.stripe.com/pay/${sessionId}`,
          sessionId,
        }),
      });
    }
  });
}

/**
 * Mock checkout success page context
 * Simulates arriving at /checkout/success after Stripe redirects back
 */
export async function navigateToCheckoutSuccess(
  page: import('@playwright/test').Page,
  sessionId: string = 'test_cs_success_123'
): Promise<void> {
  await page.goto(`/checkout/success?session_id=${sessionId}`);
}

/**
 * Mock checkout cancel — simulates user cancelling on Stripe
 */
export async function navigateToCheckoutCancel(
  page: import('@playwright/test').Page
): Promise<void> {
  await page.goto('/checkout/cancel');
}

/**
 * Mock checkout error — simulates Stripe error redirect
 */
export async function navigateToCheckoutError(
  page: import('@playwright/test').Page,
  errorType: string = 'generic',
  declineCode: string = ''
): Promise<void> {
  await page.goto(`/checkout/error?error_type=${errorType}&decline_code=${declineCode}`);
}
