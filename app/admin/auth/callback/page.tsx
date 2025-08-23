"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AdminAuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 Admin OAuth callback processing...");

        // Exchange code for session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Admin OAuth session error:", error);
          throw error;
        }

        if (!session?.user) {
          console.error("❌ No admin user session found");
          throw new Error("جلسه کاربری یافت نشد");
        }

        console.log("✅ Admin user session found:", session.user.email);

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("user_id, role, is_active")
          .eq("user_id", session.user.id)
          .eq("is_active", true)
          .single();

        if (adminError) {
          console.error("❌ Admin check error:", adminError);
          
          // Also check auth-users table
          const { data: authUserData, error: authUserError } = await supabase
            .from("auth-users")
            .select("id, role, is_admin")
            .eq("id", session.user.id)
            .single();

          if (authUserError) {
            console.error("❌ Auth-users check error:", authUserError);
            throw new Error("خطا در بررسی دسترسی ادمین");
          }

          if (authUserData && (authUserData.role === 'admin' || authUserData.is_admin === true)) {
            console.log("✅ Admin access confirmed via auth-users:", authUserData);
            setStatus('success');
            setMessage('ورود موفقیت‌آمیز! در حال انتقال به پنل ادمین...');
            
            setTimeout(() => {
              router.push('/admin');
            }, 2000);
            return;
          } else {
            throw new Error("شما دسترسی ادمین ندارید");
          }
        }

        if (adminData) {
          console.log("✅ Admin access confirmed:", adminData);
          setStatus('success');
          setMessage('ورود موفقیت‌آمیز! در حال انتقال به پنل ادمین...');
          
          setTimeout(() => {
            router.push('/admin');
          }, 2000);
        } else {
          throw new Error("شما دسترسی ادمین ندارید");
        }

      } catch (error: any) {
        console.error("❌ Admin OAuth callback failed:", error);
        setStatus('error');
        setMessage(error.message || 'خطا در ورود ادمین');
        
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="mx-auto h-16 w-16 text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              در حال پردازش ورود ادمین...
            </h2>
            <p className="text-gray-600">
              لطفاً صبر کنید، در حال بررسی دسترسی شما هستیم
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ورود موفقیت‌آمیز!
            </h2>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                ✅ دسترسی ادمین تایید شد
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              خطا در ورود
            </h2>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                ❌ دسترسی ادمین تایید نشد
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              در حال بازگشت به صفحه ورود ادمین...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            احراز هویت ادمین
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            سیستم مدیریت سِ وان
          </p>
        </div>
      </div>
    </div>
  );
}
