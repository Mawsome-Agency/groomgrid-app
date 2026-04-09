import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { trackApiTimingServer } from '@/lib/ga4-server'

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, password, businessName } = body

  try {

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

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Signup error:', error)
    const durationMs = Date.now() - startTime
    // Track API timing for errors (but we don't have userId yet)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  } finally {
    // Track timing for successful requests
    try {
      if (email) {
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
        if (user) {
          const durationMs = Date.now() - startTime
          await trackApiTimingServer(user.id, '/api/auth/signup', durationMs, true)
        }
      }
    } catch {
      // Ignore timing errors
    }
  }
}
