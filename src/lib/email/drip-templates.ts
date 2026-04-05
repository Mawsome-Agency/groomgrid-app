interface EmailContent {
  subject: string
  html: string
  text: string
}

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
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.primary};padding:24px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.5px;">🐾 GroomGrid</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
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
</html>`
}

function ctaButton(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background-color:${BRAND.primary};color:${BRAND.white};font-weight:600;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none;margin-top:24px;">${label}</a>`
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:${BRAND.text};line-height:1.3;">${text}</h1>`
}

function p(text: string, muted = false): string {
  return `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:${muted ? BRAND.textMuted : BRAND.text};">${text}</p>`
}

// ─── STEP 0: Welcome ──────────────────────────────────────────────────────────

function step0(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]

  const html = emailWrapper(`
    ${h1(`Welcome to GroomGrid, ${firstName}! 🐾`)}
    ${p(`You're all set. GroomGrid is here to help you spend less time on admin and more time doing what you love — grooming.`)}
    ${p(`Here's how to get up and running in the next few minutes:`)}
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">
      <tr>
        <td style="padding:12px 16px;background-color:${BRAND.bg};border-radius:8px;border-left:4px solid ${BRAND.primary};margin-bottom:8px;">
          <p style="margin:0;font-size:15px;font-weight:600;color:${BRAND.text};">1. Add your services</p>
          <p style="margin:4px 0 0 0;font-size:13px;color:${BRAND.textMuted};">Set up your service menu — baths, haircuts, nail trims, and more.</p>
        </td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:8px 0;">
      <tr>
        <td style="padding:12px 16px;background-color:${BRAND.bg};border-radius:8px;border-left:4px solid ${BRAND.primary};">
          <p style="margin:0;font-size:15px;font-weight:600;color:${BRAND.text};">2. Add your first client</p>
          <p style="margin:4px 0 0 0;font-size:13px;color:${BRAND.textMuted};">Store pet details, breed notes, and grooming preferences.</p>
        </td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:8px 0 20px 0;">
      <tr>
        <td style="padding:12px 16px;background-color:${BRAND.bg};border-radius:8px;border-left:4px solid ${BRAND.primary};">
          <p style="margin:0;font-size:15px;font-weight:600;color:${BRAND.text};">3. Book your first appointment</p>
          <p style="margin:4px 0 0 0;font-size:13px;color:${BRAND.textMuted};">Schedule, send reminders, and track it all in one place.</p>
        </td>
      </tr>
    </table>
    ${p(`It only takes a few minutes and you'll never go back to spreadsheets.`)}
    ${ctaButton('Set Up My Account', appUrl)}
    <br /><br />
    ${p(`Questions? Just reply to this email — we're real people and we read everything.`, true)}
  `)

  const text = `Welcome to GroomGrid, ${firstName}!

Here's how to get started:
1. Add your services — set up your grooming menu.
2. Add your first client — store pet details and notes.
3. Book your first appointment — schedule and send reminders.

Get started: ${appUrl}

Questions? Reply to this email.`

  return {
    subject: 'Welcome to GroomGrid 🐾 — Let\'s get you set up',
    html,
    text,
  }
}

// ─── STEP 1: First Client ─────────────────────────────────────────────────────

function step1(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const clientUrl = `${appUrl}/clients/new`

  const html = emailWrapper(`
    ${h1(`Add your first client in 60 seconds`)}
    ${p(`Hey ${firstName} — adding clients in GroomGrid is fast, and it unlocks the whole platform.`)}
    ${p(`Here's what GroomGrid stores for every pet client:`)}
    <ul style="padding-left:20px;margin:12px 0 20px 0;">
      <li style="font-size:15px;line-height:2;color:${BRAND.text};">Breed, age, and weight</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};">Known allergies and sensitivities</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};">Grooming preferences and coat notes</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};">Owner contact details</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};">Full appointment history</li>
    </ul>
    ${p(`No more sticky notes or forgotten details. Every client visit is better than the last.`)}
    ${ctaButton('Add a Client Now', clientUrl)}
    <br /><br />
    ${p(`Takes less than a minute. We promise.`, true)}
  `)

  const text = `Hey ${firstName},

Add your first client in GroomGrid and start building your client records.

GroomGrid stores: breed, allergies, grooming preferences, owner contacts, and full appointment history.

Add a client: ${clientUrl}`

  return {
    subject: 'Add your first client in 60 seconds',
    html,
    text,
  }
}

// ─── STEP 3: No-Shows ─────────────────────────────────────────────────────────

function step3(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const settingsUrl = `${appUrl}/settings/reminders`

  const html = emailWrapper(`
    ${h1(`Never chase a no-show again`)}
    ${p(`Hey ${firstName} — missed appointments are one of the biggest pain points for groomers. GroomGrid's automated reminder system keeps your calendar full.`)}
    ${p(`Here's how it works:`)}
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0 20px 0;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:15px;color:${BRAND.text};"><strong>48 hours before</strong> — email reminder sent automatically</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:15px;color:${BRAND.text};"><strong>24 hours before</strong> — SMS reminder with your address</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 16px;">
          <p style="margin:0;font-size:15px;color:${BRAND.text};"><strong>2 hours before</strong> — final confirmation nudge</p>
        </td>
      </tr>
    </table>
    ${p(`Clients confirm with one tap. No-shows drop. Revenue holds.`)}
    ${p(`It takes 2 minutes to set up. You choose which reminders to send and when.`)}
    ${ctaButton('Enable Reminders', settingsUrl)}
    <br /><br />
    ${p(`Already enabled? You're ahead of the game — most groomers don't discover this until month 2.`, true)}
  `)

  const text = `Hey ${firstName},

GroomGrid's automated reminder system reduces no-shows dramatically.

- 48 hours before: email reminder
- 24 hours before: SMS with your address
- 2 hours before: final confirmation nudge

Enable reminders now: ${settingsUrl}`

  return {
    subject: 'Never chase a no-show again',
    html,
    text,
  }
}

// ─── STEP 7: Check-in ────────────────────────────────────────────────────────

function step7(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const docsUrl = `${appUrl}/docs`
  const calendlyUrl = 'https://calendly.com/groomgrid/onboarding'

  const html = emailWrapper(`
    ${h1(`How's GroomGrid working for you?`)}
    ${p(`Hey ${firstName} — you've been using GroomGrid for a week now. We wanted to check in.`)}
    ${p(`Are there any features you haven't been able to figure out? Any parts of your workflow that still feel clunky?`)}
    ${p(`A few resources that groomers find helpful at this stage:`)}
    <ul style="padding-left:20px;margin:12px 0 20px 0;">
      <li style="font-size:15px;line-height:2;color:${BRAND.text};"><a href="${docsUrl}" style="color:${BRAND.primary};">Help docs</a> — guides for every feature</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};"><a href="${appUrl}/settings" style="color:${BRAND.primary};">Settings</a> — customize your workflow</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};">Reply to this email — we read everything</li>
    </ul>
    ${p(`If you'd like a quick walkthrough of anything, you can book 15 minutes with us:`)}
    ${ctaButton('Book a 15-min Call', calendlyUrl)}
    <br /><br />
    ${p(`No pressure — just here if you need us.`, true)}
  `)

  const text = `Hey ${firstName},

A week in — how's GroomGrid working for you?

Resources:
- Help docs: ${docsUrl}
- Settings: ${appUrl}/settings
- Reply to this email

Want a quick walkthrough? Book 15 min: ${calendlyUrl}`

  return {
    subject: "How's GroomGrid working for you?",
    html,
    text,
  }
}

// ─── STEP 14: Upgrade ────────────────────────────────────────────────────────

function step14(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const pricingUrl = `${appUrl}/pricing`

  const html = emailWrapper(`
    ${h1(`Your trial ends soon — lock in your rate 🔒`)}
    ${p(`Hey ${firstName} — your GroomGrid trial is wrapping up. Don't lose your data, your client records, or your booking history.`)}
    ${p(`Pick the plan that fits your business:`)}
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0 24px 0;border-collapse:collapse;border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
      <tr style="background-color:${BRAND.bg};">
        <td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};">
          <p style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:${BRAND.text};">Solo</p>
          <p style="margin:0;font-size:24px;font-weight:700;color:${BRAND.primary};">$29<span style="font-size:14px;font-weight:400;color:${BRAND.textMuted};">/mo</span></p>
        </td>
        <td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:${BRAND.text};">Salon</p>
          <p style="margin:0;font-size:24px;font-weight:700;color:${BRAND.primary};">$79<span style="font-size:14px;font-weight:400;color:${BRAND.textMuted};">/mo</span></p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-right:1px solid ${BRAND.border};vertical-align:top;">
          <ul style="margin:0;padding-left:18px;">
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">1 groomer</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Unlimited clients</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Automated reminders</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Booking calendar</li>
          </ul>
        </td>
        <td style="padding:16px 20px;vertical-align:top;">
          <ul style="margin:0;padding-left:18px;">
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Up to 5 groomers</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Everything in Solo</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Staff scheduling</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Revenue reporting</li>
          </ul>
        </td>
      </tr>
    </table>
    ${p(`Upgrade today and keep the same rate even as we add features. Early customers always get the best deal.`)}
    ${ctaButton('Upgrade Now', pricingUrl)}
    <br /><br />
    ${p(`Questions about which plan is right for you? Reply to this email.`, true)}
  `)

  const text = `Hey ${firstName},

Your GroomGrid trial is ending soon. Upgrade to keep your data and booking history.

Solo — $29/mo: 1 groomer, unlimited clients, automated reminders, booking calendar.
Salon — $79/mo: up to 5 groomers, staff scheduling, revenue reporting.

Upgrade now: ${pricingUrl}`

  return {
    subject: 'Your trial ends soon — lock in your rate 🔒',
    html,
    text,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getDripEmailContent(
  step: number,
  userName: string,
  appUrl: string
): EmailContent {
  switch (step) {
    case 0:
      return step0(userName, appUrl)
    case 1:
      return step1(userName, appUrl)
    case 3:
      return step3(userName, appUrl)
    case 7:
      return step7(userName, appUrl)
    case 14:
      return step14(userName, appUrl)
    default:
      throw new Error(`No drip template for step ${step}`)
  }
}
