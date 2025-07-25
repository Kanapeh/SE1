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
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fa } from "date-fns/locale";

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: number;
  rating: number;
  students: number;
  languages: string[];
  bio: string;
  hourlyRate: number;
  location: string;
  available: boolean;
  certificates: string[];
  phone: string;
  email: string;
  education: string;
  teachingMethods: string[];
  achievements: string[];
  availableDays: string[];
  availableHours: string[];
}

interface BookingForm {
  date: Date | undefined;
  time: string;
  duration: string;
  sessionType: string;
  notes: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
}

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
    notes: "",
    studentName: "",
    studentPhone: "",
    studentEmail: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - در آینده از API دریافت می‌شود
  const mockTeachers: Teacher[] = [
    {
      id: "1",
      name: "سپنتا علیزاده",
      avatar: "/images/teacher1.jpg",
      specialty: "مکالمه انگلیسی",
      experience: 8,
      rating: 4.9,
      students: 156,
      languages: ["انگلیسی", "فارسی"],
      bio: "معلم با تجربه در زمینه آموزش مکالمه انگلیسی با روش‌های مدرن و تعاملی.",
      hourlyRate: 250000,
      location: "تهران",
      available: true,
      certificates: ["CELTA", "TESOL", "IELTS Trainer"],
      phone: "09123456789",
      email: "sara.ahmadi@example.com",
      education: "کارشناسی ارشد آموزش زبان انگلیسی - دانشگاه تهران",
      teachingMethods: ["مکالمه تعاملی", "تمرین‌های عملی", "استفاده از فیلم و موسیقی"],
      achievements: ["برنده جایزه بهترین معلم سال 1402", "نمره 8.5 در آیلتس"],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"],
      availableHours: ["09:00-12:00", "14:00-17:00", "18:00-21:00"]
    },
    {
      id: "2",
      name: "پارمیدا معصومی",
      avatar: "/images/teacher2.jpg",
      specialty: "گرامر پیشرفته",
      experience: 12,
      rating: 4.8,
      students: 203,
      languages: ["انگلیسی", "فارسی", "عربی"],
      bio: "متخصص در آموزش گرامر پیشرفته و آمادگی برای آزمون‌های بین‌المللی.",
      hourlyRate: 300000,
      location: "اصفهان",
      available: true,
      certificates: ["DELTA", "Cambridge Trainer", "TOEFL Expert"],
      phone: "09187654321",
      email: "ali.mohammadi@example.com",
      education: "دکترای زبان‌شناسی کاربردی - دانشگاه اصفهان",
      teachingMethods: ["آموزش گرامر تعاملی", "تمرین‌های نوشتاری", "آزمون‌های منظم"],
      achievements: ["مدرس برتر دانشگاه اصفهان", "نویسنده کتاب‌های آموزشی"],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه"],
      availableHours: ["08:00-11:00", "15:00-18:00", "19:00-22:00"]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      const foundTeacher = mockTeachers.find(t => t.id === params.id);
      setTeacher(foundTeacher || null);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert(`رزرو جلسه با ${teacher?.name} با موفقیت انجام شد!`);
      router.push(`/teachers/${params.id}`);
      setIsSubmitting(false);
    }, 2000);
  };

  const calculateTotalPrice = () => {
    if (!teacher || !bookingForm.duration) return 0;
    const duration = parseInt(bookingForm.duration);
    return (teacher.hourlyRate * duration) / 60;
  };

  const getAvailableTimes = () => {
    if (!teacher) return [];
    return teacher.availableHours;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              معلم یافت نشد
            </h1>
            <Button onClick={() => router.push("/teachers")}>
              بازگشت به لیست معلمان
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(`/teachers/${params.id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به پروفایل معلم
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teacher Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {teacher.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{teacher.rating}</span>
                  <span className="text-sm text-gray-500">({teacher.students} دانش‌آموز)</span>
                </div>
                <Badge variant="secondary">{teacher.specialty}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{teacher.experience} سال تجربه</span>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <span className="text-lg font-bold text-primary">
                    {teacher.hourlyRate.toLocaleString()} تومان
                  </span>
                  <span className="text-sm text-gray-500 block">در ساعت</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  رزرو جلسه با {teacher.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>انتخاب تاریخ</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-right font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingForm.date ? (
                            format(bookingForm.date, "PPP", { locale: fa })
                          ) : (
                            "انتخاب تاریخ"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingForm.date}
                          onSelect={(date) => setBookingForm({ ...bookingForm, date })}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label>انتخاب ساعت</Label>
                    <Select value={bookingForm.time} onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب ساعت" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTimes().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Selection */}
                  <div className="space-y-2">
                    <Label>مدت جلسه</Label>
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

                  {/* Session Type */}
                  <div className="space-y-2">
                    <Label>نوع جلسه</Label>
                    <Select value={bookingForm.sessionType} onValueChange={(value) => setBookingForm({ ...bookingForm, sessionType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">آنلاین (Zoom/Skype)</SelectItem>
                        <SelectItem value="in-person">حضوری</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">اطلاعات دانش‌آموز</h3>
                    
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
                  <div className="space-y-2">
                    <Label>توضیحات (اختیاری)</Label>
                    <Textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="موضوعات مورد نظر برای تدریس یا توضیحات خاص..."
                      rows={4}
                    />
                  </div>

                  {/* Price Summary */}
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">هزینه جلسه:</span>
                        <span className="text-2xl font-bold text-primary">
                          {calculateTotalPrice().toLocaleString()} تومان
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        مدت: {bookingForm.duration} دقیقه
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || !bookingForm.date || !bookingForm.time || !bookingForm.studentName || !bookingForm.studentPhone || !bookingForm.studentEmail}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        در حال رزرو...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        رزرو جلسه
                      </>
                    )}
                  </Button>

                  {/* Info */}
                  <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-semibold mb-1">نکات مهم:</p>
                      <ul className="space-y-1">
                        <li>• پس از رزرو، لینک جلسه آنلاین برای شما ارسال می‌شود</li>
                        <li>• امکان لغو جلسه تا 24 ساعت قبل از شروع وجود دارد</li>
                        <li>• در صورت عدم حضور، هزینه جلسه قابل بازگشت نیست</li>
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