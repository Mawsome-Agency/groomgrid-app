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

// ─── STEP 0: Welcome + Getting Started (Day 0) ──────────────────────────────────

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

// ─── STEP 1: How GroomGrid Solves No-Shows (Day 1) ────────────────────────────

function step1(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const remindersUrl = `${appUrl}/settings/reminders`

  const html = emailWrapper(`
    ${h1(`The #1 thing that costs groomers money? No-shows.`)}
    ${p(`Hey ${firstName} — if you've ever waited around for a client who never showed up, you know the feeling. Empty slots mean lost revenue, wasted time, and frustration.`)}
    ${p(`Here's the good news: GroomGrid's automated reminders cut no-shows dramatically. Here's what happens when you turn them on:`)}
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
    ${p(`Clients confirm with one tap. No-shows drop. Revenue holds steady.`)}
    ${p(`It takes 2 minutes to set up — and it works while you focus on grooming.`)}
    ${ctaButton('Enable Reminders Now', remindersUrl)}
    <br /><br />
    ${p(`Already enabled? You're ahead of most groomers. Tomorrow we'll share how one groomer grew her business with GroomGrid.`, true)}
  `)

  const text = `Hey ${firstName},

The #1 thing that costs groomers money? No-shows. GroomGrid's automated reminders fix this.

Here's what happens when you enable reminders:
- 48 hours before: email reminder sent automatically
- 24 hours before: SMS reminder with your address
- 2 hours before: final confirmation nudge

Clients confirm with one tap. No-shows drop. Revenue holds.

Enable reminders now: ${remindersUrl}`
  
  return {
    subject: 'The #1 thing that costs groomers money 💸',
    html,
    text,
  }
}

// ─── STEP 3: Case Study — Sarah Mitchell (Day 3) ──────────────────────────────

function step3(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const plansUrl = `${appUrl}/plans`

  const html = emailWrapper(`
    ${h1(`How Sarah grew her mobile grooming business by 40%`)}
    ${p(`Hey ${firstName} — three days in, and you're already seeing how GroomGrid handles the basics. Let us show you what it looks like when it really clicks.`)}
    ${p(`<strong>Sarah Mitchell</strong> is a mobile groomer in Austin, TX. Before GroomGrid, she was juggling 30+ clients on paper and losing $800+/month to no-shows.`)}
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0 20px 0;background-color:${BRAND.bg};border-radius:8px;padding:20px;">
      <tr>
        <td style="padding:8px 0;">
          <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:${BRAND.text};">"I used to text reminders manually the night before every appointment. Now GroomGrid does it automatically, and my no-show rate dropped from 18% to under 4%. That's an extra $900 a month I was leaving on the table."</p>
          <p style="margin:0;font-size:13px;color:${BRAND.textMuted};">— Sarah Mitchell, Paws & Claws Mobile Grooming</p>
        </td>
      </tr>
    </table>
    ${p(`Sarah also uses GroomGrid's client profiles to store coat notes, vaccination records, and behavioral quirks — so every groom is tailored to the pet, not just the breed.`)}
    ${p(`Her results after 3 months:`)}
    <ul style="padding-left:20px;margin:8px 0 20px 0;">
      <li style="font-size:15px;line-height:2;color:${BRAND.text};"><strong>40%</strong> revenue increase</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};"><strong>18% → 4%</strong> no-show rate</li>
      <li style="font-size:15px;line-height:2;color:${BRAND.text};"><strong>2 hrs/week</strong> saved on admin</li>
    </ul>
    ${ctaButton('See What GroomGrid Can Do for You', plansUrl)}
    <br /><br />
    ${p(`Your results will vary, but the pattern is clear: less admin = more grooming = more revenue.`, true)}
  `)

  const text = `Hey ${firstName},

How Sarah grew her mobile grooming business by 40%.

Sarah Mitchell is a mobile groomer in Austin, TX. Before GroomGrid, she was losing $800+/month to no-shows.

"I used to text reminders manually the night before every appointment. Now GroomGrid does it automatically, and my no-show rate dropped from 18% to under 4%. That's an extra $900 a month I was leaving on the table."

— Sarah Mitchell, Paws & Claws Mobile Grooming

Her results after 3 months:
- 40% revenue increase
- 18% → 4% no-show rate
- 2 hrs/week saved on admin

See what GroomGrid can do for you: ${plansUrl}`

  return {
    subject: 'How Sarah grew her grooming business by 40% 📈',
    html,
    text,
  }
}

// ─── STEP 5: Feature Spotlight — Automated Reminders (Day 5) ──────────────────

function step5(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const settingsUrl = `${appUrl}/settings/reminders`

  const html = emailWrapper(`
    ${h1(`Your secret weapon: Automated reminders 📱`)}
    ${p(`Hey ${firstName} — let's talk about the feature that pays for itself.`)}
    ${p(`GroomGrid's automated reminders aren't just "nice to have." They're the single biggest driver of revenue retention for our groomers. Here's why:`)}
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0 24px 0;border-collapse:collapse;">
      <tr style="background-color:${BRAND.bg};">
        <td style="padding:14px 20px;border-radius:8px 8px 0 0;">
          <p style="margin:0;font-size:15px;font-weight:700;color:${BRAND.text};">🛡️ 3-Layer Reminder System</p>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:14px;color:${BRAND.text};"><strong>Email at 48 hours</strong> — gives clients time to reschedule if needed</p>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid ${BRAND.border};">
          <p style="margin:0;font-size:14px;color:${BRAND.text};"><strong>SMS at 24 hours</strong> — high open rate, includes your business address</p>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px;">
          <p style="margin:0;font-size:14px;color:${BRAND.text};"><strong>Final nudge at 2 hours</strong> — last chance to confirm or cancel</p>
        </td>
      </tr>
    </table>
    ${p(`The result? Our groomers see no-show rates drop from an industry average of 15-20% down to under 5%. That's real money back in your pocket.`)}
    ${p(`And it's completely customizable — you choose which reminders to send, when, and what they say.`)}
    ${ctaButton('Set Up Reminders in 2 Minutes', settingsUrl)}
    <br /><br />
    ${p(`P.S. Two more days until something special lands in your inbox. Keep an eye out. 👀`, true)}
  `)

  const text = `Hey ${firstName},

Your secret weapon: Automated reminders.

GroomGrid's 3-layer reminder system is the single biggest driver of revenue retention for our groomers:

- Email at 48 hours — gives clients time to reschedule
- SMS at 24 hours — high open rate, includes your address
- Final nudge at 2 hours — last chance to confirm

The result? No-show rates drop from 15-20% down to under 5%.

Set up reminders in 2 minutes: ${settingsUrl}

P.S. Two more days until something special. Keep an eye out.`

  return {
    subject: 'Your secret weapon against no-shows 📱',
    html,
    text,
  }
}

// ─── STEP 7: Early Adopter Offer + Upgrade CTA (Day 7) ────────────────────────

function step7(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const plansUrl = `${appUrl}/plans`

  const html = emailWrapper(`
    ${h1(`Early adopter pricing — locked in for you 🔒`)}
    ${p(`Hey ${firstName} — it's been a week since you signed up, and we want you to stick around.`)}
    ${p(`As an early adopter, you get <strong>locked-in pricing</strong> that won't change even as we add features. This is our way of saying thanks for believing in GroomGrid from the start.`)}
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
    ${p(`This early adopter rate is only available for a limited time. Lock it in now and your price stays the same — forever.`)}
    ${ctaButton('Lock In My Rate', plansUrl)}
    <br /><br />
    ${p(`Not sure which plan fits? Reply to this email — we'll help you pick.`, true)}
  `)

  const text = `Hey ${firstName},

Early adopter pricing — locked in for you.

As an early adopter, you get locked-in pricing that won't change even as we add features.

Solo — $29/mo: 1 groomer, unlimited clients, automated reminders, booking calendar.
Salon — $79/mo: up to 5 groomers, staff scheduling, revenue reporting.

This rate is only available for a limited time. Lock it in now and your price stays the same — forever.

Choose your plan: ${plansUrl}`

  return {
    subject: 'Early adopter pricing — locked in for you 🔒',
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
    case 5:
      return step5(userName, appUrl)
    case 7:
      return step7(userName, appUrl)
    case 14:
      return step14(userName, appUrl)
    default:
      throw new Error(`No drip template for step ${step}`)
  }
}

// ─── STEP 14: Trial Ending — Upgrade CTA (Day 14) ─────────────────────────────

function step14(userName: string, appUrl: string): EmailContent {
  const firstName = userName.split(' ')[0]
  const plansUrl = `${appUrl}/plans`

  const html = emailWrapper(`
    ${h1(`Your trial is ending — don't lose your setup 🐾`)}
    ${p(`Hey ${firstName} — your free trial is coming to an end soon, and we'd hate for you to lose the clients, appointments, and settings you've built up.`)}
    ${p(`Upgrade now and keep everything. Here are your options:`)}
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
          </ul>
        </td>
        <td style="padding:16px 20px;vertical-align:top;">
          <ul style="margin:0;padding-left:18px;">
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Up to 5 groomers</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Everything in Solo</li>
            <li style="font-size:13px;line-height:2;color:${BRAND.textMuted};">Staff scheduling</li>
          </ul>
        </td>
      </tr>
    </table>
    ${p(`Don't let your trial data disappear. Upgrade today and keep the momentum going.`)}
    ${ctaButton('Upgrade Now', plansUrl)}
    <br /><br />
    ${p(`Questions about which plan is right for you? Just reply — we're happy to help.`, true)}
  `)

  const text = `Hey ${firstName},

Your free trial is ending soon. Upgrade now to keep your clients, appointments, and data.

Solo — $29/mo: 1 groomer, unlimited clients, automated reminders.
Salon — $79/mo: up to 5 groomers, staff scheduling, revenue reporting.

Don't lose your setup. Upgrade today:
${plansUrl}`

  return {
    subject: 'Your trial is ending — upgrade to keep your data',
    html,
    text,
  }
}
