/**
 * Tests for stripe.ts error mapping functions
 * 
 * Testing strategy:
 * - Happy path: Valid Stripe error objects map to correct error types
 * - Edge cases: null/undefined, missing properties
 * - All Stripe error types: CardError, RateLimitError, InvalidRequestError, APIError, ConnectionError
 */

import {
  mapStripeErrorToErrorType,
  getStripeErrorMessage,
} from '../stripe';

// Mock Stripe types for testing
declare class StripeError {
  type: string;
  code?: string;
  message?: string;
}

describe('stripe error mapping', () => {
  describe('mapStripeErrorToErrorType', () => {
    it('should map insufficient_funds to insufficient', () => {
      expect(mapStripeErrorToErrorType('insufficient_funds')).toBe('insufficient');
    });

    it('should map expired_card to expired', () => {
      expect(mapStripeErrorToErrorType('expired_card')).toBe('expired');
    });

    it('should map card_declined to declined', () => {
      expect(mapStripeErrorToErrorType('card_declined')).toBe('declined');
    });

    it('should map generic_decline to declined', () => {
      expect(mapStripeErrorToErrorType('generic_decline')).toBe('declined');
    });

    it('should map processing_error to declined', () => {
      expect(mapStripeErrorToErrorType('processing_error')).toBe('declined');
    });

    it('should map unknown codes to generic', () => {
      expect(mapStripeErrorToErrorType('unknown_code')).toBe('generic');
    });

    it('should map undefined to generic', () => {
      expect(mapStripeErrorToErrorType(undefined)).toBe('generic');
    });

    it('should map null to generic', () => {
      expect(mapStripeErrorToErrorType(null as any)).toBe('generic');
    });

    it('should handle special characters in decline codes', () => {
      expect(mapStripeErrorToErrorType('insufficient_funds-123')).toBe('generic');
    });
  });

  describe('getStripeErrorMessage', () => {
    it('should return generic error for null input', () => {
      const result = getStripeErrorMessage(null);
      expect(result.type).toBe('generic');
      expect(result.message).toContain('unknown');
    });

    it('should return generic error for undefined input', () => {
      const result = getStripeErrorMessage(undefined);
      expect(result.type).toBe('generic');
      expect(result.message).toContain('unknown');
    });

    it('should return generic error for empty object', () => {
      const result = getStripeErrorMessage({});
      expect(result.type).toBe('generic');
      expect(result.message).toContain('occurred');
    });

    it('should handle StripeCardError with code', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'insufficient_funds',
        message: 'Insufficient funds',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.type).toBe('insufficient');
      expect(result.message).toBe('Insufficient funds');
      expect(result.declineCode).toBe('insufficient_funds');
    });

    it('should handle StripeCardError without message', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.type).toBe('declined');
      expect(result.message).toBe('Payment failed');
    });

    it('should handle StripeRateLimitError', () => {
      const stripeError = {
        type: 'StripeRateLimitError',
        message: 'Too many requests',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.type).toBe('generic');
      expect(result.message).toContain('Too many requests');
    });

    it('should handle StripeInvalidRequestError', () => {
      const stripeError = {
        type: 'StripeInvalidRequestError',
        message: 'Invalid parameter',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.type).toBe('generic');
      expect(result.message).toContain('Invalid request');
    });

    it('should handle StripeAPIError', () => {
      const stripeError = {
        type: 'StripeAPIError',
        message: 'API error',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.type).toBe('generic');
      expect(result.message).toContain('Payment processing error');
    });

    it('should handle StripeConnectionError', () => {
      const stripeError = {
        type: 'StripeConnectionError',
        message: 'Network error',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.type).toBe('generic');
      expect(result.message).toContain('Network error');
    });

    it('should handle unknown Stripe error type', () => {
      const stripeError = {
        type: 'UnknownErrorType',
        message: 'Unknown error',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.type).toBe('generic');
      expect(result.message).toContain('Unknown error');
    });

    it('should return valid error structure for all inputs', () => {
      const testCases = [
        { type: 'StripeCardError', code: 'insufficient_funds', message: 'Insufficient' },
        { type: 'StripeRateLimitError', message: 'Rate limit' },
        { type: 'StripeInvalidRequestError', message: 'Invalid request' },
        { type: 'StripeAPIError', message: 'API error' },
        { type: 'StripeConnectionError', message: 'Connection error' },
        null,
        undefined,
        {},
      ];

      testCases.forEach((error) => {
        const result = getStripeErrorMessage(error);
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('message');
        expect(typeof result.type).toBe('string');
        expect(typeof result.message).toBe('string');
      });
    });

    it('should preserve declineCode when present', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
        message: 'Card declined',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.declineCode).toBe('card_declined');
    });

    it('should not have declineCode for non-StripeCardError types', () => {
      const testCases = [
        { type: 'StripeRateLimitError', message: 'Rate limit' },
        { type: 'StripeInvalidRequestError', message: 'Invalid request' },
        { type: 'StripeAPIError', message: 'API error' },
        { type: 'StripeConnectionError', message: 'Connection error' },
      ];

      testCases.forEach((error) => {
        const result = getStripeErrorMessage(error);
        expect(result.declineCode).toBeUndefined();
      });
    });

    it('should use default message when StripeCardError has no message', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'expired_card',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.message).toBe('Payment failed');
    });
  });

  describe('Error mapping edge cases', () => {
    it('should handle empty message property', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
        message: '',
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.message).toBe('Payment failed');
    });

    it('should handle whitespace-only message', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
        message: '   ',
      };
      const result = getStripeErrorMessage(stripeError);

      // Should return the whitespace message since it's truthy
      expect(result.message).toBe('   ');
    });

    it('should handle extremely long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
        message: longMessage,
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.message).toBe(longMessage);
    });

    it('should handle special characters in error messages', () => {
      const specialMessage = 'Error with <script>alert("xss")</script> & special chars';
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
        message: specialMessage,
      };
      const result = getStripeErrorMessage(stripeError);

      expect(result.message).toBe(specialMessage);
    });
  });
});
