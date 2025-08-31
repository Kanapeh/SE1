"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TestOAuthPage() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleOAuth = async () => {
    setTestResult('در حال تست...');
    
    try {
      console.log('Testing Google OAuth...');
      console.log('Current origin:', window.location.origin);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      // Get the proper site URL from environment or fallback to current origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        setTestResult(`خطا: ${error.message}`);
        console.error('OAuth error:', error);
      } else {
        setTestResult('OAuth initiated successfully');
        console.log('OAuth data:', data);
      }
    } catch (error: any) {
      setTestResult(`خطای غیرمنتظره: ${error.message}`);
      console.error('Unexpected error:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setTestResult('خروج موفقیت‌آمیز');
    } catch (error: any) {
      setTestResult(`خطا در خروج: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            تست OAuth و احراز هویت
          </h1>
          <p className="text-gray-600">
            این صفحه برای تست و دیباگ OAuth ایجاد شده است
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">اطلاعات Session</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">وضعیت:</span>
                <Badge variant={session ? "default" : "secondary"} className="mr-2">
                  {session ? 'متصل' : 'غیرمتصل'}
                </Badge>
              </div>
              
              {session && (
                <>
                  <div>
                    <span className="font-medium">User ID:</span>
                    <span className="text-sm text-gray-600 mr-2">{session.user.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="text-sm text-gray-600 mr-2">{session.user.email}</span>
                  </div>
                  <div>
                    <span className="font-medium">Provider:</span>
                    <span className="text-sm text-gray-600 mr-2">{session.user.app_metadata?.provider || 'email'}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* OAuth Test */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">تست OAuth</h2>
            <div className="space-y-4">
              <Button 
                onClick={testGoogleOAuth}
                className="w-full"
                variant="outline"
              >
                تست ورود با گوگل
              </Button>
              
              {session && (
                <Button 
                  onClick={signOut}
                  className="w-full"
                  variant="destructive"
                >
                  خروج
                </Button>
              )}
              
              <div className="text-sm">
                <span className="font-medium">نتیجه تست:</span>
                <div className="mt-2 p-3 bg-gray-100 rounded text-gray-700">
                  {testResult || 'هنوز تستی انجام نشده'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Environment Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">اطلاعات محیط</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Supabase URL:</span>
              <div className="text-gray-600 mt-1 break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'تعریف نشده'}
              </div>
            </div>
            <div>
              <span className="font-medium">Current Origin:</span>
              <div className="text-gray-600 mt-1">
                {typeof window !== 'undefined' ? window.location.origin : 'SSR'}
              </div>
            </div>
            <div>
              <span className="font-medium">Callback URL:</span>
              <div className="text-gray-600 mt-1">
                {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'SSR'}
              </div>
            </div>
            <div>
              <span className="font-medium">Node Environment:</span>
              <div className="text-gray-600 mt-1">
                {process.env.NODE_ENV}
              </div>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">راهنمای عیب‌یابی</h2>
          <div className="text-blue-700 space-y-2 text-sm">
            <p>1. ابتدا دکمه "تست ورود با گوگل" را بزنید</p>
            <p>2. اگر به گوگل منتقل شد، مشکل در callback است</p>
            <p>3. اگر خطا داد، مشکل در تنظیمات Supabase است</p>
            <p>4. Console مرورگر را چک کنید تا خطاها را ببینید</p>
            <p>5. در Supabase Dashboard، Authentication {'>>'} Providers {'>>'} Google را چک کنید</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
