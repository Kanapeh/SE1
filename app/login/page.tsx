"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, clearSupabaseStorage, checkSessionWithRetry } from "@/lib/supabase";
import { getSmartOAuthRedirectUrl, logOAuthConfig } from "@/lib/oauth-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Mail, Lock, Chrome, AlertCircle } from "lucide-react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Get email from URL params if available
  useEffect(() => {
    if (searchParams?.get('email')) {
      setEmail(searchParams.get('email') || '');
    }
    if (searchParams?.get('registered') === 'true') {
      toast.info('ثبت‌نام شما با موفقیت انجام شد. می‌توانید وارد شوید.', {
        duration: 5000
      });
    }
  }, [searchParams]);

  // Helper function to handle redirects
  const handleRedirect = (defaultPath: string, message: string) => {
    toast.success(message);
    
    // Check if there's a redirectTo parameter
    const redirectTo = searchParams?.get('redirectTo');
    const targetPath = redirectTo && redirectTo.startsWith('/') ? redirectTo : defaultPath;
    
    console.log(`🔄 Redirecting to: ${targetPath}`);
    console.log(`🔄 Current pathname: ${window.location.pathname}`);
    console.log(`🔄 Target path: ${targetPath}`);
    
    // Use Next.js router for navigation
    try {
      console.log('🔄 Using Next.js router for navigation...');
      router.push(targetPath);
      
      // Fallback: if router doesn't work, use window.location
      setTimeout(() => {
        if (window.location.pathname !== targetPath) {
          console.log('🔄 Router navigation failed, using window.location fallback...');
          window.location.href = targetPath;
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Router navigation failed:', error);
      // Fallback to window.location
      try {
        console.log('🔄 Using window.location fallback...');
        window.location.href = targetPath;
      } catch (windowError) {
        console.error('❌ Window location also failed:', windowError);
        // Last resort: reload the page
        window.location.reload();
      }
    }
  };

  // Check for OAuth errors from URL params
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    const detailsParam = searchParams?.get('details');
    
    if (errorParam) {
      let errorMessage = '';
      
      switch (errorParam) {
        case 'oauth_access_denied':
          errorMessage = 'دسترسی به حساب گوگل رد شد. لطفاً دوباره تلاش کنید.';
          break;
        case 'oauth_error':
          errorMessage = detailsParam || 'خطا در احراز هویت گوگل. لطفاً دوباره تلاش کنید.';
          break;
        case 'exchange_failed':
          errorMessage = detailsParam || 'خطا در تبادل کد احراز هویت. لطفاً دوباره تلاش کنید.';
          break;
        case 'invalid_grant':
          errorMessage = 'کد احراز هویت منقضی شده یا نامعتبر است. لطفاً دوباره تلاش کنید.';
          break;
        case 'code_already_used':
          errorMessage = 'کد احراز هویت قبلاً استفاده شده است. لطفاً دوباره تلاش کنید.';
          break;
        case 'invalid_code':
          errorMessage = 'کد احراز هویت نامعتبر است. لطفاً دوباره تلاش کنید.';
          break;
        case 'no_code':
          errorMessage = 'کد احراز هویت دریافت نشد. لطفاً دوباره تلاش کنید.';
          break;
        case 'no_user_data':
          errorMessage = 'اطلاعات کاربر دریافت نشد. لطفاً دوباره تلاش کنید.';
          break;
        case 'inactive_teacher':
          errorMessage = 'حساب معلم شما هنوز فعال نشده است.';
          break;
        case 'inactive_student':
          errorMessage = 'حساب دانشجو شما غیرفعال است.';
          break;
        case 'unexpected_error':
          errorMessage = `خطای غیرمنتظره: ${detailsParam || 'خطای نامشخص'}`;
          break;
        default:
          errorMessage = detailsParam || 'خطا در ورود با گوگل. لطفاً دوباره تلاش کنید.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Clear error from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.delete('details');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  // Simple session check - only run once on mount
  useEffect(() => {
    const checkSessionOnce = async () => {
      try {
        console.log('🔍 Checking session on login page...');
        const { session, error } = await checkSessionWithRetry(2);
        
        if (error) {
          console.error('❌ Session check failed:', error);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Session found, will redirect after login');
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (error) {
        console.error('💥 Session check error:', error);
        // Don't show error to user for session check failures
      }
    };
    
    checkSessionOnce();
  }, []); // Empty dependency array - only runs once

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);

      console.log("🔄 Starting Google OAuth with PKCE...");
      
      // Ensure we're on client side
      if (typeof window === 'undefined') {
        throw new Error('OAuth can only be initiated from client side');
      }
      
      // Clear any existing OAuth state first
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      console.log('🧹 Cleared existing auth state');
      
      // Log OAuth configuration for debugging
      logOAuthConfig();
      
      // Get the proper OAuth redirect URL (smart detection)
      const redirectUrl = getSmartOAuthRedirectUrl();
      
      console.log("Current origin:", window.location.origin);
      console.log("Final redirect URL:", redirectUrl);
      
      // Clear any existing sessions first
      await supabase.auth.signOut();
      
      // Don't clear all storage immediately - let PKCE establish first
      // We'll clear it after successful OAuth initiation
      
      // Wait a bit for cleanup
      await new Promise(resolve => setTimeout(resolve, 200));
      
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
        console.error("❌ Google OAuth error:", error);
        
        // Handle specific OAuth errors
        if (error.message.includes("Unsupported provider") || error.message.includes("provider is not enabled")) {
          setError("ورود با گوگل در حال حاضر غیرفعال است. لطفاً از ورود با ایمیل استفاده کنید.");
          toast.error("Google OAuth غیرفعال است. از ایمیل استفاده کنید.");
        } else if (error.message.includes("PKCE") || error.message.includes("code challenge") || error.message.includes("code verifier")) {
          setError("مشکل در PKCE flow. لطفاً مرورگر را refresh کنید و دوباره تلاش کنید.");
          toast.error("مشکل در PKCE flow - مرورگر را refresh کنید");
        } else if (error.message.includes("fetch") || error.message.includes("network")) {
          setError("خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.");
          toast.error("خطا در اتصال به سرور");
        } else {
          throw error;
        }
        return;
      }

      console.log("✅ Google OAuth initiated successfully with PKCE");
      console.log("OAuth data:", data);
      console.log("Redirecting to:", data.url);
      toast.success("در حال انتقال به گوگل...");
      
      // Now clear storage after successful OAuth initiation
      clearSupabaseStorage();
      
      // The redirect should happen automatically, but let's ensure it
      if (data.url) {
        // Use replace instead of href to avoid navigation issues
        window.location.replace(data.url);
      }
      
    } catch (error: any) {
      console.error("💥 Google sign in error:", error);
      
      if (error.message?.includes("Unsupported provider") || error.message?.includes("provider is not enabled")) {
        setError("ورود با گوگل در حال حاضر غیرفعال است. لطفاً از ورود با ایمیل استفاده کنید.");
        toast.error("Google OAuth غیرفعال است. از ایمیل استفاده کنید.");
      } else if (error.message?.includes("PKCE") || error.message?.includes("code challenge") || error.message?.includes("code verifier")) {
        setError("مشکل در PKCE flow. لطفاً مرورگر را refresh کنید و دوباره تلاش کنید.");
        toast.error("مشکل در PKCE flow - مرورگر را refresh کنید");
      } else if (error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("اتصال")) {
        setError("خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.");
        toast.error("خطا در اتصال به سرور");
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

    try {
      console.log("Attempting login for:", email);
      
      // Validate Supabase connection first
      try {
        const { error: healthCheck } = await supabase.auth.getSession();
        if (healthCheck) {
          console.error("❌ Supabase health check failed:", healthCheck);
          throw new Error("اتصال به سرور برقرار نیست. لطفاً اینترنت خود را بررسی کنید.");
        }
      } catch (healthError: any) {
        if (healthError.message?.includes("fetch")) {
          throw new Error("خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.");
        }
        throw healthError;
      }
      
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
          // For email confirmation errors, check if user was just registered
          const registrationMessage = searchParams?.get('message');
          if (registrationMessage === 'registration_success') {
            // User was just registered but email confirmation failed
            // Try to use Admin API to confirm email or suggest Google OAuth
            console.log("User registered but email not confirmed - suggesting alternatives");
            setError("ایمیل شما تایید نشده است");
            toast.error("لطفاً از Google OAuth استفاده کنید", {
              description: "ایمیل تایید ارسال نشد. برای ورود سریع، از دکمه 'ورود با گوگل' استفاده کنید.",
              duration: 10000,
              action: {
                label: "ورود با گوگل",
                onClick: () => handleGoogleSignIn()
              }
            });
          } else {
            setError("ایمیل شما تایید نشده است");
            toast.error("لطفاً ایمیل خود را تایید کنید یا از Google OAuth استفاده کنید", {
              description: "اگر ایمیل تایید را دریافت نکرده‌اید، می‌توانید از دکمه 'ورود با گوگل' استفاده کنید.",
              duration: 8000
            });
          }
        } else if (error.message.includes("fetch") || error.message.includes("network")) {
          setError("خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.");
        } else {
          setError(error.message || "خطا در ورود به سیستم");
        }
        return;
      }

      if (data.user) {
        console.log("Login successful:", data.user);
        console.log("User ID:", data.user.id);
        console.log("User email:", data.user.email);
        
        // Enhanced admin check with better debugging
        console.log("🔍 Starting admin access check...");
        
        // Check if user is admin first (admins table)
        console.log("🔍 Checking admins table...");
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("user_id, role, full_name, email")
          .eq("user_id", data.user.id)
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error("❌ Admin table check error:", adminError);
        }

        if (adminData) {
          console.log("✅ User found in admins table:", adminData);
          console.log("🎯 User is admin, redirecting to admin panel");
          console.log("🎯 About to call handleRedirect with /admin");
          
          // Force immediate redirect
          handleRedirect("/admin", "خوش آمدید ادمین!");
          
          // Additional fallback
          setTimeout(() => {
            console.log("🔄 Fallback redirect attempt...");
            if (window.location.pathname !== "/admin") {
              console.log("🔄 Force redirect to admin...");
              window.location.href = "/admin";
            }
          }, 1000);
          
          // Direct redirect without toast (for testing)
          setTimeout(() => {
            console.log("🔄 Direct redirect attempt...");
            router.push("/admin");
          }, 500);
          
          // Test redirect to dashboard first
          setTimeout(() => {
            console.log("🔄 Test redirect to dashboard...");
            router.push("/dashboard");
          }, 2000);
          
          // Test admin page accessibility
          setTimeout(async () => {
            console.log("🔄 Testing admin page accessibility...");
            try {
              const response = await fetch("/admin");
              console.log("🔄 Admin page response:", response.status, response.ok);
            } catch (error) {
              console.error("🔄 Admin page test failed:", error);
            }
          }, 2500);
          
          // Test direct admin access
          setTimeout(() => {
            console.log("🔄 Testing direct admin access...");
            // Try to access admin page directly
            const adminUrl = `${window.location.origin}/admin`;
            console.log("🔄 Admin URL:", adminUrl);
            window.open(adminUrl, '_blank');
          }, 3000);
          
          return;
        } else {
          console.log("ℹ️ User not found in admins table");
        }

        // Check if user has admin role in auth-users table
        console.log("🔍 Checking auth-users table...");
        const { data: authUserData, error: authUserError } = await supabase
          .from("auth-users")
          .select("id, role, is_admin, email, full_name")
          .eq("id", data.user.id)
          .single();

        if (authUserError && authUserError.code !== 'PGRST116') {
          console.error("❌ Auth-users table check error:", authUserError);
        }

        if (authUserData) {
          console.log("✅ User found in auth-users table:", authUserData);
          
          if (authUserData.role === 'admin' || authUserData.is_admin === true) {
            console.log("🎯 User is admin by role in auth-users table");
            handleRedirect("/admin", "خوش آمدید ادمین!");
            return;
          } else {
            console.log("ℹ️ User is not admin in auth-users table");
          }
        } else {
          console.log("ℹ️ User not found in auth-users table");
        }

        // Check if user has a profile in teachers table
        console.log("🔍 Checking teachers table...");
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("id, status")
          .eq("id", data.user.id)
          .single();

        if (teacherError && teacherError.code !== 'PGRST116') {
          console.error("❌ Teachers table check error:", teacherError);
        }

        if (teacherData) {
          console.log("✅ User found in teachers table:", teacherData);
          if (teacherData.status === 'active' || teacherData.status === 'Approved') {
            console.log("🎯 User is active/approved teacher, redirecting to teacher dashboard");
            handleRedirect("/dashboard/teacher", "خوش آمدید معلم!");
          } else {
            console.log("⚠️ User is inactive teacher");
            setError("حساب کاربری شما هنوز تایید نشده است. لطفاً منتظر تایید ادمین باشید.");
          }
          return;
        } else {
          console.log("ℹ️ User not found in teachers table");
        }

        // Check if user has a profile in students table
        console.log("🔍 Checking students table...");
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("id, status")
          .eq("id", data.user.id)
          .single();

        if (studentError && studentError.code !== 'PGRST116') {
          console.error("❌ Students table check error:", studentError);
        }

        if (studentData) {
          console.log("✅ User found in students table:", studentData);
          if (studentData.status === 'active') {
            console.log("🎯 User is active student, redirecting to dashboard");
            handleRedirect("/dashboard", "خوش آمدید دانشجو!");
          } else {
            console.log("⚠️ User is inactive student");
            setError("حساب کاربری دانشجو شما غیرفعال است.");
          }
          return;
        } else {
          console.log("ℹ️ User not found in students table");
        }

        // User exists in auth but no profile - redirect to complete profile based on userType
        console.log("ℹ️ User has no profile in any table, redirecting to complete profile");
        
        // Get userType from sessionStorage or default to student
        const userType = typeof window !== 'undefined' ? sessionStorage.getItem('userType') : null;
        const profileType = userType === 'teacher' ? 'teacher' : 'student';
        
        // Store userType in sessionStorage if not already stored
        if (userType && typeof window !== 'undefined') {
          sessionStorage.setItem('userType', userType);
        } else if (typeof window !== 'undefined') {
          // Default to student if no userType found
          sessionStorage.setItem('userType', 'student');
        }
        
        handleRedirect(`/complete-profile?type=${profileType}`, "لطفاً پروفایل خود را تکمیل کنید");
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      
      if (error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("اتصال")) {
        setError("خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.");
      } else {
        setError("خطای غیرمنتظره رخ داد");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <Card className="max-w-md w-full space-y-8 p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ورود به حساب کاربری
          </h1>
          <p className="text-gray-600">
            ایمیل و رمز عبور خود را وارد کنید
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
            {googleLoading ? "در حال انتقال..." : "ورود با گوگل"}
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2 space-x-reverse">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">خطا در ورود:</div>
              <div>{error}</div>
              
              {/* Error-specific solutions */}
              {error.includes("اتصال به سرور") && (
                <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                  <div className="font-semibold">🔧 راه‌حل:</div>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>اینترنت خود را بررسی کنید</li>
                    <li>مرورگر را refresh کنید</li>
                    <li>از VPN استفاده نکنید</li>
                    <li>DNS خود را تغییر دهید (8.8.8.8)</li>
                  </ul>
                </div>
              )}
              
              {error.includes("PKCE") && (
                <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                  <div className="font-semibold">🔧 راه‌حل:</div>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>مرورگر را کاملاً ببندید و باز کنید</li>
                    <li>Cache مرورگر را پاک کنید</li>
                    <li>از مرورگر دیگری استفاده کنید</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="pl-10 text-right"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                className="pl-10 text-right"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
          >
            {loading ? "در حال ورود..." : "ورود با ایمیل"}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              ثبت‌نام کنید
            </Link>
          </div>
          
          <div className="text-sm text-gray-600">
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



export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              در حال بارگذاری...
            </h2>
          </div>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
