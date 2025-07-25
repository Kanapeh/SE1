"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Home, BookOpen, FileText, Users, Phone, Plus } from "lucide-react";
import Image from "next/image";
import imageLogo from "./images/logo.png";
import { useTheme } from "next-themes";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "خانه", href: "/" },
    { name: "دوره‌ها", href: "/courses" },
    { name: "وبلاگ", href: "/blog" },
    { name: "درباره ما", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
  ];

  if (!mounted) return null;

  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between md:justify-between">
          {/* Logo - Centered on mobile */}
          <div className="flex-1 flex md:justify-start justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={imageLogo} alt="لوگو" className="h-10 w-10" />
              <span className="text-2xl font-bold">SE1A</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button>شروع کنید</Button>
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-foreground"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Bottom Navigation Bar - Styled */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden bg-white/90 dark:bg-gray-900/90 border shadow-lg flex justify-around items-center py-2 px-2 rounded-2xl w-[95vw] max-w-md mx-auto backdrop-blur">
        {navItems.map((item, idx) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-xs text-foreground/70 hover:text-primary transition-colors px-2 py-1 rounded-lg"
          >
            {/* Icons for each menu item */}
            {idx === 0 && <Home className="w-5 h-5 mb-1" />}
            {idx === 1 && <BookOpen className="w-5 h-5 mb-1" />}
            {idx === 2 && <FileText className="w-5 h-5 mb-1" />}
            {idx === 3 && <Users className="w-5 h-5 mb-1" />}
            {idx === 4 && <Phone className="w-5 h-5 mb-1" />}
            {item.name}
          </Link>
        ))}
        <Button size="sm" className="px-2 py-1 flex flex-col items-center rounded-lg">
          <Plus className="w-5 h-5 mb-1" />
          شروع کنید
        </Button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="flex flex-col items-center text-xs text-foreground px-2 py-1 rounded-lg"
        >
          <span className="mb-1">{theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</span>
          {theme === "light" ? "تاریک" : "روشن"}
        </button>
      </nav>
    </header>
  );
}
