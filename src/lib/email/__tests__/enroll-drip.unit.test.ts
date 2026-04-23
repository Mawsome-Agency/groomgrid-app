/**
 * Unit tests for enrollUserInDrip (src/lib/email/enroll-drip.ts).
 *
 * Tests the drip email enrollment logic in isolation — mocks Prisma so
 * tests don't depend on database access.
 *
 * Key contracts to verify:
 *  - enrollUserInDrip creates 5 rows (one per day in DRIP_DAYS: [0, 1, 3, 7, 14])
 *  - Each row has correct userId, email, sequenceStep, status='pending'
 *  - scheduledAt is calculated correctly (signupDate + day * 86400000ms)
 *  - Default signupDate uses current time when not provided
 *  - Handles edge cases: same-day enrollment, far-future dates
 *
 * NOTE: This module imports Prisma directly, so we mock the prisma module.
 */
/** @jest-environment node */

// ─── Mock setup ────────────────────────────────────────────────────────────────

const mockCreateMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    dripEmailQueue: {
      createMany: mockCreateMany,
    },
  },
}))

import { enrollUserInDrip } from '../enroll-drip'

// ─── Fixtures ────────────────────────────────────────────────────────────────

const USER_ID = 'usr_test123'
const EMAIL = 'groomer@example.com'
const SIGNUP_DATE = new Date('2026-04-22T12:00:00.000Z')

beforeEach(() => {
  jest.clearAllMocks()
  mockCreateMany.mockResolvedValue({ count: 5 })
})

// ─── Group 1: Happy path — enrollment creates correct rows ────────────────────

describe('enrollUserInDrip — happy path', () => {
  it('calls prisma.dripEmailQueue.createMany exactly once', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    expect(mockCreateMany).toHaveBeenCalledTimes(1)
  })

  it('creates exactly 5 rows (one per DRIP_DAYS entry)', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    expect(call.data).toHaveLength(5)
  })

  it('creates rows with sequenceSteps matching [0, 1, 3, 7, 14]', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const steps = call.data.map((row: any) => row.sequenceStep).sort((a: number, b: number) => a - b)
    expect(steps).toEqual([0, 1, 3, 7, 14])
  })

  it('sets all rows status to "pending"', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const statuses = call.data.map((row: any) => row.status)
    expect(statuses).toEqual(['pending', 'pending', 'pending', 'pending', 'pending'])
  })

  it('passes userId to all rows', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const userIds = call.data.map((row: any) => row.userId)
    expect(userIds).toEqual([USER_ID, USER_ID, USER_ID, USER_ID, USER_ID])
  })

  it('passes email to all rows', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const emails = call.data.map((row: any) => row.email)
    expect(emails).toEqual([EMAIL, EMAIL, EMAIL, EMAIL, EMAIL])
  })
})

// ─── Group 2: scheduledAt date math ─────────────────────────────────────────────

describe('enrollUserInDrip — scheduledAt date calculations', () => {
  it('step 0 is scheduled at signupDate (same day)', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const step0 = call.data.find((row: any) => row.sequenceStep === 0)
    expect(step0.scheduledAt.getTime()).toBe(SIGNUP_DATE.getTime())
  })

  it('step 1 is scheduled 1 day after signupDate', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const step1 = call.data.find((row: any) => row.sequenceStep === 1)
    const expected = new Date(SIGNUP_DATE.getTime() + 1 * 24 * 60 * 60 * 1000)
    expect(step1.scheduledAt.getTime()).toBe(expected.getTime())
  })

  it('step 3 is scheduled 3 days after signupDate', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const step3 = call.data.find((row: any) => row.sequenceStep === 3)
    const expected = new Date(SIGNUP_DATE.getTime() + 3 * 24 * 60 * 60 * 1000)
    expect(step3.scheduledAt.getTime()).toBe(expected.getTime())
  })

  it('step 7 is scheduled 7 days after signupDate', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const step7 = call.data.find((row: any) => row.sequenceStep === 7)
    const expected = new Date(SIGNUP_DATE.getTime() + 7 * 24 * 60 * 60 * 1000)
    expect(step7.scheduledAt.getTime()).toBe(expected.getTime())
  })

  it('step 14 is scheduled 14 days after signupDate', async () => {
    await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const step14 = call.data.find((row: any) => row.sequenceStep === 14)
    const expected = new Date(SIGNUP_DATE.getTime() + 14 * 24 * 60 * 60 * 1000)
    expect(step14.scheduledAt.getTime()).toBe(expected.getTime())
  })
})

// ─── Group 3: Default signupDate ────────────────────────────────────────────────

describe('enrollUserInDrip — default signupDate', () => {
  it('uses current date when signupDate is not provided', async () => {
    const beforeCall = Date.now()
    await enrollUserInDrip(USER_ID, EMAIL)
    const afterCall = Date.now()

    const call = mockCreateMany.mock.calls[0][0]
    const step0 = call.data.find((row: any) => row.sequenceStep === 0)

    // The scheduledAt for step 0 should be between beforeCall and afterCall
    const scheduledTime = step0.scheduledAt.getTime()
    expect(scheduledTime).toBeGreaterThanOrEqual(beforeCall)
    expect(scheduledTime).toBeLessThanOrEqual(afterCall)
  })
})

// ─── Group 4: Error propagation ─────────────────────────────────────────────────

describe('enrollUserInDrip — error handling', () => {
  it('propagates Prisma errors (e.g., unique constraint violation)', async () => {
    mockCreateMany.mockRejectedValue(new Error('Unique constraint failed'))

    await expect(enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)).rejects.toThrow(
      'Unique constraint failed'
    )
  })

  it('propagates connection errors', async () => {
    mockCreateMany.mockRejectedValue(new Error('Connection refused'))

    await expect(enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)).rejects.toThrow(
      'Connection refused'
    )
  })

  it('propagates timeout errors', async () => {
    mockCreateMany.mockRejectedValue(new Error('Query timed out'))

    await expect(enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)).rejects.toThrow(
      'Query timed out'
    )
  })
})

// ─── Group 5: Edge cases ─────────────────────────────────────────────────────────

describe('enrollUserInDrip — edge cases', () => {
  it('handles email with special characters', async () => {
    const specialEmail = 'groomer+test@sub-domain.example.com'
    await enrollUserInDrip(USER_ID, specialEmail, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const emails = call.data.map((row: any) => row.email)
    expect(emails).toEqual([specialEmail, specialEmail, specialEmail, specialEmail, specialEmail])
  })

  it('handles UUID-style userId', async () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    await enrollUserInDrip(uuid, EMAIL, SIGNUP_DATE)
    const call = mockCreateMany.mock.calls[0][0]
    const userIds = call.data.map((row: any) => row.userId)
    expect(userIds).toEqual([uuid, uuid, uuid, uuid, uuid])
  })

  it('handles signupDate at end of month (month boundary)', async () => {
    const monthEnd = new Date('2026-01-31T23:59:59.999Z')
    await enrollUserInDrip(USER_ID, EMAIL, monthEnd)

    const call = mockCreateMany.mock.calls[0][0]
    const step1 = call.data.find((row: any) => row.sequenceStep === 1)
    // 1 day after Jan 31 = Feb 1
    const expected = new Date('2026-02-01T23:59:59.999Z')
    expect(step1.scheduledAt.getTime()).toBe(expected.getTime())
  })

  it('handles signupDate at daylight saving time boundary', async () => {
    // DST in US: March 8, 2026 (spring forward)
    const dstDate = new Date('2026-03-08T12:00:00.000Z')
    await enrollUserInDrip(USER_ID, EMAIL, dstDate)

    const call = mockCreateMany.mock.calls[0][0]
    // All date math is in UTC milliseconds, so DST should not affect calculations
    const step1 = call.data.find((row: any) => row.sequenceStep === 1)
    const expected = new Date(dstDate.getTime() + 24 * 60 * 60 * 1000)
    expect(step1.scheduledAt.getTime()).toBe(expected.getTime())
  })
})

// ─── Group 6: Return value ────────────────────────────────────────────────────────

describe('enrollUserInDrip — return value', () => {
  it('resolves to void (no return value)', async () => {
    const result = await enrollUserInDrip(USER_ID, EMAIL, SIGNUP_DATE)
    expect(result).toBeUndefined()
  })
})
