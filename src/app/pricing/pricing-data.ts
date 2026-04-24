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
    name: 'Solo',
    type: 'solo',
    price: 29,
    interval: 'monthly',
    stripe_price_id: process.env.STRIPE_PRICE_SOLO || '',
    features: [
      'Unlimited appointments',
      'Client & pet profiles',
      'Automated reminders',
      'Online booking widget',
      'Revenue tracking',
      'Mobile-friendly booking',
    ],
    popular: false,
  },
  {
    id: 'salon',
    name: 'Salon',
    type: 'salon',
    price: 79,
    interval: 'monthly',
    stripe_price_id: process.env.STRIPE_PRICE_SALON || '',
    features: [
      'Everything in Solo',
      'Up to 5 groomers',
      'Team scheduling',
      'Staff performance metrics',
      'Commission tracking',
      'Multi-location support',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'enterprise',
    price: 149,
    interval: 'monthly',
    stripe_price_id: process.env.STRIPE_PRICE_ENTERPRISE || '',
    features: [
      'Everything in Salon',
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
  {
    name: 'Sarah Johnson',
    business: 'Pampered Paws Mobile',
    quote: 'GroomGrid cut my double-booking issues by 90%. The automated reminders alone saved me hundreds in missed appointments.',
  },
  {
    name: 'Mike Rodriguez',
    business: 'Urban Dog Spa',
    quote: 'Managing 5 groomers used to be chaos. With GroomGrid\'s team scheduling, we\'re more efficient and our groomers love it.',
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All plans include a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the end of your current billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use bank-grade encryption and security practices. Your data is backed up daily and never shared with third parties.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. There are no long-term contracts, setup fees, or cancellation penalties. Cancel whenever you want.',
  },
];
