export type ErrorType = 'declined' | 'insufficient' | 'expired' | 'network' | 'generic';

/**
 * Maps Stripe error codes to GroomGrid error types
 */
export function mapStripeErrorCodeToErrorType(code?: string): ErrorType {
  if (!code) return 'generic';

  const codeMap: Record<string, ErrorType> = {
    'card_declined': 'declined',
    'generic_decline': 'declined',
    'insufficient_funds': 'insufficient',
    'expired_card': 'expired',
    'processing_error': 'network',
    'rate_limit': 'network',
    'api_error': 'network',
  };

  return codeMap[code] || 'generic';
}

/**
 * Gets user-friendly message for error type
 */
export function getErrorMessageForType(errorType: ErrorType): string {
  const messages: Record<ErrorType, string> = {
    declined: 'We couldn\'t process your card. Please try again or use a different payment method.',
    insufficient: 'Your card doesn\'t have enough funds. Please try a different card or add funds.',
    expired: 'Your card has expired. Please update your payment information.',
    network: 'We\'re having trouble connecting to our payment processor. Please try again.',
    generic: 'Something went wrong. Please try again or contact support if the issue persists.',
  };

  return messages[errorType];
}

/**
 * Checks if error is retryable
 */
export function isRetryableError(errorType: ErrorType): boolean {
  // All errors are technically retryable, but some may require user action
  return true;
}

/**
 * Gets recovery action for error type
 */
export function getRecoveryAction(errorType: ErrorType): {
  primary: string;
  secondary?: string;
} {
  const actions: Record<ErrorType, { primary: string; secondary?: string }> = {
    declined: {
      primary: 'Try Again',
      secondary: 'Use Different Card',
    },
    insufficient: {
      primary: 'Try Different Card',
      secondary: 'View Plans',
    },
    expired: {
      primary: 'Update Card',
      secondary: 'Use Different Card',
    },
    network: {
      primary: 'Retry',
      secondary: 'Refresh Page',
    },
    generic: {
      primary: 'Try Again',
      secondary: 'Contact Support',
    },
  };

  return actions[errorType];
}

/**
 * Parses error from checkout response
 */
export interface ParsedPaymentError {
  type: ErrorType;
  message: string;
  declineCode?: string;
  isRetryable: boolean;
}

export function parsePaymentError(error: any): ParsedPaymentError {
  const declineCode = error?.declineCode || error?.code;
  const errorType = mapStripeErrorCodeToErrorType(declineCode);

  return {
    type: errorType,
    message: error?.message || getErrorMessageForType(errorType),
    declineCode,
    isRetryable: isRetryableError(errorType),
  };
}
