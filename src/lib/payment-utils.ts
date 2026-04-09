import { PlanType } from '@/types';

export interface PlanDetails {
  name: string;
  price: number;
  features: string[];
}

export const PLAN_DETAILS: Record<PlanType, PlanDetails> = {
  solo: {
    name: 'Solo',
    price: 29,
    features: [
      '1 groomer account',
      'Unlimited clients & appointments',
      'Automated reminders',
      'Revenue tracking',
      'Mobile app access',
    ],
  },
  salon: {
    name: 'Salon',
    price: 79,
    features: [
      'Everything in Solo',
      'Up to 5 groomer accounts',
      'Team scheduling',
      'Staff performance metrics',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 149,
    features: [
      'Everything in Salon',
      'Unlimited groomers',
      'Custom branding',
      'API access',
      'Dedicated account manager',
    ],
  },
};

export function getPlanDetails(planType: PlanType): PlanDetails {
  return PLAN_DETAILS[planType];
}

export function formatTrialEndDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isValidPlanType(value: string): value is PlanType {
  return ['solo', 'salon', 'enterprise'].includes(value);
}
