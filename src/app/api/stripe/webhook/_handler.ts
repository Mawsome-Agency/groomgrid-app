import { prisma } from '@/lib/prisma';
import {
  trackSubscriptionUpdatedServer,
  trackSubscriptionCancelledServer,
  trackPaymentSuccessServer,
  trackPaymentFailedServer,
} from '@/lib/ga4-server';
import { triggerPaymentCompletionHandler } from '@/lib/payment-completion';
import { updatePaymentLockoutStatus } from '@/lib/payment-lockout';
import type Stripe from 'stripe';

/**
 * Check if event has already been processed for idempotency
 */
async function isEventProcessed(eventId: string, eventType: string): Promise<boolean> {
  const existing = await prisma.paymentEvent.findFirst({
    where: {
      payload: {
        path: ['eventId'],
        equals: eventId,
      },
    },
  });
  return existing !== null;
}

/**
 * Record event processing for idempotency tracking
 */
async function recordEventProcessed(
  eventId: string,
  eventType: string,
  paymentId: string
): Promise<void> {
  await prisma.paymentEvent.create({
    data: {
      paymentId,
      eventType: eventType.toUpperCase().replace(/\./g, '_'),
      payload: {
        eventId,
        processedAt: new Date().toISOString(),
      },
    },
  });
}

/**
 * Centralized handler for Stripe webhook events.
 * This mirrors the logic previously embedded in route.ts.
 */
export const handleStripeEvent = async (event: Stripe.Event) => {
  // Idempotency check: skip if already processed
  if (await isEventProcessed(event.id, event.type)) {
    console.log(`[Webhook] Event ${event.id} already processed, skipping`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      // Extract paymentId - use session.id if payment_intent is null (setup mode)
      const rawPaymentIntent = session.payment_intent;
      const paymentId: string =
        typeof rawPaymentIntent === 'string'
          ? rawPaymentIntent
          : rawPaymentIntent?.id ?? session.id;

      if (userId) {
        // Wrap related operations in a transaction for consistency
        await prisma.$transaction(async (tx) => {
          // Create PAYMENT_CONFIRMED event to signal webhook received
          await tx.paymentEvent.create({
            data: {
              paymentId,
              eventType: 'PAYMENT_CONFIRMED',
              payload: {
                userId,
                sessionId: session.id,
                eventId: event.id,
              },
            },
          });

          // Record event processing for idempotency
          await tx.paymentEvent.create({
            data: {
              paymentId: event.id,
              eventType: 'EVENT_PROCESSED',
              payload: {
                eventId: event.id,
                originalPaymentId: paymentId,
                processedAt: new Date().toISOString(),
              },
            },
          });

          // Update payment lockout status if exists
          const lockout = await tx.paymentLockout.findFirst({
            where: { userId, paymentId },
          });

          if (lockout) {
            await tx.paymentLockout.update({
              where: { id: lockout.id },
              data: { status: 'completed', updatedAt: new Date() },
            });
          }
        });

        // Trigger payment completion handler (outside transaction - it has its own)
        await triggerPaymentCompletionHandler({
          ...session,
          metadata: session.metadata ?? undefined,
        });
      }
      break;
    }
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        console.log(`[Webhook] subscription.created for user ${userId}: ${subscription.status}`);
      }
      // Record event processing
      await recordEventProcessed(event.id, event.type, subscription.id);
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        const planType = subscription.metadata?.planType;
        await prisma.profile.update({
          where: { userId },
          data: {
            subscriptionStatus:
              subscription.status === 'active'
                ? 'active'
                : subscription.status === 'trialing'
                ? 'trial'
                : 'past_due',
            ...(planType ? { planType } : {}),
          },
        });
        await trackSubscriptionUpdatedServer(userId, subscription.id, subscription.status);
      }
      await recordEventProcessed(event.id, event.type, subscription.id);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await prisma.profile.update({
          where: { userId },
          data: { subscriptionStatus: 'cancelled' },
        });
        await trackSubscriptionCancelledServer(userId, subscription.id);
      }
      await recordEventProcessed(event.id, event.type, subscription.id);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
      if (customerId) {
        const profile = await prisma.profile.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (profile) {
          await prisma.profile.update({
            where: { userId: profile.userId },
            data: { subscriptionStatus: 'active' },
          });
          await trackPaymentSuccessServer(
            profile.userId,
            invoice.id,
            invoice.amount_paid || 0
          );
        }
      }
      await recordEventProcessed(event.id, event.type, invoice.id);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : null;
      if (customerId) {
        const profile = await prisma.profile.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (profile) {
          await prisma.profile.update({
            where: { userId: profile.userId },
            data: { subscriptionStatus: 'past_due' },
          });
          const invoiceAny = invoice as unknown as Record<string, unknown>;
          const lastPaymentErrorMessage =
            (invoiceAny.last_payment_error as { message?: string } | undefined)?.message ||
            'unknown';
          await trackPaymentFailedServer(
            profile.userId,
            invoice.id,
            lastPaymentErrorMessage
          );
        }
      }
      await recordEventProcessed(event.id, event.type, invoice.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};
