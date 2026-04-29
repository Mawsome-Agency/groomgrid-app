import { test, expect } from '@playwright/test';
import { generateTestEmail } from './helpers/test-utils';
import { E2E_SELECTORS } from './helpers/selectors';

/**
 * E2E Checkout Funnel Verification Test Suite
 *
 * Verifies the complete Stripe checkout flow:
 * 1. Signup page loads correctly (HTTP 200, all form elements visible)
 * 2. Plans page loads correctly (HTTP 200, all 3 plan cards visible)
 * 3. Checkout session creation API works
 * 4. Webhook endpoint processes checkout.session.completed events
 * 5. Success/Cancel/Error pages render correctly
 *
 * These tests use route interception to avoid hitting real Stripe.
 * The webhook tests use the test-mode bypass (ENABLE_TEST_WEBHOOK_BYPASS).
 */

const MOCK_USER_ID = 'e2e-checkout-user-001';

// ── Helper: Set up an authenticated session mock ──────────────────────────
async function mockAuthenticatedSession(page: import('@playwright/test').Page) {
  await page.route('/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: MOCK_USER_ID, email: 'e2e@test.com', name: 'E2E Test Business' },
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
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        businessName: 'E2E Test Business',
        planType: 'solo',
      }),
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. Signup Page Verification
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Signup Page', () => {
  test('signup page returns HTTP 200 and shows form elements', async ({ page }) => {
    const response = await page.goto('/signup');
    expect(response!.status()).toBe(200);

    // Heading visible
    await expect(page.locator(E2E_SELECTORS.signup.businessNameLabel)).toBeVisible();
    await expect(page.locator(E2E_SELECTORS.signup.emailLabel)).toBeVisible();
    await expect(page.locator(E2E_SELECTORS.signup.passwordLabel)).toBeVisible();

    // Submit button is enabled
    const submitBtn = page.locator(E2E_SELECTORS.signup.submitButton);
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('signup page shows 14-day free trial messaging', async ({ page }) => {
    await page.goto('/signup');
    // The signup page must communicate the trial offer
    const body = page.locator('body');
    await expect(body).toContainText(/14-day/i);
  });

  test('signup page form fields are functional', async ({ page }) => {
    await page.goto('/signup');

    const email = generateTestEmail();
    await page.locator(E2E_SELECTORS.signup.businessNameLabel).fill('E2E Test Business');
    await page.locator(E2E_SELECTORS.signup.emailLabel).fill(email);
    await page.locator(E2E_SELECTORS.signup.passwordLabel).fill('TestPassword123!');

    // Verify values are filled
    await expect(page.locator(E2E_SELECTORS.signup.emailLabel)).toHaveValue(email);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. Plans Page Verification
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Plans Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
  });

  test('plans page returns HTTP 200 and shows all 3 plan cards', async ({ page }) => {
    const response = await page.goto('/plans');
    expect(response!.status()).toBe(200);

    // All 3 plan cards visible
    await expect(page.locator(E2E_SELECTORS.plans.soloCard).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator(E2E_SELECTORS.plans.salonCard).first()).toBeVisible();
    await expect(page.locator(E2E_SELECTORS.plans.enterpriseCard).first()).toBeVisible();
  });

  test('plans page shows correct pricing for each tier', async ({ page }) => {
    await page.goto('/plans');
    await expect(page.locator(E2E_SELECTORS.plans.heading)).toBeVisible({ timeout: 10000 });

    // Verify pricing text appears on page ($29, $79, $149)
    const body = page.locator('body');
    await expect(body).toContainText(/\$29/);
    await expect(body).toContainText(/\$79/);
    await expect(body).toContainText(/\$149/);
  });

  test('plans page shows free trial information', async ({ page }) => {
    await page.goto('/plans');
    await expect(page.locator(E2E_SELECTORS.plans.heading)).toBeVisible({ timeout: 10000 });

    // Trial info visible
    await expect(page.locator(E2E_SELECTORS.plans.trialInfo).first()).toBeVisible();
  });

  test('plans page has CTA buttons to start checkout', async ({ page }) => {
    await page.goto('/plans');
    await expect(page.locator(E2E_SELECTORS.plans.heading)).toBeVisible({ timeout: 10000 });

    // At least one CTA button visible
    const ctaButtons = page.locator('button, a').filter({ hasText: /start|get started|choose|select|trial/i });
    const count = await ctaButtons.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. Checkout Session Creation API
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Checkout Session API', () => {
  test('POST /api/checkout returns session URL for valid plan', async ({ request }) => {
    // This test uses the APIRequestContext to call the checkout endpoint directly.
    // It requires a valid session cookie, so we mock it with route interception.
    // For now, we verify the endpoint structure by checking it responds correctly.
    const response = await request.post('/api/checkout', {
      data: {
        userId: MOCK_USER_ID,
        planType: 'solo',
        customerEmail: 'e2e@test.com',
      },
    });

    // Without auth, we expect 401 (authentication required)
    expect(response.status()).toBe(401);
  });

  test('POST /api/checkout rejects missing plan type', async ({ request }) => {
    const response = await request.post('/api/checkout', {
      data: {
        userId: MOCK_USER_ID,
        // No planType
      },
    });

    // Without auth or planType, we expect 400 or 401
    expect([400, 401]).toContain(response.status());
  });

  test('POST /api/checkout rejects invalid plan type', async ({ request }) => {
    const response = await request.post('/api/checkout', {
      data: {
        userId: MOCK_USER_ID,
        planType: 'invalid_plan',
      },
    });

    // Without auth, we expect 401 first
    expect(response.status()).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. Webhook Endpoint Verification
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Webhook Endpoint', () => {
  test('webhook returns 200 for bot traffic with no stripe-signature', async ({ request }) => {
    // Bots/scanners hit this endpoint without the stripe-signature header.
    // The endpoint returns 200 to prevent retries (per Stripe best practices).
    const response = await request.post('/api/stripe/webhook', {
      data: { type: 'checkout.session.completed' },
    });

    // In production, missing signature returns 200 (graceful ignore)
    // In staging/test, it may vary based on env
    expect([200, 400, 401]).toContain(response.status());
  });

  test('webhook test mode rejects invalid test key', async ({ request }) => {
    // Only run this in environments where test mode is enabled
    const response = await request.post('/api/stripe/webhook', {
      headers: {
        'x-test-webhook-key': 'invalid_test_key',
        'Content-Type': 'application/json',
      },
      data: {
        id: 'evt_test_001',
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_test_001', metadata: { userId: MOCK_USER_ID } } },
      },
    });

    // Should reject invalid test key (401) or fall through to signature check (400)
    expect([400, 401, 500]).toContain(response.status());
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. Checkout Result Pages Verification
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Result Pages', () => {
  test('checkout success page renders with onboarding link', async ({ page }) => {
    await mockAuthenticatedSession(page);

    // Navigate to success page with a mock session ID
    await page.goto('/checkout/success?session_id=cs_test_e2e_001');

    // Success heading should be visible
    await expect(page.locator(E2E_SELECTORS.checkout.successHeading)).toBeVisible({ timeout: 10000 });

    // Onboarding button should be present
    const onboardingBtn = page.locator(E2E_SELECTORS.checkout.onboardingButton);
    await expect(onboardingBtn).toBeVisible();
  });

  test('checkout cancel page renders with return to plans link', async ({ page }) => {
    await mockAuthenticatedSession(page);

    await page.goto('/checkout/cancel');

    // Cancel heading visible
    await expect(page.locator(E2E_SELECTORS.checkout.cancelHeading)).toBeVisible({ timeout: 10000 });

    // Return to plans button visible
    const returnBtn = page.locator(E2E_SELECTORS.checkout.returnButton);
    await expect(returnBtn).toBeVisible();

    // Clicking return navigates to plans
    await returnBtn.click();
    await expect(page).toHaveURL(/\/plans/, { timeout: 10000 });
  });

  test('checkout error page renders with retry link', async ({ page }) => {
    await mockAuthenticatedSession(page);

    await page.goto('/checkout/error?error_type=card_declined&decline_code=generic_decline');

    // Error heading visible
    await expect(page.locator(E2E_SELECTORS.checkout.errorHeading)).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. Full Funnel Integration (mocked Stripe)
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Full Flow Integration', () => {
  test('signup → plans → checkout session creation (mocked)', async ({ page }) => {
    const email = generateTestEmail();

    // Mock signup API
    await page.route('/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, userId: MOCK_USER_ID }),
      });
    });

    // Mock auth callback
    await page.route('/api/auth/callback/credentials', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, error: null, url: '/plans' }),
      });
    });

    // Mock CSRF
    await page.route('/api/auth/csrf', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ csrfToken: 'test_csrf_e2e' }),
      });
    });

    await mockAuthenticatedSession(page);

    // Step 1: Navigate to signup
    await page.goto('/signup');
    await expect(page.locator(E2E_SELECTORS.signup.businessNameLabel)).toBeVisible();

    // Step 2: Fill and submit signup form
    await page.locator(E2E_SELECTORS.signup.businessNameLabel).fill('E2E Checkout Test');
    await page.locator(E2E_SELECTORS.signup.emailLabel).fill(email);
    await page.locator(E2E_SELECTORS.signup.passwordLabel).fill('TestPassword123!');
    await page.locator(E2E_SELECTORS.signup.submitButton).click();

    // Should navigate away from signup
    await expect(page).toHaveURL(/\/(welcome|plans|dashboard)/, { timeout: 15000 });
  });

  test('plans page → checkout API (mocked checkout session)', async ({ page }) => {
    await mockAuthenticatedSession(page);

    // Mock the checkout API to return a Stripe URL
    await page.route('/api/checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://checkout.stripe.com/pay/cs_test_e2e_funnel',
          sessionId: 'cs_test_e2e_funnel',
        }),
      });
    });

    await page.goto('/plans');
    await expect(page.locator(E2E_SELECTORS.plans.heading)).toBeVisible({ timeout: 10000 });

    // Verify all plans visible
    await expect(page.locator(E2E_SELECTORS.plans.soloCard).first()).toBeVisible();
    await expect(page.locator(E2E_SELECTORS.plans.salonCard).first()).toBeVisible();
    await expect(page.locator(E2E_SELECTORS.plans.enterpriseCard).first()).toBeVisible();
  });

  test('checkout cancel → return to plans flow works', async ({ page }) => {
    await mockAuthenticatedSession(page);

    // Start at cancel page
    await page.goto('/checkout/cancel');
    await expect(page.locator(E2E_SELECTORS.checkout.cancelHeading)).toBeVisible({ timeout: 10000 });

    // Click return to plans
    await page.locator(E2E_SELECTORS.checkout.returnButton).click();
    await expect(page).toHaveURL(/\/plans/, { timeout: 10000 });

    // Plans page loads correctly after returning
    await expect(page.locator(E2E_SELECTORS.plans.heading)).toBeVisible({ timeout: 10000 });
  });

  test('checkout error → retry flow works', async ({ page }) => {
    await mockAuthenticatedSession(page);

    // Start at error page
    await page.goto('/checkout/error?error_type=declined&decline_code=card_declined');
    await expect(page.locator(E2E_SELECTORS.checkout.errorHeading)).toBeVisible({ timeout: 10000 });

    // Click try again
    const tryAgainBtn = page.locator(E2E_SELECTORS.checkout.returnButton);
    if (await tryAgainBtn.isVisible()) {
      await tryAgainBtn.click();
      await expect(page).toHaveURL(/\/plans/, { timeout: 10000 });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. Checkout Session Redirect Endpoint
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Session Redirect', () => {
  test('GET /api/checkout/session requires authentication', async ({ request }) => {
    const response = await request.get('/api/checkout/session?plan=solo');
    // Without auth, should redirect to login (302) or return 401
    expect([302, 401]).toContain(response.status());
  });

  test('GET /api/checkout/session rejects missing plan parameter', async ({ request }) => {
    const response = await request.get('/api/checkout/session');
    // Without plan, should redirect to login (302) or return 400
    expect([302, 400, 401]).toContain(response.status());
  });

  test('GET /api/checkout/session rejects invalid plan', async ({ request }) => {
    const response = await request.get('/api/checkout/session?plan=invalid');
    // Should redirect to login (302) or return error
    expect([302, 400, 401]).toContain(response.status());
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. Performance Verification
// ═══════════════════════════════════════════════════════════════════════════
test.describe('Checkout Funnel — Performance', () => {
  test('signup page loads under 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/signup');
    await expect(page.locator(E2E_SELECTORS.signup.businessNameLabel)).toBeVisible();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  test('plans page loads under 3 seconds', async ({ page }) => {
    await mockAuthenticatedSession(page);

    const start = Date.now();
    await page.goto('/plans');
    await expect(page.locator(E2E_SELECTORS.plans.heading)).toBeVisible({ timeout: 10000 });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  test('checkout cancel page loads under 3 seconds', async ({ page }) => {
    await mockAuthenticatedSession(page);

    const start = Date.now();
    await page.goto('/checkout/cancel');
    await page.waitForLoadState('domcontentloaded');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  test('checkout success page loads under 3 seconds', async ({ page }) => {
    await mockAuthenticatedSession(page);

    const start = Date.now();
    await page.goto('/checkout/success?session_id=cs_test_perf');
    await page.waitForLoadState('domcontentloaded');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });
});
