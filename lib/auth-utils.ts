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