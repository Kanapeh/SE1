"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  published_at: string;
  author: string;
}

interface CheckResult {
  slug: string;
  totalPosts: number;
  publishedPosts: number;
  statuses: string[];
  allPosts: BlogPost[];
  publishedPosts: BlogPost[];
  latestPost: BlogPost | null;
  latestPublishedPost: BlogPost | null;
}

export default function DebugBlogPostPage() {
  const [slug, setSlug] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPost = async () => {
    if (!slug.trim()) {
      setError('لطفاً slug را وارد کنید');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/blog/check-post?slug=${encodeURIComponent(slug)}`);
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'خطا در بررسی مقاله');
      }
    } catch (err) {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">بررسی مقاله بر اساس Slug</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>جستجوی مقاله</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="slug مقاله را وارد کنید..."
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkPost()}
              />
              <Button onClick={checkPost} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'در حال بررسی...' : 'بررسی'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  نتایج بررسی برای: {result.slug}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.totalPosts}</div>
                    <div className="text-sm text-blue-800">کل مقالات</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{result.publishedPosts}</div>
                    <div className="text-sm text-green-800">منتشر شده</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{result.statuses.length}</div>
                    <div className="text-sm text-yellow-800">وضعیت‌های مختلف</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.latestPublishedPost ? '✅' : '❌'}
                    </div>
                    <div className="text-sm text-purple-800">قابل نمایش</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">وضعیت‌های موجود:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.statuses.map((status, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
                            status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status}
                        </span>
                      ))}
                    </div>
                  </div>

                  {result.latestPublishedPost && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        مقاله قابل نمایش یافت شد: {result.latestPublishedPost.title}
                      </AlertDescription>
                    </Alert>
                  )}

                  {!result.latestPublishedPost && result.totalPosts > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        مقاله یافت شد اما منتشر نشده است. وضعیت: {result.statuses.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {result.allPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>تمام مقالات با این Slug</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.allPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`p-4 rounded-lg border ${
                          post.status === 'published'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{post.title}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <p>نویسنده: {post.author}</p>
                              <p>ایجاد شده: {new Date(post.created_at).toLocaleString('fa-IR')}</p>
                              <p>منتشر شده: {post.published_at ? new Date(post.published_at).toLocaleString('fa-IR') : 'هنوز منتشر نشده'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                post.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {post.status}
                            </span>
                            {index === 0 && (
                              <span className="text-xs text-blue-600">آخرین</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
