import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function GET() {
  try {
    // Check admin access first
    const { error: adminError } = await checkAdminAccessAPI();
    if (adminError) {
      return adminError;
    }

    const supabase = createAdminClient();
    const results: any = {};

    // Test different table names and get counts
    const tableTests = [
      { name: 'students', query: () => supabase.from('students').select('id', { count: 'exact', head: true }) },
      { name: 'teachers', query: () => supabase.from('teachers').select('id', { count: 'exact', head: true }) },
      { name: 'blog_posts', query: () => supabase.from('blog_posts').select('id', { count: 'exact', head: true }) },
      { name: 'posts', query: () => supabase.from('posts').select('id', { count: 'exact', head: true }) },
      { name: 'auth-users', query: () => supabase.from('"auth-users"').select('id', { count: 'exact', head: true }) },
      { name: 'users', query: () => supabase.from('users').select('id', { count: 'exact', head: true }) },
      { name: 'coursesstudents', query: () => supabase.from('coursesstudents').select('id', { count: 'exact', head: true }) },
      { name: 'requests', query: () => supabase.from('requests').select('id', { count: 'exact', head: true }) },
      { name: 'comments', query: () => supabase.from('comments').select('id', { count: 'exact', head: true }) }
    ];

    for (const tableTest of tableTests) {
      try {
        const { data, error, count } = await tableTest.query();
        results[tableTest.name] = {
          exists: true,
          count: count || 0,
          error: error ? error.message : null
        };
      } catch (err: any) {
        results[tableTest.name] = {
          exists: false,
          count: 0,
          error: err.message
        };
      }
    }

    // Also check for teachers and students in auth-users table
    try {
      const { data: teachersInAuth, error: teachersError } = await supabase
        .from('"auth-users"')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'teacher');

      const { data: studentsInAuth, error: studentsError } = await supabase
        .from('"auth-users"')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'student');

      results['auth-users_teachers'] = {
        exists: true,
        count: teachersInAuth?.length || 0,
        error: teachersError ? teachersError.message : null
      };

      results['auth-users_students'] = {
        exists: true,
        count: studentsInAuth?.length || 0,
        error: studentsError ? studentsError.message : null
      };
    } catch (err: any) {
      results['auth-users_teachers'] = { exists: false, count: 0, error: err.message };
      results['auth-users_students'] = { exists: false, count: 0, error: err.message };
    }

    return NextResponse.json({
      message: 'Table test completed',
      results: {
        // Only expose table existence and counts, not detailed error messages
        tables: Object.keys(results).reduce((acc: any, key: string) => {
          acc[key] = {
            exists: results[key].exists,
            count: results[key].count
            // Don't expose error details for security
          };
          return acc;
        }, {}),
        summary: {
          totalTables: Object.keys(results).length,
          existingTables: Object.keys(results).filter(key => results[key].exists).length,
          totalRecords: Object.keys(results).reduce((sum, key) => sum + (results[key].count || 0), 0)
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error testing tables:', error);
    return NextResponse.json(
      { error: 'خطا در تست جداول', details: error.message },
      { status: 500 }
    );
  }
}
