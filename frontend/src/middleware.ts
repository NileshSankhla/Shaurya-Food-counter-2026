import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/'
  const token = request.cookies.get('auth_token')?.value

  // If trying to access a protected route without a token, bounce to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access login while already authenticated, bounce to dashboard
  if (isPublicPath && token && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png, profile.png (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|profile.png).*)',
  ],
}
