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
      level: "مکالمه",
      title: "انگلیسی مکالمه",
      description: "تمرکز کامل بر مهارت مکالمه و صحبت کردن روان. مناسب برای افرادی که می‌خواهند اعتماد به نفس خود را در صحبت کردن افزایش دهند.",
      duration: "14 هفته",
      class_size: "حداکثر 6 نفر",
      price: 3800000,
      originalPrice: 4800000,
      features: [
        "تمرین مکالمه روزمره",
        "صحبت در موقعیت‌های مختلف",
        "تلفظ و لهجه",
        "گسترش دایره واژگان",
        "فعالیت‌های تعاملی",
        "گواهینامه مکالمه"
      ],
      color: "from-teal-500 to-cyan-500",
      badge: "محبوب",
      image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 93,
      rating: 4.9,
      instructor: "لیلا رضایی",
      category: "مکالمه"
    },
    {
      id: "7",
      level: "تافل",
      title: "آمادگی تافل",
      description: "دوره تخصصی آمادگی آزمون تافل با تمرکز بر هر چهار مهارت. استراتژی‌های تست زنی و تمرینات عملی برای نمره بالا.",
      duration: "20 هفته",
      class_size: "حداکثر 6 نفر",
      price: 7200000,
      originalPrice: 9000000,
      features: [
        "آمادگی کامل تافل",
        "تمرینات Reading و Listening",
        "نوشتار آکادمیک",
        "مکالمه ساختاریافته",
        "شبیه‌سازی آزمون",
        "تضمین نمره 100+"
      ],
      color: "from-red-500 to-orange-500",
      badge: "تضمین شده",
      image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 87,
      rating: 4.8,
      instructor: "دکتر احمد حسینی",
      category: "تافل"
    },
    {
      id: "8",
      level: "تجاری",
      title: "انگلیسی تجاری",
      description: "آموزش زبان انگلیسی برای محیط کار و کسب‌وکار. شامل ایمیل‌نویسی، ارائه، مذاکره و ارتباطات حرفه‌ای.",
      duration: "18 هفته",
      class_size: "حداکثر 5 نفر",
      price: 5800000,
      originalPrice: 7200000,
      features: [
        "ایمیل‌نویسی حرفه‌ای",
        "ارائه و Presentation",
        "مذاکره تجاری",
        "واژگان تخصصی کسب‌وکار",
        "مطالعات موردی",
        "گواهینامه Business English"
      ],
      color: "from-blue-600 to-indigo-600",
      badge: "توصیه شده",
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 82,
      rating: 4.9,
      instructor: "مهندس رضا کریمی",
      category: "تجاری"
    },
    {
      id: "9",
      level: "گرامر",
      title: "گرامر پیشرفته",
      description: "تقویت کامل مهارت گرامر از پایه تا پیشرفته. شامل تمام قواعد، استثناها و کاربردهای عملی گرامر انگلیسی.",
      duration: "16 هفته",
      class_size: "حداکثر 8 نفر",
      price: 3500000,
      originalPrice: 4500000,
      features: [
        "گرامر کامل از پایه",
        "تمرینات عملی",
        "تست‌های منظم",
        "تحلیل خطاهای رایج",
        "کاربرد در مکالمه",
        "گواهینامه گرامر"
      ],
      color: "from-purple-600 to-pink-600",
      badge: "توصیه شده",
      image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 78,
      rating: 4.7,
      instructor: "دکتر زهرا موسوی",
      category: "گرامر"
    },
    {
      id: "10",
      level: "مصاحبه",
      title: "آمادگی مصاحبه کاری",
      description: "آمادگی کامل برای مصاحبه‌های کاری بین‌المللی. شامل سوالات رایج، پاسخ‌های مناسب و تکنیک‌های موفقیت.",
      duration: "8 هفته",
      class_size: "حداکثر 4 نفر",
      price: 4500000,
      originalPrice: 5800000,
      features: [
        "سوالات رایج مصاحبه",
        "تمرین مصاحبه واقعی",
        "نوشتن رزومه انگلیسی",
        "تکنیک‌های پاسخ‌دهی",
        "شبیه‌سازی مصاحبه",
        "بازخورد شخصی"
      ],
      color: "from-green-600 to-emerald-600",
      badge: "پریمیوم",
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 80,
      rating: 4.9,
      instructor: "مهندس سارا نوری",
      category: "مصاحبه"
    },
    {
      id: "11",
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
    },
    {
      id: "12",
      level: "مبتدی",
      title: "آلمانی Starten wir A1",
      description: "دوره کامل زبان آلمانی برای مبتدیان با کتاب Starten wir A1. یادگیری پایه‌ای زبان آلمانی از صفر با تمرکز بر مکالمه و گرامر.",
      duration: "14 هفته",
      class_size: "حداکثر 8 نفر",
      price: 3080000,
      originalPrice: 3850000,
      features: [
        "کتاب Starten wir A1",
        "گرامر پایه آلمانی",
        "واژگان ضروری (600 کلمه)",
        "مکالمه روزمره",
        "تلفظ صحیح",
        "گواهینامه A1"
      ],
      color: "from-yellow-500 to-orange-500",
      badge: "جدید",
      image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 85,
      rating: 4.8,
      instructor: "سپنتا علیزاده",
      category: "آلمانی"
    },
    {
      id: "13",
      level: "مبتدی-متوسط",
      title: "آلمانی Starten wir A2",
      description: "ادامه یادگیری زبان آلمانی با کتاب Starten wir A2. تقویت مهارت‌های زبانی و آمادگی برای سطح متوسط.",
      duration: "16 هفته",
      class_size: "حداکثر 8 نفر",
      price: 4620000,
      originalPrice: 5720000,
      features: [
        "کتاب Starten wir A2",
        "گرامر پیشرفته‌تر",
        "واژگان گسترده‌تر (1200 کلمه)",
        "مکالمه پیشرفته",
        "خواندن و نوشتن",
        "گواهینامه A2"
      ],
      color: "from-orange-500 to-red-500",
      badge: "محبوب",
      image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 82,
      rating: 4.9,
      instructor: "باران صادقی",
      category: "آلمانی"
    },
    {
      id: "14",
      level: "متوسط",
      title: "آلمانی Starten wir B1",
      description: "دوره متوسط زبان آلمانی با کتاب Starten wir B1. آمادگی برای استفاده از زبان در محیط کار و تحصیل.",
      duration: "18 هفته",
      class_size: "حداکثر 6 نفر",
      price: 4620000,
      originalPrice: 5720000,
      features: [
        "کتاب Starten wir B1",
        "گرامر متوسط",
        "واژگان تخصصی (2000 کلمه)",
        "مکالمه حرفه‌ای",
        "نوشتار رسمی",
        "گواهینامه B1"
      ],
      color: "from-blue-600 to-indigo-600",
      badge: "توصیه شده",
      image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 88,
      rating: 4.8,
      instructor: "سپنتا علیزاده",
      category: "آلمانی"
    },
    {
      id: "15",
      level: "پیشرفته",
      title: "آلمانی Sicher B2",
      description: "دوره پیشرفته زبان آلمانی با کتاب Sicher B2. آمادگی کامل برای آزمون‌های بین‌المللی و استفاده حرفه‌ای از زبان.",
      duration: "20 هفته",
      class_size: "حداکثر 6 نفر",
      price: 7480000,
      originalPrice: 9350000,
      features: [
        "کتاب Sicher B2",
        "گرامر پیشرفته",
        "واژگان گسترده (3000+ کلمه)",
        "مکالمه روان",
        "آمادگی آزمون‌های بین‌المللی",
        "گواهینامه B2"
      ],
      color: "from-purple-600 to-pink-600",
      badge: "پریمیوم",
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      status: "active",
      popularity: 90,
      rating: 4.9,
      instructor: "باران صادقی",
      category: "آلمانی"
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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <BookOpen className="w-4 h-4 mr-2" />
              بهترین دوره‌های آموزش زبان
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
          >
            دوره‌های زبان انگلیسی
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto"
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

        {/* Courses Grid - Responsive Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden rounded-xl shadow-lg bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 flex flex-col h-full">
                {/* Course Image - Better Mobile Height */}
                <div className="relative h-40 sm:h-44 md:h-36 lg:h-40 overflow-hidden">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Badge - Better Mobile Visibility */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getBadgeColor(course.badge)} text-white border-0 shadow-lg px-2.5 py-1 text-xs font-bold`}>
                      {getBadgeIcon(course.badge)}
                      <span className="mr-1">{course.badge}</span>
                    </Badge>
                  </div>
                  
                  {/* Popularity - Better Mobile Visibility */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-md">
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-bold text-gray-800">{course.popularity}%</span>
                    </div>
                  </div>
                  
                  {/* Level Badge Overlay */}
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="outline" className={`bg-gradient-to-r ${course.color} text-white border-0 shadow-lg px-2.5 py-1 text-xs font-semibold`}>
                      {course.level}
                    </Badge>
                  </div>
                </div>

                {/* Course Content - Better Mobile Padding */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  {/* Title and Description */}
                  <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Info - Better Mobile Layout */}
                  <div className="mb-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-xs">{course.duration}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-xs">{course.class_size}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 fill-yellow-500" />
                        <span className="text-gray-700 font-medium text-xs">{course.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features - Better Mobile Display */}
                  <div className="mb-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {course.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-2.5 py-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                      {course.features.length > 2 && (
                        <div className="text-xs sm:text-sm text-blue-600 font-semibold px-2.5 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                          +{course.features.length - 2} ویژگی دیگر
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Button - Better Mobile Layout */}
                  <div className="mt-auto pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-right">
                        {course.originalPrice && (
                          <div className="text-xs text-gray-500 line-through mb-0.5">
                            {formatPrice(course.originalPrice)} تومان
                          </div>
                        )}
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                          {formatPrice(course.price)}
                          <span className="text-sm font-normal text-gray-600 mr-1">تومان</span>
                        </div>
                        {course.originalPrice && (
                          <div className="text-xs sm:text-sm text-green-600 font-bold mt-0.5">
                            {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% تخفیف
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA Button - Better Mobile Size */}
                    <Link href="/get-started" className="block">
                      <Button className={`w-full bg-gradient-to-r ${course.color} hover:opacity-95 text-white font-bold py-3 sm:py-3.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base`}>
                        <span className="mr-2">🎯</span>
                        ثبت نام در دوره
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
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
          className="mt-12 text-center"
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
