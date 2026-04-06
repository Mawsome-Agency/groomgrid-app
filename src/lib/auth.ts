import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth-options'
import prisma from './prisma'

export { prisma }

// Extended Session type with user id
interface ExtendedSession {
  user?: {
    id: string
    email: string
    name?: string | null
  }
}

// Get current session (server-side)
export async function getSession(): Promise<ExtendedSession | null> {
  return getServerSession(authOptions) as Promise<ExtendedSession | null>
}

// Get current user from session
export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user?.id) return null
  return session.user
}

// Get user profile
export async function getProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
  })
}

// Update profile
export async function updateProfile(
  userId: string,
  updates: Partial<{
    businessName: string
    phone: string
    planType: string
    subscriptionStatus: string
    trialEndsAt: Date
    onboardingCompleted: boolean
    onboardingStep: number
    stripeCustomerId: string
    stripeSubscriptionId: string
  }>
) {
  return prisma.profile.update({
    where: { userId },
    data: updates,
  })
}

// Update onboarding step
export async function updateOnboardingStep(userId: string, step: number) {
  return prisma.profile.update({
    where: { userId },
    data: { onboardingStep: step },
  })
}

// Skip onboarding
export async function skipOnboarding(userId: string) {
  return prisma.profile.update({
    where: { userId },
    data: { onboardingCompleted: true, onboardingStep: 3 },
  })
}
