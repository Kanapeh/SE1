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
  AlertCircle
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

export default function TeacherVideoCallPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id as string;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [currentClass, setCurrentClass] = useState<ClassSession | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherAndClassData = async () => {
      try {
        setLoading(true);
        
        // Get current logged-in user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('Error getting current user:', authError);
          return;
        }

        console.log('Current user:', user.email);
        console.log('Teacher ID from URL:', teacherId);
        
        // Fetch teacher data from database
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', teacherId)
          .single();

        console.log('Teacher query result:', { teacherData, teacherError });

        if (teacherError) {
          console.error('Error fetching teacher:', teacherError);
          return;
        }

        if (teacherData) {
          console.log('Setting teacher data:', teacherData);
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
            rating: 0, // Will be calculated later
            total_students: 0, // Will be calculated later
            total_classes: 0, // Will be calculated later
            availability: teacherData.available_days || []
          });
        }

        // Fetch current logged-in student data
        let { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();

        if (studentError) {
          console.error('Error fetching student:', studentError);
          // Try to find student by email if id doesn't match
          const { data: studentByEmail, error: emailError } = await supabase
            .from('students')
            .select('*')
            .eq('email', user.email)
            .single();
          
          if (emailError) {
            console.error('Error fetching student by email:', emailError);
            // Create a default student if none found
            const defaultStudent = {
              id: user.id,
              first_name: 'دانش‌آموز',
              last_name: 'فعلی',
              email: user.email || 'unknown@example.com',
              avatar: null,
              level: 'متوسط',
              language: 'انگلیسی'
            };
            
            // Create default class with current student
            const defaultClass: ClassSession = {
              id: `class-${teacherId}-${Date.now()}`,
              student_id: user.id,
              teacher_id: teacherId,
              scheduled_time: new Date().toISOString(),
              duration: 60,
              status: 'scheduled',
              subject: 'کلاس آنلاین',
              notes: 'کلاس آنلاین با معلم',
              student: defaultStudent
            };
            setCurrentClass(defaultClass);
            return;
          }
          
          if (studentByEmail) {
            studentData = studentByEmail;
          }
        }

        if (studentData) {
          // Fetch or create class session for current student and teacher
          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('*')
            .eq('teacher_id', teacherId)
            .eq('student_id', studentData.id)
            .eq('status', 'scheduled')
            .gte('scheduled_time', new Date().toISOString())
            .order('scheduled_time', { ascending: true })
            .limit(1)
            .single();

          if (classError) {
            console.log('No existing class found, creating default class');
            // Create a new class session for current student
            const newClass: ClassSession = {
              id: `class-${teacherId}-${studentData.id}-${Date.now()}`,
              student_id: studentData.id,
              teacher_id: teacherId,
              scheduled_time: new Date().toISOString(),
              duration: 60,
              status: 'scheduled',
              subject: 'کلاس آنلاین',
              notes: 'کلاس آنلاین با معلم',
              student: {
                id: studentData.id,
                first_name: studentData.first_name,
                last_name: studentData.last_name,
                email: studentData.email,
                avatar: studentData.avatar,
                level: studentData.education_level || 'متوسط',
                language: studentData.preferred_languages?.[0] || 'انگلیسی'
              }
            };
            setCurrentClass(newClass);
          } else if (classData) {
            // Use existing class data
            const currentClassData: ClassSession = {
              id: classData.id,
              student_id: classData.student_id,
              teacher_id: classData.teacher_id,
              scheduled_time: classData.scheduled_time,
              duration: classData.duration,
              status: classData.status as any,
              subject: classData.subject || 'کلاس آنلاین',
              notes: classData.notes || 'کلاس آنلاین',
              student: {
                id: studentData.id,
                first_name: studentData.first_name,
                last_name: studentData.last_name,
                email: studentData.email,
                avatar: studentData.avatar,
                level: studentData.education_level || 'متوسط',
                language: studentData.preferred_languages?.[0] || 'انگلیسی'
              }
            };
            setCurrentClass(currentClassData);
          }
        }
      } catch (error) {
        console.error('Error in fetchTeacherAndClassData:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherAndClassData();
    }
  }, [teacherId]);

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
    // Redirect to teacher dashboard after call ends
    setTimeout(() => {
      router.push(`/teachers/${teacherId}`);
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">اتاق کلاس در حال آماده‌سازی است...</p>
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
              onClick={() => router.push(`/teachers/${teacherId}`)}
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
