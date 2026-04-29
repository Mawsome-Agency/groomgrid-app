import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getResend, FROM_EMAIL } from '@/lib/email/resend'
import { getDripEmailContent } from '@/lib/email/drip-templates'
import { getUnsubscribeToken } from '@/lib/email/enroll-drip'

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('CRON_SECRET')
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://getgroomgrid.com'

  const pendingEmails = await prisma.dripEmailQueue.findMany({
    where: {
      status: 'pending',
      scheduledAt: { lte: new Date() },
      user: {
        profile: {
          emailUnsubscribed: false,
        },
      },
    },
    select: {
      id: true,
      userId: true,
      email: true,
      sequenceStep: true,
      user: { select: { businessName: true } },
    },
  })

  if (pendingEmails.length === 0) {
    return NextResponse.json({ processed: 0, failed: 0, skipped: 0 })
  }

  let processed = 0
  let failed = 0
  let skipped = 0

  for (const row of pendingEmails) {
    try {
      const userName = row.user?.businessName ?? row.email.split('@')[0]

      // Get or create unsubscribe token for the real unsubscribe URL
      const token = await getUnsubscribeToken(row.userId)
      const unsubscribeUrl = token
        ? `${appUrl}/api/email/unsubscribe?token=${token}`
        : `${appUrl}/api/email/unsubscribe`

      const { subject, html, text } = getDripEmailContent(
        row.sequenceStep,
        userName,
        appUrl,
        unsubscribeUrl
      )

      const { error: sendError } = await getResend().emails.send({
        from: FROM_EMAIL,
        to: row.email,
        subject,
        html,
        text,
      })

      if (sendError) {
        await prisma.dripEmailQueue.update({
          where: { id: row.id },
          data: { status: 'failed', errorMessage: sendError.message },
        })
        failed++
      } else {
        await prisma.dripEmailQueue.update({
          where: { id: row.id },
          data: { status: 'sent', sentAt: new Date() },
        })
        processed++
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      await prisma.dripEmailQueue.update({
        where: { id: row.id },
        data: { status: 'failed', errorMessage: message },
      })
      failed++
    }
  }

  return NextResponse.json({ processed, failed, skipped })
}
