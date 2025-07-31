'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Languages,
  Target,
  Settings,
  Camera,
  Save,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Bell,
  Shield,
  Globe,
  BookOpen,
  Clock,
  Star,
  Award,
  GraduationCap,
  Activity,
  Heart,
  Smile,
  MessageCircle,
  Headphones,
  PenTool,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Trash2,
  Download,
  Upload,
  Key,
  UserCheck,
  UserX,
  CalendarDays,
  Clock3,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  CalendarDays as CalendarDaysIcon,
  Clock3 as Clock3Icon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  Plus as PlusIcon,
  Trash2 as Trash2Icon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Key as KeyIcon
} from 'lucide-react';

interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  birth_date: string;
  gender: string;
  country: string;
  city: string;
  bio: string;
  level: string;
  primary_language: string;
  learning_goals: string[];
  experience_years: number;
  study_preferences: {
    preferred_time: string;
    session_duration: number;
    group_size: string;
    learning_style: string;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
    class_reminders: boolean;
    progress_updates: boolean;
    promotional_emails: boolean;
  };
  privacy_settings: {
    profile_visibility: string;
    show_progress: boolean;
    allow_messages: boolean;
    show_online_status: boolean;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned_date: string;
  category: string;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    // Mock profile data
    const mockProfile: StudentProfile = {
      id: 'student-1',
      first_name: 'سارا',
      last_name: 'محمدی',
      email: 'sara.mohammadi@example.com',
      phone: '09123456789',
      avatar: null,
      birth_date: '1995-03-15',
      gender: 'female',
      country: 'ایران',
      city: 'تهران',
      bio: 'دانشجوی زبان انگلیسی با علاقه به یادگیری زبان‌های مختلف و سفر به کشورهای مختلف جهان.',
      level: 'متوسط',
      primary_language: 'انگلیسی',
      learning_goals: [
        'یادگیری زبان انگلیسی برای کار',
        'آمادگی برای آزمون آیلتس',
        'مکالمه روان در سفر',
        'خواندن کتاب‌های انگلیسی'
      ],
      experience_years: 2,
      study_preferences: {
        preferred_time: 'عصر',
        session_duration: 60,
        group_size: 'انفرادی',
        learning_style: 'تعاملی'
      },
      notifications: {
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        class_reminders: true,
        progress_updates: true,
        promotional_emails: false
      },
      privacy_settings: {
        profile_visibility: 'public',
        show_progress: true,
        allow_messages: true,
        show_online_status: true
      }
    };

    setProfile(mockProfile);
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
  };

  const addGoal = () => {
    if (newGoal.trim() && profile) {
      setProfile({
        ...profile,
        learning_goals: [...profile.learning_goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    if (profile) {
      const updatedGoals = profile.learning_goals.filter((_, i) => i !== index);
      setProfile({
        ...profile,
        learning_goals: updatedGoals
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">پروفایل شما در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">پروفایل یافت نشد</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">لطفا ابتدا ثبت‌نام کنید</p>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              ثبت‌نام
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                onClick={() => router.push('/dashboard/student')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ویرایش پروفایل
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  اطلاعات شخصی و تنظیمات حساب کاربری
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
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
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={profile.avatar || ''} alt={`${profile.first_name} ${profile.last_name}`} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-2xl">
                        {profile.first_name[0]}{profile.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="outline" className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {profile.level}
                  </Badge>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">زبان اصلی</span>
                    </div>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {profile.primary_language}
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
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">اهداف</span>
                    </div>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {profile.learning_goals.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  اطلاعات شخصی
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  یادگیری
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  اعلان‌ها
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  امنیت
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      اطلاعات شخصی
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">نام</Label>
                        <Input
                          id="first_name"
                          value={profile.first_name}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">نام خانوادگی</Label>
                        <Input
                          id="last_name"
                          value={profile.last_name}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">ایمیل</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">شماره تلفن</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birth_date">تاریخ تولد</Label>
                        <Input
                          id="birth_date"
                          type="date"
                          value={profile.birth_date}
                          onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">جنسیت</Label>
                        <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">مرد</SelectItem>
                            <SelectItem value="female">زن</SelectItem>
                            <SelectItem value="other">سایر</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">کشور</Label>
                        <Input
                          id="country"
                          value={profile.country}
                          onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">شهر</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">درباره من</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Learning Preferences Tab */}
              <TabsContent value="learning" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Learning Goals */}
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        اهداف یادگیری
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {profile.learning_goals.map((goal, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-sm">{goal}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeGoal(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="هدف جدید اضافه کنید..."
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                        />
                        <Button onClick={addGoal} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Study Preferences */}
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        ترجیحات مطالعه
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>زمان ترجیحی</Label>
                        <Select 
                          value={profile.study_preferences.preferred_time} 
                          onValueChange={(value) => setProfile({
                            ...profile,
                            study_preferences: { ...profile.study_preferences, preferred_time: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">صبح</SelectItem>
                            <SelectItem value="afternoon">ظهر</SelectItem>
                            <SelectItem value="evening">عصر</SelectItem>
                            <SelectItem value="night">شب</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>مدت جلسه (دقیقه)</Label>
                        <Select 
                          value={profile.study_preferences.session_duration.toString()} 
                          onValueChange={(value) => setProfile({
                            ...profile,
                            study_preferences: { ...profile.study_preferences, session_duration: parseInt(value) }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 دقیقه</SelectItem>
                            <SelectItem value="45">45 دقیقه</SelectItem>
                            <SelectItem value="60">60 دقیقه</SelectItem>
                            <SelectItem value="90">90 دقیقه</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>اندازه گروه</Label>
                        <Select 
                          value={profile.study_preferences.group_size} 
                          onValueChange={(value) => setProfile({
                            ...profile,
                            study_preferences: { ...profile.study_preferences, group_size: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">انفرادی</SelectItem>
                            <SelectItem value="small">گروه کوچک (2-3 نفر)</SelectItem>
                            <SelectItem value="medium">گروه متوسط (4-6 نفر)</SelectItem>
                            <SelectItem value="large">گروه بزرگ (7+ نفر)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>سبک یادگیری</Label>
                        <Select 
                          value={profile.study_preferences.learning_style} 
                          onValueChange={(value) => setProfile({
                            ...profile,
                            study_preferences: { ...profile.study_preferences, learning_style: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visual">بصری</SelectItem>
                            <SelectItem value="auditory">شنیداری</SelectItem>
                            <SelectItem value="kinesthetic">حرکتی</SelectItem>
                            <SelectItem value="interactive">تعاملی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      تنظیمات اعلان‌ها
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">اعلان‌های ایمیل</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌ها از طریق ایمیل</p>
                        </div>
                        <Switch
                          checked={profile.notifications.email_notifications}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, email_notifications: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">اعلان‌های پیامکی</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌ها از طریق پیامک</p>
                        </div>
                        <Switch
                          checked={profile.notifications.sms_notifications}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, sms_notifications: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">اعلان‌های مرورگر</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">دریافت اعلان‌ها در مرورگر</p>
                        </div>
                        <Switch
                          checked={profile.notifications.push_notifications}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, push_notifications: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">یادآوری کلاس</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">یادآوری کلاس‌های آینده</p>
                        </div>
                        <Switch
                          checked={profile.notifications.class_reminders}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, class_reminders: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">به‌روزرسانی پیشرفت</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">اطلاع‌رسانی پیشرفت یادگیری</p>
                        </div>
                        <Switch
                          checked={profile.notifications.progress_updates}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, progress_updates: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">ایمیل‌های تبلیغاتی</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">دریافت ایمیل‌های تبلیغاتی</p>
                        </div>
                        <Switch
                          checked={profile.notifications.promotional_emails}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, promotional_emails: checked }
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Privacy Settings */}
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        تنظیمات حریم خصوصی
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>نمایش پروفایل</Label>
                        <Select 
                          value={profile.privacy_settings.profile_visibility} 
                          onValueChange={(value) => setProfile({
                            ...profile,
                            privacy_settings: { ...profile.privacy_settings, profile_visibility: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">عمومی</SelectItem>
                            <SelectItem value="private">خصوصی</SelectItem>
                            <SelectItem value="friends">فقط دوستان</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">نمایش پیشرفت</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">اجازه نمایش پیشرفت به دیگران</p>
                        </div>
                        <Switch
                          checked={profile.privacy_settings.show_progress}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            privacy_settings: { ...profile.privacy_settings, show_progress: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">دریافت پیام</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">اجازه دریافت پیام از دیگران</p>
                        </div>
                        <Switch
                          checked={profile.privacy_settings.allow_messages}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            privacy_settings: { ...profile.privacy_settings, allow_messages: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">وضعیت آنلاین</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">نمایش وضعیت آنلاین بودن</p>
                        </div>
                        <Switch
                          checked={profile.privacy_settings.show_online_status}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            privacy_settings: { ...profile.privacy_settings, show_online_status: checked }
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Security */}
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        امنیت حساب
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>رمز عبور فعلی</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="رمز عبور فعلی"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>رمز عبور جدید</Label>
                        <Input
                          type="password"
                          placeholder="رمز عبور جدید"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>تکرار رمز عبور جدید</Label>
                        <Input
                          type="password"
                          placeholder="تکرار رمز عبور جدید"
                        />
                      </div>
                      
                      <Button className="w-full">
                        <Key className="w-4 h-4 mr-2" />
                        تغییر رمز عبور
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 