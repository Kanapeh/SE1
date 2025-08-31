"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestSupabasePage() {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  useEffect(() => {
    // Check environment variables
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    };

    setConfigStatus(config);
    setSupabaseClient(supabase);

    // Log for debugging
    console.log("Environment Variables Check:", {
      url: config.url,
      anonKey: config.anonKey?.substring(0, 20) + "...",
      urlSet: config.urlSet,
      anonKeySet: config.anonKeySet,
      urlLength: config.urlLength,
      anonKeyLength: config.anonKeyLength,
    });

    console.log("Supabase Client:", supabase);
  }, []);

  const testSupabaseConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log("Testing Supabase connection...");
      
      // Test 1: Check if supabase client is initialized
      console.log("Supabase client:", supabase);
      
      // Test 2: Try to get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log("Session test:", { sessionData, sessionError });
      
      // Test 3: Try to get user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log("User test:", { userData, userError });
      
      // Test 4: Test basic query
      const { data: testData, error: testError } = await supabase
        .from('auth-users')
        .select('count')
        .limit(1);
      console.log("Query test:", { testData, testError });

      setTestResult({
        session: { data: sessionData, error: sessionError },
        user: { data: userData, error: userError },
        query: { data: testData, error: testError },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("Test error:", error);
      setTestResult({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log("Testing sign up...");
      
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = "TestPassword123";
      
      console.log("Test email:", testEmail);
      console.log("Supabase config check:", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"
      });
      
      // Get the proper site URL from environment or fallback to current origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            full_name: "Test User",
            user_type: "student",
          }
        }
      });

      console.log("Sign up result:", { data, error });

      setTestResult({
        signUp: { data, error },
        testEmail,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("Sign up test error:", error);
      setTestResult({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log("Testing direct connection...");
      
      // Test direct fetch to Supabase
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        throw new Error("Missing environment variables");
      }

      const response = await fetch(`${url}/rest/v1/auth-users?select=count&limit=1`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log("Direct fetch result:", { response: response.status, data });

      setTestResult({
        directFetch: { status: response.status, data },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("Direct connection test error:", error);
      setTestResult({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-6">تست تنظیمات Supabase</h1>
          
          {/* Environment Variables Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">وضعیت Environment Variables:</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${configStatus?.urlSet ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>NEXT_PUBLIC_SUPABASE_URL: {configStatus?.urlSet ? '✅ تنظیم شده' : '❌ تنظیم نشده'}</span>
                {configStatus?.urlSet && (
                  <span className="text-sm text-gray-500">({configStatus.urlLength} کاراکتر)</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${configStatus?.anonKeySet ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {configStatus?.anonKeySet ? '✅ تنظیم شده' : '❌ تنظیم نشده'}</span>
                {configStatus?.anonKeySet && (
                  <span className="text-sm text-gray-500">({configStatus.anonKeyLength} کاراکتر)</span>
                )}
              </div>
              {configStatus?.url && (
                <div className="text-sm text-gray-600 mt-2">
                  URL: {configStatus.url.substring(0, 30)}...
                </div>
              )}
              {configStatus?.anonKey && (
                <div className="text-sm text-gray-600">
                  Key: {configStatus.anonKey.substring(0, 20)}...
                </div>
              )}
            </div>
          </div>

          {/* Supabase Client Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">وضعیت Supabase Client:</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${supabaseClient ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Supabase Client: {supabaseClient ? '✅ ایجاد شده' : '❌ ایجاد نشده'}</span>
              </div>
              {supabaseClient && (
                <div className="text-sm text-gray-600 mt-2">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify({
                      auth: !!supabaseClient.auth,
                      from: !!supabaseClient.from,
                      storage: !!supabaseClient.storage
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={testSupabaseConnection}
              disabled={loading}
              className="w-full"
            >
              {loading ? "در حال تست..." : "تست اتصال Supabase"}
            </Button>
            
            <Button 
              onClick={testDirectConnection}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? "در حال تست..." : "تست اتصال مستقیم"}
            </Button>
            
            <Button 
              onClick={testSignUp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "در حال تست..." : "تست ثبت‌نام"}
            </Button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">نتایج تست:</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Troubleshooting Guide */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">راهنمای عیب‌یابی:</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>1. اگر Environment Variables تنظیم نشده:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>فایل .env.local ایجاد کنید</li>
                <li>NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY را اضافه کنید</li>
                <li>سرور را restart کنید</li>
                <li>Cache مرورگر را پاک کنید</li>
              </ul>
              
              <p className="mt-4">2. اگر اتصال کار نمی‌کند:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Supabase Dashboard را بررسی کنید</li>
                <li>URL و Key را چک کنید</li>
                <li>تنظیمات Authentication را بررسی کنید</li>
                <li>Network tab را بررسی کنید</li>
              </ul>
              
              <p className="mt-4">3. اگر ثبت‌نام کار نمی‌کند:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Email Provider را فعال کنید</li>
                <li>Site URL را تنظیم کنید</li>
                <li>Redirect URLs را اضافه کنید</li>
                <li>Rate limiting را بررسی کنید</li>
              </ul>
            </div>
          </div>

          {/* Console Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">دستورات Console:</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>برای بررسی بیشتر، این دستورات را در Console مرورگر (F12) اجرا کنید:</p>
              <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                <div>console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);</div>
                <div>console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');</div>
                <div>console.log('Supabase:', supabase);</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}