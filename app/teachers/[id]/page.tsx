"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  ArrowLeft,
  Calendar,
  Award,
  Languages,
  BookOpen,
  Users,
  CheckCircle,
  Video,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

interface Review {
  id: string;
  teacher_id: string;
  student_id: string | null;
  student_name: string;
  student_email: string | null;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch teacher from Supabase
  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching teacher:', error);
        }
        return;
      }

      setTeacher(data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in fetchTeacher:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews from Supabase
  const fetchReviews = async () => {
    if (!params.id) return;
    
    try {
      setReviewsLoading(true);
      const { data, error } = await supabase
        .from('teacher_reviews')
        .select('*')
        .eq('teacher_id', params.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching reviews:', error);
        }
        return;
      }

      setReviews(data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in fetchReviews:', error);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTeacher();
      fetchReviews();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/teachers');
  };

  const handleBookSession = () => {
    // Navigate to booking page
    router.push(`/teachers/${params.id}/book`);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">معلم یافت نشد</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">معلم مورد نظر شما وجود ندارد</p>
          <Button onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            بازگشت به لیست معلمان
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به لیست معلمان
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            پروفایل معلم
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teacher Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 border-4 border-white">
                      <AvatarImage src={teacher.avatar || ''} alt={`${teacher.first_name} ${teacher.last_name}`} />
                      <AvatarFallback className="text-2xl bg-white text-blue-600">
                        {teacher.first_name[0]}{teacher.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        {teacher.first_name} {teacher.last_name}
                      </h2>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-300 fill-current" />
                          <span className="font-medium">4.8</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="w-5 h-5" />
                          <span>دانش‌آموز</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-5 h-5" />
                          <span>{teacher.experience_years || 0} سال تجربه</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {teacher.levels && teacher.levels.map((level, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-white/30">
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  {/* Languages */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Languages className="w-5 h-5 text-blue-500" />
                      زبان‌های تدریس
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {teacher.languages.map((lang, idx) => (
                        <Badge key={idx} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">درباره معلم</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {teacher.bio || 'توضیحات در دسترس نیست'}
                    </p>
                  </div>

                  {/* Education */}
                  {teacher.education && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-500" />
                        تحصیلات
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {teacher.education}
                      </p>
                    </div>
                  )}

                  {/* Teaching Methods */}
                  {teacher.teaching_methods && teacher.teaching_methods.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">روش‌های تدریس</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {teacher.teaching_methods.map((method, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-300">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificates */}
                  {teacher.certificates && teacher.certificates.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        گواهینامه‌ها
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {teacher.certificates.map((cert, idx) => (
                          <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {teacher.achievements && teacher.achievements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">دستاوردها</h3>
                      <div className="space-y-2">
                        {teacher.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">رزرو کلاس</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {teacher.hourly_rate ? teacher.hourly_rate.toLocaleString() : 'نامشخص'} تومان
                    </div>
                    <div className="text-sm text-gray-600">در ساعت</div>
                  </div>

                  {/* Location Info */}
                  <div className="space-y-3">
                    {teacher.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">{teacher.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Info Message */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                      <CheckCircle className="w-4 h-4" />
                      <span>کلاس‌ها فقط از طریق وب‌سایت برگزار می‌شوند</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handleBookSession}
                      disabled={!teacher.available}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Calendar className="w-4 h-4 ml-2" />
                      {teacher.available ? "رزرو کلاس" : "غیرفعال"}
                    </Button>
                    
                    <Button 
                      onClick={() => router.push(`/teachers/${teacher.id}/video-call`)}
                      disabled={!teacher.available}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Video className="w-4 h-4 ml-2" />
                      {teacher.available ? "شروع کلاس آنلاین" : "غیرفعال"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">زمان‌های در دسترس</CardTitle>
                </CardHeader>
                <CardContent>
                  {teacher.available_days && teacher.available_days.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {teacher.available_days.map((day, idx) => (
                          <Badge key={idx} variant="outline" className="text-center">
                            {day}
                          </Badge>
                        ))}
                      </div>
                      
                      {teacher.available_hours && teacher.available_hours.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">ساعات کاری:</h4>
                          <div className="space-y-1">
                            {teacher.available_hours.map((hour, idx) => (
                              <div key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                                {hour}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">زمان‌های در دسترس تعریف نشده</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Class Types Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">نوع کلاس</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {teacher.class_types.map((type, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {type === 'online' ? 'آنلاین' : type === 'offline' ? 'حضوری' : 'ترکیبی'}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                نظرات دانش‌آموزان
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری نظرات...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">هنوز نظری ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                              {review.student_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.student_name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.created_at).toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed pr-14">
                        {review.comment}
                      </p>
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