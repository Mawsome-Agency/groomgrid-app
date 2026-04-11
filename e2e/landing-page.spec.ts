/**
 * Landing page E2E tests
 * Target: https://staging.getgroomgrid.com
 */

import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads and shows hero section', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Stop losing money to no-shows/i })).toBeVisible();
  });

  test('shows primary CTA button linking to signup', async ({ page }) => {
    const ctaButtons = page.getByRole('link', { name: /Start Free Trial/i });
    await expect(ctaButtons.first()).toBeVisible();
  });

  test('shows value proposition section', async ({ page }) => {
    await expect(page.getByText(/Everything you need/i)).toBeVisible();
  });

  test('shows social proof / testimonials', async ({ page }) => {
    await expect(page.getByText(/Sarah Mitchell|James Rodriguez/i).first()).toBeVisible();
  });

  test('shows pricing teaser', async ({ page }) => {
    await expect(page.getByText(/Simple pricing/i)).toBeVisible();
    await expect(page.getByText(/\$29/i)).toBeVisible();
  });

  test('shows see all plans link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /See all plans/i })).toBeVisible();
  });

  test('shows footer with contact info', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByText(/© 2026 GroomGrid/i)).toBeVisible();
  });

  test('CTA navigates to signup page', async ({ page }) => {
    await page.getByRole('link', { name: /Start Free Trial/i }).first().click();
    await expect(page).toHaveURL(/\/signup/);
  });
});
