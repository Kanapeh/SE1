import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const email = searchParams.get('email');

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

  try {
    const debugInfo: any = {
      request: {
        userId,
        email,
        timestamp: new Date().toISOString()
      },
      environment: {
        supabaseUrl: supabaseUrl ? 'Set' : 'Not Set',
        serviceRoleKey: supabaseServiceRoleKey ? 'Set' : 'Not Set'
      }
    };

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('students')
      .select('count')
      .limit(1);

    debugInfo.connection = {
      success: !connectionError,
      error: connectionError?.message || null
    };

    // Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'students' })
      .catch(() => null);

    debugInfo.policies = {
      success: !policiesError,
      error: policiesError?.message || null,
      count: policies?.length || 0
    };

    // Try to find specific student
    if (userId || email) {
      let query = supabase.from('students').select('*');
      
      if (userId) {
        query = query.eq('id', userId);
      } else if (email) {
        query = query.eq('email', email);
      }

      const { data: studentData, error: studentError } = await query.single();

      debugInfo.studentQuery = {
        success: !studentError,
        error: studentError?.message || null,
        found: !!studentData,
        data: studentData ? {
          id: studentData.id,
          email: studentData.email,
          first_name: studentData.first_name,
          status: studentData.status
        } : null
      };
    }

    return NextResponse.json(debugInfo);
  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
