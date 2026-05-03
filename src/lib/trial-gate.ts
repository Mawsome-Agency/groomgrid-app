/**
 * Server-side trial gate — blocks write operations for expired trial users.
 * Used in API routes (appointments POST, clients POST) to enforce the gate.
 */

import prisma from '@/lib/prisma';
import { computeTrialStatus } from '@/lib/trial-status';

export interface TrialGateResult {
  allowed: boolean;
  reason?: string;
  daysLeft?: number;
}

/**
 * Check if a user is allowed to perform write operations.
 * Returns { allowed: true } if they can, or { allowed: false, reason } if gated.
 */
export async function checkTrialWriteAccess(userId: string): Promise<TrialGateResult> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      subscriptionStatus: true,
      trialEndsAt: true,
    },
  });

  if (!profile) {
    return { allowed: false, reason: 'Profile not found' };
  }

  const status = computeTrialStatus(profile.subscriptionStatus, profile.trialEndsAt);

  if (!status.canWrite) {
    return {
      allowed: false,
      reason: 'Your free trial has ended. Please upgrade to continue creating appointments and clients.',
      daysLeft: status.daysLeft,
    };
  }

  return { allowed: true, daysLeft: status.daysLeft };
}
