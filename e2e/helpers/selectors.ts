/**
 * E2E-specific selectors for GroomGrid Playwright tests
 *
 * These selectors target staging.getgroomgrid.com and use Playwright
 * best-practice locators (getByRole, getByLabel, getByTestId) wherever
 * possible.  Raw CSS / text selectors are used only as a last resort.
 */

export const E2E_SELECTORS = {
  // ── Landing page ──────────────────────────────────────────────────────────
  landing: {
    heroHeading: /Stop losing money to no-shows/i,
    ctaButton: /Start Free Trial/i,
    seeAllPlans: /See all plans/i,
    footer: 'footer',
  },

  // ── Auth pages ────────────────────────────────────────────────────────────
  signup: {
    businessNameLabel: /Business Name/i,
    emailLabel: /Email Address/i,
    passwordLabel: /Password/i,
    submitButton: /Start Free Trial/i,
    signInLink: /Sign in/i,
    errorBanner: '.bg-red-50',
  },

  login: {
    emailLabel: /Email/i,
    passwordLabel: /Password/i,
    submitButton: /Sign in/i,
    forgotPasswordLink: /Forgot password/i,
    signUpLink: /Sign up|Create account/i,
    errorBanner: '.bg-red-50',
  },

  // ── Plans page ────────────────────────────────────────────────────────────
  plans: {
    heading: /Choose Your Plan/i,
    soloCard: /Solo/i,
    salonCard: /Salon/i,
    enterpriseCard: /Enterprise/i,
    popularBadge: /Popular/i,
    trialInfo: /14-day free trial/i,
    signOutButton: /Sign Out/i,
  },

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboarding: {
    clientNameLabel: /Client Name/i,
    petNameLabel: /Pet Name/i,
    phoneLabel: /Phone/i,
    nextButton: /Next/i,
    skipButton: /Skip/i,
    skipTutorialButton: /Skip this tutorial/i,
    dashboardButton: /Go to Dashboard/i,
    completionMessage: /You're all set/i,
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: {
    trialBanner: /Free Trial Active/i,
    todaySection: /Today's Appointments/i,
    emptyState: /No appointments scheduled for today/i,
    bookAppointmentButton: /Book Appointment/i,
    welcomeCard: /Welcome to GroomGrid/i,
    navToday: /Today/i,
    navSchedule: /Schedule/i,
    navClients: /Clients/i,
    navSettings: /Settings/i,
    signOutButton: /Sign Out/i,
  },

  // ── Payment / Checkout ────────────────────────────────────────────────────
  checkout: {
    successHeading: /You're in/i,
    cancelHeading: /Payment Cancelled/i,
    errorHeading: /Payment Failed/i,
    onboardingButton: /Set Up Your Account/i,
    returnButton: /Return to Plans/i,
  },
} as const;
