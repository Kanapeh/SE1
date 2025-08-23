'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import StudentHeader from '@/components/StudentHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  AlertCircle,
  User,
  Phone,
  Mail,
  Monitor,
  Home,
  BookOpen,
  CreditCard,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Settings,
  BarChart3,
  Target,
  Award,
  MessageCircle,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  ArrowLeft,
  Zap,
  Activity,
  Heart,
  Smile,
  Languages,
  GraduationCap,
  Video,
  Clock3,
  UserCheck,
  UserX,
  CalendarDays,
  Clock4,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart,
  PieChart,
  LineChart,
  BookOpen as BookOpenIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  MessageCircle as MessageCircleIcon,
  Bell as BellIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Eye as EyeIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  ArrowLeft as ArrowLeftIcon,
  Zap as ZapIcon,
  Activity as ActivityIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Languages as LanguagesIcon,
  GraduationCap as GraduationCapIcon,
  Clock3 as Clock3Icon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  CalendarDays as CalendarDaysIcon,
  Clock4 as Clock4Icon,
  DollarSign as DollarSignIcon2,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Sparkles,
  Brain,
  Trophy,
  Gift,
  Gamepad2
} from 'lucide-react';

interface User {
  id: string;
  email: string | undefined;
  role?: string;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  level: string | null;
  language: string | null;
  status: string;
  goals: string | null;
  experience_years: number | null;
}

interface Class {
  id: string;
  teacher_id: string;
  student_id: string;
  class_date: string;
  class_time: string;
  duration: number;
  status: string;
  amount: number;
  notes: string | null;
  created_at: string;
  teacher?: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  student?: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
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

export default function StudentDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Student | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Helper function for better navigation handling
  const handleNavigation = (path: string, description: string) => {
    try {
      console.log(`🚀 ${description} - Navigating to: ${path}`);
      
      // Show visual feedback that button was clicked
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
      }
      
      // Navigate to the page
      router.push(path);
    } catch (error) {
      console.error(`❌ Navigation error to ${path}:`, error);
      // Fallback - try window location
      window.location.href = path;
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          router.push('/login');
          return;
        }

        setCurrentUser({
          id: user.id,
          email: user.email,
          role: 'student'
        });

        // Get student profile from database
        const { data: studentData, error: profileError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching student profile:', profileError);
          // Redirect to complete profile if profile doesn't exist
          router.push('/complete-profile?type=student');
          return;
        }

        if (studentData) {
          setUserProfile({
            id: studentData.id,
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            email: studentData.email,
            phone: studentData.phone,
            avatar: studentData.avatar,
            level: studentData.current_language_level,
            language: studentData.preferred_languages?.[0] || 'انگلیسی',
            status: studentData.status,
            goals: studentData.learning_goals,
            experience_years: 0
          });
        }

        // Initialize empty data for new student
        setClasses([]);
        
        // Initialize basic progress data for new student
        const basicProgress: ProgressData = {
          currentLevel: studentData?.current_language_level || 'مبتدی',
          nextLevel: 'ابتدایی',
          progressPercentage: 0,
          completedLessons: 0,
          totalLessons: 0,
          streak: 0,
          weeklyGoal: 2,
          weeklyProgress: 0
        };
        setProgress(basicProgress);

        // Initialize basic analytics for new student
        const basicAnalytics: Analytics = {
          totalClasses: 0,
          completedClasses: 0,
          totalSpent: 0,
          averageRating: 0,
          thisMonthClasses: 0,
          thisMonthSpent: 0,
          favoriteTeacher: 'هنوز معلمی انتخاب نکرده‌اید',
          mostStudiedLanguage: studentData?.preferred_languages?.[0] || 'انگلیسی',
          studyTime: 0,
          improvementRate: 0
        };
        setAnalytics(basicAnalytics);

        // Initialize welcome notification for new student
        const welcomeNotifications: Notification[] = [
          {
            id: '1',
            type: 'info',
            title: 'خوش آمدید! 🎉',
            message: 'به آکادمی زبان خوش آمدید. برای شروع یادگیری، یک معلم انتخاب کنید.',
            time: 'همین الان',
            read: false
          }
        ];
        setNotifications(welcomeNotifications);

      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">تکمیل شده</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">برنامه‌ریزی شده</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">لغو شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">در انتظار</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">داشبورد دانش‌آموز در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">پروفایل یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">لطفا ابتدا ثبت‌نام کنید</p>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              ثبت‌نام
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const student = userProfile;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Student Header */}
      <StudentHeader 
        studentName={`${student.first_name} ${student.last_name}`}
        studentEmail={student.email}
      />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            داشبورد دانش‌آموز
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            خوش آمدید {student.first_name} {student.last_name} 👋
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            ✨ امکانات جدید برای شما فعال شده است!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">کلاس‌های تکمیل شده</p>
                  <p className="text-2xl font-bold">{analytics?.completedClasses}</p>
                  <p className="text-green-100 text-sm">
                    {analytics?.totalClasses === 0 ? 'هنوز کلاسی ندارید' : `از ${analytics?.totalClasses} کلاس`}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">سطح فعلی</p>
                  <p className="text-2xl font-bold">{student.level}</p>
                  <p className="text-blue-100 text-sm">
                    {progress?.progressPercentage === 0 ? 'شروع کنید' : `${progress?.progressPercentage}% تکمیل شده`}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <GraduationCap className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">امتیاز متوسط</p>
                  <p className="text-2xl font-bold">
                    {analytics?.averageRating === 0 ? '-' : analytics?.averageRating}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm text-purple-100">
                      {analytics?.averageRating === 0 ? 'هنوز امتیازی ندارید' : 'از 5'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Star className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">امکانات فعال</p>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-orange-100 text-sm">ویژگی جدید</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">روزهای متوالی</p>
                  <p className="text-2xl font-bold">{progress?.streak}</p>
                  <p className="text-teal-100 text-sm">
                    {progress?.streak === 0 ? 'شروع کنید' : 'روز مطالعه'}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Activity className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              کلاس‌ها
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              پیشرفت
            </TabsTrigger>
            <TabsTrigger value="gamification" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              گیمیفیکیشن
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              امکانات جدید
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              اعلان‌ها
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    اقدامات سریع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => router.push('/teachers')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>رزرو کلاس جدید</span>
                  </Button>

                  <Button 
                    onClick={() => handleNavigation('/students/temp-user-id/video-call', 'پیوستن به کلاس آنلاین')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200"
                  >
                    <Video className="w-6 h-6" />
                    <span>کلاس آنلاین</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleNavigation('/students/progress', 'مشاهده پیشرفت')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>مشاهده پیشرفت</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleNavigation('/students/payments', 'مدیریت پرداخت‌ها')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>مدیریت پرداخت‌ها</span>
                  </Button>

                  <Button 
                    onClick={() => handleNavigation('/students/profile', 'ویرایش پروفایل')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    <Edit className="w-6 h-6" />
                    <span>ویرایش پروفایل</span>
                  </Button>

                  <Button 
                    onClick={() => setActiveTab('features')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    <Sparkles className="w-6 h-6" />
                    <span>مشاهده همه امکانات</span>
                  </Button>
                </CardContent>
              </Card>



              {/* Progress Overview */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    پیشرفت هفتگی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">هدف هفتگی</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progress?.weeklyProgress}/{progress?.weeklyGoal} کلاس
                      </span>
                    </div>
                    <Progress value={(progress?.weeklyProgress || 0) / (progress?.weeklyGoal || 1) * 100} className="h-2" />
                    {progress?.weeklyProgress === 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        برای شروع، اولین کلاس خود را رزرو کنید
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {progress?.streak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">روز متوالی</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress?.completedLessons}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">درس تکمیل شده</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    فعالیت‌های اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics?.totalClasses === 0 ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        هنوز فعالیتی ندارید
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        اولین کلاس خود را رزرو کنید
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">کلاس تکمیل شد</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">2 ساعت پیش</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">کلاس جدید رزرو شد</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">1 روز پیش</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">سطح ارتقا یافت</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">3 روز پیش</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    کلاس‌های من
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    مشاهده همه
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {classes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">هنوز کلاسی ندارید</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">برای شروع یادگیری، یک معلم انتخاب کنید</p>
                    <Button 
                      onClick={() => router.push('/teachers')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      مشاهده معلمان
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={cls.teacher?.avatar || ''} alt={`${cls.teacher?.first_name} ${cls.teacher?.last_name}`} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                {cls.teacher?.first_name[0]}{cls.teacher?.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {cls.teacher?.first_name} {cls.teacher?.last_name}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>{new Date(cls.class_date).toLocaleDateString('fa-IR')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{cls.class_time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="w-4 h-4" />
                                  <span>{cls.amount.toLocaleString()} تومان</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(cls.status)}
                          </div>
                        </div>
                        
                        {cls.notes && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{cls.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Welcome Message for New Users */}
            {analytics?.totalClasses === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    به بخش پیشرفت خوش آمدید! 📈
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    برای شروع ردیابی پیشرفت، اولین کلاس خود را رزرو کنید
                  </p>
                  <Button 
                    onClick={() => router.push('/teachers')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    مشاهده معلمان
                  </Button>
                </div>
              </motion.div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Level Progress */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    پیشرفت سطح
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        سطح {progress?.currentLevel || 'مبتدی'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {analytics?.totalClasses === 0 ? '0%' : `${progress?.progressPercentage}%`}
                      </span>
                    </div>
                    <Progress 
                      value={analytics?.totalClasses === 0 ? 0 : (progress?.progressPercentage || 0)} 
                      className="h-3" 
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {analytics?.totalClasses === 0 
                        ? 'هنوز درسی تکمیل نکرده‌اید' 
                        : `${progress?.completedLessons} از ${progress?.totalLessons} درس تکمیل شده`
                      }
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analytics?.totalClasses === 0 ? '0' : progress?.streak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {analytics?.totalClasses === 0 ? 'روز متوالی' : 'روز متوالی'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analytics?.totalClasses === 0 ? '0' : analytics?.improvementRate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {analytics?.totalClasses === 0 ? 'بهبود' : 'بهبود'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Stats */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    آمار مطالعه
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {analytics?.totalClasses || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">کل کلاس‌ها</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {analytics?.studyTime || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ساعت مطالعه</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">زبان محبوب</span>
                      <span className="text-sm font-medium">
                        {analytics?.totalClasses === 0 ? 'هنوز انتخاب نشده' : analytics?.mostStudiedLanguage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">معلم محبوب</span>
                      <span className="text-sm font-medium">
                        {analytics?.totalClasses === 0 ? 'هنوز معلمی انتخاب نکرده‌اید' : analytics?.favoriteTeacher}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">امتیاز متوسط</span>
                      <span className="text-sm font-medium">
                        {analytics?.totalClasses === 0 ? '0' : analytics?.averageRating}/5
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification" className="space-y-6">
            {/* Welcome Message for New Users */}
            {analytics?.totalClasses === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    به دنیای گیمیفیکیشن خوش آمدید! 🎮
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    برای شروع کسب امتیاز و دستاورد، اولین کلاس خود را رزرو کنید
                  </p>
                  <Button 
                    onClick={() => router.push('/teachers')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    مشاهده معلمان
                  </Button>
                </div>
              </motion.div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Level & Points */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    سطح و امتیازات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Level */}
                  <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      سطح {student.level || 'مبتدی'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      امتیاز کل: <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        {analytics?.totalClasses === 0 ? '0' : '1,250'}
                      </span>
                    </p>
                  </div>

                  {/* Progress to Next Level */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">پیشرفت به سطح بعدی</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {analytics?.totalClasses === 0 ? '0%' : '75%'}
                      </span>
                    </div>
                    <Progress value={analytics?.totalClasses === 0 ? 0 : 75} className="h-3" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {analytics?.totalClasses === 0 ? 'شروع کنید تا امتیاز کسب کنید' : '250 امتیاز دیگر برای سطح بعدی'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    دستاوردها
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* First Class */}
                    <div className={`text-center p-3 rounded-lg border ${
                      analytics?.totalClasses === 0 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        analytics?.totalClasses === 0 ? 'bg-gray-400' : 'bg-green-500'
                      }`}>
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className={`text-xs font-medium ${
                        analytics?.totalClasses === 0 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-green-700 dark:text-green-300'
                      }`}>
                        {analytics?.totalClasses === 0 ? 'اولین کلاس' : 'اولین کلاس ✓'}
                      </p>
                    </div>

                    {/* Study Streak */}
                    <div className={`text-center p-3 rounded-lg border ${
                      progress?.streak === 0 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        progress?.streak === 0 ? 'bg-gray-400' : 'bg-blue-500'
                      }`}>
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <p className={`text-xs font-medium ${
                        progress?.streak === 0 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-blue-700 dark:text-blue-300'
                      }`}>
                        {progress?.streak === 0 ? '7 روز متوالی' : `${progress?.streak} روز متوالی ✓`}
                      </p>
                    </div>

                    {/* Perfect Score */}
                    <div className={`text-center p-3 rounded-lg border ${
                      analytics?.averageRating === 0 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                        : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        analytics?.averageRating === 0 ? 'bg-gray-400' : 'bg-purple-500'
                      }`}>
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <p className={`text-xs font-medium ${
                        analytics?.averageRating === 0 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-purple-700 dark:text-purple-300'
                      }`}>
                        {analytics?.averageRating === 0 ? 'امتیاز کامل' : 'امتیاز کامل ✓'}
                      </p>
                    </div>

                    {/* Language Master */}
                    <div className={`text-center p-3 rounded-lg border ${
                      analytics?.totalClasses === 0 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        analytics?.totalClasses === 0 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        <Languages className="w-5 h-5 text-white" />
                      </div>
                      <p className={`text-xs font-medium ${
                        analytics?.totalClasses === 0 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-orange-700 dark:text-orange-300'
                      }`}>
                        {analytics?.totalClasses === 0 ? 'استاد زبان' : 'استاد زبان ✓'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Challenges */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  چالش‌های روزانه
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Challenge 1 */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">مطالعه 30 دقیقه</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">امتیاز: 50</p>
                      </div>
                    </div>
                    <Progress value={analytics?.totalClasses === 0 ? 0 : 60} className="h-2 mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {analytics?.totalClasses === 0 ? 'شروع کنید تا پیشرفت کنید' : '18 دقیقه باقی مانده'}
                    </p>
                  </div>

                  {/* Challenge 2 */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">شرکت در کلاس</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">امتیاز: 100</p>
                      </div>
                    </div>
                    <Progress value={analytics?.totalClasses === 0 ? 0 : 100} className="h-2 mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {analytics?.totalClasses === 0 ? 'هنوز کلاسی ندارید' : 'تکمیل شده! 🎉'}
                    </p>
                  </div>

                  {/* Challenge 3 */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">تمرین AI</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">امتیاز: 75</p>
                      </div>
                    </div>
                    <Progress value={0} className="h-2 mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {analytics?.totalClasses === 0 ? 'شروع کنید تا دسترسی پیدا کنید' : 'شروع نشده'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  جدول امتیازات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Top 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* 2nd Place */}
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">علی احمدی</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2,450 امتیاز</p>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-400">
                      <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">سارا محمدی</h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">3,200 امتیاز</p>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">محمد رضایی</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2,100 امتیاز</p>
                    </div>
                  </div>

                  {/* Your Position */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {analytics?.totalClasses === 0 ? '-' : '5'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">شما</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {analytics?.totalClasses === 0 ? '0 امتیاز' : '1,250 امتیاز'}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        {analytics?.totalClasses === 0 ? 'شروع کنید' : 'مشاهده کامل'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Coach */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">مربی هوشمند</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      چت با AI و دریافت راهنمایی شخصی
                    </p>
                    <Button 
                      onClick={() => handleNavigation('/students/ai-coach', 'مربی هوشمند - شروع چت')}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-200"
                    >
                      شروع چت
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gamification */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">دنیای گیمیفیکیشن</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      تبدیل یادگیری به بازی و کسب دستاورد
                    </p>
                    <Button 
                      onClick={() => handleNavigation('/students/gamification', 'دنیای گیمیفیکیشن - شروع بازی')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white transition-all duration-200"
                    >
                      شروع بازی
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">سیستم پاداش</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      کسب امتیاز و تبدیل به پاداش‌های واقعی
                    </p>
                    <Button 
                      onClick={() => handleNavigation('/students/rewards', 'سیستم پاداش - مشاهده پاداش‌ها')}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white transition-all duration-200"
                    >
                      مشاهده پاداش‌ها
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Learning */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">جامعه یادگیری</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      یادگیری گروهی و تعامل با دیگران
                    </p>
                    <Button 
                      onClick={() => handleNavigation('/students/social', 'جامعه یادگیری - پیوستن به جامعه')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200"
                    >
                      پیوستن به جامعه
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Learning */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Gamepad2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">یادگیری تعاملی</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      تجربه یادگیری با AR و بازی‌های تعاملی
                    </p>
                    <Button 
                      onClick={() => handleNavigation('/students/interactive', 'یادگیری تعاملی - شروع تجربه')}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white transition-all duration-200"
                    >
                      شروع تجربه
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Learning */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">یادگیری شخصی</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      تجربه یادگیری منحصر به فرد برای شما
                    </p>
                    <Button 
                      onClick={() => handleNavigation('/students/personalized', 'یادگیری شخصی - شخصی‌سازی')}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white transition-all duration-200"
                    >
                      شخصی‌سازی
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  اعلان‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        notification.read
                          ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 