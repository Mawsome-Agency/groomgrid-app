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

  // Auth required for analytics
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventName,
        properties: (properties ?? {}) as object,
        sessionId: sessionId ?? null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to track event: ${error.message}` },
      { status: 500 }
    )
  }
}
