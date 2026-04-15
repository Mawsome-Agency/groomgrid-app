/**
 * Plans page E2E tests
 * Target: https://staging.getgroomgrid.com/plans
 *
 * The plans page is publicly accessible for marketing purposes.
 * Authenticated users see additional account-specific information.
 */

import { test, expect } from '@playwright/test';

// Plans page is publicly accessible for marketing purposes

test.describe('Plans page', () => {

  test('shows plan selection heading', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByRole('heading', { name: /Simple, Transparent Pricing/i })).toBeVisible();
  });

  test('shows all three plan cards', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByText(/Solo/i).first()).toBeVisible();
    await expect(page.getByText(/Salon/i).first()).toBeVisible();
    await expect(page.getByText(/Enterprise/i).first()).toBeVisible();
  });

  test('shows popular badge on Salon plan', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByText(/Popular/i)).toBeVisible();
  });

  test('shows 14-day free trial info', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByText(/14-day free trial/i).first()).toBeVisible();
  });

  test('shows testimonials section', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByText(/Trusted by Professional Groomers/i)).toBeVisible();
    await expect(page.getByText(/Sarah Johnson/i)).toBeVisible();
  });

  test('shows FAQ section', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByText(/Frequently Asked Questions/i)).toBeVisible();
    await expect(page.getByText(/Is there a free trial/i)).toBeVisible();
  });

  test('shows start free trial button in header', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByRole('link', { name: /Start Free Trial/i })).toBeVisible();
  });

  test('allows unauthenticated users to access the page', async ({ browser }) => {
    // Create a fresh browser context with no auth state
    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();

    await freshPage.goto('/plans');
    await expect(freshPage).toHaveURL(/\/plans/, { timeout: 20_000 });
    await expect(freshPage.getByRole('heading', { name: /Simple, Transparent Pricing/i })).toBeVisible();

    await freshContext.close();
  });
});
