'use client';

/**
 * ABTestProvider - React Context for A/B Testing
 *
 * Provides variant information and tracking functions to the app.
 * Wraps the entire application in layout.tsx
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getVariant, getOrCreateAssignment, type Variant, trackConversion } from '@/lib/ab-test';
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
  const [trackedTests, setTrackedTests] = useState<Set<string>>(new Set());

  // Get variant for a test name
  const getVariantWrapper = (testName: string): Variant => {
    return getVariant(testName, userId);
  };

  // Track conversion for a test
  const trackConversionWrapper = async (
    testName: string,
    event: string,
    metadata?: Record<string, any>
  ): Promise<void> => {
    // Track in local database
    await trackConversion(testName, userId || 'anonymous', event, metadata);

    // Track in GA4
    const variant = getVariant(testName, userId);
    trackABTestConverted(testName, variant, event, userId);
  };

  // Track assignment when user first sees a test (idempotent)
  useEffect(() => {
    if (userId && trackedTests.size > 0) {
      trackedTests.forEach(async (testName) => {
        const assignment = await getOrCreateAssignment(testName, userId);
        if (assignment) {
          trackABTestAssigned(testName, assignment.variant, userId);
        }
      });
      setTrackedTests(new Set());
    }
  }, [userId, trackedTests]);

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
