import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({
        error: 'Missing Supabase configuration',
        config: {
          supabaseUrl: !!supabaseUrl,
          serviceRoleKey: !!supabaseServiceRoleKey
        }
      });
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false
      }
    });

    // Get all teachers to debug
    const { data: allTeachers, error: allError } = await supabase
      .from('teachers')
      .select('id, email, first_name, last_name, status')
      .limit(10);

    console.log('🔍 All teachers in database:', allTeachers);

    // Try to find specific teacher
    let specificTeacher = null;
    let specificError = null;

    if (userId || email) {
      let query = supabase
        .from('teachers')
        .select('*');

      if (userId) {
        query = query.eq('id', userId);
      } else if (email) {
        query = query.eq('email', email);
      }

      const { data, error } = await query.single();
      specificTeacher = data;
      specificError = error;
    }

    return NextResponse.json({
      debug: {
        searchParams: { userId, email },
        allTeachersCount: allTeachers?.length || 0,
        allTeachers: allTeachers?.slice(0, 5), // Show first 5
        specificTeacher,
        specificError: specificError ? {
          code: specificError.code,
          message: specificError.message
        } : null,
        config: {
          supabaseUrl: supabaseUrl?.substring(0, 30) + '...',
          hasServiceRoleKey: !!supabaseServiceRoleKey
        }
      }
    });

  } catch (error: any) {
    console.error('Debug teacher profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
