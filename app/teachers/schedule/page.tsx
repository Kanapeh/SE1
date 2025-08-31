'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  AlertCircle,
  Settings,
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  BookOpen,
  Zap,
  Target,
  Star,
  DollarSign
} from 'lucide-react';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxStudents: number;
  price: number;
}

interface ScheduleDay {
  day: string;
  persianName: string;
  timeSlots: TimeSlot[];
}

export default function TeacherSchedulePage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: '09:00',
    endTime: '10:00',
    maxStudents: 1,
    price: 200000
  });

  const daysOfWeek = [
    { key: 'saturday', name: 'شنبه' },
    { key: 'sunday', name: 'یکشنبه' },
    { key: 'monday', name: 'دوشنبه' },
    { key: 'tuesday', name: 'سه‌شنبه' },
    { key: 'wednesday', name: 'چهارشنبه' },
    { key: 'thursday', name: 'پنج‌شنبه' },
    { key: 'friday', name: 'جمعه' }
  ];

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      // Try to load schedule from localStorage first
      const savedSchedule = localStorage.getItem('teacher-schedule');
      if (savedSchedule) {
        console.log('✅ Loading saved schedule from localStorage');
        setSchedule(JSON.parse(savedSchedule));
        setSelectedDay('saturday');
        return;
      }
    } catch (error) {
      console.error('❌ Error loading saved schedule:', error);
    }

    // Initialize schedule with mock data if no saved data
    const initialSchedule = daysOfWeek.map(day => ({
      day: day.key,
      persianName: day.name,
      timeSlots: [
        {
          id: `${day.key}-1`,
          day: day.key,
          startTime: '09:00',
          endTime: '10:00',
          isAvailable: true,
          maxStudents: 1,
          price: 200000
        },
        {
          id: `${day.key}-2`,
          day: day.key,
          startTime: '14:00',
          endTime: '15:00',
          isAvailable: true,
          maxStudents: 1,
          price: 200000
        }
      ]
    }));
    setSchedule(initialSchedule);
    setSelectedDay('saturday');
  };

  const saveSchedule = async () => {
    try {
      setSaving(true);
      console.log('💾 Saving schedule to localStorage...');
      
      // Save to localStorage for now (later can be API call)
      localStorage.setItem('teacher-schedule', JSON.stringify(schedule));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      console.log('✅ Schedule saved successfully');
      
      // Show success message (you can add toast notification here)
      alert('برنامه زمانی با موفقیت ذخیره شد!');
      
    } catch (error) {
      console.error('❌ Error saving schedule:', error);
      alert('خطا در ذخیره برنامه زمانی');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveToggle = () => {
    if (isEditing) {
      saveSchedule();
    } else {
      setIsEditing(true);
    }
  };

  const toggleTimeSlotAvailability = (dayKey: string, slotId: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          timeSlots: day.timeSlots.map(slot => 
            slot.id === slotId 
              ? { ...slot, isAvailable: !slot.isAvailable }
              : slot
          )
        };
      }
      return day;
    }));
  };

  const addTimeSlot = () => {
    if (!selectedDay) return;

    const newSlot: TimeSlot = {
      id: `${selectedDay}-${Date.now()}`,
      day: selectedDay,
      startTime: newTimeSlot.startTime,
      endTime: newTimeSlot.endTime,
      isAvailable: true,
      maxStudents: newTimeSlot.maxStudents,
      price: newTimeSlot.price
    };

    setSchedule(prev => prev.map(day => {
      if (day.day === selectedDay) {
        return {
          ...day,
          timeSlots: [...day.timeSlots, newSlot]
        };
      }
      return day;
    }));

    // Reset form
    setNewTimeSlot({
      startTime: '09:00',
      endTime: '10:00',
      maxStudents: 1,
      price: 200000
    });
  };

  const deleteTimeSlot = (dayKey: string, slotId: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          timeSlots: day.timeSlots.filter(slot => slot.id !== slotId)
        };
      }
      return day;
    }));
  };

  const getSelectedDaySchedule = () => {
    return schedule.find(day => day.day === selectedDay);
  };

  const totalAvailableSlots = schedule.reduce((total, day) => 
    total + day.timeSlots.filter(slot => slot.isAvailable).length, 0
  );

  const totalWeeklyEarnings = schedule.reduce((total, day) => 
    total + day.timeSlots.filter(slot => slot.isAvailable).reduce((dayTotal, slot) => 
      dayTotal + slot.price, 0
    ), 0
  );

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
                onClick={() => router.push('/dashboard/teacher')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت به داشبورد
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  مدیریت برنامه زمانی
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  برنامه زمانی خود را تنظیم و مدیریت کنید
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleSaveToggle}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : isEditing ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Edit className="w-4 h-4" />
                )}
                {saving ? 'در حال ذخیره...' : isEditing ? 'ذخیره تغییرات' : 'ویرایش برنامه'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">کلاس‌های فعال</p>
                  <p className="text-2xl font-bold">{totalAvailableSlots}</p>
                  <p className="text-green-100 text-sm">در هفته</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">درآمد بالقوه</p>
                  <p className="text-2xl font-bold">{totalWeeklyEarnings.toLocaleString()}</p>
                  <p className="text-blue-100 text-sm">تومان در هفته</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">روزهای فعال</p>
                  <p className="text-2xl font-bold">{schedule.filter(day => day.timeSlots.some(slot => slot.isAvailable)).length}</p>
                  <p className="text-purple-100 text-sm">از 7 روز</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <CalendarDays className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Days Selection */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                روزهای هفته
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.key}
                  onClick={() => setSelectedDay(day.key)}
                  className={`w-full p-3 rounded-lg text-right transition-all duration-200 ${
                    selectedDay === day.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{day.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {schedule.find(d => d.day === day.key)?.timeSlots.filter(slot => slot.isAvailable).length || 0}
                      </span>
                      <Clock3 className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Time Slots */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    برنامه {getSelectedDaySchedule()?.persianName}
                  </CardTitle>
                  {isEditing && (
                    <Button onClick={addTimeSlot} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      افزودن زمان
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">افزودن زمان جدید</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="startTime">زمان شروع</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newTimeSlot.startTime}
                          onChange={(e) => setNewTimeSlot(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">زمان پایان</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newTimeSlot.endTime}
                          onChange={(e) => setNewTimeSlot(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxStudents">حداکثر دانش‌آموز</Label>
                        <Input
                          id="maxStudents"
                          type="number"
                          min="1"
                          max="5"
                          value={newTimeSlot.maxStudents}
                          onChange={(e) => setNewTimeSlot(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">قیمت (تومان)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newTimeSlot.price}
                          onChange={(e) => setNewTimeSlot(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {getSelectedDaySchedule()?.timeSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        slot.isAvailable
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              حداکثر {slot.maxStudents} دانش‌آموز
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {slot.price.toLocaleString()} تومان
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditing && (
                            <>
                              <Switch
                                checked={slot.isAvailable}
                                onCheckedChange={() => toggleTimeSlotAvailability(selectedDay, slot.id)}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteTimeSlot(selectedDay, slot.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Badge className={slot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {slot.isAvailable ? 'فعال' : 'غیرفعال'}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {getSelectedDaySchedule()?.timeSlots.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      هیچ زمانی تنظیم نشده
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      برای شروع، زمان‌های تدریس خود را اضافه کنید
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}