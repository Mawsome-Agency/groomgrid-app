import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth-options'
import prisma from '@/lib/prisma'

interface TrackBody {
  eventName: string
  properties?: Record<string, unknown>
  sessionId?: string
}

export async function POST(req: NextRequest) {
  let body: Partial<TrackBody>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { eventName, properties, sessionId } = body

  if (!eventName) {
    return NextResponse.json({ error: 'eventName is required' }, { status: 400 })
  }

  // Auth is optional — anonymous pre-signup events (signup_viewed, signup_started)
  // are stored with userId = null. This enables full funnel tracking in the local
  // analytics_events table even before a user account exists.
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id ?? null

  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventName,
        properties: (properties ?? {}) as object,
        sessionId: sessionId ?? null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to track event: ${message}` },
      { status: 500 }
    )
  }
}
