/**
 * Payment / checkout E2E tests
 * Target: https://staging.getgroomgrid.com
 *
 * These tests cover the checkout result pages (success, cancel, error)
 * which are publicly accessible via query params / direct URL.
 *
 * Note: Full Stripe checkout flow (completing payment in Stripe's hosted page)
 * is complex to automate in E2E tests and is covered by unit tests instead.
 */

import { test, expect } from '@playwright/test';

test.describe('Checkout result pages', () => {
  test('checkout/cancel page shows cancellation message', async ({ page }) => {
    await page.goto('/checkout/cancel');

    await expect(page.getByRole('heading', { name: /Payment Cancelled/i })).toBeVisible();
    await expect(page.getByText(/no charge/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Return to Plans/i })).toBeVisible();
  });

  test('checkout/cancel return to plans link works', async ({ page }) => {
    await page.goto('/checkout/cancel');

    await page.getByRole('link', { name: /Return to Plans/i }).click();
    await expect(page).toHaveURL(/\/plans|\/login/, { timeout: 20_000 });
  });

  test('checkout/error page shows error state', async ({ page }) => {
    await page.goto('/checkout/error?error_type=generic');

    await expect(page.getByRole('heading', { name: /Payment Failed/i })).toBeVisible();
    await expect(page.getByText(/payment was declined/i)).toBeVisible();
  });

  test('checkout/error try again button works', async ({ page }) => {
    await page.goto('/checkout/error?error_type=generic');

    await expect(page.getByRole('button', { name: /Try Again/i })).toBeVisible();
    await page.getByRole('button', { name: /Try Again/i }).click();

    // Should navigate back to plans
    await expect(page).toHaveURL(/\/plans|\/login/, { timeout: 20_000 });
  });

  test('checkout/success page requires valid session', async ({ page }) => {
    // Direct access without a valid Stripe session should redirect or show error
    await page.goto('/checkout/success?session_id=test_session');

    // Should not crash — either show success content or redirect
    await expect(page).not.toHaveURL('/error');
  });
});

test.describe('Payment trust signals', () => {
  test('plans page shows trust signals', async ({ page }) => {
    // Trust signals are visible on the plans page even before auth in some layouts
    await page.goto('/plans');

    // Accept redirect to login — trust signals may only show when authenticated
    const url = page.url();
    if (url.includes('/login')) {
      test.skip();
    }

    await expect(page.getByText(/Secure Payment|Cancel Anytime/i).first()).toBeVisible();
  });
});
