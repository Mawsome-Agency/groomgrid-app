'use client';

/**
 * ABTestVariant - Component for Rendering A/B Test Variants
 *
 * Renders one of two variants based on assignment.
 * Simple wrapper for conditionally showing different UI elements.
 */

import React, { useEffect, useState } from 'react';
import { useABTest } from './ABTestProvider';
import { getOrCreateAssignment, type Variant } from '@/lib/ab-test';
import { trackABTestAssigned } from '@/lib/ga4';

interface ABTestVariantProps<T = any> {
  test: string;
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  fallback?: React.ReactNode;
  children?: (variant: Variant) => React.ReactNode;
}

export function ABTestVariant<T = any>({
  test,
  variantA,
  variantB,
  fallback,
  children,
}: ABTestVariantProps<T>) {
  const { getVariant, trackConversion: trackConversionContext, userId } = useABTest();
  const [hasTracked, setHasTracked] = useState(false);

  const variant = getVariant(test);

  // Track assignment on first render (for authenticated users)
  useEffect(() => {
    if (userId && !hasTracked) {
      getOrCreateAssignment(test, userId).then((assignment) => {
        if (assignment) {
          trackABTestAssigned(test, assignment.variant, userId);
        }
      });
      setHasTracked(true);
    }
  }, [test, userId, hasTracked]);

  // Render using children function if provided
  if (typeof children === 'function') {
    return <>{children(variant)}</>;
  }

  // Render the appropriate variant
  if (variant === 'A') {
    return <>{variantA}</>;
  } else if (variant === 'B') {
    return <>{variantB}</>;
  }

  // Fallback if something goes wrong
  return <>{fallback || variantA}</>;
}
