"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login for:", email);
      
      // Login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          setError("ایمیل یا رمز عبور اشتباه است");
        } else if (error.message.includes("Email not confirmed")) {
          setError("لطفاً ابتدا ایمیل خود را تایید کنید");
        } else {
          setError(error.message || "خطا در ورود به سیستم");
        }
        return;
      }

      if (data.user) {
        console.log("Login successful:", data.user);
        
        // Check if user is admin first
        const { data: adminData } = await supabase
          .from("admins")
          .select("user_id, role")
          .eq("user_id", data.user.id)
          .single();

        if (adminData) {
          console.log("User is admin:", adminData);
          toast.success("خوش آمدید ادمین!");
          router.push("/admin");
          return;
        }

        // Check if user has admin role in auth-users table
        const { data: authUserData } = await supabase
          .from("auth-users")
          .select("id, role, is_admin")
          .eq("id", data.user.id)
          .single();

        if (authUserData && (authUserData.role === 'admin' || authUserData.is_admin === true)) {
          console.log("User is admin by role:", authUserData);
          toast.success("خوش آمدید ادمین!");
          router.push("/admin");
          return;
        }

        // Check if user has a profile in teachers table
        const { data: teacherData } = await supabase
          .from("teachers")
          .select("id, status")
          .eq("id", data.user.id)
          .single();

        if (teacherData) {
          if (teacherData.status === 'active') {
            toast.success("خوش آمدید معلم!");
            router.push("/admin"); // یا صفحه معلم
          } else {
            setError("حساب کاربری شما هنوز تایید نشده است. لطفاً منتظر تایید ادمین باشید.");
          }
          return;
        }

        // Check if user has a profile in students table
        const { data: studentData } = await supabase
          .from("students")
          .select("id, status")
          .eq("id", data.user.id)
          .single();

        if (studentData) {
          if (studentData.status === 'active') {
            toast.success("خوش آمدید دانشجو!");
            router.push("/dashboard");
          } else {
            setError("حساب کاربری شما غیرفعال است.");
          }
          return;
        }

        // User exists in auth but no profile - redirect to complete profile
        console.log("User has no profile, redirecting to complete profile");
        toast.success("لطفاً پروفایل خود را تکمیل کنید");
        router.push("/complete-profile");
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setError("خطای غیرمنتظره رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ورود به حساب کاربری
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ایمیل و رمز عبور خود را وارد کنید
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ایمیل
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="text-right"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رمز عبور
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور خود را وارد کنید"
              className="text-right"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              ثبت‌نام کنید
            </Link>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            رمز عبور خود را فراموش کرده‌اید؟{" "}
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
              بازیابی رمز عبور
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
