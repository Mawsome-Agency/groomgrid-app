import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackCheckoutCompleted } from '@/lib/ga4';

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

    await prisma.profile.update({
      where: { userId: session.metadata.userId },
      data: {
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
        stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
        planType: session.metadata.planType as string,
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    trackCheckoutCompleted(session_id, session.metadata.planType, true);

    return NextResponse.redirect(new URL(`/onboarding?session_id=${session_id}`, req.url));
  } catch (error: any) {
    console.error('Checkout success error:', error);
    return NextResponse.redirect(new URL('/plans', req.url));
  }
}
