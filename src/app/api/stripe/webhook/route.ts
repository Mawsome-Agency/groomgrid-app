import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import {
  trackSubscriptionUpdatedServer,
  trackSubscriptionCancelledServer,
  trackPaymentSuccessServer,
  trackPaymentFailedServer,
} from '@/lib/ga4-server';
import { triggerPaymentCompletionHandler } from '@/lib/payment-completion';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        // Extract paymentId - use session.id if payment_intent is null (setup mode)
        const paymentId = session.payment_intent ?? session.id;

        if (userId) {
          // Create PAYMENT_CONFIRMED event to signal webhook received
          await prisma.paymentEvent.create({
            data: {
              paymentId: (session as any).payment_intent ?? (session as any).id,
              eventType: 'PAYMENT_CONFIRMED',
              payload: {
                userId,
                sessionId: session.id,
              },
            },
          });

          // Trigger payment completion handler
          // This is idempotent - will check for COMPLETION_PROCESSED first
          await triggerPaymentCompletionHandler(session as any);
        }
        break;
      }

      case 'customer.subscription.created': {
        // Subscription creation is now handled by triggerPaymentCompletionHandler
        // This handler is kept for logging/debugging purposes only
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          console.log(`[Webhook] subscription.created for user ${userId}: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
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
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.profile.update({
            where: { userId },
            data: { subscriptionStatus: 'cancelled' },
          });

          await trackSubscriptionCancelledServer(userId, subscription.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
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

            // Track payment success in GA4
            await trackPaymentSuccessServer(
              profile.userId,
              invoice.id,
              invoice.amount_paid || 0
            );
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
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

            // Track payment failure in GA4
            await trackPaymentFailedServer(
              profile.userId,
              invoice.id,
              (invoice as any).last_payment_error?.message || 'unknown'
            );
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
