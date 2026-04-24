import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email/verify-email'

const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000
const RATE_LIMIT_MS = 60 * 1000 // 1 request per minute per email

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number>()

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalized = email.toLowerCase().trim()

    // Rate limit: 1 resend per email per minute
    const lastSent = rateLimitMap.get(normalized)
    const now = Date.now()
    if (lastSent && now - lastSent < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: 'Please wait before requesting another verification email' },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true, emailVerified: true },
    })

    // Always respond with success to avoid email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true })
    }

    // Invalidate any existing tokens for this user
    await prisma.emailVerificationToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    })

    // Create a fresh token
    const token = crypto.randomBytes(32).toString('hex')
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(now + VERIFICATION_TOKEN_EXPIRY_MS),
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.getgroomgrid.com'
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`

    await sendVerificationEmail(normalized, verifyUrl)

    rateLimitMap.set(normalized, now)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
