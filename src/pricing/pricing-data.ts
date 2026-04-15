export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo Groomer',
    price: 29,
    description: 'Perfect for independent mobile groomers',
    features: [
      'Unlimited appointments',
      'Client & pet profiles',
      'Automated reminders',
      'Online booking widget',
      'Basic reporting',
      'Email support'
    ]
  },
  {
    id: 'salon',
    name: 'Salon Pro',
    price: 79,
    description: 'For established grooming salons',
    popular: true,
    features: [
      'Everything in Solo',
      'Team management',
      'Staff scheduling',
      'Commission tracking',
      'Advanced reporting',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    description: 'For large grooming businesses',
    features: [
      'Everything in Salon Pro',
      'Multi-location support',
      'Custom integrations',
      'Dedicated account manager',
      'White-label branding',
      '24/7 premium support'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Mobile Groomer',
    company: 'Pampered Paws Mobile',
    content: 'GroomGrid cut my double-booking issues by 90%. The automated reminders alone saved me hundreds in missed appointments.'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Salon Owner',
    company: 'Urban Dog Spa',
    content: 'Managing 3 groomers used to be chaos. With GroomGrid\'s team scheduling, we\'re more efficient and our groomers love it.'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Do I need to enter a credit card to start the trial?',
    answer: 'No. You can use GroomGrid for 14 days completely free with no credit card required. We only ask for payment information when you decide to continue.'
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the end of your current billing period.'
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No. There are no setup fees, cancellation fees, or hidden charges. Just the monthly subscription price shown above.'
  },
  {
    question: 'What happens after my trial ends?',
    answer: 'If you\'ve entered payment information, your subscription will automatically begin. If not, you\'ll lose access until you subscribe.'
  },
  {
    question: 'How secure is my data?',
    answer: 'We use bank-grade encryption and security practices. Your data is backed up daily and never shared with third parties.'
  }
];
