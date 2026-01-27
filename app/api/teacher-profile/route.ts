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
      // Use id column (which references auth.users.id)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, ...teacherData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
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

    console.log('🔍 Creating teacher profile:', { id, email });

    // Check if teacher already exists
    const { data: existingTeacher, error: checkError } = await supabase
      .from('teachers')
      .select('id')
      .eq('id', id)
      .single();

    if (existingTeacher) {
      console.log('⚠️ Teacher already exists, updating instead');
      // Teacher exists, update instead
      const { data, error } = await supabase
        .from('teachers')
        .update({
          ...teacherData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating teacher profile:', error);
        return NextResponse.json(
          { error: 'Database error', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        teacher: data, 
        message: 'Profile updated successfully' 
      });
    }

    // Create new teacher profile
    const { data, error } = await supabase
      .from('teachers')
      .insert({
        id: id, // Use id instead of user_id
        email: email,
        ...teacherData,
        status: teacherData.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating teacher profile:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    console.log('✅ Teacher profile created successfully:', {
      id: data?.id,
      first_name: data?.first_name,
      last_name: data?.last_name
    });

    return NextResponse.json({ 
      teacher: data, 
      message: 'Profile created successfully' 
    });

  } catch (error: any) {
    console.error('Teacher profile create API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
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

    // Log update data without avatar to avoid cluttering console
    const { avatar: updateAvatar, ...updateDataWithoutAvatar } = updateData || {};
    console.log('🔍 Updating teacher profile:', { 
      id, 
      updateData: {
        ...updateDataWithoutAvatar,
        avatar: updateAvatar ? `[Avatar: ${updateAvatar.substring(0, 50)}... (${updateAvatar.length} chars)]` : 'No avatar update'
      }
    });

    console.log('🔍 Attempting to update teacher with ID:', id);
    console.log('🔍 Update data:', updateData);

    // First, let's check if the teacher exists and what the structure looks like
    const { data: existingTeacher, error: fetchError } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching existing teacher:', fetchError);
      return NextResponse.json(
        { 
          error: 'Teacher not found', 
          details: fetchError.message,
          code: fetchError.code
        },
        { status: 404 }
      );
    }

    // Log teacher data without avatar to avoid cluttering console
    const { avatar, ...teacherDataWithoutAvatar } = existingTeacher || {};
    console.log('🔍 Existing teacher data:', {
      ...teacherDataWithoutAvatar,
      avatar: avatar ? `[Avatar: ${avatar.substring(0, 50)}... (${avatar.length} chars)]` : 'No avatar'
    });

    let { data, error } = await supabase
      .from('teachers')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    // If update with 'id' fails, try with 'user_id' as fallback
    if (error && existingTeacher.user_id) {
      console.log('🔍 Retrying update with user_id:', existingTeacher.user_id);
      const retryResult = await supabase
        .from('teachers')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', existingTeacher.user_id)
        .select()
        .single();
      
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      console.error('❌ Error updating teacher profile:', {
        error: error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { 
          error: 'Database error', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('✅ Teacher profile updated successfully:', {
      id: data?.id,
      first_name: data?.first_name,
      last_name: data?.last_name,
      experience_years: data?.experience_years
    });

    return NextResponse.json({ 
      teacher: data, 
      message: 'Profile updated successfully' 
    });

  } catch (error: any) {
    console.error('Teacher profile update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
