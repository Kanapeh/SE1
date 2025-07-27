"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

function RegisterContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get('type') || 'student';

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isStrongPassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!isValidEmail(email)) {
        throw new Error("لطفا یک ایمیل معتبر وارد کنید");
      }

      if (!isStrongPassword(password)) {
        throw new Error("رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و اعداد باشد");
      }

      if (fullName.trim().length < 3) {
        throw new Error("نام و نام خانوادگی باید حداقل 3 کاراکتر باشد");
      }

      // Register user in auth.users only
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            user_type: userType,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Store user type and email in session storage for later use
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('userEmail', email);
        
        // Check if email confirmation is required
        if (authData.user.email_confirmed_at) {
          // Email already confirmed, redirect to profile completion
          if (userType === 'teacher') {
            toast.success("ثبت‌نام با موفقیت انجام شد. لطفا پروفایل معلم خود را تکمیل کنید.");
            router.push("/complete-profile?type=teacher");
          } else {
            toast.success("ثبت‌نام با موفقیت انجام شد. لطفا پروفایل دانش‌آموز خود را تکمیل کنید.");
            router.push("/complete-profile?type=student");
          }
        } else {
          // Email confirmation required
          toast.success("ثبت‌نام با موفقیت انجام شد. لطفاً ایمیل خود را تایید کنید.");
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      }
    } catch (error: any) {
      console.error("Register error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      let errorMessage = "خطا در ثبت‌نام";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === '23505') {
        errorMessage = "این ایمیل قبلاً ثبت شده است";
      } else if (error.code === '42P01') {
        errorMessage = "خطا در دسترسی به پایگاه داده";
      } else if (error.code === '23502') {
        errorMessage = "لطفاً تمام فیلدهای ضروری را پر کنید";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-2xl font-bold text-foreground">
            {userType === 'teacher' ? 'ثبت‌نام معلم' : 'ثبت‌نام دانش‌آموز'}
          </h2>
          <p className="text-center text-sm text-gray-600 mt-2">
            {userType === 'teacher' 
              ? 'به عنوان معلم در سایت ثبت‌نام کنید' 
              : 'به عنوان دانش‌آموز در سایت ثبت‌نام کنید'
            }
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="نام و نام خانوادگی"
              required
              minLength={3}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-right"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="ایمیل"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-right"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="رمز عبور"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-right"
            />
            <p className="text-sm text-gray-500 mt-1">
              رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و اعداد باشد
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
