/**
 * Password reset email template.
 *
 * Sent when a user requests a password reset via /forgot-password.
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
  <title>Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;color:${BRAND.text};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;border:1px solid ${BRAND.border};overflow:hidden;">
          <tr>
            <td style="background-color:${BRAND.primary};padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.5px;">Reset Your Password</p>
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
 * Send a password reset email to the user.
 *
 * @param to - User's email address
 * @param resetUrl - The reset link URL (includes token)
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const html = emailWrapper(`
    <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND.text};line-height:1.3;">
      Password Reset Request
    </h1>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      We received a request to reset your password. Click the button below to create a new one.
    </p>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">
      This link will expire in 1 hour for security reasons. If you didn't request this, you can safely ignore this email.
    </p>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">
      <tr>
        <td align="center">
          <a href="${resetUrl}" style="display:inline-block;background-color:${BRAND.primary};color:${BRAND.white};font-weight:600;font-size:16px;padding:16px 32px;border-radius:8px;text-decoration:none;">
            Reset My Password
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;color:${BRAND.textMuted};">
      If the button doesn't work, copy and paste this link:<br/>
      <span style="color:${BRAND.primary};word-break:break-all;">${resetUrl}</span>
    </p>
  `);

  const text = `Password Reset Request

We received a request to reset your password.

Click the link below to create a new one:
${resetUrl}

This link will expire in 1 hour for security reasons. If you didn't request this, you can safely ignore this email.

If the button doesn't work, copy and paste this link into your browser.`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your GroomGrid password',
    html,
    text,
  });
}
