import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Checking admin access and dashboard visibility...');
    
    // Create both admin and regular clients
    const adminSupabase = createAdminClient();
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      }
    };

    // Check current user
    try {
      const { data: { user }, error: authError } = await userSupabase.auth.getUser();
      diagnostics.currentUser = {
        exists: !!user,
        email: user?.email || 'No user',
        id: user?.id || 'No ID',
        error: authError?.message || null
      };
    } catch (error) {
      diagnostics.currentUser = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown auth error'
      };
    }

    // Check if admins table exists and user is admin
    try {
      const { data: adminData, error: adminError } = await adminSupabase
        .from('admins')
        .select('*')
        .limit(5);
      
      diagnostics.adminsTable = {
        exists: !adminError,
        error: adminError?.message || null,
        count: adminData?.length || 0,
        sample: adminData || []
      };

      // Check if current user is admin
      if (diagnostics.currentUser.id) {
        const { data: userAdmin, error: userAdminError } = await adminSupabase
          .from('admins')
          .select('*')
          .eq('user_id', diagnostics.currentUser.id)
          .single();
        
        diagnostics.currentUserAdmin = {
          isAdmin: !!userAdmin,
          data: userAdmin || null,
          error: userAdminError?.message || null
        };
      }
    } catch (error) {
      diagnostics.adminsTable = {
        exists: false,
        error: error instanceof Error ? error.message : 'Table check failed'
      };
    }

    // Check if teachers table exists
    try {
      const { data: teachersData, error: teachersError } = await adminSupabase
        .from('teachers')
        .select('id, email, first_name, last_name, status')
        .limit(5);
      
      diagnostics.teachersTable = {
        exists: !teachersError,
        error: teachersError?.message || null,
        count: teachersData?.length || 0,
        sample: teachersData || []
      };

      // Count teachers by status
      if (!teachersError && teachersData) {
        const { data: statusCount } = await adminSupabase
          .from('teachers')
          .select('status')
          .order('status');
        
        const statusBreakdown: any = {};
        statusCount?.forEach(teacher => {
          const status = teacher.status || 'null';
          statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
        });
        
        diagnostics.teachersTable.statusBreakdown = statusBreakdown;
      }
    } catch (error) {
      diagnostics.teachersTable = {
        exists: false,
        error: error instanceof Error ? error.message : 'Table check failed'
      };
    }

    // Test API endpoint
    try {
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/simple-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        diagnostics.statsAPI = {
          working: true,
          hasTeacherSection: !!statsData.sections?.find((s: any) => s.title === 'مدیریت معلمان'),
          sectionsCount: statsData.sections?.length || 0,
          data: statsData
        };
      } else {
        diagnostics.statsAPI = {
          working: false,
          status: statsResponse.status,
          statusText: statsResponse.statusText
        };
      }
    } catch (error) {
      diagnostics.statsAPI = {
        working: false,
        error: error instanceof Error ? error.message : 'API test failed'
      };
    }

    // Generate recommendations
    diagnostics.recommendations = [];

    if (!diagnostics.currentUser.exists) {
      diagnostics.recommendations.push('❌ شما وارد نشده‌اید. لطفاً ابتدا وارد شوید.');
    }

    if (!diagnostics.adminsTable.exists) {
      diagnostics.recommendations.push('❌ جدول admins وجود ندارد. اسکریپت setup_admin_teacher_access.sql را اجرا کنید.');
    }

    if (diagnostics.currentUser.exists && !diagnostics.currentUserAdmin?.isAdmin) {
      diagnostics.recommendations.push(`❌ کاربر ${diagnostics.currentUser.email} دسترسی ادمین ندارد. SQL زیر را اجرا کنید:
      
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT id, 'admin', ARRAY['all'], true
FROM auth.users 
WHERE email = '${diagnostics.currentUser.email}'
ON CONFLICT (user_id) DO UPDATE SET is_active = true;`);
    }

    if (!diagnostics.teachersTable.exists) {
      diagnostics.recommendations.push('❌ جدول teachers وجود ندارد. اسکریپت setup_admin_teacher_access.sql را اجرا کنید.');
    }

    if (!diagnostics.statsAPI.working) {
      diagnostics.recommendations.push('❌ API مدیریت کار نمی‌کند. متغیرهای محیطی را بررسی کنید.');
    }

    if (diagnostics.statsAPI.working && !diagnostics.statsAPI.hasTeacherSection) {
      diagnostics.recommendations.push('❌ بخش مدیریت معلمان در API وجود ندارد.');
    }

    if (diagnostics.recommendations.length === 0) {
      diagnostics.recommendations.push('✅ همه چیز درست به نظر می‌رسد. داشبورد ادمین باید مدیریت معلمان را نشان دهد.');
    }

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error in admin access check:', error);
    return NextResponse.json({
      error: 'Failed to check admin access',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
