import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.redirect(new URL('/plans', req.url));
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
        paymentId,
        eventType: 'PAYMENT_INITIATED',
        payload: {
          userId,
          planType,
          sessionId: session_id,
        },
      },
    });

    console.log(`[CheckoutSuccess] Created PAYMENT_INITIATED event for payment ${paymentId}`);

    // Redirect to onboarding immediately - no profile update here
    // Payment will be confirmed via webhook and processed atomically
    return NextResponse.redirect(new URL('/onboarding', req.url));
  } catch (error: any) {
    console.error('Checkout success error:', error);
    return NextResponse.redirect(new URL('/plans', req.url));
  }
}
