"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  ArrowRight, 
  Star, 
  Award, 
  BookOpen, 
  Globe, 
  Target, 
  Zap,
  Shield,
  Trophy,
  Crown,
  Sparkles,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  level: string;
  title: string;
  description: string;
  duration: string;
  class_size: string;
  price: number;
  originalPrice?: number;
  features: string[];
  color: string;
  badge: string;
  image_url: string;
  status: string;
  popularity: number;
  rating: number;
  instructor: string;
  category: string;
}

export default function CoursesClient() {
  // Enhanced courses data with realistic pricing and better content
  const courses: Course[] = [
    {
      id: "1",
      level: "مبتدی",
      title: "انگلیسی برای شروع",
      description: "دوره کامل برای شروع یادگیری زبان انگلیسی از صفر. شامل گرامر پایه، واژگان ضروری و مکالمه روزمره.",
      duration: "12 هفته",
      class_size: "حداکثر 8 نفر",
      price: 2800000,
      originalPrice: 3500000,
      features: [
        "آموزش گرامر پایه",
        "واژگان ضروری (500 کلمه)",
        "مکالمه روزمره",
        "تلفظ صحیح",
        "کتاب آموزشی رایگان",
        "گواهینامه معتبر"
      ],
      color: "from-blue-500 to-cyan-500",
      badge: "محبوب",
      image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 95,
      rating: 4.8,
      instructor: "سارا احمدی",
      category: "مبتدی"
    },
    {
      id: "2",
      level: "متوسط",
      title: "انگلیسی کاربردی",
      description: "تقویت مهارت‌های زبانی برای استفاده در محیط کار و تحصیل. تمرکز بر مکالمه پیشرفته و نوشتار.",
      duration: "16 هفته",
      class_size: "حداکثر 6 نفر",
      price: 4200000,
      originalPrice: 5200000,
      features: [
        "مکالمه پیشرفته",
        "نوشتار رسمی",
        "واژگان تخصصی",
        "آمادگی آزمون‌های بین‌المللی",
        "کارگاه‌های عملی",
        "مشاوره شغلی"
      ],
      color: "from-purple-500 to-pink-500",
      badge: "توصیه شده",
      image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 88,
      rating: 4.9,
      instructor: "علی محمدی",
      category: "متوسط"
    },
    {
      id: "3",
      level: "پیشرفته",
      title: "انگلیسی حرفه‌ای",
      description: "آمادگی کامل برای محیط‌های کاری بین‌المللی. شامل مهارت‌های ارائه، مذاکره و ارتباطات تجاری.",
      duration: "20 هفته",
      class_size: "حداکثر 4 نفر",
      price: 6800000,
      originalPrice: 8500000,
      features: [
        "مهارت‌های ارائه",
        "مذاکره تجاری",
        "نوشتار حرفه‌ای",
        "آمادگی مصاحبه کاری",
        "شبکه‌سازی بین‌المللی",
        "گواهینامه بین‌المللی"
      ],
      color: "from-green-500 to-teal-500",
      badge: "پریمیوم",
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 75,
      rating: 4.9,
      instructor: "دکتر فاطمه کریمی",
      category: "پیشرفته"
    },
    {
      id: "4",
      level: "آیلتس",
      title: "آمادگی آیلتس",
      description: "دوره تخصصی آمادگی آزمون آیلتس با استراتژی‌های تست زنی و تمرینات عملی. تضمین نمره 7+",
      duration: "24 هفته",
      class_size: "حداکثر 6 نفر",
      price: 7500000,
      originalPrice: 9500000,
      features: [
        "استراتژی‌های تست زنی",
        "تمرینات عملی",
        "شبیه‌سازی آزمون",
        "تحلیل نمره",
        "مطالعات موردی",
        "تضمین نمره 7+"
      ],
      color: "from-orange-500 to-red-500",
      badge: "تضمین شده",
      image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 92,
      rating: 4.8,
      instructor: "استاد محمود رضایی",
      category: "آیلتس"
    },
    {
      id: "5",
      level: "کودکان",
      title: "انگلیسی کودکان",
      description: "آموزش جذاب و بازی محور برای کودکان 6-12 سال. شامل بازی‌ها، داستان‌ها و فعالیت‌های خلاقانه.",
      duration: "10 هفته",
      class_size: "حداکثر 10 نفر",
      price: 2200000,
      originalPrice: 2800000,
      features: [
        "آموزش بازی محور",
        "داستان‌های جذاب",
        "فعالیت‌های خلاقانه",
        "آهنگ‌ها و شعرها",
        "گزارش پیشرفت ماهانه",
        "گواهینامه کودک"
      ],
      color: "from-pink-500 to-purple-500",
      badge: "کودک دوستانه",
      image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 90,
      rating: 4.9,
      instructor: "مریم نوروزی",
      category: "کودکان"
    },
    {
      id: "6",
      level: "خصوصی",
      title: "کلاس خصوصی VIP",
      description: "کلاس خصوصی با استاد مجرب برای یادگیری سریع و شخصی‌سازی شده. مناسب برای اهداف خاص.",
      duration: "انعطاف‌پذیر",
      class_size: "1 نفر",
      price: 850000,
      originalPrice: 1050000,
      features: [
        "استاد اختصاصی",
        "برنامه شخصی‌سازی شده",
        "انعطاف زمانی",
        "پشتیبانی 24/7",
        "تست‌های منظم",
        "گزارش تفصیلی"
      ],
      color: "from-indigo-500 to-purple-500",
      badge: "VIP",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 85,
      rating: 4.9,
      instructor: "استاد انتخابی",
      category: "خصوصی"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "محبوب": return <Star className="w-4 h-4" />;
      case "توصیه شده": return <Award className="w-4 h-4" />;
      case "پریمیوم": return <Crown className="w-4 h-4" />;
      case "تضمین شده": return <Shield className="w-4 h-4" />;
      case "کودک دوستانه": return <Sparkles className="w-4 h-4" />;
      case "VIP": return <Trophy className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "محبوب": return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "توصیه شده": return "bg-gradient-to-r from-blue-500 to-purple-500";
      case "پریمیوم": return "bg-gradient-to-r from-green-500 to-teal-500";
      case "تضمین شده": return "bg-gradient-to-r from-red-500 to-pink-500";
      case "کودک دوستانه": return "bg-gradient-to-r from-pink-500 to-purple-500";
      case "VIP": return "bg-gradient-to-r from-indigo-500 to-purple-500";
      default: return "bg-gradient-to-r from-blue-500 to-purple-500";
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-6 px-6 py-3 text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <BookOpen className="w-5 h-5 mr-2" />
              بهترین دوره‌های آموزش زبان
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
          >
            دوره‌های زبان انگلیسی
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto"
          >
            با بهترین دوره‌های آموزش زبان انگلیسی، مهارت‌های خود را تقویت کنید و 
            به اهداف زبانی خود برسید. قیمت‌های مناسب و کیفیت تضمین شده!
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>قیمت‌های مناسب</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>اساتید مجرب</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>گواهینامه معتبر</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>پشتیبانی 24/7</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden h-full rounded-2xl shadow-xl bg-white border-0 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getBadgeColor(course.badge)} text-white border-0 shadow-lg px-3 py-1 text-sm font-semibold`}>
                      {getBadgeIcon(course.badge)}
                      <span className="mr-1">{course.badge}</span>
                    </Badge>
                  </div>
                  
                  {/* Popularity */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">{course.popularity}%</span>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6 flex flex-col h-full">
                  {/* Level Badge */}
                  <div className="mb-4">
                    <Badge variant="outline" className={`bg-gradient-to-r ${course.color} text-white border-0 px-3 py-1 text-sm`}>
                      {course.level}
                    </Badge>
                  </div>

                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{course.class_size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{course.instructor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">ویژگی‌های کلیدی:</h4>
                    <div className="space-y-2">
                      {course.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                      {course.features.length > 3 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{course.features.length - 3} ویژگی دیگر
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="text-center">
                      {course.originalPrice && (
                        <div className="text-sm text-gray-500 line-through mb-1">
                          {formatPrice(course.originalPrice)} تومان
                        </div>
                      )}
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPrice(course.price)}
                        <span className="text-sm font-normal text-gray-600 mr-1">تومان</span>
                      </div>
                      {course.originalPrice && (
                        <div className="text-sm text-green-600 font-semibold">
                          {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% تخفیف
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/get-started" className="block">
                    <Button className={`w-full bg-gradient-to-r ${course.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}>
                      <span className="mr-2">🎯</span>
                      ثبت نام اکنون
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 rounded-3xl text-white">
            <div className="flex items-center justify-center mb-4">
              <Target className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">هنوز مطمئن نیستید؟</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              مشاوره رایگان دریافت کنید و بهترین دوره را برای خود انتخاب کنید!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
                <span className="mr-2">💬</span>
                مشاوره رایگان
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-2xl font-semibold transition-colors transform hover:scale-105">
                <span className="mr-2">📞</span>
                تماس با ما
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
