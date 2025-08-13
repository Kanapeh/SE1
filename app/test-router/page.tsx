'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TestRouterPage() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testRouterPush = () => {
    addTestResult('🧪 Testing router.push("/admin")...');
    try {
      router.push('/admin');
      addTestResult('✅ router.push("/admin") called successfully');
    } catch (error: any) {
      addTestResult(`❌ router.push error: ${error.message}`);
    }
  };

  const testRouterReplace = () => {
    addTestResult('🧪 Testing router.replace("/admin")...');
    try {
      router.replace('/admin');
      addTestResult('✅ router.replace("/admin") called successfully');
    } catch (error: any) {
      addTestResult(`❌ router.replace error: ${error.message}`);
    }
  };

  const testWindowLocation = () => {
    addTestResult('🧪 Testing window.location.href = "/admin"...');
    try {
      window.location.href = '/admin';
      addTestResult('✅ window.location.href set successfully');
    } catch (error: any) {
      addTestResult(`❌ window.location error: ${error.message}`);
    }
  };

  const testWindowReplace = () => {
    addTestResult('🧪 Testing window.location.replace("/admin")...');
    try {
      window.location.replace('/admin');
      addTestResult('✅ window.location.replace called successfully');
    } catch (error: any) {
      addTestResult(`❌ window.location.replace error: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">تست Router Navigation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">کنترل‌های تست</h2>
            <div className="space-y-4">
              <Button onClick={testRouterPush} className="w-full">
                تست router.push("/admin")
              </Button>
              
              <Button onClick={testRouterReplace} variant="outline" className="w-full">
                تست router.replace("/admin")
              </Button>
              
              <Button onClick={testWindowLocation} variant="outline" className="w-full">
                تست window.location.href
              </Button>
              
              <Button onClick={testWindowReplace} variant="outline" className="w-full">
                تست window.location.replace
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
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4 text-green-900">نحوه استفاده</h2>
          <ol className="list-decimal list-inside space-y-2 text-green-800">
            <li>روی یکی از دکمه‌های تست کلیک کنید</li>
            <li>ببینید آیا navigation انجام می‌شود</li>
            <li>اگر navigation کار کرد، مشکل در router نیست</li>
            <li>اگر navigation کار نکرد، مشکل در router یا middleware است</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
