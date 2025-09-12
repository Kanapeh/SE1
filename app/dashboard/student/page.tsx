'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getSmartOAuthRedirectUrl } from '@/lib/oauth-utils';
import { Button } from '@/components/ui/button';
import StudentHeader from '@/components/StudentHeader';
import TeacherSelectionModal from '@/components/TeacherSelectionModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletCard from '@/components/WalletCard';
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
  Gamepad2,
  X
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
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

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

interface Class {
  id: string;
  class_date: string;
  class_time: string;
  duration: number;
  status: string;
  teacher?: Teacher;
}

interface Booking {
  id: string;
  teacher_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  selected_days: string[];
  selected_hours: string[];
  session_type: string;
  duration: number;
  total_price: number;
  status: string;
  payment_status: string;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  birthdate: string | null;
  national_id: string | null;
  address: string | null;
  languages: string[];
  levels: string[] | null;
  class_types: string[];
  available_days: string[] | null;
  available_hours: string[] | null;
  max_students_per_class: number | null;
  bio: string | null;
  experience_years: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  certificates: string[] | null;
  teaching_methods: string[] | null;
  achievements: string[] | null;
  avatar: string | null;
  hourly_rate: number | null;
  location: string | null;
  available: boolean;
  education: string | null;
  preferred_time: string[] | null;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Student | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

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

  // Handle teacher selection from modal
  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    console.log('Selected teacher:', teacher);
    
    // Store teacher context for better UX
    sessionStorage.setItem('selectedTeacher', JSON.stringify({
      id: teacher.id,
      name: `${teacher.first_name} ${teacher.last_name}`,
      avatar: teacher.avatar,
      languages: teacher.languages,
      levels: teacher.levels,
      hourly_rate: teacher.hourly_rate,
      class_types: teacher.class_types,
      experience_years: teacher.experience_years
    }));
    
    // Show success message and offer to book immediately
    const shouldBook = confirm(`معلم ${teacher.first_name} ${teacher.last_name} انتخاب شد!\n\nآیا می‌خواهید فوراً کلاس رزرو کنید؟`);
    
    if (shouldBook) {
      // Store booking context
      sessionStorage.setItem('bookingContext', JSON.stringify({
        source: 'dashboard',
        timestamp: new Date().toISOString(),
        userType: 'student'
      }));
      
      // Navigate to booking page - this will show the booking form
      router.push(`/teachers/${teacher.id}/book`);
    }
  };

  // Handle opening teacher selection modal
  const handleOpenTeacherModal = () => {
    setShowTeacherModal(true);
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Load selected teacher from sessionStorage if available
        const savedTeacher = sessionStorage.getItem('selectedTeacher');
        if (savedTeacher) {
          try {
            const teacherData = JSON.parse(savedTeacher);
            setSelectedTeacher(teacherData);
            console.log('Loaded selected teacher from session:', teacherData);
          } catch (error) {
            console.error('Error parsing saved teacher data:', error);
          }
        }

        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          const loginUrl = await getSmartOAuthRedirectUrl('login');
          window.location.href = loginUrl;
          return;
        }

        setCurrentUser({
          id: user.id,
          email: user.email || '',
          user_metadata: user.user_metadata
        });

        // Get student profile using API endpoint (bypasses RLS issues)
        let studentData;
        try {
          console.log('🔍 Fetching student profile for user:', user.id, user.email);
          
          const response = await fetch(`/api/student-profile?user_id=${user.id}&email=${user.email}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              console.log('❌ No student profile found, redirecting to complete profile');
              const profileUrl = await getSmartOAuthRedirectUrl('complete-profile?type=student');
              window.location.href = profileUrl;
              return;
            }
            throw new Error(`Student profile fetch failed: ${response.status}`);
          }
          
          const result = await response.json();
          studentData = result.student;
          console.log('✅ Student profile loaded:', studentData);
          
        } catch (error) {
          console.error('💥 Student profile fetch error:', error);
          const profileUrl = await getSmartOAuthRedirectUrl('complete-profile?type=student');
          window.location.href = profileUrl;
          return;
        }

        if (studentData) {
          setUserProfile({
            id: studentData.id,
            first_name: studentData.first_name || 'کاربر',
            last_name: studentData.last_name || 'جدید',
            email: studentData.email,
            phone: studentData.phone,
            avatar: studentData.avatar,
            level: studentData.current_language_level || 'مبتدی',
            language: studentData.preferred_languages?.[0] || 'انگلیسی',
            status: studentData.status || 'active',
            goals: studentData.learning_goals,
            experience_years: 0
          });
        }

        // Initialize empty data for new student
        
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
        // setLoading(false); // Removed loading state
      }
    };

    initializeDashboard();
  }, [router]);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      if (!userProfile) return;

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('student_id', userProfile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching recent bookings:', error);
          return;
        }

        setRecentBookings(data as Booking[]);
      } catch (error) {
        console.error('Error fetching recent bookings:', error);
      }
    };

    fetchRecentBookings();
    const interval = setInterval(fetchRecentBookings, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [userProfile]);

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
          
          {/* Selected Teacher Indicator */}
          {selectedTeacher && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    معلم انتخاب شده: {selectedTeacher.first_name} {selectedTeacher.last_name}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {selectedTeacher.languages.join('، ')} • {selectedTeacher.experience_years} سال تجربه
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`/teachers/${selectedTeacher.id}/book`)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  رزرو کلاس
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Wallet Card */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <WalletCard 
              userType="student" 
              userId={currentUser.id} 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0"
            />
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-4 mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs font-medium">کلاس‌های تکمیل شده</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{analytics?.completedClasses || 0}</p>
                    <p className="text-green-100 text-xs sm:text-sm mt-1">
                      {analytics?.totalClasses === 0 ? 'هنوز کلاسی ندارید' : `از ${analytics?.totalClasses} کلاس`}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-medium">سطح فعلی</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{student.level || 'مبتدی'}</p>
                    <p className="text-blue-100 text-sm mt-1">
                      {progress?.progressPercentage === 0 ? 'شروع کنید' : `${progress?.progressPercentage}% تکمیل شده`}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs font-medium">امتیاز متوسط</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">
                      {analytics?.averageRating === 0 ? '-' : analytics?.averageRating}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4" />
                      <span className="text-sm text-purple-100">
                        {analytics?.averageRating === 0 ? 'هنوز امتیازی ندارید' : 'از 5'}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <Star className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-xs font-medium">امکانات فعال</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">6</p>
                    <p className="text-orange-100 text-sm mt-1">ویژگی جدید</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 text-xs font-medium">روزهای متوالی</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">{progress?.streak || 0}</p>
                    <p className="text-teal-100 text-sm mt-1">
                      {progress?.streak === 0 ? 'شروع کنید' : 'روز مطالعه'}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <Activity className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-auto p-1">
            <TabsTrigger value="overview" className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">نمای کلی</span>
              <span className="sm:hidden">نمای کلی</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">کلاس‌ها</span>
              <span className="sm:hidden">کلاس‌ها</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">پیشرفت</span>
              <span className="sm:hidden">پیشرفت</span>
            </TabsTrigger>
            <TabsTrigger value="gamification" className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">گیمیفیکیشن</span>
              <span className="sm:hidden">بازی</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">امکانات جدید</span>
              <span className="sm:hidden">امکانات</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">اعلان‌ها</span>
              <span className="sm:hidden">اعلان‌ها</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Quick Actions */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    اقدامات سریع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleOpenTeacherModal}
                      size="sm"
                      className="w-full h-10 sm:h-12 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>رزرو کلاس جدید</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => handleNavigation('/students/temp-user-id/video-call', 'پیوستن به کلاس آنلاین')}
                      size="sm"
                      className="w-full h-10 sm:h-12 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>کلاس آنلاین</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => handleNavigation('/students/progress', 'مشاهده پیشرفت')}
                      size="sm"
                      className="w-full h-10 sm:h-12 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>مشاهده پیشرفت</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => handleNavigation('/students/payments', 'مدیریت پرداخت‌ها')}
                      size="sm"
                      className="w-full h-10 sm:h-12 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>مدیریت پرداخت‌ها</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => handleNavigation('/students/profile', 'ویرایش پروفایل')}
                      size="sm"
                      className="w-full h-10 sm:h-12 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>ویرایش پروفایل</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => handleNavigation('/students/features', 'مشاهده همه امکانات')}
                      size="sm"
                      className="w-full h-10 sm:h-12 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>مشاهده همه امکانات</span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>



              {/* Progress Overview */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    پیشرفت هفتگی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">هدف هفتگی</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {progress?.weeklyProgress || 0}/{progress?.weeklyGoal || 2} کلاس
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(progress?.weeklyProgress || 0) / (progress?.weeklyGoal || 2) * 100} 
                        className="h-3 bg-gray-200 dark:bg-gray-700" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {Math.round((progress?.weeklyProgress || 0) / (progress?.weeklyGoal || 2) * 100)}%
                        </span>
                      </div>
                    </div>
                    {progress?.weeklyProgress === 0 && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                      >
                        برای شروع، اولین کلاس خود را رزرو کنید
                      </motion.p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {progress?.streak || 0}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">روز متوالی</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress?.completedLessons || 0}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">درس تکمیل شده</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    فعالیت‌های اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentBookings.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        هنوز فعالیتی ندارید
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        اولین کلاس خود را رزرو کنید و سفر یادگیری خود را آغاز کنید
                      </p>
                      <Button 
                        onClick={handleOpenTeacherModal}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        رزرو اولین کلاس
                      </Button>
                    </motion.div>
                  ) : (
                    recentBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          booking.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                          booking.status === 'confirmed' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          booking.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {booking.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : booking.status === 'confirmed' ? (
                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : booking.status === 'pending' ? (
                            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {booking.status === 'completed' ? 'کلاس تکمیل شد' :
                             booking.status === 'confirmed' ? 'کلاس تایید شد' :
                             booking.status === 'pending' ? 'کلاس در انتظار تایید' :
                             'وضعیت نامشخص'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(booking.created_at).toLocaleDateString('fa-IR')} - {booking.session_type === 'online' ? 'آنلاین' : 'حضوری'}
                          </p>
                        </div>
                      </motion.div>
                    ))
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
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">هنوز کلاسی ندارید</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">برای شروع یادگیری، یک معلم انتخاب کنید</p>
                    <Button 
                      onClick={handleOpenTeacherModal}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      مشاهده معلمان
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => {
                          // Navigate to video call page for this specific booking
                          if (userProfile?.id) {
                            router.push(`/students/${userProfile.id}/video-call?booking=${booking.id}`);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                {booking.student_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {booking.student_name}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>{new Date(booking.created_at).toLocaleDateString('fa-IR')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{booking.duration} دقیقه</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="w-4 h-4" />
                                  <span>{booking.total_price.toLocaleString()} تومان</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {booking.session_type === 'online' ? 'آنلاین' : 
                                   booking.session_type === 'offline' ? 'حضوری' : 
                                   booking.session_type === 'hybrid' ? 'ترکیبی' : booking.session_type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {booking.selected_days.join('، ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {booking.selected_hours.join('، ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-3">
                            {getStatusBadge(booking.status)}
                            
                            {/* Video Call Button - Only show for confirmed/active classes */}
                            {(booking.status === 'confirmed' || booking.status === 'scheduled') && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent parent click
                                  router.push(`/students/${userProfile?.id}/video-call?booking=${booking.id}`);
                                }}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm px-4 py-2 h-auto"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                {booking.status === 'confirmed' ? 'شروع کلاس' : 'آماده برای کلاس'}
                              </Button>
                            )}
                            
                            {/* Status-specific actions */}
                            {booking.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                در انتظار تایید
                              </Button>
                            )}
                            
                            {booking.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                تکمیل شده
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{booking.notes}</p>
                          </div>
                        )}
                        
                        {/* Quick Actions Row */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>کلیک کنید تا جزئیات کلاس را ببینید</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* View Details Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                                setShowBookingDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              جزئیات
                            </Button>
                            
                            {/* Reschedule Button - Only for confirmed/scheduled */}
                            {(booking.status === 'confirmed' || booking.status === 'scheduled') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Show reschedule modal or navigate to reschedule page
                                  console.log('Reschedule booking:', booking.id);
                                }}
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              >
                                <Calendar className="w-4 h-4 mr-1" />
                                تغییر زمان
                              </Button>
                            )}
                            
                            {/* Cancel Button - Only for pending/confirmed/scheduled */}
                            {['pending', 'confirmed', 'scheduled'].includes(booking.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Show cancel confirmation modal
                                  console.log('Cancel booking:', booking.id);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                لغو
                              </Button>
                            )}
                          </div>
                        </div>
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
                    onClick={handleOpenTeacherModal}
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
                        {analytics?.totalClasses === 0 ? '0%' : `${progress?.progressPercentage || 0}%`}
                      </span>
                    </div>
                    <Progress 
                      value={analytics?.totalClasses === 0 ? 0 : (progress?.progressPercentage || 0)} 
                      className="h-3" 
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {analytics?.totalClasses === 0 
                        ? 'هنوز درسی تکمیل نکرده‌اید' 
                        : `${progress?.completedLessons || 0} از ${progress?.totalLessons || 0} درس تکمیل شده`
                      }
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analytics?.totalClasses === 0 ? '0' : (progress?.streak || 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {analytics?.totalClasses === 0 ? 'روز متوالی' : 'روز متوالی'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analytics?.totalClasses === 0 ? '0' : (analytics?.improvementRate || 0)}%
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {analytics?.totalClasses || 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">کل کلاس‌ها</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {analytics?.studyTime || 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">ساعت مطالعه</div>
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
                    onClick={handleOpenTeacherModal}
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
                <CardContent className="p-4">
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
                <CardContent className="p-4">
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
                <CardContent className="p-4">
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
                <CardContent className="p-4">
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
                <CardContent className="p-4">
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
                <CardContent className="p-4">
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

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  جزئیات کلاس
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookingDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Class Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">وضعیت کلاس:</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>

                {/* Class Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">نوع جلسه:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedBooking.session_type === 'online' ? 'آنلاین' : 
                         selectedBooking.session_type === 'offline' ? 'حضوری' : 
                         selectedBooking.session_type === 'hybrid' ? 'ترکیبی' : selectedBooking.session_type}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">مدت زمان:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedBooking.duration} دقیقه
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">قیمت:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedBooking.total_price.toLocaleString()} تومان
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">روزهای انتخاب شده:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBooking.selected_days.map((day, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">ساعت‌های انتخاب شده:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBooking.selected_hours.map((hour, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hour}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">یادداشت‌ها:</span>
                    <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">تاریخ ایجاد:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedBooking.created_at).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">آخرین به‌روزرسانی:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedBooking.updated_at).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  {/* Video Call Button - Only for confirmed/scheduled classes */}
                  {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'scheduled') && (
                    <Button
                      onClick={() => {
                        if (userProfile?.id) {
                          router.push(`/students/${userProfile.id}/video-call?booking=${selectedBooking.id}`);
                          setShowBookingDetails(false);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {selectedBooking.status === 'confirmed' ? 'شروع کلاس' : 'آماده برای کلاس'}
                    </Button>
                  )}

                  {/* Reschedule Button */}
                  {['confirmed', 'scheduled'].includes(selectedBooking.status) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Show reschedule modal
                        console.log('Reschedule booking:', selectedBooking.id);
                      }}
                      className="flex-1"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      تغییر زمان
                    </Button>
                  )}

                  {/* Cancel Button */}
                  {['pending', 'confirmed', 'scheduled'].includes(selectedBooking.status) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Show cancel confirmation
                        console.log('Cancel booking:', selectedBooking.id);
                      }}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      لغو کلاس
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Teacher Selection Modal */}
      <TeacherSelectionModal
        isOpen={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
        onTeacherSelect={handleTeacherSelect}
      />
    </div>
  );
} 