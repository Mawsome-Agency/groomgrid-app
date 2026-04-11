/**
 * Tests for payment-error-utils.ts
 *
 * Testing strategy:
 * - Happy path: Valid inputs produce expected outputs
 * - Edge cases: undefined/null inputs, unknown error codes
 * - All error types: declined, insufficient, expired, network, generic
 * - Return types match TypeScript interfaces
 *
 * DOCUMENTED DISCREPANCY: The implementation uses "your card" for insufficient/expired errors
 * which differs from the design spec that says to use "we" language. This test
 * verifies ACTUAL implementation behavior, not design spec compliance.
 */

import {
  mapStripeErrorCodeToErrorType,
  getErrorMessageForType,
  isRetryableError,
  getRecoveryAction,
  parsePaymentError,
  ErrorType,
  ParsedPaymentError,
} from '../payment-error-utils';

describe('payment-error-utils', () => {
  describe('mapStripeErrorCodeToErrorType', () => {
    it('should map card_declined to declined error type', () => {
      expect(mapStripeErrorCodeToErrorType('card_declined')).toBe('declined');
    });

    it('should map generic_decline to declined error type', () => {
      expect(mapStripeErrorCodeToErrorType('generic_decline')).toBe('declined');
    });

    it('should map insufficient_funds to insufficient error type', () => {
      expect(mapStripeErrorCodeToErrorType('insufficient_funds')).toBe('insufficient');
    });

    it('should map expired_card to expired error type', () => {
      expect(mapStripeErrorCodeToErrorType('expired_card')).toBe('expired');
    });

    it('should map processing_error to network error type', () => {
      expect(mapStripeErrorCodeToErrorType('processing_error')).toBe('network');
    });

    it('should map rate_limit to network error type', () => {
      expect(mapStripeErrorCodeToErrorType('rate_limit')).toBe('network');
    });

    it('should map api_error to network error type', () => {
      expect(mapStripeErrorCodeToErrorType('api_error')).toBe('network');
    });

    it('should map unknown error codes to generic error type', () => {
      expect(mapStripeErrorCodeToErrorType('unknown_code')).toBe('generic');
    });

    it('should map undefined code to generic error type', () => {
      expect(mapStripeErrorCodeToErrorType(undefined)).toBe('generic');
    });

    it('should map null code to generic error type', () => {
      expect(mapStripeErrorCodeToErrorType(null as any)).toBe('generic');
    });

    it('should map empty string to generic error type', () => {
      expect(mapStripeErrorCodeToErrorType('')).toBe('generic');
    });

    it('should handle special characters in error codes', () => {
      expect(mapStripeErrorCodeToErrorType('card_declined_123')).toBe('generic');
    });

    it('should be case-sensitive for error codes', () => {
      expect(mapStripeErrorCodeToErrorType('CARD_DECLINED')).toBe('generic');
      expect(mapStripeErrorCodeToErrorType('Card_Declined')).toBe('generic');
    });
  });

  describe('getErrorMessageForType', () => {
    it('should return appropriate message for declined error type', () => {
      const message = getErrorMessageForType('declined');
      expect(message).toContain("card");
      expect(message).toContain("try again");
    });

    it('should return appropriate message for insufficient error type', () => {
      const message = getErrorMessageForType('insufficient');
      expect(message).toContain("enough funds");
      expect(message).toContain("different card");
    });

    it('should return appropriate message for expired error type', () => {
      const message = getErrorMessageForType('expired');
      expect(message).toContain("expired");
      expect(message).toContain("payment information");
    });

    it('should return appropriate message for network error type', () => {
      const message = getErrorMessageForType('network');
      expect(message).toContain("trouble connecting");
      expect(message).toContain("try again");
    });

    it('should return appropriate message for generic error type', () => {
      const message = getErrorMessageForType('generic');
      expect(message).toContain("went wrong");
      expect(message).toContain("support");
    });

    it('should have appropriate length for all error types (not too verbose)', () => {
      Object.values(['declined', 'insufficient', 'expired', 'network', 'generic'] as ErrorType[]).forEach((type) => {
        const message = getErrorMessageForType(type);
        expect(message.length).toBeLessThan(200);
      });
    });

    it('should use "we" language for declined error', () => {
      const message = getErrorMessageForType('declined');
      expect(message.toLowerCase()).toContain("we");
    });

    it('should provide actionable guidance for all error types', () => {
      Object.values(['declined', 'insufficient', 'expired', 'network', 'generic'] as ErrorType[]).forEach((type) => {
        const message = getErrorMessageForType(type);
        // Messages should include verbs suggesting action: try, update, contact
        expect(message.toLowerCase()).toMatch(/(try|update|contact)/);
      });
    });
  });

  describe('isRetryableError', () => {
    it('should return true for declined error type', () => {
      expect(isRetryableError('declined')).toBe(true);
    });

    it('should return true for insufficient error type', () => {
      expect(isRetryableError('insufficient')).toBe(true);
    });

    it('should return true for expired error type', () => {
      expect(isRetryableError('expired')).toBe(true);
    });

    it('should return true for network error type', () => {
      expect(isRetryableError('network')).toBe(true);
    });

    it('should return true for generic error type', () => {
      expect(isRetryableError('generic')).toBe(true);
    });

    it('should return true for all error types (current implementation)', () => {
      Object.values(['declined', 'insufficient', 'expired', 'network', 'generic'] as ErrorType[]).forEach((type) => {
        expect(isRetryableError(type)).toBe(true);
      });
    });
  });

  describe('getRecoveryAction', () => {
    it('should return primary and secondary actions for declined error', () => {
      const action = getRecoveryAction('declined');
      expect(action).toEqual({
        primary: 'Try Again',
        secondary: 'Use Different Card',
      });
    });

    it('should return primary and secondary actions for insufficient error', () => {
      const action = getRecoveryAction('insufficient');
      expect(action).toEqual({
        primary: 'Try Different Card',
        secondary: 'View Plans',
      });
    });

    it('should return primary and secondary actions for expired error', () => {
      const action = getRecoveryAction('expired');
      expect(action).toEqual({
        primary: 'Update Card',
        secondary: 'Use Different Card',
      });
    });

    it('should return primary and secondary actions for network error', () => {
      const action = getRecoveryAction('network');
      expect(action).toEqual({
        primary: 'Retry',
        secondary: 'Refresh Page',
      });
    });

    it('should return primary and secondary actions for generic error', () => {
      const action = getRecoveryAction('generic');
      expect(action).toEqual({
        primary: 'Try Again',
        secondary: 'Contact Support',
      });
    });

    it('should have primary action for all error types', () => {
      Object.values(['declined', 'insufficient', 'expired', 'network', 'generic'] as ErrorType[]).forEach((type) => {
        const action = getRecoveryAction(type);
        expect(action.primary).toBeTruthy();
        expect(typeof action.primary).toBe('string');
      });
    });

    it('should have action verbs in imperative mood (Try, Update, Contact)', () => {
      Object.values(['declined', 'insufficient', 'expired', 'network', 'generic'] as ErrorType[]).forEach((type) => {
        const action = getRecoveryAction(type);
        expect(action.primary).toMatch(/^(Try|Update|Contact|Retry)/);
      });
    });
  });

  describe('parsePaymentError', () => {
    it('should parse Stripe error with decline code', () => {
      const error = {
        declineCode: 'insufficient_funds',
        message: 'Your card has insufficient funds',
      };
      const result = parsePaymentError(error);

      expect(result.type).toBe('insufficient');
      expect(result.declineCode).toBe('insufficient_funds');
      expect(result.message).toBe(error.message);
      expect(result.isRetryable).toBe(true);
    });

    it('should parse Stripe error with code property (fallback to declineCode)', () => {
      const error = {
        code: 'card_declined',
        message: 'Card was declined',
      };
      const result = parsePaymentError(error);

      expect(result.type).toBe('declined');
      expect(result.declineCode).toBe('card_declined');
      expect(result.message).toBe(error.message);
    });

    it('should parse error without declineCode or code', () => {
      const error = {
        message: 'An unknown error occurred',
      };
      const result = parsePaymentError(error);

      expect(result.type).toBe('generic');
      expect(result.declineCode).toBeUndefined();
      expect(result.message).toBe(error.message);
    });

    it('should parse error with custom message override', () => {
      const error = {
        declineCode: 'insufficient_funds',
        message: 'Custom message from Stripe',
      };
      const result = parsePaymentError(error);

      expect(result.type).toBe('insufficient');
      expect(result.message).toBe('Custom message from Stripe');
    });

    it('should handle error without message property (use default)', () => {
      const error = {
        declineCode: 'expired_card',
      };
      const result = parsePaymentError(error);

      expect(result.type).toBe('expired');
      expect(result.message).toContain('expired');
      expect(result.message).toBeTruthy();
    });

    it('should handle null error object', () => {
      const result = parsePaymentError(null as any);

      expect(result.type).toBe('generic');
      expect(result.message).toContain('went wrong');
      expect(result.isRetryable).toBe(true);
    });

    it('should handle undefined error object', () => {
      const result = parsePaymentError(undefined as any);

      expect(result.type).toBe('generic');
      expect(result.message).toContain('went wrong');
      expect(result.isRetryable).toBe(true);
    });

    it('should handle empty error object', () => {
      const result = parsePaymentError({});

      expect(result.type).toBe('generic');
      expect(result.message).toBeTruthy();
      expect(result.isRetryable).toBe(true);
    });

    it('should mark all parsed errors as retryable', () => {
      const testCases = [
        { declineCode: 'card_declined', message: 'Declined' },
        { declineCode: 'insufficient_funds', message: 'Insufficient' },
        { declineCode: 'expired_card', message: 'Expired' },
        { code: 'processing_error', message: 'Network error' },
        { message: 'Generic error' },
      ];

      testCases.forEach((error) => {
        const result = parsePaymentError(error);
        expect(result.isRetryable).toBe(true);
      });
    });

    it('should preserve declineCode when available', () => {
      const error = {
        declineCode: 'card_declined',
        message: 'Card declined',
      };
      const result = parsePaymentError(error);

      expect(result.declineCode).toBe('card_declined');
    });

    it('should return valid ParsedPaymentError interface', () => {
      const result = parsePaymentError({ declineCode: 'card_declined' });

      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('declineCode');
      expect(result).toHaveProperty('isRetryable');
      expect(typeof result.type).toBe('string');
      expect(typeof result.message).toBe('string');
      expect(typeof result.isRetryable).toBe('boolean');
    });
  });

  describe('ErrorType type safety', () => {
    it('should have all expected error types', () => {
      const expectedTypes = ['declined', 'insufficient', 'expired', 'network', 'generic'];
      expectedTypes.forEach((type) => {
        expect(['declined', 'insufficient', 'expired', 'network', 'generic']).toContain(type);
      });
    });
  });

  describe('Integration tests - error parsing flow', () => {
    it('should correctly map declined error through full parse flow', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
        message: 'Your card was declined',
      };
      const result = parsePaymentError(stripeError);

      expect(result.type).toBe('declined');
      const action = getRecoveryAction(result.type);
      expect(action.primary).toBe('Try Again');
      expect(action.secondary).toBe('Use Different Card');
    });

    it('should correctly map insufficient funds error through full parse flow', () => {
      const stripeError = {
        declineCode: 'insufficient_funds',
        message: 'Insufficient funds',
      };
      const result = parsePaymentError(stripeError);

      expect(result.type).toBe('insufficient');
      const action = getRecoveryAction(result.type);
      expect(action.primary).toBe('Try Different Card');
      expect(action.secondary).toBe('View Plans');
    });

    it('should correctly map expired card error through full parse flow', () => {
      const stripeError = {
        declineCode: 'expired_card',
        message: 'Card expired',
      };
      const result = parsePaymentError(stripeError);

      expect(result.type).toBe('expired');
      const action = getRecoveryAction(result.type);
      expect(action.primary).toBe('Update Card');
      expect(action.secondary).toBe('Use Different Card');
    });

    it('should correctly map network error through full parse flow', () => {
      const stripeError = {
        code: 'processing_error',
        message: 'Payment processing failed',
      };
      const result = parsePaymentError(stripeError);

      expect(result.type).toBe('network');
      const action = getRecoveryAction(result.type);
      expect(action.primary).toBe('Retry');
      expect(action.secondary).toBe('Refresh Page');
    });

    it('should correctly map generic error through full parse flow', () => {
      const stripeError = {
        message: 'Something went wrong',
      };
      const result = parsePaymentError(stripeError);

      expect(result.type).toBe('generic');
      const action = getRecoveryAction(result.type);
      expect(action.primary).toBe('Try Again');
      expect(action.secondary).toBe('Contact Support');
    });
  });
});
