"use client";

import { useEffect, useState } from "react";
import { Request } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminDashboard() {
  const sections = [
    {
      title: 'درخواست‌ها',
      description: 'مدیریت درخواست‌های ثبت‌نام',
      href: '/admin/requests',
      icon: '📝',
      color: 'bg-blue-50',
    },
    {
      title: 'دوره‌ها',
      description: 'مدیریت دوره‌های آموزشی',
      href: '/admin/courses',
      icon: '📚',
      color: 'bg-green-50',
    },
    {
      title: 'قیمت‌ها',
      description: 'مدیریت قیمت‌گذاری دوره‌ها',
      href: '/admin/pricing',
      icon: '💰',
      color: 'bg-yellow-50',
    },
    {
      title: 'وبلاگ',
      description: 'مدیریت مقالات و محتوا',
      href: '/admin/blog',
      icon: '📝',
      color: 'bg-purple-50',
    },
    {
      title: 'تنظیمات',
      description: 'تنظیمات سیستم',
      href: '/admin/settings',
      icon: '⚙️',
      color: 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">داشبورد مدیریت</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`block p-6 rounded-lg shadow transition-transform hover:scale-105 ${section.color}`}
          >
            <div className="flex items-center mb-4">
              <span className="text-2xl ml-3">{section.icon}</span>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <p className="text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
