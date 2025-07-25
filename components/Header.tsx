"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
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
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
            {/* Example icons for each menu item (replace with your own if needed) */}
            {idx === 0 && <span className="mb-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/></svg></span>}
            {idx === 1 && <span className="mb-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4v16m0 0H3"/></svg></span>}
            {idx === 2 && <span className="mb-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg></span>}
            {idx === 3 && <span className="mb-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M12 4v16m0 0H3"/></svg></span>}
            {idx === 4 && <span className="mb-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10V6a2 2 0 00-2-2H5a2 2 0 00-2 2v4"/><path d="M7 10v10a2 2 0 002 2h6a2 2 0 002-2V10"/></svg></span>}
            {item.name}
          </Link>
        ))}
        <Button size="sm" className="px-2 py-1 flex flex-col items-center rounded-lg">
          <span className="mb-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg></span>
          شروع کنید
        </Button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex flex-col items-center text-xs text-gray-800 dark:text-gray-200 px-2 py-1 rounded-lg"
        >
          <span className="mb-1">{theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</span>
          {theme === "light" ? "تاریک" : "روشن"}
        </button>
      </nav>
    </header>
  );
}
