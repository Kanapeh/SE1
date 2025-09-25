"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugLocalhostDatabase() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const debugDatabase = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Debugging localhost database connection...');
      
      // Test 1: Environment variables
      const envCheck = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        nodeEnv: process.env.NODE_ENV || 'undefined'
      };

      // Test 2: Check Supabase connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('blog_posts')
        .select('count')
        .limit(1);

      // Test 3: Get all blog posts
      const { data: allPosts, error: allPostsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Test 4: Check specific post
      const { data: specificPost, error: specificError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', '2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively');

      // Test 5: Check published posts
      const { data: publishedPosts, error: publishedError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published');

      // Test 6: Check database URL
      const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isLocalhost = dbUrl?.includes('localhost') || dbUrl?.includes('127.0.0.1');
      const isSupabase = dbUrl?.includes('supabase.co');

      setResult({
        timestamp: new Date().toISOString(),
        environment: envCheck,
        connection: {
          success: !connectionError,
          error: connectionError?.message || null
        },
        allPosts: {
          count: allPosts?.length || 0,
          posts: allPosts || [],
          error: allPostsError?.message || null
        },
        specificPost: {
          count: specificPost?.length || 0,
          posts: specificPost || [],
          error: specificError?.message || null
        },
        publishedPosts: {
          count: publishedPosts?.length || 0,
          posts: publishedPosts || [],
          error: publishedError?.message || null
        },
        databaseInfo: {
          url: dbUrl,
          isLocalhost,
          isSupabase,
          type: isLocalhost ? 'Local Database' : isSupabase ? 'Supabase Cloud' : 'Unknown'
        },
        recommendations: [
          !process.env.NEXT_PUBLIC_SUPABASE_URL ? '❌ NEXT_PUBLIC_SUPABASE_URL not set' : '✅ NEXT_PUBLIC_SUPABASE_URL is set',
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set' : '✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set',
          connectionError ? `❌ Database connection failed: ${connectionError.message}` : '✅ Database connection successful',
          allPosts?.length === 0 ? '❌ No posts found in database' : `✅ Found ${allPosts?.length} posts in database`,
          specificPost?.length === 0 ? '❌ Specific post not found' : '✅ Specific post found',
          publishedPosts?.length === 0 ? '❌ No published posts found' : `✅ Found ${publishedPosts?.length} published posts`,
          isLocalhost ? '⚠️ Using local database - posts won\'t appear in production' : '✅ Using Supabase cloud database',
          !isSupabase ? '❌ Not using Supabase - this is the problem!' : '✅ Using Supabase correctly'
        ]
      });

    } catch (err: any) {
      console.error('❌ Debug error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debugDatabase();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🔍 عیب‌یابی دیتابیس Localhost
        </h1>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
            ⚠️ مشکل احتمالی
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            اگر مقالات در localhost نمایش داده می‌شوند اما در production نه، احتمالاً:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
            <li>از دیتابیس محلی استفاده می‌کنید (SQLite, PostgreSQL محلی)</li>
            <li>Environment variables درست تنظیم نشده‌اند</li>
            <li>از Supabase استفاده نمی‌کنید</li>
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              ❌ خطا
            </h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Environment Check */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🔧 Environment Variables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                  <span className={result.environment?.supabaseUrl?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                    {result.environment?.supabaseUrl || 'نامشخص'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                  <span className={result.environment?.supabaseAnonKey?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                    {result.environment?.supabaseAnonKey || 'نامشخص'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium">NODE_ENV:</span>
                  <span className="text-blue-600">{result.environment?.nodeEnv || 'نامشخص'}</span>
                </div>
              </div>
            </div>

            {/* Database Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🗄️ اطلاعات دیتابیس</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">نوع دیتابیس:</h4>
                  <p className={`text-lg font-bold ${
                    result.databaseInfo?.isSupabase ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.databaseInfo?.type || 'نامشخص'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">آدرس دیتابیس:</h4>
                  <p className="text-sm font-mono break-all">{result.databaseInfo?.url || 'نامشخص'}</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">وضعیت اتصال:</h4>
                  <p className={`text-lg font-bold ${
                    result.connection?.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.connection?.success ? '✅ متصل' : '❌ قطع'}
                  </p>
                  {result.connection?.error && (
                    <p className="text-red-600 text-sm mt-2">{result.connection.error}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Count */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📊 آمار مقالات</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">کل مقالات:</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.allPosts?.count || 0}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">مقالات منتشر شده:</h4>
                  <p className="text-2xl font-bold text-green-600">{result.publishedPosts?.count || 0}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">مقاله خاص:</h4>
                  <p className="text-2xl font-bold text-purple-600">{result.specificPost?.count || 0}</p>
                </div>
              </div>
            </div>

            {/* Posts List */}
            {result.allPosts?.posts && result.allPosts.posts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">📝 لیست مقالات</h3>
                <div className="space-y-2">
                  {result.allPosts.posts.map((post: any, index: number) => (
                    <div key={post.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Slug: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{post.slug}</code>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Status: <span className={`px-2 py-1 rounded text-xs ${
                              post.status === 'published' ? 'bg-green-100 text-green-800' :
                              post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('fa-IR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">💡 توصیه‌ها</h3>
              <ul className="space-y-2">
                {result.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="ml-2">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            {result.databaseInfo?.isLocalhost && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
                  🚨 مشکل پیدا شد!
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  شما از دیتابیس محلی استفاده می‌کنید. برای حل این مشکل:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-red-700 dark:text-red-300">
                  <li>فایل <code>.env.local</code> ایجاد کنید</li>
                  <li>متغیرهای Supabase را اضافه کنید</li>
                  <li>سرور را restart کنید</li>
                  <li>مقالات را دوباره ایجاد کنید</li>
                </ol>
              </div>
            )}

            {/* Raw Data */}
            <details className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <summary className="text-lg font-semibold cursor-pointer">🔍 داده‌های خام</summary>
              <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
            📋 راهنمای حل مشکل
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700 dark:text-blue-300">
            <li>صفحه را refresh کنید تا نتایج جدید ببینید</li>
            <li>اگر از دیتابیس محلی استفاده می‌کنید، فایل .env.local ایجاد کنید</li>
            <li>متغیرهای Supabase را از Supabase Dashboard کپی کنید</li>
            <li>سرور را restart کنید</li>
            <li>مقالات را دوباره ایجاد کنید</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
