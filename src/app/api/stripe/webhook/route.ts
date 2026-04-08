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
        // planType lives on the checkout session metadata — capture it here
        // since subscription.metadata may not have it at subscription.created time
        const planType = session.metadata?.planType;

        if (userId) {
          await prisma.profile.update({
            where: { userId },
            data: {
              stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
              stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
              // Update planType here while we have reliable session metadata
              ...(planType ? { planType } : {}),
            },
          });
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        // userId may be on subscription metadata (set via subscription_data.metadata)
        const userId = subscription.metadata?.userId;

        if (userId) {
          // planType should already be updated from checkout.session.completed,
          // but fall back to subscription metadata if present
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

          await trackSubscriptionCreatedServer(
            userId,
            subscription.id,
            planType ?? 'unknown',
            subscription.status
          );
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
