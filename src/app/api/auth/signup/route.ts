import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { enrollUserInDrip } from '@/lib/email/enroll-drip'

export async function POST(req: NextRequest) {
  try {
    const { email, password, businessName } = await req.json()

    if (!email || !password || !businessName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        businessName,
        profile: {
          create: {
            businessName,
            subscriptionStatus: 'trial',
            trialEndsAt,
          },
        },
      },
    })

    // Auto-enroll new user in the welcome drip sequence (non-fatal)
    try {
      await enrollUserInDrip(user.id, user.email)
    } catch (dripError) {
      console.error('Drip enrollment failed (non-fatal):', dripError)
    }

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
