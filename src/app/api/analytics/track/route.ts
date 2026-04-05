import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('analytics_events').insert({
    user_id: user.id,
    event_name: eventName,
    properties: properties ?? {},
    session_id: sessionId ?? null,
  })

  if (error) {
    return NextResponse.json(
      { error: `Failed to track event: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
