import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Environment Variables Check:');
    
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
    };
    
    console.log('Environment Check:', envCheck);
    
    // Test basic Supabase connection
    console.log('🔍 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('admins')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        errorDetails: testError,
        environment: envCheck
      });
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test teachers table
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('id, email, status')
      .limit(3);
    
    return NextResponse.json({
      success: true,
      message: 'Environment and database connection working',
      environment: envCheck,
      testData: {
        adminsTest: testData,
        teachersCount: teacherData?.length || 0,
        teachersError: teacherError?.message || null
      }
    });
    
  } catch (error: any) {
    console.error('💥 Test API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test API failed',
      errorMessage: error.message,
      errorStack: error.stack
    });
  }
}
