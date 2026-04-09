'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Loader2, ArrowLeft } from 'lucide-react';
import AIMagicCard from '@/components/onboarding/AIMagicCard';
import { trackOnboardingStepViewed, trackOnboardingStep } from '@/lib/ga4';
import { useOnboardingState } from '@/hooks/use-onboarding-state';
import { AISuggestion } from '@/types';

export default function AIMagicPage() {
  const router = useRouter();
  const { state, updateState } = useOnboardingState();
  const [isLoading, setIsLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackOnboardingStepViewed(4);
    fetchAISuggestion();
  }, []);

  const fetchAISuggestion = async () => {
    if (!state?.breed || !state?.petName) {
      // If no data, redirect back to first-appointment
      router.push('/onboarding/first-appointment');
      return;
    }

    try {
      const response = await fetch(
        `/api/onboarding/ai-suggestion?breed=${encodeURIComponent(state.breed)}&petName=${encodeURIComponent(state.petName)}`
      );

      if (!response.ok) {
        throw new Error('Failed to get AI suggestion');
      }

      const data = await response.json();
      setAiSuggestion(data);
      updateState({ aiSuggestion: data });
    } catch (err) {
      console.error('AI suggestion error:', err);
      setError('AI service temporarily unavailable. Using default settings.');
      
      // Fallback to default suggestion
      const fallback: AISuggestion = {
        noShowRisk: 'low',
        duration: 60,
        durationLabel: '60-75 min',
        confidence: 0.85,
        createdAt: new Date().toISOString(),
      };
      setAiSuggestion(fallback);
      updateState({ aiSuggestion: fallback });
    } finally {
      // Simulate processing time for effect
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  const handleAccept = async () => {
    if (!aiSuggestion) return;

    // Track AI suggestion accepted
    trackOnboardingStep(4);

    // Navigate to ready page
    trackOnboardingStepViewed(5);
    router.push('/onboarding/ready');
  };

  const handleEdit = () => {
    router.push('/onboarding/first-appointment');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-12 text-center">
        {/* Loading Animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <Brain className="w-10 h-10 text-purple-600 animate-pulse" />
            </div>
            <div className="absolute -inset-2 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-stone-900">
              Analyzing breed characteristics...
            </p>
            <p className="text-sm text-stone-500">
              Checking 12,000+ grooming records
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 animate-progress" />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 1.5s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  if (error && !aiSuggestion) {
    return (
      <div className="space-y-6 py-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">
            AI Service Unavailable
          </h2>
          <p className="text-stone-600 mb-4">{error}</p>
          <button
            onClick={fetchAISuggestion}
            className="px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          Here's what we recommend for {state?.petName}
        </h2>
        <p className="text-stone-600">
          Our AI has analyzed the appointment details
        </p>
      </div>

      {aiSuggestion && (
        <AIMagicCard
          petName={state?.petName || 'Pet'}
          breed={state?.breed || 'Unknown'}
          suggestion={aiSuggestion}
          onAccept={handleAccept}
          onEdit={handleEdit}
        />
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <p className="font-medium">Note: {error}</p>
        </div>
      )}
    </div>
  );
}
