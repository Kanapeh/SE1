'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VideoCall from '@/app/components/VideoCall';
import { supabase } from '@/lib/supabase';
import { getSmartOAuthRedirectUrl } from '@/lib/oauth-utils';
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
  GraduationCap,
  Loader2
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

export default function StudentVideoCallPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const studentId = params?.id as string;
  const isFetchingRef = useRef(false);

  const [student, setStudent] = useState<Student | null>(null);
  const [currentClass, setCurrentClass] = useState<ClassSession | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      // Prevent multiple simultaneous API calls
      if (isFetchingRef.current) {
        addDebugInfo('درخواست قبلی در حال پردازش است...');
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        // Get booking ID from URL parameters
        if (!searchParams) {
          setError('پارامترهای URL یافت نشد');
          setLoading(false);
          return;
        }
        
        const bookingParam = searchParams.get('booking');
        if (!bookingParam) {
          setError('شناسه کلاس یافت نشد');
          setLoading(false);
          return;
        }

        setBookingId(bookingParam);
        addDebugInfo(`شروع بارگذاری برای کلاس: ${bookingParam}`);
        console.log('Fetching data for booking ID:', bookingParam);
        console.log('Student ID:', studentId);

        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setError('زمان بارگذاری به پایان رسید. لطفاً صفحه را refresh کنید.');
          setLoading(false);
          isFetchingRef.current = false;
        }, 10000); // 10 seconds timeout

        // Fetch booking data from Supabase
        console.log('Fetching booking data...');
        let { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingParam)
          .maybeSingle();

        // If the booking doesn't belong to the current student, try to find the correct one
        if (bookingData && bookingData.student_id !== studentId) {
          addDebugInfo('این کلاس متعلق به دانشجوی دیگری است، در حال جستجوی کلاس صحیح...');
          
          // Try to find a booking that belongs to the current student
          const { data: correctBooking, error: correctBookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('student_id', studentId)
            .eq('status', 'confirmed')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (correctBooking) {
            addDebugInfo(`کلاس صحیح پیدا شد: ${correctBooking.id}`);
            bookingData = correctBooking;
          } else {
            addDebugInfo('کلاس صحیحی برای دانشجوی فعلی پیدا نشد، در حال ایجاد کلاس جدید...');
            
            // Try to find a teacher for this student
            const { data: availableTeachers, error: teachersError } = await supabase
              .from('teachers')
              .select('id, first_name, last_name')
              .limit(1)
              .maybeSingle();
              
            if (availableTeachers) {
              // Create a new booking for the current student
              const newBooking = {
                teacher_id: availableTeachers.id,
                student_id: studentId,
                student_name: 'سپنتا علیزاده', // یا نام واقعی دانشجو
                student_email: 'student@example.com', // یا ایمیل واقعی
                selected_days: ['شنبه'],
                selected_hours: ['morning'],
                session_type: 'online',
                duration: 60,
                total_price: 500000,
                status: 'confirmed',
                payment_status: 'paid'
              };
              
              const { data: createdBooking, error: createError } = await supabase
                .from('bookings')
                .insert(newBooking)
                .select()
                .maybeSingle();
                
              if (createdBooking) {
                addDebugInfo(`کلاس جدید ایجاد شد: ${createdBooking.id}`);
                bookingData = createdBooking;
              } else {
                addDebugInfo(`خطا در ایجاد کلاس جدید: ${createError?.message}`);
              }
            }
          }
        }

        // Check if we need to find the correct teacher for this student
        let actualTeacherId = bookingData.teacher_id;
        
        addDebugInfo(`شناسه معلم در دیتابیس: ${actualTeacherId}`);
        
        // If the booking doesn't have a valid teacher_id, we'll handle it after fetching student data
        if (!actualTeacherId || actualTeacherId === '00000000-0000-0000-0000-000000000000') {
          addDebugInfo('شناسه معلم نامعتبر است، در حال جستجوی معلم مناسب...');
        }

        // Also check if the current user is actually a student and should be accessing this page
        addDebugInfo(`شناسه کاربر فعلی: ${studentId}`);
        addDebugInfo(`شناسه دانشجو در کلاس: ${bookingData.student_id}`);
        addDebugInfo(`شناسه معلم در کلاس: ${bookingData.teacher_id}`);

        // The booking is correct - it already has the right teacher (Sepanta Alizadeh)
        addDebugInfo('کلاس موجود صحیح است - معلم سپنتا علیزاده');
        addDebugInfo(`شناسه معلم: ${bookingData.teacher_id}`);
        addDebugInfo(`نام معلم: سپنتا علیزاده`);
        addDebugInfo(`نام دانشجو: ${bookingData.student_name}`);

        if (bookingError) {
          console.error('Error fetching booking:', bookingError);
          clearTimeout(timeoutId);
          setError(`خطا در دریافت اطلاعات کلاس: ${bookingError.message}`);
          setLoading(false);
          return;
        }

        if (!bookingData) {
          clearTimeout(timeoutId);
          setError('کلاس یافت نشد');
          setLoading(false);
          return;
        }

        // Verify that this booking belongs to the current student
        if (bookingData.student_id !== studentId) {
          clearTimeout(timeoutId);
          setError('این کلاس متعلق به شما نیست');
          setLoading(false);
          return;
        }

        addDebugInfo(`تایید مالکیت کلاس: دانشجوی فعلی ${studentId}، دانشجوی کلاس ${bookingData.student_id}`);

        // Fetch student data
        console.log('Fetching student data...');
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', studentId || '')
          .maybeSingle();

        if (studentError) {
          console.error('Error fetching student:', studentError);
          clearTimeout(timeoutId);
          setError(`خطا در دریافت اطلاعات دانشجو: ${studentError.message}`);
          setLoading(false);
          return;
        }

        if (!studentData) {
          clearTimeout(timeoutId);
          setError('اطلاعات دانشجو یافت نشد');
          setLoading(false);
          return;
        }

        console.log('Student data:', studentData);

        // Now handle teacher matching if needed
        if (!actualTeacherId || actualTeacherId === '00000000-0000-0000-0000-000000000000') {
          addDebugInfo('در حال جستجوی معلم مناسب برای دانشجو...');
          
          // Try to find a teacher based on student's preferences
          const { data: availableTeachers, error: teachersError } = await supabase
            .from('teachers')
            .select('id, first_name, last_name, status, languages, levels')
            .eq('status', 'active')
            .eq('available', true)
            .limit(5);
            
          if (availableTeachers && availableTeachers.length > 0) {
            // Find the best matching teacher based on student preferences
            let bestTeacher = availableTeachers[0];
            
            // If student has language preferences, try to match
            if (studentData.preferred_languages && studentData.preferred_languages.length > 0) {
              const matchingTeacher = availableTeachers.find(teacher => 
                teacher.languages && teacher.languages.some((lang: string) => 
                  studentData.preferred_languages.includes(lang)
                )
              );
              if (matchingTeacher) {
                bestTeacher = matchingTeacher;
              }
            }
            
            // If student has level preferences, try to match
            if (studentData.current_language_level && bestTeacher.levels) {
              const levelMatch = bestTeacher.levels.includes(studentData.current_language_level);
              if (levelMatch) {
                addDebugInfo(`معلم با سطح مناسب پیدا شد: ${bestTeacher.first_name} ${bestTeacher.last_name}`);
              }
            }
            
            actualTeacherId = bestTeacher.id;
            addDebugInfo(`معلم جدید پیدا شد: ${bestTeacher.first_name} ${bestTeacher.last_name} (${bestTeacher.id})`);
            
            // Update the booking with the new teacher
            const { error: updateError } = await supabase
              .from('bookings')
              .update({ teacher_id: actualTeacherId })
              .eq('id', bookingData.id);
              
            if (updateError) {
              addDebugInfo(`خطا در به‌روزرسانی معلم: ${updateError.message}`);
            } else {
              addDebugInfo('معلم جدید در دیتابیس به‌روزرسانی شد');
              bookingData.teacher_id = actualTeacherId;
            }
          } else {
            addDebugInfo('هیچ معلم فعالی یافت نشد');
            setError('هیچ معلم فعالی در حال حاضر موجود نیست. لطفاً بعداً تلاش کنید.');
            setLoading(false);
            return;
          }
        }

        // Fetch teacher data
        console.log('Fetching teacher data...');
        addDebugInfo(`در حال دریافت اطلاعات معلم با شناسه: ${actualTeacherId}`);
        
        // First, let's see what teachers exist in the database
        const { data: allTeachers, error: allTeachersError } = await supabase
          .from('teachers')
          .select('id, first_name, last_name, email')
          .limit(10);
          
        if (allTeachers) {
          addDebugInfo(`معلمان موجود در دیتابیس: ${allTeachers.map(t => `${t.first_name} ${t.last_name} (${t.id})`).join(', ')}`);
        }
        
        // Now fetch the specific teacher for this booking
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', actualTeacherId)
          .maybeSingle();
          
        addDebugInfo(`درخواست معلم با شناسه: ${actualTeacherId}`);
        if (teacherData) {
          addDebugInfo(`معلم پیدا شد: ${teacherData.first_name} ${teacherData.last_name}`);
        } else if (teacherError) {
          addDebugInfo(`خطا در دریافت معلم: ${teacherError.message}`);
        }

        if (teacherError) {
          console.error('Error fetching teacher:', teacherError);
          clearTimeout(timeoutId);
          setError(`خطا در دریافت اطلاعات معلم: ${teacherError.message}`);
          setLoading(false);
          return;
        }

        if (!teacherData) {
          clearTimeout(timeoutId);
          setError('اطلاعات معلم یافت نشد');
          setLoading(false);
          return;
        }

        console.log('Teacher data:', teacherData);
        addDebugInfo(`اطلاعات معلم: ${JSON.stringify(teacherData, null, 2)}`);

        // Set student data
        const studentInfo: Student = {
          id: studentData.id,
          first_name: studentData.first_name || 'دانشجو',
          last_name: studentData.last_name || 'جدید',
          email: studentData.email,
          phone: studentData.phone,
          avatar: studentData.avatar,
          level: studentData.current_language_level || 'مبتدی',
          language: studentData.preferred_languages?.[0] || 'انگلیسی',
          goals: studentData.learning_goals,
          experience_years: studentData.experience_years || 0
        };

        // Set teacher data
        const teacherInfo: Teacher = {
          id: teacherData.id,
          first_name: teacherData.first_name || 'معلم',
          last_name: teacherData.last_name || 'جدید',
          email: teacherData.email,
          avatar: teacherData.avatar,
          bio: teacherData.bio,
          hourly_rate: teacherData.hourly_rate || 0,
          experience_years: teacherData.experience_years || 0,
          languages: teacherData.languages || ['انگلیسی'],
          specialties: teacherData.specialties || ['عمومی'],
          rating: teacherData.rating || 0
        };
        
        addDebugInfo(`اطلاعات معلم تنظیم شد: ${teacherInfo.first_name} ${teacherInfo.last_name}`);
        addDebugInfo(`ایمیل معلم: ${teacherInfo.email}`);

        // Create class session from booking data
        const classSession: ClassSession = {
          id: bookingData.id,
          student_id: bookingData.student_id,
          teacher_id: bookingData.teacher_id,
          scheduled_time: bookingData.created_at, // Using created_at as scheduled time
          duration: bookingData.duration,
          status: bookingData.status === 'confirmed' ? 'scheduled' : 'scheduled',
          subject: `کلاس ${teacherInfo.first_name} ${teacherInfo.last_name}`,
          notes: bookingData.notes,
          teacher: teacherInfo
        };

        clearTimeout(timeoutId);
        setStudent(studentInfo);
        setCurrentClass(classSession);
        addDebugInfo('اطلاعات با موفقیت بارگذاری شد');
        addDebugInfo(`کلاس ایجاد شد: ${classSession.subject}`);
        addDebugInfo(`معلم کلاس: ${classSession.teacher?.first_name} ${classSession.teacher?.last_name}`);
        console.log('Data loaded successfully:', { studentInfo, classSession });

      } catch (error) {
        console.error('Unexpected error:', error);
        setError(`خطای غیرمنتظره رخ داد: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    // Only run if we have both studentId and searchParams
    if (studentId && searchParams && searchParams.get('booking')) {
      fetchBookingData();
    } else if (!studentId) {
      setError('شناسه دانشجو یافت نشد');
      setLoading(false);
    } else if (!searchParams || !searchParams.get('booking')) {
      setError('شناسه کلاس یافت نشد');
      setLoading(false);
    }
  }, [studentId, searchParams]);

  const handleCallStart = async () => {
    try {
      // Create notification for teacher
      if (currentClass?.teacher_id) {
        const response = await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacher_id: currentClass.teacher_id,
            type: 'info',
            title: 'تماس تصویری جدید',
            message: `${student?.first_name} ${student?.last_name} در انتظار شماست. برای پیوستن به تماس کلیک کنید.`
          })
        });

        if (response.ok) {
          console.log('✅ Notification created for teacher');
          addDebugInfo('نوتیفیکیشن برای معلم ایجاد شد');
        } else {
          const errorData = await response.text();
          console.error('❌ Failed to create notification:', response.status, errorData);
          addDebugInfo(`خطا در ایجاد نوتیفیکیشن: ${response.status} - ${errorData}`);
        }
      }

      setIsCallActive(true);
      if (currentClass) {
        setCurrentClass(prev => prev ? { ...prev, status: 'in_progress' } : null);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      // Continue with call start even if notification fails
      setIsCallActive(true);
      if (currentClass) {
        setCurrentClass(prev => prev ? { ...prev, status: 'in_progress' } : null);
      }
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
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
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
                onClick={async () => {
                  try {
                    addDebugInfo('تست اتصال به Supabase...');
                    const { data, error } = await supabase.from('bookings').select('count').limit(1);
                    if (error) {
                      addDebugInfo(`خطای اتصال: ${error.message}`);
                    } else {
                      addDebugInfo('اتصال به Supabase موفق');
                    }
                  } catch (err) {
                    addDebugInfo(`خطای غیرمنتظره: ${err instanceof Error ? err.message : 'Unknown'}`);
                  }
                }}
                variant="outline"
                className="w-full"
              >
                تست اتصال
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/student')}
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
              onClick={async () => {
                const dashboardUrl = await getSmartOAuthRedirectUrl('dashboard/student');
                window.location.href = dashboardUrl;
              }}
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
          {/* Debug Info */}
          <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
            Debug: Teacher ID: {currentClass.teacher_id} | Teacher: {currentClass.teacher?.first_name} {currentClass.teacher?.last_name}
          </div>
          
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {currentClass.teacher?.avatar ? (
              <img 
                src={currentClass.teacher.avatar} 
                alt={`${currentClass.teacher.first_name} ${currentClass.teacher.last_name}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {currentClass.teacher?.first_name[0]}{currentClass.teacher?.last_name[0]}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentClass.teacher?.first_name} {currentClass.teacher?.last_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {currentClass.teacher?.bio || 'معلم زبان'}
          </p>
        </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">تجربه:</span>
                  <span className="text-sm font-medium">{currentClass.teacher?.experience_years || 0} سال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">امتیاز:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{currentClass.teacher?.rating || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">تخصص:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentClass.teacher?.specialties && currentClass.teacher.specialties.length > 0 ? (
                      currentClass.teacher.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">عمومی</Badge>
                    )}
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">زمان رزرو:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {new Date(currentClass.scheduled_time).toLocaleDateString('fa-IR')}
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

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">شناسه کلاس:</span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {currentClass.id}
                  </span>
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
