'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DebugUserRolePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [adminCheck, setAdminCheck] = useState<any>(null);
  const [authUserCheck, setAuthUserCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (!session?.user) {
        setError('No active session found');
        setLoading(false);
        return;
      }

      setUserInfo({
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at,
        app_metadata: session.user.app_metadata,
        user_metadata: session.user.user_metadata
      });

      // Check admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      setAdminCheck({
        data: adminData,
        error: adminError,
        exists: !!adminData
      });

      // Check auth-users table
      const { data: authUserData, error: authUserError } = await supabase
        .from('auth-users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setAuthUserCheck({
        data: authUserData,
        error: authUserError,
        exists: !!authUserData
      });

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshCheck = () => {
    checkUserRole();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بررسی نقش کاربر...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">خطا</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <Button onClick={refreshCheck} className="mt-4">
              تلاش مجدد
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">بررسی نقش کاربر</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">اطلاعات کاربر</h2>
            {userInfo && (
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">ID:</span> {userInfo.id}</div>
                <div><span className="font-semibold">Email:</span> {userInfo.email}</div>
                <div><span className="font-semibold">Created:</span> {new Date(userInfo.created_at).toLocaleString()}</div>
                <div><span className="font-semibold">App Metadata:</span> {JSON.stringify(userInfo.app_metadata)}</div>
                <div><span className="font-semibold">User Metadata:</span> {JSON.stringify(userInfo.user_metadata)}</div>
              </div>
            )}
          </Card>

          {/* Admin Check */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">بررسی جدول Admins</h2>
            {adminCheck && (
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">Exists:</span> {adminCheck.exists ? '✅ بله' : '❌ خیر'}</div>
                {adminCheck.error && (
                  <div><span className="font-semibold">Error:</span> <span className="text-red-600">{adminCheck.error.message}</span></div>
                )}
                {adminCheck.data && (
                  <div><span className="font-semibold">Data:</span> <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(adminCheck.data, null, 2)}</pre></div>
                )}
              </div>
            )}
          </Card>

          {/* Auth Users Check */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">بررسی جدول Auth-Users</h2>
            {authUserCheck && (
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">Exists:</span> {authUserCheck.exists ? '✅ بله' : '❌ خیر'}</div>
                {authUserCheck.error && (
                  <div><span className="font-semibold">Error:</span> <span className="text-red-600">{authUserCheck.error.message}</span></div>
                )}
                {authUserCheck.data && (
                  <div><span className="font-semibold">Data:</span> <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(authUserCheck.data, null, 2)}</pre></div>
                )}
              </div>
            )}
          </Card>

          {/* Summary */}
          <Card className="p-6 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">خلاصه وضعیت</h2>
            <div className="space-y-2 text-blue-800">
              {adminCheck?.exists && (
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  کاربر در جدول admins یافت شد
                </div>
              )}
              {authUserCheck?.exists && (
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  کاربر در جدول auth-users یافت شد
                </div>
              )}
              {!adminCheck?.exists && !authUserCheck?.exists && (
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">❌</span>
                  کاربر در هیچ جدول ادمین یافت نشد
                </div>
              )}
              {authUserCheck?.data?.role === 'admin' && (
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  کاربر دارای نقش admin است
                </div>
              )}
              {authUserCheck?.data?.is_admin === true && (
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  کاربر دارای فلگ is_admin است
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <Button onClick={refreshCheck} variant="outline">
            بروزرسانی اطلاعات
          </Button>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">نحوه استفاده</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>این صفحه نقش کاربر فعلی را بررسی می‌کند</li>
            <li>جدول admins و auth-users را چک می‌کند</li>
            <li>نقش و دسترسی‌های کاربر را نمایش می‌دهد</li>
            <li>برای بروزرسانی روی دکمه "بروزرسانی اطلاعات" کلیک کنید</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
