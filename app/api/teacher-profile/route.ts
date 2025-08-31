import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false
      }
    });

    console.log('🔍 Fetching teacher profile for:', { userId, email });

    let query = supabase
      .from('teachers')
      .select('*');

    if (userId) {
      query = query.eq('id', userId);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data: teacherData, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Teacher not found:', { userId, email });
        return NextResponse.json(
          { error: 'Teacher not found' },
          { status: 404 }
        );
      }
      
      console.error('❌ Teacher profile fetch error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Teacher profile found:', {
      id: teacherData?.id,
      email: teacherData?.email,
      first_name: teacherData?.first_name,
      last_name: teacherData?.last_name,
      status: teacherData?.status
    });

    return NextResponse.json({ teacher: teacherData });

  } catch (error: any) {
    console.error('Teacher profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
