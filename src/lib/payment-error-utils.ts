/**
 * Payment Error Utilities
 *
 * Maps Stripe error codes to user-friendly error types and messages.
 * Provides recovery actions for different error scenarios.
 */

export type ErrorType = 'declined' | 'insufficient' | 'expired' | 'network' | 'generic';

export interface ParsedPaymentError {
  type: ErrorType;
  message: string;
  declineCode?: string;
  isRetryable: boolean;
}

/**
 * Maps Stripe error codes to internal error types
 */
export function mapStripeErrorCodeToErrorType(code: string | undefined | null): ErrorType {
  if (!code) return 'generic';

  switch (code) {
    case 'card_declined':
    case 'generic_decline':
      return 'declined';
    case 'insufficient_funds':
      return 'insufficient';
    case 'expired_card':
      return 'expired';
    case 'processing_error':
    case 'rate_limit':
    case 'api_error':
      return 'network';
    default:
      return 'generic';
  }
}

/**
 * Returns user-friendly error message for error type
 */
export function getErrorMessageForType(type: ErrorType): string {
  switch (type) {
    case 'declined':
      return 'We couldn\'t process your card. Please try again or use a different card.';
    case 'insufficient':
      return 'Your card doesn\'t have enough funds. Please try a different card.';
    case 'expired':
      return 'Your card has expired. Please update your payment information.';
    case 'network':
      return 'We\'re having trouble connecting to our payment processor. Please try again.';
    case 'generic':
      return 'Something went wrong processing your payment. Please try again or contact support if the issue persists.';
  }
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(type: ErrorType): boolean {
  // All error types are currently retryable
  return true;
}

/**
 * Returns recovery actions for error type
 */
export function getRecoveryAction(type: ErrorType): { primary: string; secondary: string } {
  switch (type) {
    case 'declined':
      return { primary: 'Try Again', secondary: 'Use Different Card' };
    case 'insufficient':
      return { primary: 'Try Different Card', secondary: 'View Plans' };
    case 'expired':
      return { primary: 'Update Card', secondary: 'Use Different Card' };
    case 'network':
      return { primary: 'Retry', secondary: 'Refresh Page' };
    case 'generic':
      return { primary: 'Try Again', secondary: 'Contact Support' };
  }
}

/**
 * Parses a Stripe error into a structured error object
 */
export function parsePaymentError(error: any): ParsedPaymentError {
  const declineCode = error?.declineCode || error?.code;
  const type = mapStripeErrorCodeToErrorType(declineCode);
  const message = error?.message || getErrorMessageForType(type);

  return {
    type,
    message,
    declineCode,
    isRetryable: isRetryableError(type),
  };
}
