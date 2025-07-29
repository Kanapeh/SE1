'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Filter
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

interface Schedule {
  id: string;
  teacher_id: string;
  day: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Teacher | Student | null>(null);
  const [userType, setUserType] = useState<'teacher' | 'student' | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Determine user type and get profile
  const getUserProfile = async (userEmail: string) => {
    try {
      // Check if user is a teacher
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (teacherData) {
        setUserType('teacher');
        setUserProfile(teacherData);
        return { type: 'teacher', profile: teacherData };
      }

      // Check if user is a student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (studentData) {
        setUserType('student');
        setUserProfile(studentData);
        return { type: 'student', profile: studentData };
      }

      // User not found in either table
      router.push('/register');
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // Fetch classes based on user type
  const fetchClasses = async (userId: string, type: 'teacher' | 'student') => {
    try {
      let query = supabase
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
        `);

      if (type === 'teacher') {
        query = query.eq('teacher_id', userId);
      } else {
        query = query.eq('student_id', userId);
      }

      const { data, error } = await query.order('class_date', { ascending: false });

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
  const calculateStats = (classesData: Class[], type: 'teacher' | 'student') => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalClasses = classesData.length;
    const completedClasses = classesData.filter(c => c.status === 'completed').length;
    
    let totalEarnings = 0;
    let totalSpent = 0;
    let thisMonthClasses = 0;
    let thisMonthEarnings = 0;

    classesData.forEach(cls => {
      const classDate = new Date(cls.class_date);
      const isThisMonth = classDate.getMonth() === thisMonth && classDate.getFullYear() === thisYear;

      if (type === 'teacher') {
        totalEarnings += cls.amount;
        if (isThisMonth) {
          thisMonthClasses++;
          thisMonthEarnings += cls.amount;
        }
      } else {
        totalSpent += cls.amount;
        if (isThisMonth) {
          thisMonthClasses++;
        }
      }
    });

    return {
      totalClasses,
      completedClasses,
      totalEarnings,
      totalSpent,
      averageRating: 4.8, // Placeholder
      thisMonthClasses,
      thisMonthEarnings
    };
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const profileData = await getUserProfile(user.email!);
        if (!profileData) return;

        const classesData = await fetchClasses(profileData.profile.id, profileData.type as 'teacher' | 'student');
        setClasses(classesData);

        if (profileData.type === 'teacher') {
          const scheduleData = await fetchSchedule(profileData.profile.id);
          setSchedule(scheduleData);
        }

        const statsData = calculateStats(classesData, profileData.type as 'teacher' | 'student');
        setStats(statsData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">داشبورد در حال آماده‌سازی است...</p>
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

  // Teacher Dashboard
  if (userType === 'teacher') {
    const teacher = userProfile as Teacher;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  داشبورد معلم
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  خوش آمدید {teacher.first_name} {teacher.last_name}
                </p>
              </div>
              <div className="flex gap-2">
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

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">درآمد کل</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalEarnings.toLocaleString()} تومان
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">کل کلاس‌ها</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClasses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">کلاس‌های تکمیل شده</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedClasses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">امتیاز متوسط</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  اقدامات سریع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => router.push('/teachers/schedule')}
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>مدیریت برنامه</span>
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/teachers/earnings')}
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <DollarSign className="w-6 h-6" />
                    <span>گزارش درآمد</span>
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/teachers/students')}
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <Users className="w-6 h-6" />
                    <span>دانش‌آموزان من</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
                    {classes.slice(0, 5).map((cls) => (
                      <div key={cls.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  const student = userProfile as Student;
  
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
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                داشبورد دانش‌آموز
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                خوش آمدید {student.first_name} {student.last_name}
              </p>
            </div>
            <div className="flex gap-2">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">کل رزروها</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClasses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">کلاس‌های تکمیل شده</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedClasses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">مجموع پرداختی</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalSpent.toLocaleString()} تومان
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">سطح فعلی</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{student.level || 'نامشخص'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                اقدامات سریع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => router.push('/teachers')}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <BookOpen className="w-6 h-6" />
                  <span>رزرو کلاس</span>
                </Button>
                
                <Button 
                  onClick={() => router.push('/students/progress')}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>پیشرفت من</span>
                </Button>
                
                <Button 
                  onClick={() => router.push('/students/payments')}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  <CreditCard className="w-6 h-6" />
                  <span>پرداخت‌ها</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  رزروهای اخیر
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">هنوز رزروی ندارید</h3>
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
                  {classes.slice(0, 5).map((cls) => (
                    <div key={cls.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 