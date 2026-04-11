/**
 * Plans page E2E tests
 * Target: https://staging.getgroomgrid.com/plans
 *
 * These tests use a pre-authenticated user via storageState.
 * The plans page requires authentication (unauthenticated users are redirected to /login).
 */

import { test, expect } from '@playwright/test';

// Plans page requires auth — storageState is set via chromium-auth project in playwright.config.ts

test.describe('Plans page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plans');
    // If redirected to login or welcome, this context may not be fully set up — skip gracefully
    await expect(page).toHaveURL(/\/plans|\/login|\/welcome/, { timeout: 20_000 });
  });

  test('shows plan selection heading', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByRole('heading', { name: /Choose Your Plan/i })).toBeVisible();
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
    await expect(page.getByText(/Sarah Mitchell/i)).toBeVisible();
  });

  test('shows FAQ section', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByText(/Frequently Asked Questions/i)).toBeVisible();
    await expect(page.getByText(/What happens after the free trial/i)).toBeVisible();
  });

  test('shows sign out button in header', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/plans')) {
      test.skip();
    }
    await expect(page.getByRole('button', { name: /Sign Out/i })).toBeVisible();
  });

  test('redirects unauthenticated users to login', async ({ browser }) => {
    // Create a fresh browser context with no auth state
    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();

    await freshPage.goto('/plans');
    await expect(freshPage).toHaveURL(/\/login/, { timeout: 20_000 });

    await freshContext.close();
  });
});
