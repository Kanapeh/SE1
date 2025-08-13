'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VideoCall from '@/app/components/VideoCall';
import { 
  ArrowLeft,
  Video,
  Users,
  Clock,
  Calendar,
  BookOpen,
  User,
  Star,
  CheckCircle,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  level: string;
  language: string;
  goals: string | null;
  experience_years: number | null;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  hourly_rate: number;
  experience_years: number;
  languages: string[];
  specialties: string[];
  rating: number;
}

interface ClassSession {
  id: string;
  student_id: string;
  teacher_id: string;
  scheduled_time: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  subject: string;
  notes?: string;
  teacher?: Teacher;
}

export default function StudentVideoCallPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [currentClass, setCurrentClass] = useState<ClassSession | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock student data
    const mockStudent: Student = {
      id: studentId,
      first_name: 'سارا',
      last_name: 'محمدی',
      email: 'sara.mohammadi@example.com',
      phone: '09123456789',
      avatar: null,
      level: 'متوسط',
      language: 'انگلیسی',
      goals: 'یادگیری زبان انگلیسی برای کار و سفر',
      experience_years: 2
    };

    // Mock current class
    const mockClass: ClassSession = {
      id: 'class-1',
      student_id: studentId,
      teacher_id: 'teacher-1',
      scheduled_time: new Date().toISOString(),
      duration: 60,
      status: 'scheduled',
      subject: 'مکالمه انگلیسی سطح متوسط',
      notes: 'تمرکز روی مکالمه روزمره و اصلاح تلفظ',
      teacher: {
        id: 'teacher-1',
        first_name: 'احمد',
        last_name: 'رضایی',
        email: 'ahmad.rezaei@example.com',
        avatar: null,
        bio: 'استاد زبان انگلیسی با ۱۰ سال تجربه تدریس',
        hourly_rate: 150000,
        experience_years: 10,
        languages: ['انگلیسی', 'فرانسوی'],
        specialties: ['مکالمه', 'گرامر', 'آیلتس'],
        rating: 4.8
      }
    };

    setStudent(mockStudent);
    setCurrentClass(mockClass);
    setLoading(false);
  }, [studentId]);

  const handleCallStart = () => {
    setIsCallActive(true);
    if (currentClass) {
      setCurrentClass(prev => prev ? { ...prev, status: 'in_progress' } : null);
    }
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
    if (currentClass) {
      setCurrentClass(prev => prev ? { ...prev, status: 'completed' } : null);
    }
    // Redirect to student dashboard after call ends
    setTimeout(() => {
      router.push('/dashboard/student');
    }, 2000);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">برنامه‌ریزی شده</Badge>;
      case 'in_progress':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">در حال برگزاری</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">تکمیل شده</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">لغو شده</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">اتاق کلاس در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!student || !currentClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">کلاس یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">کلاس مورد نظر پیدا نشد یا لغو شده است</p>
            <Button 
              onClick={() => router.push('/dashboard/student')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              بازگشت به داشبورد
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCallActive) {
    return (
      <VideoCall
        isTeacher={false}
        teacherId={currentClass.teacher_id}
        studentId={studentId}
        classId={currentClass.id}
        onCallStart={handleCallStart}
        onCallEnd={handleCallEnd}
      />
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
                onClick={() => router.push('/dashboard/student')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  اتاق کلاس آنلاین
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  آماده پیوستن به کلاس با معلم
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Class Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Student Info */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                اطلاعات شما
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {student.first_name[0]}{student.last_name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {student.first_name} {student.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {student.email}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">سطح:</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {student.level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">زبان:</span>
                  <span className="text-sm font-medium">{student.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">تجربه:</span>
                  <span className="text-sm font-medium">{student.experience_years} سال</span>
                </div>
              </div>
              
              {student.goals && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">اهداف:</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {student.goals}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teacher Info */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                اطلاعات معلم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {currentClass.teacher?.first_name[0]}{currentClass.teacher?.last_name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentClass.teacher?.first_name} {currentClass.teacher?.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentClass.teacher?.bio}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">تجربه:</span>
                  <span className="text-sm font-medium">{currentClass.teacher?.experience_years} سال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">امتیاز:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{currentClass.teacher?.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">تخصص:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentClass.teacher?.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Details */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                جزئیات کلاس
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">موضوع:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentClass.subject}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">زمان:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {formatTime(currentClass.scheduled_time)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">مدت:</span>
                  <span className="text-sm font-medium">{currentClass.duration} دقیقه</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">وضعیت:</span>
                  {getStatusBadge(currentClass.status)}
                </div>
                
                {currentClass.notes && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">یادداشت معلم:</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {currentClass.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Join Class Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    آماده پیوستن به کلاس؟
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    معلم شما منتظر است. برای شروع کلاس آنلاین کلیک کنید.
                  </p>
                </div>
                
                <Button 
                  onClick={handleCallStart}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-semibold"
                >
                  <Video className="w-6 h-6 mr-2" />
                  پیوستن به کلاس
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>دوربین آماده</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>میکروفن آماده</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
