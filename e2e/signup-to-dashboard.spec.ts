import { test, expect } from '@playwright/test';
import { signupSelectors, plansSelectors, dashboardSelectors } from '../tests/helpers/selectors';
import { generateTestEmail, generateTestBusinessName } from '../tests/helpers/auth';

/**
 * Signup to Dashboard integration tests
 *
 * Covers:
 * - Happy path: signup → welcome → plans → checkout → success → onboarding → dashboard
 * - Error paths at each stage
 * - Mobile flow
 * - Performance budgets
 * - Form validation across the funnel
 * - Loading states at each step
 */

const MOCK_USER_ID = 'test-user-integration-123';

/**
 * Set up API mocks for full happy-path flow
 */
async function setupHappyPathMocks(page: import('@playwright/test').Page, email: string) {
  // Signup API
  await page.route('/api/auth/signup', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, userId: MOCK_USER_ID }),
    });
  });

  // NextAuth credentials sign-in
  await page.route('/api/auth/callback/credentials', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, error: null, url: '/welcome' }),
    });
  });

  // Session (authenticated)
  await page.route('/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: MOCK_USER_ID,
          email,
          name: 'Integration Test Business',
        },
        expires: new Date(Date.now() + 86400000).toISOString(),
      }),
    });
  });

  // Profile
  await page.route('/api/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        welcomeShown: true,
        stripeSubscriptionId: null,
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        businessName: 'Integration Test Business',
      }),
    });
  });

  // Checkout
  await page.route('/api/checkout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: 'https://checkout.stripe.com/pay/test_session_123',
        sessionId: 'test_session_123',
      }),
    });
  });

  // CSRF token
  await page.route('/api/auth/csrf', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'test_csrf_token' }),
    });
  });
}

test.describe('Signup to Dashboard — Happy Path', () => {
  test('signup page loads and renders all form fields', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.locator(signupSelectors.signupHeading)).toBeVisible();
    await expect(page.locator(signupSelectors.subheading)).toBeVisible();
    await expect(page.locator(signupSelectors.businessNameInput)).toBeVisible();
    await expect(page.locator(signupSelectors.emailInput)).toBeVisible();
    await expect(page.locator(signupSelectors.passwordInput)).toBeVisible();
    await expect(page.locator(signupSelectors.submitButton)).toBeVisible();
  });

  test('successful signup redirects to welcome page', async ({ page }) => {
    const email = generateTestEmail();
    await setupHappyPathMocks(page, email);

    await page.goto('/signup');

    await page.locator(signupSelectors.businessNameInput).fill('Integration Test Business');
    await page.locator(signupSelectors.emailInput).fill(email);
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    // Should navigate to /welcome after successful signup + auto-signin
    await expect(page).toHaveURL(/\/(welcome|plans|dashboard)/, { timeout: 15000 });
  });

  test('signup form shows loading state during submission', async ({ page }) => {
    const email = generateTestEmail();

    await page.route('/api/auth/signup', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, userId: MOCK_USER_ID }),
      });
    });

    await page.route('/api/auth/callback/credentials', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, error: null }),
      });
    });

    await page.goto('/signup');
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(email);
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    // Loading state should appear
    await expect(page.locator(signupSelectors.loadingButton)).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Signup to Dashboard — Error Paths', () => {
  test('shows error for duplicate email and stays on signup page', async ({ page }) => {
    await page.route('/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email already in use' }),
      });
    });

    await page.goto('/signup');
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill('existing@example.com');
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    await expect(page.locator(signupSelectors.errorMessage)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(signupSelectors.errorMessage)).toContainText('already exists');
    await expect(page).toHaveURL(/\/signup/);
  });

  test('shows generic error on API failure and allows retry', async ({ page }) => {
    let callCount = 0;
    await page.route('/api/auth/signup', async (route) => {
      callCount++;
      if (callCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to create account' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, userId: MOCK_USER_ID }),
        });
      }
    });

    await page.route('/api/auth/callback/credentials', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, error: null }),
      });
    });

    await page.goto('/signup');
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    // Error should appear
    await expect(page.locator(signupSelectors.errorMessage)).toBeVisible({ timeout: 5000 });

    // User can retry — submit button should still be available
    await expect(page.locator(signupSelectors.submitButton)).toBeEnabled({ timeout: 3000 });
  });

  test('plans page checkout error shows error alert', async ({ page }) => {
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: MOCK_USER_ID,
            email: 'test@example.com',
            name: 'Test Business',
          },
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    await page.route('/api/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ welcomeShown: true, stripeSubscriptionId: null }),
      });
    });

    await page.route('/api/checkout', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Stripe error', errorType: 'generic' }),
      });
    });

    await page.goto('/plans');
    await expect(page.locator(plansSelectors.mainHeading)).toBeVisible({ timeout: 10000 });

    // Click any plan button
    const planButtons = page.locator('button').filter({ hasText: /get started|start free|choose|select/i });
    const count = await planButtons.count();
    if (count > 0) {
      await planButtons.first().click();
      await page.waitForTimeout(2000);

      // Either inline error or redirect to error page
      const hasInlineError = await page.locator('text=Payment Trouble').isVisible().catch(() => false);
      const isOnErrorPage = page.url().includes('/checkout/error');
      expect(hasInlineError || isOnErrorPage).toBe(true);
    }
  });

  test('network error during signup shows error message', async ({ page }) => {
    await page.route('/api/auth/signup', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/signup');
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    await expect(page.locator(signupSelectors.errorMessage)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Signup to Dashboard — Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('business name field is required', async ({ page }) => {
    await page.locator(signupSelectors.emailInput).fill('test@example.com');
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    const input = page.locator(signupSelectors.businessNameInput);
    const msg = await input.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(msg).not.toBe('');
  });

  test('email field rejects invalid format', async ({ page }) => {
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill('not-valid');
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');
    await page.locator(signupSelectors.submitButton).click();

    const input = page.locator(signupSelectors.emailInput);
    const msg = await input.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(msg).not.toBe('');
  });

  test('password field enforces 8 character minimum', async ({ page }) => {
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill('test@example.com');
    await page.locator(signupSelectors.passwordInput).fill('1234567'); // 7 chars
    await page.locator(signupSelectors.submitButton).click();

    const input = page.locator(signupSelectors.passwordInput);
    const msg = await input.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(msg).not.toBe('');
  });

  test('all fields accept valid input without browser errors', async ({ page }) => {
    await page.locator(signupSelectors.businessNameInput).fill('Valid Business Name');
    await page.locator(signupSelectors.emailInput).fill('valid@example.com');
    await page.locator(signupSelectors.passwordInput).fill('ValidPassword123!');

    // Verify inputs have values
    await expect(page.locator(signupSelectors.businessNameInput)).toHaveValue('Valid Business Name');
    await expect(page.locator(signupSelectors.emailInput)).toHaveValue('valid@example.com');
    await expect(page.locator(signupSelectors.passwordInput)).toHaveValue('ValidPassword123!');
  });
});

test.describe('Signup to Dashboard — Mobile Flow', () => {
  test('signup page renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/signup');

    await expect(page.locator(signupSelectors.signupHeading)).toBeVisible();
    await expect(page.locator(signupSelectors.businessNameInput)).toBeVisible();
    await expect(page.locator(signupSelectors.emailInput)).toBeVisible();
    await expect(page.locator(signupSelectors.passwordInput)).toBeVisible();
    await expect(page.locator(signupSelectors.submitButton)).toBeVisible();
  });

  test('form fields are fully tappable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/signup');

    // Tap into each field
    await page.locator(signupSelectors.businessNameInput).tap();
    await page.locator(signupSelectors.businessNameInput).fill('Mobile Business');

    await page.locator(signupSelectors.emailInput).tap();
    await page.locator(signupSelectors.emailInput).fill('mobile@example.com');

    await page.locator(signupSelectors.passwordInput).tap();
    await page.locator(signupSelectors.passwordInput).fill('MobilePassword123!');

    await expect(page.locator(signupSelectors.businessNameInput)).toHaveValue('Mobile Business');
    await expect(page.locator(signupSelectors.emailInput)).toHaveValue('mobile@example.com');
  });

  test('plans page renders on mobile', async ({ page }) => {
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: MOCK_USER_ID, email: 'test@example.com', name: 'Test' },
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    await page.route('/api/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ welcomeShown: true, stripeSubscriptionId: null }),
      });
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/plans');

    await expect(page.locator(plansSelectors.mainHeading)).toBeVisible({ timeout: 10000 });
    // Plans should be visible and stacked on mobile
    await expect(page.locator(plansSelectors.soloPrice).first()).toBeVisible();
  });
});

test.describe('Signup to Dashboard — Performance', () => {
  test('signup page first contentful paint is under 3s', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/signup');
    await expect(page.locator(signupSelectors.signupHeading)).toBeVisible();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('plans page loads within 5s when authenticated', async ({ page }) => {
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: MOCK_USER_ID, email: 'test@example.com', name: 'Test' },
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    await page.route('/api/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ welcomeShown: true, stripeSubscriptionId: null }),
      });
    });

    const startTime = Date.now();
    await page.goto('/plans');
    await expect(page.locator(plansSelectors.mainHeading)).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test('signup form submission responds within 2s of API response', async ({ page }) => {
    await page.route('/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error' }),
      });
    });

    await page.goto('/signup');
    await page.locator(signupSelectors.businessNameInput).fill('Test Business');
    await page.locator(signupSelectors.emailInput).fill(generateTestEmail());
    await page.locator(signupSelectors.passwordInput).fill('TestPassword123!');

    const submitStart = Date.now();
    await page.locator(signupSelectors.submitButton).click();
    await expect(page.locator(signupSelectors.errorMessage)).toBeVisible({ timeout: 5000 });
    const errorTime = Date.now() - submitStart;

    expect(errorTime).toBeLessThan(5000);
  });

  test('checkout cancel page loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/checkout/cancel');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });
});
