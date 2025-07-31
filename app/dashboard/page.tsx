'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen,
  Users,
  GraduationCap,
  User,
  ArrowRight,
  Star,
  Calendar,
  DollarSign,
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

export default function DashboardSelectionPage() {
  const router = useRouter();

  const handleStudentDashboard = () => {
    router.push('/dashboard/student');
  };

  const handleTeacherDashboard = () => {
    router.push('/dashboard/teacher');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            انتخاب نوع داشبورد
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            لطفا نوع کاربری خود را انتخاب کنید
          </p>
        </motion.div>

        {/* Dashboard Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Student Dashboard Option */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className="h-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105"
              onClick={handleStudentDashboard}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-300">
                  داشبورد دانش‌آموز
                </CardTitle>
                <p className="text-green-600 dark:text-green-400">
                  برای دانش‌آموزانی که می‌خواهند زبان یاد بگیرند
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">رزرو کلاس با معلمان</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">مدیریت برنامه کلاس‌ها</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">پیگیری پیشرفت یادگیری</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">گواهینامه‌های آموزشی</span>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">کلاس‌های رزرو شده</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">600K</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">تومان پرداختی</div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3"
                  onClick={handleStudentDashboard}
                >
                  <span>ورود به داشبورد دانش‌آموز</span>
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teacher Dashboard Option */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105"
              onClick={handleTeacherDashboard}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  داشبورد معلم
                </CardTitle>
                <p className="text-blue-600 dark:text-blue-400">
                  برای معلمانی که می‌خواهند تدریس کنند
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">مدیریت دانش‌آموزان</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">تنظیم برنامه زمانی</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">گزارش درآمد و مالی</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">مدیریت امتیازات</span>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">کلاس‌های برگزار شده</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.4M</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">تومان درآمد</div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
                  onClick={handleTeacherDashboard}
                >
                  <span>ورود به داشبورد معلم</span>
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                اطلاعات مهم
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                هر نوع کاربری دارای امکانات و ویژگی‌های مخصوص به خود است. 
                لطفا نوع کاربری صحیح را انتخاب کنید تا بهترین تجربه را داشته باشید.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 