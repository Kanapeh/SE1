'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TestLoginRedirectPage() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testRedirects = () => {
    addTestResult('🧪 Testing redirect scenarios...');
    
    // Test admin redirect
    const adminUrl = '/login?redirectTo=%2Fadmin';
    addTestResult(`🔗 Admin redirect: ${adminUrl}`);
    
    // Test dashboard redirect
    const dashboardUrl = '/login?redirectTo=%2Fdashboard';
    addTestResult(`🔗 Dashboard redirect: ${dashboardUrl}`);
    
    // Test complete profile redirect
    const profileUrl = '/login?redirectTo=%2Fcomplete-profile';
    addTestResult(`🔗 Profile redirect: ${profileUrl}`);
    
    addTestResult('✅ Test scenarios prepared. You can now test each URL.');
  };

  const goToAdminLogin = () => {
    router.push('/login?redirectTo=%2Fadmin');
  };

  const goToDashboardLogin = () => {
    router.push('/login?redirectTo=%2Fdashboard');
  };

  const goToProfileLogin = () => {
    router.push('/login?redirectTo=%2Fcomplete-profile');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">تست Login Redirect</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">کنترل‌های تست</h2>
            <div className="space-y-4">
              <Button onClick={testRedirects} className="w-full">
                آماده‌سازی سناریوهای تست
              </Button>
              
              <Button onClick={goToAdminLogin} variant="outline" className="w-full">
                تست Admin Redirect
              </Button>
              
              <Button onClick={goToDashboardLogin} variant="outline" className="w-full">
                تست Dashboard Redirect
              </Button>
              
              <Button onClick={goToProfileLogin} variant="outline" className="w-full">
                تست Profile Redirect
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

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">نحوه استفاده</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>روی "آماده‌سازی سناریوهای تست" کلیک کنید</li>
            <li>یکی از دکمه‌های تست redirect را کلیک کنید</li>
            <li>در صفحه login، با حساب ادمین وارد شوید</li>
            <li>باید به صفحه مورد نظر redirect شوید</li>
            <li>نتایج را در این صفحه مشاهده کنید</li>
          </ol>
        </Card>

        {/* Expected Behavior */}
        <Card className="mt-8 p-6 bg-green-50">
          <h2 className="text-xl font-semibold mb-4 text-green-900">رفتار مورد انتظار</h2>
          <div className="space-y-2 text-green-800">
            <div><strong>Admin:</strong> باید به /admin redirect شود</div>
            <div><strong>Dashboard:</strong> باید به /dashboard redirect شود</div>
            <div><strong>Profile:</strong> باید به /complete-profile redirect شود</div>
            <div><strong>بدون redirectTo:</strong> باید به صفحه پیش‌فرض برود</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
