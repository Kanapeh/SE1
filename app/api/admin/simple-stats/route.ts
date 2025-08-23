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
    const stats: any = {};

    // Try to get basic counts with error handling
    try {
      // Count teachers - try different table names
      try {
        const { count: teachersCount } = await supabase
          .from('teachers')
          .select('id', { count: 'exact', head: true });
        stats.teachers = teachersCount || 0;
      } catch {
        try {
          const { data: teachersInAuth } = await supabase
            .from('"auth-users"')
            .select('id')
            .eq('role', 'teacher');
          stats.teachers = teachersInAuth?.length || 0;
        } catch {
          stats.teachers = 0;
        }
      }

      // Count students - try different table names
      try {
        const { count: studentsCount } = await supabase
          .from('students')
          .select('id', { count: 'exact', head: true });
        stats.students = studentsCount || 0;
      } catch {
        try {
          const { data: studentsInAuth } = await supabase
            .from('"auth-users"')
            .select('id')
            .eq('role', 'student');
          stats.students = studentsInAuth?.length || 0;
        } catch {
          stats.students = 0;
        }
      }

      // Count blog posts - try different table names
      try {
        const { count: blogCount } = await supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true });
        stats.blogPosts = blogCount || 0;
      } catch {
        try {
          const { count: postsCount } = await supabase
            .from('posts')
            .select('id', { count: 'exact', head: true });
          stats.blogPosts = postsCount || 0;
        } catch {
          stats.blogPosts = 0;
        }
      }

      // Count courses
      try {
        const { count: coursesCount } = await supabase
          .from('coursesstudents')
          .select('id', { count: 'exact', head: true });
        stats.courses = coursesCount || 0;
      } catch {
        stats.courses = 0;
      }

      // Count requests
      try {
        const { count: requestsCount } = await supabase
          .from('requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');
        stats.pendingRequests = requestsCount || 0;
      } catch {
        stats.pendingRequests = 0;
      }

      // Count comments
      try {
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');
        stats.pendingComments = commentsCount || 0;
      } catch {
        stats.pendingComments = 0;
      }

      // Count total users
      try {
        const { count: usersCount } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true });
        stats.totalUsers = usersCount || 0;
      } catch {
        try {
          const { count: authUsersCount } = await supabase
            .from('"auth-users"')
            .select('id', { count: 'exact', head: true });
          stats.totalUsers = authUsersCount || 0;
        } catch {
          stats.totalUsers = 0;
        }
      }

    } catch (error) {
      console.error('Error getting stats:', error);
      // Provide fallback data
      stats.teachers = 0;
      stats.students = 0;
      stats.blogPosts = 0;
      stats.courses = 0;
      stats.pendingRequests = 0;
      stats.pendingComments = 0;
      stats.totalUsers = 0;
    }

    // Calculate total users if not set
    if (!stats.totalUsers) {
      stats.totalUsers = (stats.teachers || 0) + (stats.students || 0);
    }

    // Format the response
    const response = {
      overview: {
        totalUsers: stats.totalUsers,
        totalStudents: stats.students,
        totalTeachers: stats.teachers,
        totalCourses: stats.courses,
        totalBlogPosts: stats.blogPosts,
        pendingRequests: stats.pendingRequests,
        pendingComments: stats.pendingComments
      },
      quickStats: [
        {
          title: 'کل کاربران',
          value: stats.totalUsers.toLocaleString('fa-IR'),
          change: '+0%',
          changeType: 'neutral',
          icon: 'Users',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        },
        {
          title: 'دوره‌های فعال',
          value: stats.courses.toLocaleString('fa-IR'),
          change: '+0',
          changeType: 'neutral',
          icon: 'BookOpen',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        },
        {
          title: 'درآمد ماهانه',
          value: '₺0',
          change: '+0%',
          changeType: 'neutral',
          icon: 'DollarSign',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        },
        {
          title: 'نظرات جدید',
          value: stats.pendingComments.toLocaleString('fa-IR'),
          change: '+0',
          changeType: 'neutral',
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
          stats: `${stats.teachers}+ معلم فعال`
        },
        {
          title: 'مدیریت دانش‌آموزان',
          description: 'مشاهده و مدیریت دانش‌آموزان',
          href: '/admin/students',
          icon: 'Users',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          stats: `${stats.students}+ دانش‌آموز`
        },
        {
          title: 'مدیریت دوره‌ها',
          description: 'ایجاد و مدیریت دوره‌های آموزشی',
          href: '/admin/courses',
          icon: 'BookOpen',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          stats: `${stats.courses}+ دوره فعال`
        },
        {
          title: 'مدیریت وبلاگ',
          description: 'نوشتن و مدیریت مقالات',
          href: '/admin/blog',
          icon: 'FileText',
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
          borderColor: 'border-orange-200',
          stats: `${stats.blogPosts}+ مقاله`
        },
        {
          title: 'درخواست‌ها',
          description: 'بررسی درخواست‌های ثبت‌نام',
          href: '/admin/requests',
          icon: 'MessageSquare',
          color: 'from-indigo-500 to-blue-500',
          bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
          borderColor: 'border-indigo-200',
          stats: `${stats.pendingRequests} درخواست جدید`
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
          stats: `${stats.pendingComments}+ نظر جدید`
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

    // Don't log sensitive data
    console.log('Stats generated successfully');
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in simple stats API:', error);
    
    // Return fallback data even on complete failure
    return NextResponse.json({
      overview: {
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalBlogPosts: 0,
        pendingRequests: 0,
        pendingComments: 0
      },
      quickStats: [
        {
          title: 'کل کاربران',
          value: '0',
          change: '+0%',
          changeType: 'neutral',
          icon: 'Users',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        },
        {
          title: 'دوره‌های فعال',
          value: '0',
          change: '+0',
          changeType: 'neutral',
          icon: 'BookOpen',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        },
        {
          title: 'درآمد ماهانه',
          value: '₺0',
          change: '+0%',
          changeType: 'neutral',
          icon: 'DollarSign',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        },
        {
          title: 'نظرات جدید',
          value: '0',
          change: '+0',
          changeType: 'neutral',
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
          stats: '0+ معلم فعال'
        },
        {
          title: 'مدیریت دانش‌آموزان',
          description: 'مشاهده و مدیریت دانش‌آموزان',
          href: '/admin/students',
          icon: 'Users',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          stats: '0+ دانش‌آموز'
        },
        {
          title: 'مدیریت دوره‌ها',
          description: 'ایجاد و مدیریت دوره‌های آموزشی',
          href: '/admin/courses',
          icon: 'BookOpen',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          stats: '0+ دوره فعال'
        },
        {
          title: 'مدیریت وبلاگ',
          description: 'نوشتن و مدیریت مقالات',
          href: '/admin/blog',
          icon: 'FileText',
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
          borderColor: 'border-orange-200',
          stats: '0+ مقاله'
        },
        {
          title: 'درخواست‌ها',
          description: 'بررسی درخواست‌های ثبت‌نام',
          href: '/admin/requests',
          icon: 'MessageSquare',
          color: 'from-indigo-500 to-blue-500',
          bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
          borderColor: 'border-indigo-200',
          stats: '0 درخواست جدید'
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
          stats: '0+ نظر جدید'
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
    });
  }
}
