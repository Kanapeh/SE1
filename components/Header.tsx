"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Home, 
  BookOpen, 
  FileText, 
  Users, 
  Phone, 
  Plus,
  GraduationCap,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import imageLogo from "./images/logo.png";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b shadow-lg' 
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex md:justify-start justify-center"
          >
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <Image src={imageLogo} alt="لوگو" className="h-12 w-12 transition-transform group-hover:scale-110" />
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  SE1A
                </span>
                <span className="text-xs text-muted-foreground -mt-1">آکادمی زبان</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative group text-foreground/70 hover:text-foreground transition-all duration-300 px-3 py-2 rounded-lg hover:bg-primary/10"
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
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group">
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-foreground hover:scale-110 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
                <div className="px-4 pt-2">
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                      <Sparkles className="w-4 h-4 mr-2" />
                      شروع کنید
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Navigation Bar - Enhanced */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 border shadow-2xl flex justify-around items-center py-3 px-4 rounded-3xl w-[92vw] max-w-md mx-auto backdrop-blur-md">
        {navItems.slice(0, 4).map((item, idx) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={item.href}
              className="flex flex-col items-center text-xs text-foreground/70 hover:text-primary transition-colors px-2 py-1 rounded-xl hover:bg-primary/10"
            >
              <item.icon className="w-5 h-5 mb-1" />
              {item.name}
            </Link>
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href="/register">
            <Button size="sm" className="px-3 py-2 flex flex-col items-center rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg">
              <Plus className="w-5 h-5 mb-1" />
              شروع کنید
            </Button>
          </Link>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex flex-col items-center text-xs text-foreground px-2 py-1 rounded-xl hover:bg-primary/10"
        >
          <span className="mb-1">{theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</span>
          {theme === "light" ? "تاریک" : "روشن"}
        </motion.button>
      </nav>
    </header>
  );
}
