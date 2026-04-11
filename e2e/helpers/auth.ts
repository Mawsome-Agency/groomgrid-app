import { Browser, BrowserContext, Page } from '@playwright/test';

export interface TestUserCredentials {
  email: string;
  password: string;
  businessName: string;
}

/**
 * Creates a test user via the signup form and returns the credentials used.
 */
export async function createTestUser(page: Page): Promise<TestUserCredentials> {
  const timestamp = Date.now();
  const credentials: TestUserCredentials = {
    email: `test+${timestamp}@example.com`,
    password: 'TestPassword123!',
    businessName: `Test Business ${timestamp}`,
  };

  await page.goto('/signup');

  await page.getByLabel(/Business Name/i).fill(credentials.businessName);
  await page.getByLabel(/Email Address/i).fill(credentials.email);
  await page.getByLabel(/Password/i).fill(credentials.password);

  await page.getByRole('button', { name: /Create Account/i }).click();

  // Wait for redirect to welcome page
  await page.waitForURL('/welcome', { timeout: 30000 });

  return credentials;
}

/**
 * Logs in a user via the login page.
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/login');

  await page.getByLabel(/Email/i).fill(email);
  await page.getByLabel(/Password/i).fill(password);

  await page.getByRole('button', { name: /Sign in/i }).click();

  // Wait for redirect after successful login
  await page.waitForURL(/\/(dashboard|plans|welcome)/, { timeout: 30000 });
}

/**
 * Creates a test user and returns the browser storage state (cookies + localStorage)
 * for reuse across authenticated tests.
 */
export async function setupAuthState(browser: Browser): Promise<BrowserContext> {
  const context = await browser.newContext();
  const page = await context.newPage();

  await createTestUser(page);

  await page.close();
  return context;
}
