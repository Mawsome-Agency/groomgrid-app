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

// New Onboarding State for 5-step flow
export type BusinessType = 'solo' | 'salon';

export interface OnboardingState {
  currentStep: number;                    // 1–5, persists across refreshes
  businessType: BusinessType | null;      // from step 2
  petName: string | null;                 // from step 3
  breed: string | null;                   // from step 3 (searchable dropdown)
  appointmentDatetime: string | null;     // ISO 8601, from step 3
  clientName: string | null;              // optional, from step 3
  aiSuggestion: AISuggestion | null;      // from step 4 (caches AI result)
  startedAt: string | null;               // ISO 8601, tracks time to completion
  completedAt: string | null;             // ISO 8601, set when ready page completes
}

export interface AISuggestion {
  noShowRisk: 'low' | 'med' | 'high';
  duration: number;                       // minutes
  durationLabel: string;                  // e.g. "60–75 min"
  confidence: number;                     // 0–1
  createdAt: string;                      // ISO 8601 for cache invalidation
}

export interface BreedTiming {
  name: string;
  minMin: number;
  maxMin: number;
  size: 'small' | 'medium' | 'large' | 'giant';
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
