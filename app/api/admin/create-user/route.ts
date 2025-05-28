import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, first_name, last_name, phone, language, level, class_type, preferred_time } = body;

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        phone,
        language,
        level,
        class_type,
        preferred_time
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user in public.users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          full_name: `${first_name} ${last_name}`,
          first_name,
          last_name,
          phone,
          language,
          level,
          class_type,
          preferred_time,
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_admin: false
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    return NextResponse.json({ user: userData });
  } catch (error: any) {
    console.error('Error in create-user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 