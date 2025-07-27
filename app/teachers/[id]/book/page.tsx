"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  Monitor,
  Home
} from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  birthdate: string | null;
  national_id: string | null;
  address: string | null;
  languages: string[];
  levels: string[] | null;
  class_types: string[];
  available_days: string[] | null;
  available_hours: string[] | null;
  max_students_per_class: number | null;
  bio: string | null;
  experience_years: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  certificates: string[] | null;
  teaching_methods: string[] | null;
  achievements: string[] | null;
  avatar: string | null;
  hourly_rate: number | null;
  location: string | null;
  available: boolean;
  education: string | null;
  preferred_time: string[] | null;
}

interface BookingForm {
  date: Date | undefined;
  time: string;
  duration: string;
  sessionType: string;
  selectedDays: string[];
  selectedHours: string[];
  notes: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
}

const weekDays = [
  { value: "شنبه", label: "شنبه" },
  { value: "یکشنبه", label: "یکشنبه" },
  { value: "دوشنبه", label: "دوشنبه" },
  { value: "سه‌شنبه", label: "سه‌شنبه" },
  { value: "چهارشنبه", label: "چهارشنبه" },
  { value: "پنج‌شنبه", label: "پنج‌شنبه" },
  { value: "جمعه", label: "جمعه" }
];

const timeSlots = [
  "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
  "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"
];

export default function BookSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    date: undefined,
    time: "",
    duration: "60",
    sessionType: "online",
    selectedDays: [],
    selectedHours: [],
    notes: "",
    studentName: "",
    studentPhone: "",
    studentEmail: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch teacher from Supabase
  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching teacher:', error);
        return;
      }

      setTeacher(data);
    } catch (error) {
      console.error('Error in fetchTeacher:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTeacher();
    }
  }, [params.id]);

  // Set default session type when teacher data is loaded
  useEffect(() => {
    if (teacher && teacher.class_types && teacher.class_types.length > 0) {
      setBookingForm(prev => ({
        ...prev,
        sessionType: teacher.class_types[0] // Set first available class type as default
      }));
    }
  }, [teacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData = {
        teacher_id: params.id,
        student_id: '', // Will be set in confirm page
        selectedDays: bookingForm.selectedDays,
        selectedHours: bookingForm.selectedHours,
        sessionType: bookingForm.sessionType,
        duration: bookingForm.duration,
        studentName: bookingForm.studentName,
        studentPhone: bookingForm.studentPhone,
        studentEmail: bookingForm.studentEmail,
        notes: bookingForm.notes,
        totalPrice: calculateTotalPrice()
      };

      // Navigate to confirmation page with booking data
      const bookingDataStr = encodeURIComponent(JSON.stringify(bookingData));
      router.push(`/teachers/${params.id}/book/confirm?booking=${bookingDataStr}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error preparing booking:', error);
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!teacher || !bookingForm.duration) return 0;
    const duration = parseInt(bookingForm.duration);
    return (teacher.hourly_rate || 0) * (duration / 60);
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

  const isFormValid = () => {
    // Check if all required fields are filled
    const hasSelectedDays = bookingForm.selectedDays.length > 0;
    const hasSelectedHours = bookingForm.selectedHours.length > 0;
    const hasSessionType = bookingForm.sessionType && bookingForm.sessionType.trim() !== '';
    const hasStudentName = bookingForm.studentName && bookingForm.studentName.trim() !== '';
    const hasStudentPhone = bookingForm.studentPhone && bookingForm.studentPhone.trim() !== '';
    const hasStudentEmail = bookingForm.studentEmail && bookingForm.studentEmail.trim() !== '';
    
    const isValid = hasSelectedDays && hasSelectedHours && hasSessionType && hasStudentName && hasStudentPhone && hasStudentEmail;
    
    // Debug: Log form validation details
    console.log('Form validation:', {
      selectedDays: bookingForm.selectedDays.length,
      selectedHours: bookingForm.selectedHours.length,
      sessionType: bookingForm.sessionType,
      studentName: bookingForm.studentName,
      studentPhone: bookingForm.studentPhone,
      studentEmail: bookingForm.studentEmail,
      hasSelectedDays,
      hasSelectedHours,
      hasSessionType,
      hasStudentName,
      hasStudentPhone,
      hasStudentEmail,
      isValid
    });
    
    return isValid;
  };

  // Helper function to check if a time slot is available
  const isTimeAvailable = (time: string) => {
    if (!teacher || !teacher.available_hours || teacher.available_hours.length === 0) {
      return true; // If no specific hours are set, allow all
    }
    
    // Check if the time matches any available hour pattern
    return teacher.available_hours.some(availableHour => {
      // Handle different time formats
      if (availableHour.includes('-')) {
        // Format like "09:00-12:00"
        const [start, end] = availableHour.split('-');
        const timeStart = time.split('-')[0];
        return timeStart >= start && timeStart < end;
      } else {
        // Exact match
        return availableHour === time;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">اطلاعات معلم در حال دریافت است...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">معلم یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">معلم مورد نظر شما وجود ندارد یا در دسترس نیست</p>
            <Button 
              onClick={() => router.push("/teachers")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              بازگشت به لیست معلمان
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
            onClick={() => router.push(`/teachers/${params.id}`)}
            className="flex items-center gap-2 mb-4 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به پروفایل معلم
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              رزرو جلسه آموزشی
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              زمان و نوع کلاس مورد نظر خود را انتخاب کنید
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teacher Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                              <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-28 h-28 mx-auto ring-4 ring-blue-100 dark:ring-blue-900">
                      <AvatarImage src={teacher.avatar || ''} alt={`${teacher.first_name} ${teacher.last_name}`} />
                      <AvatarFallback className="text-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {teacher.first_name[0]}{teacher.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {teacher.available && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {teacher.first_name} {teacher.last_name}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">4.8</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">دانش‌آموز</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-1">
                    {teacher.levels && teacher.levels.length > 0 ? teacher.levels[0] : 'معلم زبان'}
                  </Badge>
                </CardHeader>
                              <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">محل تدریس</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{teacher.location || 'نامشخص'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">سال‌های تجربه</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{teacher.experience_years || 0} سال</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {teacher.hourly_rate ? teacher.hourly_rate.toLocaleString() : 'نامشخص'} تومان
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">در ساعت</div>
                    </div>
                  </div>
                </CardContent>
            </Card>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  رزرو جلسه با {teacher.first_name} {teacher.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Class Type Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">نوع کلاس</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teacher.class_types.map((type) => (
                        <div
                          key={type}
                          className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            bookingForm.sessionType === type
                              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 bg-white dark:bg-gray-800'
                          }`}
                          onClick={() => setBookingForm({ ...bookingForm, sessionType: type })}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                              type === 'online' 
                                ? 'bg-blue-100 dark:bg-blue-900/30' 
                                : type === 'offline' 
                                ? 'bg-green-100 dark:bg-green-900/30' 
                                : 'bg-purple-100 dark:bg-purple-900/30'
                            }`}>
                              {type === 'online' ? (
                                <Monitor className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                              ) : type === 'offline' ? (
                                <Home className="w-8 h-8 text-green-600 dark:text-green-400" />
                              ) : (
                                <div className="flex gap-1">
                                  <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                  <Home className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-gray-900 dark:text-white">
                                {type === 'online' ? 'آنلاین' : type === 'offline' ? 'حضوری' : 'ترکیبی'}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {type === 'online' ? 'از طریق Zoom/Skype' : type === 'offline' ? 'در محل مشخص شده' : 'آنلاین یا حضوری'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Day Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">انتخاب روزهای هفته</Label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {weekDays.map((day) => (
                        <div key={day.value} className="flex items-center space-x-2">
                                                     <Checkbox
                             id={day.value}
                             checked={bookingForm.selectedDays.includes(day.value)}
                             onCheckedChange={() => handleDayToggle(day.value)}
                             disabled={teacher.available_days ? !teacher.available_days.includes(day.value) : false}
                           />
                          <Label
                            htmlFor={day.value}
                            className={`text-sm cursor-pointer ${
                              teacher.available_days && !teacher.available_days.includes(day.value)
                                ? 'text-gray-400 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {teacher.available_days && teacher.available_days.length > 0 && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          <span className="font-medium">روزهای در دسترس معلم:</span> {teacher.available_days.join('، ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">انتخاب ساعات</Label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                                                     <Checkbox
                             id={time}
                             checked={bookingForm.selectedHours.includes(time)}
                             onCheckedChange={() => handleHourToggle(time)}
                             disabled={!isTimeAvailable(time)}
                           />
                          <Label
                            htmlFor={time}
                            className={`text-sm cursor-pointer ${
                              !isTimeAvailable(time) ? 'text-gray-400 cursor-not-allowed' : ''
                            }`}
                          >
                            {time}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {teacher.available_hours && teacher.available_hours.length > 0 && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          <span className="font-medium">ساعات در دسترس معلم:</span> {teacher.available_hours.join('، ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Duration Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">مدت جلسه</Label>
                    </div>
                    <Select value={bookingForm.duration} onValueChange={(value) => setBookingForm({ ...bookingForm, duration: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 دقیقه</SelectItem>
                        <SelectItem value="60">1 ساعت</SelectItem>
                        <SelectItem value="90">1.5 ساعت</SelectItem>
                        <SelectItem value="120">2 ساعت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Student Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">اطلاعات دانش‌آموز</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>نام و نام خانوادگی</Label>
                        <Input
                          value={bookingForm.studentName}
                          onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                          placeholder="نام خود را وارد کنید"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>شماره تلفن</Label>
                        <Input
                          value={bookingForm.studentPhone}
                          onChange={(e) => setBookingForm({ ...bookingForm, studentPhone: e.target.value })}
                          placeholder="09123456789"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>ایمیل</Label>
                      <Input
                        type="email"
                        value={bookingForm.studentEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentEmail: e.target.value })}
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">توضیحات (اختیاری)</Label>
                    </div>
                    <Textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="موضوعات مورد نظر برای تدریس یا توضیحات خاص..."
                      rows={4}
                    />
                  </div>

                  {/* Selected Options Summary */}
                  {(bookingForm.selectedDays.length > 0 || bookingForm.selectedHours.length > 0) && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white">خلاصه انتخاب‌های شما</h4>
                        </div>
                        <div className="space-y-3">
                          {bookingForm.selectedDays.length > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">روزهای انتخاب شده:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{bookingForm.selectedDays.join('، ')}</span>
                            </div>
                          )}
                          {bookingForm.selectedHours.length > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ساعات انتخاب شده:</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{bookingForm.selectedHours.join('، ')}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع کلاس:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {bookingForm.sessionType === 'online' ? 'آنلاین' : bookingForm.sessionType === 'offline' ? 'حضوری' : 'ترکیبی'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Price Summary */}
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {calculateTotalPrice().toLocaleString()} تومان
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          مدت: {bookingForm.duration} دقیقه
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          هزینه بر اساس نرخ ساعتی معلم محاسبه می‌شود
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Debug Panel - Remove this in production */}
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
                    <h4 className="font-semibold mb-2">وضعیت فرم (برای دیباگ):</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`${bookingForm.selectedDays.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        روزهای انتخاب شده: {bookingForm.selectedDays.length} {bookingForm.selectedDays.length > 0 ? '✅' : '❌'}
                      </div>
                      <div className={`${bookingForm.selectedHours.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ساعات انتخاب شده: {bookingForm.selectedHours.length} {bookingForm.selectedHours.length > 0 ? '✅' : '❌'}
                      </div>
                      <div className={`${bookingForm.sessionType && bookingForm.sessionType.trim() !== '' ? 'text-green-600' : 'text-red-600'}`}>
                        نوع کلاس: {bookingForm.sessionType || 'انتخاب نشده'} {bookingForm.sessionType && bookingForm.sessionType.trim() !== '' ? '✅' : '❌'}
                      </div>
                      <div className={`${bookingForm.studentName && bookingForm.studentName.trim() !== '' ? 'text-green-600' : 'text-red-600'}`}>
                        نام: {bookingForm.studentName || 'خالی'} {bookingForm.studentName && bookingForm.studentName.trim() !== '' ? '✅' : '❌'}
                      </div>
                      <div className={`${bookingForm.studentPhone && bookingForm.studentPhone.trim() !== '' ? 'text-green-600' : 'text-red-600'}`}>
                        تلفن: {bookingForm.studentPhone || 'خالی'} {bookingForm.studentPhone && bookingForm.studentPhone.trim() !== '' ? '✅' : '❌'}
                      </div>
                      <div className={`${bookingForm.studentEmail && bookingForm.studentEmail.trim() !== '' ? 'text-green-600' : 'text-red-600'}`}>
                        ایمیل: {bookingForm.studentEmail || 'خالی'} {bookingForm.studentEmail && bookingForm.studentEmail.trim() !== '' ? '✅' : '❌'}
                      </div>
                    </div>
                    <div className="mt-2 font-bold">
                      فرم معتبر: {isFormValid() ? '✅ بله' : '❌ خیر'}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    size="lg"
                    disabled={isSubmitting || !isFormValid()}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        در حال رزرو...
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        رزرو جلسه آموزشی
                      </>
                    )}
                  </Button>

                  {/* Info */}
                  <div className="flex items-start gap-3 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-bold text-lg mb-3">نکات مهم:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>پس از رزرو، لینک جلسه آنلاین برای شما ارسال می‌شود</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>امکان لغو جلسه تا 24 ساعت قبل از شروع وجود دارد</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>در صورت عدم حضور، هزینه جلسه قابل بازگشت نیست</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>معلم در زمان‌های انتخاب شده با شما تماس خواهد گرفت</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 