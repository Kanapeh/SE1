"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import AdminSidebar from './AdminSidebar';

interface AdminAccessGuardProps {
  children: React.ReactNode;
}

export default function AdminAccessGuard({ children }: AdminAccessGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Timer to track loading time and provide feedback
  useEffect(() => {
    if (!isClient || !isLoading) return;

    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, isLoading]);

  // Admin access check effect - must come after all useState calls
  useEffect(() => {
    // Only run admin check after client is ready
    if (!isClient) return;

    const checkAdminAccess = async () => {
      try {
        console.log("🔐 Checking admin access in AdminAccessGuard...");
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000);
        });

        // Get current user with timeout
        const userPromise = supabase.auth.getUser();
        const { data: { user }, error: authError } = await Promise.race([userPromise, timeoutPromise]) as any;
        
        if (authError || !user) {
          console.log("❌ No user found, redirecting to admin login");
          setError("کاربر یافت نشد");
          setTimeout(() => {
            router.push('/admin/login');
          }, 1000);
          return;
        }

        console.log("✅ User found:", user.email);

        // Run both admin checks in parallel for faster response
        const [adminResult, authUserResult] = await Promise.allSettled([
          supabase
            .from('admins')
            .select('user_id, is_active')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single(),
          supabase
            .from('auth-users')
            .select('id, role, is_admin')
            .eq('id', user.id)
            .single()
        ]);

        // Check admins table result
        if (adminResult.status === 'fulfilled' && adminResult.value.data) {
          console.log("✅ Admin access confirmed via admins table");
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        // Check auth-users table result
        if (authUserResult.status === 'fulfilled' && authUserResult.value.data) {
          const authUserData = authUserResult.value.data;
          if (authUserData.role === 'admin' || authUserData.is_admin === true) {
            console.log("✅ Admin access confirmed via auth-users table");
            setHasAccess(true);
            setIsLoading(false);
            return;
          }
        }

        // Log errors if any
        if (adminResult.status === 'rejected') {
          console.log("❌ Admin table error:", adminResult.reason);
        }
        if (authUserResult.status === 'rejected') {
          console.log("❌ Auth-users table error:", authUserResult.reason);
        }

        console.log("❌ User is not admin, redirecting to admin login");
        setError("شما دسترسی ادمین ندارید");
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);

      } catch (error) {
        console.error('❌ Error checking admin access:', error);
        if (error instanceof Error && error.message.includes('Timeout')) {
          setError("زمان بررسی دسترسی تمام شد");
        } else {
          setError("خطا در بررسی دسترسی");
        }
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    };

    checkAdminAccess();
  }, [router, isClient]);

  // Handle loading state (including initial client hydration)
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {!isClient ? "در حال بارگذاری..." : "در حال بررسی دسترسی..."}
          </h2>
          <p className="text-muted-foreground mb-4">
            {!isClient ? "لطفاً صبر کنید..." : "لطفاً صبر کنید، در حال بررسی دسترسی ادمین شما هستیم"}
          </p>
          
          {isClient && isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm mb-2">
                زمان بررسی: {loadingTime} ثانیه
              </p>
              {loadingTime > 5 && (
                <p className="text-blue-600 text-xs">
                  در حال اتصال به پایگاه داده...
                </p>
              )}
              {loadingTime > 8 && (
                <button
                  onClick={() => router.push('/admin/login')}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  بازگشت به صفحه ورود
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            خطا در دسترسی
          </h2>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              در حال انتقال به صفحه ورود ادمین...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            دسترسی محدود
          </h2>
          <p className="text-muted-foreground mb-4">
            شما دسترسی ادمین ندارید
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              در حال انتقال به صفحه ورود ادمین...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user has admin access, show admin layout with sidebar
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="mr-64 p-6 min-h-screen">
        <div className="max-w-full overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
