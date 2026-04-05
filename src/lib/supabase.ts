import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

// Lazy client initialization — avoids build-time failures when env vars aren't set
let _supabase: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Keep backward-compatible export for client components
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null as any;

// Helper functions for auth
export async function signUp(email: string, password: string, businessName: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        business_name: businessName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const client = getSupabaseClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getSession() {
  const client = getSupabaseClient();
  const { data: { session }, error } = await client.auth.getSession();
  if (error) throw error;
  return session;
}

// Profile functions
export async function createProfile(userId: string, businessName: string): Promise<Profile> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .insert({
      user_id: userId,
      business_name: businessName,
      plan_type: 'solo',
      subscription_status: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      onboarding_completed: false,
      onboarding_step: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateOnboardingStep(userId: string, step: number): Promise<Profile> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .update({
      onboarding_step: step,
      onboarding_completed: step >= 3,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function skipOnboarding(userId: string, _reason?: string): Promise<Profile> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .update({
      onboarding_step: 3,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function signInWithGoogle(redirectTo?: string) {
  const client = getSupabaseClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  const callbackUrl = redirectTo
    ? `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : `${appUrl}/auth/callback`;

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function resetPassword(email: string) {
  const client = getSupabaseClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  });
  if (error) throw error;
}
