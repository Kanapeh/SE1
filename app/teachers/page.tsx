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
  Award
} from "lucide-react";
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch teachers from Supabase
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teachers:', error);
        return;
      }

      setTeachers(data || []);
      setFilteredTeachers(data || []);
    } catch (error) {
      console.error('Error in fetchTeachers:', error);
    } finally {
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

    // Filter by levels (instead of specialty)
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.levels && teacher.levels.includes(selectedSpecialty)
      );
    }

    setFilteredTeachers(filtered);
  };

  const specialties = ["all", "مبتدی", "متوسط", "پیشرفته", "آیلتس", "تافل", "مکالمه", "گرامر"];

  const handleSelectTeacher = (teacherId: string) => {
    // هدایت به صفحه جزئیات معلم
    window.location.href = `/teachers/${teacherId}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            معلمان متخصص ما
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            با بهترین معلمان زبان انگلیسی آشنا شوید و مسیر یادگیری خود را انتخاب کنید
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="جستجو در معلمان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Specialty Filter */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty === "all" ? "همه تخصص‌ها" : specialty}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                                      <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={teacher.avatar || ''} alt={`${teacher.first_name} ${teacher.last_name}`} />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {teacher.first_name[0]}{teacher.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                    {teacher.available && (
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {teacher.first_name} {teacher.last_name}
                  </CardTitle>
                  
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-gray-500">(دانش‌آموز)</span>
                  </div>

                  <Badge variant="secondary" className="mb-2">
                    {teacher.levels && teacher.levels.length > 0 ? teacher.levels[0] : 'معلم زبان'}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Languages */}
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-blue-500" />
                    <div className="flex gap-1">
                      {teacher.languages.map((lang, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {teacher.experience_years || 0} سال تجربه
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {teacher.location || 'نامشخص'}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {teacher.bio || 'توضیحات در دسترس نیست'}
                  </p>

                  {/* Certificates */}
                  {teacher.certificates && teacher.certificates.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {teacher.certificates.slice(0, 2).map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {teacher.certificates.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.certificates.length - 2} بیشتر
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-left">
                      <span className="text-lg font-bold text-primary">
                        {teacher.hourly_rate ? teacher.hourly_rate.toLocaleString() : 'نامشخص'} تومان
                      </span>
                      <span className="text-sm text-gray-500 block">در ساعت</span>
                    </div>
                    
                    <Button
                      onClick={() => handleSelectTeacher(teacher.id)}
                      disabled={!teacher.available}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {teacher.available ? "انتخاب معلم" : "غیرفعال"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              معلمی یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              با تغییر فیلترها دوباره جستجو کنید
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 