import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard']
// Define routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  // Check if the route is protected and user is not authenticated
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !token) {
    // Store the original URL to redirect back after login
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && token) {
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
