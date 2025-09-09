'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuickTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testStudentProfile = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('کاربر وارد نشده است');
      }

      // Test creating a simple student profile
      const { data, error } = await supabase
        .from('students')
        .insert({
          id: user.id,
          email: user.email,
          first_name: 'تست',
          last_name: 'کاربر',
          phone: '09123456789',
          bio: 'تست پروفایل',
          level: 'beginner',
          country: 'ایران',
          city: 'تهران',
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`خطا: ${error.message}`);
      }

      setResult({
        success: true,
        message: 'پروفایل دانش‌آموز با موفقیت ایجاد شد',
        data: data
      });

    } catch (error: any) {
      setResult({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    setLoading(true);
    setResult(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('کاربر وارد نشده است');
      }

      // Test student profile API
      const response = await fetch(`/api/student-profile?user_id=${user.id}`);
      const data = await response.json();

      setResult({
        success: response.ok,
        message: response.ok ? 'API کار می‌کند' : 'API خطا دارد',
        data: data
      });

    } catch (error: any) {
      setResult({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>تست سریع رفع مشکل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button 
                onClick={testAPI} 
                disabled={loading}
                className="flex-1"
              >
                تست API
              </Button>
              <Button 
                onClick={testStudentProfile} 
                disabled={loading}
                className="flex-1"
              >
                تست ایجاد پروفایل
              </Button>
            </div>

            {result && (
              <div className={`p-4 rounded ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'موفق' : 'خطا'}
                </h3>
                <p className={`mt-2 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                </p>
                {result.data && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/complete-profile?type=student'}
                className="w-full"
              >
                برو به صفحه اصلی پروفایل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
