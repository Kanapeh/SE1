"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function VerifyEmailContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // دریافت توکن از URL
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // تنظیم توکن‌ها در Supabase
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;

          // پاک کردن پارامترهای URL
          window.history.replaceState({}, document.title, window.location.pathname);

          // بررسی نقش کاربر
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;

          if (user) {
            const { data: userData, error: roleError } = await supabase
              .from('users')
              .select('is_admin')
              .eq('id', user.id)
              .single();

            if (roleError) throw roleError;

            // هدایت به داشبورد مناسب
            if (userData.is_admin) {
              router.push('/admin/requests');
            } else {
              router.push('/dashboard');
            }
          }
        } else {
          throw new Error("توکن‌های مورد نیاز یافت نشد");
        }
      } catch (error: any) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleEmailVerification();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6">در حال بررسی...</h1>
          <p className="mb-4">لطفاً صبر کنید...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6 text-red-600">خطا</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            بازگشت به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">تأیید ایمیل</h1>
        <p className="mb-4">
          در حال هدایت به داشبورد...
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6">در حال بارگذاری...</h1>
          <p className="mb-4">لطفاً صبر کنید...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
