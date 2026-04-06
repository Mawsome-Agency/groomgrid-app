import { emailWrapper, h1, p } from '../drip-templates'
import type { EmailContent } from '../drip-templates'

export function appointmentReminderEmail(params: {
  clientName: string
  petName: string | null
  service: string
  date: string
  time: string
  businessName: string
}): EmailContent {
  const { clientName, petName, service, date, time, businessName } = params

  // Format time to 12-hour format with AM/PM
  const timeObj = new Date(time)
  const formattedTime = timeObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  // Format date to readable format
  const dateObj = new Date(date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const petInfo = petName ? `${petName}'s` : 'your pet\'s'

  const html = emailWrapper(`
    ${h1(`Reminder: ${petInfo} ${service} tomorrow`)}
    ${p(`Hi ${clientName},`)}
    ${p(`This is a friendly reminder that ${petName || 'your pet'} has an appointment scheduled for ${service} tomorrow.`)}

    <table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;background-color:#fafaf9;border-radius:8px;border:1px solid #e7e5e4;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e7e5e4;">
          <p style="margin:0;font-size:13px;color:#78716c;text-transform:uppercase;letter-spacing:0.5px;">Service</p>
          <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:#292524;">${service}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #e7e5e4;">
          <p style="margin:0;font-size:13px;color:#78716c;text-transform:uppercase;letter-spacing:0.5px;">Date</p>
          <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:#292524;">${formattedDate}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:#78716c;text-transform:uppercase;letter-spacing:0.5px;">Time</p>
          <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:#292524;">${formattedTime}</p>
        </td>
      </tr>
    </table>

    ${p(`Please arrive a few minutes early. If you need to reschedule or cancel, please reply to this email or give us a call.`)}
    ${p(`We look forward to seeing ${petName || 'your pet'}! 🐾`)}
  `)

  const text = `Hi ${clientName},

Reminder: ${petInfo} ${service} tomorrow

Service: ${service}
Date: ${formattedDate}
Time: ${formattedTime}

Please arrive a few minutes early. If you need to reschedule or cancel, please reply to this email.

We look forward to seeing ${petName || 'your pet'}! 🐾

— ${businessName}
GroomGrid`

  return {
    subject: `Reminder: ${petInfo} ${service} tomorrow`,
    html,
    text,
  }
}
