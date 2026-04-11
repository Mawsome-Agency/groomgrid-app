'use client';

/**
 * ABTestProvider - React Context for A/B Testing
 *
 * Provides variant information and tracking functions to the app.
 * Wraps the entire application in layout.tsx
 */

import React, { createContext, useContext } from 'react';
import { getVariant, trackAssignment, type Variant } from '@/lib/ab-test-client';
import { trackABTestAssigned, trackABTestConverted } from '@/lib/ga4';

interface ABTestContextValue {
  getVariant: (testName: string) => Variant;
  trackConversion: (testName: string, event: string, metadata?: Record<string, any>) => Promise<void>;
  userId?: string;
}

const ABTestContext = createContext<ABTestContextValue | undefined>(undefined);

interface ABTestProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function ABTestProvider({ children, userId }: ABTestProviderProps) {
  // Get variant for a test name (pure hash, no DB)
  const getVariantWrapper = (testName: string): Variant => {
    return getVariant(testName, userId);
  };

  // Track conversion via API route (server-side via fetch)
  const trackConversionWrapper = async (
    testName: string,
    event: string,
    metadata?: Record<string, any>
  ): Promise<void> => {
    try {
      await fetch('/api/ab-test/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testName, event, userId, metadata }),
      });
    } catch {
      // Non-critical
    }

    // Track in GA4
    const variant = getVariant(testName, userId);
    trackABTestConverted(testName, variant, event, userId);
  };

  // Record assignment via API when userId is known (fire-and-forget)
  const recordAssignment = async (testName: string): Promise<void> => {
    if (!userId) return;
    const variant = getVariant(testName, userId);
    await trackAssignment(testName, variant, userId);
    trackABTestAssigned(testName, variant, userId);
  };

  const value: ABTestContextValue = {
    getVariant: getVariantWrapper,
    trackConversion: trackConversionWrapper,
    userId,
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest(): ABTestContextValue {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}
