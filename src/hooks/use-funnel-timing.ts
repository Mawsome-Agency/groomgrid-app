/**
 * Hook for tracking funnel step timing
 *
 * Records how long users spend on each step of the funnel.
 */

import { useEffect, useRef } from 'react';
import { trackStepDuration } from '@/lib/funnel-tracking';

interface StepTimingOptions {
  stepName: string;
  stepNumber: number;
  enabled?: boolean;
}

export function useFunnelTiming(
  options: StepTimingOptions
) {
  const { stepName, stepNumber, enabled = true } = options;
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Record start time when component mounts
    startTimeRef.current = Date.now();

    return () => {
      // Track duration when component unmounts (step completed/abandoned)
      if (startTimeRef.current) {
        const durationMs = Date.now() - startTimeRef.current;
        trackStepDuration(stepName, stepNumber, durationMs);
      }
    };
  }, [stepName, stepNumber, enabled]);

  /**
   * Manually record step completion (useful for multi-step forms)
   */
  const recordStepCompletion = () => {
    if (startTimeRef.current) {
      const durationMs = Date.now() - startTimeRef.current;
      trackStepDuration(stepName, stepNumber, durationMs);
      // Reset timer for next step
      startTimeRef.current = Date.now();
    }
  };

  return { recordStepCompletion };
}

/**
 * Hook for tracking API call timing
 */
export function useApiTiming(apiEndpoint: string) {
  const startTimeRef = useRef<number | null>(null);

  const startTiming = () => {
    startTimeRef.current = Date.now();
  };

  const endTiming = (success: boolean, errorType?: string): number => {
    if (startTimeRef.current) {
      const durationMs = Date.now() - startTimeRef.current;
      // Import dynamically to avoid circular dependency
      import('@/lib/funnel-tracking').then(({ trackApiTiming }) => {
        trackApiTiming(apiEndpoint, durationMs, success, errorType);
      });
      startTimeRef.current = null;
      return durationMs;
    }
    return 0;
  };

  return { startTiming, endTiming };
}
