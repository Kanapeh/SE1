'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  Star,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  ArrowLeft,
  Eye,
  MoreHorizontal,
  Target,
  Award,
  Zap,
  Activity,
  Heart,
  Smile,
  AlertCircle,
  CheckCircle,
  XCircle,
  BookOpen,
  GraduationCap,
  Languages,
  MapPin,
  Clock3,
  UserCheck,
  UserX,
  CalendarDays,
  Clock4,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';

interface EarningRecord {
  id: string;
  date: string;
  amount: number;
  studentName: string;
  language: string;
  duration: number;
  status: 'completed' | 'pending' | 'cancelled';
  rating: number;
}

interface MonthlyEarnings {
  month: string;
  total: number;
  classes: number;
  students: number;
  averageRating: number;
}

interface LanguageEarnings {
  language: string;
  total: number;
  percentage: number;
  classes: number;
}

export default function TeacherEarningsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyEarnings[]>([]);
  const [languageData, setLanguageData] = useState<LanguageEarnings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock earnings data
    const mockEarnings: EarningRecord[] = [
      {
        id: '1',
        date: '2024-01-15',
        amount: 200000,
        studentName: 'سارا محمدی',
        language: 'انگلیسی',
        duration: 60,
        status: 'completed',
        rating: 5
      },
      {
        id: '2',
        date: '2024-01-14',
        amount: 180000,
        studentName: 'احمد رضایی',
        language: 'فرانسه',
        duration: 60,
        status: 'completed',
        rating: 4
      },
      {
        id: '3',
        date: '2024-01-13',
        amount: 220000,
        studentName: 'فاطمه کریمی',
        language: 'انگلیسی',
        duration: 90,
        status: 'completed',
        rating: 5
      },
      {
        id: '4',
        date: '2024-01-12',
        amount: 160000,
        studentName: 'علی احمدی',
        language: 'آلمانی',
        duration: 60,
        status: 'completed',
        rating: 4
      },
      {
        id: '5',
        date: '2024-01-11',
        amount: 200000,
        studentName: 'سارا محمدی',
        language: 'انگلیسی',
        duration: 60,
        status: 'completed',
        rating: 5
      },
      {
        id: '6',
        date: '2024-01-10',
        amount: 180000,
        studentName: 'احمد رضایی',
        language: 'فرانسه',
        duration: 60,
        status: 'pending',
        rating: 0
      }
    ];

    // Mock monthly data
    const mockMonthlyData: MonthlyEarnings[] = [
      { month: 'دی 1402', total: 2400000, classes: 12, students: 4, averageRating: 4.8 },
      { month: 'آذر 1402', total: 2200000, classes: 11, students: 4, averageRating: 4.7 },
      { month: 'آبان 1402', total: 2000000, classes: 10, students: 3, averageRating: 4.6 },
      { month: 'مهر 1402', total: 1800000, classes: 9, students: 3, averageRating: 4.5 }
    ];

    // Mock language data
    const mockLanguageData: LanguageEarnings[] = [
      { language: 'انگلیسی', total: 1200000, percentage: 50, classes: 6 },
      { language: 'فرانسه', total: 720000, percentage: 30, classes: 4 },
      { language: 'آلمانی', total: 480000, percentage: 20, classes: 2 }
    ];

    setEarnings(mockEarnings);
    setMonthlyData(mockMonthlyData);
    setLanguageData(mockLanguageData);
    setLoading(false);
  }, []);

  const totalEarnings = earnings.reduce((sum, record) => sum + record.amount, 0);
  const completedEarnings = earnings.filter(r => r.status === 'completed').reduce((sum, record) => sum + record.amount, 0);
  const pendingEarnings = earnings.filter(r => r.status === 'pending').reduce((sum, record) => sum + record.amount, 0);
  const totalClasses = earnings.length;
  const completedClasses = earnings.filter(r => r.status === 'completed').length;
  const averageRating = earnings.filter(r => r.rating > 0).reduce((sum, record) => sum + record.rating, 0) / earnings.filter(r => r.rating > 0).length;
  const uniqueStudents = new Set(earnings.map(r => r.studentName)).size;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">تکمیل شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">در انتظار</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">لغو شده</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week':
        return 'هفته جاری';
      case 'month':
        return 'ماه جاری';
      case 'quarter':
        return 'سه ماهه';
      case 'year':
        return 'سال جاری';
      default:
        return 'ماه جاری';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">گزارش درآمد در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

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
                onClick={() => router.push('/dashboard/teacher')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  گزارش درآمد
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  تحلیل کامل درآمد و عملکرد مالی شما
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">هفته جاری</SelectItem>
                  <SelectItem value="month">ماه جاری</SelectItem>
                  <SelectItem value="quarter">سه ماهه</SelectItem>
                  <SelectItem value="year">سال جاری</SelectItem>
                </SelectContent>
              </Select>
              <Button className="flex items-center gap-2">
                <Download className="w-4 h-4" />
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
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">درآمد کل</p>
                  <p className="text-2xl font-bold">{totalEarnings.toLocaleString()}</p>
                  <p className="text-green-100 text-sm">تومان</p>
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
                  <p className="text-blue-100 text-sm">کلاس‌های تکمیل شده</p>
                  <p className="text-2xl font-bold">{completedClasses}</p>
                  <p className="text-blue-100 text-sm">از {totalClasses} کلاس</p>
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
                  <p className="text-purple-100 text-sm">امتیاز متوسط</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
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
                  <p className="text-orange-100 text-sm">دانش‌آموزان فعال</p>
                  <p className="text-2xl font-bold">{uniqueStudents}</p>
                  <p className="text-orange-100 text-sm">دانش‌آموز</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Earnings Overview */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  روند درآمد - {getPeriodLabel(selectedPeriod)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Monthly Chart Placeholder */}
                  <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-dashed border-green-200 dark:border-green-800 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        نمودار روند درآمد
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        نمایش روند درآمد در {getPeriodLabel(selectedPeriod)}
                      </p>
                    </div>
                  </div>

                  {/* Language Distribution */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">توزیع درآمد بر اساس زبان</h4>
                    <div className="space-y-3">
                      {languageData.map((lang) => (
                        <div key={lang.language} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                            <span className="font-medium">{lang.language}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {lang.classes} کلاس
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {lang.total.toLocaleString()} تومان
                            </span>
                            <Badge variant="outline">{lang.percentage}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  آمار سریع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Completion Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">نرخ تکمیل کلاس‌ها</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round((completedClasses / totalClasses) * 100)}%
                    </span>
                  </div>
                  <Progress value={(completedClasses / totalClasses) * 100} className="h-2" />
                </div>

                {/* Pending vs Completed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">تکمیل شده</span>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {completedEarnings.toLocaleString()} تومان
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">در انتظار</span>
                    </div>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {pendingEarnings.toLocaleString()} تومان
                    </span>
                  </div>
                </div>

                {/* Top Languages */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">محبوب‌ترین زبان‌ها</h4>
                  <div className="space-y-2">
                    {languageData.slice(0, 3).map((lang, index) => (
                      <div key={lang.language} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm">{lang.language}</span>
                        </div>
                        <span className="text-sm font-medium">{lang.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                تراکنش‌های اخیر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earnings.slice(0, 6).map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {record.studentName}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{record.language}</span>
                          <span>{record.duration} دقیقه</span>
                          <span>{record.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {record.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{record.rating}</span>
                        </div>
                      )}
                      {getStatusBadge(record.status)}
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {record.amount.toLocaleString()} تومان
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}