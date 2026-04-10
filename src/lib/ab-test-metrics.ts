/**
 * A/B Test Metrics Aggregation
 *
 * Provides basic statistics for test results.
 * Focuses on conversion rate calculations.
 */

import { prisma } from './prisma';
import type { Variant } from './ab-test';

export interface VariantResults {
  views: number;
  conversions: number;
  rate: number;
}

export interface TestResults {
  testId: string;
  testName: string;
  variantA: VariantResults;
  variantB: VariantResults;
  totalConversions: number;
  winner?: 'A' | 'B' | 'inconclusive';
  confidence?: number;
}

/**
 * Calculate conversion rate as a percentage.
 */
export function calculateConversionRate(
  assignments: number,
  conversions: number
): number {
  if (assignments === 0) return 0;
  return (conversions / assignments) * 100;
}

/**
 * Get results for a specific test.
 */
export async function getTestResults(testId: string): Promise<TestResults | null> {
  // Get test details
  const test = await prisma.aBTest.findUnique({
    where: { id: testId },
  });

  if (!test) {
    return null;
  }

  // Get counts for each variant
  const variantAAssignments = await prisma.aBTestAssignment.count({
    where: { testId, variant: 'A' },
  });

  const variantBAssignments = await prisma.aBTestAssignment.count({
    where: { testId, variant: 'B' },
  });

  const variantAConversions = await prisma.aBTestConversion.count({
    where: {
      testId,
      assignment: { variant: 'A' },
    },
  });

  const variantBConversions = await prisma.aBTestConversion.count({
    where: {
      testId,
      assignment: { variant: 'B' },
    },
  });

  const variantARate = calculateConversionRate(
    variantAAssignments,
    variantAConversions
  );

  const variantBRate = calculateConversionRate(
    variantBAssignments,
    variantBConversions
  );

  const totalConversions = variantAConversions + variantBConversions;

  // Simple winner determination (no statistical significance yet)
  let winner: 'A' | 'B' | 'inconclusive' = 'inconclusive';
  let confidence = 0;

  if (totalConversions > 10) {
    // Only declare winner if we have meaningful data
    if (variantARate > variantBRate && variantARate > variantBRate + 5) {
      winner = 'A';
      confidence = Math.min(95, (variantARate - variantBRate) * 2);
    } else if (variantBRate > variantARate && variantBRate > variantARate + 5) {
      winner = 'B';
      confidence = Math.min(95, (variantBRate - variantARate) * 2);
    }
  }

  return {
    testId,
    testName: test.name,
    variantA: {
      views: variantAAssignments,
      conversions: variantAConversions,
      rate: variantARate,
    },
    variantB: {
      views: variantBAssignments,
      conversions: variantBConversions,
      rate: variantBRate,
    },
    totalConversions,
    winner,
    confidence,
  };
}

/**
 * Get all active tests.
 */
export async function getActiveTests(): Promise<any[]> {
  const tests = await prisma.aBTest.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          assignments: true,
          conversions: true,
        },
      },
    },
  });

  return tests;
}

/**
 * Get all tests (active and inactive).
 */
export async function getAllTests(): Promise<any[]> {
  const tests = await prisma.aBTest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          assignments: true,
          conversions: true,
        },
      },
    },
  });

  return tests;
}

/**
 * Create a new A/B test.
 */
export async function createTest(data: {
  name: string;
  description?: string;
  variantA: Record<string, any>;
  variantB: Record<string, any>;
  splitRatio?: number;
}) {
  return await prisma.aBTest.create({
    data: {
      name: data.name,
      description: data.description,
      variantA: data.variantA,
      variantB: data.variantB,
      splitRatio: data.splitRatio ?? 50,
    },
  });
}

/**
 * Update test status (active/inactive).
 */
export async function updateTestStatus(
  testId: string,
  active: boolean
): Promise<void> {
  await prisma.aBTest.update({
    where: { id: testId },
    data: {
      active,
      endedAt: active ? null : new Date(),
    },
  });
}

/**
 * Delete a test.
 */
export async function deleteTest(testId: string): Promise<void> {
  await prisma.aBTest.delete({
    where: { id: testId },
  });
}
