"use client";

import { useEffect, useState } from 'react';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { supabase } from '@/lib/supabase';

export default function AdminAccessTest() {
  const { isAdmin, loading } = useAdminAccess();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user profile from auth-users table
          const { data: profile } = await supabase
            .from('auth-users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          // Get admin profile from admins table
          const { data: adminProfile } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          setUserInfo({ ...user, profile });
          setAdminInfo(adminProfile);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات کاربر');
      }
    }

    getUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">تست دسترسی ادمین</h3>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
          <span>در حال بررسی دسترسی...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">تست دسترسی ادمین</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="font-medium ml-2">وضعیت دسترسی:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAdmin ? '✅ ادمین' : '❌ غیر ادمین'}
          </span>
        </div>

        {userInfo && (
          <div className="space-y-2 text-sm">
            <div><strong>ایمیل:</strong> {userInfo.email}</div>
            <div><strong>نام:</strong> {userInfo.profile?.first_name || 'تعریف نشده'}</div>
            <div><strong>نام خانوادگی:</strong> {userInfo.profile?.last_name || 'تعریف نشده'}</div>
            <div><strong>تلفن:</strong> {userInfo.profile?.phone || 'تعریف نشده'}</div>
          </div>
        )}

        {adminInfo && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-semibold text-green-800 mb-2">اطلاعات ادمین:</h4>
            <div className="space-y-1 text-sm text-green-700">
              <div><strong>نقش:</strong> {adminInfo.role || 'admin'}</div>
              <div><strong>نام کامل:</strong> {adminInfo.full_name || 'تعریف نشده'}</div>
              <div><strong>تاریخ ایجاد:</strong> {new Date(adminInfo.created_at).toLocaleDateString('fa-IR')}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded">
            <strong>خطا:</strong> {error}
          </div>
        )}

        {!isAdmin && (
          <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
            <strong>توجه:</strong> شما دسترسی ادمین ندارید. برای دسترسی به صفحات ادمین، باید در جدول admins ثبت شده باشید.
          </div>
        )}
      </div>
    </div>
  );
}