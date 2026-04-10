'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProgressIndicator from '@/components/funnel/ProgressIndicator';
import Step1AddClient from '@/components/onboarding/Step1AddClient';
import Step2Appointment from '@/components/onboarding/Step2Appointment';
import Step3BusinessHours, { BusinessHoursForm } from '@/components/onboarding/Step3BusinessHours';
import CompletionScreen from '@/components/onboarding/CompletionScreen';
import { trackOnboardingStep, trackOnboardingSkipped, trackPageView, trackOnboardingCompleted } from '@/lib/ga4';

// Days in the order the business-hours API expects (index 0 = Sunday)
const DAYS_API_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stepLoading, setStepLoading] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  // Ref to track onboarding event fired state - prevents duplicate fires from React strict mode
  const onboardingEventFired = useRef(false);

  // State for onboarding data — includes API-returned ids after Step 1
  const [clientData, setClientData] = useState<{
    name: string;
    petName: string;
    phone?: string;
    email?: string;
    breed?: string;
    id?: string;
    petId?: string;
  } | null>(null);

  const STEPS = ['Client', 'Appointment', 'Hours'];

  useEffect(() => {
    trackPageView('/onboarding', 'Onboarding');
  }, []);

  // Track onboarding completion when step transitions to 4 (completion screen)
  // Uses ref guard to prevent duplicate fires from React strict mode
  useEffect(() => {
    if (step === 4 && !onboardingEventFired.current && session?.user?.id) {
      trackOnboardingCompleted(session.user.id);
      onboardingEventFired.current = true;
    }
  }, [step, session]);

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

  const updateProfileStep = async (step: number, completed = false) => {
    if (!session?.user?.id) return;
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        onboardingStep: step,
        ...(completed && { onboardingCompleted: true }),
      }),
    });
  };

  // ── Step 1: Create client + pet ────────────────────────────────────────────
  const handleStep1Next = async (client: {
    name: string;
    phone: string;
    email: string;
    petName: string;
    breed: string;
  }) => {
    setStepError(null);
    setStepLoading(true);
    try {
      // 1a. Create the client record
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: client.name, email: client.email, phone: client.phone }),
      });

      if (!clientRes.ok) {
        const err = await clientRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create client');
      }

      const { client: savedClient } = await clientRes.json();

      // 1b. Create the pet record (optional — only if a pet name was given)
      let savedPetId: string | undefined;
      if (client.petName) {
        const petRes = await fetch(`/api/clients/${savedClient.id}/pets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: client.petName, breed: client.breed }),
        });

        if (petRes.ok) {
          const { pet } = await petRes.json();
          savedPetId = pet.id;
        }
        // Non-fatal if pet creation fails — appointment step will handle missing petId gracefully
      }

      setClientData({ ...client, id: savedClient.id, petId: savedPetId });
      await updateProfileStep(1);
      trackOnboardingStep(1);
      setStep(2);
    } catch (err) {
      console.error('Step 1 failed:', err);
      setStepError(err instanceof Error ? err.message : 'Failed to save client. Please try again.');
    } finally {
      setStepLoading(false);
    }
  };

  // ── Step 2: Create appointment ─────────────────────────────────────────────
  const handleStep2Next = async (appointment: {
    service: string;
    date: string;
    time: string;
    notes: string;
  }) => {
    setStepError(null);
    setStepLoading(true);
    try {
      if (!clientData?.id) throw new Error('Client data is missing — please restart onboarding');

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientData.id,
          petId: clientData.petId,
          service: appointment.service,
          date: appointment.date,
          time: appointment.time,
          notes: appointment.notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create appointment');
      }

      await updateProfileStep(2);
      trackOnboardingStep(2);
      setStep(3);
    } catch (err) {
      console.error('Step 2 failed:', err);
      setStepError(err instanceof Error ? err.message : 'Failed to save appointment. Please try again.');
    } finally {
      setStepLoading(false);
    }
  };

  // ── Step 3: Save business hours ────────────────────────────────────────────
  const handleStep3Next = async (hours: BusinessHoursForm) => {
    setStepError(null);
    setStepLoading(true);
    try {
      // API expects an array indexed 0–6 where 0 = Sunday
      const hoursArray = DAYS_API_ORDER.map((day) => ({
        enabled: hours[day].enabled,
        open: hours[day].open,
        close: hours[day].close,
      }));

      const res = await fetch('/api/business-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: hoursArray }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save business hours');
      }

      // Mark onboarding complete
      await updateProfileStep(3, true);
      trackOnboardingStep(3);
      setStep(4);
    } catch (err) {
      console.error('Step 3 failed:', err);
      setStepError(err instanceof Error ? err.message : 'Failed to save business hours. Please try again.');
    } finally {
      setStepLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!session?.user?.id) return;

    // Guard: only fire skip event if onboarding completed hasn't been fired
    // Ensures onboarding_completed and onboarding_skipped are mutually exclusive
    if (!onboardingEventFired.current) {
      trackOnboardingSkipped();
      onboardingEventFired.current = true;
    }

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
          {/* Step-level error banner */}
          {stepError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {stepError}
            </div>
          )}

          {step === 1 && (
            <Step1AddClient
              onNext={handleStep1Next}
              onSkip={handleSkip}
              isLoading={stepLoading}
            />
          )}

          {step === 2 && clientData && (
            <Step2Appointment
              clientName={clientData.name}
              petName={clientData.petName}
              onNext={handleStep2Next}
              onSkip={handleSkip}
              isLoading={stepLoading}
            />
          )}

          {step === 3 && (
            <Step3BusinessHours
              onNext={handleStep3Next}
              onSkip={handleSkip}
              isLoading={stepLoading}
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
