"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting to send password reset email to:", email);
      
      // Get the proper site URL from environment or fallback to current origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        console.error("Password reset error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error
        });
        
        // Handle specific error cases
        if (error.message.includes("Email rate limit exceeded")) {
          setError("تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید.");
        } else if (error.message.includes("User not found")) {
          setError("کاربری با این ایمیل یافت نشد. لطفاً ایمیل خود را بررسی کنید.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("ایمیل شما تایید نشده است. لطفاً ابتدا ایمیل خود را تایید کنید.");
        } else if (error.message.includes("Invalid email")) {
          setError("ایمیل وارد شده معتبر نیست.");
        } else if (error.message.includes("Email provider not enabled")) {
          setError("ارسال ایمیل در حال حاضر غیرفعال است. لطفاً با پشتیبانی تماس بگیرید.");
        } else {
          setError(`خطا در ارسال ایمیل: ${error.message}`);
        }
        return;
      }

      console.log("Password reset email sent successfully");
      setSuccess(true);
      toast.success("ایمیل بازیابی رمز عبور ارسال شد");
    } catch (error: any) {
      console.error("Unexpected error during password reset:", error);
      setError("خطای غیرمنتظره رخ داد. لطفاً دوباره امتحان کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <Card className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ایمیل ارسال شد
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              لینک بازیابی رمز عبور به ایمیل شما ارسال شد. لطفاً ایمیل خود را بررسی کنید.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                بازگشت به صفحه ورود
              </Button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ایمیل دریافت نکردید؟{" "}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  دوباره امتحان کنید
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            بازیابی رمز عبور
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            رمز عبور خود را به یاد دارید؟{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              ورود کنید
            </Link>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              ثبت‌نام کنید
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}