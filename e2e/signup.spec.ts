import { test, expect } from '@playwright/test';
import { signupSelectors } from '../tests/helpers/selectors';
import { generateTestEmail } from '../tests/helpers/auth';

/**
 * Signup page tests
 *
 * Covers:
 * - Page load and rendering
 * - Form validation (empty fields, invalid email, weak password)
 * - Duplicate email handling
 * - Successful signup flow
 * - Loading states
 * - Network errors
 */

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);
  });

  test('renders signup form with all required elements', async ({ page }) => {
    await expect(page.locator(signupSelectors.signupHeading)).toBeVisible();
    await expect(page.locator(signupSelectors.subheading)).toBeVisible();
    await expect(page.locator(signupSelectors.businessNameInput)).toBeVisible();
    await expect(page.locator(signupSelectors.emailInput)).toBeVisible();
    await expect(page.locator(signupSelectors.passwordInput)).toBeVisible();
    await expect(page.locator(signupSelectors.submitButton)).toBeVisible();
    await expect(page.locator(signupSelectors.signInLink)).toBeVisible();
  });

  test('shows browser validation for empty required fields', async ({ page }) => {
    // Submit without filling any fields
    await page.locator(signupSelectors.submitButton).click();

    // Browser native required validation prevents submit
    const businessNameInput = page.locator(signupSelectors.businessNameInput);
    const validationMessage = await businessNameInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('shows error for invalid email format', async ({ page }) => {
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill('not-an-email');
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');

    await page.locator(signupSelectors.submitButton).click();

    // Browser email validation prevents submit with invalid email
    const emailInput = page.locator(signupSelectors.emailInput);
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('enforces minimum password length of 8 characters', async ({ page }) => {
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('short');

    await page.locator(signupSelectors.submitButton).click();

    // Browser minLength validation
    const passwordInput = page.locator(signupSelectors.passwordInput);
    const validationMessage = await passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('shows error message for duplicate email', async ({ page }) => {
    // Mock API response for duplicate email
    await page.route('/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email already in use' }),
      });
    });

    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill('existing@example.com');
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    const errorEl = page.locator(signupSelectors.errorMessage);
    await expect(errorEl).toBeVisible({ timeout: 5000 });
    await expect(errorEl).toContainText('already exists');
  });

  test('shows generic error on API failure', async ({ page }) => {
    await page.route('/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to create account' }),
      });
    });

    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    const errorEl = page.locator(signupSelectors.errorMessage);
    await expect(errorEl).toBeVisible({ timeout: 5000 });
  });

  test('shows loading state during form submission', async ({ page }) => {
    // Intercept signup to keep it pending
    await page.route('/api/auth/signup', async (route) => {
      // Delay response to observe loading state
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, userId: 'test-user-id' }),
      });
    });

    // Also intercept signIn call
    await page.route('/api/auth/callback/credentials', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, error: null }),
      });
    });

    await page.locator(signupSelectors.businessNameInput).fill('Loading Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    // Loading button should appear
    await expect(page.locator(signupSelectors.loadingButton)).toBeVisible({ timeout: 2000 });
  });

  test('handles network error gracefully', async ({ page }) => {
    await page.route('/api/auth/signup', async (route) => {
      await route.abort('failed');
    });

    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    const errorEl = page.locator(signupSelectors.errorMessage);
    await expect(errorEl).toBeVisible({ timeout: 5000 });
  });

  test('sign in link navigates to login page', async ({ page }) => {
    await page.locator(signupSelectors.signInLink).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('logo link navigates to home page', async ({ page }) => {
    await page.locator(signupSelectors.logoLink).click();
    await expect(page).toHaveURL('/');
  });

  test('submit button is disabled during loading', async ({ page }) => {
    // Intercept to delay response
    await page.route('/api/auth/signup', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.abort('failed');
    });

    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    // Button should be disabled during submission
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled({ timeout: 2000 });
  });

  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/signup');
    await expect(page.locator(signupSelectors.signupHeading)).toBeVisible();
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
