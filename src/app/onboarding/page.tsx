'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProgressIndicator from '@/components/funnel/ProgressIndicator';
import Step1AddClient from '@/components/onboarding/Step1AddClient';
import Step2Appointment from '@/components/onboarding/Step2Appointment';
import Step3BusinessHours from '@/components/onboarding/Step3BusinessHours';
import CompletionScreen from '@/components/onboarding/CompletionScreen';
import { trackOnboardingStep, trackOnboardingSkipped, trackPageView } from '@/lib/ga4';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // State for onboarding data
  const [clientData, setClientData] = useState<any>(null);

  const STEPS = ['Client', 'Appointment', 'Hours'];

  useEffect(() => {
    trackPageView('/onboarding', 'Onboarding');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      checkProfile(session.user.id);
    }
  }, [status, session]);

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
        return;
      }

      if (profile.onboarding_step > 0) {
        setStep(profile.onboarding_step + 1);
      }
    } catch (err) {
      console.error('Profile check failed:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const updateStep = async (step: number) => {
    if (!session?.user?.id) return;
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, onboardingStep: step }),
    });
  };

  const handleStep1Next = (client: any) => {
    setClientData(client);
    updateStep(1);
    trackOnboardingStep(1);
    setStep(2);
  };

  const handleStep2Next = (_appointment: any) => {
    updateStep(2);
    trackOnboardingStep(2);
    setStep(3);
  };

  const handleStep3Next = (_hours: any) => {
    updateStep(3);
    trackOnboardingStep(3);
    setStep(4);
  };

  const handleSkip = async () => {
    if (!session?.user?.id) return;
    trackOnboardingSkipped();
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, onboardingCompleted: true, onboardingStep: 3 }),
    });
    router.push('/dashboard');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {step < 4 && (
          <ProgressIndicator
            currentStep={step}
            totalSteps={3}
            stepLabels={STEPS}
          />
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <Step1AddClient
              onNext={handleStep1Next}
              onSkip={handleSkip}
            />
          )}

          {step === 2 && clientData && (
            <Step2Appointment
              clientName={clientData.name}
              petName={clientData.petName}
              onNext={handleStep2Next}
              onSkip={handleSkip}
            />
          )}

          {step === 3 && (
            <Step3BusinessHours
              onNext={handleStep3Next}
              onSkip={handleSkip}
            />
          )}

          {step === 4 && (
            <CompletionScreen onDashboard={handleGoToDashboard} />
          )}
        </div>

        {/* Skip link at bottom */}
        {step < 4 && (
          <p className="text-center mt-6">
            <button
              onClick={handleSkip}
              className="text-sm text-stone-500 hover:text-green-600 underline"
            >
              Skip this tutorial and go to dashboard
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
