import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { createPaymentLockout } from '@/lib/payment-lockout';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const session = await getCheckoutSession(session_id);

    if (!session.metadata?.userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    const userId = session.metadata.userId;
    const planType = (session.metadata.planType as string) ?? 'unknown';

    // Extract paymentId - use session.id if payment_intent is null (setup mode)
    const paymentId = session.payment_intent ?? session.id;

    // Create PAYMENT_INITIATED event - signals user completed checkout
    // Actual profile update happens when webhook confirms payment
    await prisma.paymentEvent.create({
      data: {
        paymentId: paymentId as string,
        eventType: 'PAYMENT_INITIATED',
        payload: {
          userId,
          planType,
          sessionId: session_id,
        },
      },
    });

    // Create payment lockout to track payment processing state
    await createPaymentLockout(userId, paymentId as string, session_id);

    console.log(`[CheckoutSuccess] Created PAYMENT_INITIATED event for payment ${paymentId}`);

    // Return session data for success page billing summary
    // Note: After we modify the checkout route to include plan details, this will have more metadata
    return NextResponse.json({
      session_id: session.id,
      metadata: session.metadata,
      trial_end_days_left: (() => { const sub = typeof session.subscription === 'object' ? session.subscription as { trial_end?: number | null } : null; return (sub?.trial_end) ? Math.max(0, Math.ceil((sub.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 0; })(),
    });
  } catch (error: any) {
    console.error('Checkout success error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
