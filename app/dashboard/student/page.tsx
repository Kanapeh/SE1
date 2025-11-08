'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHero from '@/components/dashboard/DashboardHero';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import TeacherSelectionModal from '@/components/TeacherSelectionModal';
import WalletCard from '@/components/WalletCard';
import StudentHeader from '@/components/StudentHeader';
import { supabase } from '@/lib/supabase';
import { getSmartOAuthRedirectUrl } from '@/lib/oauth-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Star,
  Users,
  Video,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  current_language_level?: string | null;
  preferred_languages?: string[] | null;
  status?: string;
  learning_goals?: string | null;
}

type SelectedTeacherInfo = {
  id: string;
  first_name: string;
  last_name: string;
  languages: string[];
  experience_years: number | null;
  avatar: string | null;
  hourly_rate: number | null;
};

interface Booking {
  id: string;
  created_at: string;
  status: string;
  session_type: string;
  duration: number;
  total_price: number;
  selected_days: string[];
  selected_hours: string[];
  notes: string | null;
  student_name?: string;
}

interface ProgressData {
  currentLevel: string;
  nextLevel: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  streak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Analytics {
  totalClasses: number;
  completedClasses: number;
  totalSpent: number;
  averageRating: number;
  thisMonthClasses: number;
  thisMonthSpent: number;
  favoriteTeacher: string;
  mostStudiedLanguage: string;
  studyTime: number;
  improvementRate: number;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const statusLabelMap: Record<string, string> = {
  completed: 'تکمیل شده',
  scheduled: 'برنامه‌ریزی شده',
  confirmed: 'تایید شده',
  pending: 'در انتظار',
  cancelled: 'لغو شده',
};

const statusBadgeStyle: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-sky-100 text-sky-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const dayNameMap: Record<string, string> = {
  monday: 'دوشنبه',
  tuesday: 'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday: 'پنج‌شنبه',
  friday: 'جمعه',
  saturday: 'شنبه',
  sunday: 'یکشنبه',
};

const hourNameMap: Record<string, string> = {
  morning: 'صبح',
  afternoon: 'ظهر',
  evening: 'عصر',
  night: 'شب',
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<SelectedTeacherInfo | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  useEffect(() => {
    const initialise = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          const loginUrl = await getSmartOAuthRedirectUrl('login');
          window.location.href = loginUrl;
          return;
        }

        const userInfo: User = {
          id: user.id,
          email: user.email || '',
        };
        setCurrentUser(userInfo);

        const savedTeacher = sessionStorage.getItem('selectedTeacher');
        if (savedTeacher) {
          try {
            setSelectedTeacher(JSON.parse(savedTeacher));
          } catch (storageError) {
            console.warn('Selected teacher parse error', storageError);
          }
        }

        const profileResponse = await fetch(`/api/student-profile?user_id=${user.id}&email=${user.email}`);
        if (!profileResponse.ok) {
          const profileUrl = await getSmartOAuthRedirectUrl('complete-profile?type=student');
          window.location.href = profileUrl;
          return;
        }

        const { student } = await profileResponse.json();
        const profile: Student = {
          id: student.id,
          first_name: student.first_name || 'زبان‌آموز',
          last_name: student.last_name || '',
          email: student.email,
          phone: student.phone,
          avatar: student.avatar,
          current_language_level: student.current_language_level,
          preferred_languages: student.preferred_languages,
          status: student.status,
          learning_goals: student.learning_goals,
        };
        setStudentProfile(profile);

        const basicProgress: ProgressData = {
          currentLevel: student.current_language_level || 'مبتدی',
          nextLevel: 'ابتدایی',
          progressPercentage: 0,
          completedLessons: 0,
          totalLessons: 0,
          streak: 0,
          weeklyGoal: 2,
          weeklyProgress: 0,
        };
        setProgress(basicProgress);

        const basicAnalytics: Analytics = {
          totalClasses: 0,
          completedClasses: 0,
          totalSpent: 0,
          averageRating: 0,
          thisMonthClasses: 0,
          thisMonthSpent: 0,
          favoriteTeacher: 'هنوز معلمی انتخاب نکرده‌اید',
          mostStudiedLanguage: profile.preferred_languages?.[0] || 'انگلیسی',
          studyTime: 0,
          improvementRate: 0,
        };
        setAnalytics(basicAnalytics);

        setNotifications([
          {
            id: 'welcome',
            type: 'info',
            title: 'خوش آمدید! 🎉',
            message: 'برای شروع یادگیری، یک معلم انتخاب کنید و اولین کلاس خود را رزرو کنید.',
            time: 'همین حالا',
            read: false,
          },
        ]);
      } catch (initialiseError) {
        console.error('Student dashboard initialisation failed:', initialiseError);
      }
    };

    initialise();
  }, []);

  useEffect(() => {
    if (!studentProfile) return;

    const fetchRecentBookings = async () => {
      try {
        const response = await supabase
          .from('bookings')
          .select('id, created_at, status, session_type, duration, total_price, selected_days, selected_hours, notes')
          .eq('student_id', studentProfile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (response.data) {
          setRecentBookings(response.data as Booking[]);
        }
      } catch (error) {
        console.error('Recent bookings fetch failed:', error);
      }
    };

    fetchRecentBookings();
  }, [studentProfile]);

  const weeklyProgressPercent = useMemo(() => {
    if (!progress) return 0;
    return progress.weeklyGoal === 0 ? 0 : Math.min(100, Math.round((progress.weeklyProgress / progress.weeklyGoal) * 100));
  }, [progress]);

  const heroHighlights = useMemo(() => {
    const level = progress?.currentLevel || 'مبتدی';
    const nextLevel = progress?.nextLevel || 'ابتدایی';

    return [
      {
        label: 'سطح فعلی',
        value: <span>{level}</span>,
        description: `هدف بعدی: ${nextLevel}`,
      },
      {
        label: 'پیشرفت هفتگی',
        value: (
          <div className="flex flex-col gap-2">
            <Progress value={weeklyProgressPercent} className="h-2 bg-slate-200">
              <span className="sr-only">Weekly progress {weeklyProgressPercent}%</span>
            </Progress>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {progress?.weeklyProgress || 0} از {progress?.weeklyGoal || 2} کلاس
            </span>
          </div>
        ),
      },
      {
        label: 'روزهای متوالی',
        value: (
          <span className="flex items-baseline gap-1">
            <span>{progress?.streak || 0}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">روز</span>
          </span>
        ),
        description: 'با حضور منظم امتیاز ویژه بگیرید',
      },
    ];
  }, [progress, weeklyProgressPercent]);

  const statCards = useMemo(
    () => [
      {
        key: 'completed',
        title: 'کلاس‌های تکمیل شده',
        value: analytics?.completedClasses || 0,
        description: analytics?.totalClasses
          ? `از ${analytics.totalClasses} کلاس`
          : 'هنوز کلاسی برگزار نشده است',
        icon: <CheckCircle className="h-5 w-5" />,
        accent: 'green' as const,
      },
      {
        key: 'level',
        title: 'سطح فعلی',
        value: progress?.currentLevel || 'مبتدی',
        description: `سطح بعدی: ${progress?.nextLevel || 'ابتدایی'}`,
        icon: <GraduationCap className="h-5 w-5" />,
        accent: 'blue' as const,
      },
      {
        key: 'rating',
        title: 'امتیاز مربیان',
        value: analytics?.averageRating ? analytics.averageRating.toFixed(1) : 'ـ',
        description: analytics?.averageRating ? 'میانگین امتیاز کلاس‌ها' : 'پس از چند کلاس تعیین می‌شود',
        icon: <Star className="h-5 w-5" />,
        accent: 'purple' as const,
      },
      {
        key: 'streak',
        title: 'روزهای متوالی',
        value: progress?.streak || 0,
        description: 'برای حفظ روند خود ادامه دهید',
        icon: <Activity className="h-5 w-5" />,
        accent: 'orange' as const,
      },
    ],
    [analytics, progress],
  );

  const quickActions = [
    {
      label: 'رزرو کلاس جدید',
      description: 'انتخاب معلم و تعیین زمان دلخواه',
      icon: <BookOpen className="h-5 w-5 text-sky-500" />,
      onClick: () => setShowTeacherModal(true),
    },
    {
      label: 'ورود به کلاس آنلاین',
      description: 'اگر کلاس فعال دارید اینجا وارد شوید',
      icon: <Video className="h-5 w-5 text-emerald-500" />,
      onClick: () => {
        if (studentProfile?.id) {
          router.push(`/students/${studentProfile.id}/video-call`);
        }
      },
    },
    {
      label: 'پیگیری پیشرفت',
      description: 'نمودار درس‌ها و امتیازات',
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      onClick: () => router.push('/students/progress'),
    },
    {
      label: 'مدیریت مالی',
      description: 'پرداخت‌ها و کیف پول',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      onClick: () => router.push('/students/payments'),
    },
  ];

  const upcomingClasses = recentBookings.slice(0, 3);
  const latestNotifications = notifications.slice(0, 4);

  const featureCards = [
    {
      title: 'مربی هوشمند',
      description: 'با هوش مصنوعی تمرین کنید و پیشنهاد دریافت کنید.',
      actionLabel: 'شروع چت',
      accent: 'from-indigo-500 to-purple-600',
      onClick: () => router.push('/students/ai-coach'),
    },
    {
      title: 'چالش هفته',
      description: 'با چالش‌های هفتگی امتیاز بگیرید و پاداش دریافت کنید.',
      actionLabel: 'مشاهده چالش‌ها',
      accent: 'from-emerald-500 to-teal-500',
      onClick: () => router.push('/students/gamification'),
    },
    {
      title: 'باشگاه مکالمه',
      description: 'جلسات گروهی برای مکالمه روان با موضوعات جذاب.',
      actionLabel: 'پیوستن به جلسه',
      accent: 'from-amber-500 to-pink-500',
      onClick: () => router.push('/community'),
    },
  ];

  const heroBadge = selectedTeacher ? (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-xs font-medium text-white dark:bg-white/10">
      <Users className="h-4 w-4 text-sky-300" />
      معلم منتخب: {selectedTeacher.first_name} {selectedTeacher.last_name}
      <span className="hidden sm:inline text-white/70">
        • {selectedTeacher.languages.join('، ')}
      </span>
    </div>
  ) : (
    <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-900/20 dark:text-sky-200">
      گام اول: انتخاب معلم
    </Badge>
  );

  const primaryAction = (
    <Button
      size="lg"
      className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300"
      onClick={() => setShowTeacherModal(true)}
    >
      <BookOpen className="h-5 w-5" />
      رزرو کلاس جدید
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </Button>
  );

  const secondaryAction = (
    <Button
      variant="outline"
      size="lg"
      className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
      onClick={() => router.push('/students/progress')}
    >
      پیگیری مسیر یادگیری
    </Button>
  );

  const handleTeacherSelect = (teacher: any) => {
    const teacherInfo: SelectedTeacherInfo = {
      id: teacher.id,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      languages: teacher.languages || [],
      experience_years: teacher.experience_years,
      avatar: teacher.avatar,
      hourly_rate: teacher.hourly_rate,
    };
    setSelectedTeacher(teacherInfo);
    sessionStorage.setItem('selectedTeacher', JSON.stringify(teacherInfo));
    setShowTeacherModal(false);

    const shouldBook = window.confirm(
      `${teacher.first_name} ${teacher.last_name} انتخاب شد.\n\nمایلید همین حالا کلاس رزرو کنید؟`,
    );

    if (shouldBook) {
      router.push(`/teachers/${teacher.id}/book`);
    }
  };

  if (!studentProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md border-none bg-white/90 p-8 shadow-2xl backdrop-blur dark:bg-slate-900/80">
          <CardContent className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-900/40">
              <Bell className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">پروفایل یافت نشد</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              برای دسترسی به داشبورد، لطفاً ابتدا ثبت‌نام خود را تکمیل کنید.
            </p>
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white" onClick={() => router.push('/register')}>
              ثبت‌نام
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50 pb-16 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <StudentHeader studentName={`${studentProfile.first_name} ${studentProfile.last_name}`} studentEmail={studentProfile.email} />

      <div className="container mx-auto px-4 pt-28">
        <DashboardHero
          className="mb-8"
          title={`سلام ${studentProfile.first_name}! مسیر یادگیری‌ات آماده است`}
          subtitle="تمام ابزارهای موردنیاز، آمار و کلاس‌های پیش رو در همین صفحه جمع شده‌اند. با یک نگاه وضعیت یادگیری‌ات را بررسی کن و آماده جلسه بعدی باش."
          badge={heroBadge}
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
                <span>اقدامات سریع</span>
                <span className="text-xs font-medium text-slate-400">شروع مسیر در چند ثانیه</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80"
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

          {currentUser && (
            <Card className="border-none bg-white/90 shadow-xl dark:bg-slate-900/80">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">کیف پول من</CardTitle>
              </CardHeader>
              <CardContent>
                <WalletCard userType="student" userId={currentUser.id} className="border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-none bg-white/90 shadow-xl dark:bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">کلاس‌های پیش رو</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {upcomingClasses.length === 0 ? 'هنوز کلاسی رزرو نکرده‌اید' : 'جزئیات سه کلاس آخر شما'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/students/classes')}>
                مشاهده همه
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-800/70 dark:text-slate-300">
                  برای شروع یادگیری، یک کلاس رزرو کنید.
                </div>
              ) : (
                upcomingClasses.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 transition hover:border-sky-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyle[booking.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        {statusLabelMap[booking.status] || booking.status}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.created_at).toLocaleDateString('fa-IR')}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300">
                        <Clock className="h-4 w-4" />
                        {booking.duration} دقیقه
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {booking.session_type === 'online' ? 'کلاس آنلاین' : booking.session_type === 'offline' ? 'کلاس حضوری' : 'کلاس ترکیبی'}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                        {booking.selected_days.map((day) => dayNameMap[day] || day).join('، ')}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                        {booking.selected_hours.map((hour) => hourNameMap[hour] || hour).join('، ')}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                        {booking.total_price.toLocaleString()} تومان
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-end text-xs"
                      onClick={() => router.push(`/students/${studentProfile.id}/video-call?booking=${booking.id}`)}
                    >
                      ورود به کلاس
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-none bg-white/90 shadow-xl dark:bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">آخرین اعلان‌ها</CardTitle>
              <Badge variant="outline" className="rounded-full border-indigo-200 bg-indigo-50 text-xs text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-200">
                {notifications.filter((n) => !n.read).length} جدید
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestNotifications.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-800/70 dark:text-slate-300">
                  هنوز اعلانی برای شما ثبت نشده است.
                </div>
              ) : (
                latestNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      {notification.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : notification.type === 'warning' ? (
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      ) : notification.type === 'error' ? (
                        <Bell className="h-5 w-5 text-rose-500" />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-sky-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">{notification.message}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{notification.time}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card
              key={feature.title}
              className="border-none bg-gradient-to-br from-white to-slate-100 p-[1px] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl dark:from-slate-900 dark:to-slate-800"
            >
              <div className="h-full rounded-[22px] bg-white/95 p-6 dark:bg-slate-900/90">
                <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} p-3 text-white`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{feature.description}</p>
                <Button
                  variant="ghost"
                  className="mt-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                  onClick={feature.onClick}
                >
                  {feature.actionLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <TeacherSelectionModal isOpen={showTeacherModal} onClose={() => setShowTeacherModal(false)} onTeacherSelect={handleTeacherSelect} />
    </div>
  );
}

