import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { trackEmailVerified } from '@/lib/ga4'

// Use the public app URL as redirect base — req.url resolves to localhost:3002
// behind nginx, which produces unreachable redirects in production.
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getgroomgrid.com'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing-token', appUrl))
  }

  try {
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
    })

    if (!record || record.expiresAt < new Date() || record.usedAt) {
      return NextResponse.redirect(new URL('/login?error=invalid-token', appUrl))
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ])

    // Wire: fires once, on the success path only
    trackEmailVerified(record.userId)

    return NextResponse.redirect(new URL('/login?verified=true&next=/plans', appUrl))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/login?error=verification-failed', appUrl))
  }
}
