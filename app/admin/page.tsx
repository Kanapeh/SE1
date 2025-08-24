"use client";

import { useEffect, useState, useCallback } from "react";
import { Request } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  FileText, 
  Settings, 
  GraduationCap, 
  MessageSquare, 
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  Calendar,
  Star,
  Award,
  Target,
  Zap,
  Loader2
} from "lucide-react";

interface AdminStats {
  overview: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalBlogPosts: number;
    pendingRequests: number;
    pendingComments: number;
  };
  quickStats: Array<{
    title: string;
    value: string;
    change: string;
    changeType: string;
    icon: string;
    color: string;
    bgColor: string;
  }>;
  sections: Array<{
    title: string;
    description: string;
    href: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
    stats: string;
  }>;
}

const iconMap = {
  Users,
  BookOpen,
  DollarSign,
  FileText,
  Settings,
  GraduationCap,
  MessageSquare,
  Star
};

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAccess();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  // Add fetchStats to useCallback to prevent infinite re-renders
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      const response = await fetch('/api/admin/simple-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStatsError('خطا در بارگذاری آمار');
      
      // Fallback to default data in case of error
      setStats({
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
    } finally {
      setStatsLoading(false);
    }
  }, []);



  // Show loading state while checking admin access
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">در حال بررسی دسترسی...</h3>
          <p className="text-gray-500">لطفاً صبر کنید</p>
        </div>
      </div>
    );
  }

  // If not admin, this should not render (redirect should have happened)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              داشبورد مدیریت
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              خوش آمدید! مدیریت کامل سیستم آموزشی در دستان شماست
            </p>
          </div>
          
          {/* Time and Date */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {currentTime.toLocaleTimeString('fa-IR', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit' 
                })}
              </div>
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleDateString('fa-IR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Loading State */}
      {statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Error State */}
      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center">
            <div className="text-red-500 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">خطا در بارگذاری آمار</h3>
              <p className="text-red-600">{statsError}</p>
            </div>
            <button 
              onClick={fetchStats}
              className="mr-auto bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.quickStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <div key={stat.title} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 mr-1">از ماه گذشته</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    {IconComponent && <IconComponent className={`w-6 h-6 ${stat.color}`} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Sections Grid */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.sections.map((section, index) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap];
            return (
          <Link
            key={section.href}
            href={section.href}
                className="group"
              >
                <div className={`${section.bgColor} border-2 ${section.borderColor} rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group-hover:border-opacity-60`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mr-3 group-hover:text-gray-700 transition-colors">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {section.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 bg-white/60 px-3 py-1 rounded-full">
                      {section.stats}
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Sections Loading State */}
      {statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="animate-pulse">
            <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mr-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Info Section */}
      <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">سیستم مدیریت آکادمی زبان سِ وان</h3>
          </div>
          <p className="text-gray-600 mb-4">
            این پنل مدیریتی به شما امکان کنترل کامل بر تمام جنبه‌های سیستم آموزشی را می‌دهد
          </p>
          
          {/* Debug Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-yellow-800 font-semibold mb-2">🔍 بخش عیب‌یابی</h4>
                <p className="text-yellow-700 text-sm">
                  برای بررسی ساختار دیتابیس و رفع مشکل آمار صفر، روی دکمه‌های زیر کلیک کنید
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/check-database');
                      const data = await response.json();
                      console.log('Database check results:', data);
                      alert('نتایج بررسی دیتابیس در کنسول مرورگر نمایش داده شد. F12 را فشار دهید و Console را بررسی کنید.');
                    } catch (error) {
                      console.error('Error checking database:', error);
                      alert('خطا در بررسی دیتابیس');
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  بررسی دیتابیس
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/test-tables');
                      const data = await response.json();
                      console.log('Tables test results:', data);
                      alert('نتایج تست جداول در کنسول مرورگر نمایش داده شد. F12 را فشار دهید و Console را بررسی کنید.');
                    } catch (error) {
                      console.error('Error testing tables:', error);
                      alert('خطا در تست جداول');
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  تست جداول دیتابیس
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/setup-sample-data', { method: 'POST' });
                      const data = await response.json();
                      console.log('Sample data setup results:', data);
                      alert('داده‌های نمونه ایجاد شدند! حالا آمار داشبورد باید نمایش داده شود.');
                      // Refresh stats after creating sample data
                      fetchStats();
                    } catch (error) {
                      console.error('Error setting up sample data:', error);
                      alert('خطا در ایجاد داده‌های نمونه');
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  ایجاد داده‌های نمونه
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Activity className="w-4 h-4 text-green-500 mr-1" />
              سیستم پایدار و امن
            </span>
            <span className="flex items-center">
              <Zap className="w-4 h-4 text-yellow-500 mr-1" />
              عملکرد بهینه
            </span>
            <span className="flex items-center">
              <Target className="w-4 h-4 text-blue-500 mr-1" />
              مدیریت آسان
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
