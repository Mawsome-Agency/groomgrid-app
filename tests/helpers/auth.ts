/**
 * Authentication helpers for E2E tests
 *
 * Provides utilities for creating, signing in, and managing test users
 */

import { APIRequestContext, Page } from '@playwright/test';

export interface TestUser {
  id: string;
  email: string;
  password: string;
  businessName: string;
}

export interface TestSession {
  user: TestUser;
  sessionToken: string;
  csrfToken: string;
}

/**
 * Generate a unique test email address
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * Generate a test password
 */
export function generateTestPassword(): string {
  return 'TestPassword123!';
}

/**
 * Generate a test business name
 */
export function generateTestBusinessName(): string {
  const timestamp = Date.now();
  return `Test Business ${timestamp}`;
}

/**
 * Create a test user via API
 */
export async function createTestUser(
  request: APIRequestContext,
  baseURL: string
): Promise<TestUser> {
  const email = generateTestEmail();
  const password = generateTestPassword();
  const businessName = generateTestBusinessName();

  const response = await request.post(`${baseURL}/api/auth/signup`, {
    data: {
      email,
      password,
      businessName,
    },
  });

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to create test user: ${error}`);
  }

  const data = await response.json();

  return {
    id: data.userId,
    email,
    password,
    businessName,
  };
}

/**
 * Sign in a test user via API
 */
export async function signInTestUser(
  request: APIRequestContext,
  baseURL: string,
  email: string,
  password: string
): Promise<TestSession> {
  // Get CSRF token
  const csrfResponse = await request.get(`${baseURL}/api/auth/csrf`);
  const csrfData = await csrfResponse.json();
  const csrfToken = csrfData.csrfToken;

  // Sign in
  const response = await request.post(`${baseURL}/api/auth/callback/credentials`, {
    data: {
      email,
      password,
      csrfToken,
      redirect: false,
    },
  });

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to sign in test user: ${error}`);
  }

  const data = await response.json();

  return {
    user: { id: '', email, password, businessName: '' },
    sessionToken: data.sessionToken || '',
    csrfToken,
  };
}

/**
 * Sign out a test user
 */
export async function signOutTestUser(
  request: APIRequestContext,
  baseURL: string
): Promise<void> {
  await request.post(`${baseURL}/api/auth/signout`);
}

/**
 * Delete a test user via API
 */
export async function deleteTestUser(
  request: APIRequestContext,
  baseURL: string,
  userId: string
): Promise<void> {
  // Note: This would require a delete user API endpoint
  // For now, this is a placeholder
  console.log(`Would delete user ${userId}`);
}

/**
 * Get test session cookies
 */
export async function getTestSession(
  page: Page
): Promise<Record<string, string>> {
  const cookies = await page.context().cookies();
  const sessionCookies: Record<string, string> = {};

  for (const cookie of cookies) {
    if (cookie.name.includes('session') || cookie.name.includes('auth')) {
      sessionCookies[cookie.name] = cookie.value;
    }
  }

  return sessionCookies;
}

/**
 * Set test session cookies
 */
export async function setTestSession(
  page: Page,
  cookies: Record<string, string>
): Promise<void> {
  const context = page.context();

  for (const [name, value] of Object.entries(cookies)) {
    await context.addCookies([
      {
        name,
        value,
        domain: new URL(page.url()).hostname,
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
  }
}

/**
 * Authenticate a test user in the browser
 */
export async function authenticateTestUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  // Navigate to login page
  await page.goto('/login');

  // Fill in credentials
  await page.getByLabel(/Email/i).fill(email);
  await page.getByLabel(/Password/i).fill(password);

  // Submit form
  await page.getByRole('button', { name: /Sign in/i }).click();

  // Wait for navigation
  await page.waitForURL(/\/(dashboard|welcome|plans)/, { timeout: 30000 });
}

/**
 * Mock the NextAuth session to simulate an authenticated user
 * Use this instead of real sign-in for tests that don't need to test auth itself
 */
export async function mockAuthSession(
  page: Page,
  user: { id: string; email: string; name: string }
): Promise<void> {
  await page.route('/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user,
        expires: new Date(Date.now() + 86400000).toISOString(),
      }),
    });
  });
}

/**
 * Mock the profile API endpoint
 */
export async function mockProfileApi(
  page: Page,
  profile: {
    welcomeShown?: boolean;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
    trialEndsAt?: string | null;
    businessName?: string;
  } = {}
): Promise<void> {
  const defaults = {
    welcomeShown: true,
    stripeSubscriptionId: null,
    subscriptionStatus: 'trial',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    businessName: 'Test Business',
  };

  await page.route('/api/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...defaults, ...profile }),
    });
  });
}

/**
 * Create a fully mocked authenticated session (session + profile)
 */
export async function setupMockedAuth(
  page: Page,
  options: {
    userId?: string;
    email?: string;
    name?: string;
    welcomeShown?: boolean;
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
  } = {}
): Promise<void> {
  const {
    userId = 'mock-user-123',
    email = 'test@example.com',
    name = 'Test Business',
    welcomeShown = true,
    stripeSubscriptionId = null,
    subscriptionStatus = 'trial',
  } = options;

  await mockAuthSession(page, { id: userId, email, name });
  await mockProfileApi(page, { welcomeShown, stripeSubscriptionId, subscriptionStatus });
}
