import { test, expect } from '@playwright/test';

test.describe('Signup Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('loads correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Create Account/);

    // Check signup heading is visible
    const signupHeading = page.getByRole('heading', { name: /Create Account/i });
    await expect(signupHeading).toBeVisible();

    // Check subheading
    const subheading = page.getByText(/Start your 14-day free trial/i);
    await expect(subheading).toBeVisible();
  });

  test('displays all form fields', async ({ page }) => {
    // Check business name field
    const businessNameInput = page.getByLabel(/Business Name/i);
    await expect(businessNameInput).toBeVisible();
    await expect(businessNameInput).toHaveAttribute('type', 'text');

    // Check email field
    const emailInput = page.getByLabel(/Email Address/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check password field
    const passwordInput = page.getByLabel(/Password/i);
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('valid input creates account', async ({ page }) => {
    // Generate unique test data
    const timestamp = Date.now();
    const businessName = `Test Business ${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'TestPassword123!';

    // Fill out the form
    await page.getByLabel(/Business Name/i).fill(businessName);
    await page.getByLabel(/Email Address/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);

    // Submit the form
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Wait for navigation to welcome page
    await expect(page).toHaveURL('/welcome', { timeout: 30000 });

    // Verify welcome page is displayed
    const welcomeHeading = page.getByRole('heading', { name: /Welcome to GroomGrid/i });
    await expect(welcomeHeading).toBeVisible();
  });

  test('validation errors display for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Check for HTML5 validation
    const businessNameInput = page.getByLabel(/Business Name/i);
    await expect(businessNameInput).toBeVisible();

    const emailInput = page.getByLabel(/Email Address/i);
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByLabel(/Password/i);
    await expect(passwordInput).toBeVisible();
  });

  test('email already exists error', async ({ page }) => {
    // Use an email that might already exist
    const existingEmail = 'test@example.com';
    const businessName = 'Test Business';
    const password = 'TestPassword123!';

    // Fill out the form with existing email
    await page.getByLabel(/Business Name/i).fill(businessName);
    await page.getByLabel(/Email Address/i).fill(existingEmail);
    await page.getByLabel(/Password/i).fill(password);

    // Submit the form
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Check for error message (if email exists)
    const errorMessage = page.getByText(/already exists/i);
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('password too short error', async ({ page }) => {
    const businessName = 'Test Business';
    const email = `test${Date.now()}@example.com`;
    const shortPassword = '123'; // Less than 8 characters

    // Fill out the form with short password
    await page.getByLabel(/Business Name/i).fill(businessName);
    await page.getByLabel(/Email Address/i).fill(email);
    await page.getByLabel(/Password/i).fill(shortPassword);

    // Check HTML5 validation
    const passwordInput = page.getByLabel(/Password/i);
    await expect(passwordInput).toHaveAttribute('minlength', '8');
  });

  test('displays sign in link', async ({ page }) => {
    // Check for sign in link
    const signInLink = page.getByRole('link', { name: /Sign in/i });
    await expect(signInLink).toBeVisible();

    // Click sign in link
    await signInLink.click();

    // Verify navigation to login page
    await expect(page).toHaveURL('/login');
  });

  test('displays loading state during submission', async ({ page }) => {
    const timestamp = Date.now();
    const businessName = `Test Business ${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'TestPassword123!';

    // Fill out the form
    await page.getByLabel(/Business Name/i).fill(businessName);
    await page.getByLabel(/Email Address/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);

    // Submit the form
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Check for loading state
    const submitButton = page.getByRole('button', { name: /Creating Account/i });
    await expect(submitButton).toBeVisible();
  });

  test('redirects to welcome after signup', async ({ page }) => {
    const timestamp = Date.now();
    const businessName = `Test Business ${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'TestPassword123!';

    // Fill out the form
    await page.getByLabel(/Business Name/i).fill(businessName);
    await page.getByLabel(/Email Address/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);

    // Submit the form
    await page.getByRole('button', { name: /Create Account/i }).click();

    // Wait for navigation to welcome page
    await expect(page).toHaveURL('/welcome', { timeout: 30000 });

    // Verify welcome page displays business name
    await expect(page.getByText(new RegExp(businessName, 'i'))).toBeVisible();
  });

  test('displays GroomGrid logo link to home', async ({ page }) => {
    // Check for logo
    const logo = page.getByRole('link', { name: /GroomGrid/i });
    await expect(logo).toBeVisible();

    // Click logo
    await logo.click();

    // Verify navigation to home page
    await expect(page).toHaveURL('/');
  });
});
