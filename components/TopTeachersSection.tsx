"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Import teachers data from the teachers page
const topTeachers = [
  {
    id: "1",
    name: "سپنتا علیزاده",
    specialty: "مکالمه انگلیسی",
    rating: 4.9,
    students: 156,
    avatar: "/images/teacher1.jpg",
    experience: 8,
    hourlyRate: 250000
  },
  {
    id: "2", 
    name: "پارمیدا معصومی",
    specialty: "گرامر پیشرفته",
    rating: 4.8,
    students: 203,
    avatar: "/images/teacher2.jpg",
    experience: 12,
    hourlyRate: 300000
  },
  {
    id: "3",
    name: "نجمه کریمی",
    specialty: "آیلتس",
    rating: 4.7,
    students: 89,
    avatar: "/images/teacher3.jpg",
    experience: 6,
    hourlyRate: 280000
  }
];

export default function TopTeachersSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">معلمان برتر ما</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            با بهترین معلمان زبان که سال‌ها تجربه در آموزش دارند آشنا شوید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">{teacher.name}</h3>
                <Badge variant="secondary" className="mb-3">{teacher.specialty}</Badge>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{teacher.rating}</span>
                  <span className="text-sm text-muted-foreground">({teacher.students} دانش‌آموز)</span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {teacher.experience} سال تجربه • {teacher.hourlyRate.toLocaleString()} تومان/ساعت
                </div>
                <Link href={`/teachers/${teacher.id}`}>
                  <Button variant="outline" className="w-full">
                    مشاهده پروفایل
                    <ChevronRight className="w-4 h-4 mr-2" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/teachers">
            <Button size="lg" variant="outline">
              مشاهده همه معلمان
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 