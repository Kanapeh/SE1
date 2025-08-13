'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TestWindowLocationPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testWindowLocationHref = () => {
    addTestResult('🧪 Testing window.location.href = "/admin"...');
    try {
      window.location.href = '/admin';
      addTestResult('✅ window.location.href set successfully');
    } catch (error: any) {
      addTestResult(`❌ Error: ${error.message}`);
    }
  };

  const testWindowLocationReplace = () => {
    addTestResult('🧪 Testing window.location.replace("/admin")...');
    try {
      window.location.replace('/admin');
      addTestResult('✅ window.location.replace called successfully');
    } catch (error: any) {
      addTestResult(`❌ Error: ${error.message}`);
    }
  };

  const testWindowLocationAssign = () => {
    addTestResult('🧪 Testing window.location.assign("/admin")...');
    try {
      window.location.assign('/admin');
      addTestResult('✅ window.location.assign called successfully');
    } catch (error: any) {
      addTestResult(`❌ Error: ${error.message}`);
    }
  };

  const testCurrentLocation = () => {
    addTestResult(`📍 Current location: ${window.location.href}`);
    addTestResult(`📍 Current pathname: ${window.location.pathname}`);
    addTestResult(`📍 Current search: ${window.location.search}`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">تست Window Location Navigation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">کنترل‌های تست</h2>
            <div className="space-y-4">
              <Button onClick={testWindowLocationHref} className="w-full">
                تست window.location.href
              </Button>
              
              <Button onClick={testWindowLocationReplace} variant="outline" className="w-full">
                تست window.location.replace
              </Button>
              
              <Button onClick={testWindowLocationAssign} variant="outline" className="w-full">
                تست window.location.assign
              </Button>
              
              <Button onClick={testCurrentLocation} variant="outline" className="w-full">
                نمایش موقعیت فعلی
              </Button>
              
              <Button onClick={clearResults} variant="destructive" className="w-full">
                پاک کردن نتایج
              </Button>
            </div>
          </Card>

          {/* Test Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">نتایج تست</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">هنوز تستی انجام نشده است</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-100 rounded">
                    {result}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Current URL Info */}
        <Card className="mt-8 p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">اطلاعات URL فعلی</h2>
          <div className="space-y-2 text-blue-800">
            <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</div>
            <div><strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}</div>
            <div><strong>Search:</strong> {typeof window !== 'undefined' ? window.location.search : 'Loading...'}</div>
            <div><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Loading...'}</div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4 text-green-900">نحوه استفاده</h2>
          <ol className="list-decimal list-inside space-y-2 text-green-800">
            <li>روی یکی از دکمه‌های تست کلیک کنید</li>
            <li>ببینید آیا navigation انجام می‌شود</li>
            <li>اگر navigation کار کرد، مشکل در Next.js router است</li>
            <li>اگر navigation کار نکرد، مشکل در browser یا security settings است</li>
          </ol>
        </Card>

        {/* Expected Behavior */}
        <Card className="mt-8 p-6 bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">رفتار مورد انتظار</h2>
          <div className="space-y-2 text-yellow-800">
            <div><strong>window.location.href:</strong> باید به /admin برود</div>
            <div><strong>window.location.replace:</strong> باید به /admin برود (بدون history)</div>
            <div><strong>window.location.assign:</strong> باید به /admin برود</div>
            <div><strong>نکته:</strong> این روش‌ها باید در همه مرورگرها کار کنند</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
