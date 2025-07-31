'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Mock user data
        const mockUser = {
          id: 'temp-user-id',
          email: 'student@example.com',
          role: 'student'
        };
        setCurrentUser(mockUser);

        // Mock student profile
        const mockProfile = {
          id: 'temp-profile-id',
          first_name: 'سارا',
          last_name: 'محمدی',
          email: 'student@example.com',
          phone: '09123456789',
          avatar: null,
          level: 'متوسط',
          language: 'انگلیسی',
          status: 'active',
          goals: 'یادگیری زبان انگلیسی برای کار و سفر',
          experience_years: 2
        };
        setUserProfile(mockProfile);

        // Mock classes data
        const mockClasses = [
          {
            id: '1',
            teacher_id: 'teacher-1',
            student_id: 'temp-profile-id',
            class_date: '2024-01-15',
            class_time: '14:00',
            duration: 60,
            status: 'scheduled',
            amount: 200000,
            notes: 'کلاس انگلیسی سطح متوسط - تمرین مکالمه',
            created_at: '2024-01-10T10:00:00Z',
            teacher: {
              first_name: 'علی',
              last_name: 'احمدی',
              avatar: null
            },
            student: {
              first_name: 'سارا',
              last_name: 'محمدی',
              avatar: null
            }
          },
          {
            id: '2',
            teacher_id: 'teacher-2',
            student_id: 'temp-profile-id',
            class_date: '2024-01-10',
            class_time: '10:00',
            duration: 60,
            status: 'completed',
            amount: 180000,
            notes: 'کلاس انگلیسی سطح مبتدی - گرامر و واژگان',
            created_at: '2024-01-05T10:00:00Z',
            teacher: {
              first_name: 'فاطمه',
              last_name: 'کریمی',
              avatar: null
            },
            student: {
              first_name: 'سارا',
              last_name: 'محمدی',
              avatar: null
            }
          },
          {
            id: '3',
            teacher_id: 'teacher-3',
            student_id: 'temp-profile-id',
            class_date: '2024-01-20',
            class_time: '16:00',
            duration: 60,
            status: 'pending',
            amount: 220000,
            notes: 'کلاس انگلیسی سطح پیشرفته - آمادگی آیلتس',
            created_at: '2024-01-12T10:00:00Z',
            teacher: {
              first_name: 'احمد',
              last_name: 'رضایی',
              avatar: null
            },
            student: {
              first_name: 'سارا',
              last_name: 'محمدی',
              avatar: null
            }
          }
        ];
        setClasses(mockClasses);

        // Mock progress data
        const mockProgress: ProgressData = {
          currentLevel: 'متوسط',
          nextLevel: 'پیشرفته',
          progressPercentage: 75,
          completedLessons: 15,
          totalLessons: 20,
          streak: 7,
          weeklyGoal: 5,
          weeklyProgress: 3
        };
        setProgress(mockProgress);

        // Mock analytics data
        const mockAnalytics: Analytics = {
          totalClasses: 12,
          completedClasses: 9,
          totalSpent: 2400000,
          averageRating: 4.8,
          thisMonthClasses: 3,
          thisMonthSpent: 600000,
          favoriteTeacher: 'علی احمدی',
          mostStudiedLanguage: 'انگلیسی',
          studyTime: 45,
          improvementRate: 85
        };
        setAnalytics(mockAnalytics);

        // Mock notifications
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'success',
            title: 'کلاس جدید رزرو شد',
            message: 'کلاس شما با استاد علی احمدی برای فردا رزرو شد',
            time: '2 ساعت پیش',
            read: false
          },
          {
            id: '2',
            type: 'info',
            title: 'یادآوری کلاس',
            message: 'کلاس شما با استاد فاطمه کریمی در 30 دقیقه دیگر شروع می‌شود',
            time: '1 ساعت پیش',
            read: true
          },
          {
            id: '3',
            type: 'warning',
            title: 'پیشرفت شما',
            message: 'شما 75% از سطح متوسط را تکمیل کرده‌اید',
            time: '3 ساعت پیش',
            read: false
          }
        ];
        setNotifications(mockNotifications);

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به انتخاب
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  داشبورد دانش‌آموز
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  خوش آمدید {student.first_name} {student.last_name} 👋
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  ✨ 6 امکانات جدید برای شما فعال شده است!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push('/teachers')}>
                <BookOpen className="w-4 h-4 mr-2" />
                رزرو کلاس
              </Button>
              <Button onClick={() => router.push('/students/profile')}>
                <Settings className="w-4 h-4 mr-2" />
                تنظیمات
              </Button>
            </div>
          </div>
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
                  <p className="text-green-100 text-sm">از {analytics?.totalClasses} کلاس</p>
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
                  <p className="text-blue-100 text-sm">{progress?.progressPercentage}% تکمیل شده</p>
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
                  <p className="text-2xl font-bold">{analytics?.averageRating}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm text-purple-100">از 5</span>
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
                  <p className="text-teal-100 text-sm">روز مطالعه</p>
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
          <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
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
                    onClick={() => router.push('/students/progress')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>مشاهده پیشرفت</span>
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/students/payments')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>مدیریت پرداخت‌ها</span>
                  </Button>

                  <Button 
                    onClick={() => router.push('/students/profile')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
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
                      <span className="text-sm font-medium">سطح {progress?.currentLevel}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{progress?.progressPercentage}%</span>
                    </div>
                    <Progress value={progress?.progressPercentage || 0} className="h-3" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {progress?.completedLessons} از {progress?.totalLessons} درس تکمیل شده
                    </p>
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
                        {analytics?.improvementRate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">بهبود</div>
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
                        {analytics?.totalClasses}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">کل کلاس‌ها</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {analytics?.studyTime}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ساعت مطالعه</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">زبان محبوب</span>
                      <span className="text-sm font-medium">{analytics?.mostStudiedLanguage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">معلم محبوب</span>
                      <span className="text-sm font-medium">{analytics?.favoriteTeacher}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">امتیاز متوسط</span>
                      <span className="text-sm font-medium">{analytics?.averageRating}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      onClick={() => router.push('/students/ai-coach')}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
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
                      onClick={() => router.push('/students/gamification')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
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
                      onClick={() => router.push('/students/rewards')}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
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
                      onClick={() => router.push('/students/social')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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
                      onClick={() => router.push('/students/interactive')}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white"
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
                      onClick={() => router.push('/students/personalized')}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
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