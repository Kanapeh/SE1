"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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

      // Register user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
          is_admin: false,
          created_at: new Date().toISOString(),
        });

        if (userError) throw userError;

        toast.success("ثبت‌نام با موفقیت انجام شد. لطفا ایمیل خود را بررسی کنید.");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      setError(error.message || "خطا در ثبت‌نام");
      toast.error(error.message || "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            ثبت‌نام در سایت
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="نام و نام خانوادگی"
              required
              minLength={3}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-right"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="ایمیل"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-right"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="رمز عبور"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-right"
            />
            <p className="text-sm text-gray-500 mt-1">
              رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و اعداد باشد
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
