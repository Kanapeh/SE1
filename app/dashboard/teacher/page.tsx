'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
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
  Zap,
  Trophy,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Clock3,
  BookMarked,
  GraduationCap,
  Languages,
  Globe,
  Shield,
  Heart,
  Smile,
  ThumbsUp,
  CalendarDays,
  Clock4,
  DollarSignIcon,
  UserCheck,
  UserPlus,
  Star as StarIcon,
  Crown,
  Medal,
  Target as TargetIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Percent
} from 'lucide-react';

interface User {
  id: string;
  email: string | undefined;
  role?: string;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  hourly_rate: number | null;
  location: string | null;
  experience_years: number | null;
  available: boolean;
  status: string;
  languages: string[];
  levels: string[];
  available_days: string[] | null;
  available_hours: string[] | null;
  bio: string | null;
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

interface Schedule {
  id: string;
  teacher_id: string;
  day: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface Analytics {
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  monthlyGrowth: number;
  weeklyClasses: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  topLanguages: { language: string; count: number }[];
  performanceTrend: { month: string; earnings: number; classes: number }[];
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalClasses: 0,
    completedClasses: 0,
    totalEarnings: 0,
    totalSpent: 0,
    averageRating: 0,
    thisMonthClasses: 0,
    thisMonthEarnings: 0
  });

  // Get current user
  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const typedUser: User = {
          id: user.id,
          email: user.email || undefined,
          role: user.user_metadata?.role
        };
        setCurrentUser(typedUser);
        return typedUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };

  // Get teacher profile
  const getTeacherProfile = async (userEmail: string) => {
    try {
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (teacherData) {
        setUserProfile(teacherData);
        return teacherData;
      }

      router.push('/register');
      return null;
    } catch (error) {
      console.error('Error getting teacher profile:', error);
      return null;
    }
  };

  // Fetch teacher classes
  const fetchClasses = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:teachers!classes_teacher_id_fkey (
            first_name,
            last_name,
            avatar
          ),
          student:students!classes_student_id_fkey (
            first_name,
            last_name,
            avatar
          )
        `)
        .eq('teacher_id', teacherId)
        .order('class_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  };

  // Fetch teacher schedule
  const fetchSchedule = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('teacher_schedule')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('day', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return [];
    }
  };

  // Calculate statistics
  const calculateStats = (classesData: Class[]) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalClasses = classesData.length;
    const completedClasses = classesData.filter(c => c.status === 'completed').length;
    
    let totalEarnings = 0;
    let thisMonthClasses = 0;
    let thisMonthEarnings = 0;

    classesData.forEach(cls => {
      const classDate = new Date(cls.class_date);
      const isThisMonth = classDate.getMonth() === thisMonth && classDate.getFullYear() === thisYear;

      totalEarnings += cls.amount;
      if (isThisMonth) {
        thisMonthClasses++;
        thisMonthEarnings += cls.amount;
      }
    });

    return {
      totalClasses,
      completedClasses,
      totalEarnings,
      totalSpent: 0,
      averageRating: 4.8, // Placeholder
      thisMonthClasses,
      thisMonthEarnings
    };
  };

  // Mock analytics data
  const generateAnalytics = () => {
    return {
      totalStudents: 24,
      activeStudents: 18,
      completionRate: 87,
      averageRating: 4.8,
      totalReviews: 156,
      monthlyGrowth: 12.5,
      weeklyClasses: 8,
      monthlyEarnings: 2400000,
      yearlyEarnings: 28000000,
      topLanguages: [
        { language: 'انگلیسی', count: 15 },
        { language: 'فرانسه', count: 6 },
        { language: 'آلمانی', count: 3 }
      ],
      performanceTrend: [
        { month: 'فروردین', earnings: 1800000, classes: 45 },
        { month: 'اردیبهشت', earnings: 2100000, classes: 52 },
        { month: 'خرداد', earnings: 2400000, classes: 60 },
        { month: 'تیر', earnings: 2200000, classes: 55 },
        { month: 'مرداد', earnings: 2600000, classes: 65 },
        { month: 'شهریور', earnings: 2400000, classes: 60 }
      ]
    };
  };

  // Mock notifications
  const generateNotifications = () => {
    return [
      {
        id: '1',
        type: 'success' as const,
        title: 'کلاس جدید رزرو شد',
        message: 'سارا محمدی کلاس انگلیسی سطح متوسط را برای فردا رزرو کرد',
        time: '2 ساعت پیش',
        read: false
      },
      {
        id: '2',
        type: 'info' as const,
        title: 'امتیاز جدید دریافت کردید',
        message: 'احمد رضایی به شما 5 ستاره داد',
        time: '4 ساعت پیش',
        read: false
      },
      {
        id: '3',
        type: 'warning' as const,
        title: 'یادآوری کلاس',
        message: 'کلاس با فاطمه کریمی در 30 دقیقه آینده شروع می‌شود',
        time: '1 روز پیش',
        read: true
      },
      {
        id: '4',
        type: 'success' as const,
        title: 'پرداخت دریافت شد',
        message: 'مبلغ 200,000 تومان برای کلاس دیروز دریافت شد',
        time: '2 روز پیش',
        read: true
      }
    ];
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Temporarily disabled authentication for testing
        // const user = await getCurrentUser();
        // if (!user) {
        //   router.push('/login');
        //   return;
        // }

        // For now, create a mock user for testing
        const mockUser = {
          id: 'temp-user-id',
          email: 'teacher@example.com',
          role: 'teacher'
        };
        setCurrentUser(mockUser);

        // Create mock teacher profile data for testing
        const mockProfile = {
          id: 'temp-profile-id',
          first_name: 'علی',
          last_name: 'احمدی',
          email: 'teacher@example.com',
          phone: '09123456789',
          avatar: null,
          hourly_rate: 200000,
          location: 'تهران',
          experience_years: 5,
          available: true,
          status: 'active',
          languages: ['انگلیسی', 'فرانسه'],
          levels: ['مبتدی', 'متوسط', 'پیشرفته'],
          available_days: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه'],
          available_hours: ['09:00', '10:00', '14:00', '15:00'],
          bio: 'معلم با تجربه 5 ساله در تدریس زبان انگلیسی'
        };
        setUserProfile(mockProfile);

        // Mock classes data for teacher
        const mockClasses = [
          {
            id: '1',
            teacher_id: 'temp-profile-id',
            student_id: 'student-1',
            class_date: '2024-01-15',
            class_time: '14:00',
            duration: 60,
            status: 'scheduled',
            amount: 200000,
            notes: 'کلاس انگلیسی سطح متوسط',
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
            teacher_id: 'temp-profile-id',
            student_id: 'student-2',
            class_date: '2024-01-16',
            class_time: '10:00',
            duration: 60,
            status: 'completed',
            amount: 200000,
            notes: 'کلاس فرانسه سطح مبتدی',
            created_at: '2024-01-09T10:00:00Z',
            teacher: {
              first_name: 'علی',
              last_name: 'احمدی',
              avatar: null
            },
            student: {
              first_name: 'احمد',
              last_name: 'رضایی',
              avatar: null
            }
          },
          {
            id: '3',
            teacher_id: 'temp-profile-id',
            student_id: 'student-3',
            class_date: '2024-01-17',
            class_time: '15:00',
            duration: 60,
            status: 'pending',
            amount: 200000,
            notes: 'کلاس انگلیسی سطح پیشرفته',
            created_at: '2024-01-08T10:00:00Z',
            teacher: {
              first_name: 'علی',
              last_name: 'احمدی',
              avatar: null
            },
            student: {
              first_name: 'فاطمه',
              last_name: 'کریمی',
              avatar: null
            }
          }
        ];
        setClasses(mockClasses);

        const statsData = calculateStats(mockClasses);
        setStats(statsData);

        // Mock schedule data for teacher
        const mockSchedule = [
          {
            id: '1',
            teacher_id: 'temp-profile-id',
            day: 'شنبه',
            start_time: '09:00',
            end_time: '12:00',
            is_available: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            teacher_id: 'temp-profile-id',
            day: 'یکشنبه',
            start_time: '14:00',
            end_time: '18:00',
            is_available: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '3',
            teacher_id: 'temp-profile-id',
            day: 'دوشنبه',
            start_time: '10:00',
            end_time: '15:00',
            is_available: true,
            created_at: '2024-01-01T00:00:00Z'
          }
        ];
        setSchedule(mockSchedule);

        // Set analytics and notifications
        setAnalytics(generateAnalytics());
        setNotifications(generateNotifications());
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
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">داشبورد معلم در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">پروفایل یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">لطفا ابتدا ثبت‌نام کنید</p>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              ثبت‌نام
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const teacher = userProfile;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Profile and Notifications */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={teacher.avatar || ''} alt={`${teacher.first_name} ${teacher.last_name}`} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {teacher.first_name[0]}{teacher.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  خوش آمدید، {teacher.first_name} {teacher.last_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {teacher.location} • {teacher.experience_years} سال تجربه
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{stats.averageRating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{analytics?.totalStudents} دانش‌آموز</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">سطح {teacher.experience_years > 3 ? 'متخصص' : 'حرفه‌ای'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </div>
              <Button variant="outline" onClick={() => router.push('/teachers/schedule')}>
                <Calendar className="w-4 h-4 mr-2" />
                مدیریت برنامه
              </Button>
              <Button onClick={() => router.push('/teachers/profile')}>
                <Settings className="w-4 h-4 mr-2" />
                تنظیمات
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">درآمد این ماه</p>
                  <p className="text-2xl font-bold">{stats.thisMonthEarnings.toLocaleString()} تومان</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm text-green-100">+{analytics?.monthlyGrowth}%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">کلاس‌های این ماه</p>
                  <p className="text-2xl font-bold">{stats.thisMonthClasses}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm text-blue-100">+{Math.round((stats.thisMonthClasses / 30) * 100)}%</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">دانش‌آموزان فعال</p>
                  <p className="text-2xl font-bold">{analytics?.activeStudents}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-sm text-purple-100">{analytics?.completionRate}% تکمیل</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">امتیاز متوسط</p>
                  <p className="text-2xl font-bold">{analytics?.averageRating}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm text-orange-100">{analytics?.totalReviews} نظر</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Star className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              کلاس‌ها
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              تحلیل‌ها
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
                    onClick={() => router.push('/teachers/schedule')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>مدیریت برنامه زمانی</span>
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/teachers/earnings')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <DollarSign className="w-6 h-6" />
                    <span>گزارش درآمد</span>
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/teachers/students')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <Users className="w-6 h-6" />
                    <span>مدیریت دانش‌آموزان</span>
                  </Button>

                  <Button 
                    onClick={() => router.push('/teachers/profile')}
                    className="w-full h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    <Edit className="w-6 h-6" />
                    <span>ویرایش پروفایل</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    عملکرد کلی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">نرخ تکمیل کلاس‌ها</span>
                      <span className="text-sm font-medium">{analytics?.completionRate}%</span>
                    </div>
                    <Progress value={analytics?.completionRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">رضایت دانش‌آموزان</span>
                      <span className="text-sm font-medium">{analytics?.averageRating}/5</span>
                    </div>
                    <Progress value={(analytics?.averageRating || 0) * 20} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">دانش‌آموزان فعال</span>
                      <span className="text-sm font-medium">{analytics?.activeStudents}/{analytics?.totalStudents}</span>
                    </div>
                    <Progress value={((analytics?.activeStudents || 0) / (analytics?.totalStudents || 1)) * 100} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">کلاس‌های هفته آینده</span>
                      <span className="text-sm font-bold text-blue-600">{analytics?.weeklyClasses}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    فعالیت‌های اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications.slice(0, 4).map((notification) => (
                    <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                      </div>
                    </div>
                  ))}
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
                    <BookOpen className="w-5 h-5" />
                    کلاس‌های اخیر
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
                    <p className="text-gray-600 dark:text-gray-400 mb-4">دانش‌آموزان می‌توانند شما را رزرو کنند</p>
                    <Button 
                      onClick={() => router.push('/teachers/profile')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      تکمیل پروفایل
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white/50 dark:bg-gray-700/50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={cls.student?.avatar || ''} alt={`${cls.student?.first_name} ${cls.student?.last_name}`} />
                              <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                {cls.student?.first_name[0]}{cls.student?.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {cls.student?.first_name} {cls.student?.last_name}
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
                                  <DollarSign className="w-4 h-4" />
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    روند درآمد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.performanceTrend.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{item.month}</span>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.classes} کلاس
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{item.earnings.toLocaleString()} تومان</div>
                          <div className="text-sm text-gray-500">
                            {Math.round(item.earnings / 1000)}K
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Language Distribution */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-blue-500" />
                    توزیع زبان‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topLanguages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                          <span className="font-medium text-gray-900 dark:text-white">{lang.language}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{lang.count} دانش‌آموز</span>
                          <span className="text-sm font-bold text-blue-600">
                            {Math.round((lang.count / (analytics?.totalStudents || 1)) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
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
                  همه اعلان‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg border ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'}`}>
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        {!notification.read && (
                          <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            جدید
                          </Badge>
                        )}
                      </div>
                    </div>
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