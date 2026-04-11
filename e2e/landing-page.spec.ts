import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/GroomGrid/);

    // Check main heading is visible
    const mainHeading = page.getByRole('heading', { name: /Stop losing money to no-shows/i });
    await expect(mainHeading).toBeVisible();

    // Check navigation is visible
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // Check GroomGrid logo is visible
    const logo = page.getByText('GroomGrid 🐾');
    await expect(logo).toBeVisible();
  });

  test('displays hero content', async ({ page }) => {
    // Check hero heading
    const heroHeading = page.getByRole('heading', { name: /Stop losing money to no-shows/i });
    await expect(heroHeading).toBeVisible();

    // Check hero description
    const heroDescription = page.getByText(/GroomGrid is the AI-powered scheduling app/i);
    await expect(heroDescription).toBeVisible();

    // Check CTA button
    const ctaButton = page.getByRole('link', { name: /Start Free Trial/i });
    await expect(ctaButton).toBeVisible();
  });

  test('CTA navigates to signup', async ({ page }) => {
    // Click the main CTA button
    const ctaButton = page.getByRole('link', { name: /Start Free Trial/i }).first();
    await ctaButton.click();

    // Verify navigation to signup page
    await expect(page).toHaveURL('/signup');

    // Check signup form is visible
    const signupHeading = page.getByRole('heading', { name: /Create Account/i });
    await expect(signupHeading).toBeVisible();
  });

  test('displays value props section', async ({ page }) => {
    // Check value props section exists
    const valuePropsSection = page.getByText(/Everything you need. Nothing you don't/i);
    await expect(valuePropsSection).toBeVisible();

    // Check for key value props
    await expect(page.getByText(/2-tap booking/i)).toBeVisible();
    await expect(page.getByText(/Automatic reminders/i)).toBeVisible();
    await expect(page.getByText(/Pet profiles/i)).toBeVisible();
    await expect(page.getByText(/Upfront payments/i)).toBeVisible();
  });

  test('displays social proof section', async ({ page }) => {
    // Check social proof section exists
    const socialProofSection = page.getByText(/Join 50\+ groomers on the waitlist/i);
    await expect(socialProofSection).toBeVisible();

    // Check for testimonials
    await expect(page.getByText(/Sarah Mitchell/i)).toBeVisible();
    await expect(page.getByText(/James Rodriguez/i)).toBeVisible();
  });

  test('displays pricing teaser', async ({ page }) => {
    // Check pricing section exists
    const pricingSection = page.getByText(/Simple pricing. No surprises/i);
    await expect(pricingSection).toBeVisible();

    // Check for solo plan pricing
    await expect(page.getByText(/\$29\/mo/i)).toBeVisible();
    await expect(page.getByText(/Solo Groomer/i)).toBeVisible();

    // Check for link to all plans
    const plansLink = page.getByRole('link', { name: /See all plans/i });
    await expect(plansLink).toBeVisible();
  });

  test('displays final CTA banner', async ({ page }) => {
    // Check final CTA section exists
    const finalCta = page.getByText(/Ready to stop the chaos/i);
    await expect(finalCta).toBeVisible();

    // Check CTA button in final banner
    const finalCtaButton = page.getByRole('link', { name: /Start Free Trial/i });
    await expect(finalCtaButton).toBeVisible();
  });

  test('displays footer', async ({ page }) => {
    // Check footer exists
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    // Check for copyright
    await expect(page.getByText(/© 2026 GroomGrid/i)).toBeVisible();

    // Check for email link
    const emailLink = page.getByRole('link', { name: /hello@getgroomgrid.com/i });
    await expect(emailLink).toBeVisible();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload page
    await page.reload();

    // Check main elements are still visible
    const heroHeading = page.getByRole('heading', { name: /Stop losing money to no-shows/i });
    await expect(heroHeading).toBeVisible();

    const ctaButton = page.getByRole('link', { name: /Start Free Trial/i });
    await expect(ctaButton).toBeVisible();
  });
});
