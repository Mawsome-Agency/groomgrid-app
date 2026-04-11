/**
 * Onboarding flow E2E tests
 * Target: https://staging.getgroomgrid.com/onboarding
 *
 * Uses storageState from auth setup so the user is already logged in.
 * Configured to run in the `chromium-auth` project (see playwright.config.ts).
 */

import { test, expect } from '@playwright/test';

test.describe('Onboarding flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/\/onboarding|\/login|\/dashboard/, { timeout: 20_000 });
  });

  test('authenticated user can access onboarding', async ({ page }) => {
    // Onboarding may redirect to dashboard if already completed
    const url = page.url();
    expect(url).toMatch(/\/onboarding|\/dashboard/);
  });

  test('shows step 1: add client form', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/onboarding')) {
      test.skip();
    }
    await expect(page.getByLabel(/Client Name/i)).toBeVisible();
    await expect(page.getByLabel(/Pet Name/i)).toBeVisible();
    await expect(page.getByLabel(/Phone/i)).toBeVisible();
  });

  test('shows next and skip buttons', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/onboarding')) {
      test.skip();
    }
    await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Skip/i })).toBeVisible();
  });

  test('shows skip tutorial option', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/onboarding')) {
      test.skip();
    }
    await expect(page.getByRole('button', { name: /Skip this tutorial/i })).toBeVisible();
  });

  test('skip tutorial navigates to dashboard', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/onboarding')) {
      test.skip();
    }
    await page.getByRole('button', { name: /Skip this tutorial/i }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  });

  test('filling step 1 and clicking next advances to step 2', async ({ page }) => {
    const url = page.url();
    if (!url.includes('/onboarding')) {
      test.skip();
    }
    await page.getByLabel(/Client Name/i).fill('Jane Doe');
    await page.getByLabel(/Pet Name/i).fill('Fluffy');
    await page.getByLabel(/Phone/i).fill('555-123-4567');

    await page.getByRole('button', { name: /Next/i }).click();

    // Should advance to step 2 (appointment booking)
    await expect(page.getByText(/Appointment|Date|Service/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('unauthenticated access redirects to login', async ({ browser }) => {
    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();

    await freshPage.goto('/onboarding');
    await expect(freshPage).toHaveURL(/\/login/, { timeout: 20_000 });

    await freshContext.close();
  });
});
