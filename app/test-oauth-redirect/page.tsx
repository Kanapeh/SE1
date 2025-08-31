'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getOAuthRedirectUrl, getAdminOAuthRedirectUrl, getTeacherOAuthRedirectUrl, getProductionOAuthRedirectUrl, logOAuthConfig } from '@/lib/oauth-utils';

export default function TestOAuthRedirectPage() {
  const [results, setResults] = useState<any>(null);

  const testOAuthUrls = () => {
    logOAuthConfig();
    
    // Test all possible OAuth redirect scenarios
    const testResults = {
      timestamp: new Date().toISOString(),
      currentLocation: typeof window !== 'undefined' ? window.location.href : 'Server-side',
      currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'Server-side',
      currentHostname: typeof window !== 'undefined' ? window.location.hostname : 'Server-side',
      environmentSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
      vercelEnvSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
      oauthRedirectUrl: getOAuthRedirectUrl(),
      productionOAuthUrl: getProductionOAuthRedirectUrl(),
      adminOAuthRedirectUrl: getAdminOAuthRedirectUrl(),
      teacherOAuthRedirectUrl: getTeacherOAuthRedirectUrl('teacher'),
      studentOAuthRedirectUrl: getTeacherOAuthRedirectUrl('student'),
      // Test specific redirect URLs that Supabase might be using
      supabaseCallbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.se1a.org'}/auth/callback`,
      adminCallbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.se1a.org'}/admin/auth/callback`,
      // Test window.location based URLs
      windowBasedRedirect: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'Server-side',
      // Test hardcoded URLs
      hardcodedUrl: 'https://www.se1a.org/auth/callback',
    };
    
    setResults(testResults);
    console.log('🔍 OAuth Redirect Test Results:', testResults);
    
    // Also log to console for debugging
    console.log('🚨 CRITICAL DEBUG INFO:');
    console.log('Environment SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
    console.log('Window origin:', typeof window !== 'undefined' ? window.location.origin : 'Server-side');
    console.log('Expected redirect URL:', testResults.oauthRedirectUrl);
    console.log('Hardcoded URL:', testResults.hardcodedUrl);
  };

  const testGoogleOAuth = async () => {
    try {
      const redirectUrl = getOAuthRedirectUrl();
      console.log('🚀 Testing Google OAuth with redirect URL:', redirectUrl);
      
      // Simulate OAuth redirect (this won't actually redirect)
      alert(`OAuth redirect URL: ${redirectUrl}\n\nThis is a test - no actual redirect will happen.`);
      
    } catch (error) {
      console.error('❌ OAuth test error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            تست OAuth Redirect URLs
          </h1>
          <p className="text-gray-600">
            این صفحه برای تست و دیباگ OAuth redirect URLs ایجاد شده است
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>کنترل‌های تست</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testOAuthUrls}
                className="w-full"
              >
                تست OAuth URLs
              </Button>
              
              <Button 
                onClick={testGoogleOAuth}
                variant="outline"
                className="w-full"
              >
                تست Google OAuth
              </Button>
            </CardContent>
          </Card>

          {/* Environment Info */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات محیط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">NODE_ENV:</span> {process.env.NODE_ENV}
              </div>
              <div>
                <span className="font-medium">NEXT_PUBLIC_SITE_URL:</span> {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Current Time:</span> {new Date().toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>نتایج تست</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">اطلاعات موقعیت فعلی:</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Location:</span> {results.currentLocation}</div>
                      <div><span className="font-medium">Origin:</span> {results.currentOrigin}</div>
                      <div><span className="font-medium">Hostname:</span> {results.currentHostname}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">متغیرهای محیط:</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">SITE_URL:</span> {results.environmentSiteUrl}</div>
                      <div><span className="font-medium">Timestamp:</span> {results.timestamp}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">OAuth Redirect URLs:</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Default:</span> <code className="bg-gray-100 px-1 rounded">{results.oauthRedirectUrl}</code></div>
                    <div><span className="font-medium">Production (Forced):</span> <code className="bg-green-100 px-1 rounded">{results.productionOAuthUrl}</code></div>
                    <div><span className="font-medium">Admin:</span> <code className="bg-gray-100 px-1 rounded">{results.adminOAuthRedirectUrl}</code></div>
                    <div><span className="font-medium">Teacher:</span> <code className="bg-gray-100 px-1 rounded">{results.teacherOAuthRedirectUrl}</code></div>
                    <div><span className="font-medium">Student:</span> <code className="bg-gray-100 px-1 rounded">{results.studentOAuthRedirectUrl}</code></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>راهنمای استفاده</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">برای تست:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>دکمه "تست OAuth URLs" را کلیک کنید</li>
                <li>نتایج را بررسی کنید</li>
                <li>دکمه "تست Google OAuth" را کلیک کنید</li>
                <li>Console مرورگر را بررسی کنید</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">نکات مهم:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>اگر در localhost هستید، باید localhost:3000/auth/callback ببینید</li>
                <li>اگر در production هستید، باید https://se1a.vercel.app/auth/callback ببینید</li>
                <li>اگر redirect URL اشتباه است، مشکل در تنظیمات محیط است</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
