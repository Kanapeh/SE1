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
  GraduationCap as TeacherIcon
} from "lucide-react";
import Image from "next/image";
import imageLogo from "./images/logo.png";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "خانه", href: "/", icon: Home },
    { name: "دوره‌ها", href: "/courses", icon: BookOpen },
    { name: "معلمان", href: "/teachers", icon: GraduationCap },
    { name: "وبلاگ", href: "/blog", icon: FileText },
    { name: "درباره ما", href: "/about", icon: Users },
    { name: "تماس با ما", href: "/contact", icon: Phone },
  ];

  if (!mounted) return null;

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b shadow-lg' 
          : 'bg-transparent'
      }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Hamburger Menu Button - Left Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:mr-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-foreground hover:scale-110 transition-all duration-300 shadow-md"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Logo with animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex md:justify-start justify-center"
          >
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <Image src={imageLogo} alt="لوگو" className="h-12 w-12 transition-transform group-hover:scale-110 logo-image" />
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-logo">
                  سِ وان
                </span>
                <span className="text-xs font-persian text-muted-foreground -mt-0.5">آکادمی زبان</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative group text-foreground/70 hover:text-foreground transition-all duration-300 px-3 py-2 rounded-lg hover:bg-primary/10 font-header"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/register">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group font-header">
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  شروع کنید
                </Button>
              </Link>
            </motion.div>

            {/* Theme Toggle Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-foreground hover:scale-110 transition-all duration-300 shadow-md"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
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
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Image src={imageLogo} alt="لوگو" className="h-8 w-8 logo-image" />
                  <span className="text-lg font-logo">سِ وان</span>
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

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-header text-gray-900 dark:text-white mb-6">انتخاب کنید:</h3>
                
                {/* Teacher Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4"
                >
                  <Link href="/register?type=teacher" onClick={() => setIsSidebarOpen(false)}>
                    <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <TeacherIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1">معلم هستم</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ثبت‌نام به عنوان معلم</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Student Option */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link href="/register?type=student" onClick={() => setIsSidebarOpen(false)}>
                    <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-header text-gray-900 dark:text-white mb-1">دانش‌آموز هستم</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ثبت‌نام به عنوان دانش‌آموز</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar - Fixed */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 border shadow-2xl flex justify-around items-center py-3 px-4 rounded-3xl w-[92vw] max-w-md mx-auto backdrop-blur-md">
        {navItems.slice(0, 4).map((item, idx) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={item.href}
              className="flex flex-col items-center text-xs text-foreground/70 hover:text-primary transition-colors px-2 py-1 rounded-xl hover:bg-primary/10 font-persian"
            >
              <item.icon className="w-5 h-5 mb-1" />
              {item.name}
            </Link>
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/register">
            <Button size="sm" className="px-3 py-2 flex flex-col items-center rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg font-header">
              <Plus className="w-5 h-5 mb-1" />
              شروع کنید
            </Button>
          </Link>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex flex-col items-center text-xs text-foreground px-2 py-1 rounded-xl hover:bg-primary/10 font-persian"
        >
          <span className="mb-1">{theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</span>
          {theme === "light" ? "تاریک" : "روشن"}
        </motion.button>
      </nav>
    </>
  );
}
