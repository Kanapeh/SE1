'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentTestPage() {
  const router = useRouter();
  const [generatedUrl, setGeneratedUrl] = useState('');

  const generateTestBooking = () => {
    const testBookingData = {
      teacher_id: 'test-teacher-123',
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

    const encodedData = encodeURIComponent(JSON.stringify(testBookingData));
    const url = `/payment?booking=${encodedData}`;
    setGeneratedUrl(url);
  };

  const goToPayment = () => {
    if (generatedUrl) {
      router.push(generatedUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Payment Page Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              این صفحه برای تست صفحه پرداخت ایجاد شده است. با کلیک روی دکمه زیر، 
              داده‌های تست تولید می‌شود و می‌توانید به صفحه پرداخت بروید.
            </p>
            
            <div className="space-y-4">
              <Button onClick={generateTestBooking} className="w-full">
                تولید داده‌های تست
              </Button>
              
              {generatedUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">URL تولید شده:</p>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono break-all">
                    {generatedUrl}
                  </div>
                  <Button onClick={goToPayment} className="w-full">
                    برو به صفحه پرداخت
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">داده‌های تست:</h3>
              <ul className="text-sm space-y-1">
                <li>• معلم: استاد تست</li>
                <li>• دانش‌آموز: دانش‌آموز تست</li>
                <li>• روزها: شنبه، یکشنبه</li>
                <li>• ساعات: صبح، بعدازظهر</li>
                <li>• نوع کلاس: آنلاین</li>
                <li>• مدت: 90 دقیقه</li>
                <li>• تعداد جلسات: 4</li>
                <li>• مبلغ: 200,000 تومان</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/payment-debug')}
                className="flex-1"
              >
                صفحه دیباگ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="flex-1"
              >
                صفحه اصلی
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
