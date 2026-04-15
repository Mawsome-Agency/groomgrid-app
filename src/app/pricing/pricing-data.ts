import { Plan } from '@/types';

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
      'Multi-location support',
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
      'Custom branding',
      'Priority support',
      'API access',
    ],
    popular: false,
  },
];

export interface Testimonial {
  name: string;
  business: string;
  quote: string;
  avatar?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    business: 'Paws & Claws Mobile Grooming',
    quote: 'GroomGrid cut my admin time in half. I used to spend hours every week on scheduling and reminders. Now it just happens.',
  },
  {
    name: 'Mike Rodriguez',
    business: 'The Grooming Lounge',
    quote: 'The team scheduling feature is a game-changer. My 5 groomers can see their schedule from anywhere, and no more double bookings.',
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
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time from your account settings.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use industry-standard encryption and security practices. Your data is backed up daily and never shared with third parties.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. There are no long-term contracts. You can cancel your subscription at any time with no penalties.',
  },
];
