import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        include: {
          profile: true,
          _count: { select: { analyticsEvents: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count(),
    ])

    const data = users.map((u: any) => ({
      user_id: u.id,
      email: u.email,
      business_name: u.profile?.businessName ?? null,
      plan: u.profile?.subscriptionStatus ?? 'trial',
      trial_ends_at: u.profile?.trialEndsAt ?? null,
      signed_up_at: u.createdAt,
      event_count: u._count.analyticsEvents,
      engagement_score: u._count.analyticsEvents,
    }))

    return NextResponse.json({ data, total, limit, offset })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch engagement data: ${error.message}` },
      { status: 500 }
    )
  }
}
