"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  Lock, 
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

interface TeacherRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  birthdate: string;
  nationalId: string;
  languages: string[];
  levels: string[];
  classTypes: string[];
  experienceYears: number;
  education: string;
  bio: string;
  availableDays: string[];
  availableHours: string[];
  preferredTime: string[];
  hourlyRate: number;
  maxStudentsPerClass: number;
  location: string;
  certificates: string[];
  teachingMethods: string[];
  achievements: string[];
  address: string;
  notes: string;
  agreeToTerms: boolean;
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

function TeacherRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherRegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    birthdate: '',
    nationalId: '',
    languages: [],
    levels: [],
    classTypes: [],
    experienceYears: 0,
    education: '',
    bio: '',
    availableDays: [],
    availableHours: [],
    preferredTime: [],
    hourlyRate: 0,
    maxStudentsPerClass: 1,
    location: '',
    certificates: [],
    teachingMethods: [],
    achievements: [],
    address: '',
    notes: '',
    agreeToTerms: false
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [searchParams]);

  const updateFormData = (field: keyof TeacherRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.password && formData.confirmPassword && 
                 formData.firstName && formData.lastName && formData.phone && 
                 formData.gender && formData.birthdate);
      case 2:
        return !!(formData.languages.length > 0 && formData.classTypes.length > 0 && 
                 formData.experienceYears > 0 && formData.education && formData.bio);
      case 3:
        return !!(formData.availableDays.length > 0 && formData.availableHours.length > 0 && 
                 formData.location);
      case 4:
        return !!(formData.teachingMethods.length > 0);
      case 5:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error('لطفاً تمام فیلدهای ضروری را تکمیل کنید');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error('لطفاً تمام فیلدهای ضروری را تکمیل کنید');
      return;
    }

    setLoading(true);

    try {
      // تغییر redirect URL برای جلوگیری از مشکلات
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const redirectUrl = `${siteUrl}/auth/callback?user_type=teacher&email=${encodeURIComponent(formData.email)}`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            user_type: 'teacher',
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
                          const { error: profileError } = await supabase.from('teachers').insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          gender: formData.gender,
          birthdate: formData.birthdate,
          national_id: formData.nationalId || null,
          languages: formData.languages,
          levels: formData.levels.length > 0 ? formData.levels : null,
          class_types: formData.classTypes,
          experience_years: formData.experienceYears,
          education: formData.education,
          bio: formData.bio,
          available_days: formData.availableDays.length > 0 ? formData.availableDays : null,
          available_hours: formData.availableHours.length > 0 ? formData.availableHours : null,
          preferred_time: formData.preferredTime.length > 0 ? formData.preferredTime : null,
          hourly_rate: formData.hourlyRate || null,
          max_students_per_class: formData.maxStudentsPerClass,
          location: formData.location,
          certificates: formData.certificates.length > 0 ? formData.certificates : null,
          teaching_methods: formData.teachingMethods.length > 0 ? formData.teachingMethods : null,
          achievements: formData.achievements.length > 0 ? formData.achievements : null,
          address: formData.address || null,
          notes: formData.notes || null,
          status: 'pending',
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;

        const { error: userError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          role: 'teacher',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (userError) throw userError;

        toast.success('ثبت‌نام معلم با موفقیت انجام شد! پس از تایید ادمین، می‌توانید وارد شوید.');
        
        sessionStorage.setItem('userType', 'teacher');
        sessionStorage.setItem('userEmail', formData.email);
        
        // Check if email confirmation is required
        if (authData.user.email_confirmed_at) {
          console.log("Email already confirmed, redirecting to profile completion");
          router.push('/complete-profile?type=teacher');
        } else {
          console.log("Email confirmation required, redirecting to verify email");
          // Store user type and email in session storage
          sessionStorage.setItem('userType', 'teacher');
          sessionStorage.setItem('userEmail', formData.email);
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'خطا در ثبت‌نام';
      let showRateLimitInfo = false;
      
      if (error.message) {
        if (error.message.includes('User already registered')) {
          errorMessage = 'این ایمیل قبلاً ثبت شده است';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'ایمیل وارد شده معتبر نیست';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'رمز عبور باید حداقل 6 کاراکتر باشد';
        } else if (error.message.includes('email rate limit exceeded')) {
          errorMessage = 'تعداد درخواست‌های ایمیل بیش از حد مجاز است';
          showRateLimitInfo = true;
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = 'تعداد درخواست‌های ایمیل بیش از حد مجاز است';
          showRateLimitInfo = true;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      
      if (showRateLimitInfo) {
        toast.error('لطفاً 60 دقیقه صبر کنید یا از Google OAuth استفاده کنید', {
          duration: 5000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
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

  const renderStepTitle = () => {
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
          ثبت‌نام معلم - مرحله {currentStep}
        </h1>
        <p className="text-gray-600">{titles[currentStep as keyof typeof titles]}</p>
      </div>
    );
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* راهنمای مهم */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 space-x-reverse text-blue-800 mb-2">
          <Info className="w-5 h-5" />
          <span className="font-medium">نکته مهم:</span>
        </div>
        <p className="text-sm text-blue-700 text-right">
          برای جلوگیری از مشکلات ارسال ایمیل، توصیه می‌شود از دکمه "ادامه با گوگل" استفاده کنید.
          این روش نیازی به تایید ایمیل ندارد و سریع‌تر است.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-right block mb-2">نام *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            placeholder="نام خود را وارد کنید"
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-right block mb-2">نام خانوادگی *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            placeholder="نام خانوادگی خود را وارد کنید"
            className="text-right"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-right block mb-2">ایمیل *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="ایمیل خود را وارد کنید"
          className="text-right"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="password" className="text-right block mb-2">رمز عبور *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            placeholder="حداقل 8 کاراکتر"
            className="text-right"
            required
            minLength={8}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="text-right block mb-2">تایید رمز عبور *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            placeholder="رمز عبور را تکرار کنید"
            className="text-right"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-right block mb-2">شماره تلفن *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="مثال: 09123456789"
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="gender" className="text-right block mb-2">جنسیت *</Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
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
            value={formData.birthdate}
            onChange={(e) => updateFormData('birthdate', e.target.value)}
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="nationalId" className="text-right block mb-2">کد ملی</Label>
          <Input
            id="nationalId"
            value={formData.nationalId}
            onChange={(e) => updateFormData('nationalId', e.target.value)}
            placeholder="کد ملی 10 رقمی (اختیاری)"
            className="text-right"
            maxLength={10}
            minLength={10}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
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
                checked={formData.languages.includes(lang.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('languages', [...formData.languages, lang.value]);
                  } else {
                    updateFormData('languages', formData.languages.filter(l => l !== lang.value));
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
                checked={formData.levels.includes(level.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('levels', [...formData.levels, level.value]);
                  } else {
                    updateFormData('levels', formData.levels.filter(l => l !== level.value));
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
                  checked={formData.classTypes.includes(type.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFormData('classTypes', [...formData.classTypes, type.value]);
                    } else {
                      updateFormData('classTypes', formData.classTypes.filter(t => t !== type.value));
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
            value={formData.experienceYears || ''}
            onChange={(e) => updateFormData('experienceYears', parseInt(e.target.value) || 0)}
            className="text-right"
            required
          />
        </div>
        <div>
          <Label htmlFor="education" className="text-right block mb-2">تحصیلات *</Label>
          <Select value={formData.education} onValueChange={(value) => updateFormData('education', value)}>
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
          value={formData.bio}
          onChange={(e) => updateFormData('bio', e.target.value)}
          placeholder="درباره خود، تجربیات تدریس و روش‌های آموزشی خود بنویسید..."
          className="text-right"
          rows={4}
          required
        />
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
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
                checked={formData.availableDays.includes(day.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('availableDays', [...formData.availableDays, day.value]);
                  } else {
                    updateFormData('availableDays', formData.availableDays.filter(d => d !== day.value));
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
                checked={formData.availableHours.includes(hour.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('availableHours', [...formData.availableHours, hour.value]);
                  } else {
                    updateFormData('availableHours', formData.availableHours.filter(h => h !== hour.value));
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
            value={formData.hourlyRate || ''}
            onChange={(e) => updateFormData('hourlyRate', parseInt(e.target.value) || 0)}
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
            value={formData.maxStudentsPerClass || ''}
            onChange={(e) => updateFormData('maxStudentsPerClass', parseInt(e.target.value) || 1)}
            className="text-right"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-right block mb-2">محل سکونت *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData('location', e.target.value)}
          placeholder="شهر و استان محل سکونت"
          className="text-right"
          required
        />
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
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
                checked={formData.teachingMethods.includes(method.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('teachingMethods', [...formData.teachingMethods, method.value]);
                  } else {
                    updateFormData('teachingMethods', formData.teachingMethods.filter(m => m !== method.value));
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
          value={formData.certificates.join('\n')}
          onChange={(e) => updateFormData('certificates', e.target.value.split('\n').filter(c => c.trim()))}
          placeholder="مدارک و گواهینامه‌های خود را هر کدام در یک خط وارد کنید..."
          className="text-right"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="achievements" className="text-right block mb-2">دستاوردها و افتخارات</Label>
        <Textarea
          id="achievements"
          value={formData.achievements.join('\n')}
          onChange={(e) => updateFormData('achievements', e.target.value.split('\n').filter(a => a.trim()))}
          placeholder="دستاوردها و افتخارات خود را هر کدام در یک خط وارد کنید..."
          className="text-right"
          rows={3}
        />
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
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
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          placeholder="آدرس کامل محل سکونت"
          className="text-right"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="notes" className="text-right block mb-2">توضیحات اضافی</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          placeholder="هر توضیح اضافی که می‌خواهید اضافه کنید..."
          className="text-right"
          rows={3}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3 space-x-reverse">
          <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">خلاصه اطلاعات ثبت‌نام</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>نام:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>ایمیل:</strong> {formData.email}</p>
              <p><strong>زبان‌های تدریس:</strong> {formData.languages.map(l => TEACHING_LANGUAGES.find(tl => tl.value === l)?.label).join(', ')}</p>
              <p><strong>سطح‌های تدریس:</strong> {formData.levels.map(l => TEACHING_LEVELS.find(tl => tl.value === l)?.label).join(', ')}</p>
              <p><strong>نرخ ساعتی:</strong> {formData.hourlyRate?.toLocaleString()} تومان</p>
              <p><strong>محل سکونت:</strong> {formData.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 space-x-reverse">
        <Checkbox
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => updateFormData('agreeToTerms', checked as boolean)}
          required
        />
        <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
          با <a href="/terms" className="text-blue-600 hover:underline">قوانین و شرایط</a> سایت موافقم *
        </Label>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  const renderStepButtons = () => (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 1}
        className="flex items-center space-x-2 space-x-reverse"
      >
        <ArrowLeft className="w-4 h-4" />
        مرحله قبل
      </Button>

      {currentStep < 5 ? (
        <Button
          type="button"
          onClick={nextStep}
          className="flex items-center space-x-2 space-x-reverse bg-blue-600 hover:bg-blue-700"
        >
          مرحله بعد
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !validateStep(5)}
          className="flex items-center space-x-2 space-x-reverse bg-green-600 hover:bg-green-700"
        >
          {loading ? 'در حال ثبت‌نام...' : 'تکمیل ثبت‌نام'}
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          {renderStepIndicator()}
          {renderStepTitle()}
          
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
          
          {renderStepButtons()}
        </Card>
      </div>
    </div>
  );
}

export default function TeacherRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <TeacherRegistrationForm />
    </Suspense>
  );
}
