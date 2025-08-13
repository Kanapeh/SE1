"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Languages, 
  Clock, 
  DollarSign, 
  MapPin, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Video,
  Globe
} from "lucide-react";
import React from "react";

export default function TeacherRegistrationDemo() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: "ثبت‌نام 5 مرحله‌ای",
      description: "فرم جامع و کاربرپسند برای جمع‌آوری تمام اطلاعات مورد نیاز",
      icon: GraduationCap,
      details: [
        "اطلاعات پایه (نام، ایمیل، تلفن، کد ملی)",
        "پروفایل تدریس (زبان‌ها، سطح‌ها، تجربه)",
        "زمان‌بندی و قیمت‌گذاری",
        "مدارک و روش‌های تدریس",
        "تایید نهایی و خلاصه اطلاعات"
      ]
    },
    {
      title: "12 زبان تدریس",
      description: "پشتیبانی از زبان‌های مختلف با آیکون و پرچم",
      icon: Languages,
      details: [
        "فارسی 🇮🇷، انگلیسی 🇺🇸، عربی 🇸🇦",
        "فرانسه 🇫🇷، آلمانی 🇩🇪، اسپانیایی 🇪🇸",
        "ایتالیایی 🇮🇹، روسی 🇷🇺، چینی 🇨🇳",
        "ژاپنی 🇯🇵، کره‌ای 🇰🇷، ترکی 🇹🇷"
      ]
    },
    {
      title: "10 سطح تدریس",
      description: "از مبتدی تا پیشرفته و تخصصی",
      icon: Award,
      details: [
        "مبتدی، متوسط، پیشرفته",
        "آکادمیک، آیلتس، تافل",
        "مکالمه، گرامر، تجاری",
        "تخصصی کودکان"
      ]
    },
    {
      title: "انعطاف‌پذیری زمانی",
      description: "تنظیم روزها و ساعات کاری",
      icon: Clock,
      details: [
        "انتخاب روزهای کاری (شنبه تا جمعه)",
        "ساعات کاری (صبح، ظهر، عصر، شب)",
        "قیمت‌گذاری ساعتی",
        "حداکثر تعداد دانش‌آموز در کلاس"
      ]
    },
    {
      title: "روش‌های تدریس",
      description: "انتخاب از 7 روش مختلف تدریس",
      icon: Users,
      details: [
        "روش ارتباطی",
        "ترجمه گرامری",
        "روش مستقیم",
        "شنیداری-گفتاری",
        "مبتنی بر وظیفه",
        "مبتنی بر محتوا",
        "ترکیبی"
      ]
    },
    {
      title: "نوع کلاس",
      description: "پشتیبانی از کلاس‌های مختلف",
      icon: Video,
      details: [
        "کلاس آنلاین",
        "کلاس حضوری",
        "کلاس ترکیبی"
      ]
    }
  ];

  const benefits = [
    {
      title: "فرم کاربرپسند",
      description: "طراحی زیبا و انیمیشن‌های نرم",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800"
    },
    {
      title: "اعتبارسنجی هوشمند",
      description: "بررسی فیلدها در هر مرحله",
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "ذخیره خودکار",
      description: "اطلاعات در دیتابیس ذخیره می‌شود",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "امنیت بالا",
      description: "RLS policies و validation",
      icon: CheckCircle,
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            سیستم ثبت‌نام چند مرحله‌ای معلمان
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            یک راه‌حل کامل و حرفه‌ای برای ثبت‌نام معلمان در پلتفرم‌های آموزش زبان
            با تمام ویژگی‌های مورد نیاز سایت‌های معتبر مانند Preply
          </p>
        </div>

        {/* Feature Showcase */}
        <Card className="p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ویژگی‌های کلیدی
            </h2>
            <p className="text-gray-600">
              کلیک کنید تا ویژگی‌های مختلف را مشاهده کنید
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <Button
              variant="outline"
              onClick={prevFeature}
              className="mr-4"
            >
              قبلی
            </Button>
            
            <div className="flex items-center space-x-2">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentFeature ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={nextFeature}
              className="ml-4"
            >
              بعدی
            </Button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              {React.createElement(features[currentFeature].icon, { className: "w-10 h-10 text-blue-600" })}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {features[currentFeature].title}
            </h3>
            
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {features[currentFeature].description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {features[currentFeature].details.map((detail, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse text-right">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                {React.createElement(benefit.icon, { className: "w-8 h-8 text-green-600" })}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Registration Steps Preview */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            مراحل ثبت‌نام
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: 1, title: "اطلاعات پایه", icon: Users, color: "bg-blue-500" },
              { step: 2, title: "پروفایل تدریس", icon: GraduationCap, color: "bg-green-500" },
              { step: 3, title: "زمان‌بندی", icon: Clock, color: "bg-yellow-500" },
              { step: 4, title: "مدارک", icon: Award, color: "bg-purple-500" },
              { step: 5, title: "تایید نهایی", icon: CheckCircle, color: "bg-red-500" }
            ].map((stepInfo) => (
              <div key={stepInfo.step} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stepInfo.color} text-white rounded-full mb-4`}>
                  {React.createElement(stepInfo.icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  مرحله {stepInfo.step}
                </h3>
                <p className="text-gray-600 text-sm">
                  {stepInfo.title}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            آماده شروع هستید؟
          </h2>
          <p className="text-xl mb-6 opacity-90">
            سیستم ثبت‌نام چند مرحله‌ای معلمان را امتحان کنید
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.location.href = '/register/teacher'}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              شروع ثبت‌نام
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/register?type=teacher'}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              بازگشت به صفحه اصلی
            </Button>
          </div>
        </Card>

        {/* Technical Details */}
        <Card className="p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            جزئیات فنی
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Frontend</h3>
              <div className="space-y-2">
                <Badge variant="secondary">React 18</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Framer Motion</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Backend</h3>
              <div className="space-y-2">
                <Badge variant="secondary">Supabase</Badge>
                <Badge variant="secondary">PostgreSQL</Badge>
                <Badge variant="secondary">RLS Policies</Badge>
                <Badge variant="secondary">Full-Text Search</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Features</h3>
              <div className="space-y-2">
                <Badge variant="secondary">Multi-step Form</Badge>
                <Badge variant="secondary">Real-time Validation</Badge>
                <Badge variant="secondary">Responsive Design</Badge>
                <Badge variant="secondary">Security First</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
