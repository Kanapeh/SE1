"use client";

import { Users, Award, Heart, BookOpen, TrendingUp, Star, GraduationCap, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function StatisticsSection() {
  const stats = [
    { 
      number: "1500+", 
      label: "دانش‌آموز فعال", 
      icon: Users, 
      gradient: "from-blue-500 to-cyan-500",
      emoji: "👥",
      description: "دانش‌آموزانی که در حال یادگیری هستند"
    },
    { 
      number: "25+", 
      label: "معلم متخصص", 
      icon: Award, 
      gradient: "from-purple-500 to-pink-500",
      emoji: "🏆",
      description: "اساتید مجرب و حرفه‌ای"
    },
    { 
      number: "98%", 
      label: "رضایت دانش‌آموزان", 
      icon: Heart, 
      gradient: "from-green-500 to-emerald-500",
      emoji: "❤️",
      description: "رضایت بالای دانش‌آموزان"
    },
    { 
      number: "50+", 
      label: "دوره تخصصی", 
      icon: BookOpen, 
      gradient: "from-orange-500 to-red-500",
      emoji: "📚",
      description: "دوره‌های متنوع و کاربردی"
    },
  ];

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
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            آمار و دستاوردها
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            با اطمینان کامل، مسیر یادگیری خود را با ما آغاز کنید
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-2 group-hover:scale-[1.02] overflow-hidden relative">
                
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-6 h-6 border-2 border-current rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border border-current rounded-full"></div>
                </div>

                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Emoji */}
                  <div className="text-3xl mb-4 text-center">
                    {stat.emoji}
                  </div>

                  {/* Number */}
                  <div className="text-4xl md:text-5xl font-bold mb-3 text-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    {stat.description}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-3xl text-white">
            <div className="flex items-center justify-center mb-4">
              <Target className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">آماده شروع یادگیری هستید؟</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              به جمع هزاران دانش‌آموز راضی ما بپیوندید و مسیر موفقیت خود را آغاز کنید!
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
              <span className="mr-2">🚀</span>
              شروع کنید
              <span className="ml-2">✨</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 