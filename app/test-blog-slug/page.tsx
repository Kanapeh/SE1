"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function TestBlogSlug() {
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testSlug = async () => {
    if (!slug.trim()) {
      setError('لطفاً slug را وارد کنید');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Testing slug:', slug);
      
      // Test 1: Check if any posts exist at all
      console.log('🔍 Test 1: Checking if any posts exist');
      const { data: anyPosts, error: anyError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, status')
        .limit(5);

      console.log('🔍 Any posts result:', { anyPosts, anyError });

      // Test 2: Check posts with this specific slug
      console.log('🔍 Test 2: Checking posts with slug:', slug);
      const { data: slugPosts, error: slugError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug);

      console.log('🔍 Slug posts result:', { slugPosts, slugError });

      // Test 3: Check published posts with this slug
      console.log('🔍 Test 3: Checking published posts with slug:', slug);
      const { data: publishedPosts, error: publishedError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published');

      console.log('🔍 Published posts result:', { publishedPosts, publishedError });

      // Test 4: Try different status values
      console.log('🔍 Test 4: Checking different status values');
      const { data: allStatusPosts, error: allStatusError } = await supabase
        .from('blog_posts')
        .select('slug, status')
        .eq('slug', slug);

      console.log('🔍 All status posts result:', { allStatusPosts, allStatusError });

      setResult({
        anyPosts: { data: anyPosts, error: anyError },
        slugPosts: { data: slugPosts, error: slugError },
        publishedPosts: { data: publishedPosts, error: publishedError },
        allStatusPosts: { data: allStatusPosts, error: allStatusError }
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
        <h1 className="text-3xl font-bold mb-8">تست Slug مقاله</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>تست Slug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="slug مقاله را وارد کنید..."
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && testSlug()}
              />
              <Button onClick={testSlug} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'در حال تست...' : 'تست'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-6">
            {/* Any Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {result.anyPosts.error ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  تست 1: آیا اصلاً مقاله‌ای وجود دارد؟
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.anyPosts.error ? (
                  <div className="text-red-600">
                    <p>خطا: {result.anyPosts.error.message}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-green-600 mb-2">
                      ✅ {result.anyPosts.data?.length || 0} مقاله در دیتابیس وجود دارد
                    </p>
                    {result.anyPosts.data && result.anyPosts.data.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">نمونه مقالات:</h4>
                        <div className="space-y-2">
                          {result.anyPosts.data.map((post: any, index: number) => (
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

            {/* Slug Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {result.slugPosts.error ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  تست 2: مقالات با slug "{slug}"
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.slugPosts.error ? (
                  <div className="text-red-600">
                    <p>خطا: {result.slugPosts.error.message}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-green-600 mb-2">
                      ✅ {result.slugPosts.data?.length || 0} مقاله با این slug یافت شد
                    </p>
                    {result.slugPosts.data && result.slugPosts.data.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">مقالات یافت شده:</h4>
                        <div className="space-y-2">
                          {result.slugPosts.data.map((post: any, index: number) => (
                            <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-gray-600">وضعیت: {post.status}</p>
                              <p className="text-sm text-gray-600">ایجاد شده: {new Date(post.created_at).toLocaleString('fa-IR')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Published Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {result.publishedPosts.error ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  تست 3: مقالات منتشر شده با slug "{slug}"
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.publishedPosts.error ? (
                  <div className="text-red-600">
                    <p>خطا: {result.publishedPosts.error.message}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-green-600 mb-2">
                      ✅ {result.publishedPosts.data?.length || 0} مقاله منتشر شده با این slug یافت شد
                    </p>
                    {result.publishedPosts.data && result.publishedPosts.data.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">مقالات منتشر شده:</h4>
                        <div className="space-y-2">
                          {result.publishedPosts.data.map((post: any, index: number) => (
                            <div key={post.id} className="p-3 bg-green-50 rounded-lg">
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-gray-600">وضعیت: {post.status}</p>
                              <p className="text-sm text-gray-600">منتشر شده: {post.published_at ? new Date(post.published_at).toLocaleString('fa-IR') : 'نامشخص'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Status Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {result.allStatusPosts.error ? (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  تست 4: تمام وضعیت‌های موجود برای slug "{slug}"
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.allStatusPosts.error ? (
                  <div className="text-red-600">
                    <p>خطا: {result.allStatusPosts.error.message}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-green-600 mb-2">
                      ✅ {result.allStatusPosts.data?.length || 0} رکورد با این slug یافت شد
                    </p>
                    {result.allStatusPosts.data && result.allStatusPosts.data.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">وضعیت‌های موجود:</h4>
                        <div className="space-y-2">
                          {result.allStatusPosts.data.map((post: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
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
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">راهنمای تشخیص مشکل:</h3>
          <ul className="text-sm space-y-1">
            <li>• اگر تست 1 شکست بخورد: مشکل از اتصال Supabase است</li>
            <li>• اگر تست 2 شکست بخورد: slug اشتباه است یا مقاله وجود ندارد</li>
            <li>• اگر تست 3 شکست بخورد: مقاله منتشر نشده است</li>
            <li>• اگر تست 4 شکست بخورد: مشکل از query است</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
