"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, Clock, Users, BookOpen, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  experience_years: number | null;
  hourly_rate: number | null;
  levels: string[] | null;
}

const popularCourses = [
  {
    id: "1",
    title: "مکالمه انگلیسی پیشرفته",
    teacher: "سپنتا علیزاده",
    teacherId: "1", // ID معلم در Supabase
    price: 1200000,
    duration: "3 ماه",
    students: 45,
    rating: 4.9,
    level: "پیشرفته",
    icon: "🗣️",
    gradient: "from-blue-500 to-cyan-500",
    features: ["مکالمه روان", "لهجه آمریکایی", "تمرین‌های عملی"]
  },
  {
    id: "2",
    title: "آمادگی آیلتس",
    teacher: "نجمه کریمی", 
    teacherId: "3", // ID معلم در Supabase
    price: 1800000,
    duration: "4 ماه",
    students: 32,
    rating: 4.8,
    level: "متوسط",
    icon: "📚",
    gradient: "from-purple-500 to-pink-500",
    features: ["شبیه‌سازی آزمون", "نمره 7+", "راهنمایی تخصصی"]
  },
  {
    id: "3",
    title: "گرامر انگلیسی",
    teacher: "پارمیدا معصومی",
    teacherId: "2", // ID معلم در Supabase
    price: 900000,
    duration: "2 ماه", 
    students: 67,
    rating: 4.7,
    level: "مبتدی",
    icon: "📝",
    gradient: "from-green-500 to-emerald-500",
    features: ["گرامر کامل", "تمرین‌های تعاملی", "گواهینامه"]
  }
];

export default function PopularCoursesSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers from Supabase
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teachers:', error);
        return;
      }

      console.log('Teachers from Supabase:', data);
      setTeachers(data || []);
    } catch (error) {
      console.error('Error in fetchTeachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Function to get teacher ID by name
  const getTeacherIdByName = (teacherName: string) => {
    const teacher = teachers.find(t => 
      `${t.first_name} ${t.last_name}` === teacherName
    );
    return teacher?.id || "1"; // fallback to "1" if not found
  };

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
            محبوب‌ترین دوره‌های ما که توسط هزاران دانش‌آموز انتخاب شده‌اند
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {popularCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-3xl hover:-translate-y-2 group-hover:scale-[1.02]">
                {/* Header with gradient */}
                <div className={`h-48 bg-gradient-to-br ${course.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  
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
                  <Link href={`/teachers/${getTeacherIdByName(course.teacher)}`}>
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
              بیش از 1000 دانش‌آموز راضی در حال یادگیری با ما هستند. شما هم به جمع ما بپیوندید!
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