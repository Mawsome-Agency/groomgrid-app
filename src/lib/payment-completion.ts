/**
 * Payment Completion Handler — Coordinates payment state updates
 *
 * Solves race condition between checkout success redirect and Stripe webhooks.
 * Uses event-based state management with idempotency guarantees.
 *
 * Flow:
 * 1. /api/checkout/success creates PAYMENT_INITIATED event
 * 2. /api/stripe/webhook creates PAYMENT_CONFIRMED event
 * 3. This handler triggers on confirmation, dedups via COMPLETION_PROCESSED
 * 4. Single transaction updates Profile with all payment-related fields
 * 5. GA4 events fire after transaction (idempotent)
 */

import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { trackCheckoutCompletedServer, trackSubscriptionStartedServer } from '@/lib/ga4-server';
import type { Prisma } from '@prisma/client';

export type PaymentEventType = 'PAYMENT_INITIATED' | 'PAYMENT_CONFIRMED' | 'COMPLETION_PROCESSED';

export interface CompletionPayload {
  userId: string;
  planType: string;
  sessionId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  clientId?: string;
}

/**
 * Check if completion has already been processed for a payment.
 * Idempotency guard — prevents duplicate profile updates and GA4 events.
 */
async function isCompletionProcessed(paymentId: string): Promise<boolean> {
  const existing = await prisma.paymentEvent.findUnique({
    where: {
      paymentId_eventType: {
        paymentId,
        eventType: 'COMPLETION_PROCESSED',
      },
    },
  });
  return existing !== null;
}

/**
 * Main payment completion handler.
 * Called by checkout.session.completed webhook.
 *
 * Deduplication: Checks for existing COMPLETION_PROCESSED event first.
 * Atomic: Single transaction updates Profile and creates event record.
 * Events: GA4 fires after transaction succeeds.
 */
export async function triggerPaymentCompletionHandler(
  session: {
    id: string;
    customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;
    subscription: string | Stripe.Subscription | null;
    metadata?: { userId?: string; planType?: string; clientId?: string };
  }
): Promise<void> {
  // Extract paymentId - use session.id if payment_intent is null
  const paymentId = session.id;

  // Idempotency check - return early if already processed
  if (await isCompletionProcessed(paymentId)) {
    console.log(`[PaymentCompletion] Already processed for payment ${paymentId}, skipping`);
    return;
  }

  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('[PaymentCompletion] No userId in session metadata');
    return;
  }

  const planType = session.metadata?.planType ?? 'unknown';
  const clientId = session.metadata?.clientId;

  // Extract Stripe IDs with type guards
  const stripeCustomerId = typeof session.customer === 'string' ? session.customer : undefined;
  const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : undefined;

  try {
    // Single transaction: update profile and create completion event
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update profile with all payment-related fields atomically
      await tx.profile.update({
        where: { userId },
        data: {
          stripeCustomerId,
          stripeSubscriptionId,
          planType,
          subscriptionStatus: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
          onboardingStep: 0, // Start onboarding from beginning
        },
      });

      // Create completion event record (dedup marker)
      await tx.paymentEvent.create({
        data: {
          paymentId,
          eventType: 'COMPLETION_PROCESSED',
          payload: {
            userId,
            planType,
            sessionId: session.id,
            stripeCustomerId,
            stripeSubscriptionId,
          },
        },
      });
    });

    console.log(`[PaymentCompletion] Completed payment ${paymentId} for user ${userId}`);

    // Fire GA4 events AFTER transaction succeeds
    // Order matters for funnel tracking
    await trackCheckoutCompletedServer(clientId || userId, userId, session.id, planType, true);

    if (stripeSubscriptionId) {
      // Map planType to price
      const planPriceMap: Record<string, number> = {
        solo: 29,
        salon: 79,
        enterprise: 149,
      };
      const price = planPriceMap[planType] ?? 0;

      await trackSubscriptionStartedServer(
        userId,
        stripeSubscriptionId,
        planType,
        'trial',
        price
      );
    }
  } catch (error) {
    console.error('[PaymentCompletion] Transaction failed:', error);
    throw error; // Let webhook handler return 500 so Stripe retries
  }
}
