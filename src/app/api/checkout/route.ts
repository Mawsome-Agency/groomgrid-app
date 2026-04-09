import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { createCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackApiTimingServer } from '@/lib/ga4-server';

// Note: trackPlanSelected is intentionally fired client-side (plans/page.tsx)
// before this API call. window.gtag is unavailable in server routes.

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { userId, planType, customerEmail } = body

  try {

    if (!userId || !planType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const session = await createCheckoutSession({
      userId,
      planType: planType as 'solo' | 'salon' | 'enterprise',
      customerEmail: customerEmail || `${userId}@groomgrid.app`,
      businessName: profile.businessName,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    const durationMs = Date.now() - startTime
    if (userId) {
      await trackApiTimingServer(userId, '/api/checkout', durationMs, false, error.message || 'unknown_error')
    }
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
  } finally {
    // Track timing for successful requests
    try {
      if (userId) {
        const durationMs = Date.now() - startTime
        await trackApiTimingServer(userId, '/api/checkout', durationMs, true)
      }
    } catch {
      // Ignore timing errors
    }
  }
}
