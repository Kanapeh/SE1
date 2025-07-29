"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar,
  Clock,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";

interface ScheduleSlot {
  id?: string;
  teacher_id: string;
  day: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at?: string;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const DAYS_OF_WEEK = [
  { value: 'saturday', label: 'شنبه' },
  { value: 'sunday', label: 'یکشنبه' },
  { value: 'monday', label: 'دوشنبه' },
  { value: 'tuesday', label: 'سه‌شنبه' },
  { value: 'wednesday', label: 'چهارشنبه' },
  { value: 'thursday', label: 'پنج‌شنبه' },
  { value: 'friday', label: 'جمعه' }
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

export default function TeacherSchedulePage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('saturday');

  // Get current teacher
  const getCurrentTeacher = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return null;
      }

      const { data: teacherData, error } = await supabase
        .from('teachers')
        .select('id, first_name, last_name, email')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error getting teacher:', error);
        router.push('/register');
        return null;
      }

      setTeacher(teacherData);
      return teacherData;
    } catch (error) {
      console.error('Error in getCurrentTeacher:', error);
      return null;
    }
  };

  // Fetch current schedule
  const fetchSchedule = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('teacher_schedule')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('day', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return [];
    }
  };

  // Initialize schedule for all days
  const initializeSchedule = (teacherId: string) => {
    const initialSchedule: ScheduleSlot[] = [];
    
    DAYS_OF_WEEK.forEach(day => {
      TIME_SLOTS.forEach(time => {
        initialSchedule.push({
          teacher_id: teacherId,
          day: day.value,
          start_time: time,
          end_time: getNextHour(time),
          is_available: false
        });
      });
    });

    return initialSchedule;
  };

  // Get next hour for end time
  const getNextHour = (time: string): string => {
    const [hour, minute] = time.split(':');
    const nextHour = (parseInt(hour) + 1) % 24;
    return `${nextHour.toString().padStart(2, '0')}:${minute}`;
  };

  // Toggle availability for a time slot
  const toggleAvailability = (day: string, startTime: string) => {
    setSchedule(prev => prev.map(slot => 
      slot.day === day && slot.start_time === startTime
        ? { ...slot, is_available: !slot.is_available }
        : slot
    ));
  };

  // Save schedule
  const saveSchedule = async () => {
    if (!teacher) return;

    setSaving(true);
    try {
      // Delete existing schedule
      await supabase
        .from('teacher_schedule')
        .delete()
        .eq('teacher_id', teacher.id);

      // Insert new schedule (only available slots)
      const availableSlots = schedule.filter(slot => slot.is_available);
      
      if (availableSlots.length > 0) {
        const { error } = await supabase
          .from('teacher_schedule')
          .insert(availableSlots);

        if (error) throw error;
      }

      // Show success message
      alert('برنامه با موفقیت ذخیره شد!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('خطا در ذخیره برنامه');
    } finally {
      setSaving(false);
    }
  };

  // Quick actions for common schedules
  const setCommonSchedule = (type: 'morning' | 'afternoon' | 'evening' | 'full') => {
    const timeRanges = {
      morning: ['08:00', '09:00', '10:00', '11:00', '12:00'],
      afternoon: ['13:00', '14:00', '15:00', '16:00', '17:00'],
      evening: ['18:00', '19:00', '20:00', '21:00', '22:00'],
      full: TIME_SLOTS
    };

    setSchedule(prev => prev.map(slot => ({
      ...slot,
      is_available: timeRanges[type].includes(slot.start_time)
    })));
  };

  useEffect(() => {
    const initialize = async () => {
      const teacherData = await getCurrentTeacher();
      if (!teacherData) return;

      const existingSchedule = await fetchSchedule(teacherData.id);
      
      if (existingSchedule.length > 0) {
        // Merge existing schedule with full schedule
        const fullSchedule = initializeSchedule(teacherData.id);
        const mergedSchedule = fullSchedule.map(slot => {
          const existing = existingSchedule.find(es => 
            es.day === slot.day && es.start_time === slot.start_time
          );
          return existing || slot;
        });
        setSchedule(mergedSchedule);
      } else {
        setSchedule(initializeSchedule(teacherData.id));
      }
      
      setLoading(false);
    };

    initialize();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">برنامه در حال آماده‌سازی است...</p>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">دسترسی محدود</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">فقط معلمان می‌توانند به این صفحه دسترسی داشته باشند</p>
            <Button 
              onClick={() => router.push('/register?type=teacher')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              ثبت‌نام به عنوان معلم
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentDaySchedule = schedule.filter(slot => slot.day === selectedDay);
  const availableSlots = schedule.filter(slot => slot.is_available).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  مدیریت برنامه
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {teacher.first_name} {teacher.last_name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={saveSchedule}
                disabled={saving}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'در حال ذخیره...' : 'ذخیره برنامه'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                تنظیمات سریع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setCommonSchedule('morning')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>صبح</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setCommonSchedule('afternoon')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>ظهر</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setCommonSchedule('evening')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>عصر</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setCommonSchedule('full')}
                  className="h-16 flex flex-col items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>تمام روز</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Schedule Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Days Selection */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  روزهای هفته
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const daySlots = schedule.filter(slot => slot.day === day.value);
                    const availableCount = daySlots.filter(slot => slot.is_available).length;
                    
                    return (
                      <button
                        key={day.value}
                        onClick={() => setSelectedDay(day.value)}
                        className={`w-full p-3 rounded-lg text-right transition-all duration-200 ${
                          selectedDay === day.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{day.label}</span>
                          <Badge variant={selectedDay === day.value ? "secondary" : "outline"}>
                            {availableCount} ساعت
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Slots */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    زمان‌های {DAYS_OF_WEEK.find(d => d.value === selectedDay)?.label}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{availableSlots} ساعت انتخاب شده</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentDaySchedule.map((slot) => (
                    <div
                      key={`${slot.day}-${slot.start_time}`}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        slot.is_available
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      }`}
                      onClick={() => toggleAvailability(slot.day, slot.start_time)}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {slot.start_time} - {slot.end_time}
                        </div>
                        <div className="mt-2">
                          <Switch
                            checked={slot.is_available}
                            onCheckedChange={() => toggleAvailability(slot.day, slot.start_time)}
                          />
                        </div>
                        <div className="mt-2 text-sm">
                          {slot.is_available ? (
                            <span className="text-green-600 dark:text-green-400">در دسترس</span>
                          ) : (
                            <span className="text-gray-500">غیرفعال</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {availableSlots}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ساعت در دسترس</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Math.round((availableSlots / schedule.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">درصد دسترسی</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {DAYS_OF_WEEK.filter(day => 
                      schedule.filter(slot => slot.day === day.value && slot.is_available).length > 0
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">روز فعال</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}