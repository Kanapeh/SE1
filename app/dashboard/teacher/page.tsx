'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHero from '@/components/dashboard/DashboardHero';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import WalletCard from '@/components/WalletCard';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock, 
  DollarSign,
  MessageCircle,
  Sparkles,
  Star, 
  Target,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
}

interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  hourly_rate: number | null;
  location: string | null;
  experience_years: number | null;
  languages: string[];
  status: string;
  available_days?: string[] | null;
  available_hours?: string[] | null;
  average_rating?: number | null;
}

interface Booking {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  status: string;
  session_type: string;
  duration: number;
  total_price: number;
  selected_days: string[];
  selected_hours: string[];
  created_at: string;
  notes: string | null;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'booking' | 'payment' | 'message';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface Earnings {
  monthlyEarnings: number;
  totalEarnings: number;
  currentBalance: number;
  pendingPayouts?: number;
}

interface TeacherAnalytics {
  activeStudents: number;
  totalStudents: number;
  completionRate: number;
  averageRating: number;
  monthlyGrowth: number;
  confirmedClasses: number;
  pendingRequests: number;
  upcomingClasses: number;
}

const statusBadgeStyle: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-slate-200 text-slate-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const statusLabelMap: Record<string, string> = {
  confirmed: 'تایید شده',
  scheduled: 'برنامه‌ریزی شده',
  completed: 'تکمیل شده',
  pending: 'در انتظار',
  cancelled: 'لغو شده',
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialise = async () => {
      try {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push('/login');
          return;
        }

        const userInfo: User = { id: user.id, email: user.email || '' };
        setCurrentUser(userInfo);

        const profileResponse = await fetch(`/api/teacher-profile?user_id=${user.id}&email=${user.email}`);
        if (!profileResponse.ok) {
              router.push('/register');
              return;
        }

        const { teacher } = await profileResponse.json();
        if (!teacher || (teacher.status !== 'active' && teacher.status !== 'Approved')) {
            router.push('/register?error=not_approved');
            return;
          }
          
        setTeacherProfile(teacher);

        const bookingsResponse = await fetch(`/api/bookings?teacher_id=${teacher.id}`);
        const bookingsJson = await bookingsResponse.json();
        setBookings(bookingsJson.bookings || []);

        const notificationsResponse = await fetch(`/api/notifications?teacher_id=${teacher.id}`);
        const notificationsJson = await notificationsResponse.json();
        setNotifications(notificationsJson.notifications || []);

        const earningsResponse = await fetch(`/api/teacher-earnings?teacher_id=${teacher.id}`);
        const earningsJson = await earningsResponse.json();
        if (earningsResponse.ok) {
          setEarnings({
            monthlyEarnings: earningsJson.monthlyEarnings || 0,
            totalEarnings: earningsJson.totalEarnings || 0,
            currentBalance: earningsJson.currentBalance || 0,
            pendingPayouts: earningsJson.pendingPayouts || 0,
          });
        } else {
          setEarnings({ monthlyEarnings: 0, totalEarnings: 0, currentBalance: 0 });
        }
      } catch (error) {
        console.error('Teacher dashboard initialisation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initialise();
  }, [router]);

  const analytics: TeacherAnalytics | null = useMemo(() => {
    if (!teacherProfile) return null;

    const totalStudents = new Set(bookings.map((booking) => booking.student_id)).size;
    const activeStudents = bookings
      .filter((booking) => booking.status === 'confirmed' || booking.status === 'completed')
      .reduce((set, booking) => set.add(booking.student_id), new Set<string>())
      .size;

    const totalClasses = bookings.length;
    const completedClasses = bookings.filter((booking) => booking.status === 'completed').length;
    const confirmedClasses = bookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'scheduled').length;
    const pendingRequests = bookings.filter((booking) => booking.status === 'pending').length;
    const completionRate = totalClasses === 0 ? 0 : Math.round((completedClasses / totalClasses) * 100);
    const upcomingClasses = bookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'scheduled').length;

    return {
      activeStudents,
      totalStudents,
      completionRate,
      averageRating: teacherProfile.average_rating || 0,
      monthlyGrowth: Math.min(25, confirmedClasses * 4),
      confirmedClasses,
      pendingRequests,
      upcomingClasses,
    };
  }, [bookings, teacherProfile]);

  const statCards = useMemo(
    () =>
      analytics && earnings
        ? [
            {
              key: 'monthly-earnings',
              title: 'درآمد این ماه',
              value: `${earnings.monthlyEarnings.toLocaleString()} تومان`,
              description: `موجودی اکنون: ${earnings.currentBalance.toLocaleString()} تومان`,
              icon: <DollarSign className="h-5 w-5" />,
              accent: 'green' as const,
            },
            {
              key: 'active-students',
              title: 'دانش‌آموزان فعال',
              value: analytics.activeStudents,
              description: `کل دانش‌آموزان: ${analytics.totalStudents}`,
              icon: <Users className="h-5 w-5" />,
              accent: 'blue' as const,
            },
            {
              key: 'completion-rate',
              title: 'نرخ تکمیل کلاس',
              value: `${analytics.completionRate}%`,
              description: `${analytics.confirmedClasses} کلاس تایید شده`,
              icon: <Target className="h-5 w-5" />,
              accent: 'purple' as const,
            },
            {
              key: 'rating',
              title: 'میانگین امتیاز',
              value: analytics.averageRating ? analytics.averageRating.toFixed(1) : 'ـ',
              description: `${analytics.monthlyGrowth}% رشد این ماه`,
              icon: <Star className="h-5 w-5" />,
              accent: 'orange' as const,
            },
          ]
        : [],
    [analytics, earnings],
  );

  const upcomingClasses = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'confirmed' || booking.status === 'scheduled' || booking.status === 'pending')
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .slice(0, 4),
    [bookings],
  );

  const quickActions = [
    {
      label: 'مدیریت برنامه زمانی',
      description: 'روزها و ساعت‌های در دسترس خود را به‌روز کنید.',
      icon: <Calendar className="h-5 w-5 text-sky-500" />,
      onClick: () => router.push('/teachers/schedule'),
    },
    {
      label: 'گزارش درآمد',
      description: 'تاریخچه تراکنش‌ها و برداشت‌ها را ببینید.',
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
      onClick: () => router.push('/teachers/earnings'),
    },
    {
      label: 'به‌روزرسانی پروفایل',
      description: 'محتوای پروفایل و نمونه ویدئو را جذاب‌تر کنید.',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      onClick: () => router.push('/teachers/profile'),
    },
    {
      label: 'ارسال پیام به زبان‌آموزان',
      description: 'یادآوری کلاس یا ارسال تکلیف جدید.',
      icon: <MessageCircle className="h-5 w-5 text-indigo-500" />,
      onClick: () => router.push('/teachers/messages'),
    },
  ];

  const latestNotifications = notifications.slice(0, 5);

  const heroHighlights = useMemo(() => {
    if (!analytics || !earnings) return [];

    return [
      {
        label: 'موجودی قابل برداشت',
        value: (
          <span className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
              {earnings.currentBalance.toLocaleString()}
                    </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">تومان</span>
          </span>
        ),
        description: earnings.pendingPayouts
          ? `در انتظار واریز: ${earnings.pendingPayouts.toLocaleString()} تومان`
          : 'برداشت‌ها از 24 ساعت تا 48 ساعت انجام می‌شود',
      },
      {
        label: 'کلاس‌های هفته جاری',
        value: analytics.upcomingClasses,
        description: `${analytics.pendingRequests} درخواست در انتظار تایید`,
      },
      {
        label: 'امتیاز زبان‌آموزان',
        value: analytics.averageRating ? analytics.averageRating.toFixed(1) : 'ـ',
        description: analytics.averageRating ? 'امتیاز فوق‌العاده! همین روند را حفظ کنید.' : 'بعد از چند کلاس نخست مشخص می‌شود.',
      },
    ];
  }, [analytics, earnings]);

  const primaryAction = (
              <Button 
      size="lg"
      className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300"
                onClick={() => router.push('/teachers/schedule')} 
              >
      <Calendar className="h-5 w-5" />
      برنامه‌ریزی کلاس‌ها
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Button>
  );

  const secondaryAction = (
                    <Button 
      variant='outline'
      size='lg'
      className='rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600'
      onClick={() => router.push('/teachers/earnings')}
    >
      مشاهده گزارش مالی
                    </Button>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
              </div>
    );
  }

  if (!teacherProfile || !analytics || !earnings || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md border-none bg-white/90 p-8 shadow-2xl backdrop-blur dark:bg-slate-900/80">
          <CardContent className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-900/40">
              <Bell className="h-8 w-8" />
                    </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">پروفایل معلم تکمیل نیست</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              برای دسترسی به داشبورد، ابتدا ثبت‌نام خود را تکمیل و تایید منتظر بمانید.
            </p>
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white" onClick={() => router.push('/register')}>
              تکمیل اطلاعات
                        </Button>
            </CardContent>
          </Card>
                  </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 pb-12 pt-10 md:pt-16">
        <DashboardHero
          className="mb-8"
          title={`سلام ${teacherProfile.first_name}! کلاس‌هایت آماده‌اند`}
          subtitle="وضعیت زبان‌آموزان، درآمدها و درخواست‌های جدید را همین‌جا ببینید. مدیریت زمان‌بندی و ارتباط با زبان‌آموزان تنها چند کلیک فاصله دارد."
          badge={
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-xs font-medium text-white dark:bg-white/10">
              <Users className="h-4 w-4 text-sky-300" />
              {analytics.activeStudents} زبان‌آموز فعال
              <span className="hidden sm:inline text-white/70">• {teacherProfile.languages.join('، ')}</span>
                  </div>
          }
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          highlights={heroHighlights}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <DashboardStatCard
              key={card.key}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              accent={card.accent}
            />
          ))}
                  </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-none bg-white/90 shadow-xl dark:bg-slate-900/80">
                <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg font-semibold text-slate-900 dark:text-white">
                <span>اقدامات فوری</span>
                <span className="text-xs text-slate-400">برای حرفه‌ای ماندن، این موارد را بررسی کنید</span>
                  </CardTitle>
                </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80"
                  type="button"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">{action.icon}</span>
                  <span className="space-y-1">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">{action.label}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-300">{action.description}</span>
                  </span>
                </button>
              ))}
                </CardContent>
              </Card>

          <Card className="border-none bg-white/90 shadow-xl dark:bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">اعلان‌های اخیر</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-300">آخرین پیام‌ها، پرداخت‌ها و رزروها</p>
                    </div>
              <Badge variant="outline" className="rounded-full border-indigo-200 bg-indigo-50 text-xs text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-200">
                {notifications.filter((n) => !n.read).length} جدید
              </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
              {latestNotifications.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-800/70 dark:text-slate-300">
                  هنوز پیامی دریافت نکرده‌اید.
                  </div>
                ) : (
                latestNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70 ${
                      notification.read ? '' : 'shadow-md shadow-indigo-100 dark:shadow-none'
                    }`}
                  >
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      {notification.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : notification.type === 'warning' ? (
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      ) : notification.type === 'error' ? (
                        <Bell className="h-5 w-5 text-rose-500" />
                      ) : notification.type === 'payment' ? (
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                      ) : notification.type === 'message' ? (
                        <MessageCircle className="h-5 w-5 text-indigo-500" />
                      ) : (
                        <Activity className="h-5 w-5 text-sky-500" />
                      )}
                </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">{notification.message}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(notification.created_at).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>
                ))
                )}
              </CardContent>
            </Card>
                          </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr,1.15fr]">
          <Card className="border-none bg-white/90 shadow-xl dark:bg-slate-900/80">
                <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">کیف پول و گزارش مالی</CardTitle>
                </CardHeader>
            <CardContent className="space-y-4">
              <WalletCard
                userType="teacher"
                userId={currentUser.id}
                className="border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg"
              />
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white/90 p-3 text-slate-500 shadow-sm dark:bg-slate-800/70 dark:text-slate-300">
                  <span className="block text-[11px] font-medium text-slate-400">درآمد کل</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {earnings.totalEarnings.toLocaleString()} تومان
                  </span>
                        </div>
                <div className="rounded-xl bg-white/90 p-3 text-slate-500 shadow-sm dark:bg-slate-800/70 dark:text-slate-300">
                  <span className="block text-[11px] font-medium text-slate-400">در انتظار واریز</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {(earnings.pendingPayouts || 0).toLocaleString()} تومان
                          </span>
                        </div>
                  </div>
                </CardContent>
              </Card>

          <Card className="border-none bg-white/90 shadow-xl dark:bg-slate-900/80">
              <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">بینش‌های آموزشی</CardTitle>
              </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  رشد ماهانه
                      </div>
                <p>رشد {analytics.monthlyGrowth}% نسبت به ماه گذشته ثبت شده است. برنامه‌ریزی منظم کلاس‌ها این روند را تقویت می‌کند.</p>
                        </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Activity className="h-4 w-4 text-sky-500" />
                  وضعیت پاسخ‌گویی
                      </div>
                <p>
                  {analytics.pendingRequests === 0
                    ? 'همه درخواست‌های زبان‌آموزان پاسخ داده شده است. همین روند را حفظ کنید!'
                    : `شما ${analytics.pendingRequests} درخواست در انتظار تایید دارید. پاسخ سریع‌تر اعتماد بیشتری ایجاد می‌کند.`}
                </p>
                    </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                  <BookOpen className="h-4 w-4 text-violet-500" />
                  زمان‌های محبوب
                    </div>
                <p>
                  زبان‌آموزان بیشترین رزرو را برای{' '}
                  {teacherProfile.available_hours?.length ? teacherProfile.available_hours[0] : 'بازه زمانی عصر'} ثبت کرده‌اند. این بازه را باز نگه
                  دارید.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  فرصت ویژه
                </div>
                <p>زبان‌آموزان جدید به دنبال کلاس آزمایشی هستند. پیشنهاد ویژه جلسه اول را فعال کنید تا سریع‌تر رزرو شوید.</p>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
} 

