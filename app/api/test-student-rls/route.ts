import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: supabaseUrl ? 'Set' : 'Not Set',
        serviceKey: supabaseServiceRoleKey ? 'Set' : 'Not Set'
      },
      tests: {}
    };

    // Test 1: Basic connection
    try {
      const { data: countData, error: countError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      results.tests.connection = {
        success: !countError,
        error: countError?.message || null,
        count: countData?.length || 'unknown'
      };
    } catch (error: any) {
      results.tests.connection = {
        success: false,
        error: error.message
      };
    }

    // Test 2: Try to fetch all students
    try {
      const { data: allStudents, error: allError } = await supabase
        .from('students')
        .select('id, email, first_name, status')
        .limit(5);
      
      results.tests.fetchAll = {
        success: !allError,
        error: allError?.message || null,
        count: allStudents?.length || 0,
        sample: allStudents?.[0] || null
      };
    } catch (error: any) {
      results.tests.fetchAll = {
        success: false,
        error: error.message
      };
    }

    // Test 3: Try to fetch specific student if userId provided
    if (userId) {
      try {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', userId)
          .single();
        
        results.tests.fetchSpecific = {
          success: !studentError,
          error: studentError?.message || null,
          found: !!studentData,
          student: studentData ? {
            id: studentData.id,
            email: studentData.email,
            first_name: studentData.first_name,
            status: studentData.status
          } : null
        };
      } catch (error: any) {
        results.tests.fetchSpecific = {
          success: false,
          error: error.message
        };
      }
    }

    // Test 4: Check current policies
    try {
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('policyname, cmd, qual')
        .eq('tablename', 'students');
      
      results.tests.policies = {
        success: !policiesError,
        error: policiesError?.message || null,
        count: policies?.length || 0,
        policies: policies || []
      };
    } catch (error: any) {
      results.tests.policies = {
        success: false,
        error: error.message || 'Could not fetch policies'
      };
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
