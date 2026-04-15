import { Plan } from '@/types';

export const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    type: 'solo',
    price: 29,
    interval: 'monthly',
    stripe_price_id: '', // Not used on marketing page
    features: [
      '1 groomer account',
      'Unlimited clients & appointments',
      'Automated reminders',
      'Revenue tracking',
      'Mobile app access',
    ],
  },
  {
    id: 'salon',
    name: 'Salon',
    type: 'salon',
    price: 79,
    interval: 'monthly',
    stripe_price_id: '', // Not used on marketing page
    popular: true,
    features: [
      'Everything in Solo',
      'Up to 5 groomer accounts',
      'Team scheduling',
      'Staff performance metrics',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'enterprise',
    price: 149,
    interval: 'monthly',
    stripe_price_id: '', // Not used on marketing page
    features: [
      'Everything in Salon',
      'Unlimited groomers',
      'Custom branding',
      'API access',
      'Dedicated account manager',
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    business: 'Paws on Wheels',
    quote: 'GroomGrid cut my booking time in half. I can focus on dogs, not paperwork.',
  },
  {
    name: 'James Rodriguez',
    business: 'Fur Perfect Salon',
    quote: 'My team loves mobile app. We can check schedules from anywhere and no-shows dropped 40%.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What happens after the free trial?',
    answer: 'After 14 days, you\'ll be charged for your chosen plan. You can cancel anytime before the trial ends with no charge.'
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time from your account settings.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption and your data is backed up daily.'
  },
  {
    question: 'Do I need a credit card to start the free trial?',
    answer: 'No, you can sign up and use GroomGrid for 14 days without entering any payment information.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover.'
  }
];
