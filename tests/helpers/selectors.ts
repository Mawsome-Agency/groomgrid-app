/**
 * Reusable selectors for E2E tests
 *
 * Provides consistent selectors across all test files
 */

/**
 * Landing page selectors
 */
export const landingPageSelectors = {
  // Navigation
  logo: 'text=GroomGrid 🐾',
  ctaButton: 'a:has-text("Start Free Trial")',

  // Hero section
  heroHeading: 'h1:has-text("Stop losing money to no-shows")',
  heroDescription: 'p:has-text("GroomGrid is the AI-powered scheduling app")',

  // Value props
  valuePropsSection: 'h2:has-text("Everything you need")',
  valueProp2TapBooking: 'text=2-tap booking',
  valuePropReminders: 'text=Automatic reminders',
  valuePropPetProfiles: 'text=Pet profiles',
  valuePropUpfrontPayments: 'text=Upfront payments',

  // Social proof
  socialProofSection: 'h2:has-text("Join 50+ groomers")',
  testimonialSarah: 'text=Sarah Mitchell',
  testimonialJames: 'text=James Rodriguez',

  // Pricing teaser
  pricingSection: 'h2:has-text("Simple pricing")',
  soloPlanPrice: 'text=$29/mo',
  soloPlanLabel: 'text=Solo Groomer',
  seeAllPlansLink: 'a:has-text("See all plans")',

  // Final CTA
  finalCtaSection: 'h2:has-text("Ready to stop the chaos")',
  finalCtaButton: 'a:has-text("Start Free Trial")',

  // Footer
  footer: 'footer',
  copyright: 'text=© 2026 GroomGrid',
  emailLink: 'a:has-text("hello@getgroomgrid.com")',
};

/**
 * Signup page selectors
 */
export const signupSelectors = {
  // Form
  signupHeading: 'h1:has-text("Create Account")',
  subheading: 'p:has-text("Start your 14-day free trial")',

  // Fields
  businessNameInput: 'input[name="businessName"]',
  businessNameLabel: 'label:has-text("Business Name")',
  emailInput: 'input[type="email"]',
  emailLabel: 'label:has-text("Email Address")',
  passwordInput: 'input[type="password"]',
  passwordLabel: 'label:has-text("Password")',

  // Buttons
  submitButton: 'button:has-text("Create Account")',
  loadingButton: 'button:has-text("Creating Account")',

  // Links
  signInLink: 'a:has-text("Sign in")',
  logoLink: 'a:has-text("GroomGrid")',

  // Error
  errorMessage: '.bg-red-50',
};

/**
 * Plans page selectors
 */
export const plansSelectors = {
  // Header
  mainHeading: 'h2:has-text("Choose Your Plan")',
  subheading: 'p:has-text("All plans include a 14-day free trial")',

  // Plan cards
  soloPlan: 'text=Solo',
  soloPrice: 'text=$29',
  salonPlan: 'text=Salon',
  salonPrice: 'text=$79',
  enterprisePlan: 'text=Enterprise',
  enterprisePrice: 'text=$149',

  // Features
  soloFeature1Groomer: 'text=1 groomer account',
  soloFeatureUnlimited: 'text=Unlimited clients',
  salonFeature5Groomers: 'text=Up to 5 groomer accounts',
  salonFeatureTeamScheduling: 'text=Team scheduling',
  enterpriseFeatureUnlimited: 'text=Unlimited groomers',
  enterpriseFeatureApi: 'text=API access',

  // Popular badge
  popularBadge: 'text=Popular',

  // Testimonials
  testimonialsSection: 'h3:has-text("Trusted by Professional Groomers")',
  testimonialSarah: 'text=Sarah Mitchell',
  testimonialJames: 'text=James Rodriguez',

  // FAQ
  faqSection: 'h3:has-text("Frequently Asked Questions")',
  faqItem1: 'h4:has-text("What happens after the free trial")',
  faqItem2: 'h4:has-text("Can I change plans later")',
  faqItem3: 'h4:has-text("Is my data secure")',

  // Trust signals
  trustSignals: 'text=Secure Payment',
  cancelAnytime: 'text=Cancel Anytime',

  // Trial info
  trialInfo: 'text=14-day free trial',

  // Sign out
  signOutButton: 'button:has-text("Sign Out")',

  // Logo
  logo: 'text=GroomGrid',
};

/**
 * Payment flow selectors
 */
export const paymentSelectors = {
  // Checkout success
  successHeading: 'h1:has-text("You\'re in")',
  successMessage: 'p:has-text("Your 14-day free trial has started")',
  billingSummary: 'text=Billing Summary',
  planLabel: 'text=Plan:',
  trialInfo: 'text=14-day free trial',
  onboardingButton: 'button:has-text("Set Up Your Account")',
  countdownTimer: 'text=Redirecting automatically',

  // Checkout cancel
  cancelHeading: 'h1:has-text("Payment Cancelled")',
  cancelMessage: 'text=no charge',
  returnButton: 'a:has-text("Return to Plans")',

  // Checkout error
  errorHeading: 'h1:has-text("Payment Failed")',
  errorMessage: 'text=payment was declined',
  tryAgainButton: 'button:has-text("Try Again")',
  supportLink: 'a:has-text("Contact Support")',

  // Trust signals
  securePayment: 'text=Secure Payment',
  cancelAnytime: 'text=Cancel Anytime',
};

/**
 * Onboarding selectors
 */
export const onboardingSelectors = {
  // Progress indicator
  progressStep1: 'text=Client',
  progressStep2: 'text=Appointment',
  progressStep3: 'text=Hours',

  // Step 1: Add client
  clientNameInput: 'input[name="name"]',
  clientNameLabel: 'label:has-text("Client Name")',
  petNameInput: 'input[name="petName"]',
  petNameLabel: 'label:has-text("Pet Name")',
  phoneInput: 'input[name="phone"]',
  phoneLabel: 'label:has-text("Phone")',
  emailInput: 'input[type="email"]',
  emailLabel: 'label:has-text("Email")',
  breedInput: 'input[name="breed"]',
  breedLabel: 'label:has-text("Breed")',
  nextButton: 'button:has-text("Next")',
  skipButton: 'button:has-text("Skip")',

  // Step 2: Book appointment
  serviceLabel: 'text=Service',
  dateLabel: 'text=Date',
  timeLabel: 'text=Time',
  notesInput: 'textarea[name="notes"]',
  notesLabel: 'label:has-text("Notes")',

  // Step 3: Business hours
  businessHoursLabel: 'text=Business Hours',
  mondayToggle: 'text=Monday',
  tuesdayToggle: 'text=Tuesday',
  wednesdayToggle: 'text=Wednesday',
  openLabel: 'text=Open',
  closeLabel: 'text=Close',

  // Completion screen
  completionMessage: 'text=You\'re all set',
  dashboardButton: 'button:has-text("Go to Dashboard")',

  // Error banner
  errorBanner: '.bg-red-50',

  // Skip link
  skipLink: 'button:has-text("Skip this tutorial")',
};

/**
 * Checkout success page selectors
 */
export const checkoutSuccessSelectors = {
  heading: 'h1:has-text("You\'re in")',
  message: 'p:has-text("Your 14-day free trial has started")',
  billingSummary: 'text=Billing Summary',
  planLabel: 'text=Plan:',
  trialInfo: 'text=14-day free trial',
  onboardingButton: 'button:has-text("Set Up Your Account")',
  redirectTimer: 'text=Redirecting automatically',
  securePayment: 'text=Secure Payment',
  cancelAnytime: 'text=Cancel Anytime',
};

/**
 * Checkout cancel page selectors
 */
export const checkoutCancelSelectors = {
  heading: 'h1:has-text("Payment Cancelled")',
  noChargeMessage: 'text=no charge',
  returnToPlansButton: 'a:has-text("Return to Plans")',
};

/**
 * Checkout error page selectors
 */
export const checkoutErrorSelectors = {
  heading: 'h1:has-text("Payment Failed")',
  errorMessage: 'text=payment was declined',
  tryAgainButton: 'button:has-text("Try Again")',
  supportLink: 'a:has-text("Contact Support")',
};

/**
 * Dashboard selectors
 */
export const dashboardSelectors = {
  // Trial banner
  trialBanner: 'text=Free Trial Active',
  trialDaysRemaining: 'text=/day(s) remaining/',
  manageSubscriptionButton: 'a:has-text("Manage Subscription")',

  // Stats cards
  todayStat: 'text=Today',
  appointmentsLabel: 'text=appointment',
  clientsStat: 'text=Clients',
  totalLabel: 'text=total',
  revenueStat: 'text=Revenue',
  thisWeekLabel: 'text=this week',

  // Navigation sidebar
  logo: 'text=GroomGrid',
  todayLink: 'a:has-text("Today")',
  scheduleLink: 'a:has-text("Schedule")',
  clientsLink: 'a:has-text("Clients")',
  settingsLink: 'a:has-text("Settings")',
  signOutButton: 'button:has-text("Sign Out")',

  // Today's appointments
  appointmentsSection: 'h2:has-text("Today\'s Appointments")',
  viewCalendarLink: 'a:has-text("View Calendar")',
  emptyState: 'text=No appointments scheduled for today',
  bookAppointmentButton: 'a:has-text("Book Appointment")',

  // Welcome card
  welcomeCard: 'text=Welcome to GroomGrid',
  welcomeStep1: 'text=Add your first client',
  welcomeStep2: 'text=Book your first appointment',
  welcomeStep3: 'text=Set your business hours',

  // Mobile
  mobileMenuButton: 'button:has-text("Menu")',
  mobileCloseButton: 'button:has-text("X")',
  fab: 'button:has-text("+")',

  // Header
  businessName: 'text=My Business',
};
