"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  Languages,
  GraduationCap,
  Clock,
  Target,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  birthdate: string | null;
  address: string | null;
  language: string | null;
  level: string | null;
  class_type: string | null;
  preferred_time: string[] | null;
  goals: string | null;
  experience_years: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  education: string | null;
  occupation: string | null;
  available: boolean;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = params.id as string;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', studentId)
          .eq('status', 'active')
          .single();

        if (error) {
          console.error('Error fetching student:', error);
          setError('دانش‌آموز یافت نشد');
          return;
        }

        setStudent(data);
      } catch (error) {
        console.error('Error in fetchStudent:', error);
        setError('خطا در بارگذاری اطلاعات');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'دانش‌آموز یافت نشد'}
            </h1>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              بازگشت
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت
          </Button>
        </motion.div>

        {/* Student Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage src={student.avatar || ''} alt={`${student.first_name} ${student.last_name}`} />
                  <AvatarFallback className="text-3xl bg-white/20 text-white">
                    {student.first_name[0]}{student.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-right">
                  <h1 className="text-3xl font-bold mb-2">
                    {student.first_name} {student.last_name}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {student.level || 'نامشخص'}
                    </Badge>
                    {student.available && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-300/30">
                        فعال
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    اطلاعات شخصی
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">نام کامل</span>
                        <p className="font-medium">{student.first_name} {student.last_name}</p>
                      </div>
                    </div>

                    {student.occupation && (
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-purple-500" />
                        <div>
                          <span className="text-sm text-gray-500">شغل</span>
                          <p className="font-medium">{student.occupation}</p>
                        </div>
                      </div>
                    )}

                    {student.education && (
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        <div>
                          <span className="text-sm text-gray-500">تحصیلات</span>
                          <p className="font-medium">{student.education}</p>
                        </div>
                      </div>
                    )}

                    {student.birthdate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <div>
                          <span className="text-sm text-gray-500">تاریخ تولد</span>
                          <p className="font-medium">{new Date(student.birthdate).toLocaleDateString('fa-IR')}</p>
                        </div>
                      </div>
                    )}

                    {student.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <div>
                          <span className="text-sm text-gray-500">آدرس</span>
                          <p className="font-medium">{student.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Learning Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    اطلاعات یادگیری
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Languages className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">زبان</span>
                        <p className="font-medium">{student.language || 'نامشخص'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="text-sm text-gray-500">سطح</span>
                        <p className="font-medium">{student.level || 'نامشخص'}</p>
                      </div>
                    </div>

                    {student.experience_years && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <div>
                          <span className="text-sm text-gray-500">تجربه</span>
                          <p className="font-medium">{student.experience_years} سال</p>
                        </div>
                      </div>
                    )}

                    {student.class_type && (
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        <div>
                          <span className="text-sm text-gray-500">نوع کلاس</span>
                          <p className="font-medium">{student.class_type}</p>
                        </div>
                      </div>
                    )}

                    {student.preferred_time && student.preferred_time.length > 0 && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <div>
                          <span className="text-sm text-gray-500">زمان ترجیحی</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.preferred_time.map((time, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Goals */}
              {student.goals && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">اهداف یادگیری</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {student.goals}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  اطلاعات تماس
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">ایمیل</span>
                        <p className="font-medium">{student.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {student.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="text-sm text-gray-500">تلفن</span>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => router.push('/register?type=student')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  ثبت‌نام به عنوان دانش‌آموز
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => router.push('/teachers')}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  مشاهده معلمان
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}