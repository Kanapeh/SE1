import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function checkAdminAccessAPI() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        error: NextResponse.json(
          { error: 'Unauthorized - Please login' },
          { status: 401 }
        ),
        user: null
      };
    }

    // Check if user exists in admins table
    const { data: adminProfile, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminProfile) {
      return {
        error: NextResponse.json(
          { error: 'Access denied - Admin role required' },
          { status: 403 }
        ),
        user: null
      };
    }

    return { error: null, user, adminProfile };
  } catch (error) {
    console.error('Error checking admin access in API:', error);
    return {
      error: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
      user: null
    };
  }
}

export async function checkUserAccessAPI() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        error: NextResponse.json(
          { error: 'Unauthorized - Please login' },
          { status: 401 }
        ),
        user: null
      };
    }

    return { error: null, user };
  } catch (error) {
    console.error('Error checking user access in API:', error);
    return {
      error: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
      user: null
    };
  }
}