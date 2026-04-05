import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getResend, FROM_EMAIL } from '@/lib/email/resend'
import { getDripEmailContent } from '@/lib/email/drip-templates'

interface DripEmailRow {
  id: string
  user_id: string
  email: string
  sequence_step: number
}

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('CRON_SECRET')
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://getgroomgrid.com'

  const { data: pendingEmails, error: fetchError } = await supabase
    .from('drip_email_queue')
    .select('id, user_id, email, sequence_step')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())

  if (fetchError) {
    return NextResponse.json(
      { error: `Failed to fetch pending emails: ${fetchError.message}` },
      { status: 500 }
    )
  }

  if (!pendingEmails || pendingEmails.length === 0) {
    return NextResponse.json({ processed: 0, failed: 0 })
  }

  let processed = 0
  let failed = 0

  for (const row of pendingEmails as DripEmailRow[]) {
    try {
      // Fetch user profile for name
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', row.user_id)
        .single()

      const userName = profile?.full_name ?? row.email.split('@')[0]
      const { subject, html, text } = getDripEmailContent(
        row.sequence_step,
        userName,
        appUrl
      )

      const { error: sendError } = await getResend().emails.send({
        from: FROM_EMAIL,
        to: row.email,
        subject,
        html,
        text,
      })

      if (sendError) {
        await supabase
          .from('drip_email_queue')
          .update({
            status: 'failed',
            error_message: sendError.message,
          })
          .eq('id', row.id)
        failed++
      } else {
        await supabase
          .from('drip_email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', row.id)
        processed++
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      await supabase
        .from('drip_email_queue')
        .update({
          status: 'failed',
          error_message: message,
        })
        .eq('id', row.id)
      failed++
    }
  }

  return NextResponse.json({ processed, failed })
}
