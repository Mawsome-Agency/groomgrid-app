/**
 * A/B Testing Framework - MVP
 * 
 * Simple, hash-based variant assignment for consistent A/B testing.
 * Uses deterministic hashing to ensure users always see the same variant.
 */

import { prisma } from './prisma';

export type Variant = 'A' | 'B';

export interface ABTestConfig {
  id: string;
  name: string;
  description: string | null;
  variantA: Record<string, any>;
  variantB: Record<string, any>;
  splitRatio: number;
  active: boolean;
}

export interface ABTestResult {
  testName: string;
  variantA: {
    views: number;
    conversions: number;
    rate: number;
  };
  variantB: {
    views: number;
    conversions: number;
    rate: number;
  };
  winner?: 'A' | 'B';
  sampleSize: number;
}

/**
 * Simple hash function for deterministic variant assignment
 * Uses djb2 algorithm for consistent hashing
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + char
  }
  return Math.abs(hash);
}

/**
 * Get variant for a user/session based on test name
 * Returns 'A' or 'B' deterministically based on hash
 */
export function getVariant(testName: string, userId?: string, sessionId?: string): Variant {
  // Use userId if available, otherwise sessionId
  const identifier = userId || sessionId || 'anonymous';
  
  // Create hash from test name + identifier for consistent assignment
  const hashInput = `${testName}:${identifier}`;
  const hash = hashString(hashInput);
  
  // Convert hash to 0-1 range
  const normalized = (hash % 1000) / 1000;
  
  // Default 50/50 split (can be adjusted later)
  return normalized < 0.5 ? 'A' : 'B';
}

/**
 * Get test configuration by name
 */
export async function getTestConfig(testName: string): Promise<ABTestConfig | null> {
  const test = await prisma.aBTest.findUnique({
    where: { name: testName },
  });

  if (!test || !test.active) {
    return null;
  }

  return {
    id: test.id,
    name: test.name,
    description: test.description,
    variantA: test.variantA as Record<string, any>,
    variantB: test.variantB as Record<string, any>,
    splitRatio: test.splitRatio,
    active: test.active,
  };
}

/**
 * Assign variant to user/session and record assignment
 */
export async function assignVariant(
  testName: string,
  userId?: string,
  sessionId?: string
): Promise<Variant> {
  const test = await getTestConfig(testName);
  if (!test) {
    // If test doesn't exist, default to A
    return 'A';
  }

  const variant = getVariant(testName, userId, sessionId);

  // Check if already assigned
  const existingAssignment = await prisma.aBTestAssignment.findFirst({
    where: {
      testId: test.id,
      OR: [{ userId }, { sessionId }],
    },
  });

  if (!existingAssignment) {
    // Create new assignment
    await prisma.aBTestAssignment.create({
      data: {
        testId: test.id,
        userId,
        sessionId,
        variant,
      },
    });
  }

  return variant;
}

/**
 * Track conversion event for an A/B test
 */
export async function trackConversion(
  testName: string,
  event: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  const test = await getTestConfig(testName);
  if (!test) {
    return;
  }

  // Find the assignment
  const assignment = await prisma.aBTestAssignment.findFirst({
    where: {
      testId: test.id,
      OR: [{ userId }, { sessionId }],
    },
  });

  if (!assignment) {
    // Track conversion even if no assignment (edge case)
    return;
  }

  // Record conversion
  await prisma.aBTestConversion.create({
    data: {
      testId: test.id,
      assignmentId: assignment.id,
      userId,
      sessionId,
      event,
      metadata: metadata as any,
    },
  });
}

/**
 * Get test results with basic metrics
 */
export async function getTestResults(testName: string): Promise<ABTestResult | null> {
  const test = await getTestConfig(testName);
  if (!test) {
    return null;
  }

  // Get assignments by variant
  const assignmentsByVariant = await prisma.aBTestAssignment.groupBy({
    by: ['variant'],
    where: { testId: test.id },
    _count: true,
  });

  // Get conversions grouped by assignment
  const conversionsByAssignment = await prisma.aBTestConversion.groupBy({
    by: ['assignmentId'],
    where: { testId: test.id },
    _count: true,
  });

  // Build a map of assignmentId -> conversions
  const conversionMap = new Map(
    conversionsByAssignment.map((c) => [c.assignmentId, c._count])
  );

  // Get all assignments to map to conversions
  const allAssignments = await prisma.aBTestAssignment.findMany({
    where: { testId: test.id },
  });

  // Count views and conversions by variant
  let viewsA = 0, conversionsA = 0, viewsB = 0, conversionsB = 0;

  allAssignments.forEach((assignment) => {
    const conversions = conversionMap.get(assignment.id) || 0;
    if (assignment.variant === 'A') {
      viewsA++;
      conversionsA += conversions;
    } else {
      viewsB++;
      conversionsB += conversions;
    }
  });

  const results: ABTestResult = {
    testName,
    variantA: {
      views: viewsA,
      conversions: conversionsA,
      rate: viewsA > 0 ? Math.round((conversionsA / viewsA) * 1000) / 10 : 0,
    },
    variantB: {
      views: viewsB,
      conversions: conversionsB,
      rate: viewsB > 0 ? Math.round((conversionsB / viewsB) * 1000) / 10 : 0,
    },
    sampleSize: viewsA + viewsB,
  };

  // Determine winner (simple comparison)
  if (results.variantA.rate > results.variantB.rate) {
    results.winner = 'A';
  } else if (results.variantB.rate > results.variantA.rate) {
    results.winner = 'B';
  }

  return results;
}

/**
 * Create a new A/B test
 */
export async function createTest(
  name: string,
  description: string | null,
  variantA: Record<string, any>,
  variantB: Record<string, any>,
  splitRatio: number = 50
): Promise<ABTestConfig> {
  const test = await prisma.aBTest.create({
    data: {
      name,
      description,
      variantA: variantA as any,
      variantB: variantB as any,
      splitRatio,
      active: true,
    },
  });

  return {
    id: test.id,
    name: test.name,
    description: test.description,
    variantA: test.variantA as Record<string, any>,
    variantB: test.variantB as Record<string, any>,
    splitRatio: test.splitRatio,
    active: test.active,
  };
}

/**
 * Get all active tests
 */
export async function getActiveTests(): Promise<ABTestConfig[]> {
  const tests = await prisma.aBTest.findMany({
    where: { active: true },
  });

  return tests.map((test) => ({
    id: test.id,
    name: test.name,
    description: test.description,
    variantA: test.variantA as Record<string, any>,
    variantB: test.variantB as Record<string, any>,
    splitRatio: test.splitRatio,
    active: test.active,
  }));
}

/**
 * Stop an active test
 */
export async function stopTest(testName: string): Promise<boolean> {
  const test = await prisma.aBTest.findUnique({
    where: { name: testName },
  });

  if (!test) {
    return false;
  }

  await prisma.aBTest.update({
    where: { id: test.id },
    data: {
      active: false,
      endedAt: new Date(),
    },
  });

  return true;
}
