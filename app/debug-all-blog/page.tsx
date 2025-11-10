"use client";

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Eye, AlertTriangle, CheckCircle, Database } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  published_at: string;
  author: string;
}

interface StatusGroup {
  [status: string]: BlogPost[];
}

interface DuplicateDetail {
  slug: string;
  posts: BlogPost[];
}

export default function DebugAllBlogPage() {
  const [data, setData] = useState<{
    totalPosts: number;
    uniqueSlugs: number;
    duplicateSlugs: string[];
    statusGroups: StatusGroup;
    allPosts: BlogPost[];
    duplicateDetails: DuplicateDetail[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blog/list-all');
      const result = await response.json();
      
      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || 'خطا در دریافت مقالات');
      }
    } catch (err) {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">در حال بارگذاری تمام مقالات...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">بررسی تمام مقالات</h1>
          <Button onClick={fetchAllPosts} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {loading ? 'در حال بارگذاری...' : 'بروزرسانی'}
          </Button>
        </div>
        
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{data.totalPosts}</div>
                  <div className="text-sm text-gray-600">کل مقالات</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{data.uniqueSlugs}</div>
                  <div className="text-sm text-gray-600">Slug های منحصر به فرد</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">{data.duplicateSlugs.length}</div>
                  <div className="text-sm text-gray-600">Slug های تکراری</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{Object.keys(data.statusGroups).length}</div>
                  <div className="text-sm text-gray-600">وضعیت‌های مختلف</div>
                </CardContent>
              </Card>
            </div>

            {/* Status Groups */}
            <Card>
              <CardHeader>
                <CardTitle>مقالات بر اساس وضعیت</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.statusGroups).map(([status, posts]) => (
                    <div key={status} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">
                          {status} ({posts.length} مقاله)
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {posts.slice(0, 6).map((post) => (
                          <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-sm truncate">{post.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">Slug: {post.slug}</p>
                            <p className="text-xs text-gray-600">نویسنده: {post.author}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(post.created_at).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                        ))}
                        {posts.length > 6 && (
                          <div className="p-3 bg-gray-100 rounded-lg text-center">
                            <span className="text-sm text-gray-600">
                              و {posts.length - 6} مقاله دیگر...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Duplicate Slugs */}
            {data.duplicateSlugs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Slug های تکراری</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.duplicateDetails.map((duplicate) => (
                      <div key={duplicate.slug} className="border border-orange-200 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-800 mb-3">
                          Slug: {duplicate.slug} ({duplicate.posts.length} مقاله)
                        </h4>
                        <div className="space-y-2">
                          {duplicate.posts.map((post, index) => (
                            <div
                              key={post.id}
                              className={`p-3 rounded-lg ${
                                index === 0 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-red-50 border border-red-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium">{post.title}</h5>
                                  <p className="text-sm text-gray-600">
                                    {post.status} - {new Date(post.created_at).toLocaleString('fa-IR')}
                                  </p>
                                </div>
                                <span className="text-xs">
                                  {index === 0 ? 'آخرین' : 'قدیمی'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Posts Table */}
            <Card>
              <CardHeader>
                <CardTitle>تمام مقالات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2">عنوان</th>
                        <th className="text-right p-2">Slug</th>
                        <th className="text-right p-2">وضعیت</th>
                        <th className="text-right p-2">نویسنده</th>
                        <th className="text-right p-2">تاریخ ایجاد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.allPosts.map((post) => (
                        <tr key={post.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 max-w-xs truncate">{post.title}</td>
                          <td className="p-2 font-mono text-xs">{post.slug}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="p-2">{post.author}</td>
                          <td className="p-2 text-xs">
                            {new Date(post.created_at).toLocaleDateString('fa-IR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
