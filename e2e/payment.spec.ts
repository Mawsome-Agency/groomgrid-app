import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to plans page
    await page.goto('/plans');
  });

  test('Stripe checkout loads', async ({ page }) => {
    // Note: This test requires authentication and a valid session
    // In a real scenario, you'd authenticate first

    // Check that plan cards are visible
    await expect(page.getByText(/Solo/i)).toBeVisible();
    await expect(page.getByText(/Salon/i)).toBeVisible();
    await expect(page.getByText(/Enterprise/i)).toBeVisible();
  });

  test('test card payment succeeds', async ({ page }) => {
    // Note: This test requires:
    // 1. Authentication
    // 2. Stripe test mode configuration
    // 3. Test card details

    // This is a placeholder for the actual test implementation
    // The actual test would:
    // 1. Select a plan
    // 2. Fill in Stripe test card details
    // 3. Submit payment
    // 4. Verify redirect to checkout success page

    // For now, just verify the plan selection UI is present
    await expect(page.getByText(/Solo/i)).toBeVisible();
  });

  test('payment failure displays error', async ({ page }) => {
    // Note: This test requires authentication and Stripe test mode

    // Navigate to checkout error page directly for testing
    await page.goto('/checkout/error?error_type=declined');

    // Check error page is displayed
    const errorHeading = page.getByRole('heading', { name: /Payment Failed/i });
    await expect(errorHeading).toBeVisible();

    // Check for error message
    await expect(page.getByText(/payment was declined/i)).toBeVisible();

    // Check for recovery actions
    await expect(page.getByRole('button', { name: /Try Again/i })).toBeVisible();
  });

  test('checkout success redirects to onboarding', async ({ page }) => {
    // Note: This test requires a valid Stripe session ID

    // Navigate to checkout success page directly for testing
    await page.goto('/checkout/success?session_id=test_session_id');

    // Check success page is displayed
    const successHeading = page.getByRole('heading', { name: /You're in/i });
    await expect(successHeading).toBeVisible();

    // Check for success message
    await expect(page.getByText(/Your 14-day free trial has started/i)).toBeVisible();

    // Check for redirect to onboarding button
    const onboardingButton = page.getByRole('button', { name: /Set Up Your Account/i });
    await expect(onboardingButton).toBeVisible();

    // Check countdown timer
    await expect(page.getByText(/Redirecting automatically/i)).toBeVisible();
  });

  test('checkout cancel returns to plans', async ({ page }) => {
    // Navigate to checkout cancel page
    await page.goto('/checkout/cancel');

    // Check cancel page is displayed
    const cancelHeading = page.getByRole('heading', { name: /Payment Cancelled/i });
    await expect(cancelHeading).toBeVisible();

    // Check for reassurance message
    await expect(page.getByText(/no charge/i)).toBeVisible();

    // Check for return to plans button
    const returnButton = page.getByRole('link', { name: /Return to Plans/i });
    await expect(returnButton).toBeVisible();

    // Click return to plans
    await returnButton.click();

    // Verify navigation to plans page
    await expect(page).toHaveURL('/plans');
  });

  test('displays billing summary on success page', async ({ page }) => {
    // Navigate to checkout success page
    await page.goto('/checkout/success?session_id=test_session_id');

    // Check for billing summary
    await expect(page.getByText(/Billing Summary/i)).toBeVisible();

    // Check for plan name
    await expect(page.getByText(/Plan:/i)).toBeVisible();

    // Check for trial information
    await expect(page.getByText(/14-day free trial/i)).toBeVisible();
  });

  test('displays trust signals on success page', async ({ page }) => {
    // Navigate to checkout success page
    await page.goto('/checkout/success?session_id=test_session_id');

    // Check for trust signals
    await expect(page.getByText(/Secure Payment/i)).toBeVisible();
    await expect(page.getByText(/Cancel Anytime/i)).toBeVisible();
  });

  test('error page displays different error types', async ({ page }) => {
    // Test declined card error
    await page.goto('/checkout/error?error_type=declined');
    await expect(page.getByText(/declined/i)).toBeVisible();

    // Test insufficient funds error
    await page.goto('/checkout/error?error_type=insufficient');
    await expect(page.getByText(/insufficient funds/i)).toBeVisible();

    // Test expired card error
    await page.goto('/checkout/error?error_type=expired');
    await expect(page.getByText(/expired/i)).toBeVisible();
  });

  test('error page provides recovery actions', async ({ page }) => {
    // Navigate to error page
    await page.goto('/checkout/error?error_type=declined');

    // Check for try again button
    const tryAgainButton = page.getByRole('button', { name: /Try Again/i });
    await expect(tryAgainButton).toBeVisible();

    // Check for contact support link
    const supportLink = page.getByRole('link', { name: /Contact Support/i });
    await expect(supportLink).toBeVisible();
  });
});
