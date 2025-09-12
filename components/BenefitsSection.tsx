"use client";

import { motion } from "framer-motion";
import { CheckCircle, Star, Users, Clock, Shield, Award } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: CheckCircle,
      title: "یادگیری تضمینی",
      description: "با روش‌های نوین آموزشی، یادگیری زبان را تضمین می‌کنیم"
    },
    {
      icon: Star,
      title: "معلمان متخصص",
      description: "تیم معلمان مجرب و متخصص در زمینه آموزش زبان"
    },
    {
      icon: Users,
      title: "کلاس‌های گروهی",
      description: "تجربه یادگیری تعاملی در محیطی دوستانه"
    },
    {
      icon: Clock,
      title: "انعطاف‌پذیری زمانی",
      description: "کلاس‌ها در ساعات مختلف و روزهای هفته"
    },
    {
      icon: Shield,
      title: "کیفیت تضمین شده",
      description: "تضمین کیفیت آموزش و رضایت دانش‌آموزان"
    },
    {
      icon: Award,
      title: "گواهینامه معتبر",
      description: "چه گواهی‌نامه‌ای از این بهتر که بتوانید به راحتی صحبت کنید"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            چرا سِ وان؟
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ما بهترین تجربه یادگیری زبان را با استفاده از تکنولوژی‌های مدرن و معلمان متخصص ارائه می‌دهیم
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                {benefit.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
