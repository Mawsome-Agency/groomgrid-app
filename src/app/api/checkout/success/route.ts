import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackCheckoutCompletedServer, trackSubscriptionStartedServer } from '@/lib/ga4-server';

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

    await prisma.profile.update({
      where: { userId },
      data: {
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
        stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
        planType,
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    // Fire server-side GA4 event via Measurement Protocol
    // (window.gtag is unavailable in server routes — requires GA4_API_SECRET in .env)
    await trackCheckoutCompletedServer(userId, session_id, planType, true);

    // Track subscription started event (conversion event)
    await trackSubscriptionStartedServer(
      userId,
      session.subscription as string,
      planType,
      'trial',
      0
    );

    return NextResponse.redirect(new URL(`/payment-success?session_id=${session_id}`, req.url));
  } catch (error: any) {
    console.error('Checkout success error:', error);
    return NextResponse.redirect(new URL('/plans', req.url));
  }
}
