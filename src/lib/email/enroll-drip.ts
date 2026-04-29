import crypto from 'crypto'
import prisma from '@/lib/prisma'

const DRIP_DAYS = [0, 1, 3, 5, 7, 14]

export async function enrollUserInDrip(
  userId: string,
  email: string,
  signupDate: Date = new Date()
): Promise<void> {
  // Generate an unsubscribe token for this user (idempotent — reuses existing)
  let tokenRecord = await prisma.unsubscribeToken.findFirst({
    where: { userId },
  })
  if (!tokenRecord) {
    tokenRecord = await prisma.unsubscribeToken.create({
      data: {
        userId,
        token: crypto.randomBytes(32).toString('hex'),
      },
    })
  }

  const rows = DRIP_DAYS.map((day) => ({
    userId,
    email,
    sequenceStep: day,
    scheduledAt: new Date(signupDate.getTime() + day * 24 * 60 * 60 * 1000),
    status: 'pending',
  }))

  await prisma.dripEmailQueue.createMany({ data: rows })
}

/**
 * Get or create an unsubscribe token for a user.
 * Returns the token string, or null if something goes wrong.
 */
export async function getUnsubscribeToken(userId: string): Promise<string | null> {
  try {
    let tokenRecord = await prisma.unsubscribeToken.findFirst({
      where: { userId },
    })
    if (!tokenRecord) {
      tokenRecord = await prisma.unsubscribeToken.create({
        data: {
          userId,
          token: crypto.randomBytes(32).toString('hex'),
        },
      })
    }
    return tokenRecord.token
  } catch (err) {
    console.error('[enroll-drip] Failed to get/create unsubscribe token:', err)
    return null
  }
}
