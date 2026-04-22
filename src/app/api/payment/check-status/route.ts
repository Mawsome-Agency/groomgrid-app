import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import prisma from '@/lib/prisma';
import { updatePaymentLockoutStatus } from '@/lib/payment-lockout';
import { triggerPaymentCompletionHandler } from '@/lib/payment-completion';
import { stripe } from '@/lib/stripe';

/**
 * GET /api/payment/check-status
 *
 * Manually check payment status for the current user.
 * This endpoint allows users to manually sync their payment status
 * if the webhook failed to process.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get the most recent payment lockout for this user
    const lockout = await prisma.paymentLockout.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!lockout) {
      return NextResponse.json({ message: 'No pending payments found' });
    }

    // If already completed, nothing to do
    if (lockout.status === 'completed') {
      return NextResponse.json({ message: 'Payment already processed' });
    }

    // Check the actual payment status with Stripe
    try {
      // stripe is already imported as a singleton
      const stripeSession = await stripe.checkout.sessions.retrieve(lockout.sessionId);

      if (stripeSession.status === 'complete') {
        // Payment was successful — update lockout and trigger the full
        // payment completion handler so profile is updated correctly
        // with the actual planType and Stripe IDs from the session.
        await updatePaymentLockoutStatus(lockout.id, 'completed');

        const metadata = stripeSession.metadata ?? {};
        if (metadata.userId && metadata.userId !== 'anonymous') {
          await triggerPaymentCompletionHandler({
            ...stripeSession,
            metadata: metadata as { userId?: string; planType?: string; clientId?: string },
          });
        } else {
          // Fallback: update profile with planType from session metadata
          const planType = metadata.planType || 'solo';
          await prisma.profile.update({
            where: { userId },
            data: {
              subscriptionStatus: 'trial',
              planType,
            },
          });
        }

        return NextResponse.json({ message: 'Payment status updated successfully' });
      } else if (stripeSession.status === 'open') {
        return NextResponse.json({ message: 'Payment is still processing' });
      } else {
        // Payment failed
        await updatePaymentLockoutStatus(lockout.id, 'failed', 'Payment session expired or failed');
        return NextResponse.json({ message: 'Payment session expired or failed' });
      }
    } catch (stripeError: any) {
      console.error('Stripe session retrieval error:', stripeError);
      return NextResponse.json({ error: 'Failed to retrieve payment status' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Payment status check error:', error);
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}