"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test simple query first
      console.log("🧪 Testing simple query...");
      const testResult = await supabase
        .from("coursesstudents")
        .select("id")
        .limit(1);
      
      console.log("🧪 Test query result:", testResult);
      
      if (testResult.error) {
        console.error("❌ Test query failed:", testResult.error);
        console.error("Test error details:", {
          message: testResult.error.message || 'No message',
          details: testResult.error.details || 'No details',
          hint: testResult.error.hint || 'No hint',
          code: testResult.error.code || 'No code'
        });
        throw testResult.error;
      }
      
      const { data, error: fetchError } = await supabase
        .from("coursesstudents")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching courses:", fetchError);
        console.error("Error details:", {
          message: fetchError.message || 'No message',
          details: fetchError.details || 'No details',
          hint: fetchError.hint || 'No hint',
          code: fetchError.code || 'No code'
        });
        console.error("Full error object:", JSON.stringify(fetchError, null, 2));
        throw fetchError;
      }

      if (!data) {
        throw new Error("No data received");
      }

      console.log("Fetched courses:", data);
      setCourses(data as Course[]);
    } catch (err: any) {
      console.error("Error in fetchCourses:", err);
      console.error("Error type:", typeof err);
      console.error("Error stringified:", JSON.stringify(err, null, 2));
      setError(err.message || "خطا در دریافت دوره‌ها");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="hsl(var(--foreground))" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <motion.div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">دوره‌های زبان انگلیسی</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            دوره‌ای متناسب با سطح خود انتخاب کنید و مهارت‌های زبان انگلیسی خود
            را تقویت کنید.
          </p>
        </motion.div>

        {courses.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            در حال حاضر دوره‌ای موجود نیست
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <motion.div key={course.id}>
                <Card className="overflow-hidden h-full rounded-lg shadow-lg bg-card border">
                  {/* تصویر دوره */}
                  <div className="relative">
                    {course.image_url && (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <Badge className="absolute top-4 right-4 bg-primary text-white">
                      {course.badge}
                    </Badge>
                  </div>

                  {/* محتوای دوره */}
                  <div className="p-6 flex flex-col space-y-4 text-foreground">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <h3 className="text-sm font-semibold text-primary">
                        {course.level}
                      </h3>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{course.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{course.description}</p>

                    {/* اطلاعات دوره */}
                    <div className="mt-4 p-4 bg-muted rounded-lg shadow-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-foreground">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-foreground">{course.class_size}</span>
                        </div>
                      </div>
                    </div>

                    {/* ویژگی‌های دوره */}
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2 text-foreground">ویژگی‌های دوره:</h4>
                      <div className="flex flex-col space-y-2">
                        {course.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                            <span className="text-foreground text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* قیمت و دکمه ثبت‌نام */}
                    <div className="mt-6 text-center">
                      <div className="text-3xl font-bold text-foreground">
                        {course.price}
                        <span className="text-base font-normal text-muted-foreground">
                          {" "}
                          /دوره
                        </span>
                      </div>
                      <Link href="/get-started" className="block mt-4">
                        <Button className="w-full group">
                          ثبت نام اکنون
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
