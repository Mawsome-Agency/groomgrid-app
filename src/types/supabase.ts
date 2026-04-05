export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          phone?: string;
          plan_type: 'solo' | 'salon' | 'enterprise';
          subscription_status: 'trial' | 'active' | 'past_due' | 'cancelled';
          trial_ends_at?: string;
          onboarding_completed: boolean;
          onboarding_step: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          phone?: string;
          plan_type?: 'solo' | 'salon' | 'enterprise';
          subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled';
          trial_ends_at?: string;
          onboarding_completed?: boolean;
          onboarding_step?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          phone?: string;
          plan_type?: 'solo' | 'salon' | 'enterprise';
          subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled';
          trial_ends_at?: string;
          onboarding_completed?: boolean;
          onboarding_step?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
