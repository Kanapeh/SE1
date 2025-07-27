'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  CreditCard, 
  Banknote,
  AlertCircle,
  User,
  Phone,
  Mail,
  Monitor,
  Home,
  Copy
} from 'lucide-react';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  hourly_rate: number | null;
  location: string | null;
  experience_years: number | null;
  levels: string[] | null;
  available: boolean;
}

interface BookingData {
  teacher_id: string;
  student_id: string;
  selectedDays: string[];
  selectedHours: string[];
  sessionType: string;
  duration: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  notes: string;
  totalPrice: number;
}

interface PaymentForm {
  paymentMethod: string;
  transactionId: string;
  notes: string;
}

export default function ConfirmBookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    paymentMethod: 'card_to_card',
    transactionId: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch teacher data
  const fetchTeacher = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setTeacher(data);
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Debug - Auth result:', { user, error });
      
      if (error) {
        console.error('Auth error:', error);
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }
      
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
      router.push('/login');
    }
  };

  // Get or create student record
  const copyToClipboard = async (text: string) => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getOrCreateStudent = async (userData: any) => {
    try {
      // First try to get existing student
      let { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', userData.email)
        .single();

      if (error && error.code === 'PGRST116') {
        // Student doesn't exist, create new one
        const { data: newStudent, error: createError } = await supabase
          .from('students')
          .insert([{
            email: userData.email,
            first_name: bookingData?.studentName.split(' ')[0] || '',
            last_name: bookingData?.studentName.split(' ').slice(1).join(' ') || '',
            phone: bookingData?.studentPhone || '',
            status: 'active'
          }])
          .select()
          .single();

        if (createError) throw createError;
        return newStudent;
      }

      if (error) throw error;
      return student;
    } catch (error) {
      console.error('Error with student:', error);
      return null;
    }
  };

  // Create payment record
  const createPayment = async (studentId: string) => {
    if (!bookingData || !teacher) return null;

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          student_id: studentId,
          teacher_id: teacher.id,
          class_date: new Date().toISOString().split('T')[0], // Today's date as placeholder
          class_time: bookingData.selectedHours[0] || '09:00', // First selected time as placeholder
          amount: bookingData.totalPrice,
          payment_method: paymentForm.paymentMethod,
          transaction_id: paymentForm.transactionId,
          notes: paymentForm.notes,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('Debug - currentUser:', currentUser);
      console.log('Debug - bookingData:', bookingData);
      
      if (!currentUser || !bookingData) {
        console.log('Debug - currentUser is null:', !currentUser);
        console.log('Debug - bookingData is null:', !bookingData);
        alert('خطا در اطلاعات کاربر');
        return;
      }

      // Get or create student
      const student = await getOrCreateStudent(currentUser);
      if (!student) {
        alert('خطا در ایجاد پروفایل دانش‌آموز');
        return;
      }

      // Create payment
      const payment = await createPayment(student.id);
      if (!payment) {
        alert('خطا در ثبت پرداخت');
        return;
      }

      // Success
      alert('رزرو و پرداخت با موفقیت ثبت شد!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting:', error);
      alert('خطا در ثبت رزرو');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await Promise.all([fetchTeacher(), getCurrentUser()]);
      
      // Get booking data from URL params
      const bookingDataStr = searchParams.get('booking');
      console.log('Debug - bookingDataStr from URL:', bookingDataStr);
      
      if (bookingDataStr) {
        try {
          const data = JSON.parse(decodeURIComponent(bookingDataStr));
          console.log('Debug - parsed booking data:', data);
          setBookingData(data);
        } catch (error) {
          console.error('Error parsing booking data:', error);
          alert('خطا در دریافت اطلاعات رزرو');
        }
      } else {
        console.log('No booking data found in URL');
        alert('اطلاعات رزرو یافت نشد');
      }
      
      setLoading(false);
    };

    initializePage();
  }, [params.id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">اطلاعات رزرو در حال دریافت است...</p>
        </div>
      </div>
    );
  }

  if (!teacher || !bookingData || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">اطلاعات ناقص</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {!currentUser ? 'لطفاً ابتدا وارد حساب کاربری خود شوید' : 
               !teacher ? 'اطلاعات معلم یافت نشد' : 
               'اطلاعات رزرو یافت نشد'}
            </p>
            <Button 
              onClick={() => {
                if (!currentUser) {
                  router.push('/login');
                } else {
                  router.push(`/teachers/${params.id}/book`);
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {!currentUser ? 'ورود به حساب کاربری' : 'بازگشت به صفحه رزرو'}
            </Button>
          </div>
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
          <Button
            variant="ghost"
            onClick={() => router.push(`/teachers/${params.id}/book`)}
            className="flex items-center gap-2 mb-4 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به صفحه رزرو
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              تایید نهایی رزرو
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              اطلاعات رزرو خود را بررسی کرده و پرداخت را تکمیل کنید
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  خلاصه رزرو
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Teacher Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Avatar className="w-16 h-16 ring-2 ring-blue-100 dark:ring-blue-900">
                    <AvatarImage src={teacher.avatar || ''} alt={`${teacher.first_name} ${teacher.last_name}`} />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {teacher.first_name[0]}{teacher.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {teacher.first_name} {teacher.last_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>4.8</span>
                      <span>•</span>
                      <span>{teacher.experience_years || 0} سال تجربه</span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">روزهای انتخاب شده</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {bookingData.selectedDays.join('، ')}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ساعات انتخاب شده</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {bookingData.selectedHours.join('، ')}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {bookingData.sessionType === 'online' ? (
                        <Monitor className="w-4 h-4 text-green-500" />
                      ) : (
                        <Home className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع کلاس</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {bookingData.sessionType === 'online' ? 'آنلاین' : bookingData.sessionType === 'offline' ? 'حضوری' : 'ترکیبی'}
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">مدت جلسه</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {bookingData.duration} دقیقه
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">اطلاعات دانش‌آموز</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{bookingData.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{bookingData.studentPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{bookingData.studentEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {bookingData.totalPrice.toLocaleString()} تومان
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      هزینه کل جلسه
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  تکمیل پرداخت
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white">روش پرداخت</Label>
                    <div className="grid grid-cols-1 gap-4">
                      <div
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentForm.paymentMethod === 'card_to_card'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: 'card_to_card' })}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Banknote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">کارت به کارت</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">انتقال مستقیم بین کارت‌ها</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                                     {/* Bank Info */}
                   <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                     <h4 className="font-semibold text-gray-900 dark:text-white mb-3">اطلاعات حساب بانکی</h4>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between items-center">
                         <span className="text-gray-600 dark:text-gray-400">شماره کارت:</span>
                         <div className="flex items-center gap-2">
                           <span className="font-mono text-gray-900 dark:text-white">۶۰۳۷۹۹۱۶۳۰۶۳۶۱۱۰</span>
                           {isClient && (
                             <Button
                               type="button"
                               variant="ghost"
                               size="sm"
                               onClick={() => copyToClipboard('۶۰۳۷۹۹۱۶۳۰۶۳۶۱۱۰')}
                               className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                             >
                               {copied ? (
                                 <CheckCircle className="h-3 w-3 text-green-600" />
                               ) : (
                                 <Copy className="h-3 w-3 text-blue-600" />
                               )}
                             </Button>
                           )}
                         </div>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600 dark:text-gray-400">به نام:</span>
                         <span className="text-gray-900 dark:text-white">علی علیزاده</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600 dark:text-gray-400">بانک:</span>
                         <span className="text-gray-900 dark:text-white">ملی</span>
                       </div>
                     </div>
                     {isClient && copied && (
                       <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300 text-center">
                         شماره کارت کپی شد! ✅
                       </div>
                     )}
                   </div>

                  {/* Transaction ID */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      شماره تراکنش (اختیاری)
                    </Label>
                    <Input
                      value={paymentForm.transactionId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                      placeholder="شماره تراکنش خود را وارد کنید"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      توضیحات (اختیاری)
                    </Label>
                    <Textarea
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      placeholder="توضیحات اضافی..."
                      rows={3}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  {/* Important Notes */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-semibold mb-2">نکات مهم:</p>
                        <ul className="space-y-1">
                          <li>• پس از پرداخت، معلم با شما تماس خواهد گرفت</li>
                          <li>• لینک جلسه آنلاین 30 دقیقه قبل از شروع ارسال می‌شود</li>
                          <li>• امکان لغو تا 24 ساعت قبل از جلسه وجود دارد</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        در حال ثبت...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        تایید و ثبت رزرو
                      </>
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