import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for OAuth callback and static files
  if (
    request.nextUrl.pathname.startsWith('/auth/callback') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    console.log('🔄 Middleware skipped for:', request.nextUrl.pathname);
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Get session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Middleware auth error:', error);
    }

    console.log('🔍 Middleware - Path:', request.nextUrl.pathname);
    console.log('🔍 Middleware - Session exists:', !!session);
    console.log('🔍 Middleware - User ID:', session?.user?.id);

    // Check if accessing admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      console.log('🔒 Admin route access attempt');
      
      // If no session, redirect to login
      if (!session) {
        console.log('❌ No session, redirecting to login');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      // If session exists, check if user is admin
      if (session.user) {
        try {
          console.log('🔍 Checking admin access for user:', session.user.id);
          
          // Simplified admin check - just check if session exists
          // We'll do detailed role checking on the client side
          console.log('✅ Session exists, allowing access to admin routes');
          
        } catch (error) {
          console.error('💥 Error checking admin access in middleware:', error);
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }
    }

    // Check if accessing protected dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('🏠 Dashboard route access attempt');
      
      if (!session) {
        console.log('❌ No session for dashboard, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Check if accessing protected student routes
    if (request.nextUrl.pathname.startsWith('/students') && request.nextUrl.pathname !== '/students') {
      console.log('👨‍🎓 Student route access attempt');
      
      if (!session) {
        console.log('❌ No session for student route, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Check if accessing protected teacher routes
    if (request.nextUrl.pathname.startsWith('/teachers') && request.nextUrl.pathname !== '/teachers') {
      console.log('👨‍🏫 Teacher route access attempt');
      
      if (!session) {
        console.log('❌ No session for teacher route, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

  } catch (error) {
    console.error('💥 Middleware unexpected error:', error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (OAuth callback)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|api).*)',
  ],
};
