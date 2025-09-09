"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSmartOAuthRedirectUrl } from "@/lib/oauth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Award, 
  Clock, 
  Globe, 
  BookOpen,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Languages,
  Calendar,
  DollarSign,
  FileText,
  Video,
  Users,
  Info
} from "lucide-react";

interface TeacherProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  birthdate: string;
  national_id: string;
  address: string;
  languages: string[];
  levels: string[];
  class_types: string[];
  available_days: string[];
  available_hours: string[];
  max_students_per_class: number;
  bio: string;
  experience_years: number;
  hourly_rate: number;
  location: string;
  education: string;
  certificates: string[];
  teaching_methods: string[];
  achievements: string[];
  avatar: string;
  preferred_time: string[];
}

interface StudentProfile {
  id: string;
  email: string;
  first_name: string;           // نام
  last_name: string;            // نام خانوادگی
  phone: string;                // شماره تلفن
  age: number;                  // سن
  current_language_level: string;  // سطح زبان فعلی
  preferred_languages: string[];    // زبان‌های انتخابی (آلمانی و انگلیسی)
  learning_goals: string;       // اهداف یادگیری
  preferred_learning_style: string; // سبک یادگیری
}

const TEACHING_LANGUAGES = [
  { value: 'persian', label: 'فارسی', flag: '🇮🇷' },
  { value: 'english', label: 'انگلیسی', flag: '🇺🇸' },
  { value: 'arabic', label: 'عربی', flag: '🇸🇦' },
  { value: 'french', label: 'فرانسه', flag: '🇫🇷' },
  { value: 'german', label: 'آلمانی', flag: '🇩🇪' },
  { value: 'spanish', label: 'اسپانیایی', flag: '🇪🇸' },
  { value: 'italian', label: 'ایتالیایی', flag: '🇮🇹' },
  { value: 'russian', label: 'روسی', flag: '🇷🇺' },
  { value: 'chinese', label: 'چینی', flag: '🇨🇳' },
  { value: 'japanese', label: 'ژاپنی', flag: '🇯🇵' },
  { value: 'korean', label: 'کره‌ای', flag: '🇰🇷' },
  { value: 'turkish', label: 'ترکی', flag: '🇹🇷' }
];

const TEACHING_LEVELS = [
  { value: 'beginner', label: 'مبتدی' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'پیشرفته' },
  { value: 'academic', label: 'آکادمیک' },
  { value: 'ielts', label: 'آیلتس' },
  { value: 'toefl', label: 'تافل' },
  { value: 'conversation', label: 'مکالمه' },
  { value: 'grammar', label: 'گرامر' },
  { value: 'business', label: 'تجاری' },
  { value: 'children', label: 'کودکان' }
];

const CLASS_TYPES = [
  { value: 'online', label: 'آنلاین', icon: Video },
  { value: 'offline', label: 'حضوری', icon: Users },
  { value: 'hybrid', label: 'ترکیبی', icon: Globe }
];

const AVAILABLE_DAYS = [
  { value: 'monday', label: 'دوشنبه' },
  { value: 'tuesday', label: 'سه‌شنبه' },
  { value: 'wednesday', label: 'چهارشنبه' },
  { value: 'thursday', label: 'پنج‌شنبه' },
  { value: 'friday', label: 'جمعه' },
  { value: 'saturday', label: 'شنبه' },
  { value: 'sunday', label: 'یکشنبه' }
];

const AVAILABLE_HOURS = [
  { value: 'morning', label: 'صبح (8-12)' },
  { value: 'afternoon', label: 'ظهر (12-16)' },
  { value: 'evening', label: 'عصر (16-20)' },
  { value: 'night', label: 'شب (20-24)' }
];

const TEACHING_METHODS = [
  { value: 'communicative', label: 'روش ارتباطی' },
  { value: 'grammar_translation', label: 'ترجمه گرامری' },
  { value: 'direct_method', label: 'روش مستقیم' },
  { value: 'audio_lingual', label: 'شنیداری-گفتاری' },
  { value: 'task_based', label: 'مبتنی بر وظیفه' },
  { value: 'content_based', label: 'مبتنی بر محتوا' },
  { value: 'blended', label: 'ترکیبی' }
];

function CompleteProfileContent() {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Teacher form state
  const [teacherProfile, setTeacherProfile] = useState<Partial<TeacherProfile>>({
    languages: [],
    levels: [],
    class_types: [],
    available_days: [],
    available_hours: [],
    certificates: [],
    teaching_methods: [],
    achievements: [],
    preferred_time: [],
  });

  // Student form state
  const [studentProfile, setStudentProfile] = useState<Partial<StudentProfile>>({
    first_name: '',
    last_name: '',
    phone: '',
    age: 0,
    current_language_level: '',
    preferred_languages: [],
    learning_goals: '',
    preferred_learning_style: '',
  });

  useEffect(() => {
    if (!searchParams) return;
    
    const type = searchParams.get('type') || 'student';
    setUserType(type);
    
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.log('No authenticated user found, redirecting to login');
          const loginUrl = await getSmartOAuthRedirectUrl('login');
          window.location.href = loginUrl;
          return;
        }
        
        // Check if email is confirmed
        if (!user.email_confirmed_at) {
          console.log('Email not confirmed, redirecting to verify email');
          const verifyUrl = await getSmartOAuthRedirectUrl(`verify-email?email=${encodeURIComponent(user.email || '')}`);
          window.location.href = verifyUrl;
          return;
        }
        
        console.log('User authenticated and email confirmed:', user);
        setCurrentUser(user);
        
        // Set email and name from user data
        if (type === 'teacher') {
          setTeacherProfile(prev => ({ 
            ...prev, 
            email: user.email || '',
            first_name: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || '',
            last_name: user.user_metadata?.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' ') || ''
          }));
        } else {
          setStudentProfile(prev => ({ 
            ...prev, 
            email: user.email || '',
            first_name: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || '',
            last_name: user.user_metadata?.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' ') || ''
          }));
        }
      } catch (error) {
        console.error('Error getting user:', error);
        const loginUrl = await getSmartOAuthRedirectUrl('login');
        window.location.href = loginUrl;
      }
    };

    getCurrentUser();
  }, [searchParams, router]);

  const updateTeacherFormData = (field: keyof TeacherProfile, value: any) => {
    setTeacherProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateStudentFormData = (field: keyof StudentProfile, value: any) => {
    setStudentProfile(prev => ({ ...prev, [field]: value }));
  };

  const validateTeacherStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(teacherProfile.first_name && teacherProfile.last_name && teacherProfile.phone && 
                 teacherProfile.gender && teacherProfile.birthdate);
      case 2:
        return !!(teacherProfile.languages && teacherProfile.languages.length > 0 && 
                 teacherProfile.class_types && teacherProfile.class_types.length > 0 && 
                 teacherProfile.experience_years && teacherProfile.experience_years > 0 && 
                 teacherProfile.education && teacherProfile.bio);
      case 3:
        return !!(teacherProfile.available_days && teacherProfile.available_days.length > 0 && 
                 teacherProfile.available_hours && teacherProfile.available_hours.length > 0 && 
                 teacherProfile.location);
      case 4:
        return !!(teacherProfile.teaching_methods && teacherProfile.teaching_methods.length > 0);
      case 5:
        return true; // Final step is just confirmation
      default:
        return false;
    }
  };

  const nextTeacherStep = () => {
    if (validateTeacherStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error('لطفاً تمام فیلدهای ضروری را تکمیل کنید');
    }
  };

  const prevTeacherStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTeacherSubmit = async () => {
    if (!validateTeacherStep(5)) {
      toast.error('لطفاً تمام فیلدهای ضروری را تکمیل کنید');
      return;
    }

    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('کاربر یافت نشد');
      }

      const { error } = await supabase.from('teachers').insert({
        user_id: currentUser.id,
        email: currentUser.email,
        ...teacherProfile,
        status: 'pending',
        available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Also insert into users table
      const { error: userError } = await supabase.from('users').insert({
        id: currentUser.id,
        email: currentUser.email,
        first_name: teacherProfile.first_name,
        last_name: teacherProfile.last_name,
        phone: teacherProfile.phone,
        role: 'teacher',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (userError) throw userError;

      toast.success('پروفایل معلم با موفقیت ثبت شد. پس از تایید ادمین، می‌توانید وارد شوید.');
      router.push('/dashboard/teacher');
    } catch (error: any) {
      console.error('Error creating teacher profile:', error);
      toast.error(error.message || 'خطا در ثبت پروفایل');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('کاربر یافت نشد');
      }

      const { error } = await supabase.from('students').insert({
        id: currentUser.id, // Use id instead of user_id
        email: currentUser.email,
        ...studentProfile,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('پروفایل دانش‌آموز با موفقیت ثبت شد.');
      router.push('/dashboard/student');
    } catch (error: any) {
      console.error('Error creating student profile:', error);
      toast.error(error.message || 'خطا در ثبت پروفایل');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderTeacherStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            step <= currentStep 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-gray-100 border-gray-300 text-gray-500'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 5 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderTeacherStepTitle = () => {
    const titles = {
      1: 'اطلاعات پایه',
      2: 'پروفایل تدریس',
      3: 'زمان‌بندی و قیمت‌گذاری',
      4: 'مدارک و روش‌ها',
      5: 'تایید نهایی'
    };
    
    return (
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          تکمیل پروفایل معلم - مرحله {currentStep}
        </h1>
        <p className="text-gray-600">{titles[currentStep as keyof typeof titles]}</p>
      </div>
    );
  };

  const renderTeacherStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-right block mb-2">نام *</Label>
          <Input
            id="firstName"
            value={teacherProfile.first_name || ''}
            onChange={(e) => updateTeacherFormData('first_name', e.target.value)}
            placeholder="نام خود را وارد کنید"
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-right block mb-2">نام خانوادگی *</Label>
          <Input
            id="lastName"
            value={teacherProfile.last_name || ''}
            onChange={(e) => updateTeacherFormData('last_name', e.target.value)}
            placeholder="نام خانوادگی خود را وارد کنید"
            className="text-right"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-right block mb-2">ایمیل</Label>
        <Input
          id="email"
          type="email"
          value={teacherProfile.email || ''}
          disabled
          className="text-right bg-gray-100"
        />
        <p className="text-sm text-gray-500 mt-1">ایمیل شما از حساب گوگل گرفته شده است</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-right block mb-2">شماره تلفن *</Label>
          <Input
            id="phone"
            type="tel"
            value={teacherProfile.phone || ''}
            onChange={(e) => updateTeacherFormData('phone', e.target.value)}
            placeholder="مثال: 09123456789"
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="gender" className="text-right block mb-2">جنسیت *</Label>
          <Select value={teacherProfile.gender || ''} onValueChange={(value) => updateTeacherFormData('gender', value)}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">مرد</SelectItem>
              <SelectItem value="female">زن</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="birthdate" className="text-right block mb-2">تاریخ تولد *</Label>
          <Input
            id="birthdate"
            type="date"
            value={teacherProfile.birthdate || ''}
            onChange={(e) => updateTeacherFormData('birthdate', e.target.value)}
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="nationalId" className="text-right block mb-2">کد ملی</Label>
          <Input
            id="nationalId"
            value={teacherProfile.national_id || ''}
            onChange={(e) => updateTeacherFormData('national_id', e.target.value)}
            placeholder="کد ملی 10 رقمی (اختیاری)"
            className="text-right"
            maxLength={10}
            minLength={10}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderTeacherStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-right block mb-3">زبان‌های تدریس *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEACHING_LANGUAGES.map((lang) => (
            <div key={lang.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`lang-${lang.value}`}
                checked={teacherProfile.languages?.includes(lang.value) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateTeacherFormData('languages', [...(teacherProfile.languages || []), lang.value]);
                  } else {
                    updateTeacherFormData('languages', teacherProfile.languages?.filter(l => l !== lang.value) || []);
                  }
                }}
              />
              <Label htmlFor={`lang-${lang.value}`} className="text-sm cursor-pointer">
                {lang.flag} {lang.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-right block mb-3">سطح‌های تدریس *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEACHING_LEVELS.map((level) => (
            <div key={level.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`level-${level.value}`}
                checked={teacherProfile.levels?.includes(level.value) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateTeacherFormData('levels', [...(teacherProfile.levels || []), level.value]);
                  } else {
                    updateTeacherFormData('levels', teacherProfile.levels?.filter(l => l !== level.value) || []);
                  }
                }}
              />
              <Label htmlFor={`level-${level.value}`} className="text-sm cursor-pointer">
                {level.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-right block mb-3">نوع کلاس *</Label>
        <div className="grid grid-cols-3 gap-4">
          {CLASS_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.value} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={teacherProfile.class_types?.includes(type.value) || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateTeacherFormData('class_types', [...(teacherProfile.class_types || []), type.value]);
                    } else {
                      updateTeacherFormData('class_types', teacherProfile.class_types?.filter(t => t !== type.value) || []);
                    }
                  }}
                />
                <Label htmlFor={`type-${type.value}`} className="text-sm cursor-pointer flex items-center">
                  <Icon className="w-4 h-4 ml-1" />
                  {type.label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="experienceYears" className="text-right block mb-2">سال‌های تجربه تدریس *</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            max="50"
            value={teacherProfile.experience_years || ''}
            onChange={(e) => updateTeacherFormData('experience_years', parseInt(e.target.value) || 0)}
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="education" className="text-right block mb-2">تحصیلات *</Label>
          <Select value={teacherProfile.education || ''} onValueChange={(value) => updateTeacherFormData('education', value)}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="دیپلم">دیپلم</SelectItem>
              <SelectItem value="کارشناسی">کارشناسی</SelectItem>
              <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
              <SelectItem value="دکترا">دکترا</SelectItem>
              <SelectItem value="سایر">سایر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="bio" className="text-right block mb-2">بیوگرافی و تجربیات *</Label>
        <Textarea
          id="bio"
          value={teacherProfile.bio || ''}
          onChange={(e) => updateTeacherFormData('bio', e.target.value)}
          placeholder="درباره خود، تجربیات تدریس و روش‌های آموزشی خود بنویسید..."
          className="text-right"
          rows={4}
          required
        />
      </div>
    </motion.div>
  );

  const renderTeacherStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-right block mb-3">روزهای کاری *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AVAILABLE_DAYS.map((day) => (
            <div key={day.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`day-${day.value}`}
                checked={teacherProfile.available_days?.includes(day.value) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateTeacherFormData('available_days', [...(teacherProfile.available_days || []), day.value]);
                  } else {
                    updateTeacherFormData('available_days', teacherProfile.available_days?.filter(d => d !== day.value) || []);
                  }
                }}
              />
              <Label htmlFor={`day-${day.value}`} className="text-sm cursor-pointer">
                {day.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-right block mb-3">ساعات کاری *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AVAILABLE_HOURS.map((hour) => (
            <div key={hour.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`hour-${hour.value}`}
                checked={teacherProfile.available_hours?.includes(hour.value) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateTeacherFormData('available_hours', [...(teacherProfile.available_hours || []), hour.value]);
                  } else {
                    updateTeacherFormData('available_hours', teacherProfile.available_hours?.filter(h => h !== hour.value) || []);
                  }
                }}
              />
              <Label htmlFor={`hour-${hour.value}`} className="text-sm cursor-pointer">
                {hour.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="hourlyRate" className="text-right block mb-2">نرخ ساعتی (تومان)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            value={teacherProfile.hourly_rate || ''}
            onChange={(e) => updateTeacherFormData('hourly_rate', parseInt(e.target.value) || 0)}
            placeholder="مثال: 50000 (اختیاری)"
            className="text-right"
          />
        </div>
        <div>
          <Label htmlFor="maxStudentsPerClass" className="text-right block mb-2">حداکثر دانش‌آموز در کلاس</Label>
          <Input
            id="maxStudentsPerClass"
            type="number"
            min="1"
            max="20"
            value={teacherProfile.max_students_per_class || ''}
            onChange={(e) => updateTeacherFormData('max_students_per_class', parseInt(e.target.value) || 1)}
            className="text-right"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-right block mb-2">محل سکونت *</Label>
        <Input
          id="location"
          value={teacherProfile.location || ''}
          onChange={(e) => updateTeacherFormData('location', e.target.value)}
          placeholder="شهر و استان محل سکونت"
          className="text-right"
          required
        />
      </div>
    </motion.div>
  );

  const renderTeacherStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-right block mb-3">روش‌های تدریس *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TEACHING_METHODS.map((method) => (
            <div key={method.value} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`method-${method.value}`}
                checked={teacherProfile.teaching_methods?.includes(method.value) || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateTeacherFormData('teaching_methods', [...(teacherProfile.teaching_methods || []), method.value]);
                  } else {
                    updateTeacherFormData('teaching_methods', teacherProfile.teaching_methods?.filter(m => m !== method.value) || []);
                  }
                }}
              />
              <Label htmlFor={`method-${method.value}`} className="text-sm cursor-pointer">
                {method.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="certificates" className="text-right block mb-2">مدارک و گواهینامه‌ها</Label>
        <Textarea
          id="certificates"
          value={teacherProfile.certificates?.join('\n') || ''}
          onChange={(e) => updateTeacherFormData('certificates', e.target.value.split('\n').filter(c => c.trim()))}
          placeholder="مدارک و گواهینامه‌های خود را هر کدام در یک خط وارد کنید..."
          className="text-right"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="achievements" className="text-right block mb-2">دستاوردها و افتخارات</Label>
        <Textarea
          id="achievements"
          value={teacherProfile.achievements?.join('\n') || ''}
          onChange={(e) => updateTeacherFormData('achievements', e.target.value.split('\n').filter(a => a.trim()))}
          placeholder="دستاوردها و افتخارات خود را هر کدام در یک خط وارد کنید..."
          className="text-right"
          rows={3}
        />
      </div>
    </motion.div>
  );

  const renderTeacherStep5 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="address" className="text-right block mb-2">آدرس کامل</Label>
        <Textarea
          id="address"
          value={teacherProfile.address || ''}
          onChange={(e) => updateTeacherFormData('address', e.target.value)}
          placeholder="آدرس کامل محل سکونت"
          className="text-right"
          rows={3}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3 space-x-reverse">
          <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">خلاصه اطلاعات پروفایل</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>نام:</strong> {teacherProfile.first_name} {teacherProfile.last_name}</p>
              <p><strong>ایمیل:</strong> {teacherProfile.email}</p>
              <p><strong>زبان‌های تدریس:</strong> {teacherProfile.languages?.map(l => TEACHING_LANGUAGES.find(tl => tl.value === l)?.label).join(', ')}</p>
              <p><strong>سطح‌های تدریس:</strong> {teacherProfile.levels?.map(l => TEACHING_LEVELS.find(tl => tl.value === l)?.label).join(', ')}</p>
              <p><strong>نرخ ساعتی:</strong> {teacherProfile.hourly_rate?.toLocaleString()} تومان</p>
              <p><strong>محل سکونت:</strong> {teacherProfile.location}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTeacherStepContent = () => {
    switch (currentStep) {
      case 1: return renderTeacherStep1();
      case 2: return renderTeacherStep2();
      case 3: return renderTeacherStep3();
      case 4: return renderTeacherStep4();
      case 5: return renderTeacherStep5();
      default: return null;
    }
  };

  const renderTeacherStepButtons = () => (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={prevTeacherStep}
        disabled={currentStep === 1}
        className="flex items-center space-x-2 space-x-reverse"
      >
        <ArrowLeft className="w-4 h-4" />
        مرحله قبل
      </Button>

      {currentStep < 5 ? (
        <Button
          type="button"
          onClick={nextTeacherStep}
          className="flex items-center space-x-2 space-x-reverse bg-blue-600 hover:bg-blue-700"
        >
          مرحله بعد
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleTeacherSubmit}
          disabled={loading || !validateTeacherStep(5)}
          className="flex items-center space-x-2 space-x-reverse bg-green-600 hover:bg-green-700"
        >
          {loading ? 'در حال ثبت...' : 'تکمیل پروفایل معلم'}
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8">
            {userType === 'teacher' ? (
              <>
                {renderTeacherStepIndicator()}
                {renderTeacherStepTitle()}
                
                <AnimatePresence mode="wait">
                  {renderTeacherStepContent()}
                </AnimatePresence>
                
                {renderTeacherStepButtons()}
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    تکمیل پروفایل دانش‌آموز
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    لطفاً اطلاعات خود را تکمیل کنید
                  </p>
                </div>

                <form onSubmit={handleStudentSubmit} className="space-y-6">
                  {/* اطلاعات شخصی */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="student_first_name">نام</Label>
                      <Input
                        id="student_first_name"
                        value={studentProfile.first_name || ''}
                        onChange={(e) => updateStudentFormData('first_name', e.target.value)}
                        required
                        className="text-right"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student_last_name">نام خانوادگی</Label>
                      <Input
                        id="student_last_name"
                        value={studentProfile.last_name || ''}
                        onChange={(e) => updateStudentFormData('last_name', e.target.value)}
                        required
                        className="text-right"
                        placeholder="نام خانوادگی خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student_phone">شماره تلفن</Label>
                      <Input
                        id="student_phone"
                        type="tel"
                        value={studentProfile.phone || ''}
                        onChange={(e) => updateStudentFormData('phone', e.target.value)}
                        required
                        className="text-right"
                        placeholder="شماره تلفن خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student_age">سن</Label>
                      <Input
                        id="student_age"
                        type="number"
                        min="5"
                        max="100"
                        value={studentProfile.age || ''}
                        onChange={(e) => updateStudentFormData('age', parseInt(e.target.value) || 0)}
                        required
                        className="text-right"
                        placeholder="سن خود را وارد کنید"
                      />
                    </div>
                  </div>

                  {/* سطح زبان */}
                  <div>
                    <Label htmlFor="current_language_level">سطح زبان فعلی شما</Label>
                    <Select
                      value={studentProfile.current_language_level || ''}
                      onValueChange={(value) => updateStudentFormData('current_language_level', value)}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">مبتدی</SelectItem>
                        <SelectItem value="elementary">ابتدایی</SelectItem>
                        <SelectItem value="intermediate">متوسط</SelectItem>
                        <SelectItem value="upper_intermediate">متوسط پیشرفته</SelectItem>
                        <SelectItem value="advanced">پیشرفته</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* زبان‌های انتخابی */}
                  <div>
                    <Label>زبان‌های انتخابی</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {['آلمانی', 'انگلیسی'].map((lang) => (
                        <div key={lang} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`student-lang-${lang}`}
                            checked={studentProfile.preferred_languages?.includes(lang) || false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateStudentFormData('preferred_languages', [...(studentProfile.preferred_languages || []), lang]);
                              } else {
                                updateStudentFormData('preferred_languages', studentProfile.preferred_languages?.filter(l => l !== lang) || []);
                              }
                            }}
                          />
                          <Label htmlFor={`student-lang-${lang}`} className="text-sm">{lang}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* اهداف یادگیری */}
                  <div>
                    <Label htmlFor="learning_goals">اهداف یادگیری</Label>
                    <Textarea
                      id="learning_goals"
                      value={studentProfile.learning_goals || ''}
                      onChange={(e) => updateStudentFormData('learning_goals', e.target.value)}
                      placeholder="اهداف خود از یادگیری زبان را بنویسید (مثل: سفر، کار، تحصیل، علاقه شخصی)"
                      className="text-right"
                      rows={3}
                    />
                  </div>

                  {/* سبک یادگیری */}
                  <div>
                    <Label htmlFor="preferred_learning_style">سبک یادگیری ترجیحی</Label>
                    <Select
                      value={studentProfile.preferred_learning_style || ''}
                      onValueChange={(value) => updateStudentFormData('preferred_learning_style', value)}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">تصویری (ویدیو، تصاویر)</SelectItem>
                        <SelectItem value="audio">شنیداری (گوش دادن، صحبت کردن)</SelectItem>
                        <SelectItem value="reading">خواندن و نوشتن</SelectItem>
                        <SelectItem value="interactive">تعاملی (تمرین عملی)</SelectItem>
                        <SelectItem value="mixed">ترکیبی از همه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                  >
                    {loading ? "در حال ثبت..." : "ثبت پروفایل دانش‌آموز"}
                  </Button>
                </form>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompleteProfileContent />
    </Suspense>
  );
} 