/**
 * Welcome email template.
 *
 * Sent when a new user completes signup. Non-blocking — catches its own
 * errors and never throws, so the signup response is never delayed.
 */

import { FROM_EMAIL, getResend } from './resend'

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
  <title>Welcome to GroomGrid!</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;color:${BRAND.text};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;border:1px solid ${BRAND.border};overflow:hidden;">
          <tr>
            <td style="background-color:${BRAND.primary};padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.5px;">Welcome to GroomGrid!</p>
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

/**
 * Send a welcome email to a newly registered user.
 *
 * Fire-and-forget: catches all errors internally. Never throws.
 *
 * @param to - User's email address
 * @param businessName - The user's business name
 */
export async function sendWelcomeEmail(to: string, businessName: string): Promise<void> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getgroomgrid.com'

    const html = emailWrapper(`
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND.text};line-height:1.3;">
      Welcome aboard, ${businessName}! 🐾
    </h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      You're all set. Your 14-day free trial has started — no credit card needed until you're ready to upgrade.
    </p>
    <p style="margin:0 0 12px 0;font-size:15px;font-weight:600;color:${BRAND.text};">
      Here's how to hit the ground running:
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 24px 0;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:14px;color:${BRAND.text};">
            <strong>1. Complete your profile</strong> — add your business hours and services so clients can book online.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:14px;color:${BRAND.text};">
            <strong>2. Add your first client</strong> — import from your existing records or add manually.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;">
          <p style="margin:0;font-size:14px;color:${BRAND.text};">
            <strong>3. Schedule an appointment</strong> — let GroomGrid send automated reminders so you never have a no-show.
          </p>
        </td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">
      <tr>
        <td align="center">
          <a href="${appUrl}/dashboard" style="display:inline-block;background-color:${BRAND.primary};color:${BRAND.white};font-weight:600;font-size:16px;padding:16px 32px;border-radius:8px;text-decoration:none;">
            Go to My Dashboard
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0 0;font-size:14px;line-height:1.6;color:${BRAND.textMuted};">
      Questions? Reply to this email and a real human will get back to you — usually within a few hours.
    </p>
  `);

    const text = `Welcome to GroomGrid, ${businessName}!

You're all set. Your 14-day free trial has started — no credit card needed until you're ready to upgrade.

Here's how to hit the ground running:

1. Complete your profile — add your business hours and services so clients can book online.
2. Add your first client — import from your existing records or add manually.
3. Schedule an appointment — let GroomGrid send automated reminders so you never have a no-show.

Go to your dashboard: ${appUrl}/dashboard

Questions? Reply to this email and a real human will get back to you — usually within a few hours.

— The GroomGrid Team`;

    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to GroomGrid!',
      html,
      text,
    });
  } catch (err) {
    // Non-blocking: log the error but never propagate it
    console.error('Welcome email failed:', err);
  }
}
