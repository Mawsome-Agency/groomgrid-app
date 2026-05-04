import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { createPaymentLockout } from '@/lib/payment-lockout';
import { apiError } from '@/lib/api-errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return apiError('Missing session_id', 400);
    }

    const session = await getCheckoutSession(session_id);

    if (!session.metadata?.userId) {
      return apiError('Invalid session', 400);
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

    // Extract discount/coupon information from Stripe session
    // Stripe SDK types don't always expose discounts on Response<Session>, so we cast
    const stripeSession = session as unknown as Record<string, unknown>;
    const discounts = (stripeSession.discounts as Array<Record<string, unknown>> | undefined) ?? [];
    const firstDiscount = discounts[0];
    const couponId = firstDiscount
      ? (typeof firstDiscount.coupon === 'string' ? firstDiscount.coupon : (firstDiscount.coupon as Record<string, string>)?.id)
      : null;

    const totalDetails = stripeSession.total_details as Record<string, number> | undefined;
    const amountDiscount = totalDetails?.amount_discount ?? 0;
    const amountSubtotal = (stripeSession.amount_subtotal as number) ?? 0;
    const amountTotal = (stripeSession.amount_total as number) ?? 0;

    // Founding member = GROOMERFOUNDING coupon OR 100% off (discount covers full subtotal)
    const isFoundingMember = couponId === 'GROOMERFOUNDING' ||
      (amountDiscount > 0 && amountTotal === 0 && amountSubtotal > 0);

    // Calculate discount percentage for display
    const discountPercentage = amountSubtotal > 0
      ? Math.round((amountDiscount / amountSubtotal) * 100)
      : 0;

    // Build human-readable discount description
    let discountDescription = null;
    if (isFoundingMember) {
      discountDescription = 'Founding Member — free for life. Our thank-you for being an early believer.';
    } else if (couponId === 'BETA50') {
      discountDescription = 'Launch pricing — 50% off first month';
    } else if (amountDiscount > 0 && discountPercentage > 0) {
      discountDescription = `${discountPercentage}% off applied at checkout`;
    }

    // Return session data for success page billing summary
    return NextResponse.json({
      session_id: session.id,
      metadata: session.metadata,
      trial_end_days_left: (() => { const sub = typeof session.subscription === 'object' ? session.subscription as { trial_end?: number | null } : null; return (sub?.trial_end) ? Math.max(0, Math.ceil((sub.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 0; })(),
      isFoundingMember,
      promoCode: couponId,
      discountDescription,
      discountPercentage: isFoundingMember ? 100 : discountPercentage,
      amountDiscount,
    });
  } catch (error: unknown) {
    console.error('Checkout success error:', error);
    return apiError('Failed to fetch session', 500);
  }
}
