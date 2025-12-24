"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  UserPlus,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Languages,
  Star
} from "lucide-react";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string | null;
  languages: string[];
  levels: string[] | null;
  experience_years: number | null;
  hourly_rate: number | null;
  location: string | null;
  created_at: string;
  bio: string | null;
  available: boolean | null;
}

export default function TeachersManagementPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      console.log("🔍 Fetching teachers...");

      // First, let's test the connection
      console.log("🔌 Testing Supabase connection...");
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("👤 Current user:", user?.email, "Auth error:", authError);

      if (authError) {
        console.error("❌ Auth error:", authError);
        setError("خطا در احراز هویت");
        setErrorDetails({
          code: 'AUTH_ERROR',
          message: authError.message
        });
        return;
      }

      if (!user) {
        console.error("❌ No user found");
        setError("کاربر یافت نشد");
        setErrorDetails({
          code: 'NO_USER',
          message: 'لطفاً دوباره وارد شوید'
        });
        return;
      }

      // Test basic table access
      console.log("🧪 Testing basic table access...");
      const { data: testData, error: testError } = await supabase
        .from('teachers')
        .select('id')
        .limit(1);
      
      console.log("🧪 Test query result:", { testData, testError });

      if (testError) {
        console.error("❌ Test query failed:", testError);
        setError("خطا در دسترسی به جدول معلمان");
        setErrorDetails({
          code: testError.code || 'TEST_ERROR',
          message: testError.message || 'خطا در تست دسترسی'
        });
        return;
      }

      // First, let's check if we can access the table at all
      const { data: countData, error: countError } = await supabase
        .from('teachers')
        .select('id', { count: 'exact', head: true });

      console.log("📊 Count query result:", { countData, countError });

      if (countError) {
        console.error("❌ Error counting teachers:", countError);
        console.error("❌ Error details:", {
          message: countError.message,
          code: countError.code,
          details: countError.details,
          hint: countError.hint
        });
        
        // Check if it's a permission issue
        if (countError.code === '42501') {
          console.error("🚨 Permission denied - This is likely an RLS policy issue");
          console.error("💡 Solution: Run the admin_teachers_access.sql script in Supabase");
          setError("دسترسی رد شد - مشکل در تنظیمات امنیتی دیتابیس");
          setErrorDetails({
            code: countError.code,
            message: "برای حل این مشکل، فایل admin_teachers_access.sql را در Supabase اجرا کنید"
          });
        }
        
        // Check if table doesn't exist
        if (countError.code === '42P01') {
          console.error("🚨 Table 'teachers' does not exist");
          console.error("💡 Solution: Run the admin_teachers_access.sql script in Supabase");
          setError("جدول معلمان وجود ندارد");
          setErrorDetails({
            code: countError.code,
            message: "برای حل این مشکل، فایل admin_teachers_access.sql را در Supabase اجرا کنید"
          });
        }
        
        return;
      }

      console.log("📊 Total teachers count:", countData?.length || 0);

      // Now fetch all teachers
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("📋 Fetch query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching teachers:", error);
        console.error("❌ Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Check if it's a permission issue
        if (error.code === '42501') {
          console.error("🚨 Permission denied - This is likely an RLS policy issue");
          console.error("💡 Solution: Run the admin_teachers_access.sql script in Supabase");
          setError("دسترسی رد شد - مشکل در تنظیمات امنیتی دیتابیس");
          setErrorDetails({
            code: error.code,
            message: "برای حل این مشکل، فایل admin_teachers_access.sql را در Supabase اجرا کنید"
          });
        }
        
        return;
      }

      console.log("✅ Teachers fetched successfully");
      // Log teachers data without avatar to avoid cluttering console
      if (data && Array.isArray(data)) {
        const teachersSummary = data.map((teacher: any) => {
          const { avatar, ...teacherWithoutAvatar } = teacher;
          return {
            ...teacherWithoutAvatar,
            avatar: avatar ? `[Avatar: ${avatar.substring(0, 50)}... (${avatar.length} chars)]` : 'No avatar'
          };
        });
        console.log("📋 Teachers data:", teachersSummary);
      } else {
        console.log("📋 Teachers data:", data);
      }
      console.log("🔢 Number of teachers:", data?.length || 0);
      
      setTeachers(data || []);
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      setError("خطای غیرمنتظره رخ داده است");
      setErrorDetails({
        code: 'UNEXPECTED_ERROR',
        message: error instanceof Error ? error.message : 'خطای نامشخص'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTeacherStatus = async (teacherId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating teacher ${teacherId} status to ${newStatus}`);

      const { error } = await supabase
        .from('teachers')
        .update({ status: newStatus })
        .eq('id', teacherId);

      if (error) {
        console.error("❌ Error updating teacher status:", error);
        return;
      }

      console.log("✅ Teacher status updated successfully");
      
      // Update local state
      setTeachers(prev => prev.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, status: newStatus }
          : teacher
      ));

      // Update selected teacher if it's the same one
      if (selectedTeacher?.id === teacherId) {
        setSelectedTeacher(prev => prev ? { ...prev, status: newStatus } : null);
      }

    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || teacher.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">فعال</Badge>;
      case 'Approved':
        return <Badge className="bg-blue-100 text-blue-800">تایید شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">در انتظار</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">رد شده</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status || 'نامشخص'}</Badge>;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
      case 'Approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>در حال بارگذاری معلمان...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">مدیریت معلمان</h1>
          <p className="text-muted-foreground">
            مدیریت و تایید معلمان ثبت‌نام شده
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            افزودن معلم
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                خطا در دسترسی به معلمان
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="mb-2">{error}</p>
                {errorDetails && (
                  <div className="bg-red-100 rounded p-3">
                    <p className="font-medium">کد خطا: {errorDetails.code}</p>
                    <p className="mt-1">{errorDetails.message}</p>
                  </div>
                )}
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
                  <h4 className="font-medium text-blue-800 mb-2">راه‌حل:</h4>
                  <ol className="list-decimal list-inside text-blue-700 space-y-1">
                    <li>به Supabase Dashboard بروید</li>
                    <li>روی &ldquo;SQL Editor&rdquo; کلیک کنید</li>
                    <li>فایل <code className="bg-blue-100 px-1 rounded">database/admin_teachers_access.sql</code> را اجرا کنید</li>
                    <li>فایل <code className="bg-blue-100 px-1 rounded">database/add_current_user_as_admin.sql</code> را اجرا کنید</li>
                    <li>صفحه را refresh کنید</li>
                  </ol>
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      onClick={() => {
                        setError(null);
                        setErrorDetails(null);
                        fetchTeachers();
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      تلاش مجدد
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Refresh صفحه
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">کل معلمان</p>
              <p className="text-2xl font-bold">{teachers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">تایید شده</p>
              <p className="text-2xl font-bold">
                {teachers.filter(t => t.status === 'active' || t.status === 'Approved').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
            <div>
              <p className="text-sm text-muted-foreground">در انتظار</p>
              <p className="text-2xl font-bold">
                {teachers.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">رد شده</p>
              <p className="text-2xl font-bold">
                {teachers.filter(t => t.status === 'rejected').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در معلمان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="Approved">تایید شده</option>
              <option value="active">فعال</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Teachers List */}
      <div className="space-y-4">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {teacher.first_name} {teacher.last_name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{teacher.email}</span>
                    {teacher.phone && (
                      <>
                        <Phone className="w-4 h-4" />
                        <span>{teacher.phone}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {teacher.languages && teacher.languages.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {teacher.languages.join(', ')}
                      </Badge>
                    )}
                    {teacher.experience_years && (
                      <Badge variant="outline" className="text-xs">
                        {teacher.experience_years} سال تجربه
                      </Badge>
                    )}
                    {teacher.hourly_rate && (
                      <Badge variant="outline" className="text-xs">
                        {teacher.hourly_rate} تومان/ساعت
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusBadge(teacher.status)}
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setShowDetails(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  ثبت‌نام: {new Date(teacher.created_at).toLocaleDateString('fa-IR')}
                </div>
                <div className="flex space-x-2">
                  {teacher.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateTeacherStatus(teacher.id, 'Approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        تایید
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTeacherStatus(teacher.id, 'rejected')}
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        رد
                      </Button>
                    </>
                  )}
                  {teacher.status === 'Approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTeacherStatus(teacher.id, 'active')}
                    >
                      فعال‌سازی
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredTeachers.length === 0 && (
          <Card className="p-8 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">معلمی یافت نشد</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'با فیلترهای انتخاب شده معلمی یافت نشد'
                : 'هنوز معلمی ثبت‌نام نکرده است'
              }
            </p>
          </Card>
        )}
      </div>

      {/* Teacher Details Modal */}
      {showDetails && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">جزئیات معلم</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  بستن
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">نام</label>
                    <p className="font-medium">{selectedTeacher.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">نام خانوادگی</label>
                    <p className="font-medium">{selectedTeacher.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ایمیل</label>
                    <p className="font-medium">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">تلفن</label>
                    <p className="font-medium">{selectedTeacher.phone || 'ثبت نشده'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">وضعیت</label>
                    <div className="mt-1">{getStatusBadge(selectedTeacher.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">تجربه</label>
                    <p className="font-medium">{selectedTeacher.experience_years || 0} سال</p>
                  </div>
                </div>

                {selectedTeacher.bio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">بیوگرافی</label>
                    <p className="mt-1 text-sm">{selectedTeacher.bio}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateTeacherStatus(selectedTeacher.id, 'Approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    تایید معلم
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateTeacherStatus(selectedTeacher.id, 'rejected')}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    رد معلم
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
