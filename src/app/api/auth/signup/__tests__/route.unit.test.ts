/**
 * @jest-environment node
 *
 * Unit tests for POST /api/auth/signup
 *
 * Coverage focus: PR #130 gap — email verification token creation and
 * fire-and-forget email flow.
 *
 * Mocked dependencies:
 *   - @/lib/prisma  (user.findUnique, user.create, emailVerificationToken.create)
 *   - @/lib/email/verify-email  (sendVerificationEmail)
 *   - @/lib/email/welcome  (sendWelcomeEmail)
 *   - bcryptjs  (hash — avoid real CPU-intensive hashing in unit tests)
 */

// ─── Mock declarations (must be defined before any imports so jest can hoist) ──

const mockUserFindUnique = jest.fn()
const mockUserCreate = jest.fn()
const mockEmailVerificationTokenCreate = jest.fn()

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: mockUserFindUnique,
      create: mockUserCreate,
    },
    emailVerificationToken: {
      create: mockEmailVerificationTokenCreate,
    },
  },
}))

const mockSendVerificationEmail = jest.fn()
jest.mock('@/lib/email/verify-email', () => ({
  sendVerificationEmail: mockSendVerificationEmail,
}))

const mockSendWelcomeEmail = jest.fn()
jest.mock('@/lib/email/welcome', () => ({
  sendWelcomeEmail: mockSendWelcomeEmail,
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$mockedhashfortest'),
}))

// ─── Imports ──────────────────────────────────────────────────────────────────

import { POST } from '../route'
import { NextRequest } from 'next/server'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TEST_USER = {
  id: 'user_test_abc123',
  email: 'groomer@example.com',
  businessName: 'Fluffy Cuts',
  passwordHash: '$2b$12$mockedhashfortest',
  emailVerified: false,
  timezone: 'America/New_York',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
}

// Each test uses a fresh IP address to avoid tripping the in-memory rate limiter.
let ipSeq = 1
function nextIp(): string {
  return `192.0.2.${ipSeq++}`
}

function makeRequest(
  body: { email?: unknown; password?: unknown; businessName?: unknown },
  ip?: string
): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip ?? nextIp(),
    },
  })
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('POST /api/auth/signup', () => {
  const originalEnv = process.env

  // Suppress console.error output from fire-and-forget .catch() handlers.
  // We do NOT want test noise from expected internal error paths.
  let consoleErrorSpy: jest.SpyInstance
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    }

    // Happy-path defaults
    mockUserFindUnique.mockResolvedValue(null) // no existing user
    mockUserCreate.mockResolvedValue(TEST_USER)
    mockEmailVerificationTokenCreate.mockResolvedValue({
      id: 'evtoken_abc',
      userId: TEST_USER.id,
      token: 'stub',
      expiresAt: new Date(),
    })
    mockSendVerificationEmail.mockResolvedValue(undefined)
    mockSendWelcomeEmail.mockResolvedValue(undefined)
  })

  afterEach(() => {
    process.env = originalEnv
  })

  // ── (1) Happy path ───────────────────────────────────────────────────────────

  describe('happy path', () => {
    it('returns 200 success with userId', async () => {
      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Fluffy Cuts',
      })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.success).toBe(true)
      expect(body.userId).toBe(TEST_USER.id)
    })

    it('creates the user in the database', async () => {
      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Fluffy Cuts',
      })
      await POST(req)

      expect(mockUserCreate).toHaveBeenCalledTimes(1)
      expect(mockUserCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'groomer@example.com',
            businessName: 'Fluffy Cuts',
          }),
        })
      )
    })

    it('creates an emailVerificationToken in the database', async () => {
      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Fluffy Cuts',
      })
      await POST(req)

      expect(mockEmailVerificationTokenCreate).toHaveBeenCalledTimes(1)
      expect(mockEmailVerificationTokenCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: TEST_USER.id,
            token: expect.any(String),
            expiresAt: expect.any(Date),
          }),
        })
      )
    })

    it('calls sendVerificationEmail', async () => {
      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Fluffy Cuts',
      })
      await POST(req)

      expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1)
    })

    it('calls sendWelcomeEmail', async () => {
      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Fluffy Cuts',
      })
      await POST(req)

      expect(mockSendWelcomeEmail).toHaveBeenCalledTimes(1)
    })
  })

  // ── (2) Token format ─────────────────────────────────────────────────────────

  describe('verification token format', () => {
    it('generates a 64-character lowercase hex token (crypto.randomBytes(32).toString("hex"))', async () => {
      const req = makeRequest({
        email: 'format@example.com',
        password: 'pass1234',
        businessName: 'Format Test',
      })
      await POST(req)

      const callArg = mockEmailVerificationTokenCreate.mock.calls[0][0]
      const token: string = callArg.data.token

      // 32 bytes → 64 hex characters
      expect(token).toMatch(/^[0-9a-f]{64}$/)
    })

    it('passes the same token to both emailVerificationToken.create and sendVerificationEmail URL', async () => {
      const req = makeRequest({
        email: 'consistency@example.com',
        password: 'pass1234',
        businessName: 'Consistency Test',
      })
      await POST(req)

      const tokenInDb: string =
        mockEmailVerificationTokenCreate.mock.calls[0][0].data.token

      const [, verifyUrl]: [string, string] =
        mockSendVerificationEmail.mock.calls[0]

      expect(verifyUrl).toContain(tokenInDb)
    })
  })

  // ── (3) Token expiry ─────────────────────────────────────────────────────────

  describe('verification token expiry', () => {
    it('sets expiresAt to approximately now + 24 hours', async () => {
      const fakeNow = new Date('2026-04-17T12:00:00.000Z').getTime()
      jest.useFakeTimers()
      jest.setSystemTime(fakeNow)

      try {
        const req = makeRequest({
          email: 'expiry@example.com',
          password: 'pass1234',
          businessName: 'Expiry Test',
        })
        await POST(req)

        const callArg = mockEmailVerificationTokenCreate.mock.calls[0][0]
        const expiresAt: Date = callArg.data.expiresAt

        const expected = fakeNow + 24 * 60 * 60 * 1000 // exactly now + 24h

        expect(expiresAt).toBeInstanceOf(Date)
        // Allow ±1 s for any synchronous execution overhead
        expect(Math.abs(expiresAt.getTime() - expected)).toBeLessThan(1000)
      } finally {
        jest.useRealTimers()
      }
    })
  })

  // ── (4) sendVerificationEmail failure is fire-and-forget ─────────────────────

  describe('sendVerificationEmail failure — fire-and-forget', () => {
    it('returns 200 even when sendVerificationEmail rejects', async () => {
      mockSendVerificationEmail.mockRejectedValue(new Error('SMTP timeout'))

      const req = makeRequest({
        email: 'vef@example.com',
        password: 'pass1234',
        businessName: 'VEF Test',
      })
      const res = await POST(req)
      // Flush fire-and-forget microtasks so .catch() handlers complete
      await Promise.resolve()
      await Promise.resolve()

      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.success).toBe(true)
    })

    it('still creates the user and token when sendVerificationEmail rejects', async () => {
      mockSendVerificationEmail.mockRejectedValue(new Error('send failed'))

      const req = makeRequest({
        email: 'vef2@example.com',
        password: 'pass1234',
        businessName: 'VEF Test 2',
      })
      await POST(req)
      await Promise.resolve()
      await Promise.resolve()

      expect(mockUserCreate).toHaveBeenCalledTimes(1)
      expect(mockEmailVerificationTokenCreate).toHaveBeenCalledTimes(1)
    })
  })

  // ── (5) sendWelcomeEmail failure is fire-and-forget ──────────────────────────

  describe('sendWelcomeEmail failure — fire-and-forget', () => {
    it('returns 200 even when sendWelcomeEmail rejects', async () => {
      mockSendWelcomeEmail.mockRejectedValue(new Error('Mailgun 502'))

      const req = makeRequest({
        email: 'wel@example.com',
        password: 'pass1234',
        businessName: 'Welcome Test',
      })
      const res = await POST(req)
      await Promise.resolve()
      await Promise.resolve()

      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.success).toBe(true)
    })

    it('still creates user and token when sendWelcomeEmail rejects', async () => {
      mockSendWelcomeEmail.mockRejectedValue(new Error('Mailgun down'))

      const req = makeRequest({
        email: 'wel2@example.com',
        password: 'pass1234',
        businessName: 'Welcome Test 2',
      })
      await POST(req)
      await Promise.resolve()
      await Promise.resolve()

      expect(mockUserCreate).toHaveBeenCalledTimes(1)
      expect(mockEmailVerificationTokenCreate).toHaveBeenCalledTimes(1)
    })
  })

  // ── (6) emailVerificationToken.create DB failure propagates ──────────────────

  describe('emailVerificationToken.create DB failure', () => {
    it('returns 500 when emailVerificationToken.create throws', async () => {
      mockEmailVerificationTokenCreate.mockRejectedValue(
        new Error('DB constraint violation')
      )

      const req = makeRequest({
        email: 'dberr@example.com',
        password: 'pass1234',
        businessName: 'DB Error Test',
      })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(500)
      expect(body.error).toBe('Failed to create account')
    })

    it('does NOT call sendVerificationEmail when token DB write fails', async () => {
      mockEmailVerificationTokenCreate.mockRejectedValue(
        new Error('DB write failed')
      )

      const req = makeRequest({
        email: 'dberr2@example.com',
        password: 'pass1234',
        businessName: 'DB Error Test 2',
      })
      await POST(req)

      // emailVerificationToken.create is awaited — its failure throws into the
      // outer catch block and aborts execution before any emails are sent.
      expect(mockSendVerificationEmail).not.toHaveBeenCalled()
      expect(mockSendWelcomeEmail).not.toHaveBeenCalled()
    })
  })

  // ── (7) NEXT_PUBLIC_APP_URL fallback ─────────────────────────────────────────

  describe('NEXT_PUBLIC_APP_URL fallback', () => {
    it('uses https://app.getgroomgrid.com when NEXT_PUBLIC_APP_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_APP_URL

      const req = makeRequest({
        email: 'fallback@example.com',
        password: 'pass1234',
        businessName: 'Fallback Test',
      })
      await POST(req)

      const [, verifyUrl]: [string, string] =
        mockSendVerificationEmail.mock.calls[0]

      // Fallback is app subdomain — bare getgroomgrid.com redirects break email verification links
      expect(verifyUrl).toMatch(
        /^https:\/\/app\.getgroomgrid\.com\/api\/auth\/verify-email\?token=[0-9a-f]{64}$/
      )
    })

    it('uses NEXT_PUBLIC_APP_URL when it is set', async () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://staging.getgroomgrid.com'

      const req = makeRequest({
        email: 'staging@example.com',
        password: 'pass1234',
        businessName: 'Staging Test',
      })
      await POST(req)

      const [, verifyUrl]: [string, string] =
        mockSendVerificationEmail.mock.calls[0]

      expect(verifyUrl).toMatch(
        /^https:\/\/staging\.getgroomgrid\.com\/api\/auth\/verify-email\?token=[0-9a-f]{64}$/
      )
    })
  })
})
