/**
 * Payment Lockout Service
 *
 * Handles payment state consistency when Stripe webhooks fail.
 * Prevents accounts from getting stuck in inconsistent states.
 */

import prisma from '@/lib/prisma';

export type LockoutStatus = 'processing' | 'completed' | 'failed';

export interface PaymentLockout {
  id: string;
  userId: string;
  paymentId: string;
  status: LockoutStatus;
  sessionId: string;
  errorMessage?: string | null;
  retryCount: number;
  lastRetryAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates a new payment lockout entry when checkout begins
 */
export async function createPaymentLockout(
  userId: string,
  paymentId: string,
  sessionId: string
): Promise<PaymentLockout> {
  return prisma.paymentLockout.create({
    data: {
      userId,
      paymentId,
      sessionId,
      status: 'processing',
    },
  });
}

/**
 * Updates a payment lockout status when webhook completes
 */
export async function updatePaymentLockoutStatus(
  lockoutId: string,
  status: LockoutStatus,
  errorMessage?: string
): Promise<PaymentLockout> {
  return prisma.paymentLockout.update({
    where: { id: lockoutId },
    data: {
      status,
      errorMessage,
      ...(status === 'completed' || status === 'failed' ? { retryCount: 0 } : {}),
      ...(status === 'processing' ? { retryCount: { increment: 1 } } : {}),
      lastRetryAt: status === 'processing' ? new Date() : undefined,
    },
  });
}

/**
 * Gets payment lockout for a user
 */
export async function getPaymentLockoutForUser(userId: string): Promise<PaymentLockout | null> {
  return prisma.paymentLockout.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Gets payment lockout by payment ID
 */
export async function getPaymentLockoutByPaymentId(paymentId: string): Promise<PaymentLockout | null> {
  return prisma.paymentLockout.findUnique({
    where: { id: paymentId },
  });
}

/**
 * Deletes a payment lockout (when payment is fully processed)
 */
export async function deletePaymentLockout(lockoutId: string): Promise<void> {
  await prisma.paymentLockout.delete({
    where: { id: lockoutId },
  });
}

/**
 * Manually retry a failed payment lockout
 */
export async function retryPaymentLockout(lockoutId: string): Promise<PaymentLockout> {
  const lockout = await prisma.paymentLockout.findUnique({
    where: { id: lockoutId },
  });

  if (!lockout) {
    throw new Error('Payment lockout not found');
  }

  // Update retry count and last retry time
  return prisma.paymentLockout.update({
    where: { id: lockoutId },
    data: {
      retryCount: { increment: 1 },
      lastRetryAt: new Date(),
      status: 'processing',
    },
  });
}