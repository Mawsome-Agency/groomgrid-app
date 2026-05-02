/**
 * @jest-environment node
 *
 * Unit tests for POST /api/auth/check-verification
 *
 * Security-critical: this endpoint MUST NOT reveal whether an email
 * exists in the system. All paths return { needsVerification: false }
 * except when the email IS found AND emailVerified is null.
 *
 * Test cases:
 *   1. Missing email → { needsVerification: false }
 *   2. Empty string email → { needsVerification: false }
 *   3. Non-string email (number, object) → { needsVerification: false }
 *   4. User not found → { needsVerification: false } (no enumeration)
 *   5. User found + emailVerified = null → { needsVerification: true }
 *   6. User found + emailVerified = Date → { needsVerification: false }
 *   7. User found + emailVerified = null + mixed case email → { needsVerification: true }
 *   8. User found + emailVerified = null + whitespace in email → { needsVerification: true }
 *   9. DB error → { needsVerification: false } (fail-closed, no enumeration)
 */

import { NextRequest } from 'next/server'

// Mock prisma before importing the route
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

import prisma from '@/lib/prisma'
import { POST } from '../check-verification/route'

const mockFindUnique = prisma.user.findUnique as jest.Mock

const BASE_URL = 'http://localhost:3000'

function makeRequest(body: Record<string, unknown> = {}): NextRequest {
  return new NextRequest(`${BASE_URL}/api/auth/check-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/check-verification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ── Invalid input cases (should return needsVerification: false) ──────────

  describe('invalid input handling', () => {
    it('returns needsVerification: false when email is missing', async () => {
      const req = makeRequest({})
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
      expect(mockFindUnique).not.toHaveBeenCalled()
    })

    it('returns needsVerification: false when email is empty string', async () => {
      const req = makeRequest({ email: '' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
      expect(mockFindUnique).not.toHaveBeenCalled()
    })

    it('returns needsVerification: false when email is a number', async () => {
      const req = makeRequest({ email: 12345 })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
      expect(mockFindUnique).not.toHaveBeenCalled()
    })

    it('returns needsVerification: false when email is an object', async () => {
      const req = makeRequest({ email: { value: 'test@example.com' } })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
      expect(mockFindUnique).not.toHaveBeenCalled()
    })

    it('returns needsVerification: false when email is null', async () => {
      const req = makeRequest({ email: null })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
      expect(mockFindUnique).not.toHaveBeenCalled()
    })

    it('returns needsVerification: false when email is undefined', async () => {
      const req = makeRequest({ email: undefined })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
      expect(mockFindUnique).not.toHaveBeenCalled()
    })
  })

  // ── User lookup cases ──────────────────────────────────────────────────────

  describe('user not found (anti-enumeration)', () => {
    it('returns needsVerification: false when no user matches the email', async () => {
      mockFindUnique.mockResolvedValueOnce(null)

      const req = makeRequest({ email: 'nobody@example.com' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
      // Verify we searched with lowercase + trimmed email
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'nobody@example.com' },
        select: { emailVerified: true },
      })
    })
  })

  describe('user found but email not verified', () => {
    it('returns needsVerification: true when emailVerified is null', async () => {
      mockFindUnique.mockResolvedValueOnce({ emailVerified: null })

      const req = makeRequest({ email: 'unverified@example.com' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(true)
    })
  })

  describe('user found and email verified', () => {
    it('returns needsVerification: false when emailVerified is a date', async () => {
      mockFindUnique.mockResolvedValueOnce({ emailVerified: new Date() })

      const req = makeRequest({ email: 'verified@example.com' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
    })
  })

  // ── Email normalization ────────────────────────────────────────────────────

  describe('email normalization', () => {
    it('lowercases the email before lookup', async () => {
      mockFindUnique.mockResolvedValueOnce({ emailVerified: null })

      const req = makeRequest({ email: 'UpperCase@Example.COM' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'uppercase@example.com' },
        select: { emailVerified: true },
      })
    })

    it('trims whitespace from the email before lookup', async () => {
      mockFindUnique.mockResolvedValueOnce({ emailVerified: null })

      const req = makeRequest({ email: '  spaced@example.com  ' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'spaced@example.com' },
        select: { emailVerified: true },
      })
    })

    it('lowercases AND trims combined', async () => {
      mockFindUnique.mockResolvedValueOnce({ emailVerified: new Date() })

      const req = makeRequest({ email: '  NeW@TeSt.CoM  ' })
      const res = await POST(req)

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'new@test.com' },
        select: { emailVerified: true },
      })
    })
  })

  // ── Error handling (fail-closed for security) ─────────────────────────────

  describe('database error', () => {
    it('returns needsVerification: false on DB connection error', async () => {
      mockFindUnique.mockRejectedValueOnce(new Error('Connection lost'))

      const req = makeRequest({ email: 'test@example.com' })
      const res = await POST(req)

      // Security: must NOT throw or return 500 — always 200
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
    })

    it('returns needsVerification: false on prisma timeout', async () => {
      mockFindUnique.mockRejectedValueOnce(new Error('Timed out'))

      const req = makeRequest({ email: 'slow@example.com' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.needsVerification).toBe(false)
    })
  })

  // ── Response format consistency ────────────────────────────────────────────

  describe('response format', () => {
    it('always returns exactly { needsVerification: boolean }', async () => {
      mockFindUnique.mockResolvedValueOnce({ emailVerified: null })

      const req = makeRequest({ email: 'test@example.com' })
      const res = await POST(req)
      const data = await res.json()

      // Must only have needsVerification key — no user ID, no email, nothing else
      expect(Object.keys(data)).toEqual(['needsVerification'])
      expect(typeof data.needsVerification).toBe('boolean')
    })

    it('response for non-existent user matches response for verified user (anti-enumeration)', async () => {
      // Non-existent user
      mockFindUnique.mockResolvedValueOnce(null)
      const req1 = makeRequest({ email: 'nonexistent@example.com' })
      const res1 = await POST(req1)
      const data1 = await res1.json()

      // Verified user
      mockFindUnique.mockResolvedValueOnce({ emailVerified: new Date() })
      const req2 = makeRequest({ email: 'verified@example.com' })
      const res2 = await POST(req2)
      const data2 = await res2.json()

      // Both must return needsVerification: false — indistinguishable
      expect(data1).toEqual(data2)
    })
  })
})
