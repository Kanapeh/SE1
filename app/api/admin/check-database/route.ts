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

    // Check blog_posts table
    try {
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false });

      results.blogPosts = {
        exists: true,
        count: blogPosts?.length || 0,
        posts: blogPosts || [],
        error: blogError?.message || null
      };
    } catch (err: any) {
      results.blogPosts = {
        exists: false,
        count: 0,
        posts: [],
        error: err.message
      };
    }

    // Check comments table
    try {
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('id, name, content, status, created_at, post_id')
        .order('created_at', { ascending: false });

      results.comments = {
        exists: true,
        count: comments?.length || 0,
        comments: comments || [],
        error: commentsError?.message || null
      };
    } catch (err: any) {
      results.comments = {
        exists: false,
        count: 0,
        comments: [],
        error: err.message
      };
    }

    // Check teachers table
    try {
      const { data: teachers, error: teachersError } = await supabase
        .from('teachers')
        .select('id, first_name, last_name, email, status')
        .order('created_at', { ascending: false });

      results.teachers = {
        exists: true,
        count: teachers?.length || 0,
        teachers: teachers || [],
        error: teachersError?.message || null
      };
    } catch (err: any) {
      results.teachers = {
        exists: false,
        count: 0,
        teachers: [],
        error: err.message
      };
    }

    // Check students table
    try {
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, first_name, last_name, email, status')
        .order('created_at', { ascending: false });

      results.students = {
        exists: true,
        count: students?.length || 0,
        students: students || [],
        error: studentsError?.message || null
      };
    } catch (err: any) {
      results.students = {
        exists: false,
        count: 0,
        students: [],
        error: err.message
      };
    }

    // Check auth-users table
    try {
      const { data: authUsers, error: authError } = await supabase
        .from('"auth-users"')
        .select('id, email, role, created_at');

      results.authUsers = {
        exists: true,
        count: authUsers?.length || 0,
        users: authUsers || [],
        error: authError?.message || null
      };

      // Count by role (only count, don't expose user details)
      if (authUsers) {
        const roleCounts = authUsers.reduce((acc: any, user: any) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        results.authUsers.roleCounts = roleCounts;
        // Don't expose actual user data for security
        results.authUsers.users = [];
      }
    } catch (err: any) {
      results.authUsers = {
        exists: false,
        count: 0,
        users: [],
        error: err.message
      };
    }

    // Check courses table
    try {
      const { data: courses, error: coursesError } = await supabase
        .from('coursesstudents')
        .select('id, course_name, student_name, status, created_at')
        .order('created_at', { ascending: false });

      results.courses = {
        exists: true,
        count: courses?.length || 0,
        courses: courses || [],
        error: coursesError?.message || null
      };
    } catch (err: any) {
      results.courses = {
        exists: false,
        count: 0,
        courses: [],
        error: err.message
      };
    }

    // Check requests table
    try {
      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('id, first_name, last_name, email, status, created_at')
        .order('created_at', { ascending: false });

      results.requests = {
        exists: true,
        count: requests?.length || 0,
        requests: requests || [],
        error: requestsError?.message || null
      };
    } catch (err: any) {
      results.requests = {
        exists: false,
        count: 0,
        requests: [],
        error: err.message
      };
    }

    return NextResponse.json({
      message: 'Database check completed',
      results,
      summary: {
        totalBlogPosts: results.blogPosts?.count || 0,
        totalComments: results.comments?.count || 0,
        totalTeachers: results.teachers?.count || 0,
        totalStudents: results.students?.count || 0,
        totalCourses: results.courses?.count || 0,
        totalRequests: results.requests?.count || 0,
        totalUsers: results.authUsers?.count || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in database check:', error);
    return NextResponse.json(
      { error: 'خطا در بررسی دیتابیس', details: error.message },
      { status: 500 }
    );
  }
}
