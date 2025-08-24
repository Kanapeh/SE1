"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronRight, ArrowRight, Users, Award, Clock, MessageCircle, Crown, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Import teachers data from the teachers page
const topTeachers = [
  {
    id: "1",
    name: "سپنتا علیزاده",
    specialty: "مکالمه انگلیسی",
    rating: 4.9,
    students: 156,
    avatar: "/images/sepanta.png", // Using the existing sepanta.png image
    experience: 8,
    hourlyRate: 250000,
    gradient: "from-blue-500 to-cyan-500",
    emoji: "🗣️",
    achievements: ["برنده جایزه بهترین معلم سال", "نمره 8.5 در آیلتس"],
    languages: ["انگلیسی", "فارسی"]
  }
];

export default function TopTeachersSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-16 max-w-2xl mx-auto">
          {topTeachers.map((teacher, index) => (
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
                <div className={`h-32 bg-gradient-to-br ${teacher.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border border-white/30 rounded-full"></div>
                  </div>

                  {/* Emoji */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                    {teacher.emoji}
                  </div>

                  {/* Avatar */}
                  <div className="absolute bottom-4 right-4">
                    <Avatar className="w-16 h-16 ring-4 ring-white/20 backdrop-blur-sm">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback className="text-lg bg-white/20 text-white backdrop-blur-sm">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="p-6">
                  {/* Name and Specialty */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {teacher.name}
                    </h3>
                    <Badge className={`bg-gradient-to-r ${teacher.gradient} text-white border-0`}>
                      {teacher.specialty}
                    </Badge>
                  </div>

                  {/* Rating and Students */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {teacher.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{teacher.students} دانش‌آموز</span>
                    </div>
                  </div>

                  {/* Experience and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{teacher.experience} سال تجربه</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {teacher.hourlyRate.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">تومان/ساعت</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.languages.map((lang, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-6">
                    <div className="space-y-1">
                      {teacher.achievements.slice(0, 2).map((achievement, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Award className="w-3 h-3 text-yellow-500" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

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