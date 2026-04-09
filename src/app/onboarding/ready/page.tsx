'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, Calendar as CalendarIcon, CheckCircle2, Sparkles } from 'lucide-react';
import MiniCalendar from '@/components/onboarding/MiniCalendar';
import { trackOnboardingStepViewed, trackOnboardingStep, trackOnboardingSkipped } from '@/lib/ga4';
import { useOnboardingState } from '@/hooks/use-onboarding-state';

export default function ReadyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { state, completeOnboarding, resetState } = useOnboardingState();
  const [isBooking, setIsBooking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  useEffect(() => {
    trackOnboardingStepViewed(5);
    
    // Stop celebration after animation
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBookAppointment = async () => {
    if (!state?.petName || !state?.breed || !state?.appointmentDatetime) {
      // No appointment data, skip to dashboard
      handleSkip();
      return;
    }

    setIsBooking(true);

    try {
      // Calculate duration from AI suggestion or default to 60 minutes
      const duration = state?.aiSuggestion?.duration || 60;

      // Create the appointment
      const response = await fetch('/api/onboarding/book-first-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: state.petName,
          breed: state.breed,
          appointmentDatetime: state.appointmentDatetime,
          clientName: state.clientName || undefined,
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const data = await response.json();
      setAppointmentBooked(true);

      // Track first appointment created
      trackOnboardingStep(5);

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

      // Complete onboarding state
      completeOnboarding();
    } catch (err) {
      console.error('Failed to book appointment:', err);
      // Even if booking fails, complete onboarding so they can access dashboard
      handleSkip();
    } finally {
      setIsBooking(false);
    }
  };

  const handleSkip = async () => {
    trackOnboardingSkipped('ready_page');
    
    // Mark onboarding as complete
    completeOnboarding();

    // Update profile
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

  const appointmentDate = state?.appointmentDatetime 
    ? new Date(state.appointmentDatetime)
    : new Date();

  const duration = state?.aiSuggestion?.duration || 60;

  return (
    <div className="space-y-6 py-8">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            You're all set! 🎉
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          {appointmentBooked ? 'Appointment Booked!' : 'Ready to Book?'}
        </h2>
        <p className="text-stone-600">
          {appointmentBooked 
            ? 'Your first smart appointment is on the calendar'
            : 'Review your appointment details below'
          }
        </p>
      </div>

      {/* Mini Calendar */}
      {state?.petName && state?.breed && (
        <MiniCalendar
          appointmentDate={appointmentDate}
          petName={state.petName}
          breed={state.breed}
          duration={duration}
          clientName={state.clientName}
        />
      )}

      {/* Success Message */}
      {appointmentBooked && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Smart appointment created!</p>
              <p className="text-sm text-green-700 mt-1">
                We'll send you a reminder 24 hours before the appointment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {!appointmentBooked && state?.petName ? (
          <button
            onClick={handleBookAppointment}
            disabled={isBooking}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            {isBooking ? 'Booking...' : 'Book This Appointment'}
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push('/schedule')}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <CalendarIcon className="w-5 h-5" />
              Book Another Appointment
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-stone-400 transition-colors font-medium"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Skip option */}
        {!appointmentBooked && (
          <button
            onClick={handleSkip}
            className="w-full text-sm text-stone-500 hover:text-green-600 underline py-2"
          >
            Skip for now
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
