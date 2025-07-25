"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        setIsAdmin(userData?.is_admin || false);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      title: "داشبورد",
      href: isAdmin ? "/admin" : "/dashboard",
      icon: Home,
    },
    {
      title: "دوره‌ها",
      href: isAdmin ? "/admin/courses" : "/courses",
      icon: BookOpen,
    },
    {
      title: "معلمان",
      href: "/teachers",
      icon: GraduationCap,
    },
    ...(isAdmin
      ? [
          {
            title: "دانش‌آموزان",
            href: "/admin/students",
            icon: Users,
          },
        ]
      : []),
    {
      title: "تنظیمات",
      href: isAdmin ? "/admin/settings" : "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* دکمه همبرگری */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-background border shadow-lg hover:bg-muted transition-colors"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      {/* سایدبار */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* پس‌زمینه تیره */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* سایدبار */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 right-0 h-full w-64 bg-background border-l shadow-xl z-50"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-foreground">منو</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-foreground" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>خروج از {isAdmin ? "ادمین" : "دانش‌آموز"}</span>
                  </button>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 