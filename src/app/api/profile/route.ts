import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth-options'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(profile)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { onboardingStep, onboardingCompleted, welcomeShown, ...rest } = body

    const VALID_PLAN_TYPES = ['solo', 'salon', 'enterprise']

    const data: Record<string, unknown> = {}
    if (onboardingStep !== undefined) data.onboardingStep = onboardingStep
    if (onboardingCompleted !== undefined) data.onboardingCompleted = onboardingCompleted
    if (welcomeShown !== undefined) data.welcomeShown = welcomeShown
    if (rest.businessName !== undefined) data.businessName = rest.businessName
    if (rest.phone !== undefined) data.phone = rest.phone
    if (rest.planType !== undefined) {
      if (!VALID_PLAN_TYPES.includes(rest.planType)) {
        return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
      }
      data.planType = rest.planType
    }

    // When a trial user selects a plan, ensure their trial dates are consistent.
    // If trialEndsAt is missing or in the past, reset it to 14 days from now.
    // This shouldn't normally happen (signup sets trialEndsAt), but defends against
    // edge cases where the profile was created without proper trial dates.
    if (rest.planType !== undefined) {
      const currentProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      })
      if (currentProfile?.subscriptionStatus === 'trial') {
        const now = new Date()
        if (!currentProfile.trialEndsAt || new Date(currentProfile.trialEndsAt) <= now) {
          const trialEndsAt = new Date()
          trialEndsAt.setDate(trialEndsAt.getDate() + 14)
          data.trialEndsAt = trialEndsAt
        }
      }
    }

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data,
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
