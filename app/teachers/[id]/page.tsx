"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Award,
  Languages,
  BookOpen,
  Users,
  CheckCircle
} from "lucide-react";

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

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - در آینده از API دریافت می‌شود
  const mockTeachers: Teacher[] = [
    {
      id: "1",
      name: "سارا احمدی",
      avatar: "/images/teacher1.jpg",
      specialty: "مکالمه انگلیسی",
      experience: 8,
      rating: 4.9,
      students: 156,
      languages: ["انگلیسی", "فارسی"],
      bio: "معلم با تجربه در زمینه آموزش مکالمه انگلیسی با روش‌های مدرن و تعاملی. من بیش از 8 سال تجربه در آموزش زبان انگلیسی دارم و با استفاده از روش‌های نوین آموزشی، به دانش‌آموزان کمک می‌کنم تا مهارت‌های مکالمه خود را تقویت کنند.",
      hourlyRate: 250000,
      location: "تهران",
      available: true,
      certificates: ["CELTA", "TESOL", "IELTS Trainer"],
      phone: "09123456789",
      email: "sara.ahmadi@example.com",
      education: "کارشناسی ارشد آموزش زبان انگلیسی - دانشگاه تهران",
      teachingMethods: [
        "مکالمه تعاملی",
        "تمرین‌های عملی",
        "استفاده از فیلم و موسیقی",
        "تمرین‌های گروهی"
      ],
      achievements: [
        "برنده جایزه بهترین معلم سال 1402",
        "نمره 8.5 در آیلتس",
        "تدریس به بیش از 500 دانش‌آموز"
      ],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"],
      availableHours: ["09:00-12:00", "14:00-17:00", "18:00-21:00"]
    },
    {
      id: "2",
      name: "علی محمدی",
      avatar: "/images/teacher2.jpg",
      specialty: "گرامر پیشرفته",
      experience: 12,
      rating: 4.8,
      students: 203,
      languages: ["انگلیسی", "فارسی", "عربی"],
      bio: "متخصص در آموزش گرامر پیشرفته و آمادگی برای آزمون‌های بین‌المللی. با بیش از 12 سال تجربه در زمینه آموزش زبان انگلیسی، به دانش‌آموزان کمک می‌کنم تا پایه‌های گرامری قوی‌ای داشته باشند.",
      hourlyRate: 300000,
      location: "اصفهان",
      available: true,
      certificates: ["DELTA", "Cambridge Trainer", "TOEFL Expert"],
      phone: "09187654321",
      email: "ali.mohammadi@example.com",
      education: "دکترای زبان‌شناسی کاربردی - دانشگاه اصفهان",
      teachingMethods: [
        "آموزش گرامر تعاملی",
        "تمرین‌های نوشتاری",
        "آزمون‌های منظم",
        "تحلیل خطاها"
      ],
      achievements: [
        "مدرس برتر دانشگاه اصفهان",
        "نویسنده کتاب‌های آموزشی",
        "مشاور آزمون‌های بین‌المللی"
      ],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه"],
      availableHours: ["08:00-11:00", "15:00-18:00", "19:00-22:00"]
    },
    {
      id: "3",
      name: "مریم کریمی",
      avatar: "/images/teacher3.jpg",
      specialty: "آیلتس",
      experience: 6,
      rating: 4.7,
      students: 89,
      languages: ["انگلیسی", "فارسی"],
      bio: "مدرس تخصصی آیلتس با نمره 8.5 و تجربه موفق در آماده‌سازی دانش‌آموزان. من با استفاده از روش‌های اثبات شده، به دانش‌آموزان کمک می‌کنم تا به نمره دلخواه خود در آیلتس برسند.",
      hourlyRate: 280000,
      location: "شیراز",
      available: false,
      certificates: ["IELTS 8.5", "TESOL", "Academic Writing"],
      phone: "09351234567",
      email: "maryam.karimi@example.com",
      education: "کارشناسی ارشد آموزش زبان انگلیسی - دانشگاه شیراز",
      teachingMethods: [
        "آزمون‌های شبیه‌سازی",
        "تمرین‌های چهار مهارت",
        "استراتژی‌های آزمون",
        "تمرین‌های زمان‌بندی"
      ],
      achievements: [
        "نمره 8.5 در آیلتس",
        "مدرس رسمی آیلتس",
        "نویسنده مقالات آموزشی"
      ],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه"],
      availableHours: ["10:00-13:00", "16:00-19:00"]
    },
    {
      id: "4",
      name: "حسین رضایی",
      avatar: "/images/teacher4.jpg",
      specialty: "مکالمه تجاری",
      experience: 10,
      rating: 4.9,
      students: 134,
      languages: ["انگلیسی", "فارسی", "آلمانی"],
      bio: "متخصص در آموزش انگلیسی تجاری و آمادگی برای مصاحبه‌های کاری. با تجربه کار در شرکت‌های بین‌المللی، به دانش‌آموزان کمک می‌کنم تا مهارت‌های ارتباطی حرفه‌ای کسب کنند.",
      hourlyRate: 320000,
      location: "مشهد",
      available: true,
      certificates: ["Business English", "MBA", "Corporate Trainer"],
      phone: "09123456789",
      email: "hossein.rezaei@example.com",
      education: "کارشناسی ارشد مدیریت بازرگانی - دانشگاه مشهد",
      teachingMethods: [
        "مکالمه تجاری",
        "آمادگی مصاحبه",
        "ارائه‌های حرفه‌ای",
        "مذاکرات تجاری"
      ],
      achievements: [
        "مدیر ارشد شرکت بین‌المللی",
        "مشاور کسب‌وکار",
        "مدرس دانشگاه"
      ],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"],
      availableHours: ["09:00-12:00", "14:00-17:00", "18:00-21:00"]
    },
    {
      id: "5",
      name: "فاطمه نوری",
      avatar: "/images/teacher5.jpg",
      specialty: "تافل",
      experience: 7,
      rating: 4.6,
      students: 67,
      languages: ["انگلیسی", "فارسی"],
      bio: "مدرس تخصصی تافل با تجربه در آماده‌سازی دانش‌آموزان برای تحصیل در خارج. من با استفاده از منابع معتبر و روش‌های نوین، به دانش‌آموزان کمک می‌کنم تا در آزمون تافل موفق شوند.",
      hourlyRate: 260000,
      location: "تبریز",
      available: true,
      certificates: ["TOEFL 110+", "TESOL", "Academic English"],
      phone: "09387654321",
      email: "fateme.nouri@example.com",
      education: "کارشناسی ارشد آموزش زبان انگلیسی - دانشگاه تبریز",
      teachingMethods: [
        "آزمون‌های تافل",
        "تمرین‌های آکادمیک",
        "مهارت‌های مطالعه",
        "آمادگی دانشگاه"
      ],
      achievements: [
        "نمره 110+ در تافل",
        "مشاور تحصیلی",
        "مدرس دانشگاه"
      ],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه"],
      availableHours: ["08:00-11:00", "14:00-17:00", "18:00-21:00"]
    },
    {
      id: "6",
      name: "امیر حسینی",
      avatar: "/images/teacher6.jpg",
      specialty: "انگلیسی کودکان",
      experience: 5,
      rating: 4.8,
      students: 98,
      languages: ["انگلیسی", "فارسی"],
      bio: "متخصص در آموزش انگلیسی به کودکان با روش‌های سرگرم‌کننده و موثر. من با استفاده از بازی‌ها، آهنگ‌ها و فعالیت‌های تعاملی، به کودکان کمک می‌کنم تا زبان انگلیسی را با لذت یاد بگیرند.",
      hourlyRate: 200000,
      location: "یزد",
      available: true,
      certificates: ["Young Learners", "TESOL", "Child Psychology"],
      phone: "09123456789",
      email: "amir.hosseini@example.com",
      education: "کارشناسی روانشناسی کودک - دانشگاه یزد",
      teachingMethods: [
        "آموزش از طریق بازی",
        "آهنگ و شعر",
        "فعالیت‌های هنری",
        "داستان‌گویی"
      ],
      achievements: [
        "متخصص روانشناسی کودک",
        "نویسنده کتاب‌های کودکان",
        "مدرس مهدکودک"
      ],
      availableDays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه"],
      availableHours: ["09:00-12:00", "15:00-18:00"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundTeacher = mockTeachers.find(t => t.id === params.id);
      setTeacher(foundTeacher || null);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleBookSession = () => {
    window.location.href = `/teachers/${params.id}/book`;
  };

  const handleContact = () => {
    window.location.href = `/teachers/${params.id}/chat`;
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
            onClick={() => router.push("/teachers")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به لیست معلمان
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teacher Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback className="text-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {teacher.available && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                  )}
                </div>

                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teacher.name}
                </CardTitle>

                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-medium">{teacher.rating}</span>
                  <span className="text-sm text-gray-500">({teacher.students} دانش‌آموز)</span>
                </div>

                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {teacher.specialty}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">اطلاعات تماس</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{teacher.location}</span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">زبان‌ها</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.languages.map((lang, idx) => (
                      <Badge key={idx} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <span className="text-2xl font-bold text-primary">
                    {teacher.hourlyRate.toLocaleString()} تومان
                  </span>
                  <span className="text-sm text-gray-500 block">در ساعت</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleBookSession}
                    disabled={!teacher.available}
                    className="w-full"
                    size="lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    رزرو جلسه
                  </Button>
                  <Button
                    onClick={handleContact}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    تماس مستقیم
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teacher Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  درباره معلم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {teacher.bio}
                </p>
              </CardContent>
            </Card>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    تحصیلات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {teacher.education}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    تجربه
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {teacher.experience} سال تجربه تدریس
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Teaching Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  روش‌های تدریس
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teacher.teachingMethods.map((method, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{method}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  گواهینامه‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {teacher.certificates.map((cert, idx) => (
                    <Badge key={idx} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  دستاوردها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacher.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  زمان‌های در دسترس
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">روزهای هفته</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.availableDays.map((day, idx) => (
                        <Badge key={idx} variant="outline">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">ساعت‌های تدریس</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.availableHours.map((hour, idx) => (
                        <Badge key={idx} variant="outline">
                          {hour}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 