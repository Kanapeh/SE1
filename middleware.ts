import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle static assets with proper MIME types
  if (pathname.startsWith('/_next/static/css/')) {
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'text/css');
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  if (pathname.startsWith('/_next/static/js/') || pathname.startsWith('/_next/static/chunks/')) {
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'application/javascript');
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  if (pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Handle authentication routes
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  // Default response for other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
