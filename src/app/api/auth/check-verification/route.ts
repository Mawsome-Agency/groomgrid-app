import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/auth/check-verification
 *
 * Checks if a user exists but hasn't verified their email yet.
 * Used by the login page to distinguish between "wrong password" and
 * "unverified email" when NextAuth returns a generic CredentialsSignin error.
 *
 * Always returns 200 to avoid email enumeration — the needsVerification
 * flag is only true when the email exists AND is unverified.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ needsVerification: false }, { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { emailVerified: true },
    })

    // Only reveal verification status, not existence
    if (!user) {
      return NextResponse.json({ needsVerification: false }, { status: 200 })
    }

    return NextResponse.json(
      { needsVerification: !user.emailVerified },
      { status: 200 }
    )
  } catch (error) {
    console.error('[check-verification] Error:', error)
    return NextResponse.json({ needsVerification: false }, { status: 200 })
  }
}
