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
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null);
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
    setRateLimitInfo(null);

    try {
      console.log("Starting registration process...");
      console.log("Email:", email);
      console.log("User type:", userType);
      console.log("Supabase config:", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"
      });

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

      console.log("Input validation passed, attempting to sign up...");

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

      console.log("Sign up response:", { authData, authError });

      if (authError) {
        console.error("Auth error details:", {
          message: authError.message,
          status: authError.status,
          name: authError.name,
          details: authError
        });
        throw authError;
      }

      if (authData.user) {
        console.log("User created successfully:", authData.user.id);
        
        // Store user type and email in session storage for later use
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('userEmail', email);
        
        // Check if email confirmation is required
        if (authData.user.email_confirmed_at) {
          console.log("Email already confirmed, redirecting to profile completion");
          // Email already confirmed, redirect to profile completion
          if (userType === 'teacher') {
            toast.success("ثبت‌نام با موفقیت انجام شد. لطفا پروفایل معلم خود را تکمیل کنید.");
            router.push("/complete-profile?type=teacher");
          } else {
            toast.success("ثبت‌نام با موفقیت انجام شد. لطفا پروفایل دانش‌آموز خود را تکمیل کنید.");
            router.push("/complete-profile?type=student");
          }
        } else {
          console.log("Email confirmation required, redirecting to verify email");
          // Email confirmation required
          toast.success("ثبت‌نام با موفقیت انجام شد. لطفاً ایمیل خود را تایید کنید.");
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      } else {
        console.log("No user data returned from sign up");
        throw new Error("خطا در ایجاد حساب کاربری");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: error.status,
        name: error.name
      });
      
      let errorMessage = "خطا در ثبت‌نام";
      let rateLimitMessage = null;
      
      if (error.message) {
        // Handle specific Supabase auth errors
        if (error.message.includes("User already registered")) {
          errorMessage = "این ایمیل قبلاً ثبت شده است";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "ایمیل وارد شده معتبر نیست";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "رمز عبور باید حداقل 6 کاراکتر باشد";
        } else if (error.message.includes("Email rate limit exceeded")) {
          errorMessage = "تعداد درخواست‌های شما بیش از حد مجاز است";
          rateLimitMessage = "لطفاً 60 دقیقه صبر کنید یا از ایمیل دیگری استفاده کنید. Supabase محدودیت 10 درخواست ایمیل در ساعت دارد.";
        } else if (error.message.includes("Email provider not enabled")) {
          errorMessage = "ارسال ایمیل در حال حاضر غیرفعال است. لطفاً با پشتیبانی تماس بگیرید";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "تعداد درخواست‌های شما بیش از حد مجاز است";
          rateLimitMessage = "لطفاً چند دقیقه صبر کنید و دوباره امتحان کنید.";
        } else {
          errorMessage = error.message;
        }
      } else if (error.code === '23505') {
        errorMessage = "این ایمیل قبلاً ثبت شده است";
      } else if (error.code === '42P01') {
        errorMessage = "خطا در دسترسی به پایگاه داده";
      } else if (error.code === '23502') {
        errorMessage = "لطفاً تمام فیلدهای ضروری را پر کنید";
      }
      
      setError(errorMessage);
      if (rateLimitMessage) {
        setRateLimitInfo(rateLimitMessage);
      }
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
            <p className="text-xs text-gray-500 mt-1 text-right">
              حداقل 8 کاراکتر شامل حروف بزرگ، کوچک و اعداد
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div className="font-semibold mb-1">خطا:</div>
              {error}
            </div>
          )}

          {rateLimitInfo && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              <div className="font-semibold mb-1">راهنمایی:</div>
              {rateLimitInfo}
              <div className="mt-2 text-xs">
                <strong>راه‌حل‌های سریع:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>60 دقیقه صبر کنید</li>
                  <li>از ایمیل دیگری استفاده کنید</li>
                  <li>تنظیمات SMTP را بررسی کنید</li>
                </ul>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            قبلاً حساب کاربری دارید؟{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              ورود کنید
            </a>
          </p>
        </div>

        {/* راهنمای Rate Limit */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <div className="font-semibold text-blue-800 mb-2">💡 نکته مهم:</div>
          <div className="text-blue-700 space-y-1">
            <p>• Supabase محدودیت 10 درخواست ایمیل در ساعت دارد</p>
            <p>• برای تست، از ایمیل‌های مختلف استفاده کنید</p>
            <p>• در صورت نیاز، تنظیمات SMTP خود را اضافه کنید</p>
          </div>
        </div>
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
