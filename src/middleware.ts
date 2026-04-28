import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/onboarding', '/welcome', '/admin']
const authRoutes = ['/login', '/signup']

/**
 * Routes that must never be cached — conversion-critical pages where stale
 * Server Action IDs cause "Failed to find Server Action" errors after deploys.
 */
const noCacheRoutes = ['/signup', '/login', '/plans', '/checkout']

/**
 * Whether the request should receive Cache-Control: no-store headers.
 *
 * - POST requests: always no-cache (Server Actions are POST)
 * - API routes: always no-cache (dynamic data, webhooks)
 * - Conversion-critical pages: always no-cache (signup, login, plans, checkout)
 * - Regular pages (blog, homepage): allow normal caching
 */
function needsNoCache(pathname: string, method: string): boolean {
  if (method === 'POST') return true
  if (pathname.startsWith('/api/')) return true
  return noCacheRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

export async function middleware(request: NextRequest) {
  const cookieName =
    process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
  })

  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  let response: NextResponse

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    response = NextResponse.redirect(loginUrl)
  } else if (isAuthRoute && token) {
    response = NextResponse.redirect(new URL('/dashboard', request.url))
  } else {
    response = NextResponse.next()
  }

  // Prevent stale Server Action IDs from being cached after deployments.
  // Without these headers, browsers may cache the old page HTML containing
  // action IDs that no longer exist on the server, causing "Failed to find
  // Server Action" errors that block conversions.
  if (needsNoCache(pathname, request.method)) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    if (request.method === 'POST') {
      response.headers.set('Expires', '0')
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
