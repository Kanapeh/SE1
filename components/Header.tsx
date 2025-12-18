"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Moon, 
  Home, 
  BookOpen, 
  FileText, 
  Users, 
  Phone, 
  Plus,
  GraduationCap,
  Sparkles,
  Menu,
  X,
  User,
  Shield,
  GraduationCap as TeacherIcon,
  Globe,
  Star,
  Zap,
  Heart,
  Award,
  Target
} from "lucide-react";
import Image from "next/image";
import imageLogo from "./images/logo.png";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(currentProgress, 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Control body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isSidebarOpen]);

  // Hide header on student dashboard pages
  if (pathname?.startsWith('/dashboard/student') || pathname?.startsWith('/students/')) {
    return null;
  }

  if (!mounted) return null;

  const navItems = [
    { name: "خانه", href: "/", icon: Home, description: "صفحه اصلی" },
    { name: "دوره‌ها", href: "/courses", icon: BookOpen, description: "دوره‌های آموزشی" },
    { name: "معلمان", href: "/teachers", icon: GraduationCap, description: "اساتید مجرب" },
    { name: "وبلاگ", href: "/blog", icon: FileText, description: "مقالات آموزشی" },
    { name: "درباره ما", href: "/about", icon: Users, description: "شناخت بیشتر" },
    { name: "تماس با ما", href: "/contact", icon: Phone, description: "ارتباط با ما" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-2xl' 
          : 'bg-gradient-to-r from-white/80 via-white/90 to-white/80 dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900/80 backdrop-blur-xl'
      }`}>
        {/* Scroll Progress Bar */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Hamburger Menu Button - Left Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:mr-8"
          >
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(true)}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-foreground hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </motion.div>

            {/* Logo with enhanced animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex justify-center lg:justify-start"
          >
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image src={imageLogo} alt="لوگو" className="h-10 w-10 transition-transform group-hover:scale-110 logo-image" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                <motion.div
                    className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="flex flex-col">
                  <motion.span 
                    className="text-xl font-logo bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                  سِ وان
                  </motion.span>
                  <span className="text-xs font-persian text-muted-foreground -mt-0.5 flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    آکادمی زبان
                </span>
              </div>
            </Link>
          </motion.div>

            {/* Desktop Navigation with enhanced design */}
            <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                  className="relative group"
              >
                <Link
                  href={item.href}
                    className="relative flex flex-col items-center text-foreground/70 hover:text-foreground transition-all duration-300 px-2 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 font-header group"
                  >
                    <item.icon className="w-4 h-4 mb-1.5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium leading-tight">{item.name}</span>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 text-center leading-tight">
                      {item.description}
                    </span>
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                </Link>
              </motion.div>
            ))}
            
              {/* Enhanced Login Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
                className="mr-2"
            >
              <Link href="/login">
                  <Button variant="outline" className="border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group font-header px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl text-sm">
                  <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  ورود
                </Button>
              </Link>
            </motion.div>

              {/* Enhanced Register Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
                className="mr-2"
            >
              <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 group font-header px-4 py-2.5 rounded-xl relative overflow-hidden text-sm">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  ثبت‌نام
                </Button>
              </Link>
            </motion.div>

              {/* Enhanced Theme Toggle Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-foreground hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50"
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
                </motion.div>
            </motion.button>
            </div>
          </div>
      </nav>
      </header>

      {/* Sidebar */}
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
            
            {/* Enhanced Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-88 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl z-50 border-l border-gray-200/50 dark:border-gray-700/50 flex flex-col"
              onTouchMove={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Enhanced Header - Fixed */}
              <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 flex-shrink-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image src={imageLogo} alt="لوگو" className="h-10 w-10 logo-image" />
                    </motion.div>
                    <div>
                      <span className="text-xl font-logo bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        سِ وان
                      </span>
                      <p className="text-xs text-muted-foreground">آکادمی زبان</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-foreground hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Content - Scrollable */}
              <div className="flex-1 overflow-y-auto sidebar-content p-6 space-y-5 pb-40">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-header text-gray-900 dark:text-white mb-2">🎯 انتخاب کنید</h3>
                  <p className="text-sm text-muted-foreground">مسیر موفقیت خود را انتخاب کنید</p>
                </div>
                
                {/* Enhanced Teacher Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Link href="/login" onClick={() => setIsSidebarOpen(false)}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-2xl transition-all duration-300 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <TeacherIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            معلم هستم
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-tight">ورود به پنل معلم و مدیریت کلاس‌ها</p>
                          <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                            <Zap className="w-3 h-3" />
                            <span>ورود سریع</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* New Teacher Registration Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link href="/register?type=teacher" onClick={() => setIsSidebarOpen(false)}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-indigo-200/50 dark:border-indigo-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-2xl transition-all duration-500 p-4">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Plus className="w-6 h-6 text-white" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            معلم جدید
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-tight">ثبت‌نام به عنوان معلم جدید و شروع تدریس</p>
                          <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400">
                            <Sparkles className="w-3 h-3" />
                            <span>شروع جدید</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Enhanced Student Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/login" onClick={() => setIsSidebarOpen(false)}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-2 border-green-200/50 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 hover:shadow-2xl transition-all duration-500 p-4">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Heart className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            دانش‌آموز هستم
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-tight">ورود به سیستم و مدیریت کلاس‌ها</p>
                          <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                            <Target className="w-3 h-3" />
                            <span>رسیدن به اهداف</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Enhanced About Us Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href="/about" onClick={() => setIsSidebarOpen(false)}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 border-2 border-orange-200/50 dark:border-orange-700/50 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-2xl transition-all duration-500 p-4">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Award className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            درباره ما
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-tight">آشنایی با آکادمی سِ وان و تیم ما</p>
                          <div className="flex items-center space-x-2 text-xs text-orange-600 dark:text-orange-400">
                            <Star className="w-3 h-3" />
                            <span>شناخت بیشتر</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Enhanced Blog Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <Link href="/blog" onClick={() => setIsSidebarOpen(false)}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 border-2 border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-2xl transition-all duration-500 p-4">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Star className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            وبلاگ
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-tight">مقالات آموزشی و نکات یادگیری زبان</p>
                          <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400">
                            <BookOpen className="w-3 h-3" />
                            <span>آموزش و یادگیری</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Enhanced Contact Us Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/contact" onClick={() => setIsSidebarOpen(false)}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 border-2 border-indigo-200/50 dark:border-indigo-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-2xl transition-all duration-500 p-4">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Zap className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            تماس با ما
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-tight">ارتباط با تیم پشتیبانی و مشاوره</p>
                          <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400">
                            <Heart className="w-3 h-3" />
                            <span>پشتیبانی 24/7</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Bottom Navigation Bar - Fixed */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl flex justify-around items-center py-3 px-4 rounded-3xl w-[96vw] max-w-lg mx-auto backdrop-blur-xl">
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        
        {navItems.slice(0, 4).map((item, idx) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <Link
              href={item.href}
              className="flex flex-col items-center text-xs text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 px-3 py-2 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 font-persian"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className="w-5 h-5 mb-2" />
              </motion.div>
              <span className="font-medium text-xs leading-tight">{item.name}</span>
              <motion.span 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                whileHover={{ width: "80%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        ))}
        
        {/* Enhanced Login Button */}
        <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Link href="/login">
            <Button size="sm" variant="outline" className="px-2 py-2 flex flex-col items-center rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 font-header shadow-lg">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <User className="w-4 h-4 mb-1" />
              </motion.div>
              <span className="text-xs font-medium">ورود</span>
            </Button>
          </Link>
        </motion.div>

        {/* Enhanced Register Button */}
        <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Link href="/register">
            <Button size="sm" className="px-2 py-2 flex flex-col items-center rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-xl font-header relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Plus className="w-4 h-4 mb-1" />
              </motion.div>
              <span className="text-xs font-medium">ثبت‌نام</span>
            </Button>
          </Link>
        </motion.div>

        {/* Enhanced Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1, y: -2, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex flex-col items-center text-xs text-foreground px-2 py-2 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 font-persian transition-all duration-300"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="mb-1"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </motion.div>
          <span className="font-medium text-xs leading-tight">{theme === "light" ? "تاریک" : "روشن"}</span>
        </motion.button>
      </nav>
    </>
  );
}
