"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "./images/Hero.jpg";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  BookOpenCheck,
  GraduationCap,
  Users,
  Star,
  Timer,
  CalendarCheck,
  Megaphone,
  PlayCircle,
  Award,
  Target,
  Zap,
} from "lucide-react";

const highlightCards = [
  {
    title: "مسیر مبتدی تا مکالمه",
    description: "شروع از صفر تا مکالمه روان در ۱۴ هفته",
    badge: "پرفروش",
    link: "/courses",
    accent: "from-cyan-500/10 via-cyan-500/5 to-blue-500/10",
  },
  {
    title: "کلاس خصوصی VIP",
    description: "برنامه شخصی‌سازی شده برای هر هدف زبانی",
    badge: "جدید",
    link: "/courses",
    accent: "from-emerald-500/10 via-teal-400/10 to-teal-500/5",
  },
  {
    title: "باشگاه مکالمه",
    description: "جلسات هفتگی با مربیان بین‌المللی",
    badge: "آنلاین",
    link: "/community",
    accent: "from-indigo-500/10 via-indigo-500/5 to-purple-500/10",
  },
];

const hashtags = ["#مکالمه_روان", "#IELTS", "#گرامر_پایه", "#کودکان", "#BusinessEnglish", "#SpeakingLab"];

export default function Hero() {
  return (
    <section dir="rtl" className="relative overflow-hidden bg-white">
      {/* Clean Background with Subtle Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-50/50 to-pink-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 pb-20 pt-12 md:px-8 md:pt-16 lg:pt-20">
        {/* Top Badge - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-5 py-2 text-sm font-semibold text-indigo-700"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>برنامه آیلتس ۲۰۲۵ منتشر شد</span>
          </motion.div>
        </motion.div>

        {/* Main Hero Content - Clean & Minimal */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-right space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight"
              >
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  یادگیری زبان انگلیسی
                </span>
                <span className="block mt-3 text-slate-800">
                  با بهترین روش
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-xl"
              >
                مسیر یادگیری شخصی‌سازی شده برای هر سطح. از مبتدی تا پیشرفته، با اساتید مجرب و روش‌های نوین آموزشی.
              </motion.p>
            </div>
               
            {/* CTA Button - دریافت مشاوره */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Link href="/contact" className="inline-flex">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-indigo-300/50 transition-all hover:shadow-indigo-400/50 overflow-hidden">
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <Megaphone className="h-6 w-6" />
                      دریافت مشاوره رایگان
                    </span>
                    <ArrowRight className="h-6 w-6 relative z-10 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
               
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-end gap-6 pt-6 text-sm text-slate-600"
            >
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white shadow-sm" />
                  ))}
                </div>
                <span className="font-semibold">بیش از ۵۰۰ زبان‌آموز راضی</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-100">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="font-semibold">امتیاز ۴.۹ از ۵</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[4/5] lg:aspect-square">
                <Image
                  src={HeroImage}
                  alt="SE1A Language Academy"
                  fill
                  className="object-cover"
                  priority
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-indigo-600">۱۴+</div>
                    <div className="text-xs text-slate-600 font-medium mt-1">زبان</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-purple-600">۲۴/۷</div>
                    <div className="text-xs text-slate-600 font-medium mt-1">پشتیبانی</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-pink-600">۹۵٪</div>
                    <div className="text-xs text-slate-600 font-medium mt-1">رضایت</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

