'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Onboarding Redirect Guard
 *
 * This page serves as a backward compatibility redirect.
 * - If onboarding is complete, redirect to dashboard
 * - If onboarding is not complete, redirect to welcome page
 * - If not authenticated, redirect to login
 *
 * The new onboarding flow uses sub-routes (/onboarding/welcome, etc.)
 */
export default function OnboardingRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      checkProfile(session.user.id);
    }
  }, [status, session, router]);

  const checkProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`);
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      const profile = data.profile;

      if (!profile) {
        router.push('/login');
        return;
      }

      if (profile.onboarding_completed) {
        router.push('/dashboard');
      } else {
        // Redirect to new onboarding flow
        router.push('/onboarding/welcome');
      }
    } catch (err) {
      console.error('Profile check failed:', err);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
      <div className="text-center text-stone-600">Loading...</div>
    </div>
  );
}
