/**
 * @jest-environment node
 *
 * Unit tests for POST /api/analytics/track
 *
 * Key behaviors:
 * - Accepts requests with no auth session (anonymous pre-signup events)
 * - Requires eventName in request body
 * - Stores event with userId = null when unauthenticated
 * - Stores event with userId when authenticated
 * - Passes through sessionId and properties to the DB
 */

// ─── Mock declarations ─────────────────────────────────────────────────────

const mockAnalyticsEventCreate = jest.fn()

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    analyticsEvent: {
      create: mockAnalyticsEventCreate,
    },
  },
}))

const mockGetServerSession = jest.fn()
jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}))

jest.mock('@/lib/next-auth-options', () => ({
  authOptions: {},
}))

// ─── Imports ───────────────────────────────────────────────────────────────

import { POST } from '../analytics/track/route'
import { NextRequest } from 'next/server'

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─── Tests ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks()
  mockAnalyticsEventCreate.mockResolvedValue({ id: 'evt_test_123' })
})

describe('POST /api/analytics/track', () => {
  describe('anonymous (pre-signup) tracking', () => {
    it('stores event with userId = null when no session exists', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const req = makeRequest({
        eventName: 'signup_viewed',
        sessionId: 'sess_123_abc',
        properties: { page: '/signup' },
      })

      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(mockAnalyticsEventCreate).toHaveBeenCalledWith({
        data: {
          userId: null,
          eventName: 'signup_viewed',
          properties: { page: '/signup' },
          sessionId: 'sess_123_abc',
        },
      })
    })

    it('stores signup_started without a session (funnel entry)', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const req = makeRequest({ eventName: 'signup_started', sessionId: 'sess_456' })
      const res = await POST(req)

      expect(res.status).toBe(200)
      expect(mockAnalyticsEventCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: null, eventName: 'signup_started' }),
        })
      )
    })
  })

  describe('authenticated tracking', () => {
    it('stores event with userId when a session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user_abc', email: 'groomer@example.com' },
        expires: '',
      })

      const req = makeRequest({
        eventName: 'appointment_created',
        sessionId: 'sess_789',
        properties: { appointmentId: 'appt_1' },
      })

      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(mockAnalyticsEventCreate).toHaveBeenCalledWith({
        data: {
          userId: 'user_abc',
          eventName: 'appointment_created',
          properties: { appointmentId: 'appt_1' },
          sessionId: 'sess_789',
        },
      })
    })
  })

  describe('validation', () => {
    it('returns 400 when eventName is missing', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const req = makeRequest({ sessionId: 'sess_abc', properties: {} })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBe('eventName is required')
      expect(mockAnalyticsEventCreate).not.toHaveBeenCalled()
    })

    it('returns 400 for malformed JSON body', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const req = new NextRequest('http://localhost/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'this-is-not-json{{{',
      })

      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBe('Invalid JSON body')
    })

    it('defaults properties to {} and sessionId to null when not provided', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const req = makeRequest({ eventName: 'page_viewed' })
      await POST(req)

      expect(mockAnalyticsEventCreate).toHaveBeenCalledWith({
        data: {
          userId: null,
          eventName: 'page_viewed',
          properties: {},
          sessionId: null,
        },
      })
    })
  })

  describe('error handling', () => {
    it('returns 500 when Prisma throws', async () => {
      mockGetServerSession.mockResolvedValue(null)
      mockAnalyticsEventCreate.mockRejectedValue(new Error('DB connection failed'))

      const req = makeRequest({ eventName: 'signup_viewed' })
      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(500)
      // Error message should NOT leak internal details (OWASP)
      expect(body.error).toBe('Failed to track event')
      expect(body.error).not.toContain('DB connection')
    })
  })
})
