import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    // Check admin access first
    const { error: adminError, user } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const { email, password, role, first_name, last_name, phone } = await request.json();

    // Create user in Supabase
    const { data: userData, error: userError } = await createRouteHandlerClient({ cookies }).auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userError) {
      console.error("Error creating user:", userError);
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    // Insert user data into auth-users table
    const { error: profileError } = await createRouteHandlerClient({ cookies })
      .from('auth-users')
      .insert([
        {
          id: userData.user.id,
          email: email,
          role: role || 'student',
          is_admin: role === 'admin',
          first_name: first_name || null,
          last_name: last_name || null,
          phone: phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      user: userData.user,
    });
  } catch (error) {
    console.error("Error in create-user route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 