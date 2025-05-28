"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, Settings, FileText, DollarSign, MessageSquare } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "داشبورد", icon: Home },
    { href: "/admin/courses", label: "مدیریت دوره‌ها", icon: BookOpen },
    { href: "/admin/students", label: "مدیریت دانش‌آموزان", icon: Users },
    { href: "/admin/requests", label: "درخواست‌ها", icon: FileText },
    { href: "/admin/pricing", label: "مدیریت قیمت‌ها", icon: DollarSign },
    { href: "/admin/messages", label: "پیام‌ها", icon: MessageSquare },
    { href: "/admin/settings", label: "تنظیمات", icon: Settings },
  ];

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">پنل مدیریت</h1>
        <p className="text-sm text-gray-500">مدیریت مرکز آموزشی</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 right-4 left-4">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <span>خروج از پنل مدیریت</span>
        </Link>
      </div>
    </aside>
  );
} 