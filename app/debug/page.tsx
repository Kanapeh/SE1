"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function DebugPage() {
  const [instagramStatus, setInstagramStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testInstagramAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/instagram-posts');
      const data = await response.json();
      setInstagramStatus({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setInstagramStatus({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEnvironmentVariables = () => {
    const envVars = {
      hasInstagramToken: !!process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || !!process.env.INSTAGRAM_ACCESS_TOKEN,
      hasInstagramUserId: !!process.env.INSTAGRAM_USER_ID,
      nodeEnv: process.env.NODE_ENV,
      isClient: typeof window !== 'undefined'
    };
    
    return envVars;
  };

  const envVars = checkEnvironmentVariables();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Debug Dashboard</h1>
        <p className="text-gray-600">بررسی وضعیت سیستم و API ها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>متغیرهای محیطی</CardTitle>
            <CardDescription>وضعیت تنظیمات سیستم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Instagram Access Token:</span>
              <Badge variant={envVars.hasInstagramToken ? "default" : "destructive"}>
                {envVars.hasInstagramToken ? "موجود" : "مفقود"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Instagram User ID:</span>
              <Badge variant={envVars.hasInstagramUserId ? "default" : "destructive"}>
                {envVars.hasInstagramUserId ? "موجود" : "مفقود"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Environment:</span>
              <Badge variant="outline">{envVars.nodeEnv || "نامشخص"}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Client Side:</span>
              <Badge variant="outline">{envVars.isClient ? "بله" : "خیر"}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Instagram API Test */}
        <Card>
          <CardHeader>
            <CardTitle>تست API اینستاگرام</CardTitle>
            <CardDescription>بررسی اتصال به Instagram API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testInstagramAPI} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "در حال تست..." : "تست API اینستاگرام"}
            </Button>
            
            {instagramStatus && (
              <div className="space-y-2">
                <Separator />
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>وضعیت:</span>
                    <Badge variant={instagramStatus.success ? "default" : "destructive"}>
                      {instagramStatus.success ? "موفق" : "ناموفق"}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {instagramStatus.timestamp}
                  </div>
                </div>
                
                {instagramStatus.success ? (
                  <div className="text-sm">
                    <div>تعداد پست‌ها: {instagramStatus.data.posts?.length || 0}</div>
                    {instagramStatus.data.error && (
                      <div className="text-red-500">خطا: {instagramStatus.data.error}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-red-500">
                    خطا: {instagramStatus.error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instagram API Response Details */}
      {instagramStatus && instagramStatus.success && instagramStatus.data && (
        <Card>
          <CardHeader>
            <CardTitle>جزئیات پاسخ API اینستاگرام</CardTitle>
            <CardDescription>اطلاعات دریافتی از Instagram API</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(instagramStatus.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>راهنمای رفع مشکل</CardTitle>
          <CardDescription>مراحل حل مشکلات احتمالی</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">مشکل: Instagram Access Token نامعتبر</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>توکن را از Facebook Developer Console دریافت کنید</li>
              <li>مطمئن شوید که اپلیکیشن شما Instagram Basic Display را فعال کرده</li>
              <li>توکن را در فایل .env.local قرار دهید</li>
              <li>سرور را restart کنید</li>
            </ul>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="font-semibold">مشکل: Instagram User ID نامعتبر</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>User ID را با استفاده از API دریافت کنید</li>
              <li>از endpoint زیر استفاده کنید:</li>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                GET https://graph.instagram.com/me?fields=id&access_token=YOUR_TOKEN
              </code>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
