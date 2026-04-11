import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for GroomGrid integration tests
 * Tests run against staging environment
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    // Performance tracking
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // Desktop Chrome — primary test target
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Mobile Safari — tests mobile flows
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: ['**/conversion-flow.spec.ts', '**/signup.spec.ts', '**/dashboard.spec.ts'],
    },

    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: ['**/conversion-flow.spec.ts', '**/signup.spec.ts', '**/dashboard.spec.ts'],
    },
  ],

  // Performance budget thresholds (ms)
  expect: {
    timeout: 10000,
  },
});
