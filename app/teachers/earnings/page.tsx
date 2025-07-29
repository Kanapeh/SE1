"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Clock,
  Users,
  Star,
  Eye
} from "lucide-react";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  hourly_rate: number | null;
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
  student: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
}

interface EarningsStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  totalClasses: number;
  completedClasses: number;
  averagePerClass: number;
  averageRating: number;
  topStudents: Array<{
    student_id: string;
    student_name: string;
    totalSpent: number;
    classCount: number;
  }>;
  monthlyData: Array<{
    month: string;
    earnings: number;
    classes: number;
  }>;
}

export default function TeacherEarningsPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'this_month' | 'last_month' | 'this_year'>('all');

  // Get current teacher
  const getCurrentTeacher = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return null;
      }

      const { data: teacherData, error } = await supabase
        .from('teachers')
        .select('id, first_name, last_name, email, hourly_rate')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error getting teacher:', error);
        router.push('/register');
        return null;
      }

      setTeacher(teacherData);
      return teacherData;
    } catch (error) {
      console.error('Error in getCurrentTeacher:', error);
      return null;
    }
  };

  // Fetch classes
  const fetchClasses = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
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

  // Calculate earnings statistics
  const calculateStats = (classesData: Class[]): EarningsStats => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    let totalEarnings = 0;
    let thisMonthEarnings = 0;
    let lastMonthEarnings = 0;
    let totalClasses = 0;
    let completedClasses = 0;

    // Monthly data for chart
    const monthlyData: { [key: string]: { earnings: number; classes: number } } = {};

    classesData.forEach(cls => {
      const classDate = new Date(cls.class_date);
      const classMonth = classDate.getMonth();
      const classYear = classDate.getFullYear();
      const monthKey = `${classYear}-${(classMonth + 1).toString().padStart(2, '0')}`;

      totalEarnings += cls.amount;
      totalClasses++;

      if (cls.status === 'completed') {
        completedClasses++;
      }

      // This month
      if (classMonth === thisMonth && classYear === thisYear) {
        thisMonthEarnings += cls.amount;
      }

      // Last month
      if (classMonth === lastMonth && classYear === lastMonthYear) {
        lastMonthEarnings += cls.amount;
      }

      // Monthly data
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { earnings: 0, classes: 0 };
      }
      monthlyData[monthKey].earnings += cls.amount;
      monthlyData[monthKey].classes++;
    });

    // Top students
    const studentStats: { [key: string]: { name: string; spent: number; count: number } } = {};
    classesData.forEach(cls => {
      const studentKey = cls.student_id;
      if (!studentStats[studentKey]) {
        studentStats[studentKey] = {
          name: `${cls.student.first_name} ${cls.student.last_name}`,
          spent: 0,
          count: 0
        };
      }
      studentStats[studentKey].spent += cls.amount;
      studentStats[studentKey].count++;
    });

    const topStudents = Object.entries(studentStats)
      .map(([student_id, data]) => ({
        student_id,
        student_name: data.name,
        totalSpent: data.spent,
        classCount: data.count
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Convert monthly data to array
    const monthlyDataArray = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        earnings: data.earnings,
        classes: data.classes
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalEarnings,
      thisMonthEarnings,
      lastMonthEarnings,
      totalClasses,
      completedClasses,
      averagePerClass: totalClasses > 0 ? totalEarnings / totalClasses : 0,
      averageRating: 4.8, // Placeholder
      topStudents,
      monthlyData: monthlyDataArray
    };
  };

  // Filter classes by period
  const getFilteredClasses = () => {
    if (selectedPeriod === 'all') return classes;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    return classes.filter(cls => {
      const classDate = new Date(cls.class_date);
      const classMonth = classDate.getMonth();
      const classYear = classDate.getFullYear();

      switch (selectedPeriod) {
        case 'this_month':
          return classMonth === thisMonth && classYear === thisYear;
        case 'last_month':
          return classMonth === lastMonth && classYear === lastMonthYear;
        case 'this_year':
          return classYear === thisYear;
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    const initialize = async () => {
      const teacherData = await getCurrentTeacher();
      if (!teacherData) return;

      const classesData = await fetchClasses(teacherData.id);
      setClasses(classesData);

      const statsData = calculateStats(classesData);
      setStats(statsData);
      
      setLoading(false);
    };

    initialize();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">گزارش درآمد در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!teacher || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">دسترسی محدود</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">فقط معلمان می‌توانند به این صفحه دسترسی داشته باشند</p>
            <Button 
              onClick={() => router.push('/register?type=teacher')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              ثبت‌نام به عنوان معلم
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filteredClasses = getFilteredClasses();

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
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  گزارش درآمد
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {teacher.first_name} {teacher.last_name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                دانلود گزارش
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
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">این ماه</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.thisMonthEarnings.toLocaleString()} تومان
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">میانگین هر کلاس</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(stats.averagePerClass).toLocaleString()} تومان
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">فیلتر بر اساس:</span>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'همه' },
                    { value: 'this_month', label: 'این ماه' },
                    { value: 'last_month', label: 'ماه گذشته' },
                    { value: 'this_year', label: 'امسال' }
                  ].map((period) => (
                    <Button
                      key={period.value}
                      variant={selectedPeriod === period.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period.value as any)}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Top Students */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                برترین دانش‌آموزان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topStudents.map((student, index) => (
                  <div key={student.student_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {student.student_name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {student.classCount} کلاس
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {student.totalSpent.toLocaleString()} تومان
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Chart Placeholder */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                نمودار ماهانه
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">نمودار ماهانه درآمد</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">به زودی اضافه خواهد شد</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  کلاس‌های اخیر
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  مشاهده همه
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredClasses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">کلاسی یافت نشد</h3>
                  <p className="text-gray-600 dark:text-gray-400">در این بازه زمانی کلاسی وجود ندارد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClasses.slice(0, 10).map((cls) => (
                    <div key={cls.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={cls.student.avatar || ''} alt={cls.student.first_name} />
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                              {cls.student.first_name[0]}{cls.student.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {cls.student.first_name} {cls.student.last_name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
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
                          <Badge variant={cls.status === 'completed' ? 'default' : 'secondary'}>
                            {cls.status === 'completed' ? 'تکمیل شده' : cls.status}
                          </Badge>
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