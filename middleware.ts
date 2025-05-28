import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Create response and supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Check user session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Protected routes
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isLoginRoute = request.nextUrl.pathname === '/login';

    console.log('Current path:', request.nextUrl.pathname);
    console.log('Session exists:', !!session);
    console.log('Session user:', session?.user?.id);

    // If user is not logged in and tries to access protected routes
    if (!session?.user && (isAdminRoute || isDashboardRoute)) {
      console.log('No session, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user is logged in
    if (session?.user) {
      console.log('User is logged in, checking role...');
      
      // Check user role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return NextResponse.redirect(new URL('/login', request.url));
      }

      console.log('User role:', userData.is_admin ? 'admin' : 'user');

      // If user is not admin and tries to access admin routes
      if (isAdminRoute && !userData.is_admin) {
        console.log('Non-admin user trying to access admin route, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // If admin user is on login page
      if (isLoginRoute && userData.is_admin) {
        console.log('Admin user on login page, redirecting to admin dashboard');
        return NextResponse.redirect(new URL('/admin/requests', request.url));
      }
    }

    // Return response with updated cookies
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/login',
  ],
};
