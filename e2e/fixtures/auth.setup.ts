/**
 * Auth setup fixture for Playwright E2E tests
 *
 * Creates a test user via the signup API, then logs in through the UI
 * and saves browser storage state (cookies + localStorage) to disk.
 *
 * This runs once in the `setup` project before any authenticated tests.
 * Authenticated tests reference the saved state via `storageState`.
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { generateTestEmail, generateTestPassword, generateTestBusinessName } from '../helpers/test-utils';

const AUTH_FILE = path.join(process.cwd(), 'e2e/.auth/user.json');

setup('authenticate test user', async ({ page, request, baseURL }) => {
  const base = baseURL ?? 'https://staging.getgroomgrid.com';
  const email = generateTestEmail();
  const password = generateTestPassword();
  const businessName = generateTestBusinessName();

  // ── 1. Create user via signup API ─────────────────────────────────────────
  const signupResponse = await request.post(`${base}/api/auth/signup`, {
    data: { email, password, businessName },
  });

  if (!signupResponse.ok()) {
    const body = await signupResponse.text();
    throw new Error(`Auth setup: failed to create test user — ${signupResponse.status()} ${body}`);
  }

  // ── 2. Sign in through the UI ─────────────────────────────────────────────
  await page.goto('/login');
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel(/Email/i).fill(email);
  await page.getByLabel(/Password/i).fill(password);
  await page.getByRole('button', { name: /Sign in/i }).click();

  // Wait for successful auth redirect (dashboard, plans, or welcome screen)
  await expect(page).toHaveURL(/\/(dashboard|plans|welcome|onboarding)/, { timeout: 30_000 });

  // ── 3. Persist storage state ──────────────────────────────────────────────
  await page.context().storageState({ path: AUTH_FILE });
});
