'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function ProcessPaymentPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const paymentData = {
        teacher_name: 'سپنتا علیزاده',
        student_name: 'Sepanta Alizadeh',
        student_email: 'spantaalizadeh@gmail.com',
        student_phone: '+92',
        selected_days: ['monday'],
        selected_hours: ['morning'],
        session_type: 'ترکیبی',
        duration: 60,
        payment_amount: 200000,
        number_of_sessions: 1,
        notes: 'پرداخت واقعی - 200,000 تومان - فیش واتساپ ارسال شده'
      };

      console.log('Processing payment:', paymentData);

      const response = await fetch('/api/process-real-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment processing failed');
      }

      setResult(data);
      console.log('Payment processed successfully:', data);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            پردازش پرداخت واقعی
          </h1>
          <p className="text-gray-600">
            این صفحه برای پردازش پرداخت واقعی 200,000 تومان شما طراحی شده است
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                جزئیات پرداخت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>معلم</Label>
                <Input value="سپنتا علیزاده" readOnly />
              </div>
              <div>
                <Label>دانش‌آموز</Label>
                <Input value="Sepanta Alizadeh" readOnly />
              </div>
              <div>
                <Label>ایمیل</Label>
                <Input value="spantaalizadeh@gmail.com" readOnly />
              </div>
              <div>
                <Label>شماره تماس</Label>
                <Input value="+92" readOnly />
              </div>
              <div>
                <Label>روز انتخابی</Label>
                <Input value="Monday" readOnly />
              </div>
              <div>
                <Label>ساعت انتخابی</Label>
                <Input value="Morning" readOnly />
              </div>
              <div>
                <Label>مدت جلسه</Label>
                <Input value="60 دقیقه" readOnly />
              </div>
              <div>
                <Label>نوع کلاس</Label>
                <Input value="ترکیبی" readOnly />
              </div>
              <div>
                <Label>مبلغ پرداختی</Label>
                <Input value="200,000 تومان" readOnly className="text-green-600 font-bold" />
              </div>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>عملیات پرداخت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={processPayment} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال پردازش...
                  </>
                ) : (
                  'پردازش پرداخت واقعی'
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">خطا</span>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              )}

              {result && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">پرداخت با موفقیت انجام شد!</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">شناسه رزرو:</span> {result.booking?.id}
                    </div>
                    <div>
                      <span className="font-medium">درآمد معلم:</span> {result.payment_result?.teacher_earnings?.toLocaleString()} تومان
                    </div>
                    <div>
                      <span className="font-medium">کمیسیون آکادمی:</span> {result.payment_result?.academy_commission?.toLocaleString()} تومان
                    </div>
                    <div>
                      <span className="font-medium">موجودی معلم:</span> {result.payment_result?.teacher_balance?.toLocaleString()} تومان
                    </div>
                    <div>
                      <span className="font-medium">موجودی دانش‌آموز:</span> {result.payment_result?.student_balance?.toLocaleString()} تومان
                    </div>
                    <div>
                      <span className="font-medium">موجودی آکادمی:</span> {result.payment_result?.academy_balance?.toLocaleString()} تومان
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>راهنمای استفاده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose text-sm text-gray-600">
              <p>این صفحه برای پردازش پرداخت واقعی شما طراحی شده است:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>مبلغ 200,000 تومان به حساب معلم (سپنتا علیزاده) اضافه می‌شود</li>
                <li>مبلغ 200,000 تومان به حساب دانش‌آموز (شما) اضافه می‌شود</li>
                <li>کمیسیون 10% (20,000 تومان) به حساب آکادمی اضافه می‌شود</li>
                <li>تمام تراکنش‌ها در سیستم ثبت می‌شوند</li>
                <li>وضعیت رزرو به "تأیید شده" تغییر می‌کند</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
