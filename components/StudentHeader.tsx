"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Moon, 
  Home, 
  BookOpen, 
  User,
  Menu,
  X,
  GraduationCap,
  Video,
  BarChart3,
  Settings,
  CreditCard,
  Trophy,
  Brain,
  Users,
  Gamepad2,
  Target,
  Gift,
  Bell,
  LogOut,
  Calendar,
  Clock,
  Star,
  Zap,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import imageLogo from "./images/logo.png";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface StudentHeaderProps {
  studentName?: string;
  studentEmail?: string;
}

export default function StudentHeader({ studentName, studentEmail }: StudentHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useState("light");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const studentMenuItems = [
    {
      title: "داشبورد",
      href: "/dashboard/student",
      icon: Home,
      description: "نمای کلی پروفایل و پیشرفت",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "رزرو کلاس",
      href: "/teachers",
      icon: BookOpen,
      description: "انتخاب معلم و رزرو کلاس",
      color: "from-green-500 to-green-600"
    },
    {
      title: "کلاس‌های من",
      href: "/dashboard/student?tab=classes",
      icon: Calendar,
      description: "مشاهده کلاس‌های رزرو شده",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "کلاس آنلاین",
      href: "/students/video-call",
      icon: Video,
      description: "پیوستن به کلاس آنلاین",
      color: "from-red-500 to-red-600"
    },
    {
      title: "پیشرفت من",
      href: "/students/progress",
      icon: BarChart3,
      description: "مشاهده پیشرفت یادگیری",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "مربی هوشمند",
      href: "/students/ai-coach",
      icon: Brain,
      description: "چت با AI و دریافت راهنمایی",
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "دنیای گیمیفیکیشن",
      href: "/students/gamification",
      icon: Trophy,
      description: "تبدیل یادگیری به بازی",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "سیستم پاداش",
      href: "/students/rewards",
      icon: Gift,
      description: "کسب امتیاز و پاداش",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "جامعه یادگیری",
      href: "/students/social",
      icon: Users,
      description: "یادگیری گروهی و تعامل",
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "یادگیری تعاملی",
      href: "/students/interactive",
      icon: Gamepad2,
      description: "تجربه یادگیری با AR",
      color: "from-rose-500 to-rose-600"
    },
    {
      title: "یادگیری شخصی",
      href: "/students/personalized",
      icon: Target,
      description: "شخصی‌سازی تجربه یادگیری",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      title: "مدیریت پرداخت‌ها",
      href: "/students/payments",
      icon: CreditCard,
      description: "مشاهده و مدیریت پرداخت‌ها",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "تنظیمات پروفایل",
      href: "/students/profile",
      icon: Settings,
      description: "ویرایش اطلاعات شخصی",
      color: "from-gray-500 to-gray-600"
    }
  ];

  if (!mounted) return null;

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b shadow-lg' 
          : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b'
      }`}>
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:mr-4"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-foreground hover:scale-105 transition-all duration-300 shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">بازگشت</span>
              </Button>
            </motion.div>

            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex justify-center"
            >
              <Link href="/dashboard/student" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image src={imageLogo} alt="لوگو" className="h-10 w-10 transition-transform group-hover:scale-110" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    سِ وان
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">دانش‌آموز</span>
                </div>
              </Link>
            </motion.div>

            {/* Right Side - Hamburger Menu & Theme Toggle */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-foreground hover:scale-110 transition-all duration-300 shadow-md"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </motion.button>

              {/* Hamburger Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-110 transition-all duration-300 shadow-md"
              >
                <Menu className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </nav>
      </header>

      {/* Student Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {studentName || 'دانش‌آموز'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {studentEmail || 'student@example.com'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                {studentMenuItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setIsSidebarOpen(false)}
                      className="block"
                    >
                      <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group">
                        <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Logout Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: studentMenuItems.length * 0.05 + 0.1 }}
                  className="pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    خروج از حساب
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar - Fixed */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden bg-white/95 dark:bg-gray-900/95 border shadow-2xl flex justify-around items-center py-3 px-4 rounded-3xl w-[92vw] max-w-md mx-auto backdrop-blur-md">
        {/* Dashboard */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/dashboard/student"
            className="flex flex-col items-center text-xs text-foreground/70 hover:text-blue-600 transition-colors px-2 py-1 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Home className="w-5 h-5 mb-1" />
            داشبورد
          </Link>
        </motion.div>

        {/* Book Class */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/teachers"
            className="flex flex-col items-center text-xs text-foreground/70 hover:text-green-600 transition-colors px-2 py-1 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <BookOpen className="w-5 h-5 mb-1" />
            رزرو کلاس
          </Link>
        </motion.div>

        {/* Progress */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/students/progress"
            className="flex flex-col items-center text-xs text-foreground/70 hover:text-purple-600 transition-colors px-2 py-1 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            پیشرفت
          </Link>
        </motion.div>

        {/* Menu */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center text-xs text-foreground/70 hover:text-orange-600 transition-colors px-2 py-1 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Menu className="w-5 h-5 mb-1" />
            منو
          </button>
        </motion.div>
      </nav>
    </>
  );
}
