/**
 * Common E2E test utilities for GroomGrid Playwright tests
 *
 * Re-exports and augments helpers from tests/helpers/auth where needed,
 * but is fully self-contained so E2E tests can import from a single place.
 */

import { Page, expect } from '@playwright/test';

// ── Credential generators ─────────────────────────────────────────────────────

/** Returns a unique test email address using timestamp + random suffix. */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `e2e-${timestamp}-${random}@example.com`;
}

/** Returns the standard test password used across E2E tests. */
export function generateTestPassword(): string {
  return 'TestPassword123!';
}

/** Returns a unique test business name using a timestamp. */
export function generateTestBusinessName(): string {
  const timestamp = Date.now();
  return `E2E Business ${timestamp}`;
}

// ── Navigation helpers ────────────────────────────────────────────────────────

/**
 * Wait for the page to navigate to a URL matching the given pattern.
 * Throws a descriptive error if the URL does not match within the timeout.
 */
export async function waitForNavigation(page: Page, urlPattern: RegExp, timeout = 30_000): Promise<void> {
  await expect(page).toHaveURL(urlPattern, { timeout });
}

/**
 * Log in a user through the UI and wait for redirect.
 * Returns after navigating away from /login.
 */
export async function loginViaUI(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/login');
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel(/Email/i).fill(email);
  await page.getByLabel(/Password/i).fill(password);
  await page.getByRole('button', { name: /Sign in/i }).click();

  await expect(page).toHaveURL(/\/(dashboard|plans|welcome|onboarding)/, { timeout: 30_000 });
}

// ── Re-exported selector constants ───────────────────────────────────────────

export { E2E_SELECTORS } from './selectors';
