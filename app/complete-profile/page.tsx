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
import { motion } from "framer-motion";

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
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  birthdate: string;
  address: string;
  education_level: string;
  learning_goals: string;
  preferred_languages: string[];
  preferred_learning_style: string;
  availability: string[];
  notes: string;
  avatar: string;
}

function CompleteProfileContent() {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');
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
    preferred_languages: [],
    availability: [],
  });

  useEffect(() => {
    const type = searchParams.get('type') || 'student';
    setUserType(type);
    
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.log('No authenticated user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        // Check if email is confirmed
        if (!user.email_confirmed_at) {
          console.log('Email not confirmed, redirecting to verify email');
          router.push(`/verify-email?email=${encodeURIComponent(user.email || '')}`);
          return;
        }
        
        console.log('User authenticated and email confirmed:', user);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
        router.push('/login');
      }
    };

    getCurrentUser();
  }, [searchParams, router]);

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('کاربر یافت نشد');
      }

      const { error } = await supabase.from('teachers').insert({
        id: currentUser.id,
        email: currentUser.email,
        ...teacherProfile,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('پروفایل معلم با موفقیت ثبت شد. پس از تایید ادمین، می‌توانید وارد شوید.');
      router.push('/login');
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
        id: currentUser.id,
        email: currentUser.email,
        ...studentProfile,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('پروفایل دانش‌آموز با موفقیت ثبت شد.');
      router.push('/dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                تکمیل پروفایل {userType === 'teacher' ? 'معلم' : 'دانش‌آموز'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                لطفاً اطلاعات خود را تکمیل کنید
              </p>
            </div>

            {userType === 'teacher' ? (
              <form onSubmit={handleTeacherSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="first_name">نام</Label>
                    <Input
                      id="first_name"
                      value={teacherProfile.first_name || ''}
                      onChange={(e) => setTeacherProfile(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">نام خانوادگی</Label>
                    <Input
                      id="last_name"
                      value={teacherProfile.last_name || ''}
                      onChange={(e) => setTeacherProfile(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">شماره تلفن</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={teacherProfile.phone || ''}
                      onChange={(e) => setTeacherProfile(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly_rate">نرخ ساعتی (تومان)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={teacherProfile.hourly_rate || ''}
                      onChange={(e) => setTeacherProfile(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience_years">سال‌های تجربه</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={teacherProfile.experience_years || ''}
                      onChange={(e) => setTeacherProfile(prev => ({ ...prev, experience_years: parseInt(e.target.value) }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">محل سکونت</Label>
                    <Input
                      id="location"
                      value={teacherProfile.location || ''}
                      onChange={(e) => setTeacherProfile(prev => ({ ...prev, location: e.target.value }))}
                      required
                      className="text-right"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">بیوگرافی</Label>
                  <Textarea
                    id="bio"
                    value={teacherProfile.bio || ''}
                    onChange={(e) => setTeacherProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="درباره خود و تجربیات تدریس خود بنویسید..."
                    className="text-right"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>زبان‌های تدریس</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['فارسی', 'انگلیسی', 'عربی', 'فرانسه', 'آلمانی', 'اسپانیایی', 'ایتالیایی', 'روسی'].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={teacherProfile.languages?.includes(lang) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTeacherProfile(prev => ({
                                ...prev,
                                languages: [...(prev.languages || []), lang]
                              }));
                            } else {
                              setTeacherProfile(prev => ({
                                ...prev,
                                languages: prev.languages?.filter(l => l !== lang) || []
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`lang-${lang}`} className="text-sm">{lang}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>سطح‌های تدریس</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['مبتدی', 'متوسط', 'پیشرفته', 'آکادمیک'].map((level) => (
                      <div key={level} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`level-${level}`}
                          checked={teacherProfile.levels?.includes(level) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTeacherProfile(prev => ({
                                ...prev,
                                levels: [...(prev.levels || []), level]
                              }));
                            } else {
                              setTeacherProfile(prev => ({
                                ...prev,
                                levels: prev.levels?.filter(l => l !== level) || []
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`level-${level}`} className="text-sm">{level}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>نوع کلاس</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['online', 'offline', 'hybrid'].map((type) => (
                      <div key={type} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`type-${type}`}
                          checked={teacherProfile.class_types?.includes(type) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTeacherProfile(prev => ({
                                ...prev,
                                class_types: [...(prev.class_types || []), type]
                              }));
                            } else {
                              setTeacherProfile(prev => ({
                                ...prev,
                                class_types: prev.class_types?.filter(t => t !== type) || []
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">
                          {type === 'online' ? 'آنلاین' : type === 'offline' ? 'حضوری' : 'ترکیبی'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {loading ? "در حال ثبت..." : "ثبت پروفایل معلم"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleStudentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="student_first_name">نام</Label>
                    <Input
                      id="student_first_name"
                      value={studentProfile.first_name || ''}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="student_last_name">نام خانوادگی</Label>
                    <Input
                      id="student_last_name"
                      value={studentProfile.last_name || ''}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="student_phone">شماره تلفن</Label>
                    <Input
                      id="student_phone"
                      type="tel"
                      value={studentProfile.phone || ''}
                      onChange={(e) => setStudentProfile(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="education_level">سطح تحصیلی</Label>
                    <Select
                      value={studentProfile.education_level || ''}
                      onValueChange={(value) => setStudentProfile(prev => ({ ...prev, education_level: value }))}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ابتدایی">ابتدایی</SelectItem>
                        <SelectItem value="متوسطه اول">متوسطه اول</SelectItem>
                        <SelectItem value="متوسطه دوم">متوسطه دوم</SelectItem>
                        <SelectItem value="دانشگاه">دانشگاه</SelectItem>
                        <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
                        <SelectItem value="دکترا">دکترا</SelectItem>
                        <SelectItem value="سایر">سایر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="learning_goals">اهداف یادگیری</Label>
                  <Textarea
                    id="learning_goals"
                    value={studentProfile.learning_goals || ''}
                    onChange={(e) => setStudentProfile(prev => ({ ...prev, learning_goals: e.target.value }))}
                    placeholder="اهداف خود از یادگیری زبان را بنویسید..."
                    className="text-right"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>زبان‌های مورد علاقه</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['فارسی', 'انگلیسی', 'عربی', 'فرانسه', 'آلمانی', 'اسپانیایی', 'ایتالیایی', 'روسی'].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`student-lang-${lang}`}
                          checked={studentProfile.preferred_languages?.includes(lang) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setStudentProfile(prev => ({
                                ...prev,
                                preferred_languages: [...(prev.preferred_languages || []), lang]
                              }));
                            } else {
                              setStudentProfile(prev => ({
                                ...prev,
                                preferred_languages: prev.preferred_languages?.filter(l => l !== lang) || []
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`student-lang-${lang}`} className="text-sm">{lang}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  {loading ? "در حال ثبت..." : "ثبت پروفایل دانش‌آموز"}
                </Button>
              </form>
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