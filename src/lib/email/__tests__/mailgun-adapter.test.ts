/**
 * Tests for the Mailgun HTTP email adapter (src/lib/email/resend.ts).
 *
 * Tests cover:
 * - FROM_EMAIL fallback/override
 * - getResend() singleton behaviour
 * - Successful send → correct fetch call shape
 * - Mailgun HTTP error → error result (no throw)
 * - Missing env vars → thrown error
 * - Network/fetch failure → error result (no throw)
 */

import { FROM_EMAIL, getResend } from '../resend'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFetchMock(
  status: number,
  body: unknown,
  ok = status >= 200 && status < 300
) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  })
}

// ─── Setup ───────────────────────────────────────────────────────────────────

const MAILGUN_API_KEY = 'key-testkey'
const MAILGUN_DOMAIN = 'test.example.com'

beforeEach(() => {
  process.env.MAILGUN_API_KEY = MAILGUN_API_KEY
  process.env.MAILGUN_DOMAIN = MAILGUN_DOMAIN
  delete process.env.MAILGUN_FROM_EMAIL

  // Reset the module singleton between tests
  jest.resetModules()
  jest.clearAllMocks()
})

afterEach(() => {
  delete process.env.MAILGUN_API_KEY
  delete process.env.MAILGUN_DOMAIN
  delete process.env.MAILGUN_FROM_EMAIL
})

// ─── FROM_EMAIL ───────────────────────────────────────────────────────────────

describe('FROM_EMAIL', () => {
  it('uses default when MAILGUN_FROM_EMAIL is not set', () => {
    // The constant is evaluated at import time, so we check the default shape
    expect(FROM_EMAIL).toContain('GroomGrid')
    expect(FROM_EMAIL).toContain('@')
  })

  it('uses MAILGUN_FROM_EMAIL override when set', () => {
    // Verify that the env var is passed through to the module constant.
    // Since FROM_EMAIL is a module-level constant we check the value in
    // a freshly-required module with the env var pre-set.
    process.env.MAILGUN_FROM_EMAIL = 'Custom <custom@example.com>'
    // Use require() to get a fresh module evaluation
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { FROM_EMAIL: customFrom } = require('../resend') as typeof import('../resend')
    expect(customFrom).toBe('Custom <custom@example.com>')
    delete process.env.MAILGUN_FROM_EMAIL
  })
})

// ─── getResend() singleton ────────────────────────────────────────────────────

describe('getResend()', () => {
  it('returns an object with an emails.send method', () => {
    const client = getResend()
    expect(client).toBeDefined()
    expect(typeof client.emails.send).toBe('function')
  })

  it('returns the same instance on repeated calls (singleton)', () => {
    const first = getResend()
    const second = getResend()
    expect(first).toBe(second)
  })
})

// ─── emails.send() ────────────────────────────────────────────────────────────

describe('emails.send()', () => {
  const sendParams = {
    from: 'GroomGrid <hello@example.com>',
    to: 'user@example.com',
    subject: 'Test email',
    html: '<p>Hello</p>',
    text: 'Hello',
  }

  it('calls the Mailgun API with correct URL and auth header', async () => {
    const mockFetch = makeFetchMock(200, { id: '<abc123@mailgun.net>', message: 'Queued' })
    global.fetch = mockFetch

    const { getResend: freshGetResend } = await import('../resend')
    const result = await freshGetResend().emails.send(sendParams)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`)
    expect(options.method).toBe('POST')

    // Verify Basic auth header
    const expectedCreds = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')
    expect((options.headers as Record<string, string>)['Authorization']).toBe(
      `Basic ${expectedCreds}`
    )

    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: '<abc123@mailgun.net>' })
  })

  it('includes html and text fields in the FormData body', async () => {
    const mockFetch = makeFetchMock(200, { id: 'msg-id', message: 'Queued' })
    global.fetch = mockFetch

    const { getResend: freshGetResend } = await import('../resend')
    await freshGetResend().emails.send(sendParams)

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    const body = options.body as FormData
    expect(body.get('html')).toBe(sendParams.html)
    expect(body.get('text')).toBe(sendParams.text)
    expect(body.get('subject')).toBe(sendParams.subject)
    expect(body.get('from')).toBe(sendParams.from)
    expect(body.get('to')).toBe(sendParams.to)
  })

  it('joins array recipients into a comma-separated string', async () => {
    const mockFetch = makeFetchMock(200, { id: 'msg-id', message: 'Queued' })
    global.fetch = mockFetch

    const { getResend: freshGetResend } = await import('../resend')
    await freshGetResend().emails.send({
      ...sendParams,
      to: ['a@example.com', 'b@example.com'],
    })

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    const body = options.body as FormData
    expect(body.get('to')).toBe('a@example.com,b@example.com')
  })

  it('omits html/text fields when not provided', async () => {
    const mockFetch = makeFetchMock(200, { id: 'msg-id', message: 'Queued' })
    global.fetch = mockFetch

    const { getResend: freshGetResend } = await import('../resend')
    await freshGetResend().emails.send({
      from: sendParams.from,
      to: sendParams.to,
      subject: sendParams.subject,
    })

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    const body = options.body as FormData
    expect(body.get('html')).toBeNull()
    expect(body.get('text')).toBeNull()
  })

  it('returns an error result (does not throw) on Mailgun HTTP error', async () => {
    const mockFetch = makeFetchMock(401, 'Forbidden', false)
    global.fetch = mockFetch

    const { getResend: freshGetResend } = await import('../resend')
    const result = await freshGetResend().emails.send(sendParams)

    expect(result.data).toBeNull()
    expect(result.error).not.toBeNull()
    expect(result.error?.message).toContain('401')
  })

  it('returns an error result (does not throw) on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network unreachable'))

    const { getResend: freshGetResend } = await import('../resend')
    const result = await freshGetResend().emails.send(sendParams)

    expect(result.data).toBeNull()
    expect(result.error?.message).toBe('Network unreachable')
  })

  it('throws when MAILGUN_API_KEY is missing', async () => {
    delete process.env.MAILGUN_API_KEY
    global.fetch = jest.fn()

    const { getResend: freshGetResend } = await import('../resend')

    await expect(freshGetResend().emails.send(sendParams)).rejects.toThrow(
      /MAILGUN_API_KEY/
    )
  })

  it('throws when MAILGUN_DOMAIN is missing', async () => {
    delete process.env.MAILGUN_DOMAIN
    global.fetch = jest.fn()

    const { getResend: freshGetResend } = await import('../resend')

    await expect(freshGetResend().emails.send(sendParams)).rejects.toThrow(
      /MAILGUN_DOMAIN/
    )
  })
})
