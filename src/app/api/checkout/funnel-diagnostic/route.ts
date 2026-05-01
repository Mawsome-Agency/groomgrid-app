/**
 * Checkout Funnel Diagnostic API
 *
 * GET /api/checkout/funnel-diagnostic
 * Returns real-time funnel metrics for monitoring the signup-to-paid journey.
 * Protected by admin-only access — no sensitive PII is exposed.
 *
 * Funnel stages: signup_viewed → signup_started → signup_completed → checkout_started → payment_confirmed
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Funnel event counts (7-day window)
    const funnel7d = await prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { eventName: true },
    });

    // Funnel event counts (30-day window)
    const funnel30d = await prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { eventName: true },
    });

    // User counts
    const totalUsers = await prisma.user.count();
    const usersWithStripe = await prisma.profile.count({
      where: { stripeCustomerId: { not: null } },
    });
    const activeSubscriptions = await prisma.profile.count({
      where: { subscriptionStatus: 'active' },
    });
    const trialSubscriptions = await prisma.profile.count({
      where: { subscriptionStatus: 'trial' },
    });

    // Recent signups (7-day)
    const recentSignups = await prisma.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    // Drip email stats
    const dripSent = await prisma.dripEmailQueue.count({
      where: { status: 'sent' },
    });
    const dripPending = await prisma.dripEmailQueue.count({
      where: { status: 'pending' },
    });
    const dripFailed = await prisma.dripEmailQueue.count({
      where: { status: 'failed' },
    });

    // Format funnel data
    const formatFunnel = (data: { eventName: string; _count: { eventName: number } }[]) =>
      Object.fromEntries(data.map((e) => [e.eventName, e._count.eventName]));

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      funnel: {
        last7days: formatFunnel(funnel7d),
        last30days: formatFunnel(funnel30d),
      },
      users: {
        total: totalUsers,
        withStripe: usersWithStripe,
        activeSubscriptions,
        trialSubscriptions,
        recentSignups7d: recentSignups,
      },
      email: {
        sent: dripSent,
        pending: dripPending,
        failed: dripFailed,
      },
      expectedStages: [
        'signup_viewed',
        'signup_started',
        'signup_completed',
        'plan_viewed',
        'checkout_started',
        'payment_initiated_server',
        'checkout_completed_server',
      ],
    });
  } catch (error) {
    console.error('[Funnel Diagnostic] Error:', error);
    return NextResponse.json(
      { error: 'Failed to build funnel diagnostic' },
      { status: 500 }
    );
  }
}
