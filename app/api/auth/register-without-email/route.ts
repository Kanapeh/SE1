import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API برای ثبت‌نام بدون نیاز به تایید ایمیل
 * این endpoint از Admin API استفاده می‌کند
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, userType } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // استفاده از Admin API برای ایجاد کاربر بدون نیاز به تایید ایمیل
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // نیاز به Service Role Key
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // ایجاد کاربر با Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // تایید خودکار ایمیل
      user_metadata: {
        full_name: fullName,
        user_type: userType || 'student',
      }
    });

    if (authError) {
      console.error('Admin API error:', authError);
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'User creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: authData.user,
        message: 'User created successfully without email confirmation'
      }
    });

  } catch (error: any) {
    console.error('Error in register-without-email API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

