'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestBookingFlowPage() {
  const router = useRouter();
  const [storedData, setStoredData] = useState<any>(null);

  useEffect(() => {
    // Check if there's stored booking data
    const data = localStorage.getItem('bookingData');
    if (data) {
      try {
        setStoredData(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  const createTestBookingData = () => {
    const testData = {
      teacher_id: '5b60e402-ebc9-4424-bc28-a79b95853cd2',
      teacher_name: 'استاد تست',
      teacher_avatar: '/api/placeholder/100/100',
      teacher_hourly_rate: 50000,
      selectedDays: ['saturday', 'sunday'],
      selectedHours: ['morning', 'afternoon'],
      sessionType: 'online',
      duration: '90',
      studentName: 'دانش‌آموز تست',
      studentPhone: '09123456789',
      studentEmail: 'test@example.com',
      notes: 'این یک تست است',
      totalPrice: 200000,
      numberOfSessions: 4
    };

    // Store in localStorage
    localStorage.setItem('bookingData', JSON.stringify(testData));
    setStoredData(testData);
  };

  const clearStoredData = () => {
    localStorage.removeItem('bookingData');
    setStoredData(null);
  };

  const goToPayment = () => {
    router.push('/payment');
  };

  const goToTeacherPage = () => {
    router.push('/teachers/5b60e402-ebc9-4424-bc28-a79b95853cd2/book');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>تست جریان رزرو</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div>
              <h3 className="text-lg font-semibold mb-4">وضعیت داده‌های ذخیره شده</h3>
              {storedData ? (
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <p className="text-green-800 font-medium">داده‌های رزرو در localStorage موجود است</p>
                  <div className="mt-2 text-sm">
                    <p><strong>معلم:</strong> {storedData.teacher_name}</p>
                    <p><strong>دانش‌آموز:</strong> {storedData.studentName}</p>
                    <p><strong>مبلغ:</strong> {storedData.totalPrice.toLocaleString()} تومان</p>
                    <p><strong>تعداد جلسات:</strong> {storedData.numberOfSessions}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-gray-600">هیچ داده‌ای در localStorage موجود نیست</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">تست ایجاد داده</h4>
                <Button onClick={createTestBookingData} className="w-full">
                  ایجاد داده‌های تست
                </Button>
                <Button onClick={clearStoredData} variant="outline" className="w-full">
                  پاک کردن داده‌ها
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">تست صفحات</h4>
                <Button onClick={goToPayment} className="w-full" disabled={!storedData}>
                  برو به صفحه پرداخت
                </Button>
                <Button onClick={goToTeacherPage} variant="outline" className="w-full">
                  برو به صفحه رزرو معلم
                </Button>
              </div>
            </div>

            {storedData && (
              <div>
                <h4 className="font-medium mb-2">داده‌های کامل:</h4>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">
                  {JSON.stringify(storedData, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">راهنمای تست:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. ابتدا "ایجاد داده‌های تست" را کلیک کنید</li>
                <li>2. سپس "برو به صفحه پرداخت" را کلیک کنید</li>
                <li>3. بررسی کنید که صفحه پرداخت بدون خطای HTTP 431 بارگذاری شود</li>
                <li>4. برای تست کامل، "برو به صفحه رزرو معلم" را کلیک کنید</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
