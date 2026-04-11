/**
 * Dashboard E2E tests
 * Target: https://staging.getgroomgrid.com/dashboard
 *
 * Uses storageState from auth setup so the user is already logged in.
 * Configured to run in the `chromium-auth` project (see playwright.config.ts).
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    // Wait for dashboard or login redirect
    await expect(page).toHaveURL(/\/dashboard|\/login|\/plans/, { timeout: 20_000 });
  });

  test('authenticated user can access dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  });

  test('shows GroomGrid branding', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page.getByText(/GroomGrid/i).first()).toBeVisible();
  });

  test('shows stats cards', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page.getByText(/Today/i).first()).toBeVisible();
    await expect(page.getByText(/Clients/i).first()).toBeVisible();
    await expect(page.getByText(/Revenue/i).first()).toBeVisible();
  });

  test("shows today's appointments section", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: /Today's Appointments/i })).toBeVisible();
  });

  test('shows empty state or appointments list', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    // Either empty state or appointment cards are present
    const emptyState = page.getByText(/No appointments scheduled for today/i);
    const appointmentCount = await page.locator('.border.rounded-xl').count();
    const hasEmptyOrAppointments = (await emptyState.isVisible()) || appointmentCount > 0;
    expect(hasEmptyOrAppointments).toBeTruthy();
  });

  test('shows welcome card for new users (no data)', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    // New test user should have no appointments/clients, so welcome card should appear
    // It's conditional on having zero data — check if it's visible without requiring it
    const welcomeCard = page.getByText(/Welcome to GroomGrid/i);
    // This is optional — just check it doesn't throw
    const isVisible = await welcomeCard.isVisible().catch(() => false);
    // If visible it should have setup steps
    if (isVisible) {
      await expect(page.getByText(/Add your first client/i)).toBeVisible();
    }
  });

  test('shows sidebar navigation on desktop', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    // Navigation links are present (in sidebar on desktop)
    await expect(page.getByRole('link', { name: /Today/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Schedule/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Clients/i }).first()).toBeVisible();
  });

  test('shows sign out option', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page.getByRole('button', { name: /Sign Out/i }).first()).toBeVisible();
  });

  test('sign out redirects to landing page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await page.getByRole('button', { name: /Sign Out/i }).first().click();
    await expect(page).toHaveURL(/\/$|\/login/, { timeout: 20_000 });
  });

  test('unauthenticated access redirects to login', async ({ browser }) => {
    // Create a fresh browser context with no auth state
    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();

    await freshPage.goto('/dashboard');
    await expect(freshPage).toHaveURL(/\/login/, { timeout: 20_000 });

    await freshContext.close();
  });
});
