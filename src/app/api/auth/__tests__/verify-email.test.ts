/**
 * @jest-environment node
 *
 * Unit tests for /api/auth/verify-email GET handler.
 *
 * Tests the four outcomes:
 *   1. Missing token param → redirect to /login?error=missing-token
 *   2. Token not found / expired / already used → redirect to /login?error=invalid-token
 *   3. DB error → redirect to /login?error=verification-failed
 *   4. Valid token → marks user verified, marks token used, calls trackEmailVerified,
 *      redirects to /login?verified=true
 */

import { NextRequest } from 'next/server'

// Mock prisma before importing the route
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    emailVerificationToken: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

// Mock ga4 so trackEmailVerified can be asserted without window/gtag
jest.mock('@/lib/ga4', () => ({
  trackEmailVerified: jest.fn(),
}))

import prisma from '@/lib/prisma'
import { trackEmailVerified } from '@/lib/ga4'
import { GET } from '../verify-email/route'

const mockFindUnique = prisma.emailVerificationToken.findUnique as jest.Mock
const mockTransaction = prisma.$transaction as jest.Mock
const mockTrackEmailVerified = trackEmailVerified as jest.Mock

const BASE_URL = 'http://localhost:3000'

function makeRequest(token?: string): NextRequest {
  const url = token
    ? `${BASE_URL}/api/auth/verify-email?token=${token}`
    : `${BASE_URL}/api/auth/verify-email`
  return new NextRequest(url)
}

describe('GET /api/auth/verify-email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('missing token', () => {
    it('redirects to /login?error=missing-token when no token param', async () => {
      const req = makeRequest()
      const res = await GET(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login?error=missing-token')
      expect(mockFindUnique).not.toHaveBeenCalled()
      expect(mockTrackEmailVerified).not.toHaveBeenCalled()
    })
  })

  describe('invalid / expired / used token', () => {
    it('redirects to /login?error=invalid-token when token is not found', async () => {
      mockFindUnique.mockResolvedValueOnce(null)

      const req = makeRequest('unknown-token')
      const res = await GET(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login?error=invalid-token')
      expect(mockTransaction).not.toHaveBeenCalled()
      expect(mockTrackEmailVerified).not.toHaveBeenCalled()
    })

    it('redirects to /login?error=invalid-token when token is expired', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'tok_1',
        userId: 'user_1',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 1000), // already expired
        usedAt: null,
      })

      const req = makeRequest('expired-token')
      const res = await GET(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login?error=invalid-token')
      expect(mockTransaction).not.toHaveBeenCalled()
      expect(mockTrackEmailVerified).not.toHaveBeenCalled()
    })

    it('redirects to /login?error=invalid-token when token has already been used', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'tok_1',
        userId: 'user_1',
        token: 'used-token',
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: new Date(),
      })

      const req = makeRequest('used-token')
      const res = await GET(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login?error=invalid-token')
      expect(mockTransaction).not.toHaveBeenCalled()
      expect(mockTrackEmailVerified).not.toHaveBeenCalled()
    })
  })

  describe('database error', () => {
    it('redirects to /login?error=verification-failed on unexpected DB error', async () => {
      mockFindUnique.mockRejectedValueOnce(new Error('DB connection lost'))

      const req = makeRequest('good-token')
      const res = await GET(req)

      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login?error=verification-failed')
      expect(mockTrackEmailVerified).not.toHaveBeenCalled()
    })
  })

  describe('successful verification', () => {
    it('marks user emailVerified, marks token used, calls trackEmailVerified, redirects to /login?verified=true', async () => {
      const userId = 'user_abc'
      const tokenId = 'tok_abc'

      mockFindUnique.mockResolvedValueOnce({
        id: tokenId,
        userId,
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: null,
      })
      mockTransaction.mockResolvedValueOnce(undefined)

      const req = makeRequest('valid-token')
      const res = await GET(req)

      // Verify transaction was called with both update operations
      expect(mockTransaction).toHaveBeenCalledTimes(1)
      const [ops] = mockTransaction.mock.calls[0]
      expect(Array.isArray(ops)).toBe(true)
      expect(ops).toHaveLength(2)

      // trackEmailVerified fires with the correct userId
      expect(mockTrackEmailVerified).toHaveBeenCalledTimes(1)
      expect(mockTrackEmailVerified).toHaveBeenCalledWith(userId)

      // Redirects to success
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login?verified=true')
    })

    it('does not call trackEmailVerified when transaction fails', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'tok_1',
        userId: 'user_1',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: null,
      })
      mockTransaction.mockRejectedValueOnce(new Error('Transaction failed'))

      const req = makeRequest('valid-token')
      const res = await GET(req)

      expect(mockTrackEmailVerified).not.toHaveBeenCalled()
      expect(res.headers.get('location')).toContain('/login?error=verification-failed')
    })
  })
})
