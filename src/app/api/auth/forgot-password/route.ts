import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email/password-reset'

// Token expires in 1 hour
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 1 hour in milliseconds

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Always return 200 to prevent email enumeration
    // Even if email doesn't exist, we show the same message
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      // Don't reveal that email doesn't exist
      return NextResponse.json({
        message: 'If that email exists in our system, you will receive a reset link shortly.',
      })
    }

    // Generate and store reset token
    const token = generateResetToken()
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Send password reset email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${appUrl}/reset-password?token=${token}`

    await sendPasswordResetEmail(normalizedEmail, resetUrl)

    return NextResponse.json({
      message: 'If that email exists in our system, you will receive a reset link shortly.',
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
