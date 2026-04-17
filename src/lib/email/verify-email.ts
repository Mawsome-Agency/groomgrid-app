/**
 * Email verification email template.
 *
 * Sent when a new user completes signup. Contains a one-time link that
 * marks their email address as verified and unlocks full app access.
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
  <title>Verify Your Email — GroomGrid</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;color:${BRAND.text};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;border:1px solid ${BRAND.border};overflow:hidden;">
          <tr>
            <td style="background-color:${BRAND.primary};padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.5px;">Verify Your Email Address</p>
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
 * Send an email verification link to a newly registered user.
 *
 * @param to - User's email address
 * @param verifyUrl - The verification link URL (includes one-time token)
 */
export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  const html = emailWrapper(`
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND.text};line-height:1.3;">
      One quick step!
    </h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      Thanks for signing up for GroomGrid. Please verify your email address to activate your account.
    </p>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">
      <tr>
        <td align="center">
          <a href="${verifyUrl}" style="display:inline-block;background-color:${BRAND.primary};color:${BRAND.white};font-weight:600;font-size:16px;padding:16px 32px;border-radius:8px;text-decoration:none;">
            Verify My Email
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;color:${BRAND.textMuted};">
      If the button doesn't work, copy and paste this link:<br/>
      <span style="color:${BRAND.primary};word-break:break-all;">${verifyUrl}</span>
    </p>
  `);

  const text = `Verify Your Email Address

Thanks for signing up for GroomGrid. Please verify your email address to activate your account.

Click the link below to verify:
${verifyUrl}

This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Verify your GroomGrid email address',
    html,
    text,
  });
}
