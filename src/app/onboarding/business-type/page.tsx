'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, Truck, Store } from 'lucide-react';
import { trackOnboardingStepViewed, trackOnboardingStep } from '@/lib/ga4';
import { useOnboardingState } from '@/hooks/use-onboarding-state';
import { BusinessType } from '@/types';

export default function BusinessTypePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { updateState } = useOnboardingState();
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    trackOnboardingStepViewed(2);
  }, []);

  const handleSelect = async (businessType: BusinessType) => {
    if (isSelecting) return; // Prevent double-tap
    setIsSelecting(true);

    // Update local state
    updateState({ 
      businessType,
      currentStep: 2 
    });

    // Track completion
    trackOnboardingStep(2);

    // Update profile
    if (session?.user?.id) {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: session.user.id, 
          planType: businessType,
          onboardingStep: 2 
        }),
      });
    }

    // Navigate to next step
    trackOnboardingStepViewed(3);
    router.push('/onboarding/first-appointment');
  };

  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
          How do you work?
        </h2>
        <p className="text-stone-600">
          Select your business type to personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Solo Groomer Card */}
        <button
          onClick={() => handleSelect('solo')}
          disabled={isSelecting}
          className={`
            group relative p-6 rounded-2xl border-2 text-left
            transition-all duration-300 ease-out
            ${isSelecting 
              ? 'opacity-50 cursor-not-allowed border-stone-200' 
              : 'border-stone-200 hover:border-green-500 hover:shadow-lg hover:scale-105'
            }
          `}
          aria-label="Select solo groomer"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`
              w-16 h-16 rounded-xl flex items-center justify-center
              transition-colors
              ${isSelecting ? 'bg-stone-100' : 'bg-green-100 group-hover:bg-green-200'}
            `}>
              <Truck className={`
                w-8 h-8
                ${isSelecting ? 'text-stone-500' : 'text-green-600 group-hover:text-green-700'}
              `} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                Solo Groomer
              </h3>
              <p className="text-sm text-stone-500">Just me</p>
            </div>
          </div>
          <p className="text-sm text-stone-600">
            Perfect for mobile groomers working independently
          </p>
        </button>

        {/* Salon Owner Card */}
        <button
          onClick={() => handleSelect('salon')}
          disabled={isSelecting}
          className={`
            group relative p-6 rounded-2xl border-2 text-left
            transition-all duration-300 ease-out
            ${isSelecting 
              ? 'opacity-50 cursor-not-allowed border-stone-200' 
              : 'border-stone-200 hover:border-green-500 hover:shadow-lg hover:scale-105'
            }
          `}
          aria-label="Select salon owner"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`
              w-16 h-16 rounded-xl flex items-center justify-center
              transition-colors
              ${isSelecting ? 'bg-stone-100' : 'bg-green-100 group-hover:bg-green-200'}
            `}>
              <Store className={`
                w-8 h-8
                ${isSelecting ? 'text-stone-500' : 'text-green-600 group-hover:text-green-700'}
              `} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                Salon Owner
              </h3>
              <p className="text-sm text-stone-500">2-5 groomers</p>
            </div>
          </div>
          <p className="text-sm text-stone-600">
            For brick-and-mortar salons with a team
          </p>
        </button>
      </div>

      {/* Skip option */}
      <div className="text-center pt-4">
        <button
          onClick={() => router.push('/onboarding/first-appointment')}
          className="text-sm text-stone-500 hover:text-green-600 underline"
        >
          Actually, I want to skip this
        </button>
      </div>
    </div>
  );
}
