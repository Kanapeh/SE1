import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAdminAccess() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      redirect('/login');
    }

    // Check if user exists in admins table
    const { data: adminProfile, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminProfile) {
      redirect('/dashboard');
    }

    return { user, adminProfile };
  } catch (error) {
    console.error('Error checking admin access:', error);
    redirect('/login');
  }
}

// Client-side version that doesn't use redirect
export async function checkAdminAccessClient(supabase: any) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { user: null, adminProfile: null, error: 'No user found' };
    }

    // Check if user exists in admins table
    const { data: adminProfile, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminProfile) {
      // Also check auth-users table
      const { data: authUserData, error: authUserError } = await supabase
        .from('auth-users')
        .select('id, role, is_admin')
        .eq('id', user.id)
        .single();

      if (authUserError) {
        console.error('Auth-users check error:', authUserError);
      }

      if (authUserData && (authUserData.role === 'admin' || authUserData.is_admin === true)) {
        return { user, adminProfile: { ...authUserData, is_admin: true }, error: null };
      }

      return { user, adminProfile: null, error: 'Not admin' };
    }

    return { user, adminProfile, error: null };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return { user: null, adminProfile: null, error: 'Unexpected error' };
  }
}

// New function for client-side admin access checking
export async function checkAdminAccessClientSafe(supabase: any) {
  try {
    console.log("🔐 Checking admin access...");
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log("❌ No user found");
      return { 
        isAdmin: false, 
        user: null, 
        adminProfile: null, 
        error: 'No user found',
        shouldRedirect: '/login'
      };
    }

    console.log("✅ User found:", user.email);

    // Check if user exists in admins table
    const { data: adminProfile, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError) {
      console.log("❌ Admin table error:", adminError.message);
    }

    if (adminProfile) {
      console.log("✅ Admin access confirmed via admins table");
      return { 
        isAdmin: true, 
        user, 
        adminProfile, 
        error: null,
        shouldRedirect: null
      };
    }

    // Also check auth-users table
    const { data: authUserData, error: authUserError } = await supabase
      .from('auth-users')
      .select('id, role, is_admin')
      .eq('id', user.id)
      .single();

    if (authUserError) {
      console.log("❌ Auth-users check error:", authUserError.message);
    }

    if (authUserData && (authUserData.role === 'admin' || authUserData.is_admin === true)) {
      console.log("✅ Admin access confirmed via auth-users table");
      return { 
        isAdmin: true, 
        user, 
        adminProfile: { ...authUserData, is_admin: true }, 
        error: null,
        shouldRedirect: null
      };
    }

    console.log("❌ User is not admin");
    return { 
      isAdmin: false, 
      user, 
      adminProfile: null, 
      error: 'Not admin',
      shouldRedirect: '/dashboard'
    };

  } catch (error) {
    console.error('❌ Error checking admin access:', error);
    return { 
      isAdmin: false, 
      user: null, 
      adminProfile: null, 
      error: 'Unexpected error',
      shouldRedirect: '/login'
    };
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserRole(userId: string) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // First check if user is admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (adminData) {
      return adminData.role || 'admin';
    }

    // If not admin, check auth-users table for other roles
    const { data: userData } = await supabase
      .from('auth-users')
      .select('role')
      .eq('id', userId)
      .single();

    return userData?.role || 'student';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'student';
  }
}

export async function isUserAdmin(userId: string) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    return !error && data !== null;
  } catch (error) {
    console.error('Error checking if user is admin:', error);
    return false;
  }
}

export async function getAdminProfile(userId: string) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting admin profile:', error);
    return null;
  }
}