import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 API Diagnostic Check Started');
    
    const diagnostic = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      environmentVariables: {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
      },
      supabaseConnection: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
      }
    };
    
    // Test Supabase connection
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      console.log('🧪 Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('teachers')
        .select('id', { count: 'exact', head: true })
        .limit(1);
      
      if (error) {
        diagnostic.supabaseTest = {
          status: 'Error',
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        };
      } else {
        diagnostic.supabaseTest = {
          status: 'Success',
          canAccessTeachers: true,
          teachersCount: data?.length || 0
        };
      }
      
    } catch (supabaseError) {
      diagnostic.supabaseTest = {
        status: 'Connection Failed',
        error: supabaseError instanceof Error ? supabaseError.message : 'Unknown connection error'
      };
    }
    
    console.log('✅ Diagnostic completed:', diagnostic);
    
    return NextResponse.json({
      diagnostic,
      success: true
    });
    
  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    
    return NextResponse.json({
      diagnostic: {
        status: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      success: false
    }, { status: 500 });
  }
}
