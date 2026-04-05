import { NextRequest, NextResponse } from 'next/server'
import { enrollUserInDrip } from '@/lib/email/enroll-drip'

interface EnrollBody {
  userId: string
  email: string
}

export async function POST(req: NextRequest) {
  let body: Partial<EnrollBody>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { userId, email } = body
  if (!userId || !email) {
    return NextResponse.json(
      { error: 'userId and email are required' },
      { status: 400 }
    )
  }

  try {
    await enrollUserInDrip(userId, email)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
