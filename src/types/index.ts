// User and Auth Types
export interface User {
  id: string;
  email: string;
  business_name: string;
  created_at: string;
  email_confirmed_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  business_name: string;
  phone?: string;
  plan_type: 'solo' | 'salon' | 'enterprise';
  subscription_status: 'trial' | 'active' | 'past_due' | 'cancelled';
  trial_ends_at?: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

// Plan Types
export type PlanType = 'solo' | 'salon' | 'enterprise';

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  interval: 'monthly';
  stripe_price_id: string;
  features: string[];
  popular?: boolean;
}

// Onboarding Types
export interface OnboardingData {
  user_id: string;
  step: number;
  completed: boolean;
  skipped_at?: string;
  client_added?: boolean;
  appointment_created?: boolean;
  business_hours_set?: boolean;
  skip_reason?: string;
}

// GA4 Event Types
export interface GA4Event {
  name: string;
  params: Record<string, any>;
}

// Error Types
export interface AuthError {
  message: string;
  code?: string;
}
