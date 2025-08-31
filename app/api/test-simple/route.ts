import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Simple API test called');
    
    return NextResponse.json({ 
      message: 'API is working perfectly!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      success: true 
    });
    
  } catch (error) {
    console.error('❌ Simple API test error:', error);
    return NextResponse.json({ 
      error: 'Simple API test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }, { status: 500 });
  }
}
