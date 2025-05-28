import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { email, password, role } = await request.json();

    // Create user in Supabase
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
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

    // Insert user data into users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: userData.user.id,
          email: email,
          role: role || 'student',
          created_at: new Date().toISOString(),
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