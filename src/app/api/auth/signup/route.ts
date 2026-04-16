import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email/welcome'

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

    // Non-blocking — fire and forget so signup response is never delayed
    sendWelcomeEmail(user.email, businessName).catch(err =>
      console.error('Welcome email failed:', err)
    )

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
