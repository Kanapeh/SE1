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

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: number;
  rating: number;
  students: number;
  languages: string[];
  bio: string;
  hourlyRate: number;
  location: string;
  available: boolean;
  certificates: string[];
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mock data - در آینده از API دریافت می‌شود
  const mockTeachers: Teacher[] = [
    {
      id: "1",
      name: "سپنتا علیزاده",
      avatar: "/images/teacher1.jpg",
      specialty: "مکالمه انگلیسی",
      experience: 8,
      rating: 4.9,
      students: 156,
      languages: ["انگلیسی", "فارسی"],
      bio: "معلم با تجربه در زمینه آموزش مکالمه انگلیسی با روش‌های مدرن و تعاملی",
      hourlyRate: 250000,
      location: "تهران",
      available: true,
      certificates: ["CELTA", "TESOL", "IELTS Trainer"]
    },
    {
      id: "2",
      name: "پارمیدا معصومی",
      avatar: "/images/teacher2.jpg",
      specialty: "گرامر پیشرفته",
      experience: 12,
      rating: 4.8,
      students: 203,
      languages: ["انگلیسی", "فارسی", "عربی"],
      bio: "متخصص در آموزش گرامر پیشرفته و آمادگی برای آزمون‌های بین‌المللی",
      hourlyRate: 300000,
      location: "اصفهان",
      available: true,
      certificates: ["DELTA", "Cambridge Trainer", "TOEFL Expert"]
    },
    {
      id: "3",
      name: "نجمه کریمی",
      avatar: "/images/teacher3.jpg",
      specialty: "آیلتس",
      experience: 6,
      rating: 4.7,
      students: 89,
      languages: ["انگلیسی", "فارسی"],
      bio: "مدرس تخصصی آیلتس با نمره 8.5 و تجربه موفق در آماده‌سازی دانش‌آموزان",
      hourlyRate: 280000,
      location: "شیراز",
      available: false,
      certificates: ["IELTS 8.5", "TESOL", "Academic Writing"]
    },
    {
      id: "4",
      name: "نجمه بهاری",
      avatar: "/images/teacher4.jpg",
      specialty: "مکالمه تجاری",
      experience: 10,
      rating: 4.9,
      students: 134,
      languages: ["انگلیسی", "فارسی", "آلمانی"],
      bio: "متخصص در آموزش انگلیسی تجاری و آمادگی برای مصاحبه‌های کاری",
      hourlyRate: 320000,
      location: "مشهد",
      available: true,
      certificates: ["Business English", "MBA", "Corporate Trainer"]
    }
    
   
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTeachers(mockTeachers);
      setFilteredTeachers(mockTeachers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchTerm, selectedSpecialty, teachers]);

  const filterTeachers = () => {
    let filtered = teachers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(teacher => teacher.specialty === selectedSpecialty);
    }

    setFilteredTeachers(filtered);
  };

  const specialties = ["all", "مکالمه انگلیسی", "گرامر پیشرفته", "آیلتس", "مکالمه تجاری", "تافل", "انگلیسی کودکان"];

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
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {teacher.available && (
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {teacher.name}
                  </CardTitle>
                  
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{teacher.rating}</span>
                    <span className="text-sm text-gray-500">({teacher.students} دانش‌آموز)</span>
                  </div>

                  <Badge variant="secondary" className="mb-2">
                    {teacher.specialty}
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
                      {teacher.experience} سال تجربه
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {teacher.location}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {teacher.bio}
                  </p>

                  {/* Certificates */}
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

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-left">
                      <span className="text-lg font-bold text-primary">
                        {teacher.hourlyRate.toLocaleString()} تومان
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