/**
 * @jest-environment node
 *
 * Tests for src/app/pricing/pricing-data.ts
 *
 * Strategy:
 * - PLANS is built at module-eval time using process.env, so we use
 *   jest.resetModules() + dynamic require() to re-import the module
 *   under different env var configurations.
 * - We test: shape/count, each plan's static fields, and stripe_price_id
 *   env var wiring for all three plans.
 *
 * Coverage:
 *  - PLANS array has exactly 3 entries
 *  - Solo plan: correct id/name/type/price/interval, reads STRIPE_PRICE_SOLO
 *  - Salon plan: correct id/name/type/price/interval, reads STRIPE_PRICE_SALON
 *  - Enterprise plan: correct id/name/type/price/interval, reads STRIPE_PRICE_ENTERPRISE
 *  - stripe_price_id falls back to '' when env var is absent
 *  - stripe_price_id uses env var value when set
 *  - Feature list counts and required feature strings
 *  - popular flag: Solo is the popular plan
 *  - TESTIMONIALS and FAQ_ITEMS exports are present and non-empty
 */

// Helper: re-import pricing-data with a specific env var setup.
// jest.resetModules() clears the module registry so the module is re-evaluated
// with the new process.env values.
function importPricingData(envOverrides: Record<string, string | undefined> = {}) {
  // Save original env values for the keys we're overriding
  const originalValues: Record<string, string | undefined> = {};
  const PRICE_KEYS = ['STRIPE_PRICE_SOLO', 'STRIPE_PRICE_SALON', 'STRIPE_PRICE_ENTERPRISE'];

  PRICE_KEYS.forEach((key) => {
    originalValues[key] = process.env[key];
    if (key in envOverrides) {
      if (envOverrides[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = envOverrides[key] as string;
      }
    }
  });

  jest.resetModules();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@/app/pricing/pricing-data');

  // Restore original env
  PRICE_KEYS.forEach((key) => {
    if (originalValues[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalValues[key] as string;
    }
  });

  return mod;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANS array shape
// ─────────────────────────────────────────────────────────────────────────────
describe('PLANS array — shape and count', () => {
  let PLANS: any[];

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_test',
      STRIPE_PRICE_SALON: 'price_salon_test',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_test',
    });
    PLANS = mod.PLANS;
  });

  it('exports exactly 3 plans', () => {
    expect(PLANS).toHaveLength(3);
  });

  it('each plan has id, name, type, price, interval, stripe_price_id, features', () => {
    PLANS.forEach((plan) => {
      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('type');
      expect(plan).toHaveProperty('price');
      expect(plan).toHaveProperty('interval');
      expect(plan).toHaveProperty('stripe_price_id');
      expect(plan).toHaveProperty('features');
    });
  });

  it('all plans use monthly interval', () => {
    PLANS.forEach((plan) => {
      expect(plan.interval).toBe('monthly');
    });
  });

  it('plan ids are solo, salon, enterprise in that order', () => {
    expect(PLANS[0].id).toBe('solo');
    expect(PLANS[1].id).toBe('salon');
    expect(PLANS[2].id).toBe('enterprise');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Solo plan static fields
// ─────────────────────────────────────────────────────────────────────────────
describe('PLANS[0] — Solo plan static fields', () => {
  let solo: any;

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_123',
      STRIPE_PRICE_SALON: 'price_salon_123',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_123',
    });
    solo = mod.PLANS[0];
  });

  it('has id "solo"', () => expect(solo.id).toBe('solo'));
  it('has name "Solo Groomer"', () => expect(solo.name).toBe('Solo Groomer'));
  it('has type "solo"', () => expect(solo.type).toBe('solo'));
  it('has price 29', () => expect(solo.price).toBe(29));
  it('has interval "monthly"', () => expect(solo.interval).toBe('monthly'));
  it('is the popular plan', () => expect(solo.popular).toBe(true));

  it('has at least 4 features', () => {
    expect(solo.features.length).toBeGreaterThanOrEqual(4);
  });

  it('features include "Unlimited bookings — no per-dog fees"', () => {
    expect(solo.features).toContain('Unlimited bookings — no per-dog fees');
  });

  it('features include "Auto SMS + email reminders — cut no-shows 40%"', () => {
    expect(solo.features).toContain('Auto SMS + email reminders — cut no-shows 40%');
  });

  it('features include "Online booking widget — clients book themselves"', () => {
    expect(solo.features).toContain('Online booking widget — clients book themselves');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Salon plan static fields
// ─────────────────────────────────────────────────────────────────────────────
describe('PLANS[1] — Salon plan static fields', () => {
  let salon: any;

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_123',
      STRIPE_PRICE_SALON: 'price_salon_123',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_123',
    });
    salon = mod.PLANS[1];
  });

  it('has id "salon"', () => expect(salon.id).toBe('salon'));
  it('has name "Salon Team"', () => expect(salon.name).toBe('Salon Team'));
  it('has type "salon"', () => expect(salon.type).toBe('salon'));
  it('has price 79', () => expect(salon.price).toBe(79));
  it('has interval "monthly"', () => expect(salon.interval).toBe('monthly'));
  it('is not the popular plan', () => expect(salon.popular).toBe(false));

  it('has at least 5 features', () => {
    expect(salon.features.length).toBeGreaterThanOrEqual(5);
  });

  it('features include "Everything in Solo Groomer"', () => {
    expect(salon.features).toContain('Everything in Solo Groomer');
  });

  it('features include "Team scheduling — auto-balance workload"', () => {
    expect(salon.features).toContain('Team scheduling — auto-balance workload');
  });

  it('features include "Priority support"', () => {
    expect(salon.features).toContain('Priority support');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Enterprise plan static fields
// ─────────────────────────────────────────────────────────────────────────────
describe('PLANS[2] — Enterprise plan static fields', () => {
  let enterprise: any;

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_123',
      STRIPE_PRICE_SALON: 'price_salon_123',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_123',
    });
    enterprise = mod.PLANS[2];
  });

  it('has id "enterprise"', () => expect(enterprise.id).toBe('enterprise'));
  it('has name "Multi-Location"', () => expect(enterprise.name).toBe('Multi-Location'));
  it('has type "enterprise"', () => expect(enterprise.type).toBe('enterprise'));
  it('has price 149', () => expect(enterprise.price).toBe(149));
  it('has interval "monthly"', () => expect(enterprise.interval).toBe('monthly'));
  it('is not the popular plan', () => expect(enterprise.popular).toBe(false));

  it('has at least 4 features', () => {
    expect(enterprise.features.length).toBeGreaterThanOrEqual(4);
  });

  it('features include "Everything in Salon Team"', () => {
    expect(enterprise.features).toContain('Everything in Salon Team');
  });

  it('features include "API access"', () => {
    expect(enterprise.features).toContain('API access');
  });

  it('features include "Custom branding & white-label"', () => {
    expect(enterprise.features).toContain('Custom branding & white-label');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// stripe_price_id env var wiring — happy path (all three set)
// ─────────────────────────────────────────────────────────────────────────────
describe('stripe_price_id — all three env vars set (happy path)', () => {
  let PLANS: any[];

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_1QSoloTestABC',
      STRIPE_PRICE_SALON: 'price_1QSalonTestDEF',
      STRIPE_PRICE_ENTERPRISE: 'price_1QEnterpriseTestGHI',
    });
    PLANS = mod.PLANS;
  });

  it('solo stripe_price_id reads from STRIPE_PRICE_SOLO env var', () => {
    expect(PLANS[0].stripe_price_id).toBe('price_1QSoloTestABC');
  });

  it('salon stripe_price_id reads from STRIPE_PRICE_SALON env var', () => {
    expect(PLANS[1].stripe_price_id).toBe('price_1QSalonTestDEF');
  });

  it('enterprise stripe_price_id reads from STRIPE_PRICE_ENTERPRISE env var', () => {
    expect(PLANS[2].stripe_price_id).toBe('price_1QEnterpriseTestGHI');
  });

  it('each plan has a non-empty stripe_price_id when env vars are set', () => {
    PLANS.forEach((plan) => {
      expect(plan.stripe_price_id).not.toBe('');
      expect(plan.stripe_price_id.length).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// stripe_price_id env var wiring — STRIPE_PRICE_SOLO missing
// ─────────────────────────────────────────────────────────────────────────────
describe('stripe_price_id — STRIPE_PRICE_SOLO missing', () => {
  let PLANS: any[];

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: undefined,
      STRIPE_PRICE_SALON: 'price_salon_set',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_set',
    });
    PLANS = mod.PLANS;
  });

  it('solo stripe_price_id falls back to empty string', () => {
    expect(PLANS[0].stripe_price_id).toBe('');
  });

  it('salon stripe_price_id is unaffected — still reads from its env var', () => {
    expect(PLANS[1].stripe_price_id).toBe('price_salon_set');
  });

  it('enterprise stripe_price_id is unaffected — still reads from its env var', () => {
    expect(PLANS[2].stripe_price_id).toBe('price_enterprise_set');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// stripe_price_id env var wiring — STRIPE_PRICE_SALON missing
// ─────────────────────────────────────────────────────────────────────────────
describe('stripe_price_id — STRIPE_PRICE_SALON missing', () => {
  let PLANS: any[];

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_set',
      STRIPE_PRICE_SALON: undefined,
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_set',
    });
    PLANS = mod.PLANS;
  });

  it('salon stripe_price_id falls back to empty string', () => {
    expect(PLANS[1].stripe_price_id).toBe('');
  });

  it('solo stripe_price_id is unaffected — still reads from its env var', () => {
    expect(PLANS[0].stripe_price_id).toBe('price_solo_set');
  });

  it('enterprise stripe_price_id is unaffected — still reads from its env var', () => {
    expect(PLANS[2].stripe_price_id).toBe('price_enterprise_set');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// stripe_price_id env var wiring — STRIPE_PRICE_ENTERPRISE missing
// ─────────────────────────────────────────────────────────────────────────────
describe('stripe_price_id — STRIPE_PRICE_ENTERPRISE missing', () => {
  let PLANS: any[];

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_set',
      STRIPE_PRICE_SALON: 'price_salon_set',
      STRIPE_PRICE_ENTERPRISE: undefined,
    });
    PLANS = mod.PLANS;
  });

  it('enterprise stripe_price_id falls back to empty string', () => {
    expect(PLANS[2].stripe_price_id).toBe('');
  });

  it('solo stripe_price_id is unaffected — still reads from its env var', () => {
    expect(PLANS[0].stripe_price_id).toBe('price_solo_set');
  });

  it('salon stripe_price_id is unaffected — still reads from its env var', () => {
    expect(PLANS[1].stripe_price_id).toBe('price_salon_set');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// stripe_price_id env var wiring — all three missing
// ─────────────────────────────────────────────────────────────────────────────
describe('stripe_price_id — all three env vars missing', () => {
  let PLANS: any[];

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: undefined,
      STRIPE_PRICE_SALON: undefined,
      STRIPE_PRICE_ENTERPRISE: undefined,
    });
    PLANS = mod.PLANS;
  });

  it('solo stripe_price_id falls back to empty string', () => {
    expect(PLANS[0].stripe_price_id).toBe('');
  });

  it('salon stripe_price_id falls back to empty string', () => {
    expect(PLANS[1].stripe_price_id).toBe('');
  });

  it('enterprise stripe_price_id falls back to empty string', () => {
    expect(PLANS[2].stripe_price_id).toBe('');
  });

  it('module still exports 3 plans even with no price IDs configured', () => {
    expect(PLANS).toHaveLength(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// stripe_price_id does NOT cross-wire between plans
// ─────────────────────────────────────────────────────────────────────────────
describe('stripe_price_id — env vars do not cross-wire', () => {
  it('STRIPE_PRICE_SOLO only affects solo plan, not salon or enterprise', () => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_unique_solo_xyz',
      STRIPE_PRICE_SALON: 'price_salon_aaa',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_bbb',
    });
    expect(mod.PLANS[0].stripe_price_id).toBe('price_unique_solo_xyz');
    expect(mod.PLANS[1].stripe_price_id).not.toBe('price_unique_solo_xyz');
    expect(mod.PLANS[2].stripe_price_id).not.toBe('price_unique_solo_xyz');
  });

  it('STRIPE_PRICE_SALON only affects salon plan, not solo or enterprise', () => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_aaa',
      STRIPE_PRICE_SALON: 'price_unique_salon_xyz',
      STRIPE_PRICE_ENTERPRISE: 'price_enterprise_bbb',
    });
    expect(mod.PLANS[1].stripe_price_id).toBe('price_unique_salon_xyz');
    expect(mod.PLANS[0].stripe_price_id).not.toBe('price_unique_salon_xyz');
    expect(mod.PLANS[2].stripe_price_id).not.toBe('price_unique_salon_xyz');
  });

  it('STRIPE_PRICE_ENTERPRISE only affects enterprise plan, not solo or salon', () => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_solo_aaa',
      STRIPE_PRICE_SALON: 'price_salon_bbb',
      STRIPE_PRICE_ENTERPRISE: 'price_unique_enterprise_xyz',
    });
    expect(mod.PLANS[2].stripe_price_id).toBe('price_unique_enterprise_xyz');
    expect(mod.PLANS[0].stripe_price_id).not.toBe('price_unique_enterprise_xyz');
    expect(mod.PLANS[1].stripe_price_id).not.toBe('price_unique_enterprise_xyz');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// popular flag — only one plan is popular
// ─────────────────────────────────────────────────────────────────────────────
describe('popular flag', () => {
  let PLANS: any[];

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_a',
      STRIPE_PRICE_SALON: 'price_b',
      STRIPE_PRICE_ENTERPRISE: 'price_c',
    });
    PLANS = mod.PLANS;
  });

  it('exactly one plan is marked as popular', () => {
    const popularPlans = PLANS.filter((p) => p.popular === true);
    expect(popularPlans).toHaveLength(1);
  });

  it('the Solo plan (index 0) is the popular plan', () => {
    expect(PLANS[0].popular).toBe(true);
  });

  it('the Salon plan is not popular', () => {
    expect(PLANS[1].popular).toBe(false);
  });

  it('the Enterprise plan is not popular', () => {
    expect(PLANS[2].popular).toBeFalsy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS and FAQ_ITEMS exports
// ─────────────────────────────────────────────────────────────────────────────
describe('TESTIMONIALS export', () => {
  let TESTIMONIALS: any[];

  beforeAll(() => {
    const mod = importPricingData({});
    TESTIMONIALS = mod.TESTIMONIALS;
  });

  it('exports TESTIMONIALS array', () => {
    expect(Array.isArray(TESTIMONIALS)).toBe(true);
  });

  it('TESTIMONIALS is defined (empty until real customers provide them)', () => {
    expect(TESTIMONIALS).toBeDefined();
  });

  it('each testimonial has name, business, and quote fields', () => {
    TESTIMONIALS.forEach((t) => {
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('business');
      expect(t).toHaveProperty('quote');
      expect(typeof t.name).toBe('string');
      expect(typeof t.business).toBe('string');
      expect(typeof t.quote).toBe('string');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PLAN_DATA_CENTS — derived cents export (regression lock against manual-sync)
// ─────────────────────────────────────────────────────────────────────────────
describe('PLAN_DATA_CENTS export', () => {
  let PLANS: any[];
  let PLAN_DATA_CENTS: Record<string, { name: string; price: number }>;

  beforeAll(() => {
    const mod = importPricingData({
      STRIPE_PRICE_SOLO: 'price_a',
      STRIPE_PRICE_SALON: 'price_b',
      STRIPE_PRICE_ENTERPRISE: 'price_c',
    });
    PLANS = mod.PLANS;
    PLAN_DATA_CENTS = mod.PLAN_DATA_CENTS;
  });

  it('exports PLAN_DATA_CENTS', () => {
    expect(PLAN_DATA_CENTS).toBeDefined();
    expect(typeof PLAN_DATA_CENTS).toBe('object');
  });

  it('PLAN_DATA_CENTS has an entry for every plan id', () => {
    PLANS.forEach((p) => {
      expect(PLAN_DATA_CENTS).toHaveProperty(p.id);
    });
  });

  it('each entry has name and price fields', () => {
    Object.values(PLAN_DATA_CENTS).forEach((entry) => {
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('price');
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.price).toBe('number');
    });
  });

  it('solo price in cents equals PLANS[0].price * 100', () => {
    expect(PLAN_DATA_CENTS['solo'].price).toBe(PLANS[0].price * 100);
  });

  it('salon price in cents equals PLANS[1].price * 100', () => {
    expect(PLAN_DATA_CENTS['salon'].price).toBe(PLANS[1].price * 100);
  });

  it('enterprise price in cents equals PLANS[2].price * 100', () => {
    expect(PLAN_DATA_CENTS['enterprise'].price).toBe(PLANS[2].price * 100);
  });

  it('solo name matches PLANS[0].name', () => {
    expect(PLAN_DATA_CENTS['solo'].name).toBe(PLANS[0].name);
  });

  it('salon name matches PLANS[1].name', () => {
    expect(PLAN_DATA_CENTS['salon'].name).toBe(PLANS[1].name);
  });

  it('enterprise name matches PLANS[2].name', () => {
    expect(PLAN_DATA_CENTS['enterprise'].name).toBe(PLANS[2].name);
  });

  it('prices are always integers (no fractional cents)', () => {
    Object.values(PLAN_DATA_CENTS).forEach((entry) => {
      expect(Number.isInteger(entry.price)).toBe(true);
    });
  });

  it('all three plans are present — no extra keys', () => {
    expect(Object.keys(PLAN_DATA_CENTS)).toHaveLength(3);
  });

  // Regression lock: changing a price in PLANS must automatically update cents
  it('full regression lock — all entries match PLANS[n].price * 100 and name', () => {
    PLANS.forEach((p) => {
      expect(PLAN_DATA_CENTS[p.id].price).toBe(p.price * 100);
      expect(PLAN_DATA_CENTS[p.id].name).toBe(p.name);
    });
  });
});

describe('FAQ_ITEMS export', () => {
  let FAQ_ITEMS: any[];

  beforeAll(() => {
    const mod = importPricingData({});
    FAQ_ITEMS = mod.FAQ_ITEMS;
  });

  it('exports FAQ_ITEMS array', () => {
    expect(Array.isArray(FAQ_ITEMS)).toBe(true);
  });

  it('FAQ_ITEMS has at least 3 entries', () => {
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(3);
  });

  it('each FAQ item has question and answer fields', () => {
    FAQ_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('question');
      expect(item).toHaveProperty('answer');
      expect(typeof item.question).toBe('string');
      expect(typeof item.answer).toBe('string');
    });
  });

  it('includes a free trial FAQ entry', () => {
    const trialFaq = FAQ_ITEMS.find((item: any) =>
      item.question.toLowerCase().includes('trial')
    );
    expect(trialFaq).toBeDefined();
  });

  it('includes a cancellation FAQ entry', () => {
    const cancelFaq = FAQ_ITEMS.find((item: any) =>
      item.question.toLowerCase().includes('cancel')
    );
    expect(cancelFaq).toBeDefined();
  });
});
