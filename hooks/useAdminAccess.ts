import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function useAdminAccess() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        console.log('🔍 useAdminAccess: Starting admin access check...');
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.log('❌ useAdminAccess: No authenticated user');
          router.push('/login');
          return;
        }

        console.log('🔍 useAdminAccess: User authenticated:', user.id, user.email);

        // Check if user exists in admins table
        console.log('🔍 useAdminAccess: Checking admins table...');
        const { data: adminProfile, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error('❌ useAdminAccess: Admin table check error:', adminError);
        }

        if (adminProfile) {
          console.log('✅ useAdminAccess: User found in admins table:', adminProfile);
          setIsAdmin(true);
          setLoading(false);
          return;
        } else {
          console.log('ℹ️ useAdminAccess: User not found in admins table');
        }

        // Check if user has admin role in auth-users table
        console.log('🔍 useAdminAccess: Checking auth-users table...');
        const { data: authUserProfile, error: authUserError } = await supabase
          .from('auth-users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (authUserError && authUserError.code !== 'PGRST116') {
          console.error('❌ useAdminAccess: Auth-users table check error:', authUserError);
        }

        if (authUserProfile) {
          console.log('✅ useAdminAccess: User found in auth-users table:', authUserProfile);
          
          if (authUserProfile.role === 'admin' || authUserProfile.is_admin === true) {
            console.log('🎯 useAdminAccess: User is admin by role in auth-users table');
            setIsAdmin(true);
            setLoading(false);
            return;
          } else {
            console.log('ℹ️ useAdminAccess: User is not admin in auth-users table');
          }
        } else {
          console.log('ℹ️ useAdminAccess: User not found in auth-users table');
        }

        // Check if user is a teacher (they also get admin access)
        console.log('🔍 useAdminAccess: Checking teachers table...');
        const { data: teacherProfile, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (teacherError && teacherError.code !== 'PGRST116') {
          console.error('❌ useAdminAccess: Teachers table check error:', teacherError);
        }

        if (teacherProfile && teacherProfile.status === 'active') {
          console.log('🎯 useAdminAccess: User is active teacher, granting admin access');
          setIsAdmin(true);
          setLoading(false);
          return;
        } else if (teacherProfile) {
          console.log('⚠️ useAdminAccess: User is inactive teacher');
        } else {
          console.log('ℹ️ useAdminAccess: User not found in teachers table');
        }

        // User is not admin
        console.log('❌ useAdminAccess: User is not admin, redirecting to dashboard');
        setIsAdmin(false);
        router.push('/dashboard');
        
      } catch (error) {
        console.error('💥 useAdminAccess: Unexpected error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAdminAccess();
  }, [router]);

  return { isAdmin, loading };
}