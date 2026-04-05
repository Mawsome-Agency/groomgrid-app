'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressIndicator from '@/components/funnel/ProgressIndicator';
import Step1AddClient from '@/components/onboarding/Step1AddClient';
import Step2Appointment from '@/components/onboarding/Step2Appointment';
import Step3BusinessHours from '@/components/onboarding/Step3BusinessHours';
import CompletionScreen from '@/components/onboarding/CompletionScreen';
import { getCurrentUser } from '@/lib/supabase';
import { getProfile, updateOnboardingStep, skipOnboarding } from '@/lib/supabase';
import { trackOnboardingStep, trackOnboardingSkipped, trackPageView } from '@/lib/ga4';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // State for onboarding data
  const [clientData, setClientData] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [hoursData, setHoursData] = useState<any>(null);

  const STEPS = ['Client', 'Appointment', 'Hours'];

  useEffect(() => {
    trackPageView('/onboarding', 'Onboarding');
    checkAuthAndProfile();
  }, []);

  const checkAuthAndProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/signup');
        return;
      }
      setUser(currentUser);

      const profile = await getProfile(currentUser.id);
      if (!profile) {
        router.push('/signup');
        return;
      }

      // If onboarding already completed, redirect to dashboard
      if (profile.onboarding_completed) {
        router.push('/dashboard');
        return;
      }

      // Resume from current step
      if (profile.onboarding_step > 0) {
        setStep(profile.onboarding_step + 1);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/signup');
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Next = (client: any) => {
    setClientData(client);
    updateOnboardingStep(user.id, 1);
    trackOnboardingStep(1);
    setStep(2);
  };

  const handleStep2Next = (appointment: any) => {
    setAppointmentData(appointment);
    updateOnboardingStep(user.id, 2);
    trackOnboardingStep(2);
    setStep(3);
  };

  const handleStep3Next = (hours: any) => {
    setHoursData(hours);
    updateOnboardingStep(user.id, 3);
    trackOnboardingStep(3);
    setStep(4);
  };

  const handleSkip = async () => {
    trackOnboardingSkipped();
    await skipOnboarding(user.id);
    router.push('/dashboard');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
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
