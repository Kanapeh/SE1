"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const popularCourses = [
  {
    id: "1",
    title: "مکالمه انگلیسی پیشرفته",
    teacher: "سپنتا علیزاده",
    price: 1200000,
    duration: "3 ماه",
    students: 45,
    rating: 4.9,
  },
  {
    id: "2",
    title: "آمادگی آیلتس",
    teacher: "نجمه کریمی", 
    price: 1800000,
    duration: "4 ماه",
    students: 32,
    rating: 4.8,
  },
  {
    id: "3",
    title: "گرامر انگلیسی",
    teacher: "پارمیدا معصومی",
    price: 900000,
    duration: "2 ماه", 
    students: 67,
    rating: 4.7,
  }
];

export default function PopularCoursesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">دوره‌های محبوب</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            محبوب‌ترین دوره‌های ما که توسط هزاران دانش‌آموز انتخاب شده‌اند
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-primary">محبوب</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-muted-foreground mb-3">مدرس: {course.teacher}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-muted-foreground">({course.students} دانش‌آموز)</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {course.price.toLocaleString()} تومان
                    </div>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full">
                      مشاهده دوره
                      <ChevronRight className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 