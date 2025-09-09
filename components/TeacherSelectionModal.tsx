'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  Clock, 
  MapPin, 
  MessageCircle, 
  BookOpen,
  Languages,
  Award,
  Video,
  X,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

interface TeacherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeacherSelect: (teacher: Teacher) => void;
}

export default function TeacherSelectionModal({ isOpen, onClose, onTeacherSelect }: TeacherSelectionModalProps) {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [loading, setLoading] = useState(false);

  // Fetch teachers from Supabase
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching teachers for modal...');
      
      const result = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) {
        console.error('❌ Query failed:', result.error);
        setLoading(false);
        return;
      }
      
      // Filter for approved teachers
      const approvedTeachers = result.data?.filter(teacher => 
        teacher.status === 'Approved' || teacher.status === 'approved' || teacher.status === 'active'
      ) || [];
      
      setTeachers(approvedTeachers);
      setFilteredTeachers(approvedTeachers);
      setLoading(false);
      
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

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
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(teacher =>
        teacher.languages.includes(selectedSpecialty)
      );
    }

    setFilteredTeachers(filtered);
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: { [key: string]: string } = {
      'انگلیسی': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'english': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'فرانسه': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'آلمانی': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'اسپانیایی': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    };
    return colors[specialty] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'مبتدی': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'beginner': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'متوسط': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'پیشرفته': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'advanced': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    };
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getClassTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'online': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'offline': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'hybrid': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'قیمت متغیر';
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getAvailableDaysText = (days: string[] | null) => {
    if (!days || days.length === 0) return 'زمان‌بندی متغیر';
    
    const dayMap: { [key: string]: string } = {
      'monday': 'دوشنبه',
      'tuesday': 'سه‌شنبه',
      'wednesday': 'چهارشنبه',
      'thursday': 'پنج‌شنبه',
      'friday': 'جمعه',
      'saturday': 'شنبه',
      'sunday': 'یکشنبه'
    };
    
    return days.map(day => dayMap[day] || day).join('، ');
  };

  const getAvailableHoursText = (hours: string[] | null) => {
    if (!hours || hours.length === 0) return 'ساعت متغیر';
    
    const hourMap: { [key: string]: string } = {
      'morning': 'صبح',
      'afternoon': 'ظهر',
      'evening': 'عصر',
      'night': 'شب'
    };
    
    return hours.map(hour => hourMap[hour] || hour).join('، ');
  };

  const specialties = ['all', 'انگلیسی', 'english', 'فرانسه', 'آلمانی', 'اسپانیایی'];

  const handleTeacherSelect = (teacher: Teacher) => {
    onTeacherSelect(teacher);
    onClose();
  };

  const handleBookDirectly = (teacher: Teacher) => {
    // Store teacher context in sessionStorage for better UX
    sessionStorage.setItem('selectedTeacher', JSON.stringify({
      id: teacher.id,
      name: `${teacher.first_name} ${teacher.last_name}`,
      avatar: teacher.avatar,
      languages: teacher.languages,
      levels: teacher.levels,
      hourly_rate: teacher.hourly_rate,
      class_types: teacher.class_types,
      experience_years: teacher.experience_years
    }));
    
    // Store booking context
    sessionStorage.setItem('bookingContext', JSON.stringify({
      source: 'dashboard',
      timestamp: new Date().toISOString(),
      userType: 'student'
    }));
    
    // Navigate to booking page - this will show the booking form, not payment
    router.push(`/teachers/${teacher.id}/book`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      انتخاب معلم
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      معلم مورد نظر خود را انتخاب کنید
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
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
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty === 'all' ? 'همه زبان‌ها' : specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    در حال بارگذاری معلمان...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    لطفاً صبر کنید
                  </p>
                </div>
              ) : filteredTeachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTeachers.map((teacher) => (
                    <motion.div
                      key={teacher.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      className="group"
                    >
                      <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-blue-200 dark:group-hover:border-blue-800">
                        <CardHeader className="text-center pb-4">
                          {/* Avatar */}
                          <div className="flex justify-center mb-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={teacher.avatar || undefined} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold">
                                {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Name and Status */}
                          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                            {teacher.first_name} {teacher.last_name}
                          </CardTitle>
                          
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {teacher.experience_years} سال تجربه
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          {/* Languages */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">زبان‌ها:</h4>
                            <div className="flex flex-wrap gap-1">
                              {teacher.languages.slice(0, 3).map((lang, idx) => (
                                <Badge key={idx} className={`text-xs ${getSpecialtyColor(lang)}`}>
                                  <Languages className="w-3 h-3 mr-1" />
                                  {lang}
                                </Badge>
                              ))}
                              {teacher.languages.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{teacher.languages.length - 3} بیشتر
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Levels */}
                          {teacher.levels && teacher.levels.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">سطوح:</h4>
                              <div className="flex flex-wrap gap-1">
                                {teacher.levels.slice(0, 2).map((level, idx) => (
                                  <Badge key={idx} variant="outline" className={`text-xs ${getLevelColor(level)}`}>
                                    {level}
                                  </Badge>
                                ))}
                                {teacher.levels.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{teacher.levels.length - 2} بیشتر
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Class Types */}
                          {teacher.class_types && teacher.class_types.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">نوع کلاس:</h4>
                              <div className="flex flex-wrap gap-1">
                                {teacher.class_types.map((type, idx) => (
                                  <Badge key={idx} variant="outline" className={`text-xs ${getClassTypeColor(type)}`}>
                                    {type === 'online' ? 'آنلاین' : type === 'offline' ? 'حضوری' : 'ترکیبی'}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

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
                              onClick={() => handleBookDirectly(teacher)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              رزرو کلاس
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => handleTeacherSelect(teacher)}
                              className="flex-1 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              انتخاب
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    معلمی یافت نشد
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm || selectedSpecialty !== 'all' 
                      ? 'با فیلترهای انتخاب شده معلمی یافت نشد. لطفاً فیلترها را تغییر دهید.'
                      : 'هنوز معلمی در سیستم ثبت نشده است.'
                    }
                  </p>
                  {(searchTerm || selectedSpecialty !== 'all') && (
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedSpecialty('all');
                      }}
                      variant="outline"
                    >
                      پاک کردن فیلترها
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredTeachers.length} معلم موجود
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                >
                  بستن
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
