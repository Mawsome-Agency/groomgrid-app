export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          phone: string | null
          plan_type: 'solo' | 'salon' | 'enterprise'
          subscription_status: 'trial' | 'active' | 'past_due' | 'cancelled'
          trial_ends_at: string | null
          onboarding_completed: boolean
          onboarding_step: number
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          phone?: string | null
          plan_type?: 'solo' | 'salon' | 'enterprise'
          subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled'
          trial_ends_at?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          phone?: string | null
          plan_type?: 'solo' | 'salon' | 'enterprise'
          subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled'
          trial_ends_at?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
