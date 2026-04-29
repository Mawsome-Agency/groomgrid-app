/**
 * Tests for validation.ts
 *
 * Testing strategy:
 * - ensureEnv('all'): happy path (all vars set), missing vars from each module
 * - ensureEnv('stripe'|'app'|'ga4'): module-specific checks
 * - ensureEnv with unknown module key: falls back to empty array via ??
 * - ensureEnv() with no args: defaults to 'all'
 * - requireEnvVar: happy path (var set), missing var, empty string var
 * - Edge cases: partial env, empty string as "missing", whitespace values
 */
import { ensureEnv, requireEnvVar } from '@/lib/validation';

describe('validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('ensureEnv', () => {
    function setAllEnvVars() {
      process.env.STRIPE_SECRET_KEY = 'sk_test_x';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_x';
      process.env.STRIPE_PRICE_SOLO = 'price_solo';
      process.env.STRIPE_PRICE_SALON = 'price_salon';
      process.env.STRIPE_PRICE_ENTERPRISE = 'price_enterprise';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'secret';
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-XXXXXXX';
      process.env.GA4_API_SECRET = 'api_secret';
      process.env.SPYFU_API_SECRET = 'spyfu_key';
    }

    it('passes when all required env vars are set (module=all)', () => {
      setAllEnvVars();
      expect(() => ensureEnv('all')).not.toThrow();
    });

    it('defaults to module=all when no argument provided', () => {
      // Test the default parameter branch
      setAllEnvVars();
      expect(() => ensureEnv()).not.toThrow();

      // Now remove some vars — should throw because default is 'all'
      delete process.env.STRIPE_SECRET_KEY;
      expect(() => ensureEnv()).toThrow(/Missing required environment variables/);
    });

    it('throws when stripe vars are missing (module=stripe)', () => {
      delete process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_WEBHOOK_SECRET;
      delete process.env.STRIPE_PRICE_SOLO;
      delete process.env.STRIPE_PRICE_SALON;
      delete process.env.STRIPE_PRICE_ENTERPRISE;

      expect(() => ensureEnv('stripe')).toThrow(
        /Missing required environment variables.*STRIPE_SECRET_KEY/
      );
    });

    it('throws when app vars are missing (module=app)', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.NEXTAUTH_URL;
      delete process.env.NEXTAUTH_SECRET;

      expect(() => ensureEnv('app')).toThrow(
        /Missing required environment variables.*NEXT_PUBLIC_APP_URL/
      );
    });

    it('throws when ga4 vars are missing (module=ga4)', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      delete process.env.GA4_API_SECRET;

      expect(() => ensureEnv('ga4')).toThrow(
        /Missing required environment variables.*NEXT_PUBLIC_GA4_MEASUREMENT_ID/
      );
    });

    it('passes when only stripe vars are set and module=stripe', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec';
      process.env.STRIPE_PRICE_SOLO = 'price_solo';
      process.env.STRIPE_PRICE_SALON = 'price_salon';
      process.env.STRIPE_PRICE_ENTERPRISE = 'price_ent';

      expect(() => ensureEnv('stripe')).not.toThrow();
    });

    it('passes when only app vars are set and module=app', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'secret123';

      expect(() => ensureEnv('app')).not.toThrow();
    });

    it('passes when only ga4 vars are set and module=ga4', () => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST';
      process.env.GA4_API_SECRET = 'secret';

      expect(() => ensureEnv('ga4')).not.toThrow();
    });

    it('does not throw for unknown module (falls back to empty array via ??)', () => {
      // The ?? [] fallback means unknown modules get an empty varsToCheck
      expect(() => ensureEnv('nonexistent' as any)).not.toThrow();
    });

    it('lists all missing vars in the error message', () => {
      const allRequired = [
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'STRIPE_PRICE_SOLO',
        'STRIPE_PRICE_SALON',
        'STRIPE_PRICE_ENTERPRISE',
        'NEXT_PUBLIC_APP_URL',
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET',
        'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
        'GA4_API_SECRET',
        'SPYFU_API_SECRET',
      ];
      allRequired.forEach((v) => delete process.env[v]);

      try {
        ensureEnv('all');
        fail('Expected ensureEnv to throw');
      } catch (e: any) {
        expect(e.message).toContain('Missing required environment variables');
        allRequired.forEach((v) => {
          expect(e.message).toContain(v);
        });
      }
    });

    it('throws when some vars from a module are missing (partial missing)', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test';
      delete process.env.STRIPE_WEBHOOK_SECRET;
      delete process.env.STRIPE_PRICE_SOLO;

      expect(() => ensureEnv('stripe')).toThrow(
        /Missing required environment variables.*STRIPE_WEBHOOK_SECRET.*STRIPE_PRICE_SOLO/
      );
    });

    it('does not consider empty string as "set" — env var must have a value', () => {
      process.env.STRIPE_SECRET_KEY = '';
      process.env.STRIPE_WEBHOOK_SECRET = '';
      process.env.STRIPE_PRICE_SOLO = '';
      process.env.STRIPE_PRICE_SALON = '';
      process.env.STRIPE_PRICE_ENTERPRISE = '';

      expect(() => ensureEnv('stripe')).toThrow(/Missing required environment variables/);
    });
  });

  describe('requireEnvVar', () => {
    it('returns the value when the env var is set', () => {
      process.env.MY_TEST_VAR = 'hello-world';
      expect(requireEnvVar('MY_TEST_VAR')).toBe('hello-world');
    });

    it('throws with descriptive error when the env var is not set', () => {
      delete process.env.MY_MISSING_VAR;
      expect(() => requireEnvVar('MY_MISSING_VAR')).toThrow(
        'Missing required environment variable: MY_MISSING_VAR'
      );
    });

    it('throws when the env var is set to empty string', () => {
      process.env.MY_EMPTY_VAR = '';
      expect(() => requireEnvVar('MY_EMPTY_VAR')).toThrow(
        'Missing required environment variable: MY_EMPTY_VAR'
      );
    });

    it('returns value for vars with whitespace (not trimmed)', () => {
      process.env.WHITESPACE_VAR = '  has spaces  ';
      expect(requireEnvVar('WHITESPACE_VAR')).toBe('  has spaces  ');
    });

    it('handles special characters in values', () => {
      process.env.SPECIAL_VAR = 'sk_live_abc123!@#$%^&*()';
      expect(requireEnvVar('SPECIAL_VAR')).toBe('sk_live_abc123!@#$%^&*()');
    });

    it('handles very long values', () => {
      const longValue = 'a'.repeat(10000);
      process.env.LONG_VAR = longValue;
      expect(requireEnvVar('LONG_VAR')).toBe(longValue);
    });
  });
});
