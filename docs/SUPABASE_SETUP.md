# Supabase Setup Guide

## Database Schema

Run this SQL in your Supabase SQL editor to set up the required tables.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  phone TEXT,
  plan_type TEXT DEFAULT 'solo' CHECK (plan_type IN ('solo', 'salon', 'enterprise')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'cancelled')),
  trial_ends_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0 CHECK (onboarding_step >= 0 AND onboarding_step <= 3),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow service role to insert profiles
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Allow service role to update profiles
CREATE POLICY "Service role can update profiles"
  ON public.profiles FOR UPDATE
  USING (true);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, business_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Authentication Settings

1. Go to **Authentication > URL Configuration**
2. Set **Site URL** to: `https://getgroomgrid.com`
3. Set **Redirect URLs** to:
   - `https://getgroomgrid.com/auth/callback`
   - `https://localhost:3000/auth/callback` (for development)

## Email Templates

Customize the email templates in **Authentication > Email Templates**:

- **Confirm signup**: Update to match GroomGrid branding
- **Reset password**: Update with company info
