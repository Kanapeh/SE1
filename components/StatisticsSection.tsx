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
      emoji: "👥"
    },
    { 
      number: "25+", 
      label: "معلم متخصص", 
      icon: Award, 
      gradient: "from-purple-500 to-pink-500",
      emoji: "🏆"
    },
    { 
      number: "98%", 
      label: "رضایت دانش‌آموزان", 
      icon: Heart, 
      gradient: "from-green-500 to-emerald-500",
      emoji: "❤️"
    },
    { 
      number: "50+", 
      label: "دوره تخصصی", 
      icon: BookOpen, 
      gradient: "from-orange-500 to-red-500",
      emoji: "📚"
    },
  ];

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 w-20 h-20 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-5 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            آمار و دستاوردها
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-3 rounded-full"></div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            با اطمینان کامل، مسیر یادگیری خود را با ما آغاز کنید
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1 group-hover:scale-[1.02] overflow-hidden relative">
                
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative z-10 text-center">
                  {/* Icon with gradient background */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>

                  {/* Emoji */}
                  <div className="text-xl md:text-2xl mb-2">
                    {stat.emoji}
                  </div>

                  {/* Number */}
                  <div className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-sm md:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {stat.label}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 