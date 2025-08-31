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
        console.log('✅ Teachers data received:', data);
        
        // Filter only approved teachers and limit to top 3
        const approvedTeachers = (data.teachers || [])
          .filter((teacher: Teacher) => 
            teacher.status === 'Approved' || 
            teacher.status === 'approved' || 
            teacher.status === 'active'
          )
          .slice(0, 3); // Show only top 3 teachers
        
        console.log('✅ Approved teachers for homepage:', approvedTeachers);
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
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              معلمان برتر ما
            </h2>
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
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              معلمان برتر ما
            </h2>
            <p className="text-red-600 dark:text-red-400">خطا در بارگذاری معلمان: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (teachers.length === 0) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              معلمان برتر ما
            </h2>
            <p className="text-gray-600 dark:text-gray-400">هنوز معلم تایید شده‌ای وجود ندارد.</p>
            <Link href="/register/teacher">
              <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                معلم شوید
              </Button>
            </Link>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            معلمان برتر ما
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            با بهترین معلمان زبان که سال‌ها تجربه در آموزش دارند آشنا شوید
          </p>
        </motion.div>

        {/* Teachers Grid */}
        <div className={`grid ${teachers.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : teachers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-8 mb-16`}>
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
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-3xl hover:-translate-y-2 group-hover:scale-[1.02]">
                  {/* Header with gradient */}
                  <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white/30 rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-4 h-4 border border-white/30 rounded-full"></div>
                    </div>

                    {/* Emoji */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                      {emoji}
                    </div>

                    {/* Avatar */}
                    <div className="absolute bottom-4 right-4">
                      <Avatar className="w-16 h-16 ring-4 ring-white/20 backdrop-blur-sm">
                        <AvatarImage src={teacher.avatar || ''} alt={fullName} />
                        <AvatarFallback className="text-lg bg-white/20 text-white backdrop-blur-sm">
                          {teacher.first_name[0]}{teacher.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Name and Specialty */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {fullName}
                      </h3>
                      <Badge className={`bg-gradient-to-r ${gradient} text-white border-0`}>
                        {specialty}
                      </Badge>
                    </div>

                    {/* Rating and Students */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{studentCount} دانش‌آموز</span>
                      </div>
                    </div>

                    {/* Experience and Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{teacher.experience_years} سال تجربه</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {teacher.hourly_rate?.toLocaleString() || '200,000'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">تومان/ساعت</div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {(teacher.languages || ['انگلیسی']).map((lang, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                          >
                            {lang === 'english' ? 'انگلیسی' : lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio/Description */}
                    {teacher.bio && (
                      <div className="mb-6">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {teacher.bio}
                        </p>
                      </div>
                    )}

                    {/* Teaching Methods */}
                    {teacher.teaching_methods && teacher.teaching_methods.length > 0 && (
                      <div className="mb-6">
                        <div className="space-y-1">
                          {teacher.teaching_methods.slice(0, 2).map((method, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Award className="w-3 h-3 text-yellow-500" />
                              <span>
                                {method === 'communicative' ? 'روش تعاملی' :
                                 method === 'direct_method' ? 'روش مستقیم' :
                                 method === 'grammar_translation' ? 'گرامر و ترجمه' :
                                 method}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link href={`/teachers/${teacher.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg">
                        <span className="mr-2">👨‍🏫</span>
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