"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getTeacherOAuthRedirectUrl, getStudentOAuthRedirectUrl, getSmartOAuthRedirectUrl, logOAuthConfig } from "@/lib/oauth-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Mail, Lock, Chrome, AlertCircle, User, GraduationCap } from "lucide-react";

function RegisterContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams?.get('type') || 'student';

  const notifyOwner = async (details: {
    email: string;
    fullName?: string;
    userType: string;
    metadata?: Record<string, unknown>;
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/owner-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn('Owner notification failed:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Owner notification error:', err);
      return false;
    }
  };

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

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);

      console.log("🚀 Starting Google OAuth sign in...");
      
      // Clear any existing OAuth state first
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      console.log('🧹 Cleared existing auth state');
      
      // Log OAuth configuration for debugging
      logOAuthConfig();
      
      // Get the proper OAuth redirect URL based on user type
      const redirectUrl = userType === 'teacher' 
        ? getTeacherOAuthRedirectUrl(userType)
        : getStudentOAuthRedirectUrl('student');
      
      console.log("Current origin:", window.location.origin);
      console.log("Final redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error("Google OAuth error:", error);
        
        // Handle specific OAuth errors
        if (error.message.includes("Unsupported provider") || error.message.includes("provider is not enabled")) {
          setError("ورود با گوگل در حال حاضر غیرفعال است. لطفاً از ثبت‌نام با ایمیل استفاده کنید.");
          toast.error("Google OAuth غیرفعال است. از ایمیل استفاده کنید.");
        } else {
          throw error;
        }
        return;
      }

      console.log("Google OAuth initiated successfully");
      toast.success("در حال انتقال به گوگل...");
      
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      if (error.message?.includes("Unsupported provider") || error.message?.includes("provider is not enabled")) {
        setError("ورود با گوگل در حال حاضر غیرفعال است. لطفاً از ثبت‌نام با ایمیل استفاده کنید.");
        toast.error("Google OAuth غیرفعال است. از ایمیل استفاده کنید.");
      } else {
        setError(error.message || "خطا در ورود با گوگل");
        toast.error("خطا در ورود با گوگل");
      }
    } finally {
      setGoogleLoading(false);
    }
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
          emailRedirectTo: `${window.location.origin}/auth/callback?user_type=${userType}`,
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

        const ownerNotificationSent = await notifyOwner({
          email,
          fullName,
          userType,
          metadata: {
            registrationSource: 'email-form',
            supabaseUserId: authData.user.id,
          },
        });
        if (ownerNotificationSent && typeof window !== 'undefined') {
          window.localStorage.setItem(`owner-notified-${authData.user.id}`, 'true');
        }
        
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
      
      let errorMessage = "خطا در ثبت‌نام";
      let rateLimitMessage = null;
      let emailError = false;
      let userCreated = false;
      
      // Check if user was created despite email error
      if (error.message && (
        error.message.includes('Error sending confirmation email') ||
        error.message.includes('email rate limit') ||
        error.message.includes('Email rate limit') ||
        error.message.includes('Email provider not enabled')
      )) {
        emailError = true;
        // Check if user was actually created
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.email === email) {
            userCreated = true;
          }
        } catch (e) {
          console.error('Error checking user:', e);
        }
      }
      
      if (userCreated && emailError) {
        // User was created but email failed - allow them to continue
        toast.success('ثبت‌نام با موفقیت انجام شد!', {
          description: 'ایمیل تایید ارسال نشد، اما می‌توانید وارد شوید.',
          duration: 5000
        });
        
        // Store user type and email
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('userEmail', email);
        
        // Redirect to login
        setTimeout(() => {
          router.push('/login?email=' + encodeURIComponent(email));
        }, 2000);
        return;
      }
      
      if (error.message) {
        // Handle specific Supabase auth errors
        if (error.message.includes("User already registered")) {
          errorMessage = "این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید.";
          setTimeout(() => {
            router.push('/login?email=' + encodeURIComponent(email));
          }, 2000);
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "ایمیل وارد شده معتبر نیست";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "رمز عبور باید حداقل 6 کاراکتر باشد";
        } else if (error.message.includes("Email rate limit exceeded")) {
          errorMessage = "تعداد درخواست‌های شما بیش از حد مجاز است";
          rateLimitMessage = "لطفاً 60 دقیقه صبر کنید یا از Google OAuth استفاده کنید.";
        } else if (error.message.includes("Email provider not enabled")) {
          errorMessage = "ارسال ایمیل در حال حاضر غیرفعال است";
          rateLimitMessage = "لطفاً از Google OAuth استفاده کنید یا با پشتیبانی تماس بگیرید.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "تعداد درخواست‌های شما بیش از حد مجاز است";
          rateLimitMessage = "لطفاً چند دقیقه صبر کنید و دوباره امتحان کنید.";
        } else if (error.message.includes("Error sending confirmation email")) {
          errorMessage = "خطا در ارسال ایمیل تایید";
          rateLimitMessage = "می‌توانید از Google OAuth استفاده کنید یا بعداً وارد شوید.";
        } else {
          errorMessage = error.message;
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <Card className="max-w-md w-full space-y-8 p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === 'teacher' ? 'ثبت‌نام معلم' : 'ثبت‌نام دانش‌آموز'}
          </h2>
          <p className="text-gray-600">
            {userType === 'teacher' 
              ? 'به عنوان معلم در سایت ثبت‌نام کنید' 
              : 'به عنوان دانش‌آموز در سایت ثبت‌نام کنید'
            }
          </p>
          

        </div>

        {/* Google OAuth Button */}
        <div className="space-y-4">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            variant="outline"
            className="w-full h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium"
          >
            <Chrome className="w-5 h-5 mr-2" />
            {googleLoading ? "در حال انتقال..." : "ادامه با گوگل"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">یا</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="نام و نام خانوادگی"
                required
                minLength={3}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 text-right"
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="ایمیل"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 text-right"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="رمز عبور"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 text-right"
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-right">
            حداقل 8 کاراکتر شامل حروف بزرگ، کوچک و اعداد
          </p>

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
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام با ایمیل"}
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
            <p>• برای ورود سریع‌تر، از گوگل استفاده کنید</p>
            <p>• Supabase محدودیت 10 درخواست ایمیل در ساعت دارد</p>
            <p>• در صورت نیاز، تنظیمات SMTP خود را اضافه کنید</p>
          </div>
        </div>

        {/* راهنمای Google OAuth */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <div className="font-semibold text-yellow-800 mb-2">🔧 تنظیمات Google OAuth:</div>
          <div className="text-yellow-700 space-y-1">
            <p>• اگر دکمه گوگل کار نمی‌کند، در Supabase فعال کنید</p>
            <p>• Authentication {'>>'} Providers {'>>'} Google {'>>'} Enable</p>
            <p>• Client ID و Secret را از Google Cloud Console وارد کنید</p>
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
