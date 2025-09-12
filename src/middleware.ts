import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Check for NextAuth session token in cookies
function isAuthenticated(request: NextRequest): boolean {
  // NextAuth stores session in cookies with names like:
  // - authjs.session-token (production)
  // - __Secure-authjs.session-token (production with HTTPS)
  // - authjs.session-token (development)

  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  return !!sessionToken
}

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard']
// Define routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authenticated = isAuthenticated(request)

  // Check if the route is protected and user is not authenticated
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !authenticated) {
    // Store the original URL to redirect back after login
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Match all protected routes
    '/dashboard/:path*',
    // Match auth routes
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
}
