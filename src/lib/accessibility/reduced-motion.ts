/**
 * Reduced motion utilities for respecting user preferences
 */

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return mediaQuery.matches;
}

/**
 * Get a value based on reduced motion preference
 * @param normalValue - Value to return when motion is preferred
 * @param reducedValue - Value to return when motion is not preferred
 */
export function getMotionValue<T>(normalValue: T, reducedValue: T): T {
  return prefersReducedMotion() ? reducedValue : normalValue;
}

/**
 * Get animation duration based on preference
 * @param normalDuration - Normal duration in ms
 * @param reducedDuration - Reduced duration (default 0 for no animation)
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  return prefersReducedMotion() ? reducedDuration : normalDuration;
}

/**
 * Add a listener for reduced motion preference changes
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  mediaQuery.addEventListener('change', (e) => callback(e.matches));
  return () => mediaQuery.removeEventListener('change', callback);
}
