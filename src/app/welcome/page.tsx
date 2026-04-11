export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, ArrowRight, Calendar, Bell, Users, Sparkles } from 'lucide-react';
import { trackWelcomeViewed } from '@/lib/ga4';

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch business name and mark welcome as shown
  useEffect(() => {
    let isMounted = true;

    const initializePage = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();

        // Check if welcome was already shown - if so, redirect to plans
        if (data.welcomeShown) {
          router.replace('/plans');
          return;
        }

        if (isMounted) {
          setBusinessName(data.businessName || 'your business');
          setLoading(false);

          // Track GA4 event
          if (session?.user?.id) {
            trackWelcomeViewed(session.user.id, data.businessName || '');
          }

          // Mark welcome as shown in profile
          await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ welcomeShown: true }),
          });
        }
      } catch (err) {
        console.error('Failed to initialize welcome page:', err);
        // Continue anyway to avoid blocking users
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializePage();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [session, router]);

  // Prevent browser back button from returning to welcome page
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      // Redirect to plans instead of going back
      router.replace('/plans');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  // Set focus to CTA button for keyboard navigation
  useEffect(() => {
    if (!loading && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [loading]);

  // Redirect to plans if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleContinue = () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    router.push('/plans');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleContinue();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">GroomGrid</h1>
          <span className="text-sm text-stone-500">14-day free trial</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 animate-bounce" aria-hidden="true">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to GroomGrid, {businessName}!
            </h1>
            <p className="text-xl text-green-50">
              Your account is ready. Let's get your grooming business running smoothly.
            </p>
          </div>
        </div>

        {/* Value Props */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-green-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-stone-900">What you'll love</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-4" aria-hidden="true">
                <Calendar className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Smart Scheduling</h3>
              <p className="text-stone-600 text-sm">
                Book appointments in seconds, avoid double bookings, and manage your calendar effortlessly.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-4" aria-hidden="true">
                <Bell className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Automated Reminders</h3>
              <p className="text-stone-600 text-sm">
                Reduce no-shows by up to 60% with automatic SMS and email reminders.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-4" aria-hidden="true">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Client Management</h3>
              <p className="text-stone-600 text-sm">
                Keep pet profiles, grooming history, and preferences all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Trial Information */}
        <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl p-6 mb-8 border border-stone-200">
          <p className="text-center text-stone-700">
            <strong className="text-green-600">Start your 14-day free trial</strong> — no credit card required.
            Cancel anytime before trial ends with no charge.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            ref={buttonRef}
            onClick={handleContinue}
            onKeyDown={handleKeyDown}
            disabled={isRedirecting}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-xl hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Continue to plan selection"
          >
            {isRedirecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                Loading...
              </>
            ) : (
              <>
                Choose Your Plan <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
