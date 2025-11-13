"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Video,
  Filter,
  Grid3X3,
  List,
  Users,
  GraduationCap,
  Heart,
  Eye,
  ChevronDown,
  X,
  Sparkles,
  Zap,
  Target,
  Globe,
  Shield,
  TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createSimpleTeacherSlug } from "@/lib/slug-utils";
import Image from "next/image";

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

interface TeachersClientProps {
  teachers: Teacher[];
}

export default function TeachersClient({ teachers }: TeachersClientProps) {
  const router = useRouter();
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(teachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedClassType, setSelectedClassType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Constants
  const specialties = ["all", "مکالمه", "گرامر", "آیلتس", "تافل", "آمادگی آزمون", "کودکان", "بزرگسالان"];
  const levels = ["all", "مبتدی", "متوسط", "پیشرفته", "حرفه‌ای"];
  const classTypes = ["all", "خصوصی", "گروهی", "آنلاین", "حضوری"];
  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "oldest", label: "قدیمی‌ترین" },
    { value: "experience", label: "تجربه" },
    { value: "price_low", label: "قیمت (کم به زیاد)" },
    { value: "price_high", label: "قیمت (زیاد به کم)" },
    { value: "name", label: "نام" }
  ];

  useEffect(() => {
    filterTeachers();
  }, [searchTerm, selectedSpecialty, selectedLevel, selectedClassType, sortBy, teachers]);

  const filterTeachers = () => {
    let filtered = teachers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(teacher =>
        teacher.teaching_methods?.includes(selectedSpecialty) ||
        teacher.languages.includes(selectedSpecialty)
      );
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter(teacher =>
        teacher.levels?.includes(selectedLevel)
      );
    }

    // Filter by class type
    if (selectedClassType !== "all") {
      filtered = filtered.filter(teacher =>
        teacher.class_types.includes(selectedClassType)
      );
    }

    // Sort teachers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "experience":
          return (b.experience_years || 0) - (a.experience_years || 0);
        case "price_low":
          return (a.hourly_rate || 0) - (b.hourly_rate || 0);
        case "price_high":
          return (b.hourly_rate || 0) - (a.hourly_rate || 0);
        case "name":
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        default:
          return 0;
      }
    });

    setFilteredTeachers(filtered);
  };

  const handleTeacherClick = (teacherId: string) => {
    router.push(`/teachers/${teacherId}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("all");
    setSelectedLevel("all");
    setSelectedClassType("all");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl mb-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <GraduationCap className="w-14 h-14 text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 blur-xl"></div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 tracking-tight"
            >
              معلمان مجرب ما
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed font-medium"
            >
              با بهترین معلمان زبان انگلیسی آشنا شوید. تیم متخصص و مجرب آکادمی سِ وان 
              آماده راهنمایی شما در یادگیری زبان است.
            </motion.p>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-blue-200/50 dark:border-blue-700/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl"></div>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 relative z-10">
                  {teachers.length}
                </div>
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 relative z-10">معلم مجرب</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-purple-200/50 dark:border-purple-700/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl"></div>
                <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2 relative z-10">
                  15+
                </div>
                <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 relative z-10">زبان مختلف</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-pink-200/50 dark:border-pink-700/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/20 rounded-full blur-2xl"></div>
                <div className="text-4xl font-black text-pink-600 dark:text-pink-400 mb-2 relative z-10">
                  500+
                </div>
                <div className="text-sm font-semibold text-pink-700 dark:text-pink-300 relative z-10">دانش‌آموز راضی</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-green-200/50 dark:border-green-700/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-2xl"></div>
                <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2 relative z-10">
                  4.9
                </div>
                <div className="text-sm font-semibold text-green-700 dark:text-green-300 relative z-10">امتیاز متوسط</div>
              </motion.div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-2 border-gray-200/60 dark:border-gray-700/60">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                  <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="جستجو در معلمان..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 w-full text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-gray-700/50"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="px-3 py-2 rounded-lg"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="px-3 py-2 rounded-lg"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Filter Toggle */}
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-2 rounded-xl border-2"
                    >
                      <Filter className="w-4 h-4 ml-2" />
                      فیلترها
                    </Button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700 pt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Specialty Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            تخصص
                          </label>
                          <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {specialties.map((specialty) => (
                              <option key={specialty} value={specialty}>
                                {specialty === "all" ? "همه تخصص‌ها" : specialty}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Level Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            سطح
                          </label>
                          <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {levels.map((level) => (
                              <option key={level} value={level}>
                                {level === "all" ? "همه سطوح" : level}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Class Type Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            نوع کلاس
                          </label>
                          <select
                            value={selectedClassType}
                            onChange={(e) => setSelectedClassType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {classTypes.map((type) => (
                              <option key={type} value={type}>
                                {type === "all" ? "همه انواع" : type}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            مرتب‌سازی
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {sortOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="px-4 py-2 rounded-xl"
                        >
                          <X className="w-4 h-4 ml-2" />
                          پاک کردن فیلترها
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredTeachers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                معلمان ما ({filteredTeachers.length})
              </h2>
            </div>

            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`group overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}>
                    <div className={`relative ${viewMode === "list" ? "md:w-80 md:flex-shrink-0" : ""}`}>
                      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                        <div className="absolute inset-0">
                          <div className="absolute top-4 right-4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                          <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <motion.div 
                            className="text-center"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/40 shadow-2xl ring-4 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                              <AvatarImage 
                                src={teacher.avatar || '/api/placeholder/400/300'} 
                                alt={`${teacher.first_name} ${teacher.last_name}`}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-2xl font-black bg-white/30 text-white">
                                {teacher.first_name[0]}{teacher.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-white text-center">
                              <div className="text-xl font-black drop-shadow-lg">
                                {teacher.first_name} {teacher.last_name}
                              </div>
                              <div className="text-sm opacity-95 font-medium mt-1">
                                {teacher.languages[0] || 'زبان انگلیسی'}
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        <div className="absolute top-4 left-4 z-20">
                          <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 shadow-xl hover:bg-green-600 transition-colors">
                            <div className="w-2 h-2 bg-white rounded-full ml-2 animate-pulse"></div>
                            آنلاین
                          </Badge>
                        </div>

                        <div className="absolute bottom-4 right-4 z-20">
                          <Badge className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-800 dark:text-gray-200 border-0 shadow-xl font-semibold">
                            <Clock className="w-3 h-3 ml-1" />
                            {teacher.experience_years || 0} سال
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""} bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {teacher.first_name} {teacher.last_name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md">
                              {teacher.languages[0] || 'زبان انگلیسی'}
                            </Badge>
                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">4.9</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">(24)</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-2 rounded-xl border-2 border-green-200 dark:border-green-800">
                          <div className="text-2xl font-black text-green-600 dark:text-green-400">
                            {teacher.hourly_rate?.toLocaleString() || '0'}
                          </div>
                          <div className="text-xs font-semibold text-green-700 dark:text-green-300">تومان/ساعت</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{teacher.experience_years || 0} سال</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
                          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{teacher.location || 'تهران'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm bg-pink-50 dark:bg-pink-900/20 px-3 py-2 rounded-lg">
                          <Languages className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{teacher.languages[0] || 'انگلیسی'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                          <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">حداکثر {teacher.max_students_per_class || 1} نفر</span>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                        {teacher.bio || 'معلم مجرب و متخصص در آموزش زبان انگلیسی با سال‌ها تجربه در تدریس.'}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {teacher.teaching_methods?.slice(0, 3).map((method, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 font-semibold">
                            {method}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleTeacherClick(teacher.id)}
                          className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold hover:scale-105 active:scale-95"
                        >
                          <BookOpen className="w-4 h-4 ml-2" />
                          رزرو کلاس
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleTeacherClick(teacher.id)}
                          className="px-4 border-2 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                          <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 border-2 border-gray-300 dark:border-gray-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:scale-110 active:scale-95 group"
                        >
                          <Heart className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:text-pink-500 group-hover:fill-pink-500 transition-colors" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center py-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl mb-8 shadow-xl"
            >
              <GraduationCap className="w-12 h-12 text-gray-400" />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              معلمی یافت نشد
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
            >
              با فیلترهای انتخاب شده معلمی یافت نشد. لطفاً فیلترها را تغییر دهید.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                onClick={clearFilters}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <X className="w-4 h-4 ml-2" />
                پاک کردن فیلترها
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
