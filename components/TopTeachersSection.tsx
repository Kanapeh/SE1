"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronRight, Users, Award, Clock, Crown, Target, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  hourly_rate: number;
  location: string;
  experience_years: number;
  status: string;
  languages: string[];
  levels: string[];
  teaching_methods: string[];
  average_rating?: number;
  total_students?: number;
}

export default function TopTeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedTeachers = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching approved teachers for homepage...');
        
        const response = await fetch('/api/teachers');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch teachers: ${response.status}`);
        }
        
        const data = await response.json();
        // Log data summary without avatar
        const dataSummary = {
          ...data,
          teachers: data.teachers?.map((teacher: Teacher) => {
            const { avatar, ...teacherWithoutAvatar } = teacher;
            return {
              ...teacherWithoutAvatar,
              avatar: avatar ? `[Avatar: ${avatar.substring(0, 50)}... (${avatar.length} chars)]` : 'No avatar'
            };
          })
        };
        console.log('✅ Teachers data received:', dataSummary);
        
        // Filter only approved teachers and limit to top 3
        const approvedTeachers = (data.teachers || [])
          .filter((teacher: Teacher) => 
            teacher.status === 'Approved' || 
            teacher.status === 'approved' || 
            teacher.status === 'active'
          )
          .slice(0, 3); // Show only top 3 teachers
        
        // Log approved teachers summary without avatar
        const approvedSummary = approvedTeachers.map((teacher: Teacher) => {
          const { avatar, ...teacherWithoutAvatar } = teacher;
          return {
            ...teacherWithoutAvatar,
            avatar: avatar ? `[Avatar: ${avatar.substring(0, 50)}... (${avatar.length} chars)]` : 'No avatar'
          };
        });
        console.log('✅ Approved teachers for homepage:', approvedSummary);
        setTeachers(approvedTeachers);
        
      } catch (error) {
        console.error('❌ Error fetching teachers:', error);
        setError(error instanceof Error ? error.message : 'Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTeachers();
  }, []);

  const getTeacherGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500", 
      "from-green-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500"
    ];
    return gradients[index % gradients.length];
  };

  const getTeacherEmoji = (teachingMethods: string[]) => {
    if (teachingMethods.includes('communicative') || teachingMethods.includes('مکالمه')) return '🗣️';
    if (teachingMethods.includes('grammar') || teachingMethods.includes('گرامر')) return '📚';
    if (teachingMethods.includes('interactive') || teachingMethods.includes('تعاملی')) return '🎮';
    return '🎓';
  };

  const getSpecialty = (teachingMethods: string[], languages: string[]) => {
    if (teachingMethods.includes('communicative')) return 'مکالمه انگلیسی';
    if (teachingMethods.includes('grammar')) return 'گرامر انگلیسی';
    if (teachingMethods.includes('ielts')) return 'آمادگی آیلتس';
    if (languages.includes('english')) return 'آموزش انگلیسی';
    return 'آموزش زبان';
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
              اساتید با تجربه در آکادمی سِ وان
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 mb-8">
              مدرسان سِ وان با تخصص بالا و سابقه بین‌المللی یادگیری زبان را دقیق، مؤثر و لذت‌بخش می‌کنند
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>در حال بارگذاری معلمان...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
              اساتید با تجربه در آکادمی سِ وان
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 mb-8">
              مدرسان سِ وان با تخصص بالا و سابقه بین‌المللی یادگیری زبان را دقیق، مؤثر و لذت‌بخش می‌کنند
            </p>
            <p className="text-red-600 dark:text-red-400">خطا در بارگذاری معلمان: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (teachers.length === 0) {
    return (
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
              اساتید با تجربه در آکادمی سِ وان
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 mb-8">
              مدرسان سِ وان با تخصص بالا و سابقه بین‌المللی یادگیری زبان را دقیق، مؤثر و لذت‌بخش می‌کنند
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">هنوز معلم تایید شده‌ای وجود ندارد.</p>
            <Link href="/register/teacher">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                معلم شوید
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-white dark:bg-gray-900">

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
            اساتید با تجربه در آکادمی سِ وان
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            مدرسان سِ وان با تخصص بالا و سابقه بین‌المللی یادگیری زبان را دقیق، مؤثر و لذت‌بخش می‌کنند
          </p>
        </motion.div>

        {/* Teachers Container - Horizontal scroll on mobile, grid on desktop */}
        <div className="mb-16">
          {/* Mobile: Horizontal scroll */}
          <div className="block md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
              {teachers.map((teacher, index) => {
                const gradient = getTeacherGradient(index);
                const emoji = getTeacherEmoji(teacher.teaching_methods || []);
                const specialty = getSpecialty(teacher.teaching_methods || [], teacher.languages || []);
                const fullName = `${teacher.first_name} ${teacher.last_name}`;
                const rating = teacher.average_rating || 4.5;
                const studentCount = teacher.total_students || Math.floor(Math.random() * 100) + 20;
                
                return (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex-shrink-0 w-80"
                  >
                    <Card className="overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 h-full group">
                      {/* Avatar Section - Centered */}
                      <div className="relative pt-8 pb-4 px-6">
                        <div className="flex flex-col items-center">
                          <div className="relative mb-4">
                            <Avatar className="w-24 h-24 ring-4 ring-gray-100 dark:ring-gray-700">
                              <AvatarImage src={teacher.avatar || ''} alt={fullName} />
                              <AvatarFallback className={`text-2xl font-bold bg-gradient-to-br ${gradient} text-white`}>
                                {teacher.first_name[0]}{teacher.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {/* Badge */}
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          
                          {/* Name */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                            {fullName}
                          </h3>
                          
                          {/* Specialty */}
                          <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 text-xs mb-3`}>
                            {specialty}
                          </Badge>
                        </div>
                      </div>

                      <div className="px-6 pb-6">
                        {/* Rating */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-base font-bold text-gray-900 dark:text-white">
                            {rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                              <Users className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {studentCount}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">دانش‌آموز</div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {teacher.experience_years}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">سال تجربه</div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4 text-center">
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {teacher.hourly_rate?.toLocaleString() || '200,000'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">تومان/ساعت</div>
                        </div>

                        {/* CTA Button */}
                        <Link href={`/teachers/${teacher.id}`}>
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:shadow-md">
                            مشاهده پروفایل
                            <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className={`hidden md:grid ${teachers.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : teachers.length === 2 ? 'grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {teachers.map((teacher, index) => {
            const gradient = getTeacherGradient(index);
            const emoji = getTeacherEmoji(teacher.teaching_methods || []);
            const specialty = getSpecialty(teacher.teaching_methods || [], teacher.languages || []);
            const fullName = `${teacher.first_name} ${teacher.last_name}`;
            const rating = teacher.average_rating || 4.5;
            const studentCount = teacher.total_students || Math.floor(Math.random() * 100) + 20;
            
            return (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 group">
                  {/* Avatar Section - Centered */}
                  <div className="relative pt-8 pb-4 px-6">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <Avatar className="w-24 h-24 ring-4 ring-gray-100 dark:ring-gray-700">
                          <AvatarImage src={teacher.avatar || ''} alt={fullName} />
                          <AvatarFallback className={`text-2xl font-bold bg-gradient-to-br ${gradient} text-white`}>
                            {teacher.first_name[0]}{teacher.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {/* Badge */}
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      {/* Name */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                        {fullName}
                      </h3>
                      
                      {/* Specialty */}
                      <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 text-xs mb-3`}>
                        {specialty}
                      </Badge>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        {rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {studentCount}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">دانش‌آموز</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {teacher.experience_years}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">سال تجربه</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4 text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {teacher.hourly_rate?.toLocaleString() || '200,000'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">تومان/ساعت</div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/teachers/${teacher.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:shadow-md">
                        مشاهده پروفایل
                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
          </div>
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
              <Target className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">آماده شروع یادگیری هستید؟</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              با بهترین معلمان زبان آشنا شوید و مسیر موفقیت خود را آغاز کنید!
            </p>
            <Link href="/teachers">
              <Button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
                <span className="mr-2">🚀</span>
                مشاهده همه معلمان
                <span className="ml-2">✨</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 