'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestProfileCreationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: 'تست',
    last_name: 'کاربر',
    phone: '09123456789',
    bio: 'این یک تست است'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('کاربر وارد نشده است');
      }

      // Create student profile
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          id: user.id, // Use id instead of user_id
          email: user.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          bio: formData.bio,
          level: 'beginner',
          country: 'ایران',
          city: 'تهران'
        })
        .select()
        .single();

      if (studentError) {
        throw new Error(`خطا در ایجاد پروفایل دانش‌آموز: ${studentError.message}`);
      }

      setResult({
        success: true,
        message: 'پروفایل دانش‌آموز با موفقیت ایجاد شد',
        data: studentData
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
            <CardTitle>تست ایجاد پروفایل دانش‌آموز</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="first_name">نام</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">نام خانوادگی</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bio">بیوگرافی</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'در حال ایجاد...' : 'ایجاد پروفایل'}
              </Button>
            </form>

            {result && (
              <div className={`mt-6 p-4 rounded ${
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
                {result.error && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-6 flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/api-test')}
                className="flex-1"
              >
                تست API
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/complete-profile?type=student')}
                className="flex-1"
              >
                صفحه اصلی پروفایل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
