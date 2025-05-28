"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ClipLoader } from "react-spinners";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("در حال تلاش برای ورود...");

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("خطا در احراز هویت:", authError);
        throw authError;
      }

      if (!authData.user) throw new Error("اطلاعات کاربر دریافت نشد");

      console.log("ورود موفق. بررسی نقش کاربر...");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", authData.user.id)
        .single();

      if (userError) {
        console.error("خطا در دریافت اطلاعات نقش:", userError);
        throw userError;
      }

      console.log("نقش کاربر:", userData?.is_admin ? "ادمین" : "کاربر معمولی");

      if (userData?.is_admin) {
        window.location.href = "/admin/requests";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (error: any) {
      setError(error.message || "خطا در ورود به سیستم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ورود به سیستم</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <ClipLoader color="#ffffff" size={20} className="ml-2" />
                در حال ورود...
              </>
            ) : (
              "ورود"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-primary hover:underline">
            حساب ندارید؟ ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
