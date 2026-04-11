import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Global setup for Playwright E2E tests.
 *
 * Creates a test user via the signup API and saves the authenticated session
 * state to e2e/.auth/user.json for reuse in authenticated tests.
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const { baseURL } = config.projects[0].use;

  // Ensure .auth directory exists
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const authFile = path.join(authDir, 'user.json');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: baseURL ?? 'https://staging.getgroomgrid.com',
  });
  const page = await context.newPage();

  try {
    // Create a test user via the signup API directly for speed
    const timestamp = Date.now();
    const email = `e2e+${timestamp}@example.com`;
    const password = 'TestPassword123!';
    const businessName = `E2E Test Business ${timestamp}`;

    const response = await page.request.post('/api/auth/signup', {
      data: { email, password, businessName },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok()) {
      console.warn(
        `Global setup: Failed to create test user via API (status ${response.status()}). ` +
        'Authenticated tests may fail if staging is unavailable.'
      );
      // Save empty state so the file exists (tests will handle auth failures gracefully)
      await context.storageState({ path: authFile });
      return;
    }

    // Now sign in via NextAuth credentials provider
    await page.goto('/login');
    await page.getByLabel(/Email/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Wait for navigation after login (redirect to plans or dashboard)
    await page.waitForURL(/\/(dashboard|plans|welcome)/, { timeout: 30000 });

    // Save authenticated storage state
    await context.storageState({ path: authFile });

    console.log(`Global setup: Test user created and session saved to ${authFile}`);
  } catch (error) {
    console.warn(
      'Global setup: Could not create authenticated session. ' +
      'This is expected if staging is unavailable.\n' +
      String(error)
    );
    // Save whatever state we have so the file exists
    try {
      await context.storageState({ path: authFile });
    } catch {
      // If we can't even save state, write an empty valid state file
      fs.writeFileSync(
        authFile,
        JSON.stringify({ cookies: [], origins: [] }, null, 2)
      );
    }
  } finally {
    await browser.close();
  }
}

export default globalSetup;
