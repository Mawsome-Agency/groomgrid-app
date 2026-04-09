'use client';

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';

interface OnboardingLayoutProps {
  children: ReactNode;
  params: { step?: string[] };
}

// Map route steps to numbers
const STEP_MAPPING: Record<string, number> = {
  'welcome': 1,
  'business-type': 2,
  'first-appointment': 3,
  'ai-magic': 4,
  'ready': 5,
};

export default function OnboardingLayout({ children, params }: OnboardingLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check authentication
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center text-stone-600">Loading...</div>
      </div>
    );
  }

  // Get current step from route
  const routeStep = params.step?.[0];
  const currentStep = routeStep ? STEP_MAPPING[routeStep] : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <OnboardingProgressBar currentStep={currentStep} totalSteps={5} />
      <main className="pt-16 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
