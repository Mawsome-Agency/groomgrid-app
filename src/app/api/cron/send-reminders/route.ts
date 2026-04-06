import { NextRequest, NextResponse } from 'next/server'
import { sendAppointmentReminders } from '@/lib/email/send-reminders'

// This endpoint should be called by a cron job (e.g., every hour)
// Verify with CRON_SECRET for security

export async function GET(req: NextRequest) {
  // Verify cron secret for security
  const authHeader = req.headers.get('authorization')
  const cronSecret = req.nextUrl.searchParams.get('secret')
  const providedSecret = authHeader?.replace('Bearer ', '') || cronSecret

  if (providedSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await sendAppointmentReminders()
    return NextResponse.json({
      success: true,
      message: 'Reminder job completed',
      results,
    })
  } catch (error) {
    console.error('Reminder job error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Reminder job failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// Also support POST for cron services that use POST
export async function POST(req: NextRequest) {
  return GET(req)
}
