import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { createCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackPlanSelected } from '@/lib/ga4';

export async function POST(req: NextRequest) {
  try {
    const { userId, planType, customerEmail } = await req.json();

    if (!userId || !planType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const prices: Record<string, number> = { solo: 29, salon: 79, enterprise: 149 };
    trackPlanSelected(planType, prices[planType]);

    const session = await createCheckoutSession({
      userId,
      planType: planType as 'solo' | 'salon' | 'enterprise',
      customerEmail: customerEmail || `${userId}@groomgrid.app`,
      businessName: profile.businessName,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
  }
}
