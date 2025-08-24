"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Clock, 
  MapPin, 
  MessageCircle, 
  BookOpen,
  Languages,
  Award,
  Video
} from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);

    // Fetch teachers from Supabase
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching teachers from Supabase...');
      
      // Now that RLS policy is created, we can use the regular anon key
      console.log('🔄 Using anon key with RLS policy...');
      
      // Test simple query first
      console.log('🧪 Testing simple query...');
      console.log('🔧 Supabase client:', supabase);
      console.log('🔧 Supabase client type:', typeof supabase);
      
      const testResult = await supabase
        .from('teachers')
        .select('id')
        .limit(1);
      
      console.log('🧪 Test query result:', testResult);
      console.log('🧪 Test query success:', !testResult.error);
      console.log('🧪 Test query data:', testResult.data);
      
      if (testResult.error) {
        console.error('❌ Test query failed:', testResult.error);
        console.error('Test error details:', {
          message: testResult.error.message || 'No message',
          details: testResult.error.details || 'No details',
          hint: testResult.error.hint || 'No hint',
          code: testResult.error.code || 'No code'
        });
        console.error('Full test error object:', JSON.stringify(testResult.error, null, 2));
        console.error('Test error type:', typeof testResult.error);
        setLoading(false);
        return;
      }
      
      // Use the regular supabase client (with anon key)
      const result = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) {
        console.error('❌ Query failed:', result.error);
        console.error('Error details:', {
          message: result.error.message || 'No message',
          details: result.error.details || 'No details',
          hint: result.error.hint || 'No hint',
          code: result.error.code || 'No code'
        });
        console.error('Full error object:', JSON.stringify(result.error, null, 2));
        console.error('Error type:', typeof result.error);
        setLoading(false);
        return;
      }
      
      console.log('✅ Teachers fetched successfully:', result.data?.length || 0);
      console.log('📊 Sample teacher data:', result.data?.[0]);
      
      // Filter for approved teachers
      const approvedTeachers = result.data?.filter(teacher => 
        teacher.status === 'Approved' || teacher.status === 'approved' || teacher.status === 'active'
      ) || [];
      
      console.log('✅ Filtered approved teachers:', approvedTeachers?.length || 0);
      console.log('📊 Approved teachers data:', approvedTeachers);
      
      // Show status breakdown
      if (result.data && result.data.length > 0) {
        const statusCount = result.data.reduce((acc, teacher) => {
          acc[teacher.status || 'unknown'] = (acc[teacher.status || 'unknown'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        console.log('📊 Status breakdown:', statusCount);
      }
      
      setTeachers(approvedTeachers);
      setFilteredTeachers(approvedTeachers);
      setLoading(false);
      
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      console.error('Error type:', typeof error);
      console.error('Error stringified:', JSON.stringify(error, null, 2));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchTerm, selectedSpecialty, teachers]);

  const filterTeachers = () => {
    let filtered = teachers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (teacher.bio && teacher.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(teacher =>
        teacher.languages.includes(selectedSpecialty)
      );
    }

    setFilteredTeachers(filtered);
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: { [key: string]: string } = {
      "انگلیسی": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "english": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "فرانسه": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "آلمانی": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "اسپانیایی": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    };
    return colors[specialty] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      "مبتدی": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "beginner": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "متوسط": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "intermediate": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "پیشرفته": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "advanced": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return colors[level] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const getClassTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "online": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "offline": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "hybrid": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "قیمت متغیر";
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const getAvailableDaysText = (days: string[] | null) => {
    if (!days || days.length === 0) return "زمان‌بندی متغیر";
    
    const dayMap: { [key: string]: string } = {
      "monday": "دوشنبه",
      "tuesday": "سه‌شنبه",
      "wednesday": "چهارشنبه",
      "thursday": "پنج‌شنبه",
      "friday": "جمعه",
      "saturday": "شنبه",
      "sunday": "یکشنبه"
    };
    
    return days.map(day => dayMap[day] || day).join("، ");
  };

  const getAvailableHoursText = (hours: string[] | null) => {
    if (!hours || hours.length === 0) return "ساعت متغیر";
    
    const hourMap: { [key: string]: string } = {
      "morning": "صبح",
      "afternoon": "ظهر",
      "evening": "عصر",
      "night": "شب"
    };
    
    return hours.map(hour => hourMap[hour] || hour).join("، ");
  };

  const specialties = ["all", "انگلیسی", "english", "فرانسه", "آلمانی", "اسپانیایی"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              در حال بارگذاری معلمان...
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              لطفاً صبر کنید
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            معلمان ما
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            با بهترین معلمان زبان آشنا شوید و مسیر یادگیری خود را آغاز کنید
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="جستجو در معلمان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty === "all" ? "همه زبان‌ها" : specialty}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={teacher.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold">
                          {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Name and Status */}
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {teacher.first_name} {teacher.last_name}
                    </CardTitle>
                    
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {teacher.experience_years} سال تجربه
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Languages */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">زبان‌ها:</h4>
                      <div className="flex flex-wrap gap-2">
                        {teacher.languages.map((lang, idx) => (
                          <Badge key={idx} className={getSpecialtyColor(lang)}>
                            <Languages className="w-3 h-3 mr-1" />
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Levels */}
                    {teacher.levels && teacher.levels.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">سطوح:</h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.levels.map((level, idx) => (
                            <Badge key={idx} variant="outline" className={getLevelColor(level)}>
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Class Types */}
                    {teacher.class_types && teacher.class_types.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">نوع کلاس:</h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.class_types.map((type, idx) => (
                            <Badge key={idx} variant="outline" className={getClassTypeColor(type)}>
                              {type === 'online' ? 'آنلاین' : type === 'offline' ? 'حضوری' : 'ترکیبی'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {teacher.bio && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">درباره:</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {teacher.bio}
                        </p>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">زمان‌بندی:</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{getAvailableDaysText(teacher.available_days)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{getAvailableHoursText(teacher.available_hours)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    {teacher.hourly_rate && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">قیمت:</h4>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(teacher.hourly_rate)}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => router.push(`/teachers/${teacher.id}/book`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        رزرو کلاس
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/teachers/${teacher.id}`)}
                        className="flex-1"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        مشاهده پروفایل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              معلمی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || selectedSpecialty !== "all" 
                ? "با فیلترهای انتخاب شده معلمی یافت نشد. لطفاً فیلترها را تغییر دهید."
                : "هنوز معلمی در سیستم ثبت نشده است."
              }
            </p>
            {(searchTerm || selectedSpecialty !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("all");
                }}
                variant="outline"
              >
                پاک کردن فیلترها
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 