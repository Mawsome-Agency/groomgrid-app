'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollDepthOptions {
  /**
   * Percentage thresholds to track (e.g., [25, 50, 75, 100])
   * @default [25, 50, 75, 100]
   */
  thresholds?: number[];
  /**
   * Whether to track scroll depth
   * @default true
   */
  enabled?: boolean;
  /**
   * Callback fired when a threshold is reached
   */
  onThresholdReached?: (depth: number) => void;
}

interface ScrollDepthResult {
  /**
   * Current scroll depth percentage (0-100)
   */
  currentDepth: number;
  /**
   * Maximum scroll depth reached during session
   */
  maxDepth: number;
  /**
   * Thresholds that have been reached
   */
  reachedThresholds: Set<number>;
}

/**
 * Hook to track scroll depth on a page
 * 
 * @example
 * ```tsx
 * const { currentDepth, maxDepth, reachedThresholds } = useScrollDepth({
 *   thresholds: [25, 50, 75, 100],
 *   onThresholdReached: (depth) => {
 *     console.log(`User scrolled to ${depth}%`);
 *   }
 * });
 * ```
 */
export function useScrollDepth(options: ScrollDepthOptions = {}): ScrollDepthResult {
  const {
    thresholds = [25, 50, 75, 100],
    enabled = true,
    onThresholdReached,
  } = options;

  const [currentDepth, setCurrentDepth] = useState(0);
  const [maxDepth, setMaxDepth] = useState(0);
  const [reachedThresholds, setReachedThresholds] = useState<Set<number>>(new Set());
  
  const trackedThresholdsRef = useRef<Set<number>>(new Set());
  const rafRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleScroll = () => {
      // Cancel any pending RAF to avoid stacking
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Calculate scroll depth percentage
        const depth = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
        
        setCurrentDepth(depth);
        
        // Update max depth
        setMaxDepth((prevMax) => Math.max(prevMax, depth));
        
        // Check thresholds
        thresholds.forEach((threshold) => {
          if (depth >= threshold && !trackedThresholdsRef.current.has(threshold)) {
            trackedThresholdsRef.current.add(threshold);
            setReachedThresholds((prev) => new Set([...Array.from(prev), threshold]));
            onThresholdReached?.(threshold);
          }
        });
      });
    };

    // Initial check
    handleScroll();

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, thresholds, onThresholdReached]);

  return {
    currentDepth,
    maxDepth,
    reachedThresholds,
  };
}
