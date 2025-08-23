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
  const router = useRouter();
  const pathname = usePathname();

  // If we're on the login page, don't check admin access
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        console.log("🔐 Checking admin access in AdminAccessGuard...");
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.log("❌ No user found, redirecting to admin login");
          setError("کاربر یافت نشد");
          setTimeout(() => {
            router.push('/admin/login');
          }, 1000);
          return;
        }

        console.log("✅ User found:", user.email);

        // Check if user exists in admins table
        const { data: adminProfile, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (adminError) {
          console.log("❌ Admin table error:", adminError.message);
        }

        if (adminProfile) {
          console.log("✅ Admin access confirmed via admins table");
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        // Also check auth-users table
        const { data: authUserData, error: authUserError } = await supabase
          .from('auth-users')
          .select('id, role, is_admin')
          .eq('id', user.id)
          .single();

        if (authUserError) {
          console.log("❌ Auth-users check error:", authUserError.message);
        }

        if (authUserData && (authUserData.role === 'admin' || authUserData.is_admin === true)) {
          console.log("✅ Admin access confirmed via auth-users table");
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        console.log("❌ User is not admin, redirecting to admin login");
        setError("شما دسترسی ادمین ندارید");
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);

      } catch (error) {
        console.error('❌ Error checking admin access:', error);
        setError("خطا در بررسی دسترسی");
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            در حال بررسی دسترسی...
          </h2>
          <p className="text-muted-foreground">
            لطفاً صبر کنید، در حال بررسی دسترسی ادمین شما هستیم
          </p>
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
      <main className="lg:mr-64 p-6">
        {children}
      </main>
    </div>
  );
}
