"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TestSimpleOAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testOAuth = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      console.log('🚀 Testing OAuth with PKCE...');
      console.log('Current origin:', window.location.origin);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      // Get the proper site URL from environment or fallback to current origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      // Clear any existing auth state
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ OAuth error:', error);
        setError(`خطا: ${error.message}`);
        setResult('ناموفق');
      } else {
        console.log('✅ OAuth initiated with PKCE:', data);
        setResult('OAuth شروع شد - در حال انتقال به گوگل...');
        setError('');
      }
    } catch (err: any) {
      console.error('💥 Unexpected error:', err);
      setError(`خطای غیرمنتظره: ${err.message}`);
      setResult('ناموفق');
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setResult(`Session موجود: ${session.user.email}`);
      } else {
        setResult('Session موجود نیست');
      }
    } catch (err: any) {
      setError(`خطا در بررسی session: ${err.message}`);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setResult('خروج موفقیت‌آمیز');
      setError('');
    } catch (err: any) {
      setError(`خطا در خروج: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            تست ساده OAuth
          </h1>
          <p className="text-gray-600">
            این صفحه برای تست اولیه OAuth ایجاد شده است
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Button 
              onClick={testOAuth}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "در حال تست..." : "تست ورود با گوگل"}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={checkSession}
                variant="outline"
                size="sm"
              >
                بررسی Session
              </Button>
              
              <Button 
                onClick={signOut}
                variant="destructive"
                size="sm"
              >
                خروج
              </Button>
            </div>
          </div>
        </Card>

        {result && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-green-800">
              <div className="font-medium">نتیجه:</div>
              <div>{result}</div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-red-800">
              <div className="font-medium">خطا:</div>
              <div>{error}</div>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-blue-800 text-sm">
            <div className="font-medium mb-2">اطلاعات محیط:</div>
            <div className="space-y-1">
              <div>Origin: {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</div>
              <div>Callback: {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'SSR'}</div>
              <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'تعریف نشده'}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="text-yellow-800 text-sm">
            <div className="font-medium mb-2">راهنمای عیب‌یابی:</div>
            <div className="space-y-1">
              <p>1. دکمه "تست ورود با گوگل" را بزنید</p>
              <p>2. اگر به گوگل منتقل شد، مشکل در callback است</p>
              <p>3. اگر خطا داد، مشکل در تنظیمات است</p>
              <p>4. Console مرورگر را چک کنید</p>
              <p>5. پس از callback، به صفحه لاگین بروید تا خطا را ببینید</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
