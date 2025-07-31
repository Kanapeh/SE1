'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Search,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  Download,
  MoreHorizontal,
  UserCheck,
  UserX,
  GraduationCap,
  Languages,
  MapPin,
  Clock3,
  DollarSign,
  BarChart3,
  Activity,
  Heart,
  Smile,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  level: string;
  language: string;
  status: 'active' | 'inactive' | 'pending';
  totalClasses: number;
  completedClasses: number;
  averageRating: number;
  totalSpent: number;
  lastClassDate: string;
  nextClassDate: string;
  progress: number;
  goals: string;
  notes: string;
}

interface ClassRecord {
  id: string;
  date: string;
  duration: number;
  status: 'completed' | 'scheduled' | 'cancelled';
  rating: number;
  feedback: string;
  amount: number;
}

export default function TeacherStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockStudents: Student[] = [
      {
        id: '1',
        first_name: 'سارا',
        last_name: 'محمدی',
        email: 'sara@example.com',
        phone: '09123456789',
        avatar: null,
        level: 'متوسط',
        language: 'انگلیسی',
        status: 'active',
        totalClasses: 12,
        completedClasses: 10,
        averageRating: 4.8,
        totalSpent: 2400000,
        lastClassDate: '2024-01-15',
        nextClassDate: '2024-01-20',
        progress: 75,
        goals: 'یادگیری زبان انگلیسی برای کار',
        notes: 'دانش‌آموز بسیار فعال و علاقه‌مند'
      },
      {
        id: '2',
        first_name: 'احمد',
        last_name: 'رضایی',
        email: 'ahmad@example.com',
        phone: '09187654321',
        avatar: null,
        level: 'مبتدی',
        language: 'فرانسه',
        status: 'active',
        totalClasses: 8,
        completedClasses: 6,
        averageRating: 4.5,
        totalSpent: 1600000,
        lastClassDate: '2024-01-14',
        nextClassDate: '2024-01-18',
        progress: 60,
        goals: 'یادگیری زبان فرانسه برای سفر',
        notes: 'نیاز به تمرین بیشتر در گرامر'
      },
      {
        id: '3',
        first_name: 'فاطمه',
        last_name: 'کریمی',
        email: 'fateme@example.com',
        phone: '09111222333',
        avatar: null,
        level: 'پیشرفته',
        language: 'انگلیسی',
        status: 'active',
        totalClasses: 20,
        completedClasses: 18,
        averageRating: 4.9,
        totalSpent: 4000000,
        lastClassDate: '2024-01-16',
        nextClassDate: '2024-01-22',
        progress: 90,
        goals: 'آمادگی برای آزمون آیلتس',
        notes: 'دانش‌آموز بسیار قوی و منظم'
      },
      {
        id: '4',
        first_name: 'علی',
        last_name: 'احمدی',
        email: 'ali@example.com',
        phone: '09144555666',
        avatar: null,
        level: 'متوسط',
        language: 'آلمانی',
        status: 'inactive',
        totalClasses: 5,
        completedClasses: 3,
        averageRating: 4.2,
        totalSpent: 1000000,
        lastClassDate: '2024-01-10',
        nextClassDate: '',
        progress: 30,
        goals: 'یادگیری زبان آلمانی',
        notes: 'به دلیل مشغله کاری موقتاً غیرفعال'
      }
    ];

    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(student => student.status === activeTab);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, activeTab, students]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">فعال</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">غیرفعال</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">در انتظار</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'مبتدی':
        return 'text-blue-600 dark:text-blue-400';
      case 'متوسط':
        return 'text-green-600 dark:text-green-400';
      case 'پیشرفته':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalEarnings = students.reduce((sum, student) => sum + student.totalSpent, 0);
  const averageRating = students.reduce((sum, student) => sum + student.averageRating, 0) / students.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال بارگذاری</h3>
          <p className="text-gray-600 dark:text-gray-400">لیست دانش‌آموزان در حال آماده‌سازی است...</p>
        </div>
      </div>
    );
  }

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
                  مدیریت دانش‌آموزان
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  دانش‌آموزان خود را مدیریت و پیگیری کنید
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                افزودن دانش‌آموز
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">کل دانش‌آموزان</p>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm text-blue-100">{activeStudents} فعال</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">درآمد کل</p>
                  <p className="text-2xl font-bold">{totalEarnings.toLocaleString()}</p>
                  <p className="text-green-100 text-sm">تومان</p>
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
                  <p className="text-purple-100 text-sm">امتیاز متوسط</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm text-purple-100">از 5</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Star className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">کلاس‌های برگزار شده</p>
                  <p className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.completedClasses, 0)}</p>
                  <p className="text-orange-100 text-sm">کلاس</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو در دانش‌آموزان..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">همه</TabsTrigger>
                    <TabsTrigger value="active">فعال</TabsTrigger>
                    <TabsTrigger value="inactive">غیرفعال</TabsTrigger>
                    <TabsTrigger value="pending">در انتظار</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Students List */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  لیست دانش‌آموزان ({filteredStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                        selectedStudent?.id === student.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar || ''} alt={`${student.first_name} ${student.last_name}`} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                            {student.first_name[0]}{student.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {student.first_name} {student.last_name}
                            </h3>
                            {getStatusBadge(student.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <div className="flex items-center gap-1">
                              <Languages className="w-4 h-4" />
                              <span>{student.language}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              <span className={getLevelColor(student.level)}>{student.level}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{student.averageRating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{student.completedClasses}/{student.totalClasses} کلاس</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{student.totalSpent.toLocaleString()} تومان</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        دانش‌آموزی یافت نشد
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        هیچ دانش‌آموزی با این شرایط وجود ندارد
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Details */}
          <div className="lg:col-span-1">
            {selectedStudent ? (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    جزئیات دانش‌آموز
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Student Info */}
                  <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={selectedStudent.avatar || ''} alt={`${selectedStudent.first_name} ${selectedStudent.last_name}`} />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl">
                        {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedStudent.email}</p>
                    {getStatusBadge(selectedStudent.status)}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">اطلاعات تماس</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span>{selectedStudent.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>{selectedStudent.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">پیشرفت</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>پیشرفت کلی</span>
                        <span>{selectedStudent.progress}%</span>
                      </div>
                      <Progress value={selectedStudent.progress} className="h-2" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedStudent.completedClasses}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">کلاس تکمیل شده</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {selectedStudent.averageRating}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">امتیاز متوسط</div>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">اهداف</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStudent.goals}</p>
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">یادداشت‌ها</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStudent.notes}</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => router.push(`/teachers/students/${selectedStudent.id}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      مشاهده جزئیات کامل
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      ارسال پیام
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      رزرو کلاس
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    دانش‌آموزی انتخاب نشده
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    برای مشاهده جزئیات، یک دانش‌آموز را انتخاب کنید
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 