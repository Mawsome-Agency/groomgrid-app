'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface EngagementTimeOptions {
  /**
   * Whether to track engagement time
   * @default true
   */
  enabled?: boolean;
  /**
   * Interval in milliseconds to update engagement time
   * @default 1000 (1 second)
   */
  updateInterval?: number;
  /**
   * Callback fired at each interval with current engagement time
   */
  onTimeUpdate?: (engagementTime: number) => void;
  /**
   * Callback fired when user becomes inactive
   */
  onInactive?: (engagementTime: number) => void;
  /**
   * Callback fired when user becomes active again
   */
  onActive?: (engagementTime: number) => void;
  /**
   * Time in milliseconds of inactivity before user is considered inactive
   * @default 30000 (30 seconds)
   */
  inactivityThreshold?: number;
}

interface EngagementTimeResult {
  /**
   * Total engagement time in milliseconds
   */
  engagementTime: number;
  /**
   * Whether user is currently active
   */
  isActive: boolean;
  /**
   * Time since last activity in milliseconds
   */
  timeSinceLastActivity: number;
  /**
   * Reset engagement time to zero
   */
  reset: () => void;
}

/**
 * Hook to track user engagement time on a page
 * 
 * Tracks time user is actively engaged (not idle) with the page.
 * Automatically pauses when user is inactive (no mouse/keyboard/touch events).
 * 
 * @example
 * ```tsx
 * const { engagementTime, isActive, reset } = useEngagementTime({
 *   onTimeUpdate: (time) => {
 *     console.log(`Engaged for ${time}ms`);
 *   }
 * });
 * ```
 */
export function useEngagementTime(options: EngagementTimeOptions = {}): EngagementTimeResult {
  const {
    enabled = true,
    updateInterval = 1000,
    onTimeUpdate,
    onInactive,
    onActive,
    inactivityThreshold = 30000,
  } = options;

  const [engagementTime, setEngagementTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [timeSinceLastActivity, setTimeSinceLastActivity] = useState(0);

  const engagementTimeRef = useRef(0);
  const isActiveRef = useRef(true);
  const lastActivityTimeRef = useRef(Date.now());
  const intervalRef = useRef<number | null>(null);
  const inactivityCheckRef = useRef<number | null>(null);

  // Reset engagement time
  const reset = useCallback(() => {
    engagementTimeRef.current = 0;
    setEngagementTime(0);
    lastActivityTimeRef.current = Date.now();
    setTimeSinceLastActivity(0);
  }, []);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();
    lastActivityTimeRef.current = now;
    setTimeSinceLastActivity(0);

    // If user was inactive, mark as active
    if (!isActiveRef.current) {
      isActiveRef.current = true;
      setIsActive(true);
      onActive?.(engagementTimeRef.current);
    }
  }, [enabled, onActive]);

  // Set up activity listeners
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, handleActivity]);

  // Main engagement timer
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = window.setInterval(() => {
      // Update time since last activity
      const now = Date.now();
      const timeSinceActivity = now - lastActivityTimeRef.current;
      setTimeSinceLastActivity(timeSinceActivity);

      // Check if user is inactive
      if (timeSinceActivity > inactivityThreshold && isActiveRef.current) {
        isActiveRef.current = false;
        setIsActive(false);
        onInactive?.(engagementTimeRef.current);
      }

      // Only increment engagement time if user is active
      if (isActiveRef.current) {
        engagementTimeRef.current += updateInterval;
        setEngagementTime(engagementTimeRef.current);
        onTimeUpdate?.(engagementTimeRef.current);
      }
    }, updateInterval);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, updateInterval, onTimeUpdate, onInactive, inactivityThreshold]);

  return {
    engagementTime,
    isActive,
    timeSinceLastActivity,
    reset,
  };
}
