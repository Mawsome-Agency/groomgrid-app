import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email/welcome'
import { sendVerificationEmail } from '@/lib/email/verify-email'
import { enrollUserInDrip } from '@/lib/email/enroll-drip'

// Verification token expires in 24 hours
const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

// Simple in-memory rate limiter for signup attempts
// For production, use @upstash/ratelimit with Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_SIGNUP_ATTEMPTS = 5

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

function checkRateLimit(req: NextRequest): { allowed: boolean; retryAfter?: number } {
  const key = getRateLimitKey(req)
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    // Start new window
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }

  if (record.count >= MAX_SIGNUP_ATTEMPTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  record.count++
  return { allowed: true }
}

export async function POST(req: NextRequest) {
  // Check rate limit
  const { allowed, retryAfter } = checkRateLimit(req)
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Too many signup attempts',
        message: `You've reached the maximum signup attempts. Please wait 15 minutes before trying again, or contact support if you need immediate assistance.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(MAX_SIGNUP_ATTEMPTS),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + (retryAfter || 0) * 1000),
        },
      }
    )
  }

  try {
    const { email, password, businessName, attributionData } = await req.json()

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
            ...(attributionData && { attributionData }),
          },
        },
      },
    })

    // Generate and store an email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS)

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: verificationExpiresAt,
      },
    })

    // Non-blocking — fire and forget so signup response is never delayed
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getgroomgrid.com'
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${verificationToken}`

    sendVerificationEmail(user.email, verifyUrl).catch(err =>
      console.error('Verification email failed:', err)
    )
    sendWelcomeEmail(user.email, businessName).catch(err =>
      console.error('Welcome email failed:', err)
    )
    enrollUserInDrip(user.id, user.email).catch(err =>
      console.error('Drip enrollment failed:', err)
    )

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
