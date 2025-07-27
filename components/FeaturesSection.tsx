"use client";

import { Card } from "@/components/ui/card";
import { Target, Zap, Shield, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const benefits = [
    {
      icon: Target,
      title: "یادگیری هدفمند",
      description: "برنامه‌های شخصی‌سازی شده بر اساس نیازهای شما"
    },
    {
      icon: Zap,
      title: "پیشرفت سریع",
      description: "روش‌های نوین آموزشی برای یادگیری سریع‌تر"
    },
    {
      icon: Shield,
      title: "گواهینامه معتبر",
      description: "مدرک رسمی و قابل ترجمه پس از اتمام دوره"
    },
    {
      icon: Headphones,
      title: "پشتیبانی 24/7",
      description: "پشتیبانی شبانه‌روزی برای حل مشکلات شما"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">چرا سِ وان؟</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ما بهترین تجربه یادگیری زبان را با استفاده از تکنولوژی‌های مدرن و معلمان متخصص ارائه می‌دهیم
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 