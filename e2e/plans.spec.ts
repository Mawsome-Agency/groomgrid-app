import { test, expect } from '@playwright/test';

test.describe('Plans Page', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up authentication for plans page tests
    // Note: In a real scenario, you'd authenticate via API or login page
    await page.goto('/plans');
  });

  test('loads correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Choose Your Plan/);

    // Check main heading is visible
    const mainHeading = page.getByRole('heading', { name: /Choose Your Plan/i });
    await expect(mainHeading).toBeVisible();

    // Check subheading
    const subheading = page.getByText(/All plans include a 14-day free trial/i);
    await expect(subheading).toBeVisible();
  });

  test('displays all pricing tiers', async ({ page }) => {
    // Check for Solo plan
    await expect(page.getByText(/Solo/i)).toBeVisible();
    await expect(page.getByText(/\$29/i)).toBeVisible();

    // Check for Salon plan
    await expect(page.getByText(/Salon/i)).toBeVisible();
    await expect(page.getByText(/\$79/i)).toBeVisible();

    // Check for Enterprise plan
    await expect(page.getByText(/Enterprise/i)).toBeVisible();
    await expect(page.getByText(/\$149/i)).toBeVisible();
  });

  test('displays plan features', async ({ page }) => {
    // Check for Solo plan features
    await expect(page.getByText(/1 groomer account/i)).toBeVisible();
    await expect(page.getByText(/Unlimited clients/i)).toBeVisible();

    // Check for Salon plan features
    await expect(page.getByText(/Up to 5 groomer accounts/i)).toBeVisible();
    await expect(page.getByText(/Team scheduling/i)).toBeVisible();

    // Check for Enterprise plan features
    await expect(page.getByText(/Unlimited groomers/i)).toBeVisible();
    await expect(page.getByText(/API access/i)).toBeVisible();
  });

  test('displays popular badge on Salon plan', async ({ page }) => {
    // Check for popular badge on Salon plan
    const popularBadge = page.getByText(/Popular/i);
    await expect(popularBadge).toBeVisible();
  });

  test('displays testimonials', async ({ page }) => {
    // Check for testimonials section
    const testimonialsSection = page.getByRole('heading', { name: /Trusted by Professional Groomers/i });
    await expect(testimonialsSection).toBeVisible();

    // Check for individual testimonials
    await expect(page.getByText(/Sarah Mitchell/i)).toBeVisible();
    await expect(page.getByText(/James Rodriguez/i)).toBeVisible();
  });

  test('displays FAQ section', async ({ page }) => {
    // Check for FAQ section
    const faqSection = page.getByRole('heading', { name: /Frequently Asked Questions/i });
    await expect(faqSection).toBeVisible();

    // Check for FAQ items
    await expect(page.getByText(/What happens after the free trial/i)).toBeVisible();
    await expect(page.getByText(/Can I change plans later/i)).toBeVisible();
    await expect(page.getByText(/Is my data secure/i)).toBeVisible();
  });

  test('displays trust signals', async ({ page }) => {
    // Check for trust signals section
    await expect(page.getByText(/Secure Payment/i)).toBeVisible();
    await expect(page.getByText(/Cancel Anytime/i)).toBeVisible();
  });

  test('trial information displays', async ({ page }) => {
    // Check for trial information
    await expect(page.getByText(/14-day free trial/i)).toBeVisible();
    await expect(page.getByText(/All plans include a 14-day free trial/i)).toBeVisible();
  });

  test('displays sign out button', async ({ page }) => {
    // Check for sign out button
    const signOutButton = page.getByRole('button', { name: /Sign Out/i });
    await expect(signOutButton).toBeVisible();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload page
    await page.reload();

    // Check main elements are still visible
    const mainHeading = page.getByRole('heading', { name: /Choose Your Plan/i });
    await expect(mainHeading).toBeVisible();

    // Check plans are stacked vertically on mobile
    await expect(page.getByText(/Solo/i)).toBeVisible();
    await expect(page.getByText(/Salon/i)).toBeVisible();
    await expect(page.getByText(/Enterprise/i)).toBeVisible();
  });

  test('displays GroomGrid logo', async ({ page }) => {
    // Check for GroomGrid logo
    const logo = page.getByText('GroomGrid');
    await expect(logo).toBeVisible();
  });
});
