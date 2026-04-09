import { PlanType } from '@/types';
import { getPlanDetails, formatTrialEndDate } from '@/lib/payment-utils';

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
                GroomGrid — Built for groomers, by groomers.<br />
                <a href="{{unsubscribe_url}}" style="color:${BRAND.textMuted};">Unsubscribe</a>
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

function ctaButton(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background-color:${BRAND.primary};color:${BRAND.white};font-weight:600;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none;margin-top:24px;">${label}</a>`;
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND.text};line-height:1.3;">${text}</h1>`;
}

function p(text: string, muted = false): string {
  return `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:${muted ? BRAND.textMuted : BRAND.text};">${text}</p>`;
}

export function getPaymentConfirmationEmail(
  userName: string,
  planType: PlanType,
  appUrl: string
): EmailContent {
  const firstName = userName.split(' ')[0];
  const plan = getPlanDetails(planType);
  const trialEndDate = formatTrialEndDate();
  const onboardingUrl = `${appUrl}/onboarding`;

  const html = emailWrapper(`
    ${h1(`Your GroomGrid trial has started, ${firstName}! 🎉`)}
    ${p(`You're on the <strong>${plan.name} plan</strong> — full access, no charge for 14 days.`)}

    <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0 24px 0;border-collapse:collapse;border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
      <tr style="background-color:${BRAND.bg};">
        <td style="padding:12px 20px;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">Plan</p>
          <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:${BRAND.text};">${plan.name}</p>
        </td>
        <td style="padding:12px 20px;border-bottom:1px solid ${BRAND.border};border-left:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">Charged today</p>
          <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:${BRAND.primary};">$0.00</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 20px;">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">First charge</p>
          <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:${BRAND.text};">${trialEndDate}</p>
        </td>
        <td style="padding:12px 20px;border-left:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">Amount</p>
          <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:${BRAND.text};">$${plan.price}/month</p>
        </td>
      </tr>
    </table>

    ${p(`You can cancel any time before <strong>${trialEndDate}</strong> and you won't be charged. Manage your billing from your account settings.`)}

    ${p(`<strong>Your next step:</strong> finish setting up your account so you're ready for your first appointment.`)}

    ${ctaButton('Complete Your Setup', onboardingUrl)}

    <br /><br />
    ${p(`Questions? Just reply to this email — we read everything.`, true)}
  `);

  const text = `Hi ${firstName},

Your GroomGrid ${plan.name} trial has started!

- Plan: ${plan.name}
- Charged today: $0.00
- First charge: ${trialEndDate} ($${plan.price}/month)

You can cancel any time before ${trialEndDate} with no charge.

Complete your setup: ${onboardingUrl}

Questions? Reply to this email.`;

  return {
    subject: `Your GroomGrid trial is active — here's what to expect`,
    html,
    text,
  };
}
