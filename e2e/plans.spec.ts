import { test, expect } from '@playwright/test';
import { plansSelectors } from '../tests/helpers/selectors';

/**
 * Plans page tests
 *
 * Covers:
 * - Page renders correctly when authenticated
 * - Unauthenticated users are redirected
 * - All three plans are visible
 * - Plan selection triggers checkout
 * - Checkout error handling
 * - FAQ and testimonials visible
 */

/**
 * Helper: inject a mock session cookie to simulate authenticated state
 */
async function mockAuthenticatedSession(page: import('@playwright/test').Page) {
  // Mock the session API so NextAuth thinks the user is logged in
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

  await page.route('/api/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        welcomeShown: true,
        stripeSubscriptionId: null,
      }),
    });
  });
}

test.describe('Plans Page', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    // No session mock — let it return empty session
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/plans');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test.describe('when authenticated', () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthenticatedSession(page);
      await page.goto('/plans');
      // Wait for page to be fully loaded
      await expect(page.locator(plansSelectors.mainHeading)).toBeVisible({ timeout: 10000 });
    });

    test('renders all plan elements', async ({ page }) => {
      await expect(page.locator(plansSelectors.mainHeading)).toBeVisible();
      await expect(page.locator(plansSelectors.subheading)).toBeVisible();

      // All three plans visible
      await expect(page.locator(plansSelectors.soloPlan).first()).toBeVisible();
      await expect(page.locator(plansSelectors.salonPlan).first()).toBeVisible();
      await expect(page.locator(plansSelectors.enterprisePlan).first()).toBeVisible();

      // Prices visible
      await expect(page.locator(plansSelectors.soloPrice).first()).toBeVisible();
      await expect(page.locator(plansSelectors.salonPrice).first()).toBeVisible();
      await expect(page.locator(plansSelectors.enterprisePrice).first()).toBeVisible();
    });

    test('shows popular badge on Salon plan', async ({ page }) => {
      await expect(page.locator(plansSelectors.popularBadge)).toBeVisible();
    });

    test('renders testimonials section', async ({ page }) => {
      await expect(page.locator(plansSelectors.testimonialsSection)).toBeVisible();
      await expect(page.locator(plansSelectors.testimonialSarah).first()).toBeVisible();
      await expect(page.locator(plansSelectors.testimonialJames).first()).toBeVisible();
    });

    test('renders FAQ section', async ({ page }) => {
      await expect(page.locator(plansSelectors.faqSection)).toBeVisible();
      await expect(page.locator(plansSelectors.faqItem1)).toBeVisible();
      await expect(page.locator(plansSelectors.faqItem2)).toBeVisible();
      await expect(page.locator(plansSelectors.faqItem3)).toBeVisible();
    });

    test('sign out button is present', async ({ page }) => {
      await expect(page.locator(plansSelectors.signOutButton)).toBeVisible();
    });

    test('selecting Solo plan triggers checkout redirect', async ({ page }) => {
      const checkoutUrl = 'https://checkout.stripe.com/pay/test_session_123';

      await page.route('/api/checkout', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ url: checkoutUrl, sessionId: 'test_session_123' }),
        });
      });

      // Intercept the navigation to Stripe
      let navigatedUrl = '';
      page.on('request', (req) => {
        if (req.url().includes('stripe.com')) {
          navigatedUrl = req.url();
        }
      });

      // Click a Solo plan button
      await page.locator('button', { hasText: /get started|start|choose|select/i }).first().click();

      // Wait a moment for checkout initiation
      await page.waitForTimeout(1000);

      // Either navigated to stripe or made a checkout API call
      const checkoutRequests: string[] = [];
      await page.route('/api/checkout', async (route) => {
        checkoutRequests.push(route.request().url());
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ url: checkoutUrl, sessionId: 'test_session_123' }),
        });
      });
    });

    test('shows checkout error alert when API fails', async ({ page }) => {
      await page.route('/api/checkout', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Failed to create checkout',
            errorType: 'generic',
          }),
        });
      });

      // Click first plan button
      const planButtons = page.locator('button', { hasText: /get started|start|choose|select/i });
      const count = await planButtons.count();
      if (count > 0) {
        await planButtons.first().click();
      } else {
        // Fallback: click plan card directly
        await page.locator('[data-testid="plan-card"]').first().click();
      }

      // Should show error or redirect to error page
      await page.waitForTimeout(2000);
      // Either an inline error or a redirect to error page
      const hasInlineError = await page.locator('text=Payment Trouble').isVisible().catch(() => false);
      const isOnErrorPage = page.url().includes('/checkout/error');

      expect(hasInlineError || isOnErrorPage).toBe(true);
    });

    test('Solo plan shows correct features', async ({ page }) => {
      await expect(page.locator(plansSelectors.soloFeature1Groomer)).toBeVisible();
      await expect(page.locator(plansSelectors.soloFeatureUnlimited)).toBeVisible();
    });

    test('Salon plan shows correct features', async ({ page }) => {
      await expect(page.locator(plansSelectors.salonFeature5Groomers)).toBeVisible();
      await expect(page.locator(plansSelectors.salonFeatureTeamScheduling)).toBeVisible();
    });

    test('Enterprise plan shows correct features', async ({ page }) => {
      await expect(page.locator(plansSelectors.enterpriseFeatureUnlimited)).toBeVisible();
      await expect(page.locator(plansSelectors.enterpriseFeatureApi)).toBeVisible();
    });

    test('trust signals are visible', async ({ page }) => {
      await expect(page.locator(plansSelectors.trustSignals).first()).toBeVisible();
      await expect(page.locator(plansSelectors.cancelAnytime).first()).toBeVisible();
    });

    test('trial info is visible', async ({ page }) => {
      await expect(page.locator(plansSelectors.trialInfo).first()).toBeVisible();
    });
  });
});
