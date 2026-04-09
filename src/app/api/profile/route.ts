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

  return NextResponse.json({ profile })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { onboardingStep, onboardingCompleted, planType, ...rest } = body

    const data: Record<string, unknown> = {}
    if (onboardingStep !== undefined) data.onboardingStep = onboardingStep
    if (onboardingCompleted !== undefined) data.onboardingCompleted = onboardingCompleted
    if (planType !== undefined) data.planType = planType
    if (rest.businessName !== undefined) data.businessName = rest.businessName
    if (rest.phone !== undefined) data.phone = rest.phone

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data,
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
