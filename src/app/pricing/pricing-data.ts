import { Plan } from '@/types';

/**
 * Single source of truth for all GroomGrid pricing plans.
 *
 * Used by:
 *   - /plans page (PlanCard, Schema.org markup)
 *   - /signup page (plan selection)
 *   - API checkout routes (plan validation + metadata)
 *   - Any other component that needs plan data
 *
 * When adding or changing plans, also update:
 *   - Schema.org SoftwareApplication markup in src/app/layout.tsx
 *   - Stripe price IDs in .env (STRIPE_PRICE_SOLO, STRIPE_PRICE_SALON, STRIPE_PRICE_ENTERPRISE)
 */
export const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo Groomer',
    type: 'solo',
    price: 29,
    interval: 'monthly',
    stripe_price_id: process.env.STRIPE_PRICE_SOLO || '',
    features: [
      'Unlimited bookings — no per-dog fees',
      'Pet profiles — breed notes, allergies, vaccines in one place',
      'Auto SMS + email reminders — cut no-shows 40%',
      'Online booking widget — clients book themselves',
      'Revenue tracking — know what you earned this week',
      'Mobile-first — built for van life',
    ],
    popular: true,
  },
  {
    id: 'salon',
    name: 'Salon Team',
    type: 'salon',
    price: 79,
    interval: 'monthly',
    stripe_price_id: process.env.STRIPE_PRICE_SALON || '',
    features: [
      'Everything in Solo Groomer',
      'Up to 5 groomers',
      'Team scheduling — auto-balance workload',
      'Staff performance metrics',
      'Commission tracking',
      'Multi-location support',
      'Priority support',
    ],
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Multi-Location',
    type: 'enterprise',
    price: 149,
    interval: 'monthly',
    stripe_price_id: process.env.STRIPE_PRICE_ENTERPRISE || '',
    features: [
      'Everything in Salon Team',
      'Unlimited groomers',
      'Custom branding & white-label',
      'API access',
      'Dedicated account manager',
      '24/7 premium support',
    ],
    popular: false,
  },
];

// Warn at startup if Stripe price IDs are missing (server-side only)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  const missing = PLANS.filter(p => !p.stripe_price_id).map(p => p.id)
  if (missing.length > 0) {
    console.error(
      `[pricing-data] Missing Stripe price IDs for plans: ${missing.join(', ')}. ` +
        'Set STRIPE_PRICE_SOLO, STRIPE_PRICE_SALON, STRIPE_PRICE_ENTERPRISE env vars.'
    )
  }
}

/**
 * Get the Stripe price ID for a plan.
 * Throws a clear error if the env var is not set — prevents cryptic Stripe API errors.
 */
export function getPlanStripeId(planId: string): string {
  const plan = PLANS.find(p => p.id === planId)
  if (!plan) throw new Error(`Unknown plan: ${planId}`)
  if (!plan.stripe_price_id) {
    throw new Error(
      `STRIPE_PRICE_${planId.toUpperCase()} env var is not set. Cannot create checkout session.`
    )
  }
  return plan.stripe_price_id
}

// Prices in cents, derived from PLANS — no manual sync needed.
// Import this in API routes instead of hardcoding local PLAN_DATA objects.
export const PLAN_DATA_CENTS: Record<string, { name: string; price: number }> =
  Object.fromEntries(PLANS.map(p => [p.id, { name: p.name, price: p.price * 100 }]));

export interface Testimonial {
  name: string;
  business: string;
  quote: string;
  avatar?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // Replaced fabricated testimonials with competitor comparison section
  // Real testimonials will be added as paying customers provide them
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Can I import my existing client list?',
    answer: 'Yes. Upload a CSV spreadsheet or add clients one by one during setup. Most groomers are up and running in under 5 minutes.',
  },
  {
    question: 'Will it work on my phone in the van?',
    answer: 'Yes. GroomGrid is mobile-first — designed for groomers who book between appointments, one-handed, from their van.',
  },
  {
    question: 'What happens after the 14-day trial?',
    answer: 'Pick a plan. Solo Groomer is $29/mo — less than one no-show appointment. No surprises, no hidden fees.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. No contracts, no cancellation fees. You can also export all your client and pet data if you decide to leave.',
  },
  {
    question: 'How does GroomGrid compare to MoeGo?',
    answer: 'MoeGo charges $129/mo for comparable features. GroomGrid Solo is $29/mo — that\'s $100/mo back in your pocket. Same automated reminders, same booking features, built specifically for mobile groomers.',
  },
];
