'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  bio: string | null;
  hourly_rate: number;
  experience_years: number;
  languages: string[];
  specialties: string[];
  rating: number;
  total_students: number;
  total_classes: number;
  availability: string[];
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  level: string;
  language: string;
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
  student?: Student;
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

export default function TeacherVideoCallPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const teacherId = params?.id as string;
  const bookingId = searchParams?.get('booking');

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [currentClass, setCurrentClass] = useState<ClassSession | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const fetchTeacherAndClassData = async () => {
      try {
        setLoading(true);
        setError(null);
        addDebugInfo('شروع بارگذاری اطلاعات کلاس');

        if (!teacherId || !bookingId) {
          setError('شناسه معلم یا کلاس یافت نشد');
          setLoading(false);
          return;
        }

        addDebugInfo(`درخواست برای معلم: ${teacherId} و کلاس: ${bookingId}`);

        // Fetch teacher data
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', teacherId)
          .maybeSingle();

        if (teacherError) {
          console.error('Error fetching teacher:', teacherError);
          setError(`خطا در دریافت اطلاعات معلم: ${teacherError.message}`);
          setLoading(false);
          return;
        }

        if (!teacherData) {
          setError('اطلاعات معلم یافت نشد');
          setLoading(false);
          return;
        }

        addDebugInfo('اطلاعات معلم دریافت شد');
        setTeacher({
          id: teacherData.id,
          first_name: teacherData.first_name,
          last_name: teacherData.last_name,
          email: teacherData.email,
          phone: teacherData.phone,
          avatar: teacherData.avatar,
          bio: teacherData.bio,
          hourly_rate: teacherData.hourly_rate || 0,
          experience_years: teacherData.experience_years || 0,
          languages: teacherData.languages || [],
          specialties: teacherData.teaching_methods || [],
          rating: teacherData.rating || 0,
          total_students: 0,
          total_classes: 0,
          availability: teacherData.available_days || []
        });

        // Fetch booking data
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .maybeSingle();

        if (bookingError) {
          console.error('Error fetching booking:', bookingError);
          setError(`خطا در دریافت اطلاعات کلاس: ${bookingError.message}`);
          setLoading(false);
          return;
        }

        if (!bookingData) {
          setError('اطلاعات کلاس یافت نشد');
          setLoading(false);
          return;
        }

        addDebugInfo('اطلاعات کلاس دریافت شد');

        // Fetch student data using API
        const studentResponse = await fetch(`/api/students?student_id=${bookingData.student_id}`);
        const studentResult = await studentResponse.json();

        if (!studentResponse.ok || !studentResult.student) {
          console.error('Error fetching student:', studentResult.error);
          setError(`خطا در دریافت اطلاعات دانشجو: ${studentResult.error || 'Student not found'}`);
          setLoading(false);
          return;
        }

        const studentData = studentResult.student;

        addDebugInfo('اطلاعات دانشجو دریافت شد');

        // Create class session from booking data
        const classSession: ClassSession = {
          id: bookingData.id,
          student_id: bookingData.student_id,
          teacher_id: bookingData.teacher_id,
          scheduled_time: bookingData.created_at,
          duration: bookingData.duration,
          status: bookingData.status === 'confirmed' ? 'scheduled' : bookingData.status,
          subject: `کلاس ${studentData.first_name} ${studentData.last_name}`,
          notes: bookingData.notes,
          student: {
            id: studentData.id,
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            email: studentData.email,
            avatar: studentData.avatar,
            level: studentData.current_language_level || 'متوسط',
            language: studentData.preferred_languages?.[0] || 'انگلیسی'
          }
        };

        setCurrentClass(classSession);
        addDebugInfo('کلاس با موفقیت ایجاد شد');

      } catch (error) {
        console.error('Error in fetchTeacherAndClassData:', error);
        setError(`خطای غیرمنتظره: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId && bookingId) {
      fetchTeacherAndClassData();
    } else {
      setError('اطلاعات کافی برای بارگذاری موجود نیست');
      setLoading(false);
    }
  }, [teacherId, bookingId]);

  const handleCallStart = async () => {
    setIsCallActive(true);
    if (currentClass) {
      setCurrentClass(prev => prev ? { ...prev, status: 'in_progress' } : null);
    }

    // Create notification for video call start
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          user_id: teacherId,
          type: 'success',
          title: 'تماس تصویری شروع شد',
          message: `تماس تصویری با ${currentClass?.student.first_name} ${currentClass?.student.last_name} شروع شد`,
        }),
      });

      if (response.ok) {
        console.log('✅ Video call notification created');
      } else {
        console.error('❌ Failed to create video call notification');
      }
    } catch (error) {
      console.error('❌ Error creating video call notification:', error);
    }
  };

  const handleCallEnd = async () => {
    setIsCallActive(false);
    if (currentClass) {
      setCurrentClass(prev => prev ? { ...prev, status: 'completed' } : null);
    }

    // Create notification for video call end
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          user_id: teacherId,
          type: 'info',
          title: 'تماس تصویری پایان یافت',
          message: `تماس تصویری با ${currentClass?.student.first_name} ${currentClass?.student.last_name} پایان یافت`,
        }),
      });

      if (response.ok) {
        console.log('✅ Video call end notification created');
      } else {
        console.error('❌ Failed to create video call end notification');
      }
    } catch (error) {
      console.error('❌ Error creating video call end notification:', error);
    }

    // Redirect to teacher dashboard after call ends
    setTimeout(() => {
      router.push('/dashboard/teacher');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری اطلاعات کلاس</h3>
          <p className="text-gray-600 dark:text-gray-400">لطفاً صبر کنید...</p>
          {bookingId && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              شناسه کلاس: {bookingId}
            </p>
          )}
          
          {/* Debug Info */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-md mx-auto">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">اطلاعات دیباگ:</p>
            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1 max-h-32 overflow-y-auto">
              {debugInfo.length === 0 ? (
                <p>در حال شروع...</p>
              ) : (
                debugInfo.map((info, index) => (
                  <div key={index} className="font-mono">{info}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md mx-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">خطا در بارگذاری</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <Loader2 className="w-4 h-4 mr-2" />
                تلاش مجدد
              </Button>
              
              <Button 
                onClick={() => router.push('/dashboard/teacher')}
                variant="outline"
                className="w-full"
              >
                بازگشت به داشبورد
              </Button>
            </div>
            {bookingId && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                شناسه کلاس: {bookingId}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!teacher || !currentClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">کلاس یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">کلاس مورد نظر پیدا نشد یا لغو شده است</p>
            <Button 
              onClick={() => router.push('/dashboard/teacher')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
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
        isTeacher={true}
        teacherId={teacherId}
        studentId={currentClass.student_id}
        classId={currentClass.id}
        teacherName={`${teacher?.first_name} ${teacher?.last_name}`}
        studentName={`${currentClass.student.first_name} ${currentClass.student.last_name}`}
        onCallStart={handleCallStart}
        onCallEnd={handleCallEnd}
      />
    );
  }

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
                onClick={() => router.push(`/teachers/${teacherId}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  اتاق کلاس آنلاین
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  آماده برگزاری کلاس با دانش‌آموز
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
                    {teacher.first_name[0]}{teacher.last_name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {teacher.first_name} {teacher.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {teacher.bio}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">تجربه:</span>
                  <span className="text-sm font-medium">{teacher.experience_years} سال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">امتیاز:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{teacher.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">کل کلاس‌ها:</span>
                  <span className="text-sm font-medium">{teacher.total_classes}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                اطلاعات دانش‌آموز
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {currentClass.student?.first_name[0]}{currentClass.student?.last_name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentClass.student?.first_name} {currentClass.student?.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentClass.student?.email}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">سطح:</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {currentClass.student?.level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">زبان:</span>
                  <span className="text-sm font-medium">{currentClass.student?.language}</span>
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
                    <Clock className="w-4 h-4 text-blue-500" />
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">یادداشت:</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {currentClass.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Class Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    آماده شروع کلاس؟
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    دانش‌آموز منتظر شماست. برای شروع کلاس آنلاین کلیک کنید.
                  </p>
                </div>
                
                <Button 
                  onClick={handleCallStart}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold"
                >
                  <Video className="w-6 h-6 mr-2" />
                  شروع کلاس آنلاین
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
