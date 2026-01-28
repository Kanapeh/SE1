"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, ArrowRight, Sparkles } from "lucide-react";

export default function SelectUserTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelect = (type: 'teacher' | 'student') => {
    setSelectedType(type);
    // Navigate to register page with type parameter
    router.push(`/register?type=${type}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            به آکادمی زبان سِ وان خوش آمدید
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            لطفاً نوع حساب کاربری خود را انتخاب کنید
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Teacher Option */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className={`p-8 h-full cursor-pointer transition-all duration-300 border-2 ${
                selectedType === 'teacher'
                  ? 'border-blue-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
              onClick={() => handleSelect('teacher')}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
                >
                  <GraduationCap className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  معلم هستم
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  می‌خواهم به عنوان معلم در پلتفرم تدریس کنم و دانش‌آموزان را آموزش دهم
                </p>
                <ul className="text-right text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center justify-end gap-2">
                    <span>✅</span>
                    <span>ایجاد پروفایل معلم</span>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>✅</span>
                    <span>مدیریت کلاس‌ها</span>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>✅</span>
                    <span>دریافت درآمد</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect('teacher');
                  }}
                >
                  ثبت‌نام به عنوان معلم
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Student Option */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              className={`p-8 h-full cursor-pointer transition-all duration-300 border-2 ${
                selectedType === 'student'
                  ? 'border-green-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
              }`}
              onClick={() => handleSelect('student')}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl mb-6 shadow-lg"
                >
                  <User className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  دانش‌آموز هستم
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  می‌خواهم زبان یاد بگیرم و با معلمان مجرب کلاس بردارم
                </p>
                <ul className="text-right text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center justify-end gap-2">
                    <span>✅</span>
                    <span>یادگیری زبان</span>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>✅</span>
                    <span>رزرو کلاس با معلم</span>
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>✅</span>
                    <span>پیگیری پیشرفت</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-6 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect('student');
                  }}
                >
                  ثبت‌نام به عنوان دانش‌آموز
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            قبلاً حساب کاربری دارید؟{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              ورود کنید
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
