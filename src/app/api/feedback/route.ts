import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('feedback')
    .insert({
      user_id: user?.id ?? null,
      type,
      score: score ?? null,
      page: page ?? null,
      message: message ?? null,
      metadata: metadata ?? {},
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json(
      { error: `Failed to save feedback: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, id: data.id })
}
