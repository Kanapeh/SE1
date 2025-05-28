"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
          is_admin: false,
        });

        if (userError) throw userError;

        await new Promise((res) => setTimeout(res, 300)); // مکث کوتاه
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      setError(error.message || "خطا در ثبت‌نام");
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="ایمیل"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="رمز عبور"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
