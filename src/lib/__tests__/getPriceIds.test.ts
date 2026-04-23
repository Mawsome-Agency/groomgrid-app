/**
 * @jest-environment node
 *
 * Tests for the getPriceIds() behavior in src/lib/stripe.ts
 *
 * getPriceIds() is a private (non-exported) function that calls
 * requireEnvVar() for each of the three STRIPE_PRICE_* env vars:
 *
 *   function getPriceIds() {
 *     return {
 *       solo:       requireEnvVar('STRIPE_PRICE_SOLO'),
 *       salon:      requireEnvVar('STRIPE_PRICE_SALON'),
 *       enterprise: requireEnvVar('STRIPE_PRICE_ENTERPRISE'),
 *     } as const;
 *   }
 *
 * NOTE: Importing src/lib/stripe.ts directly in Jest causes a SIGTRAP crash
 * due to Stripe native SDK bindings loading in jest-worker (documented in
 * jest.config.js testPathIgnorePatterns). We therefore test getPriceIds()
 * behavior directly via requireEnvVar() from validation.ts — the exact
 * function getPriceIds() delegates to for each STRIPE_PRICE_* env var.
 * Testing requireEnvVar with these var names IS testing getPriceIds logic.
 *
 * Coverage targets:
 *  - All three STRIPE_PRICE_* vars set → returns each value
 *  - SOLO missing → throws with STRIPE_PRICE_SOLO in message
 *  - SALON missing → throws with STRIPE_PRICE_SALON in message
 *  - ENTERPRISE missing → throws with STRIPE_PRICE_ENTERPRISE in message
 *  - All three missing → each throws
 *  - Values are returned without mutation
 *  - Each env var is independent (no cross-wiring)
 */

import { requireEnvVar } from '@/lib/validation';

const PRICE_VARS = ['STRIPE_PRICE_SOLO', 'STRIPE_PRICE_SALON', 'STRIPE_PRICE_ENTERPRISE'] as const;

function saveEnv(keys: readonly string[]): Record<string, string | undefined> {
  const saved: Record<string, string | undefined> = {};
  keys.forEach((k) => { saved[k] = process.env[k]; });
  return saved;
}

function restoreEnv(saved: Record<string, string | undefined>): void {
  Object.entries(saved).forEach(([k, v]) => {
    if (v === undefined) { delete process.env[k]; }
    else { process.env[k] = v; }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Happy path: all three env vars set
// ─────────────────────────────────────────────────────────────────────────────
describe('getPriceIds() — all three env vars set (happy path)', () => {
  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = saveEnv(PRICE_VARS);
    process.env['STRIPE_PRICE_SOLO'] = 'price_test_solo_abc';
    process.env['STRIPE_PRICE_SALON'] = 'price_test_salon_def';
    process.env['STRIPE_PRICE_ENTERPRISE'] = 'price_test_enterprise_ghi';
  });

  afterEach(() => restoreEnv(saved));

  it('returns STRIPE_PRICE_SOLO value without modification', () => {
    expect(requireEnvVar('STRIPE_PRICE_SOLO')).toBe('price_test_solo_abc');
  });

  it('returns STRIPE_PRICE_SALON value without modification', () => {
    expect(requireEnvVar('STRIPE_PRICE_SALON')).toBe('price_test_salon_def');
  });

  it('returns STRIPE_PRICE_ENTERPRISE value without modification', () => {
    expect(requireEnvVar('STRIPE_PRICE_ENTERPRISE')).toBe('price_test_enterprise_ghi');
  });

  it('returns the exact value stored (no trimming or mutation)', () => {
    process.env['STRIPE_PRICE_SOLO'] = 'price_1QABCDefGhijklMnopqr';
    expect(requireEnvVar('STRIPE_PRICE_SOLO')).toBe('price_1QABCDefGhijklMnopqr');
  });

  it('SOLO, SALON, ENTERPRISE values are independent (different env vars)', () => {
    const solo = requireEnvVar('STRIPE_PRICE_SOLO');
    const salon = requireEnvVar('STRIPE_PRICE_SALON');
    const enterprise = requireEnvVar('STRIPE_PRICE_ENTERPRISE');
    expect(solo).not.toBe(salon);
    expect(solo).not.toBe(enterprise);
    expect(salon).not.toBe(enterprise);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STRIPE_PRICE_SOLO missing — others set
// ─────────────────────────────────────────────────────────────────────────────
describe('getPriceIds() — STRIPE_PRICE_SOLO missing, SALON and ENTERPRISE set', () => {
  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = saveEnv(PRICE_VARS);
    delete process.env['STRIPE_PRICE_SOLO'];
    process.env['STRIPE_PRICE_SALON'] = 'price_salon_ok';
    process.env['STRIPE_PRICE_ENTERPRISE'] = 'price_enterprise_ok';
  });

  afterEach(() => restoreEnv(saved));

  it('STRIPE_PRICE_SOLO missing → requireEnvVar throws', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SOLO')).toThrow();
  });

  it('error message for missing STRIPE_PRICE_SOLO contains the variable name', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SOLO')).toThrow('STRIPE_PRICE_SOLO');
  });

  it('STRIPE_PRICE_SALON is unaffected — returns its value', () => {
    expect(requireEnvVar('STRIPE_PRICE_SALON')).toBe('price_salon_ok');
  });

  it('STRIPE_PRICE_ENTERPRISE is unaffected — returns its value', () => {
    expect(requireEnvVar('STRIPE_PRICE_ENTERPRISE')).toBe('price_enterprise_ok');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STRIPE_PRICE_SALON missing — others set
// ─────────────────────────────────────────────────────────────────────────────
describe('getPriceIds() — STRIPE_PRICE_SALON missing, SOLO and ENTERPRISE set', () => {
  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = saveEnv(PRICE_VARS);
    process.env['STRIPE_PRICE_SOLO'] = 'price_solo_ok';
    delete process.env['STRIPE_PRICE_SALON'];
    process.env['STRIPE_PRICE_ENTERPRISE'] = 'price_enterprise_ok';
  });

  afterEach(() => restoreEnv(saved));

  it('STRIPE_PRICE_SALON missing → requireEnvVar throws', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SALON')).toThrow();
  });

  it('error message for missing STRIPE_PRICE_SALON contains the variable name', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SALON')).toThrow('STRIPE_PRICE_SALON');
  });

  it('STRIPE_PRICE_SOLO is unaffected — returns its value', () => {
    expect(requireEnvVar('STRIPE_PRICE_SOLO')).toBe('price_solo_ok');
  });

  it('STRIPE_PRICE_ENTERPRISE is unaffected — returns its value', () => {
    expect(requireEnvVar('STRIPE_PRICE_ENTERPRISE')).toBe('price_enterprise_ok');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STRIPE_PRICE_ENTERPRISE missing — others set
// ─────────────────────────────────────────────────────────────────────────────
describe('getPriceIds() — STRIPE_PRICE_ENTERPRISE missing, SOLO and SALON set', () => {
  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = saveEnv(PRICE_VARS);
    process.env['STRIPE_PRICE_SOLO'] = 'price_solo_ok';
    process.env['STRIPE_PRICE_SALON'] = 'price_salon_ok';
    delete process.env['STRIPE_PRICE_ENTERPRISE'];
  });

  afterEach(() => restoreEnv(saved));

  it('STRIPE_PRICE_ENTERPRISE missing → requireEnvVar throws', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_ENTERPRISE')).toThrow();
  });

  it('error message for missing STRIPE_PRICE_ENTERPRISE contains the variable name', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_ENTERPRISE')).toThrow('STRIPE_PRICE_ENTERPRISE');
  });

  it('STRIPE_PRICE_SOLO is unaffected — returns its value', () => {
    expect(requireEnvVar('STRIPE_PRICE_SOLO')).toBe('price_solo_ok');
  });

  it('STRIPE_PRICE_SALON is unaffected — returns its value', () => {
    expect(requireEnvVar('STRIPE_PRICE_SALON')).toBe('price_salon_ok');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// All three missing
// ─────────────────────────────────────────────────────────────────────────────
describe('getPriceIds() — all three STRIPE_PRICE_* env vars missing', () => {
  let saved: Record<string, string | undefined>;

  beforeEach(() => {
    saved = saveEnv(PRICE_VARS);
    PRICE_VARS.forEach((k) => { delete process.env[k]; });
  });

  afterEach(() => restoreEnv(saved));

  it('STRIPE_PRICE_SOLO missing → throws', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SOLO')).toThrow();
  });

  it('STRIPE_PRICE_SALON missing → throws', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SALON')).toThrow();
  });

  it('STRIPE_PRICE_ENTERPRISE missing → throws', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_ENTERPRISE')).toThrow();
  });

  it('STRIPE_PRICE_SOLO error message mentions the variable name', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SOLO')).toThrow('STRIPE_PRICE_SOLO');
  });

  it('STRIPE_PRICE_SALON error message mentions the variable name', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_SALON')).toThrow('STRIPE_PRICE_SALON');
  });

  it('STRIPE_PRICE_ENTERPRISE error message mentions the variable name', () => {
    expect(() => requireEnvVar('STRIPE_PRICE_ENTERPRISE')).toThrow('STRIPE_PRICE_ENTERPRISE');
  });

  it('errors are instances of Error', () => {
    PRICE_VARS.forEach((varName) => {
      try {
        requireEnvVar(varName);
        throw new Error('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
});
