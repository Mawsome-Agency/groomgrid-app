'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, X } from 'lucide-react';
import ConfettiAnimation from '@/components/onboarding/ConfettiAnimation';
import { trackOnboardingStepViewed, trackOnboardingSkipped } from '@/lib/ga4';
import { useOnboardingState } from '@/hooks/use-onboarding-state';

export default function WelcomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showConfetti, setShowConfetti] = useState(true);
  const { updateState, completeOnboarding } = useOnboardingState();

  useEffect(() => {
    // Track this step
    trackOnboardingStepViewed(1);

    // Initialize onboarding state with start time
    updateState({
      currentStep: 1,
      startedAt: new Date().toISOString(),
    });

    // Stop confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [updateState]);

  const handleGetStarted = () => {
    trackOnboardingStepViewed(2);
    router.push('/onboarding/business-type');
  };

  const handleSkip = async () => {
    trackOnboardingSkipped('welcome_page');
    
    // Mark onboarding as complete
    completeOnboarding();
    
    // Update profile to mark onboarding complete
    if (session?.user?.id) {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: session.user.id, 
          onboardingCompleted: true,
          onboardingStep: 5 
        }),
      });
    }
    
    router.push('/dashboard');
  };

  const userName = session?.user?.name || 'there';

  return (
    <>
      <ConfettiAnimation active={showConfetti} />
      
      <div className="text-center space-y-6 py-8">
        {/* Skip button */}
        <div className="flex justify-end">
          <button
            onClick={handleSkip}
            className="text-sm text-stone-500 hover:text-green-600 underline flex items-center gap-1"
            aria-label="Skip onboarding and go to dashboard"
          >
            Take me to the dashboard
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Celebration Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <span className="text-5xl" role="img" aria-label="celebration">
            🎉
          </span>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Welcome to GroomGrid, {userName}!
          </h1>
          <p className="text-lg text-stone-600">
            You're 2 minutes away from your first smart appointment
          </p>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-br from-green-50 to-stone-50 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold">🐕</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-stone-900">Breed-Specific Timing</h3>
              <p className="text-sm text-stone-600">AI estimates grooming time based on breed</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold">📅</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-stone-900">Smart Scheduling</h3>
              <p className="text-sm text-stone-600">Optimize your day with intelligent slot suggestions</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold">✅</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-stone-900">No-Show Prediction</h3>
              <p className="text-sm text-stone-600">Know which appointments might not show up</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Let's Get Started
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Accessibility announcement */}
        <div className="sr-only" role="status" aria-live="polite">
          Payment successful! Welcome to GroomGrid. You can start your onboarding or skip to the dashboard.
        </div>
      </div>
    </>
  );
}
