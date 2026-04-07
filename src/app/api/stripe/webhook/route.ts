import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import {
  trackSubscriptionCreatedServer,
  trackSubscriptionUpdatedServer,
  trackSubscriptionCancelledServer,
} from '@/lib/ga4-server';

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

        if (userId) {
          await prisma.profile.update({
            where: { userId },
            data: {
              stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
              stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
            },
          });
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.profile.update({
            where: { userId },
            data: {
              subscriptionStatus: subscription.status === 'active' ? 'active' : subscription.status === 'trialing' ? 'trial' : 'past_due',
            },
          });

          // Track subscription creation via GA4 Measurement Protocol
          await trackSubscriptionCreatedServer(
            userId,
            subscription.id,
            subscription.metadata?.planType ?? 'unknown',
            subscription.status
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.profile.update({
            where: { userId },
            data: {
              subscriptionStatus: subscription.status === 'active' ? 'active' : subscription.status === 'trialing' ? 'trial' : 'past_due',
            },
          });

          // Track subscription status changes (upgrades, downgrades, renewals)
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

          // Track cancellation via GA4 Measurement Protocol
          await trackSubscriptionCancelledServer(userId, subscription.id);
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
