/**
 * Booking confirmation email template.
 *
 * Sent to clients after successfully booking an appointment through
 * the public /book/[userId] page.
 */

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const BRAND = {
  primary: '#22c55e',
  bg: '#fafaf9',
  text: '#292524',
  textMuted: '#78716c',
  border: '#e7e5e4',
  white: '#ffffff',
};

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;color:${BRAND.text};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;border:1px solid ${BRAND.border};overflow:hidden;">
          <tr>
            <td style="background-color:${BRAND.primary};padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.5px;">Booking Confirmed</p>
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
                Powered by GroomGrid
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getBookingConfirmationEmail(
  clientName: string,
  petName: string,
  service: string,
  date: string,
  time: string,
  groomerName: string,
): EmailContent {
  const firstName = clientName.split(' ')[0];

  const html = emailWrapper(`
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND.text};line-height:1.3;">
      You're all set, ${firstName}!
    </h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      Your grooming appointment has been confirmed. Here are the details:
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 24px 0;border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};background-color:${BRAND.bg};">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">Pet</p>
          <p style="margin:4px 0 0 0;font-size:15px;font-weight:600;color:${BRAND.text};">${petName}</p>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};background-color:${BRAND.bg};">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">Service</p>
          <p style="margin:4px 0 0 0;font-size:15px;font-weight:600;color:${BRAND.text};">${service}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">Date</p>
          <p style="margin:4px 0 0 0;font-size:15px;font-weight:600;color:${BRAND.text};">${date}</p>
        </td>
        <td style="padding:12px 16px;">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">Time</p>
          <p style="margin:4px 0 0 0;font-size:15px;font-weight:600;color:${BRAND.text};">${time}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      <strong>Groomer:</strong> ${groomerName}
    </p>
    <p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;color:${BRAND.textMuted};">
      Need to reschedule or cancel? Please contact your groomer directly.
    </p>
  `);

  const text = `Booking Confirmed!

Hi ${firstName},

Your grooming appointment has been confirmed:

Pet: ${petName}
Service: ${service}
Date: ${date}
Time: ${time}
Groomer: ${groomerName}

Need to reschedule or cancel? Please contact your groomer directly.`;

  return {
    subject: `Booking Confirmed: ${service} for ${petName} on ${date}`,
    html,
    text,
  };
}
