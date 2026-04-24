import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth-options'
import prisma from '@/lib/prisma'

type FeedbackType = 'nps' | 'thumbs' | 'bug' | 'feature'

interface FeedbackBody {
  type: FeedbackType
  score?: number
  page?: string
  message?: string
  metadata?: Record<string, unknown>
}

const VALID_TYPES: FeedbackType[] = ['nps', 'thumbs', 'bug', 'feature']

export async function POST(req: NextRequest) {
  let body: Partial<FeedbackBody>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { type, score, page, message, metadata } = body

  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `type must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  // Get session (nullable — anonymous feedback OK)
  const session = await getServerSession(authOptions)

  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId: session?.user?.id ?? null,
        type,
        score: score ?? null,
        page: page ?? null,
        message: message ?? null,
        metadata: (metadata ?? {}) as object,
      },
      select: { id: true },
    })

    return NextResponse.json({ success: true, id: feedback.id })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
}
