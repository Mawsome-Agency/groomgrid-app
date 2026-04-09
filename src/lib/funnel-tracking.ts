/**
 * Funnel Tracking Utilities
 *
 * Helper functions for tracking user behavior through the signup-to-paid funnel.
 * Tracks timing, errors, exits, and step completions.
 */

import { trackEvent, getSessionId } from './ga4';

/**
 * Track API response time (client-side)
 */
export function trackApiTiming(
  apiEndpoint: string,
  durationMs: number,
  success: boolean,
  errorType?: string
) {
  trackEvent('api_timing', {
    api_endpoint: apiEndpoint,
    duration_ms: durationMs,
    success,
    error_type: errorType || null,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track field validation error
 */
export function trackValidationError(
  fieldName: string,
  errorType: string,
  errorMessage: string
) {
  trackEvent('field_validation_error', {
    field_name: fieldName,
    error_type: errorType,
    error_message: errorMessage,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track step completion duration
 */
export function trackStepDuration(
  stepName: string,
  stepNumber: number,
  durationMs: number
) {
  trackEvent('step_duration', {
    step_name: stepName,
    step_number: stepNumber,
    duration_ms: durationMs,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track funnel exit (when user abandons)
 */
export function trackFunnelExit(
  stage: string,
  exitPoint: string,
  reason?: string
) {
  trackEvent('funnel_exit', {
    stage,
    exit_point: exitPoint,
    reason: reason || 'unknown',
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track payment gateway failure
 */
export function trackPaymentFailure(
  errorType: string,
  declineCode?: string,
  errorMessage?: string
) {
  trackEvent('payment_failure', {
    error_type: errorType,
    decline_code: declineCode || null,
    error_message: errorMessage || null,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get funnel stage from URL path
 */
export function getFunnelStage(pathname: string): string {
  if (pathname === '/') return 'homepage';
  if (pathname === '/signup') return 'signup';
  if (pathname === '/plans') return 'plans';
  if (pathname === '/onboarding') return 'onboarding';
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname.startsWith('/login')) return 'login';
  return 'unknown';
}
