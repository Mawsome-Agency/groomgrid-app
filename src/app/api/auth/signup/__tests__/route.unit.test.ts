/**
 * @jest-environment node
 *
 * Unit tests for POST /api/auth/signup
 *
 * Coverage focus: PR #130 gap — email verification token creation and
 * fire-and-forget email flow. Extended (test stage) to add enrollUserInDrip
 * mock, input validation, duplicate-email, and rate-limit edge cases.
 *
 * Mocked dependencies:
 *   - @/lib/prisma  (user.findUnique, user.create, emailVerificationToken.create)
 *   - @/lib/email/verify-email  (sendVerificationEmail)
 *   - @/lib/email/welcome  (sendWelcomeEmail)
 *   - @/lib/email/enroll-drip  (enrollUserInDrip — fire-and-forget)
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

// Must mock enroll-drip — it calls prisma.dripEmailQueue which is NOT in the
// prisma mock above. Without this mock the fire-and-forget catch swallows a
// silent TypeError, giving false confidence that the function was never invoked.
const mockEnrollUserInDrip = jest.fn()
jest.mock('@/lib/email/enroll-drip', () => ({
  enrollUserInDrip: mockEnrollUserInDrip,
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
    mockEnrollUserInDrip.mockResolvedValue(undefined)
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

    it('does NOT call sendWelcomeEmail (welcome is handled by drip step0)', async () => {
      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Fluffy Cuts',
      })
      await POST(req)

      // sendWelcomeEmail was removed — drip step0 handles the welcome email
      expect(mockSendWelcomeEmail).not.toHaveBeenCalled()
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

  // ── (5) sendWelcomeEmail is no longer called ──────────────────────────

  describe('sendWelcomeEmail — removed (drip step0 handles welcome)', () => {
    it('sendWelcomeEmail is never called on signup', async () => {
      const req = makeRequest({
        email: 'wel@example.com',
        password: 'pass1234',
        businessName: 'Welcome Test',
      })
      await POST(req)
      await Promise.resolve()
      await Promise.resolve()

      expect(mockSendWelcomeEmail).not.toHaveBeenCalled()
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

    it('falls back to app subdomain when NEXT_PUBLIC_APP_URL is an empty string', async () => {
      // Empty string is falsy — the || operator falls through to the hardcoded
      // app subdomain, same as undefined/unset.  This can happen if someone
      // accidentally sets NEXT_PUBLIC_APP_URL= in their .env file.
      process.env.NEXT_PUBLIC_APP_URL = ''

      const req = makeRequest({
        email: 'emptyenv@example.com',
        password: 'pass1234',
        businessName: 'Empty Env Test',
      })
      await POST(req)

      const [, verifyUrl]: [string, string] =
        mockSendVerificationEmail.mock.calls[0]

      expect(verifyUrl).toMatch(
        /^https:\/\/app\.getgroomgrid\.com\/api\/auth\/verify-email\?token=[0-9a-f]{64}$/
      )
    })
  })

  // ── (8) enrollUserInDrip — fire-and-forget drip enrollment ───────────────────

  describe('enrollUserInDrip — fire-and-forget', () => {
    it('calls enrollUserInDrip with the correct userId and email on happy path', async () => {
      const req = makeRequest({
        email: 'drip@example.com',
        password: 'pass1234',
        businessName: 'Drip Test',
      })
      await POST(req)
      // Flush fire-and-forget microtasks
      await Promise.resolve()
      await Promise.resolve()

      // Route calls enrollUserInDrip(user.id, user.email) using the DB result
      // object — so the email here is TEST_USER.email from the mock, not the
      // raw request body email.
      expect(mockEnrollUserInDrip).toHaveBeenCalledTimes(1)
      expect(mockEnrollUserInDrip).toHaveBeenCalledWith(
        TEST_USER.id,
        TEST_USER.email
      )
    })

    it('returns 201 even when enrollUserInDrip rejects (fire-and-forget)', async () => {
      mockEnrollUserInDrip.mockRejectedValue(new Error('DB timeout'))

      const req = makeRequest({
        email: 'drip2@example.com',
        password: 'pass1234',
        businessName: 'Drip Fail Test',
      })
      const res = await POST(req)
      await Promise.resolve()
      await Promise.resolve()

      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.success).toBe(true)
    })

    it('still creates user and token when enrollUserInDrip rejects', async () => {
      mockEnrollUserInDrip.mockRejectedValue(new Error('Queue full'))

      const req = makeRequest({
        email: 'drip3@example.com',
        password: 'pass1234',
        businessName: 'Drip Fail 2',
      })
      await POST(req)
      await Promise.resolve()
      await Promise.resolve()

      expect(mockUserCreate).toHaveBeenCalledTimes(1)
      expect(mockEmailVerificationTokenCreate).toHaveBeenCalledTimes(1)
    })

    it('does NOT call enrollUserInDrip when emailVerificationToken.create fails', async () => {
      // enrollUserInDrip runs after the awaited DB write — if the DB write
      // throws it propagates to the catch block and skips the fire-and-forget block.
      mockEmailVerificationTokenCreate.mockRejectedValue(new Error('DB error'))

      const req = makeRequest({
        email: 'drip4@example.com',
        password: 'pass1234',
        businessName: 'Drip Skip Test',
      })
      await POST(req)

      expect(mockEnrollUserInDrip).not.toHaveBeenCalled()
    })
  })

  // ── (9) Input validation ──────────────────────────────────────────────────────

  describe('input validation', () => {
    it('returns 400 when email is missing', async () => {
      const req = makeRequest({ password: 'pass1234', businessName: 'Test' })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBe('Missing required fields')
    })

    it('returns 400 when password is missing', async () => {
      const req = makeRequest({ email: 'a@b.com', businessName: 'Test' })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBe('Missing required fields')
    })

    it('returns 400 when businessName is missing', async () => {
      const req = makeRequest({ email: 'a@b.com', password: 'pass1234' })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBe('Missing required fields')
    })

    it('returns 400 when body is entirely empty', async () => {
      const req = makeRequest({})
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBe('Missing required fields')
    })

    it('does NOT create a user when required fields are missing', async () => {
      const req = makeRequest({ email: 'a@b.com' })
      await POST(req)

      expect(mockUserCreate).not.toHaveBeenCalled()
    })
  })

  // ── (10) Duplicate email ──────────────────────────────────────────────────────

  describe('duplicate email', () => {
    it('returns 409 when email is already in use', async () => {
      mockUserFindUnique.mockResolvedValue(TEST_USER) // simulate existing user

      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Duplicate Test',
      })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(409)
      expect(body.error).toBe('Email already in use')
    })

    it('does NOT create a user when email is already in use', async () => {
      mockUserFindUnique.mockResolvedValue(TEST_USER)

      const req = makeRequest({
        email: 'groomer@example.com',
        password: 'SecurePass1!',
        businessName: 'Duplicate Test 2',
      })
      await POST(req)

      expect(mockUserCreate).not.toHaveBeenCalled()
    })

    it('normalises email to lowercase before duplicate check', async () => {
      mockUserFindUnique.mockResolvedValue(null)

      const req = makeRequest({
        email: 'UPPER@EXAMPLE.COM',
        password: 'pass1234',
        businessName: 'Casing Test',
      })
      await POST(req)

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { email: 'upper@example.com' },
      })
    })
  })

  // ── (11) user.create DB failure propagates ────────────────────────────────────

  describe('user.create DB failure', () => {
    it('returns 500 when user.create throws', async () => {
      mockUserCreate.mockRejectedValue(new Error('DB connection lost'))

      const req = makeRequest({
        email: 'fail@example.com',
        password: 'pass1234',
        businessName: 'Create Fail',
      })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(500)
      expect(body.error).toBe('Failed to create account')
    })

    it('does NOT call sendVerificationEmail when user.create throws', async () => {
      mockUserCreate.mockRejectedValue(new Error('DB error'))

      const req = makeRequest({
        email: 'fail2@example.com',
        password: 'pass1234',
        businessName: 'Create Fail 2',
      })
      await POST(req)

      expect(mockSendVerificationEmail).not.toHaveBeenCalled()
    })
  })

  // ── (12) Rate limiting ────────────────────────────────────────────────────────

  describe('rate limiting', () => {
    it('returns 429 after 5 signup attempts from the same IP', async () => {
      const ip = `10.0.0.${Math.floor(Math.random() * 200) + 1}`

      // First 5 should be allowed (they may fail for other reasons but won't 429)
      for (let i = 0; i < 5; i++) {
        const req = makeRequest(
          { email: `rl${i}@example.com`, password: 'pass1234', businessName: 'RL Test' },
          ip
        )
        const res = await POST(req)
        expect(res.status).not.toBe(429)
      }

      // 6th attempt from the same IP should be rate-limited
      const blockedReq = makeRequest(
        { email: 'rl6@example.com', password: 'pass1234', businessName: 'RL Blocked' },
        ip
      )
      const blockedRes = await POST(blockedReq)
      const body = await blockedRes.json()

      expect(blockedRes.status).toBe(429)
      expect(body.error).toBe('Too many signup attempts')
    })

    it('includes Retry-After header on 429 response', async () => {
      const ip = `10.1.0.${Math.floor(Math.random() * 200) + 1}`

      for (let i = 0; i < 5; i++) {
        await POST(makeRequest(
          { email: `ra${i}@example.com`, password: 'pass1234', businessName: 'RA Test' },
          ip
        ))
      }

      const res = await POST(makeRequest(
        { email: 'ra6@example.com', password: 'pass1234', businessName: 'RA Block' },
        ip
      ))

      expect(res.status).toBe(429)
      expect(res.headers.get('Retry-After')).not.toBeNull()
    })

    it('allows requests from different IPs independently', async () => {
      // Two different IPs — each gets its own rate limit window
      const ip1 = `10.2.0.${Math.floor(Math.random() * 200) + 1}`
      const ip2 = `10.3.0.${Math.floor(Math.random() * 200) + 1}`

      // Exhaust ip1's limit
      for (let i = 0; i < 5; i++) {
        await POST(makeRequest(
          { email: `ip1-${i}@example.com`, password: 'pass1234', businessName: 'IP1 Test' },
          ip1
        ))
      }

      // ip2 should still be allowed
      const res = await POST(makeRequest(
        { email: 'ip2@example.com', password: 'pass1234', businessName: 'IP2 Test' },
        ip2
      ))
      expect(res.status).not.toBe(429)
    })
  })
})
