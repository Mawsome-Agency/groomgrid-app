import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { createCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';

/**
 * POST /api/stripe
 * Public-facing endpoint for Stripe checkout session creation.
 * Accepts { planType } and uses the current authenticated user's session.
 * Delegates to the same createCheckoutSession logic as /api/checkout.
 */
export async function POST(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);

    if (!authSession?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await req.json();

    if (!planType) {
      return NextResponse.json({ error: 'Missing required field: planType' }, { status: 400 });
    }

    const userId = authSession.user.id;
    const customerEmail = authSession.user.email ?? `${userId}@groomgrid.app`;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const session = await createCheckoutSession({
      userId,
      planType: planType as 'solo' | 'salon' | 'enterprise',
      customerEmail,
      businessName: profile.businessName,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
  }
}
