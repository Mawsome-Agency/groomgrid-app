import { FROM_EMAIL, getResend } from './resend'

// ─── Shared brand helpers (mirrors no-show-templates.ts) ─────────────────────

const BRAND = {
  primary: '#22c55e',
  bg: '#fafaf9',
  text: '#292524',
  textMuted: '#78716c',
  border: '#e7e5e4',
  white: '#ffffff',
}

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GroomGrid</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;color:${BRAND.text};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;border:1px solid ${BRAND.border};overflow:hidden;">
          <tr>
            <td style="background-color:${BRAND.primary};padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.5px;">🐾 GroomGrid</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid ${BRAND.border};background-color:${BRAND.bg};">
              <p style="margin:0;font-size:13px;color:${BRAND.textMuted};text-align:center;">
                GroomGrid — Built for groomers, by groomers.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function infoBox(content: string): string {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;border-radius:8px;border:1px solid ${BRAND.border};overflow:hidden;">
    <tr>
      <td style="padding:16px 20px;background-color:#fafaf9;font-size:14px;line-height:1.8;color:${BRAND.text};">
        ${content}
      </td>
    </tr>
  </table>`
}

function formatTime(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatTimeOnly(date: Date): string {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ─── Shared appointment detail types ─────────────────────────────────────────

export interface AppointmentReminderDetails {
  clientName: string
  petName?: string
  service: string
  startTime: Date
  price: number       // in cents
  clientAddress?: string
  clientPhone?: string
  notes?: string
}

// ─── 24-hour reminder — sent to groomer ──────────────────────────────────────

export interface Send24hReminderParams {
  groomerEmail: string
  groomerName: string
  appointment: AppointmentReminderDetails
  appUrl: string
}

export async function send24hReminder(p: Send24hReminderParams) {
  const { appointment: appt } = p
  const formattedTime = formatTime(appt.startTime)
  const formattedPrice = `$${(appt.price / 100).toFixed(2)}`

  const detailRows = [
    `<strong>Client:</strong> ${appt.clientName}${appt.petName ? ` &amp; ${appt.petName}` : ''}`,
    `<strong>Service:</strong> ${appt.service}`,
    `<strong>Time:</strong> ${formattedTime}`,
    `<strong>Price:</strong> ${formattedPrice}`,
    appt.clientAddress ? `<strong>Location:</strong> ${appt.clientAddress}` : null,
    appt.clientPhone ? `<strong>Phone:</strong> ${appt.clientPhone}` : null,
    appt.notes ? `<strong>Notes:</strong> ${appt.notes}` : null,
  ]
    .filter(Boolean)
    .join('<br/>')

  const html = emailWrapper(`
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${BRAND.text};">Appointment tomorrow 📅</h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:${BRAND.textMuted};">
      Just a heads-up — you have an appointment coming up in about 24 hours.
    </p>
    ${infoBox(detailRows)}
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      Everything look good? You can view or edit this appointment in your schedule.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      <a href="${p.appUrl}/schedule" style="color:${BRAND.primary};font-weight:600;text-decoration:none;">View your schedule →</a>
    </p>
  `)

  const textLines = [
    'Appointment reminder — tomorrow',
    '',
    `Client: ${appt.clientName}${appt.petName ? ` & ${appt.petName}` : ''}`,
    `Service: ${appt.service}`,
    `Time: ${formattedTime}`,
    `Price: ${formattedPrice}`,
    appt.clientAddress ? `Location: ${appt.clientAddress}` : null,
    appt.clientPhone ? `Phone: ${appt.clientPhone}` : null,
    appt.notes ? `Notes: ${appt.notes}` : null,
    '',
    `View schedule: ${p.appUrl}/schedule`,
  ].filter((l) => l !== null) as string[]

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: p.groomerEmail,
    subject: `Tomorrow: ${appt.service} for ${appt.clientName}${appt.petName ? ` (${appt.petName})` : ''} at ${formatTimeOnly(appt.startTime)}`,
    html,
    text: textLines.join('\n'),
  })
}

// ─── Day-of reminder — sent to groomer ───────────────────────────────────────

export interface SendDayOfReminderParams {
  groomerEmail: string
  groomerName: string
  appointment: AppointmentReminderDetails
  appUrl: string
}

export async function sendDayOfReminder(p: SendDayOfReminderParams) {
  const { appointment: appt } = p
  const formattedTime = formatTime(appt.startTime)
  const formattedPrice = `$${(appt.price / 100).toFixed(2)}`

  const detailRows = [
    `<strong>Client:</strong> ${appt.clientName}${appt.petName ? ` &amp; ${appt.petName}` : ''}`,
    `<strong>Service:</strong> ${appt.service}`,
    `<strong>Time:</strong> ${formatTimeOnly(appt.startTime)}`,
    `<strong>Price:</strong> ${formattedPrice}`,
    appt.clientAddress ? `<strong>Location:</strong> ${appt.clientAddress}` : null,
    appt.clientPhone ? `<strong>Phone:</strong> ${appt.clientPhone}` : null,
    appt.notes ? `<strong>Notes:</strong> ${appt.notes}` : null,
  ]
    .filter(Boolean)
    .join('<br/>')

  const html = emailWrapper(`
    <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${BRAND.text};">Today's appointment 🐶</h1>
    <p style="margin:0 0 24px 0;font-size:15px;color:${BRAND.textMuted};">
      Good morning! Here's a reminder about your appointment today.
    </p>
    ${infoBox(detailRows)}
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      Have a great grooming session! Mark it complete in GroomGrid when you're done.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      <a href="${p.appUrl}/schedule" style="color:${BRAND.primary};font-weight:600;text-decoration:none;">View your schedule →</a>
    </p>
  `)

  const textLines = [
    "Today's appointment reminder",
    '',
    `Client: ${appt.clientName}${appt.petName ? ` & ${appt.petName}` : ''}`,
    `Service: ${appt.service}`,
    `Time: ${formattedTime}`,
    `Price: ${formattedPrice}`,
    appt.clientAddress ? `Location: ${appt.clientAddress}` : null,
    appt.clientPhone ? `Phone: ${appt.clientPhone}` : null,
    appt.notes ? `Notes: ${appt.notes}` : null,
    '',
    `View schedule: ${p.appUrl}/schedule`,
  ].filter((l) => l !== null) as string[]

  return getResend().emails.send({
    from: FROM_EMAIL,
    to: p.groomerEmail,
    subject: `Today: ${appt.service} for ${appt.clientName}${appt.petName ? ` (${appt.petName})` : ''} at ${formatTimeOnly(appt.startTime)}`,
    html,
    text: textLines.join('\n'),
  })
}
