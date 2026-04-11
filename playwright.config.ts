import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for GroomGrid
 *
 * Target: Staging environment (https://staging.getgroomgrid.com)
 * Scope: Full user journey from landing page to dashboard
 *
 * Tests cover:
 * - Landing page loads correctly
 * - Signup form validation and submission
 * - Plans page display and plan selection
 * - Payment flow via Stripe (test mode)
 * - Onboarding flow
 * - Dashboard access and functionality
 */
export default defineConfig({
  // Global setup — creates test user and saves session to e2e/.auth/user.json
  globalSetup: require.resolve('./e2e/global-setup'),

  // Test directory
  testDir: './e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 1,

  // Opt out of parallel workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // Shared settings for all tests
  use: {
    // Base URL for all tests
    baseURL: 'https://staging.getgroomgrid.com',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Capture video on failure
    video: 'retain-on-failure',

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Action timeout (increased for slower staging environment)
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Global timeout for each test
  timeout: 60000,

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run your local dev server before starting the tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
