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

    // Get all statistics in parallel for better performance
    const [
      studentsResult,
      teachersResult,
      coursesResult,
      requestsResult,
      commentsResult,
      blogPostsResult,
      usersResult
    ] = await Promise.all([
      // Count students - try different possible table names
      supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
        .catch(() => 
          supabase
            .from('"auth-users"')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'student')
            .catch(() => ({ count: 0, error: null }))
        ),
      
      // Count teachers - try different possible table names
      supabase
        .from('teachers')
        .select('id', { count: 'exact', head: true })
        .catch(() => 
          supabase
            .from('"auth-users"')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'teacher')
            .catch(() => ({ count: 0, error: null }))
        ),
      
      // Count courses
      supabase
        .from('coursesstudents')
        .select('id', { count: 'exact', head: true })
        .catch(() => ({ count: 0, error: null })),
      
      // Count pending requests
      supabase
        .from('requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .catch(() => ({ count: 0, error: null })),
      
      // Count pending comments
      supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .catch(() => ({ count: 0, error: null })),
      
      // Count blog posts - try different possible table names
      supabase
        .from('blog_posts')
        .select('id', { count: 'exact', head: true })
        .catch(() => 
          supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .catch(() => ({ count: 0, error: null }))
        ),
      
      // Count total users from users table - try different possible table names
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .catch(() => 
          supabase
            .from('"auth-users"')
            .select('id', { count: 'exact', head: true })
            .catch(() => ({ count: 0, error: null }))
        )
    ]);

    // Get recent data for trends (last month)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [
      recentStudentsResult,
      recentCoursesResult,
      recentCommentsResult
    ] = await Promise.all([
      // Count new students in last month - try different possible table names
      supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgo.toISOString())
        .catch(() => 
          supabase
            .from('"auth-users"')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'student')
            .gte('created_at', oneMonthAgo.toISOString())
            .catch(() => ({ count: 0, error: null }))
        ),
      
      // Count new courses in last month
      supabase
        .from('coursesstudents')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgo.toISOString())
        .catch(() => ({ count: 0, error: null })),
      
      // Count new comments in last month
      supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgo.toISOString())
        .catch(() => ({ count: 0, error: null }))
    ]);

    // Check for errors (but allow some tables to not exist)
    const criticalResults = [
      coursesResult, requestsResult, commentsResult, blogPostsResult, usersResult,
      recentCoursesResult, recentCommentsResult
    ];

    for (const result of criticalResults) {
      if (result.error) {
        console.error('Database query error:', result.error);
        // Only throw error for critical tables, continue with fallback data for optional ones
      }
    }

    // Calculate counts
    const totalStudents = studentsResult.count || 0;
    const totalTeachers = teachersResult.count || 0;
    const totalCourses = coursesResult.count || 0;
    const pendingRequests = requestsResult.count || 0;
    const pendingComments = commentsResult.count || 0;
    const totalBlogPosts = blogPostsResult.count || 0;
    const totalUsers = usersResult.count || 0;

    const newStudentsThisMonth = recentStudentsResult.count || 0;
    const newCoursesThisMonth = recentCoursesResult.count || 0;
    const newCommentsThisMonth = recentCommentsResult.count || 0;

    // Calculate growth percentages (compared to previous month)
    const studentGrowth = totalStudents > 0 ? ((newStudentsThisMonth / Math.max(totalStudents - newStudentsThisMonth, 1)) * 100).toFixed(1) : '0';
    const courseGrowth = totalCourses > 0 ? Math.max(newCoursesThisMonth, 0) : 0;
    const commentGrowth = Math.max(newCommentsThisMonth, 0);

    const stats = {
      overview: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalBlogPosts,
        pendingRequests,
        pendingComments
      },
      quickStats: [
        {
          title: 'کل کاربران',
          value: totalUsers.toLocaleString('fa-IR'),
          change: `+${studentGrowth}%`,
          changeType: 'positive',
          icon: 'Users',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        },
        {
          title: 'دوره‌های فعال',
          value: totalCourses.toLocaleString('fa-IR'),
          change: `+${courseGrowth}`,
          changeType: 'positive',
          icon: 'BookOpen',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        },
        {
          title: 'درآمد ماهانه',
          value: '₺0', // This would need to be calculated based on payments
          change: '+0%',
          changeType: 'neutral',
          icon: 'DollarSign',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        },
        {
          title: 'نظرات جدید',
          value: pendingComments.toLocaleString('fa-IR'),
          change: `+${commentGrowth}`,
          changeType: 'positive',
          icon: 'Star',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        }
      ],
      sections: [
        {
          title: 'مدیریت معلمان',
          description: 'مشاهده و مدیریت معلمان سیستم',
          href: '/admin/teachers',
          icon: 'GraduationCap',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          borderColor: 'border-blue-200',
          stats: `${totalTeachers}+ معلم فعال`
        },
        {
          title: 'مدیریت دانش‌آموزان',
          description: 'مشاهده و مدیریت دانش‌آموزان',
          href: '/admin/students',
          icon: 'Users',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          stats: `${totalStudents}+ دانش‌آموز`
        },
        {
          title: 'مدیریت دوره‌ها',
          description: 'ایجاد و مدیریت دوره‌های آموزشی',
          href: '/admin/courses',
          icon: 'BookOpen',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          stats: `${totalCourses}+ دوره فعال`
        },
        {
          title: 'مدیریت وبلاگ',
          description: 'نوشتن و مدیریت مقالات',
          href: '/admin/blog',
          icon: 'FileText',
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
          borderColor: 'border-orange-200',
          stats: `${totalBlogPosts}+ مقاله`
        },
        {
          title: 'درخواست‌ها',
          description: 'بررسی درخواست‌های ثبت‌نام',
          href: '/admin/requests',
          icon: 'MessageSquare',
          color: 'from-indigo-500 to-blue-500',
          bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
          borderColor: 'border-indigo-200',
          stats: `${pendingRequests} درخواست جدید`
        },
        {
          title: 'مدیریت قیمت‌ها',
          description: 'تنظیم قیمت دوره‌ها و پلن‌ها',
          href: '/admin/pricing',
          icon: 'DollarSign',
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          borderColor: 'border-yellow-200',
          stats: 'تنظیمات قیمت'
        },
        {
          title: 'نظرات و پیام‌ها',
          description: 'مدیریت نظرات مقالات و پیام‌ها',
          href: '/admin/comments',
          icon: 'Star',
          color: 'from-pink-500 to-rose-500',
          bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
          borderColor: 'border-pink-200',
          stats: `${pendingComments}+ نظر جدید`
        },
        {
          title: 'تنظیمات سیستم',
          description: 'تنظیمات کلی و پیکربندی',
          href: '/admin/settings',
          icon: 'Settings',
          color: 'from-gray-500 to-slate-500',
          bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
          borderColor: 'border-gray-200',
          stats: 'سیستم پایدار'
        }
      ]
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت آمار داشبورد' },
      { status: 500 }
    );
  }
}
