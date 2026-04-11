import { test, expect } from '@playwright/test';

test.describe('Full Signup to Dashboard Journey', () => {
  test('complete happy path', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Step 2: Click CTA to go to signup
    const ctaButton = page.getByRole('link', { name: /Start Free Trial/i }).first();
    await ctaButton.click();
    await expect(page).toHaveURL('/signup');

    // Step 3: Fill out signup form
    const timestamp = Date.now();
    const businessName = `Test Business ${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'TestPassword123!';

    await page.getByLabel(/Business Name/i).fill(businessName);
    await page.getByLabel(/Email Address/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);

    // Step 4: Submit signup form
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Step 5: Verify welcome page
    await expect(page).toHaveURL('/welcome', { timeout: 30000 });
    await expect(page.getByRole('heading', { name: /Welcome to GroomGrid/i })).toBeVisible();
    await expect(page.getByText(new RegExp(businessName, 'i'))).toBeVisible();

    // Step 6: Click continue to plans
    const continueButton = page.getByRole('button', { name: /Choose Your Plan/i });
    await continueButton.click();

    // Step 7: Verify plans page
    await expect(page).toHaveURL('/plans');
    await expect(page.getByRole('heading', { name: /Choose Your Plan/i })).toBeVisible();

    // Note: The following steps require authentication and Stripe test mode
    // They are commented out for now but would be part of the full test

    // Step 8: Select a plan (would trigger Stripe checkout)
    // const soloPlan = page.getByText(/Solo/i);
    // await soloPlan.click();

    // Step 9: Complete Stripe checkout (test mode)
    // await page.waitForURL(/stripe/i);

    // Step 10: Verify checkout success page
    // await expect(page).toHaveURL(/checkout\/success/);
    // await expect(page.getByRole('heading', { name: /You're in/i })).toBeVisible();

    // Step 11: Navigate to onboarding
    // await page.getByRole('button', { name: /Set Up Your Account/i }).click();
    // await expect(page).toHaveURL('/onboarding');

    // Step 12: Complete onboarding steps
    // Step 12a: Add client
    // await page.getByLabel(/Client Name/i).fill('Test Client');
    // await page.getByLabel(/Pet Name/i).fill('Test Pet');
    // await page.getByRole('button', { name: /Next/i }).click();

    // Step 12b: Book appointment
    // await page.getByRole('button', { name: /Next/i }).click();

    // Step 12c: Set business hours
    // await page.getByRole('button', { name: /Next/i }).click();

    // Step 13: Verify completion screen
    // await expect(page.getByText(/You're all set/i)).toBeVisible();

    // Step 14: Navigate to dashboard
    // await page.getByRole('button', { name: /Go to Dashboard/i }).click();
    // await expect(page).toHaveURL('/dashboard');

    // Step 15: Verify dashboard
    // await expect(page.getByText(/Today's Appointments/i)).toBeVisible();
    // await expect(page.getByText(/Free Trial Active/i)).toBeVisible();
  });

  test('with onboarding skip', async ({ page }) => {
    // This test verifies the journey when user skips onboarding

    // Navigate to onboarding page
    await page.goto('/onboarding');

    // Check for skip option
    const skipLink = page.getByRole('button', { name: /Skip this tutorial/i });
    await expect(skipLink).toBeVisible();

    // Note: Actually clicking skip would require authentication
    // This test just verifies the skip option is available
  });

  test('with payment retry', async ({ page }) => {
    // This test verifies the journey when payment fails and user retries

    // Navigate to checkout error page
    await page.goto('/checkout/error?error_type=declined');

    // Check error page is displayed
    await expect(page.getByRole('heading', { name: /Payment Failed/i })).toBeVisible();

    // Check for try again button
    const tryAgainButton = page.getByRole('button', { name: /Try Again/i });
    await expect(tryAgainButton).toBeVisible();

    // Note: Actually clicking try again would require authentication
    // This test just verifies the retry option is available
  });

  test('landing page to signup flow', async ({ page }) => {
    // Test the initial part of the journey
    await page.goto('/');

    // Click CTA
    const ctaButton = page.getByRole('link', { name: /Start Free Trial/i }).first();
    await ctaButton.click();

    // Verify signup page
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: /Create Account/i })).toBeVisible();
  });

  test('signup to welcome flow', async ({ page }) => {
    // Test signup to welcome transition
    const timestamp = Date.now();
    const businessName = `Test Business ${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'TestPassword123!';

    await page.goto('/signup');

    // Fill form
    await page.getByLabel(/Business Name/i).fill(businessName);
    await page.getByLabel(/Email Address/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);

    // Submit
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Verify welcome page
    await expect(page).toHaveURL('/welcome', { timeout: 30000 });
    await expect(page.getByRole('heading', { name: /Welcome to GroomGrid/i })).toBeVisible();
  });

  test('welcome to plans flow', async ({ page }) => {
    // Test welcome to plans transition
    await page.goto('/welcome');

    // Click continue
    const continueButton = page.getByRole('button', { name: /Choose Your Plan/i });
    await continueButton.click();

    // Verify plans page
    await expect(page).toHaveURL('/plans');
    await expect(page.getByRole('heading', { name: /Choose Your Plan/i })).toBeVisible();
  });

  test('plans to checkout flow', async ({ page }) => {
    // Test plans to checkout transition
    await page.goto('/plans');

    // Check that plan cards are visible
    await expect(page.getByText(/Solo/i)).toBeVisible();
    await expect(page.getByText(/Salon/i)).toBeVisible();
    await expect(page.getByText(/Enterprise/i)).toBeVisible();

    // Note: Actually selecting a plan would trigger Stripe checkout
    // This test just verifies the plan selection UI is available
  });

  test('checkout success to onboarding flow', async ({ page }) => {
    // Test checkout success to onboarding transition
    await page.goto('/checkout/success?session_id=test_session_id');

    // Verify success page
    await expect(page.getByRole('heading', { name: /You're in/i })).toBeVisible();

    // Click continue to onboarding
    const onboardingButton = page.getByRole('button', { name: /Set Up Your Account/i });
    await onboardingButton.click();

    // Verify onboarding page
    await expect(page).toHaveURL('/onboarding');
  });

  test('onboarding to dashboard flow', async ({ page }) => {
    // Test onboarding to dashboard transition
    await page.goto('/onboarding');

    // Check for completion screen elements
    // Note: Completion screen requires completing all steps
    const dashboardButton = page.getByRole('button', { name: /Go to Dashboard/i });
    await expect(dashboardButton).toBeVisible();

    // Note: Actually clicking would require completing onboarding
    // This test just verifies the dashboard button is available
  });
});
