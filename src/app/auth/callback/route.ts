import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`
    );
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Middleware will handle cookie setting in server components
            }
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Determine where to redirect after verification
      // New users go to /plans to pick a subscription, existing users go to dashboard
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user has a profile with a real subscription
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, onboarding_completed')
          .eq('user_id', user.id)
          .single();

        const redirectPath = next !== '/dashboard'
          ? next
          : (profile?.onboarding_completed ? '/dashboard' : '/plans');

        return NextResponse.redirect(`${origin}${redirectPath}`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }

    console.error('Code exchange failed:', exchangeError);
  }

  // Fallback: redirect to login with error message
  return NextResponse.redirect(
    `${origin}/login?error=Could+not+verify+your+email.+Please+try+again.`
  );
}
