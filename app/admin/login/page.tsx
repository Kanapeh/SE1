"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🔐 Admin login attempt for:", email);

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("❌ Admin login error:", signInError);
        setError("ایمیل یا رمز عبور اشتباه است");
        return;
      }

      if (data.user) {
        console.log("✅ Admin user authenticated:", data.user.email);
        
        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("user_id, role, is_active")
          .eq("user_id", data.user.id)
          .eq("is_active", true)
          .single();

        if (adminError) {
          console.error("❌ Admin check error:", adminError);
        }

        if (adminData) {
          console.log("✅ Admin access confirmed:", adminData);
          setSuccess("ورود موفقیت‌آمیز! در حال انتقال به پنل ادمین...");
          setTimeout(() => {
            router.push("/admin");
          }, 2000);
          return;
        }

        // Also check auth-users table
        const { data: authUserData, error: authUserError } = await supabase
          .from("auth-users")
          .select("id, role, is_admin")
          .eq("id", data.user.id)
          .single();

        if (authUserError) {
          console.error("❌ Auth-users check error:", authUserError);
        }

        if (authUserData && (authUserData.role === 'admin' || authUserData.is_admin === true)) {
          console.log("✅ Admin access confirmed via auth-users:", authUserData);
          setSuccess("ورود موفقیت‌آمیز! در حال انتقال به پنل ادمین...");
          setTimeout(() => {
            router.push("/admin");
          }, 2000);
          return;
        }

        console.log("❌ User is not admin");
        setError("شما دسترسی ادمین ندارید");
      }
    } catch (error: any) {
      console.error("❌ Admin login failed:", error);
      setError("خطا در ورود: " + (error.message || "خطای نامشخص"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      console.log("🔐 Admin Google OAuth attempt...");
      
      // Get the proper site URL from environment or fallback to current origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/admin/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error("❌ Admin Google OAuth error:", error);
        setError("خطا در ورود با گوگل");
        return;
      }

      console.log("✅ Admin Google OAuth initiated");
      setSuccess("در حال انتقال به گوگل...");
      
    } catch (error: any) {
      console.error("❌ Admin Google sign in failed:", error);
      setError("خطا در ورود با گوگل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ورود ادمین
          </h2>
          <p className="text-gray-300">
            برای دسترسی به پنل مدیریت وارد شوید
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
            {error}
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="p-4 rounded-lg border border-green-200 bg-green-50 text-green-800">
            {success}
          </div>
        )}

        {/* Login Form */}
        <Card className="p-8 bg-white/10 backdrop-blur-lg border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                ایمین ادمین
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                رمز عبور
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                  className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              {loading ? "در حال ورود..." : "ورود به پنل ادمین"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-300">یا</span>
            </div>
          </div>

          {/* Google OAuth */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full h-12 bg-white/20 hover:bg-white/30 border-white/30 text-white font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            ورود با گوگل
          </Button>

          {/* Back to main site */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              بازگشت به سایت اصلی
            </Link>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-400">
          <p>⚠️ این صفحه فقط برای ادمین‌های مجاز است</p>
          <p>دسترسی غیرمجاز پیگرد قانونی دارد</p>
        </div>
      </div>
    </div>
  );
}
