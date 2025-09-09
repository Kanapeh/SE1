'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Copy, 
  Check, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Receipt,
  MessageCircle,
  Star,
  DollarSign,
  Shield,
  CheckCircle,
  AlertCircle,
  Send,
  Upload
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BookingData {
  teacher_id: string;
  teacher_name: string;
  teacher_avatar?: string;
  teacher_hourly_rate: number;
  selectedDays: string[];
  selectedHours: string[];
  sessionType: string;
  duration: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  notes: string;
  totalPrice: number;
  numberOfSessions: number;
}

interface PaymentInfo {
  bankName: string;
  accountNumber: string;
  cardNumber: string;
  accountHolder: string;
  whatsappNumber: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentInfo] = useState<PaymentInfo>({
    bankName: 'بانک ملی ایران',
    accountNumber: '6037-9919-1234-5678',
    cardNumber: '6037-9919-1234-5678',
    accountHolder: 'آکادمی زبان SE1A',
    whatsappNumber: '+989387279975'
  });
  
  const [transactionId, setTransactionId] = useState('');
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadBookingData();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
      router.push('/login');
    }
  };

  const loadBookingData = () => {
    console.log('Loading booking data...');
    
    // First try to get data from sessionStorage (more secure)
    const sessionData = sessionStorage.getItem('bookingData');
    if (sessionData) {
      try {
        const data = JSON.parse(sessionData);
        console.log('Found booking data in sessionStorage:', data);
        setBookingData(data);
        // Clear the stored data after loading
        sessionStorage.removeItem('bookingData');
        return;
      } catch (error) {
        console.error('Error parsing session booking data:', error);
        sessionStorage.removeItem('bookingData');
      }
    }

    // Try localStorage as fallback
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log('Found booking data in localStorage:', data);
        setBookingData(data);
        // Clear the stored data after loading
        localStorage.removeItem('bookingData');
        return;
      } catch (error) {
        console.error('Error parsing stored booking data:', error);
        localStorage.removeItem('bookingData');
      }
    }

    // Fallback to URL parameters for backward compatibility
    const bookingParam = searchParams?.get('booking');
    if (bookingParam) {
      try {
        const data = JSON.parse(decodeURIComponent(bookingParam));
        setBookingData(data);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        router.push('/');
      }
    } else {
      // If no booking data found, redirect to teachers page instead of home
      console.log('No booking data found in sessionStorage or localStorage');
      console.log('sessionStorage bookingData:', sessionStorage.getItem('bookingData'));
      console.log('localStorage bookingData:', localStorage.getItem('bookingData'));
      alert('اطلاعات رزرو یافت نشد. لطفاً دوباره تلاش کنید.');
      router.push('/teachers');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToWhatsApp = () => {
    if (!bookingData || !transactionId) return;

    const message = `🎓 رزرو کلاس جدید

👨‍🏫 معلم: ${bookingData.teacher_name}
👤 دانش‌آموز: ${bookingData.studentName}
📱 شماره تماس: ${bookingData.studentPhone}
📧 ایمیل: ${bookingData.studentEmail}

⏰ جزئیات کلاس:
📅 روزهای انتخابی: ${bookingData.selectedDays.join(', ')}
🕐 ساعات انتخابی: ${bookingData.selectedHours.join(', ')}
⏱️ مدت هر جلسه: ${bookingData.duration} دقیقه
🎯 نوع کلاس: ${bookingData.sessionType === 'online' ? 'آنلاین' : bookingData.sessionType === 'offline' ? 'حضوری' : 'ترکیبی'}
🔢 تعداد جلسات: ${bookingData.numberOfSessions}

💰 مبلغ پرداختی: ${bookingData.totalPrice.toLocaleString()} تومان
💳 شماره تراکنش: ${transactionId}

${notes ? `📝 توضیحات: ${notes}` : ''}

لطفاً این رزرو را بررسی و تایید کنید.`;

    // Remove + from phone number for wa.me
    const phoneNumber = paymentInfo.whatsappNumber.replace('+', '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      alert('لطفاً شماره تراکنش را وارد کنید');
      return;
    }

    if (!receiptImage) {
      alert('لطفاً فیش واریزی را آپلود کنید');
      return;
    }

    setSubmitting(true);

    try {
      if (!currentUser || !bookingData) {
        throw new Error('اطلاعات کاربر یا رزرو یافت نشد');
      }

      // Convert image to base64
      const imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(receiptImage);
      });

      // Create booking
      const bookingPayload = {
        teacher_id: bookingData.teacher_id,
        student_id: currentUser.id,
        student_name: bookingData.studentName,
        student_email: bookingData.studentEmail,
        student_phone: bookingData.studentPhone,
        selected_days: bookingData.selectedDays,
        selected_hours: bookingData.selectedHours,
        session_type: bookingData.sessionType,
        duration: parseInt(bookingData.duration),
        total_price: bookingData.totalPrice,
        number_of_sessions: bookingData.numberOfSessions,
        notes: bookingData.notes,
        transaction_id: transactionId,
        receipt_image: imageBase64,
        payment_notes: notes,
        payment_status: 'pending'
      };

      console.log('Creating booking with payment:', bookingPayload);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'خطا در ثبت رزرو');
      }

      // Send to WhatsApp
      sendToWhatsApp();

      // Success message
      alert('رزرو با موفقیت ثبت شد! اطلاعات برای ادمین ارسال شد.');
      
      // Redirect to dashboard
      router.push('/dashboard/student');
      
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      alert(error.message || 'خطا در ثبت پرداخت');
    } finally {
      setSubmitting(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                پرداخت کلاس
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                لطفاً مبلغ را واریز کرده و فیش را آپلود کنید
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-500" />
                  خلاصه رزرو
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Teacher Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={bookingData.teacher_avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {bookingData.teacher_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {bookingData.teacher_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bookingData.teacher_hourly_rate.toLocaleString()} تومان/ساعت
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">دانش‌آموز:</span>
                    <span className="font-medium">{bookingData.studentName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">روزها:</span>
                    <div className="flex gap-1">
                      {bookingData.selectedDays.map(day => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">ساعات:</span>
                    <div className="flex gap-1">
                      {bookingData.selectedHours.map(hour => (
                        <Badge key={hour} variant="secondary" className="text-xs">
                          {hour}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">نوع کلاس:</span>
                    <Badge variant="outline">
                      {bookingData.sessionType === 'online' ? 'آنلاین' : 
                       bookingData.sessionType === 'offline' ? 'حضوری' : 'ترکیبی'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">مدت هر جلسه:</span>
                    <span className="font-medium">{bookingData.duration} دقیقه</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">تعداد جلسات:</span>
                    <span className="font-medium">{bookingData.numberOfSessions} جلسه</span>
                  </div>
                </div>

                <Separator />

                {/* Price Calculation */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      قیمت هر ساعت:
                    </span>
                    <span className="font-medium">
                      {bookingData.teacher_hourly_rate.toLocaleString()} تومان
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      تعداد ساعات کل:
                    </span>
                    <span className="font-medium">
                      {(bookingData.numberOfSessions * parseInt(bookingData.duration) / 60).toFixed(1)} ساعت
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">مبلغ کل:</span>
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <DollarSign className="w-5 h-5" />
                      {bookingData.totalPrice.toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  اطلاعات پرداخت
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Bank Information */}
                  <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      اطلاعات حساب
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">بانک:</span>
                        <span className="font-medium">{paymentInfo.bankName}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">شماره کارت:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{paymentInfo.cardNumber}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(paymentInfo.cardNumber.replace(/-/g, ''), 'card')}
                            className="h-6 w-6 p-0"
                          >
                            {copied === 'card' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">صاحب حساب:</span>
                        <span className="font-medium">{paymentInfo.accountHolder}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        لطفاً مبلغ {bookingData.totalPrice.toLocaleString()} تومان را به حساب بالا واریز کنید
                      </p>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-2">
                    <Label htmlFor="transactionId" className="flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      شماره تراکنش *
                    </Label>
                    <Input
                      id="transactionId"
                      type="text"
                      placeholder="شماره پیگیری/تراکنش را وارد کنید"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                      className="font-mono"
                    />
                  </div>

                  {/* Receipt Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="receipt" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      آپلود فیش واریزی *
                    </Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="cursor-pointer"
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <img 
                          src={previewImage} 
                          alt="فیش واریزی" 
                          className="max-w-full h-32 object-contain border rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">توضیحات اضافی</Label>
                    <Textarea
                      id="notes"
                      placeholder="توضیحات اضافی در مورد پرداخت..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* WhatsApp Info */}
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-300">
                        ارسال اطلاعات به واتساپ
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      پس از ثبت، اطلاعات رزرو و پرداخت به صورت خودکار به واتساپ ادمین ارسال می‌شود
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting || !transactionId.trim() || !receiptImage}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3"
                    size="lg"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        در حال ثبت...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        ثبت پرداخت و ارسال به ادمین
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
