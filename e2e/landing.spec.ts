/**
 * Landing page E2E tests — core smoke tests for the signup-to-dashboard journey.
 *
 * Uses semantic selectors (getByRole, getByText) since no data-testid
 * attributes exist in the codebase.
 */
import { test, expect } from '@playwright/test';

test.describe('Landing Page — core', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/GroomGrid/);
  });

  test('H1 heading is visible', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('Start Free Trial CTA buttons are visible (nav + hero)', async ({ page }) => {
    const ctaButtons = page.getByRole('link', { name: /Start Free Trial/i });
    // There should be at least 2: one in the nav and one in the hero
    await expect(ctaButtons.first()).toBeVisible();
    await expect(ctaButtons.nth(1)).toBeVisible();
  });

  test('navigation logo is visible', async ({ page }) => {
    const logo = page.getByText(/GroomGrid/i).first();
    await expect(logo).toBeVisible();
  });
});
