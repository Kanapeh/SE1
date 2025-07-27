"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL params or session storage
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = sessionStorage.getItem('userEmail');
    const emailToUse = emailFromParams || emailFromStorage || "";
    setEmail(emailToUse);
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("ایمیل یافت نشد");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("ایمیل تایید مجدداً ارسال شد");
      }
    } catch (error) {
      toast.error("خطا در ارسال ایمیل");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setVerifying(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        toast.error("خطا در بررسی وضعیت");
        return;
      }

      if (user?.email_confirmed_at) {
        toast.success("ایمیل شما تایید شده است!");
        router.push("/login");
      } else {
        toast.info("ایمیل هنوز تایید نشده است. لطفاً ایمیل خود را بررسی کنید");
      }
    } catch (error) {
      toast.error("خطا در بررسی وضعیت");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              تایید ایمیل
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              لطفاً ایمیل خود را تایید کنید
            </p>
          </div>

          {email && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                ایمیل ارسال شده به:
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {email}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3 space-x-reverse text-right">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white mb-1">مراحل تایید:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>ایمیل خود را بررسی کنید</li>
                  <li>روی لینک "تایید ایمیل" کلیک کنید</li>
                  <li>به صفحه ورود هدایت خواهید شد</li>
                </ol>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse text-right">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white mb-1">نکات مهم:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>ایمیل ممکن است در پوشه Spam باشد</li>
                  <li>لینک تایید فقط 24 ساعت معتبر است</li>
                  <li>در صورت عدم دریافت، دوباره درخواست کنید</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCheckVerification}
              disabled={verifying}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                "بررسی تایید ایمیل"
              )}
            </Button>

            <Button
              onClick={handleResendEmail}
              disabled={loading || !email}
              variant="outline"
              className="w-full"
            >
              {loading ? "در حال ارسال..." : "ارسال مجدد ایمیل"}
            </Button>

            <Button
              onClick={() => router.push("/login")}
              variant="ghost"
              className="w-full"
            >
              بازگشت به صفحه ورود
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
