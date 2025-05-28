"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, Calendar, BookOpen } from "lucide-react";
import { use } from "react";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
  level: string;
  status: string;
  progress: number;
}

export default function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    fetchStudentDetails();
    fetchStudentCourses();
  }, [resolvedParams.id]);

  const fetchStudentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("خطا در دریافت اطلاعات دانش‌آموز");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          course_id,
          status,
          enrollment_date,
          coursesstudents!inner (
            id,
            title,
            level,
            status
          )
        `)
        .eq("user_id", resolvedParams.id);

      if (error) throw error;

      const formattedCourses = data?.map((item: any) => ({
        id: item.coursesstudents.id,
        title: item.coursesstudents.title,
        level: item.coursesstudents.level,
        status: item.status || item.coursesstudents.status,
        progress: Math.floor(Math.random() * 100), // این مقدار باید از دیتابیس خوانده شود
      })) || [];

      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching student courses:", error);
      toast.error("خطا در دریافت دوره‌های دانش‌آموز");
    }
  };

  const handleAccessDashboard = () => {
    router.push(`/student/${resolvedParams.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">دانش‌آموز یافت نشد</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        بازگشت
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>اطلاعات دانش‌آموز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 ml-2 text-gray-500" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 ml-2 text-gray-500" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 ml-2 text-gray-500" />
                <span>
                  {new Date(student.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleAccessDashboard}
              >
                دسترسی به پنل دانش‌آموز
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>دوره‌های دانش‌آموز</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">دوره‌های فعال</TabsTrigger>
                <TabsTrigger value="completed">دوره‌های تکمیل شده</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <div className="space-y-4">
                  {courses
                    .filter((course) => course.status === "active")
                    .map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 ml-2 text-primary" />
                          <div>
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-gray-500">
                              سطح: {course.level}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          پیشرفت: {course.progress}%
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="space-y-4">
                  {courses
                    .filter((course) => course.status === "completed")
                    .map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 ml-2 text-green-500" />
                          <div>
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-gray-500">
                              سطح: {course.level}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-green-500">تکمیل شده</div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 