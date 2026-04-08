import { NextRequest, NextResponse } from 'next/server'
import {
  findAppointmentsFor24hReminder,
  findAppointmentsForDayOfReminder,
  process24hReminder,
  processDayOfReminder,
} from '@/lib/reminders'

/**
 * POST /api/cron/reminder-check
 *
 * Sends appointment reminder emails to groomers:
 *   - 24h reminders: appointments starting in ~23–25 hours that haven't been reminded yet
 *   - Day-of reminders: appointments starting within the next 12 hours (run at ~7 AM)
 *
 * Should be called twice daily by an external cron service:
 *   - Every hour (or at least once mid-day/evening) to catch 24h reminders
 *   - Once in the morning (~7 AM) to catch day-of reminders
 *
 * Secured by CRON_SECRET header to prevent unauthorized triggers.
 *
 * Response:
 *   { sent24h: number, sentDayOf: number, failed: number, results: ReminderResult[] }
 */
export async function POST(req: NextRequest) {
  // Auth check
  const secret = req.headers.get('CRON_SECRET') ?? req.headers.get('x-cron-secret')
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 24h reminders ──────────────────────────────────────────────────────────
  let upcoming24h: Awaited<ReturnType<typeof findAppointmentsFor24hReminder>> = []
  try {
    upcoming24h = await findAppointmentsFor24hReminder()
  } catch (err: any) {
    console.error('[reminder-check] Failed to query 24h appointments:', err)
    return NextResponse.json({ error: 'Database error (24h query)' }, { status: 500 })
  }

  // ── Day-of reminders ───────────────────────────────────────────────────────
  let upcomingDayOf: Awaited<ReturnType<typeof findAppointmentsForDayOfReminder>> = []
  try {
    upcomingDayOf = await findAppointmentsForDayOfReminder()
  } catch (err: any) {
    console.error('[reminder-check] Failed to query day-of appointments:', err)
    return NextResponse.json({ error: 'Database error (day-of query)' }, { status: 500 })
  }

  const total = upcoming24h.length + upcomingDayOf.length
  if (total === 0) {
    return NextResponse.json({ sent24h: 0, sentDayOf: 0, failed: 0, results: [] })
  }

  console.log(
    `[reminder-check] Found ${upcoming24h.length} 24h reminder(s) and ${upcomingDayOf.length} day-of reminder(s)`
  )

  // Process all reminders concurrently (allSettled so one failure doesn't block others)
  const [results24h, resultsDayOf] = await Promise.all([
    Promise.allSettled(upcoming24h.map(({ id }) => process24hReminder(id))),
    Promise.allSettled(upcomingDayOf.map(({ id }) => processDayOfReminder(id))),
  ])

  const allResults = [
    ...results24h.map((r, i) => {
      if (r.status === 'fulfilled') return r.value
      console.error(`[reminder-check] Unexpected error for 24h reminder ${upcoming24h[i].id}:`, r.reason)
      return {
        appointmentId: upcoming24h[i].id,
        clientName: upcoming24h[i].client.name,
        type: '24h' as const,
        status: 'failed' as const,
        error: r.reason?.message ?? 'Unexpected error',
      }
    }),
    ...resultsDayOf.map((r, i) => {
      if (r.status === 'fulfilled') return r.value
      console.error(`[reminder-check] Unexpected error for day-of reminder ${upcomingDayOf[i].id}:`, r.reason)
      return {
        appointmentId: upcomingDayOf[i].id,
        clientName: upcomingDayOf[i].client.name,
        type: 'day_of' as const,
        status: 'failed' as const,
        error: r.reason?.message ?? 'Unexpected error',
      }
    }),
  ]

  const sent24h = allResults.filter((r) => r.type === '24h' && r.status === 'sent').length
  const sentDayOf = allResults.filter((r) => r.type === 'day_of' && r.status === 'sent').length
  const failed = allResults.filter((r) => r.status === 'failed').length

  console.log(`[reminder-check] Done — 24h sent: ${sent24h}, day-of sent: ${sentDayOf}, failed: ${failed}`)

  return NextResponse.json({
    sent24h,
    sentDayOf,
    failed,
    results: allResults,
  })
}
