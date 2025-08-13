"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function TestAdminPage() {
  const [user, setUser] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [authUserData, setAuthUserData] = useState<any>(null);
  const [teacherData, setTeacherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      setLoading(true);
      console.log('🧪 TestAdminPage: Starting user access check...');

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ TestAdminPage: No authenticated user');
        toast({
          title: "خطا",
          description: "کاربر احراز هویت نشده است",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ TestAdminPage: User authenticated:', user);
      setUser(user);

      // Check admins table
      console.log('🔍 TestAdminPage: Checking admins table...');
      const { data: adminResult, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('❌ TestAdminPage: Admin table check error:', adminError);
      }

      if (adminResult) {
        console.log('✅ TestAdminPage: User found in admins table:', adminResult);
        setAdminData(adminResult);
      } else {
        console.log('ℹ️ TestAdminPage: User not found in admins table');
      }

      // Check auth-users table
      console.log('🔍 TestAdminPage: Checking auth-users table...');
      const { data: authUserResult, error: authUserError } = await supabase
        .from('auth-users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (authUserError && authUserError.code !== 'PGRST116') {
        console.error('❌ TestAdminPage: Auth-users table check error:', authUserError);
      }

      if (authUserResult) {
        console.log('✅ TestAdminPage: User found in auth-users table:', authUserResult);
        setAuthUserData(authUserResult);
      } else {
        console.log('ℹ️ TestAdminPage: User not found in auth-users table');
      }

      // Check teachers table
      console.log('🔍 TestAdminPage: Checking teachers table...');
      const { data: teacherResult, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (teacherError && teacherError.code !== 'PGRST116') {
        console.error('❌ TestAdminPage: Teachers table check error:', teacherError);
      }

      if (teacherResult) {
        console.log('✅ TestAdminPage: User found in teachers table:', teacherResult);
        setTeacherData(teacherResult);
      } else {
        console.log('ℹ️ TestAdminPage: User not found in teachers table');
      }

    } catch (error) {
      console.error('💥 TestAdminPage: Unexpected error:', error);
      toast({
        title: "خطا",
        description: "خطای غیرمنتظره رخ داد",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testAdminAccess = async () => {
    try {
      console.log('🧪 TestAdminPage: Testing admin access...');
      
      // Test if user can access admin-only data
      const { data: testData, error: testError } = await supabase
        .from('admins')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ TestAdminPage: Admin access test failed:', testError);
        toast({
          title: "خطا",
          description: "تست دسترسی ادمین ناموفق بود",
          variant: "destructive"
        });
      } else {
        console.log('✅ TestAdminPage: Admin access test successful:', testData);
        toast({
          title: "موفق",
          description: "تست دسترسی ادمین موفق بود",
        });
      }
    } catch (error) {
      console.error('💥 TestAdminPage: Admin access test error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🧪 تست دسترسی ادمین</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>👤 اطلاعات کاربر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Created:</strong> {user?.created_at}</p>
          </CardContent>
        </Card>

        {/* Admins Table */}
        <Card>
          <CardHeader>
            <CardTitle>👑 جدول ادمین‌ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {adminData ? (
              <>
                <p><strong>Status:</strong> ✅ موجود</p>
                <p><strong>Role:</strong> {adminData.role}</p>
                <p><strong>Full Name:</strong> {adminData.full_name}</p>
              </>
            ) : (
              <p className="text-gray-500">❌ کاربر در این جدول یافت نشد</p>
            )}
          </CardContent>
        </Card>

        {/* Auth Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>🔐 جدول کاربران احراز هویت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {authUserData ? (
              <>
                <p><strong>Status:</strong> ✅ موجود</p>
                <p><strong>Role:</strong> {authUserData.role}</p>
                <p><strong>Is Admin:</strong> {authUserData.is_admin ? '✅ بله' : '❌ خیر'}</p>
                <p><strong>Full Name:</strong> {authUserData.full_name}</p>
              </>
            ) : (
              <p className="text-gray-500">❌ کاربر در این جدول یافت نشد</p>
            )}
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>👨‍🏫 جدول معلمان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {teacherData ? (
              <>
                <p><strong>Status:</strong> ✅ موجود</p>
                <p><strong>Teacher Status:</strong> {teacherData.status}</p>
                <p><strong>Active:</strong> {teacherData.status === 'active' ? '✅ بله' : '❌ خیر'}</p>
              </>
            ) : (
              <p className="text-gray-500">❌ کاربر در این جدول یافت نشد</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={checkUserAccess} variant="outline">
          🔄 بررسی مجدد دسترسی
        </Button>
        <Button onClick={testAdminAccess}>
          🧪 تست دسترسی ادمین
        </Button>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>🐛 اطلاعات دیباگ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-mono bg-gray-100 p-4 rounded">
            <p><strong>Admin Access:</strong> {adminData ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Auth User Admin:</strong> {authUserData?.is_admin ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Teacher Access:</strong> {teacherData?.status === 'active' ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Total Admin Access:</strong> {
              (adminData || authUserData?.is_admin || teacherData?.status === 'active') ? '✅ Yes' : '❌ No'
            }</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
