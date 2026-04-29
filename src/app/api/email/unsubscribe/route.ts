import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/email/unsubscribe?token=<token>
 *
 * Validates the unsubscribe token and returns a confirmation page.
 * This is the link users click in drip emails.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse(getConfirmationPage(false, 'Missing unsubscribe token.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  const tokenRecord = await prisma.unsubscribeToken.findUnique({
    where: { token },
    select: { id: true, userId: true },
  })

  if (!tokenRecord) {
    return new NextResponse(
      getConfirmationPage(false, 'Invalid or expired unsubscribe link.'),
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Check if already unsubscribed
  const profile = await prisma.profile.findUnique({
    where: { userId: tokenRecord.userId },
    select: { emailUnsubscribed: true },
  })

  if (profile?.emailUnsubscribed) {
    return new NextResponse(
      getConfirmationPage(true, "You are already unsubscribed from GroomGrid emails."),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Show confirmation page with the token for POST action
  return new NextResponse(getConfirmationPage(false, null, token), {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  })
}

/**
 * POST /api/email/unsubscribe
 *
 * Processes the unsubscribe action: marks user as unsubscribed
 * and cancels all pending drip emails.
 */
export async function POST(req: NextRequest) {
  let body: { token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token } = body

  if (!token) {
    return NextResponse.json({ error: 'Missing unsubscribe token' }, { status: 400 })
  }

  const tokenRecord = await prisma.unsubscribeToken.findUnique({
    where: { token },
    select: { id: true, userId: true },
  })

  if (!tokenRecord) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  // Mark user as unsubscribed and cancel pending drip emails in a transaction
  await prisma.$transaction([
    prisma.profile.update({
      where: { userId: tokenRecord.userId },
      data: { emailUnsubscribed: true },
    }),
    prisma.dripEmailQueue.updateMany({
      where: {
        userId: tokenRecord.userId,
        status: 'pending',
        sequenceStep: { gt: 0 },
      },
      data: { status: 'cancelled' },
    }),
  ])

  return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })
}

/**
 * Generate a mobile-friendly HTML confirmation page.
 */
function getConfirmationPage(
  alreadyDone: boolean,
  message: string | null,
  token?: string
): string {
  const brand = '#22c55e'
  const bgColor = '#fafaf9'
  const textColor = '#292524'
  const mutedColor = '#78716c'

  let bodyContent: string

  if (alreadyDone) {
    bodyContent = '<p style="font-size:18px;color:' + textColor + ';">' +
      (message || 'You are already unsubscribed.') + '</p>'
  } else if (token) {
    bodyContent =
      '<h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:' + textColor + ';">Unsubscribe from GroomGrid emails?</h1>' +
      '<p style="font-size:15px;line-height:1.6;color:' + textColor + ';margin:0 0 24px 0;">' +
      'You will not receive any more marketing or drip emails from us. ' +
      'Transactional emails (password resets, booking confirmations) will still be sent.' +
      '</p>' +
      '<button onclick="doUnsubscribe()" id="btn" style="display:inline-block;background-color:#dc2626;color:#ffffff;font-weight:600;font-size:16px;padding:14px 32px;border:none;border-radius:8px;cursor:pointer;">' +
      'Yes, Unsubscribe Me</button>' +
      '<p id="status" style="display:none;margin-top:20px;font-size:15px;color:' + mutedColor + ';"></p>' +
      '<script>' +
      'async function doUnsubscribe(){' +
      'var btn=document.getElementById("btn");' +
      'var status=document.getElementById("status");' +
      'btn.disabled=true;btn.textContent="Processing...";' +
      'try{var res=await fetch("/api/email/unsubscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:"' + token + '"})});' +
      'if(res.ok){btn.style.display="none";status.style.display="block";status.style.color="' + brand + '";status.textContent="You have been unsubscribed. Sorry to see you go!";}' +
      'else{btn.disabled=false;btn.textContent="Yes, Unsubscribe Me";status.style.display="block";status.style.color="#dc2626";status.textContent="Something went wrong. Please try again.";}' +
      '}catch(e){btn.disabled=false;btn.textContent="Yes, Unsubscribe Me";status.style.display="block";status.style.color="#dc2626";status.textContent="Network error. Please try again.";}}' +
      '</script>'
  } else {
    bodyContent = '<p style="font-size:18px;color:' + textColor + ';">' +
      (message || 'Something went wrong.') + '</p>'
  }

  return '<!DOCTYPE html>' +
    '<html lang="en"><head><meta charset="UTF-8"/>' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
    '<title>Unsubscribe — GroomGrid</title></head>' +
    '<body style="margin:0;padding:0;background-color:' + bgColor + ';font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,sans-serif;color:' + textColor + ';">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:' + bgColor + ';padding:40px 20px;min-height:100vh;">' +
    '<tr><td align="center" valign="middle">' +
    '<table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;background-color:#ffffff;border-radius:12px;border:1px solid #e7e5e4;overflow:hidden;">' +
    '<tr><td style="background-color:' + brand + ';padding:20px 24px;"><p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">🐾 GroomGrid</p></td></tr>' +
    '<tr><td style="padding:32px;">' + bodyContent + '</td></tr>' +
    '<tr><td style="padding:16px 24px;border-top:1px solid #e7e5e4;"><p style="margin:0;font-size:13px;color:' + mutedColor + ';text-align:center;">GroomGrid — Built for groomers, by groomers.</p></td></tr>' +
    '</table></td></tr></table></body></html>'
}
