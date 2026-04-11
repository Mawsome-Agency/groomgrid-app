import { test, expect } from '@playwright/test';
import { paymentSelectors } from '../tests/helpers/selectors';
import { STRIPE_TEST_CARDS } from '../tests/helpers/stripe';

/**
 * Payment flow tests
 *
 * Covers:
 * - Checkout success page (after Stripe redirect)
 * - Checkout cancel page
 * - Checkout error page
 * - Retry flow from error
 * - Success to onboarding transition
 */

test.describe('Checkout Success Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock session for authenticated state
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'test-user-123',
            email: 'test@example.com',
            name: 'Test Business',
          },
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });
  });

  test('renders success page with all elements', async ({ page }) => {
    await page.goto('/checkout/success?session_id=test_session_123');

    await expect(page.locator(paymentSelectors.successHeading)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(paymentSelectors.successMessage)).toBeVisible();
  });

  test('success page shows billing summary', async ({ page }) => {
    await page.goto('/checkout/success?session_id=test_session_123');

    await expect(page.locator(paymentSelectors.billingSummary)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(paymentSelectors.trialInfo)).toBeVisible();
  });

  test('success page shows onboarding CTA button', async ({ page }) => {
    await page.goto('/checkout/success?session_id=test_session_123');

    await expect(page.locator(paymentSelectors.onboardingButton)).toBeVisible({ timeout: 10000 });
  });

  test('onboarding button navigates to onboarding flow', async ({ page }) => {
    await page.goto('/checkout/success?session_id=test_session_123');

    const onboardingBtn = page.locator(paymentSelectors.onboardingButton);
    await expect(onboardingBtn).toBeVisible({ timeout: 10000 });
    await onboardingBtn.click();

    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10000 });
  });

  test('shows trust signals on success page', async ({ page }) => {
    await page.goto('/checkout/success?session_id=test_session_123');

    await expect(page.locator(paymentSelectors.securePayment).first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Checkout Cancel Page', () => {
  test('renders cancel page with return to plans option', async ({ page }) => {
    await page.goto('/checkout/cancel');

    await expect(page.locator(paymentSelectors.cancelHeading)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(paymentSelectors.cancelMessage)).toBeVisible();
    await expect(page.locator(paymentSelectors.returnButton)).toBeVisible();
  });

  test('return to plans button navigates correctly', async ({ page }) => {
    // Mock session
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'test-user-123',
            email: 'test@example.com',
            name: 'Test Business',
          },
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    await page.goto('/checkout/cancel');
    await expect(page.locator(paymentSelectors.returnButton)).toBeVisible({ timeout: 10000 });

    await page.locator(paymentSelectors.returnButton).click();
    await expect(page).toHaveURL(/\/plans/, { timeout: 10000 });
  });
});

test.describe('Checkout Error Page', () => {
  test('renders error page for generic error', async ({ page }) => {
    await page.goto('/checkout/error?error_type=generic');

    await expect(page.locator(paymentSelectors.errorHeading)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(paymentSelectors.tryAgainButton)).toBeVisible();
  });

  test('renders error page for card decline', async ({ page }) => {
    await page.goto('/checkout/error?error_type=card_declined&decline_code=generic_decline');

    await expect(page.locator(paymentSelectors.errorHeading)).toBeVisible({ timeout: 10000 });
  });

  test('try again button returns to plans', async ({ page }) => {
    // Mock session for plans page redirect
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'test-user-123',
            email: 'test@example.com',
            name: 'Test Business',
          },
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    await page.goto('/checkout/error?error_type=generic');
    await expect(page.locator(paymentSelectors.tryAgainButton)).toBeVisible({ timeout: 10000 });

    await page.locator(paymentSelectors.tryAgainButton).click();
    await expect(page).toHaveURL(/\/plans/, { timeout: 10000 });
  });

  test('renders error message about declined payment', async ({ page }) => {
    await page.goto('/checkout/error?error_type=card_declined');

    await expect(page.locator(paymentSelectors.errorHeading)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(paymentSelectors.errorMessage)).toBeVisible();
  });

  test('shows support link on error page', async ({ page }) => {
    await page.goto('/checkout/error?error_type=generic');

    await expect(page.locator(paymentSelectors.supportLink)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Stripe Test Card Constants', () => {
  test('test card constants are correct values', () => {
    expect(STRIPE_TEST_CARDS.success).toBe('4242424242424242');
    expect(STRIPE_TEST_CARDS.decline).toBe('4000000000000002');
    expect(STRIPE_TEST_CARDS.insufficientFunds).toBe('4000000000009995');
    expect(STRIPE_TEST_CARDS.expired).toBe('4000000000000069');
    expect(STRIPE_TEST_CARDS.cvcFail).toBe('4000000000000127');
  });
});
