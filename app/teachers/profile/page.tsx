'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AvatarUploader from '@/components/AvatarUploader';
import { supabase } from '@/lib/supabase';
import { 
  User,
  Camera,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  BookOpen,
  Star,
  Clock,
  DollarSign,
  Languages,
  GraduationCap,
  Settings,
  Shield,
  Bell,
  Palette,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  X,
  Edit,
  Trash2,
  Upload,
  Download,
  Calendar,
  Target,
  Award,
  Zap,
  Activity,
  Heart,
  Smile,
  UserCheck,
  UserX,
  CalendarDays,
  Clock3,
  Clock4,
  DollarSign as DollarSignIcon,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart
} from 'lucide-react';

interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  bio: string;
  hourly_rate: number;
  location: string;
  experience_years: number;
  available: boolean;
  status: 'active' | 'inactive' | 'pending';
  languages: string[];
  levels: string[];
  available_days: string[];
  available_hours: string[];
  education: string;
  certifications: string[];
  specialties: string[];
  social_links: {
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  preferences: {
    notifications: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
    auto_accept_bookings: boolean;
    max_students_per_class: number;
    min_booking_notice: number;
  };
}

export default function TeacherProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    loadTeacherProfile();
  }, []);

  const loadTeacherProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch teacher profile using API
      const response = await fetch(`/api/teacher-profile?user_id=${user.id}&email=${user.email}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/register');
          return;
        }
        throw new Error('Failed to load profile');
      }

      const result = await response.json();
      const teacher = result.teacher;

      // Convert to TeacherProfile format
      const teacherProfile: TeacherProfile = {
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        phone: teacher.phone || '',
        avatar: teacher.avatar,
        bio: teacher.bio || '',
        hourly_rate: teacher.hourly_rate || 200000,
        location: teacher.location || '',
        experience_years: teacher.experience_years || 0,
        available: teacher.available !== false,
        status: teacher.status === 'Approved' ? 'active' : 'inactive',
        languages: teacher.languages || [],
        levels: teacher.levels || [],
        available_days: teacher.available_days || [],
        available_hours: teacher.available_hours || [],
        education: teacher.education || '',
        certifications: teacher.certificates || [],
        specialties: teacher.teaching_methods || [],
        social_links: {
          linkedin: '',
          instagram: '',
          website: ''
        },
        preferences: {
          notifications: true,
          email_notifications: true,
          sms_notifications: false,
          auto_accept_bookings: false,
          max_students_per_class: teacher.max_students_per_class || 1,
          min_booking_notice: 24
        }
      };

      setProfile(teacherProfile);
    } catch (error) {
      console.error('Error loading teacher profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    // Show success message
    alert('پروفایل با موفقیت ذخیره شد!');
  };

  const addLanguage = () => {
    if (newLanguage && profile) {
      setProfile({
        ...profile,
        languages: [...profile.languages, newLanguage]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    if (profile) {
      setProfile({
        ...profile,
        languages: profile.languages.filter(l => l !== language)
      });
    }
  };

  const addCertification = () => {
    if (newCertification && profile) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, newCertification]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    if (profile) {
      setProfile({
        ...profile,
        certifications: profile.certifications.filter(c => c !== certification)
      });
    }
  };

  const addSpecialty = () => {
    if (newSpecialty && profile) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, newSpecialty]
      });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    if (profile) {
      setProfile({
        ...profile,
        specialties: profile.specialties.filter(s => s !== specialty)
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">پروفایل در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">پروفایل یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">لطفاً دوباره تلاش کنید</p>
            <Button onClick={() => router.push('/dashboard/teacher')}>
              بازگشت به داشبورد
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/teacher')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ویرایش پروفایل
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  اطلاعات شخصی و حرفه‌ای خود را به‌روزرسانی کنید
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <AvatarUploader
                    currentAvatar={profile.avatar}
                    teacherId={profile.id}
                    teacherName={`${profile.first_name} ${profile.last_name}`}
                    onAvatarUpdate={(newAvatar) => {
                      setProfile(prev => prev ? {...prev, avatar: newAvatar} : null);
                    }}
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                  <Badge className={`mt-2 ${
                    profile.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {profile.status === 'active' ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">نرخ ساعتی</span>
                    </div>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {profile.hourly_rate.toLocaleString()} تومان
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm">تجربه</span>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {profile.experience_years} سال
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">زبان‌ها</span>
                    </div>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {profile.languages.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
                    <TabsTrigger value="professional">اطلاعات حرفه‌ای</TabsTrigger>
                    <TabsTrigger value="availability">دسترسی‌پذیری</TabsTrigger>
                    <TabsTrigger value="preferences">تنظیمات</TabsTrigger>
                  </TabsList>

                  {/* Basic Information */}
                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="first_name">نام</Label>
                        <Input
                          id="first_name"
                          value={profile.first_name}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">نام خانوادگی</Label>
                        <Input
                          id="last_name"
                          value={profile.last_name}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">ایمیل</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">شماره تلفن</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">شهر</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hourly_rate">نرخ ساعتی (تومان)</Label>
                        <Input
                          id="hourly_rate"
                          type="number"
                          value={profile.hourly_rate}
                          onChange={(e) => setProfile({ ...profile, hourly_rate: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">بیوگرافی</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                        placeholder="درباره خود و تجربیات تدریس خود بنویسید..."
                      />
                    </div>
                  </TabsContent>

                  {/* Professional Information */}
                  <TabsContent value="professional" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="education">تحصیلات</Label>
                        <Input
                          id="education"
                          value={profile.education}
                          onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience_years">سال‌های تجربه</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          value={profile.experience_years}
                          onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <Label>زبان‌های تدریس</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.languages.map((language) => (
                          <Badge key={language} variant="secondary" className="flex items-center gap-1">
                            {language}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLanguage(language)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="افزودن زبان جدید"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                        />
                        <Button onClick={addLanguage} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Levels */}
                    <div>
                      <Label>سطوح تدریس</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {['مبتدی', 'متوسط', 'پیشرفته'].map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={level}
                              checked={profile.levels.includes(level)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile({ ...profile, levels: [...profile.levels, level] });
                                } else {
                                  setProfile({ ...profile, levels: profile.levels.filter(l => l !== level) });
                                }
                              }}
                            />
                            <Label htmlFor={level}>{level}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <Label>گواهینامه‌ها</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                            {cert}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(cert)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="افزودن گواهینامه جدید"
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                        />
                        <Button onClick={addCertification} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <Label>تخصص‌ها</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                            {specialty}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSpecialty(specialty)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="افزودن تخصص جدید"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                        />
                        <Button onClick={addSpecialty} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Availability */}
                  <TabsContent value="availability" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>وضعیت دسترسی</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch
                            checked={profile.available}
                            onCheckedChange={(checked) => setProfile({ ...profile, available: checked })}
                          />
                          <span className="text-sm">{profile.available ? 'در دسترس' : 'غیرفعال'}</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="max_students">حداکثر دانش‌آموز در هر کلاس</Label>
                        <Input
                          id="max_students"
                          type="number"
                          min="1"
                          max="5"
                          value={profile.preferences.max_students_per_class}
                          onChange={(e) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              max_students_per_class: parseInt(e.target.value)
                            }
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>روزهای کاری</Label>
                      <div className="grid grid-cols-4 gap-4 mt-2">
                        {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={day}
                              checked={profile.available_days.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile({ ...profile, available_days: [...profile.available_days, day] });
                                } else {
                                  setProfile({ ...profile, available_days: profile.available_days.filter(d => d !== day) });
                                }
                              }}
                            />
                            <Label htmlFor={day}>{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>ساعت‌های کاری</Label>
                      <div className="grid grid-cols-4 gap-4 mt-2">
                        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((hour) => (
                          <div key={hour} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={hour}
                              checked={profile.available_hours.includes(hour)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile({ ...profile, available_hours: [...profile.available_hours, hour] });
                                } else {
                                  setProfile({ ...profile, available_hours: profile.available_hours.filter(h => h !== hour) });
                                }
                              }}
                            />
                            <Label htmlFor={hour}>{hour}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preferences */}
                  <TabsContent value="preferences" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>اعلان‌های عمومی</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌های مهم</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, notifications: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>اعلان‌های ایمیل</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌ها از طریق ایمیل</p>
                        </div>
                        <Switch
                          checked={profile.preferences.email_notifications}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, email_notifications: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>اعلان‌های پیامک</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌ها از طریق پیامک</p>
                        </div>
                        <Switch
                          checked={profile.preferences.sms_notifications}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, sms_notifications: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>پذیرش خودکار رزرو</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">پذیرش خودکار درخواست‌های رزرو</p>
                        </div>
                        <Switch
                          checked={profile.preferences.auto_accept_bookings}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, auto_accept_bookings: checked }
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="min_booking_notice">حداقل زمان اعلام رزرو (ساعت)</Label>
                      <Input
                        id="min_booking_notice"
                        type="number"
                        min="1"
                        max="72"
                        value={profile.preferences.min_booking_notice}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            min_booking_notice: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 