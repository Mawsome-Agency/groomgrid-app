/**
 * @jest-environment node
 *
 * Unit tests for src/lib/ab-test.ts (server-side A/B testing).
 * Tests: getVariant, getTestConfig, assignVariant, trackConversion,
 *        getTestResults, createTest, getActiveTests, stopTest.
 */

// --- Mocks ---

jest.mock('@/lib/prisma', () => {
  const mock = {
    aBTest: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    aBTestAssignment: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    aBTestConversion: {
      create: jest.fn(),
      groupBy: jest.fn(),
    },
  };
  return { __esModule: true, default: mock, prisma: mock };
});

// --- Imports ---

import {
  getVariant,
  getTestConfig,
  assignVariant,
  trackConversion,
  getTestResults,
  createTest,
  getActiveTests,
  stopTest,
  type Variant,
  type ABTestConfig,
} from '@/lib/ab-test';
import { prisma } from '@/lib/prisma';

// Typed mock helpers
const db = prisma as any;

// Shared fixture factory
function makeTestRecord(overrides: Partial<any> = {}) {
  return {
    id: 'test-id-1',
    name: 'homepage-hero',
    description: 'Hero copy test',
    variantA: { headline: 'Book now' },
    variantB: { headline: 'Try free' },
    splitRatio: 50,
    active: true,
    startedAt: new Date(),
    endedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeAssignment(id: string, variant: Variant) {
  return { id, testId: 'test-id-1', userId: `user-${id}`, sessionId: null, variant, createdAt: new Date() };
}

// ─────────────────────────────────────────────
// getVariant — pure hash function
// ─────────────────────────────────────────────
describe('getVariant', () => {
  it('returns "A" or "B" only', () => {
    const result = getVariant('test-name', 'user-1');
    expect(['A', 'B']).toContain(result);
  });

  it('is deterministic — same inputs always produce same variant', () => {
    const first = getVariant('hero-test', 'user-abc');
    const second = getVariant('hero-test', 'user-abc');
    const third = getVariant('hero-test', 'user-abc');
    expect(first).toBe(second);
    expect(second).toBe(third);
  });

  it('prefers userId over sessionId', () => {
    // With userId present, sessionId should be ignored
    const withBoth = getVariant('test', 'user-1', 'session-1');
    const withUserOnly = getVariant('test', 'user-1');
    expect(withBoth).toBe(withUserOnly);
  });

  it('falls back to sessionId when userId is absent', () => {
    const result = getVariant('test', undefined, 'session-42');
    expect(['A', 'B']).toContain(result);
    // Must be consistent
    expect(getVariant('test', undefined, 'session-42')).toBe(result);
  });

  it('falls back to "anonymous" when both userId and sessionId are absent', () => {
    const result = getVariant('test');
    expect(['A', 'B']).toContain(result);
    // Must be consistent — anonymous always maps to the same bucket
    expect(getVariant('test')).toBe(result);
  });

  it('different test names produce different distributions for the same user', () => {
    // Run a few users through two different tests — distributions should differ
    const results: Record<string, Variant[]> = { testA: [], testB: [] };
    for (let i = 0; i < 20; i++) {
      results.testA.push(getVariant('test-alpha', `u-${i}`));
      results.testB.push(getVariant('test-beta', `u-${i}`));
    }
    // Not every user should get the same variant in both tests
    const allSame = results.testA.every((v, idx) => v === results.testB[idx]);
    expect(allSame).toBe(false);
  });

  it('produces both A and B variants across many users (not degenerate)', () => {
    const variants = Array.from({ length: 100 }, (_, i) =>
      getVariant('distribution-test', `user-${i}`)
    );
    // Must produce BOTH variants — function is not degenerate
    expect(variants).toContain('A');
    expect(variants).toContain('B');
    // Reasonable: neither variant should consume >90% of the sample
    const aCount = variants.filter((v) => v === 'A').length;
    expect(aCount).toBeGreaterThan(5);
    expect(aCount).toBeLessThan(95);
  });
});

// ─────────────────────────────────────────────
// getTestConfig
// ─────────────────────────────────────────────
describe('getTestConfig', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns ABTestConfig when test is active', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());

    const config = await getTestConfig('homepage-hero');

    expect(config).not.toBeNull();
    expect(config!.name).toBe('homepage-hero');
    expect(config!.active).toBe(true);
    expect(config!.splitRatio).toBe(50);
    expect(config!.variantA).toEqual({ headline: 'Book now' });
    expect(config!.variantB).toEqual({ headline: 'Try free' });
  });

  it('returns null when test does not exist', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(null);

    const config = await getTestConfig('nonexistent-test');

    expect(config).toBeNull();
  });

  it('returns null when test is inactive', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord({ active: false }));

    const config = await getTestConfig('paused-test');

    expect(config).toBeNull();
  });

  it('queries by the exact test name', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(null);

    await getTestConfig('my-specific-test');

    expect(db.aBTest.findUnique).toHaveBeenCalledWith({
      where: { name: 'my-specific-test' },
    });
  });

  it('maps all prisma fields to ABTestConfig shape', async () => {
    const record = makeTestRecord({ description: 'A test description', splitRatio: 70 });
    db.aBTest.findUnique.mockResolvedValueOnce(record);

    const config = await getTestConfig('homepage-hero');

    expect(config).toMatchObject({
      id: 'test-id-1',
      name: 'homepage-hero',
      description: 'A test description',
      splitRatio: 70,
      active: true,
    });
  });

  it('handles null description without throwing', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord({ description: null }));

    const config = await getTestConfig('homepage-hero');

    expect(config!.description).toBeNull();
  });
});

// ─────────────────────────────────────────────
// assignVariant
// ─────────────────────────────────────────────
describe('assignVariant', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns "A" when test does not exist (safe default)', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(null);

    const variant = await assignVariant('nonexistent', 'user-1');

    expect(variant).toBe('A');
    expect(db.aBTestAssignment.create).not.toHaveBeenCalled();
  });

  it('returns "A" when test is inactive (safe default)', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord({ active: false }));

    const variant = await assignVariant('inactive-test', 'user-1');

    expect(variant).toBe('A');
  });

  it('creates an assignment when none exists for this user', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(null);
    db.aBTestAssignment.create.mockResolvedValueOnce({});

    const variant = await assignVariant('homepage-hero', 'user-new');

    expect(db.aBTestAssignment.create).toHaveBeenCalledTimes(1);
    const { data } = db.aBTestAssignment.create.mock.calls[0][0];
    expect(data.testId).toBe('test-id-1');
    expect(data.userId).toBe('user-new');
    expect(['A', 'B']).toContain(data.variant);
  });

  it('does NOT create a duplicate assignment when one already exists', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(
      makeAssignment('assign-1', 'B')
    );

    const variant = await assignVariant('homepage-hero', 'user-returning');

    expect(db.aBTestAssignment.create).not.toHaveBeenCalled();
    expect(variant).toBe('B'); // returns the hash-based variant, not the stored one
  });

  it('accepts sessionId when userId is absent', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(null);
    db.aBTestAssignment.create.mockResolvedValueOnce({});

    await assignVariant('homepage-hero', undefined, 'session-xyz');

    const { data } = db.aBTestAssignment.create.mock.calls[0][0];
    expect(data.sessionId).toBe('session-xyz');
    expect(data.userId).toBeUndefined();
  });

  it('returns a valid Variant type', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(null);
    db.aBTestAssignment.create.mockResolvedValueOnce({});

    const variant = await assignVariant('homepage-hero', 'user-123');

    expect(['A', 'B']).toContain(variant);
  });
});

// ─────────────────────────────────────────────
// trackConversion
// ─────────────────────────────────────────────
describe('trackConversion', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is a no-op when test does not exist', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(null);

    await trackConversion('nonexistent', 'signup', 'user-1');

    expect(db.aBTestConversion.create).not.toHaveBeenCalled();
  });

  it('is a no-op when no assignment is found for the user', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(null);

    await trackConversion('homepage-hero', 'signup', 'user-unassigned');

    expect(db.aBTestConversion.create).not.toHaveBeenCalled();
  });

  it('creates a conversion record when assignment exists', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(
      makeAssignment('assign-1', 'A')
    );
    db.aBTestConversion.create.mockResolvedValueOnce({});

    await trackConversion('homepage-hero', 'signup', 'user-1');

    expect(db.aBTestConversion.create).toHaveBeenCalledTimes(1);
    const { data } = db.aBTestConversion.create.mock.calls[0][0];
    expect(data.testId).toBe('test-id-1');
    expect(data.assignmentId).toBe('assign-1');
    expect(data.event).toBe('signup');
    expect(data.userId).toBe('user-1');
  });

  it('includes metadata when provided', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(
      makeAssignment('assign-2', 'B')
    );
    db.aBTestConversion.create.mockResolvedValueOnce({});

    const meta = { plan: 'solo', amount: 2900 };
    await trackConversion('homepage-hero', 'payment', 'user-2', undefined, meta);

    const { data } = db.aBTestConversion.create.mock.calls[0][0];
    expect(data.metadata).toEqual(meta);
    expect(data.event).toBe('payment');
  });

  it('works with sessionId when userId is absent', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.findFirst.mockResolvedValueOnce(
      makeAssignment('assign-3', 'A')
    );
    db.aBTestConversion.create.mockResolvedValueOnce({});

    await trackConversion('homepage-hero', 'cta_click', undefined, 'session-9');

    const { data } = db.aBTestConversion.create.mock.calls[0][0];
    expect(data.sessionId).toBe('session-9');
    expect(data.userId).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// getTestResults
// ─────────────────────────────────────────────
describe('getTestResults', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns null when test does not exist', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(null);

    const result = await getTestResults('nonexistent');

    expect(result).toBeNull();
  });

  it('returns zero-rate results when there are no assignments', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.groupBy.mockResolvedValueOnce([]);
    db.aBTestConversion.groupBy.mockResolvedValueOnce([]);
    db.aBTestAssignment.findMany.mockResolvedValueOnce([]);

    const result = await getTestResults('homepage-hero');

    expect(result).not.toBeNull();
    expect(result!.variantA.views).toBe(0);
    expect(result!.variantA.rate).toBe(0);
    expect(result!.variantB.views).toBe(0);
    expect(result!.variantB.rate).toBe(0);
    expect(result!.sampleSize).toBe(0);
    expect(result!.winner).toBeUndefined();
  });

  it('calculates views, conversions and rate correctly', async () => {
    const assignments = [
      makeAssignment('a1', 'A'),
      makeAssignment('a2', 'A'),
      makeAssignment('a3', 'B'),
    ];

    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.groupBy.mockResolvedValueOnce([]);
    // a1 had 1 conversion, a3 had 1 conversion
    db.aBTestConversion.groupBy.mockResolvedValueOnce([
      { assignmentId: 'a1', _count: 1 },
      { assignmentId: 'a3', _count: 1 },
    ]);
    db.aBTestAssignment.findMany.mockResolvedValueOnce(assignments);

    const result = await getTestResults('homepage-hero');

    expect(result!.variantA.views).toBe(2);
    expect(result!.variantA.conversions).toBe(1);
    expect(result!.variantA.rate).toBe(50); // 1/2 = 50%

    expect(result!.variantB.views).toBe(1);
    expect(result!.variantB.conversions).toBe(1);
    expect(result!.variantB.rate).toBe(100); // 1/1 = 100%

    expect(result!.sampleSize).toBe(3);
  });

  it('declares winner "A" when A has a higher rate', async () => {
    const assignments = [
      makeAssignment('a1', 'A'),
      makeAssignment('a2', 'B'),
    ];
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.groupBy.mockResolvedValueOnce([]);
    db.aBTestConversion.groupBy.mockResolvedValueOnce([
      { assignmentId: 'a1', _count: 1 },
    ]);
    db.aBTestAssignment.findMany.mockResolvedValueOnce(assignments);

    const result = await getTestResults('homepage-hero');

    expect(result!.winner).toBe('A');
  });

  it('declares winner "B" when B has a higher rate', async () => {
    const assignments = [
      makeAssignment('a1', 'A'),
      makeAssignment('a2', 'B'),
    ];
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.groupBy.mockResolvedValueOnce([]);
    db.aBTestConversion.groupBy.mockResolvedValueOnce([
      { assignmentId: 'a2', _count: 1 },
    ]);
    db.aBTestAssignment.findMany.mockResolvedValueOnce(assignments);

    const result = await getTestResults('homepage-hero');

    expect(result!.winner).toBe('B');
  });

  it('has no winner when conversion rates are equal', async () => {
    const assignments = [
      makeAssignment('a1', 'A'),
      makeAssignment('a2', 'B'),
    ];
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.groupBy.mockResolvedValueOnce([]);
    db.aBTestConversion.groupBy.mockResolvedValueOnce([
      { assignmentId: 'a1', _count: 1 },
      { assignmentId: 'a2', _count: 1 },
    ]);
    db.aBTestAssignment.findMany.mockResolvedValueOnce(assignments);

    const result = await getTestResults('homepage-hero');

    expect(result!.winner).toBeUndefined();
  });

  it('includes testName in the result', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.groupBy.mockResolvedValueOnce([]);
    db.aBTestConversion.groupBy.mockResolvedValueOnce([]);
    db.aBTestAssignment.findMany.mockResolvedValueOnce([]);

    const result = await getTestResults('homepage-hero');

    expect(result!.testName).toBe('homepage-hero');
  });
});

// ─────────────────────────────────────────────
// createTest
// ─────────────────────────────────────────────
describe('createTest', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a test with provided data and returns ABTestConfig', async () => {
    const stored = makeTestRecord({ splitRatio: 60 });
    db.aBTest.create.mockResolvedValueOnce(stored);

    const config = await createTest(
      'hero-cta-test',
      'CTA copy experiment',
      { cta: 'Book now' },
      { cta: 'Try free' },
      60
    );

    expect(config.name).toBe('homepage-hero');
    expect(config.splitRatio).toBe(60);
    expect(db.aBTest.create).toHaveBeenCalledTimes(1);
  });

  it('defaults splitRatio to 50 when not provided', async () => {
    db.aBTest.create.mockResolvedValueOnce(makeTestRecord());

    await createTest('hero-test', null, { a: 1 }, { b: 2 });

    const { data } = db.aBTest.create.mock.calls[0][0];
    expect(data.splitRatio).toBe(50);
  });

  it('passes variantA and variantB to the DB', async () => {
    db.aBTest.create.mockResolvedValueOnce(makeTestRecord());
    const varA = { headline: 'Hello' };
    const varB = { headline: 'World' };

    await createTest('test', null, varA, varB);

    const { data } = db.aBTest.create.mock.calls[0][0];
    expect(data.variantA).toEqual(varA);
    expect(data.variantB).toEqual(varB);
    expect(data.active).toBe(true);
  });
});

// ─────────────────────────────────────────────
// getActiveTests
// ─────────────────────────────────────────────
describe('getActiveTests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty array when no active tests exist', async () => {
    db.aBTest.findMany.mockResolvedValueOnce([]);

    const tests = await getActiveTests();

    expect(tests).toEqual([]);
  });

  it('returns mapped ABTestConfig array for active tests', async () => {
    db.aBTest.findMany.mockResolvedValueOnce([makeTestRecord(), makeTestRecord({ id: 'test-2', name: 'pricing-page' })]);

    const tests = await getActiveTests();

    expect(tests).toHaveLength(2);
    expect(tests[0].name).toBe('homepage-hero');
    expect(tests[1].name).toBe('pricing-page');
  });

  it('queries only active tests', async () => {
    db.aBTest.findMany.mockResolvedValueOnce([]);

    await getActiveTests();

    expect(db.aBTest.findMany).toHaveBeenCalledWith({
      where: { active: true },
    });
  });
});

// ─────────────────────────────────────────────
// stopTest
// ─────────────────────────────────────────────
describe('stopTest', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns false when test does not exist', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(null);

    const result = await stopTest('nonexistent');

    expect(result).toBe(false);
    expect(db.aBTest.update).not.toHaveBeenCalled();
  });

  it('returns true when test is found and deactivated', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTest.update.mockResolvedValueOnce({});

    const result = await stopTest('homepage-hero');

    expect(result).toBe(true);
  });

  it('sets active=false and endedAt on the test', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTest.update.mockResolvedValueOnce({});

    await stopTest('homepage-hero');

    expect(db.aBTest.update).toHaveBeenCalledTimes(1);
    const { where, data } = db.aBTest.update.mock.calls[0][0];
    expect(where).toEqual({ id: 'test-id-1' });
    expect(data.active).toBe(false);
    expect(data.endedAt).toBeInstanceOf(Date);
  });
});
