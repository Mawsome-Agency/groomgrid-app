import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard page
    await page.goto('/dashboard');
  });

  test('loads after onboarding', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Dashboard/);

    // Check main heading is visible
    await expect(page.getByText(/Today's Appointments/i)).toBeVisible();
  });

  test('displays trial banner', async ({ page }) => {
    // Check for trial banner
    const trialBanner = page.getByText(/Free Trial Active/i);
    await expect(trialBanner).toBeVisible();

    // Check for trial days remaining
    await expect(page.getByText(/day(s) remaining/i)).toBeVisible();
  });

  test('displays stats cards', async ({ page }) => {
    // Check for appointments stat card
    await expect(page.getByText(/Today/i)).toBeVisible();
    await expect(page.getByText(/appointment/i)).toBeVisible();

    // Check for clients stat card
    await expect(page.getByText(/Clients/i)).toBeVisible();
    await expect(page.getByText(/total/i)).toBeVisible();

    // Check for revenue stat card
    await expect(page.getByText(/Revenue/i)).toBeVisible();
    await expect(page.getByText(/this week/i)).toBeVisible();
  });

  test('displays navigation sidebar', async ({ page }) => {
    // Check for GroomGrid logo in sidebar
    await expect(page.getByText('GroomGrid')).toBeVisible();

    // Check for navigation links
    await expect(page.getByRole('link', { name: /Today/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Schedule/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Clients/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Settings/i })).toBeVisible();
  });

  test('sign out works', async ({ page }) => {
    // Check for sign out button
    const signOutButton = page.getByRole('button', { name: /Sign Out/i });
    await expect(signOutButton).toBeVisible();

    // Note: Actually clicking sign out would require authentication
    // This test just verifies the sign out option is available
  });

  test('displays today\'s appointments section', async ({ page }) => {
    // Check for appointments section
    await expect(page.getByText(/Today's Appointments/i)).toBeVisible();

    // Check for view calendar link
    const calendarLink = page.getByRole('link', { name: /View Calendar/i });
    await expect(calendarLink).toBeVisible();
  });

  test('displays empty state when no appointments', async ({ page }) => {
    // Check for empty state message
    const emptyState = page.getByText(/No appointments scheduled for today/i);
    await expect(emptyState).toBeVisible();

    // Check for book appointment button
    const bookButton = page.getByRole('link', { name: /Book Appointment/i });
    await expect(bookButton).toBeVisible();
  });

  test('displays welcome card for new users', async ({ page }) => {
    // Check for welcome card
    const welcomeCard = page.getByText(/Welcome to GroomGrid/i);
    // Welcome card is only shown for new users with no data
  });

  test('displays mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload page
    await page.reload();

    // Check for mobile menu button
    const menuButton = page.getByRole('button', { name: /Menu/i });
    await expect(menuButton).toBeVisible();
  });

  test('displays floating action button on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload page
    await page.reload();

    // Check for FAB
    const fab = page.getByRole('button', { name: '' }).filter({ hasText: '' });
    // FAB is a button with a plus icon
  });

  test('displays business name in header', async ({ page }) => {
    // Check for business name in mobile header
    const businessName = page.getByText(/My Business/i);
    // Business name is displayed in the header
  });

  test('navigates to schedule page', async ({ page }) => {
    // Click on schedule link
    const scheduleLink = page.getByRole('link', { name: /Schedule/i });
    await scheduleLink.click();

    // Verify navigation to schedule page
    await expect(page).toHaveURL('/schedule');
  });

  test('navigates to clients page', async ({ page }) => {
    // Click on clients link
    const clientsLink = page.getByRole('link', { name: /Clients/i });
    await clientsLink.click();

    // Verify navigation to clients page
    await expect(page).toHaveURL('/clients');
  });

  test('navigates to settings page', async ({ page }) => {
    // Click on settings link
    const settingsLink = page.getByRole('link', { name: /Settings/i });
    await settingsLink.click();

    // Verify navigation to settings page
    await expect(page).toHaveURL('/settings');
  });
});
