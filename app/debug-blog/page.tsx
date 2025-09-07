"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface DuplicatePost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  status: string;
}

interface DuplicateGroup {
  [slug: string]: DuplicatePost[];
}

export default function DebugBlogPage() {
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [groupedPosts, setGroupedPosts] = useState<DuplicateGroup>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    checkDuplicates();
  }, []);

  const checkDuplicates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blog/check-duplicates');
      const data = await response.json();
      
      if (response.ok) {
        setDuplicates(data.duplicates || []);
        setGroupedPosts(data.groupedPosts || {});
      } else {
        setError(data.error || 'خطا در بررسی تکراری‌ها');
      }
    } catch (err) {
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const fixDuplicates = async (slug: string) => {
    setProcessing(slug);
    
    try {
      const response = await fetch('/api/blog/check-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`تکراری‌ها برای slug "${slug}" حذف شدند`);
        checkDuplicates(); // Refresh the list
      } else {
        alert(`خطا: ${data.error}`);
      }
    } catch (err) {
      alert('خطا در حذف تکراری‌ها');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">در حال بررسی تکراری‌ها...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">بررسی و حل مشکل مقالات تکراری</h1>
        
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {duplicates.length === 0 ? (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>هیچ slug تکراری یافت نشد!</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {duplicates.length} slug تکراری یافت شد. برای هر slug، فقط آخرین مقاله نگه داشته می‌شود.
              </AlertDescription>
            </Alert>

            {Object.entries(groupedPosts).map(([slug, posts]) => (
              <Card key={slug} className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Slug: {slug}</span>
                    <Button
                      onClick={() => fixDuplicates(slug)}
                      disabled={processing === slug}
                      variant="destructive"
                      size="sm"
                    >
                      {processing === slug ? 'در حال پردازش...' : 'حل کردن تکراری‌ها'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {posts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`p-3 rounded-lg border ${
                          index === 0 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{post.title}</h4>
                            <p className="text-sm text-gray-600">
                              ایجاد شده: {new Date(post.created_at).toLocaleString('fa-IR')}
                            </p>
                            <p className="text-sm text-gray-600">
                              وضعیت: {post.status}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {index === 0 ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Trash2 className="h-5 w-5 text-red-600" />
                            )}
                            <span className="ml-2 text-sm">
                              {index === 0 ? 'نگه داشته می‌شود' : 'حذف خواهد شد'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button onClick={checkDuplicates} variant="outline">
            بررسی مجدد
          </Button>
        </div>
      </div>
    </div>
  );
}
