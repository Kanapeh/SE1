"use client";

import { useState } from 'react';

export default function DebugBlogProduction() {
  const [slug, setSlug] = useState('2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const debugSlug = async () => {
    if (!slug.trim()) {
      setError('لطفاً slug را وارد کنید');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Debugging slug:', slug);
      
      const response = await fetch(`/api/debug-blog-post?slug=${encodeURIComponent(slug)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'خطا در درخواست');
      }
      
      setResult(data);
    } catch (err: any) {
      console.error('❌ Debug error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testProductionUrl = () => {
    const productionUrl = `https://www.se1a.org/blog/${slug}`;
    window.open(productionUrl, '_blank');
  };

  const testLocalhostUrl = () => {
    const localhostUrl = `http://localhost:3000/blog/${slug}`;
    window.open(localhostUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🔍 عیب‌یابی مشکل نمایش مقاله در Production
        </h1>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">تنظیمات تست</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug مقاله:
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={debugSlug}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال بررسی...' : 'بررسی Slug'}
              </button>
              
              <button
                onClick={testLocalhostUrl}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                تست Localhost
              </button>
              
              <button
                onClick={testProductionUrl}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                تست Production
              </button>
            </div>
          </div>
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
              <h3 className="text-lg font-semibold mb-4">🔧 بررسی Environment Variables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                  <span className={result.environment?.supabaseUrl?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                    {result.environment?.supabaseUrl || 'نامشخص'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium">SUPABASE_SERVICE_ROLE_KEY:</span>
                  <span className={result.environment?.supabaseServiceKey?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                    {result.environment?.supabaseServiceKey || 'نامشخص'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium">NODE_ENV:</span>
                  <span className="text-blue-600">{result.environment?.nodeEnv || 'نامشخص'}</span>
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🗄️ وضعیت دیتابیس</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">کل مقالات در دیتابیس:</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.allPosts?.count || 0}</p>
                  {result.allPosts?.error && (
                    <p className="text-red-600 text-sm mt-2">خطا: {result.allPosts.error}</p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">مقالات با Slug مشخص:</h4>
                  <p className="text-2xl font-bold text-green-600">{result.specificSlug?.count || 0}</p>
                  {result.specificSlug?.error && (
                    <p className="text-red-600 text-sm mt-2">خطا: {result.specificSlug.error}</p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">مقالات منتشر شده با Slug مشخص:</h4>
                  <p className="text-2xl font-bold text-purple-600">{result.publishedSlug?.count || 0}</p>
                  {result.publishedSlug?.error && (
                    <p className="text-red-600 text-sm mt-2">خطا: {result.publishedSlug.error}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Posts List */}
            {result.allPosts?.posts && result.allPosts.posts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">📝 لیست مقالات موجود</h3>
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
            📋 راهنمای عیب‌یابی
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700 dark:text-blue-300">
            <li>ابتدا slug مقاله را وارد کنید</li>
            <li>روی "بررسی Slug" کلیک کنید</li>
            <li>نتایج را بررسی کنید</li>
            <li>اگر مقاله در دیتابیس نیست، آن را در پنل ادمین ایجاد کنید</li>
            <li>اگر مقاله draft است، آن را منتشر کنید</li>
            <li>Environment variables را بررسی کنید</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
