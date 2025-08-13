import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const userType = requestUrl.searchParams.get('user_type');
  const error = requestUrl.searchParams.get('error');
  const state = requestUrl.searchParams.get('state');

  console.log('🔍 OAuth Callback Debug Info:');
  console.log('URL:', request.url);
  console.log('Code:', code ? 'Present' : 'Missing');
  console.log('User Type:', userType);
  console.log('Error:', error);
  console.log('State:', state);
  console.log('All params:', Object.fromEntries(requestUrl.searchParams.entries()));

  // Handle OAuth errors
  if (error) {
    console.error('❌ OAuth error received:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=oauth_${error}`);
  }

  if (!code) {
    console.error('❌ No code provided in callback');
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
  }

  try {
    // For PKCE flow, we don't exchange the code on the server side
    // because the code_verifier is stored in the browser's localStorage
    // We just redirect to the client-side handler which will complete the flow
    
    console.log('🔄 PKCE flow detected - redirecting to client-side handler');
    
    // Redirect to a client-side page that will handle the PKCE exchange
    const redirectUrl = userType 
      ? `${requestUrl.origin}/auth/complete?type=${userType}&code=${encodeURIComponent(code)}`
      : `${requestUrl.origin}/auth/complete?code=${encodeURIComponent(code)}`;
    
    console.log('🔄 Redirecting to client-side handler:', redirectUrl);
    return NextResponse.redirect(redirectUrl);

  } catch (error: any) {
    console.error('💥 Unexpected error in callback:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error&details=${encodeURIComponent(error.message)}`);
  }
}
