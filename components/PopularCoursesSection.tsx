"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, Clock, Users, BookOpen, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
// Remove supabase import since we'll use API endpoint

interface Course {
  id: string;
  title: string;
  teacher: string;
  teacherId: string;
  price: number;
  duration: string;
  students: number;
  rating: number;
  level: string;
  icon: string;
  gradient: string;
  features: string[];
  image: string;
}

export default function PopularCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the same course data as the main courses page
  const fetchCourses = async () => {
    try {
      console.log('🔍 Fetching courses for popular section...');
      
      // Use the same mock data as the courses page
      const mockCourses: Course[] = [
        {
          id: "1",
          title: "انگلیسی برای شروع",
          teacher: "ادینوس",
          teacherId: "teacher-1",
          price: 2800000,
          duration: "12 هفته",
          students: 45,
          rating: 4.8,
          level: "مبتدی",
          icon: "🚀",
          gradient: "from-blue-500 to-cyan-500",
          features: ["آموزش گرامر پایه", "واژگان ضروری", "مکالمه روزمره"],
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "2",
          title: "انگلیسی کاربردی",
          teacher: "ادینوس",
          teacherId: "teacher-2",
          price: 4200000,
          duration: "16 هفته",
          students: 38,
          rating: 4.9,
          level: "متوسط",
          icon: "💼",
          gradient: "from-purple-500 to-pink-500",
          features: ["مهارت‌های کاری", "ارائه حرفه‌ای", "نوشتن رسمی"],
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "3",
          title: "انگلیسی حرفه‌ای",
          teacher: "سپنتا علیزاده",
          teacherId: "teacher-3",
          price: 6800000,
          duration: "20 هفته",
          students: 32,
          rating: 4.9,
          level: "پیشرفته",
          icon: "🎯",
          gradient: "from-green-500 to-teal-500",
          features: ["محیط‌های بین‌المللی", "مذاکره پیشرفته", "مدیریت پروژه"],
          image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "4",
          title: "آمادگی آیلتس",
          teacher: "سپنتا علیزاده",
          teacherId: "teacher-4",
          price: 7500000,
          duration: "18 هفته",
          students: 28,
          rating: 4.9,
          level: "پیشرفته",
          icon: "📚",
          gradient: "from-orange-500 to-red-500",
          features: ["استراتژی‌های تست زنی", "نمره 7+", "شبیه‌سازی آزمون"],
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "5",
          title: "انگلیسی کودکان",
          teacher: "ادینوس",
          teacherId: "teacher-5",
          price: 2200000,
          duration: "10 هفته",
          students: 52,
          rating: 4.8,
          level: "مبتدی",
          icon: "🌟",
          gradient: "from-pink-500 to-purple-500",
          features: ["آموزش بازی محور", "کارتون‌های آموزشی", "فعالیت‌های خلاقانه"],
          image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "6",
          title: "کلاس خصوصی VIP",
          teacher: "سپنتا علیزاده",
          teacherId: "teacher-6",
          price: 850000,
          duration: "انعطاف‌پذیر",
          students: 15,
          rating: 5.0,
          level: "شخصی‌سازی شده",
          icon: "👑",
          gradient: "from-indigo-500 to-purple-500",
          features: ["برنامه شخصی", "استاد مجرب", "پشتیبانی 24/7"],
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
        }
      ];

      // Take top 6 most popular courses (based on rating and students)
      const popularCourses = mockCourses
        .sort((a, b) => (b.rating * b.students) - (a.rating * a.students))
        .slice(0, 6);

      console.log('✅ Popular courses loaded:', popularCourses.length);
      setCourses(popularCourses);
      
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              دوره‌های محبوب
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              در حال بارگذاری دوره‌ها...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no courses
  if (courses.length === 0 && !loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              دوره‌های محبوب
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              در حال حاضر دوره‌ای برای نمایش وجود ندارد. به زودی دوره‌های جدید اضافه خواهند شد.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            دوره‌های محبوب
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            محبوب‌ترین دوره‌های ما که توسط معلمان متخصص و مجرب ارائه می‌شوند
          </p>
        </motion.div>

        {/* Mobile: Horizontal scroll */}
        <div className="block md:hidden mb-12">
          <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 group"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-3xl hover:-translate-y-2 group-hover:scale-[1.02] h-full">
                  {/* Header with image */}
                  <div className="h-40 relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>
                    
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
                      <div className="absolute top-12 right-8 w-4 h-4 border border-white/30 rounded-full"></div>
                      <div className="absolute bottom-8 left-8 w-6 h-6 border-2 border-white/30 rounded-full"></div>
                    </div>

                    {/* Course icon */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                      {course.icon}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge className="bg-white/90 text-gray-800 font-semibold px-2 py-1 text-xs">
                        {course.level}
                      </Badge>
                      <Badge className="bg-yellow-400 text-yellow-900 font-semibold px-2 py-1 text-xs">
                        محبوب
                      </Badge>
                    </div>

                    {/* Students count */}
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Course title and teacher */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs">مدرس: {course.teacher}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {course.rating}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {course.features.slice(0, 2).map((feature, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Duration and price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {course.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">تومان</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/teachers/${course.teacherId}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 rounded-xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg text-sm">
                        <span className="mr-1">🎯</span>
                        مشاهده دوره
                        <ChevronRight className="w-3 h-3 mr-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-3xl hover:-translate-y-2 group-hover:scale-[1.02]">
                {/* Header with image */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute top-12 right-8 w-4 h-4 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-8 left-8 w-6 h-6 border-2 border-white/30 rounded-full"></div>
                  </div>

                  {/* Course icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                    {course.icon}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Badge className="bg-white/90 text-gray-800 font-semibold px-3 py-1">
                      {course.level}
                    </Badge>
                    <Badge className="bg-yellow-400 text-yellow-900 font-semibold px-3 py-1">
                      محبوب
                    </Badge>
                  </div>

                  {/* Students count */}
                  <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Course title and teacher */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">مدرس: {course.teacher}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {course.rating}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({course.students} دانش‌آموز)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {course.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Duration and price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {course.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">تومان</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/teachers/${course.teacherId}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg">
                      <span className="mr-2">🎯</span>
                      مشاهده دوره
                      <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-3xl text-white">
            <div className="flex items-center justify-center mb-4">
              <Award className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">آماده شروع یادگیری هستید؟</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              بیش از {courses.length} دوره متنوع و معلم متخصص آماده تدریس هستند. شما هم به جمع ما بپیوندید!
            </p>
            <Link href="/courses">
              <Button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
                <span className="mr-2">🚀</span>
                مشاهده همه دوره‌ها
                <span className="ml-2">✨</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 