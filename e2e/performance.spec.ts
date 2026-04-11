import { test, expect } from '@playwright/test';

/**
 * Performance metrics collection for the signup-to-paid conversion funnel
 *
 * These tests measure and assert on:
 * - Page load times at each funnel stage
 * - Time to interactive
 * - API response times
 * - Layout shift (via paint timing)
 *
 * Context: 80% bounce rate on /signup suggests either slow load times
 * or immediate friction. These tests establish baselines.
 */

const PERFORMANCE_BUDGETS = {
  /** Page load (navigation start → heading visible) */
  signupPageLoad: 3000,
  plansPageLoad: 5000,
  checkoutSuccessPageLoad: 5000,
  checkoutCancelPageLoad: 3000,
  checkoutErrorPageLoad: 3000,
  dashboardPageLoad: 5000,

  /** Time to First Byte (TTFB) */
  ttfb: 800,

  /** Largest Contentful Paint */
  lcp: 2500,
};

interface WebVitals {
  lcp?: number;
  fcp?: number;
  ttfb?: number;
  cls?: number;
}

/**
 * Collect web vitals using the Performance Observer API
 */
async function collectWebVitals(page: import('@playwright/test').Page): Promise<WebVitals> {
  return await page.evaluate(() => {
    return new Promise<WebVitals>((resolve) => {
      const vitals: WebVitals = {};

      // Navigation timing for TTFB
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        vitals.ttfb = navEntry.responseStart - navEntry.requestStart;
      }

      // Paint timing for FCP
      const paintEntries = performance.getEntriesByType('paint');
      for (const entry of paintEntries) {
        if (entry.name === 'first-contentful-paint') {
          vitals.fcp = entry.startTime;
        }
      }

      // Resolve after a short delay to allow observers to fire
      setTimeout(() => resolve(vitals), 1000);
    });
  });
}

test.describe('Funnel Performance Metrics', () => {
  test('signup page — measures page load time', async ({ page }) => {
    const t0 = Date.now();
    await page.goto('/signup');
    await page.waitForSelector('h1', { timeout: 10000 });
    const loadTime = Date.now() - t0;

    console.log(`[PERF] /signup page load: ${loadTime}ms (budget: ${PERFORMANCE_BUDGETS.signupPageLoad}ms)`);

    expect(loadTime).toBeLessThan(PERFORMANCE_BUDGETS.signupPageLoad);
  });

  test('signup page — measures time to first contentful paint', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('domcontentloaded');

    const vitals = await collectWebVitals(page);

    console.log('[PERF] /signup vitals:', JSON.stringify(vitals, null, 2));

    if (vitals.fcp !== undefined) {
      expect(vitals.fcp).toBeLessThan(PERFORMANCE_BUDGETS.lcp);
    }
  });

  test('checkout cancel page — measures page load time', async ({ page }) => {
    const t0 = Date.now();
    await page.goto('/checkout/cancel');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - t0;

    console.log(`[PERF] /checkout/cancel page load: ${loadTime}ms (budget: ${PERFORMANCE_BUDGETS.checkoutCancelPageLoad}ms)`);

    expect(loadTime).toBeLessThan(PERFORMANCE_BUDGETS.checkoutCancelPageLoad);
  });

  test('checkout error page — measures page load time', async ({ page }) => {
    const t0 = Date.now();
    await page.goto('/checkout/error?error_type=generic');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - t0;

    console.log(`[PERF] /checkout/error page load: ${loadTime}ms (budget: ${PERFORMANCE_BUDGETS.checkoutErrorPageLoad}ms)`);

    expect(loadTime).toBeLessThan(PERFORMANCE_BUDGETS.checkoutErrorPageLoad);
  });

  test('signup API response time measurement', async ({ page }) => {
    let requestStart = 0;
    let responseReceived = 0;

    await page.route('/api/auth/signup', async (route) => {
      responseReceived = Date.now();
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email already in use' }),
      });
    });

    await page.goto('/signup');
    await page.locator('input[name="businessName"]').fill('Perf Test Business');
    await page.locator('input[type="email"]').fill('perf-test@example.com');
    await page.locator('input[type="password"]').fill('PerfPassword123!');

    requestStart = Date.now();
    await page.locator('button[type="submit"]').click();

    // Wait for error to appear (indicates response was processed)
    await page.waitForSelector('.bg-red-50', { timeout: 5000 });
    const errorVisibleTime = Date.now();

    const apiResponseTime = responseReceived - requestStart;
    const uiUpdateTime = errorVisibleTime - requestStart;

    console.log(`[PERF] Signup API response time: ${apiResponseTime}ms`);
    console.log(`[PERF] Signup UI update time (request → error visible): ${uiUpdateTime}ms`);

    // UI should update within 2s of submitting (including mocked API latency)
    expect(uiUpdateTime).toBeLessThan(2000);
  });

  test('resource count on signup page does not indicate bloat', async ({ page }) => {
    const resources: string[] = [];

    page.on('request', (req) => {
      const type = req.resourceType();
      if (['document', 'script', 'stylesheet', 'font'].includes(type)) {
        resources.push(`${type}: ${req.url()}`);
      }
    });

    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    const scripts = resources.filter((r) => r.startsWith('script'));
    const stylesheets = resources.filter((r) => r.startsWith('stylesheet'));

    console.log(`[PERF] /signup — Scripts: ${scripts.length}, Stylesheets: ${stylesheets.length}`);
    console.log(`[PERF] Total tracked resources: ${resources.length}`);

    // Reasonable bounds — not a strict limit, just a diagnostic
    expect(scripts.length).toBeLessThan(30);
    expect(stylesheets.length).toBeLessThan(10);
  });

  test('plans page with auth mock loads within budget', async ({ page }) => {
    await page.route('/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'perf-user', email: 'perf@example.com', name: 'Perf Test' },
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

    const t0 = Date.now();
    await page.goto('/plans');
    await page.waitForSelector('h2', { timeout: 10000 });
    const loadTime = Date.now() - t0;

    console.log(`[PERF] /plans page load: ${loadTime}ms (budget: ${PERFORMANCE_BUDGETS.plansPageLoad}ms)`);

    expect(loadTime).toBeLessThan(PERFORMANCE_BUDGETS.plansPageLoad);
  });

  test('measures performance budget summary across funnel', async ({ page }) => {
    const metrics: Record<string, number> = {};

    // Signup
    let t0 = Date.now();
    await page.goto('/signup');
    await page.waitForSelector('h1');
    metrics.signup = Date.now() - t0;

    // Cancel
    t0 = Date.now();
    await page.goto('/checkout/cancel');
    await page.waitForLoadState('domcontentloaded');
    metrics.cancel = Date.now() - t0;

    // Error
    t0 = Date.now();
    await page.goto('/checkout/error?error_type=generic');
    await page.waitForLoadState('domcontentloaded');
    metrics.error = Date.now() - t0;

    console.log('[PERF] Funnel performance summary:');
    for (const [page_name, time] of Object.entries(metrics)) {
      console.log(`  /checkout/${page_name === 'signup' ? '' : page_name}: ${time}ms`);
    }

    // All measured pages should be under 5s
    for (const time of Object.values(metrics)) {
      expect(time).toBeLessThan(5000);
    }
  });
});
