"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function TestSupabaseConnection() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('🔍 Testing Supabase connection...');
      
      // Test 1: Basic connection
      console.log('🔍 Test 1: Basic connection test');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('blog_posts')
        .select('count')
        .limit(1);

      console.log('🔍 Connection test result:', { connectionTest, connectionError });

      // Test 2: Get all blog posts
      console.log('🔍 Test 2: Getting all blog posts');
      const { data: allPosts, error: allPostsError } = await supabase
        .from('blog_posts')
        .select('*')
        .limit(10);

      console.log('🔍 All posts result:', { allPosts, allPostsError });

      // Test 3: Check specific table structure
      console.log('🔍 Test 3: Checking table structure');
      const { data: structureTest, error: structureError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, status, created_at')
        .limit(1);

      console.log('🔍 Structure test result:', { structureTest, structureError });

      // Test 4: Environment variables
      console.log('🔍 Test 4: Environment variables');
      console.log('🔍 NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('🔍 NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

      setResults({
        connectionTest: { data: connectionTest, error: connectionError },
        allPosts: { data: allPosts, error: allPostsError },
        structureTest: { data: structureTest, error: structureError },
        envVars: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
        }
      });

    } catch (err: any) {
      console.error('❌ Test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">تست اتصال Supabase</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>تست اتصال</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testConnection} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  در حال تست...
                </>
              ) : (
                'شروع تست'
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="space-y-6">
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle>متغیرهای محیطی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                    <span className={results.envVars.url ? 'text-green-600' : 'text-red-600'}>
                      {results.envVars.url ? '✅ تنظیم شده' : '❌ تنظیم نشده'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                    <span className={results.envVars.anonKey === 'Set' ? 'text-green-600' : 'text-red-600'}>
                      {results.envVars.anonKey === 'Set' ? '✅ تنظیم شده' : '❌ تنظیم نشده'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connection Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {results.connectionTest.error ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  تست اتصال پایه
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.connectionTest.error ? (
                  <div className="text-red-600">
                    <p>خطا: {results.connectionTest.error.message}</p>
                    <p>کد خطا: {results.connectionTest.error.code}</p>
                    <p>جزئیات: {results.connectionTest.error.details}</p>
                  </div>
                ) : (
                  <div className="text-green-600">
                    ✅ اتصال موفق
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Posts Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {results.allPosts.error ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  تست دریافت مقالات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.allPosts.error ? (
                  <div className="text-red-600">
                    <p>خطا: {results.allPosts.error.message}</p>
                    <p>کد خطا: {results.allPosts.error.code}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-green-600 mb-2">
                      ✅ {results.allPosts.data?.length || 0} مقاله یافت شد
                    </p>
                    {results.allPosts.data && results.allPosts.data.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">مقالات یافت شده:</h4>
                        <div className="space-y-2">
                          {results.allPosts.data.map((post: any, index: number) => (
                            <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-gray-600">Slug: {post.slug}</p>
                              <p className="text-sm text-gray-600">وضعیت: {post.status}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Structure Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {results.structureTest.error ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  تست ساختار جدول
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.structureTest.error ? (
                  <div className="text-red-600">
                    <p>خطا: {results.structureTest.error.message}</p>
                  </div>
                ) : (
                  <div className="text-green-600">
                    ✅ ساختار جدول صحیح است
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">نکات مهم:</h3>
          <ul className="text-sm space-y-1">
            <li>• Console را باز کنید (F12) تا پیام‌های debug را ببینید</li>
            <li>• اگر متغیرهای محیطی تنظیم نشده باشند، مشکل از .env.local است</li>
            <li>• اگر اتصال کار نمی‌کند، مشکل از Supabase configuration است</li>
            <li>• اگر مقالات یافت نمی‌شوند، جدول blog_posts خالی است</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
