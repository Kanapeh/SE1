'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  available: boolean;
}

interface BookingForm {
  selectedDays: string[];
  selectedHours: string[];
  sessionType: string;
  duration: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  notes: string;
}

const AVAILABLE_DAYS = [
  { value: 'saturday', label: 'شنبه' },
  { value: 'sunday', label: 'یکشنبه' },
  { value: 'monday', label: 'دوشنبه' },
  { value: 'tuesday', label: 'سه‌شنبه' },
  { value: 'wednesday', label: 'چهارشنبه' },
  { value: 'thursday', label: 'پنج‌شنبه' },
  { value: 'friday', label: 'جمعه' }
];

const AVAILABLE_HOURS = [
  { value: 'morning', label: 'صبح (8-12)' },
  { value: 'afternoon', label: 'ظهر (12-16)' },
  { value: 'evening', label: 'عصر (16-20)' },
  { value: 'night', label: 'شب (20-24)' }
];

const SESSION_TYPES = [
  { value: 'online', label: 'آنلاین', icon: Monitor },
  { value: 'offline', label: 'حضوری', icon: Home },
  { value: 'hybrid', label: 'ترکیبی', icon: Copy }
];

const DURATION_OPTIONS = [
  { value: '60', label: '60 دقیقه' },
  { value: '90', label: '90 دقیقه' },
  { value: '120', label: '120 دقیقه' }
];

function BookSessionContent() {
  const params = useParams();
  const router = useRouter();
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    selectedDays: [],
    selectedHours: [],
    sessionType: 'online',
    duration: '60',
    studentName: '',
    studentPhone: '',
    studentEmail: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchTeacher();
    getCurrentUser();
  }, []);

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

  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);
      
      // Pre-fill email if available
      if (user.email) {
        setBookingForm(prev => ({ ...prev, studentEmail: user.email || '' }));
      }
    } catch (error) {
      console.error('Error getting user:', error);
      router.push('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate number of sessions
      const numberOfSessions = bookingForm.selectedDays.length * bookingForm.selectedHours.length;
      
      // Prepare booking data
      const bookingData = {
        teacher_id: params.id,
        teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : '',
        teacher_avatar: teacher?.avatar || '',
        teacher_hourly_rate: teacher?.hourly_rate || 0,
        selectedDays: bookingForm.selectedDays,
        selectedHours: bookingForm.selectedHours,
        sessionType: bookingForm.sessionType,
        duration: bookingForm.duration,
        studentName: bookingForm.studentName,
        studentPhone: bookingForm.studentPhone,
        studentEmail: bookingForm.studentEmail,
        notes: bookingForm.notes,
        totalPrice: calculateTotalPrice(),
        numberOfSessions: numberOfSessions
      };

      // Store booking data in sessionStorage (more secure than localStorage)
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      
      // Navigate to payment page
      router.push('/payment');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error preparing booking:', error);
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!teacher || !bookingForm.duration || !bookingForm.selectedDays.length || !bookingForm.selectedHours.length) return 0;
    
    const duration = parseInt(bookingForm.duration);
    const pricePerHour = teacher.hourly_rate || 0;
    const hoursPerSession = duration / 60;
    const numberOfSessions = bookingForm.selectedDays.length * bookingForm.selectedHours.length;
    
    return Math.round(pricePerHour * hoursPerSession * numberOfSessions);
  };

  const handleDayToggle = (day: string) => {
    setBookingForm(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const handleHourToggle = (hour: string) => {
    setBookingForm(prev => ({
      ...prev,
      selectedHours: prev.selectedHours.includes(hour)
        ? prev.selectedHours.filter(h => h !== hour)
        : [...prev.selectedHours, hour]
    }));
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    بازگشت
                  </Button>
                  <div>
                    <CardTitle className="text-2xl">رزرو جلسه آموزشی</CardTitle>
                    <p className="text-gray-600 mt-1">
                      با {teacher.first_name} {teacher.last_name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Teacher Info */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={teacher.avatar || ''} />
                        <AvatarFallback>
                          {teacher.first_name[0]}{teacher.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {teacher.first_name} {teacher.last_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>4.8</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{teacher.experience_years} سال تجربه</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{teacher.location}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            {teacher.hourly_rate?.toLocaleString()} تومان/ساعت
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">جزئیات جلسه</h3>
                    
                    {/* Days Selection */}
                    <div>
                      <Label className="text-base font-medium">روزهای انتخابی</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {AVAILABLE_DAYS.map((day) => (
                          <Button
                            key={day.value}
                            type="button"
                            variant={bookingForm.selectedDays.includes(day.value) ? "default" : "outline"}
                            onClick={() => handleDayToggle(day.value)}
                            className="justify-start"
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Hours Selection */}
                    <div>
                      <Label className="text-base font-medium">ساعات انتخابی</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {AVAILABLE_HOURS.map((hour) => (
                          <Button
                            key={hour.value}
                            type="button"
                            variant={bookingForm.selectedHours.includes(hour.value) ? "default" : "outline"}
                            onClick={() => handleHourToggle(hour.value)}
                            className="justify-start"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {hour.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Session Type */}
                    <div>
                      <Label className="text-base font-medium">نوع جلسه</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                        {SESSION_TYPES.map((type) => {
                          const Icon = type.icon;
                          return (
                            <Button
                              key={type.value}
                              type="button"
                              variant={bookingForm.sessionType === type.value ? "default" : "outline"}
                              onClick={() => setBookingForm(prev => ({ ...prev, sessionType: type.value }))}
                              className="justify-start"
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {type.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <Label htmlFor="duration" className="text-base font-medium">مدت جلسه</Label>
                      <Select
                        value={bookingForm.duration}
                        onValueChange={(value) => setBookingForm(prev => ({ ...prev, duration: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="انتخاب مدت جلسه" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">اطلاعات دانش‌آموز</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="studentName">نام و نام خانوادگی</Label>
                        <Input
                          id="studentName"
                          value={bookingForm.studentName}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, studentName: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="studentPhone">شماره تماس</Label>
                        <Input
                          id="studentPhone"
                          value={bookingForm.studentPhone}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, studentPhone: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="studentEmail">ایمیل</Label>
                      <Input
                        id="studentEmail"
                        type="email"
                        value={bookingForm.studentEmail}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, studentEmail: e.target.value }))}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">توضیحات اضافی (اختیاری)</Label>
                      <Textarea
                        id="notes"
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">خلاصه قیمت</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>تعداد جلسات:</span>
                        <span>{bookingForm.selectedDays.length * bookingForm.selectedHours.length} جلسه</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مدت هر جلسه:</span>
                        <span>{bookingForm.duration} دقیقه</span>
                      </div>
                      <div className="flex justify-between">
                        <span>نوع جلسه:</span>
                        <span>
                          {SESSION_TYPES.find(t => t.value === bookingForm.sessionType)?.label}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>مجموع:</span>
                          <span>{calculateTotalPrice().toLocaleString()} تومان</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !bookingForm.selectedDays.length || !bookingForm.selectedHours.length}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
                  >
                    {isSubmitting ? 'در حال پردازش...' : 'ادامه به پرداخت'}
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

export default function BookSessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <BookSessionContent />
    </Suspense>
  );
}
