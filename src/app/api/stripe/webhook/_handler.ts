import { prisma } from '@/lib/prisma';
import {
  trackCheckoutCompletedServer,
  trackSubscriptionStartedServer,
  trackSubscriptionUpdatedServer,
  trackSubscriptionCancelledServer,
  trackPaymentSuccessServer,
  trackPaymentFailedServer,
} from '@/lib/ga4-server';
import { triggerPaymentCompletionHandler } from '@/lib/payment-completion';
import { updatePaymentLockoutStatus } from '@/lib/payment-lockout';
import type Stripe from 'stripe';

/**
 * Check if event has already been processed for idempotency.
 * Filters by normalized event type so PAYMENT_CONFIRMED records
 * (which store webhookEventId, not eventId) don't cause false positives
 * during the window between transaction commit and completion handler success.
 */
async function isEventProcessed(eventId: string, eventType: string): Promise<boolean> {
  const normalizedType = eventType.toUpperCase().replace(/\./g, '_');
  const existing = await prisma.paymentEvent.findFirst({
    where: {
      eventType: normalizedType,
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

      // Guard against 'anonymous' userId from legacy checkout sessions
      // that were created without authentication
      if (userId && userId !== 'anonymous') {
        // Wrap related operations in a transaction for consistency
        await prisma.$transaction(async (tx) => {
          // Upsert PAYMENT_CONFIRMED — idempotent on Stripe retries (unique constraint:
          // paymentId+eventType). Uses webhookEventId (not eventId) in payload so that
          // isEventProcessed() — which queries payload.eventId — cannot match this record
          // before the CHECKOUT_SESSION_COMPLETED idempotency marker is written below.
          await tx.paymentEvent.upsert({
            where: {
              paymentId_eventType: { paymentId, eventType: 'PAYMENT_CONFIRMED' },
            },
            create: {
              paymentId,
              eventType: 'PAYMENT_CONFIRMED',
              payload: {
                userId,
                sessionId: session.id,
                webhookEventId: event.id, // renamed from eventId — no collision with idempotency check
              },
            },
            update: {}, // no-op if already committed on a previous attempt
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

        // Trigger payment completion handler (outside transaction - it has its own idempotency)
        await triggerPaymentCompletionHandler({
          ...session,
          metadata: session.metadata ?? undefined,
        });

        // Fire checkout_completed server-side event for GA4 + local analytics
        const planType = session.metadata?.planType ?? 'unknown';
        const trialStarted = session.metadata?.trialStarted === 'true';
        await trackCheckoutCompletedServer(
          userId,
          userId,
          session.id,
          planType,
          trialStarted
        ).catch((err) => console.error('[Webhook] checkout_completed tracking failed:', err));

        // Write idempotency marker AFTER completion handler succeeds.
        // Placing this last closes the race window: if triggerPaymentCompletionHandler
        // throws, Stripe retries will find no CHECKOUT_SESSION_COMPLETED record and
        // correctly re-run the completion handler instead of silently skipping it.
        await recordEventProcessed(event.id, event.type, paymentId);
      } else if (userId === 'anonymous') {
        console.warn(`[Webhook] checkout.session.completed with userId='anonymous' — session ${session.id} cannot be linked to a real user. This session was likely created by the legacy unauthenticated checkout endpoint.`);
      }
      break;
    }
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        console.log(`[Webhook] subscription.created for user ${userId}: ${subscription.status}`);
        const planType = subscription.metadata?.planType ?? 'unknown';
        const price = (subscription as any).plan?.amount ?? 0;
        // Fire subscription_started server-side event for GA4 + local analytics
        await trackSubscriptionStartedServer(
          userId,
          userId,
          subscription.id,
          planType,
          subscription.status,
          price
        ).catch((err) => console.error('[Webhook] subscription_started tracking failed:', err));
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
