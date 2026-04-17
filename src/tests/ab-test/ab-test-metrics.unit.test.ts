/**
 * @jest-environment node
 *
 * Unit tests for src/lib/ab-test-metrics.ts
 * Tests: calculateConversionRate, getTestResults, getActiveTests,
 *        getAllTests, createTest, updateTestStatus, deleteTest.
 */

// --- Mocks ---

jest.mock('@/lib/prisma', () => {
  const mock = {
    aBTest: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    aBTestAssignment: {
      count: jest.fn(),
    },
    aBTestConversion: {
      count: jest.fn(),
    },
  };
  return { __esModule: true, default: mock, prisma: mock };
});

// --- Imports ---

import {
  calculateConversionRate,
  getTestResults,
  getActiveTests,
  getAllTests,
  createTest,
  updateTestStatus,
  deleteTest,
  type TestResults,
} from '@/lib/ab-test-metrics';
import { prisma } from '@/lib/prisma';

const db = prisma as any;

function makeTestRecord(overrides: Partial<any> = {}) {
  return {
    id: 'test-id-1',
    name: 'pricing-cta',
    description: null,
    variantA: {},
    variantB: {},
    splitRatio: 50,
    active: true,
    startedAt: new Date(),
    endedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { assignments: 0, conversions: 0 },
    ...overrides,
  };
}

// ─────────────────────────────────────────────
// calculateConversionRate
// ─────────────────────────────────────────────
describe('calculateConversionRate', () => {
  it('returns 0 when assignments is 0 (no division by zero)', () => {
    expect(calculateConversionRate(0, 0)).toBe(0);
    expect(calculateConversionRate(0, 99)).toBe(0);
  });

  it('returns 50 for 50 conversions out of 100 assignments', () => {
    expect(calculateConversionRate(100, 50)).toBe(50);
  });

  it('returns 100 when every assignment converts', () => {
    expect(calculateConversionRate(10, 10)).toBe(100);
  });

  it('returns 0 when there are no conversions', () => {
    expect(calculateConversionRate(200, 0)).toBe(0);
  });

  it('returns correct value for fractional percentages', () => {
    // 1/3 ≈ 33.333...%
    const rate = calculateConversionRate(3, 1);
    expect(rate).toBeCloseTo(33.333, 2);
  });

  it('handles single assignment with single conversion → 100%', () => {
    expect(calculateConversionRate(1, 1)).toBe(100);
  });

  it('handles large numbers without overflow', () => {
    const rate = calculateConversionRate(1_000_000, 250_000);
    expect(rate).toBe(25);
  });
});

// ─────────────────────────────────────────────
// getTestResults
// ─────────────────────────────────────────────
describe('getTestResults', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns null when test does not exist', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(null);

    const result = await getTestResults('nonexistent-id');

    expect(result).toBeNull();
  });

  it('returns correct views and zero conversions when no one converted', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(10); // variant A
    db.aBTestAssignment.count.mockResolvedValueOnce(8);  // variant B
    db.aBTestConversion.count.mockResolvedValueOnce(0);  // A conversions
    db.aBTestConversion.count.mockResolvedValueOnce(0);  // B conversions

    const result = await getTestResults('test-id-1');

    expect(result!.variantA.views).toBe(10);
    expect(result!.variantA.conversions).toBe(0);
    expect(result!.variantA.rate).toBe(0);
    expect(result!.variantB.views).toBe(8);
    expect(result!.variantB.conversions).toBe(0);
    expect(result!.variantB.rate).toBe(0);
  });

  it('calculates rate correctly for both variants', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(100); // A assignments
    db.aBTestAssignment.count.mockResolvedValueOnce(100); // B assignments
    db.aBTestConversion.count.mockResolvedValueOnce(25);  // A conversions (25%)
    db.aBTestConversion.count.mockResolvedValueOnce(40);  // B conversions (40%)

    const result = await getTestResults('test-id-1');

    expect(result!.variantA.rate).toBe(25);
    expect(result!.variantB.rate).toBe(40);
    expect(result!.totalConversions).toBe(65);
  });

  // ── Winner determination ────────────────────
  it('declares winner "inconclusive" when total conversions <= 10', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(5);
    db.aBTestAssignment.count.mockResolvedValueOnce(5);
    db.aBTestConversion.count.mockResolvedValueOnce(4); // A: 80%
    db.aBTestConversion.count.mockResolvedValueOnce(1); // B: 20%

    const result = await getTestResults('test-id-1');

    // total conversions = 5, which is <= 10 → inconclusive regardless of rates
    expect(result!.winner).toBe('inconclusive');
  });

  it('declares winner "A" when A is > 5 points ahead and conversions > 10', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestConversion.count.mockResolvedValueOnce(40); // A: 40%
    db.aBTestConversion.count.mockResolvedValueOnce(30); // B: 30% (10pt diff)

    const result = await getTestResults('test-id-1');

    expect(result!.totalConversions).toBe(70);
    expect(result!.winner).toBe('A');
  });

  it('declares winner "B" when B is > 5 points ahead and conversions > 10', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestConversion.count.mockResolvedValueOnce(30); // A: 30%
    db.aBTestConversion.count.mockResolvedValueOnce(40); // B: 40% (10pt diff)

    const result = await getTestResults('test-id-1');

    expect(result!.winner).toBe('B');
  });

  it('declares "inconclusive" when rates differ by < 5 points even with > 10 conversions', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestConversion.count.mockResolvedValueOnce(30); // A: 30%
    db.aBTestConversion.count.mockResolvedValueOnce(33); // B: 33% (3pt diff < 5)

    const result = await getTestResults('test-id-1');

    expect(result!.totalConversions).toBeGreaterThan(10);
    expect(result!.winner).toBe('inconclusive');
  });

  it('caps confidence at 95', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestAssignment.count.mockResolvedValueOnce(100);
    db.aBTestConversion.count.mockResolvedValueOnce(100); // A: 100%
    db.aBTestConversion.count.mockResolvedValueOnce(0);   // B: 0%

    const result = await getTestResults('test-id-1');

    expect(result!.confidence).toBeLessThanOrEqual(95);
  });

  it('includes testId and testName in the result', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord({ name: 'my-test' }));
    db.aBTestAssignment.count.mockResolvedValue(0);
    db.aBTestConversion.count.mockResolvedValue(0);

    const result = await getTestResults('test-id-1');

    expect(result!.testId).toBe('test-id-1');
    expect(result!.testName).toBe('my-test');
  });

  it('handles zero assignments for one variant without dividing by zero', async () => {
    db.aBTest.findUnique.mockResolvedValueOnce(makeTestRecord());
    db.aBTestAssignment.count.mockResolvedValueOnce(0);  // A: no assignments
    db.aBTestAssignment.count.mockResolvedValueOnce(10); // B: 10 assignments
    db.aBTestConversion.count.mockResolvedValueOnce(0);
    db.aBTestConversion.count.mockResolvedValueOnce(5);

    const result = await getTestResults('test-id-1');

    expect(result!.variantA.rate).toBe(0);
    expect(result!.variantB.rate).toBe(50);
  });
});

// ─────────────────────────────────────────────
// getActiveTests
// ─────────────────────────────────────────────
describe('getActiveTests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty array when no active tests', async () => {
    db.aBTest.findMany.mockResolvedValueOnce([]);
    const tests = await getActiveTests();
    expect(tests).toEqual([]);
  });

  it('queries only active tests ordered by createdAt desc', async () => {
    db.aBTest.findMany.mockResolvedValueOnce([]);
    await getActiveTests();
    expect(db.aBTest.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      })
    );
  });

  it('includes _count of assignments and conversions', async () => {
    db.aBTest.findMany.mockResolvedValueOnce([]);
    await getActiveTests();
    const [args] = db.aBTest.findMany.mock.calls[0];
    expect(args.include._count.select).toMatchObject({
      assignments: true,
      conversions: true,
    });
  });

  it('returns all active test records', async () => {
    const records = [makeTestRecord(), makeTestRecord({ id: 'test-2', name: 'footer-cta' })];
    db.aBTest.findMany.mockResolvedValueOnce(records);

    const tests = await getActiveTests();

    expect(tests).toHaveLength(2);
    expect(tests[0].name).toBe('pricing-cta');
    expect(tests[1].name).toBe('footer-cta');
  });
});

// ─────────────────────────────────────────────
// getAllTests
// ─────────────────────────────────────────────
describe('getAllTests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('queries without active filter to include inactive tests', async () => {
    db.aBTest.findMany.mockResolvedValueOnce([]);
    await getAllTests();
    const [args] = db.aBTest.findMany.mock.calls[0];
    expect(args.where).toBeUndefined();
  });

  it('returns all tests regardless of active status', async () => {
    const records = [
      makeTestRecord({ active: true }),
      makeTestRecord({ id: 'test-2', active: false }),
    ];
    db.aBTest.findMany.mockResolvedValueOnce(records);

    const tests = await getAllTests();

    expect(tests).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────
// createTest
// ─────────────────────────────────────────────
describe('createTest (metrics)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a test with the provided data', async () => {
    const record = makeTestRecord({ name: 'new-test', splitRatio: 60 });
    db.aBTest.create.mockResolvedValueOnce(record);

    const result = await createTest({
      name: 'new-test',
      description: 'My test',
      variantA: { headline: 'A' },
      variantB: { headline: 'B' },
      splitRatio: 60,
    });

    expect(db.aBTest.create).toHaveBeenCalledTimes(1);
    expect(result.name).toBe('new-test');
  });

  it('defaults splitRatio to 50 when omitted', async () => {
    db.aBTest.create.mockResolvedValueOnce(makeTestRecord());

    await createTest({
      name: 'test',
      variantA: {},
      variantB: {},
    });

    const { data } = db.aBTest.create.mock.calls[0][0];
    expect(data.splitRatio).toBe(50);
  });

  it('passes description to the DB', async () => {
    db.aBTest.create.mockResolvedValueOnce(makeTestRecord());

    await createTest({
      name: 'test',
      description: 'A description',
      variantA: {},
      variantB: {},
    });

    const { data } = db.aBTest.create.mock.calls[0][0];
    expect(data.description).toBe('A description');
  });

  it('does not set description when omitted', async () => {
    db.aBTest.create.mockResolvedValueOnce(makeTestRecord());

    await createTest({ name: 'test', variantA: {}, variantB: {} });

    const { data } = db.aBTest.create.mock.calls[0][0];
    expect(data.description).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// updateTestStatus
// ─────────────────────────────────────────────
describe('updateTestStatus', () => {
  beforeEach(() => jest.clearAllMocks());

  it('activates a test by setting active=true and clearing endedAt', async () => {
    db.aBTest.update.mockResolvedValueOnce({});

    await updateTestStatus('test-id-1', true);

    const { where, data } = db.aBTest.update.mock.calls[0][0];
    expect(where).toEqual({ id: 'test-id-1' });
    expect(data.active).toBe(true);
    expect(data.endedAt).toBeNull();
  });

  it('deactivates a test by setting active=false and recording endedAt', async () => {
    db.aBTest.update.mockResolvedValueOnce({});

    await updateTestStatus('test-id-1', false);

    const { data } = db.aBTest.update.mock.calls[0][0];
    expect(data.active).toBe(false);
    expect(data.endedAt).toBeInstanceOf(Date);
  });

  it('returns void on success', async () => {
    db.aBTest.update.mockResolvedValueOnce({});

    const result = await updateTestStatus('test-id-1', true);

    expect(result).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// deleteTest
// ─────────────────────────────────────────────
describe('deleteTest', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deletes the test by ID', async () => {
    db.aBTest.delete.mockResolvedValueOnce({});

    await deleteTest('test-id-1');

    expect(db.aBTest.delete).toHaveBeenCalledWith({ where: { id: 'test-id-1' } });
  });

  it('returns void on success', async () => {
    db.aBTest.delete.mockResolvedValueOnce({});

    const result = await deleteTest('test-id-1');

    expect(result).toBeUndefined();
  });

  it('calls delete exactly once', async () => {
    db.aBTest.delete.mockResolvedValueOnce({});

    await deleteTest('some-id');

    expect(db.aBTest.delete).toHaveBeenCalledTimes(1);
  });
});
