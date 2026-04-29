/**
 * Mailgun email adapter — drop-in replacement for the Resend SDK.
 *
 * Uses the Mailgun HTTP API directly (no external SDK required).
 * Exports the same interface as the previous Resend module so all
 * callers (welcome, password-reset, reminders, drip, booking) work
 * without modification:
 *   - getResend()  → object with .emails.send(params) method
 *   - FROM_EMAIL   → sender address string
 *
 * Required env vars:
 *   MAILGUN_API_KEY   — Mailgun API key (starts with key- or similar)
 *   MAILGUN_DOMAIN    — Verified Mailgun sending domain (e.g. email.mawsome.agency)
 *
 * Optional:
 *   MAILGUN_FROM_EMAIL — Override the default from address
 */

export const FROM_EMAIL =
  process.env.MAILGUN_FROM_EMAIL ?? 'GroomGrid <hello@email.mawsome.agency>'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SendEmailParams {
  from: string
  to: string | string[]
  subject: string
  html?: string
  text?: string
}

interface SendEmailResult {
  data: { id: string } | null
  error: { message: string } | null
}

interface MailgunClient {
  emails: {
    send(params: SendEmailParams): Promise<SendEmailResult>
  }
}

// ─── Mailgun HTTP sender ──────────────────────────────────────────────────────

function createMailgunClient(): MailgunClient {
  return {
    emails: {
      async send(params: SendEmailParams): Promise<SendEmailResult> {
        const apiKey = process.env.MAILGUN_API_KEY
        const domain = process.env.MAILGUN_DOMAIN

        if (!apiKey || !domain) {
          throw new Error(
            'Email configuration missing: MAILGUN_API_KEY and MAILGUN_DOMAIN must be set'
          )
        }

        const formData = new FormData()
        formData.append('from', params.from)
        formData.append(
          'to',
          Array.isArray(params.to) ? params.to.join(',') : params.to
        )
        formData.append('subject', params.subject)
        if (params.html) formData.append('html', params.html)
        if (params.text) formData.append('text', params.text)

        const credentials = Buffer.from(`api:${apiKey}`).toString('base64')
        const url = `https://api.mailgun.net/v3/${domain}/messages`

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Basic ${credentials}` },
            body: formData,
            signal: typeof AbortSignal.timeout === 'function'
              ? AbortSignal.timeout(10_000) // abort after 10s — protects awaited callers
              : undefined, // fallback for test environments without timeout support
          })

          if (!response.ok) {
            const body = await response.text().catch(() => '(no body)')
            console.error(`[email] Mailgun HTTP ${response.status}:`, body)
            return {
              data: null,
              error: { message: `Mailgun error ${response.status}: ${body}` },
            }
          }

          const result = (await response.json()) as { id: string; message: string }
          return { data: { id: result.id }, error: null }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown fetch error'
          console.error('[email] Mailgun send failed:', message)
          return { data: null, error: { message } }
        }
      },
    },
  }
}

// ─── Lazy singleton ───────────────────────────────────────────────────────────

let _client: MailgunClient | null = null

/**
 * Returns the Mailgun email client singleton.
 * Throws only if MAILGUN_API_KEY or MAILGUN_DOMAIN are missing at send time.
 */
export function getResend(): MailgunClient {
  if (!_client) {
    _client = createMailgunClient()
  }
  return _client
}
