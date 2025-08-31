import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get current user from auth
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        error: 'User not authenticated',
        userError: userError?.message
      }, { status: 401 });
    }

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({
        error: 'Missing Supabase configuration'
      }, { status: 500 });
    }

    // Create service role client
    const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false
      }
    });

    // Search for teacher by ID
    const { data: teacherById, error: teacherByIdError } = await supabaseService
      .from('teachers')
      .select('*')
      .eq('id', user.id)
      .single();

    // Search for teacher by email
    const { data: teacherByEmail, error: teacherByEmailError } = await supabaseService
      .from('teachers')
      .select('*')
      .eq('email', user.email)
      .single();

    // Get all teachers for comparison
    const { data: allTeachers } = await supabaseService
      .from('teachers')
      .select('id, email, first_name, last_name, status')
      .limit(10);

    return NextResponse.json({
      currentUser: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      },
      teacherLookup: {
        byId: {
          data: teacherById,
          error: teacherByIdError ? {
            code: teacherByIdError.code,
            message: teacherByIdError.message
          } : null
        },
        byEmail: {
          data: teacherByEmail,
          error: teacherByEmailError ? {
            code: teacherByEmailError.code,
            message: teacherByEmailError.message
          } : null
        }
      },
      allTeachers: allTeachers?.slice(0, 5),
      totalTeachers: allTeachers?.length || 0
    });

  } catch (error: any) {
    console.error('Current user debug API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
