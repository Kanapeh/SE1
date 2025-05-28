"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
}

interface Course {
  id: string;
  title: string;
  level: string;
  start_date: string;
  status: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchUserData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUser({ ...user, avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* پروفایل کاربر */}
        <Card className="p-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {user?.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{user?.full_name}</h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  تغییر عکس پروفایل
                </Button>
              </label>
              {avatarFile && (
                <Button onClick={uploadAvatar} className="w-full">
                  آپلود عکس
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* دوره‌های فعال */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-xl font-bold mb-4">دوره‌های فعال</h3>
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">تاریخ شروع: {course.start_date}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm ${
                        course.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {course.status === 'active' ? 'در حال برگزاری' : 'به زودی'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              شما هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
} 