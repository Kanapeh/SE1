"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ClipLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  level: string;
  title: string;
  description: string;
  duration: string;
  class_size: string;
  price: string;
  features: string[];
  color: string;
  badge: string;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("coursesstudents")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching courses:", fetchError);
        throw fetchError;
      }

      if (!data) {
        throw new Error("No data received");
      }

      console.log("Fetched courses:", data);
      setCourses(data as Course[]);
    } catch (err: any) {
      console.error("Error in fetchCourses:", err);
      setError(err.message || "خطا در دریافت لیست دوره‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("آیا از حذف این دوره اطمینان دارید؟")) return;

    try {
      const { error } = await supabase
        .from("coursesstudents")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err: any) {
      console.error("Error deleting course:", err);
      alert("خطا در حذف دوره");
    }
  };

  const handleToggleStatus = async (course: Course) => {
    try {
      const newStatus = course.status === "active" ? "inactive" : "active";
      const { error } = await supabase
        .from("coursesstudents")
        .update({ status: newStatus })
        .eq("id", course.id);

      if (error) throw error;

      setCourses(
        courses.map((c) =>
          c.id === course.id ? { ...c, status: newStatus } : c
        )
      );
    } catch (err: any) {
      console.error("Error updating course status:", err);
      alert("خطا در تغییر وضعیت دوره");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.level.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#000000" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">مدیریت دوره‌ها</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/admin/courses/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              افزودن دوره جدید
            </Button>
          </Link>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {searchQuery
            ? "هیچ دوره‌ای با این مشخصات یافت نشد"
            : "هیچ دوره‌ای ثبت نشده است"}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان دوره</TableHead>
                <TableHead>سطح</TableHead>
                <TableHead>مدت زمان</TableHead>
                <TableHead>ظرفیت کلاس</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>{course.class_size}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>
                    <Button
                      variant={course.status === "active" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleStatus(course)}
                    >
                      {course.status === "active" ? "فعال" : "غیرفعال"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 