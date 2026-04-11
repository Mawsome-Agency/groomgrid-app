import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration
 * Target: https://staging.getgroomgrid.com
 *
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://staging.getgroomgrid.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    /**
     * Auth setup project — runs once before protected tests.
     * Creates a test user, logs in, and saves browser storage state.
     */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /**
     * Chromium desktop — unauthenticated tests (landing, signup, plans)
     */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/dashboard.spec.ts', '**/onboarding.spec.ts'],
    },

    /**
     * Chromium — authenticated tests (dashboard, onboarding)
     * Depends on setup project to have saved auth state.
     */
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      testMatch: ['**/dashboard.spec.ts', '**/onboarding.spec.ts'],
      dependencies: ['setup'],
    },
  ],
});
