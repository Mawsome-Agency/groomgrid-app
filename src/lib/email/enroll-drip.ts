import prisma from '@/lib/prisma'

const DRIP_DAYS = [0, 1, 3, 7, 14]

export async function enrollUserInDrip(
  userId: string,
  email: string,
  signupDate: Date = new Date()
): Promise<void> {
  const rows = DRIP_DAYS.map((day) => ({
    userId,
    email,
    sequenceStep: day,
    scheduledAt: new Date(signupDate.getTime() + day * 24 * 60 * 60 * 1000),
    status: 'pending',
  }))

  await prisma.dripEmailQueue.createMany({ data: rows })
}
