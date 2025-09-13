"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Brain, 
  Target, 
  Zap, 
  Users, 
  Globe, 
  BookOpen, 
  Award, 
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Heart,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function InteractiveFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      icon: Brain,
      title: "یادگیری هوشمند",
      description: "سیستم هوشمند تشخیص سطح و شخصی‌سازی آموزش",
      color: "from-blue-500 to-cyan-500",
      stats: "95% بهبود یادگیری",
      delay: 0
    },
    {
      icon: Globe,
      title: "کلاس‌های آنلاین",
      description: "دسترسی 24/7 به کلاس‌ها از هر جای دنیا",
      color: "from-purple-500 to-pink-500",
      stats: "500+ زبان‌آموز آنلاین",
      delay: 0.1
    },
    {
      icon: Target,
      title: "اهداف مشخص",
      description: "برنامه‌ریزی شخصی برای رسیدن به اهداف زبانی",
      color: "from-green-500 to-teal-500",
      stats: "100% موفقیت در اهداف",
      delay: 0.2
    },
    {
      icon: Zap,
      title: "سرعت بالا",
      description: "یادگیری سریع‌تر با روش‌های نوین",
      color: "from-orange-500 to-red-500",
      stats: "3x سرعت یادگیری",
      delay: 0.3
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "اساتید Native",
      description: "مدرسین بومی انگلیسی‌زبان",
      highlight: true
    },
    {
      icon: BookOpen,
      title: "محتوای به‌روز",
      description: "آخرین متدهای آموزشی",
      highlight: false
    },
    {
      icon: Award,
      title: "گواهینامه معتبر",
      description: "مدرک بین‌المللی معتبر",
      highlight: true
    },
    {
      icon: Clock,
      title: "انعطاف زمانی",
      description: "زمان‌بندی شخصی",
      highlight: false
    }
  ];


  return (
    <section ref={ref} className="py-32 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="mb-6 px-6 py-3 text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              ویژگی‌های منحصر به فرد
            </Badge>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
          >
            چرا سِ وان را
            <br />
            انتخاب کنید؟
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            با تکنولوژی‌های نوین و روش‌های اثبات شده، یادگیری زبان را به تجربه‌ای لذت‌بخش تبدیل کرده‌ایم
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        {/* Mobile: Horizontal scroll */}
        <div className="block md:hidden mb-20">
          <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-72"
              >
                <Card className="group p-6 text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:transform hover:-translate-y-3 h-full">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-3 text-sm">
                    {feature.description}
                  </p>
                  
                  <Badge className={`bg-gradient-to-r ${feature.color} text-white border-0 text-xs px-3 py-1`}>
                    {feature.stats}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.5 + feature.delay }}
            >
              <Card className="group p-8 text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:transform hover:-translate-y-3 h-full">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                  {feature.description}
                </p>
                
                <Badge className={`bg-gradient-to-r ${feature.color} text-white border-0 text-sm px-3 py-1`}>
                  {feature.stats}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-6">مزایای یادگیری با ما</h3>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto">
              با ما یادگیری زبان را به تجربه‌ای لذت‌بخش و مؤثر تبدیل کنید
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className={`text-center p-3 md:p-6 rounded-2xl ${benefit.highlight ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-white/10 backdrop-blur-sm'}`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-2xl flex items-center justify-center ${benefit.highlight ? 'bg-white/30' : 'bg-white/20'}`}>
                  <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h4 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2 leading-tight">{benefit.title}</h4>
                <p className="text-blue-100 text-xs md:text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-12 rounded-3xl text-white">
            <div className="flex items-center justify-center mb-6">
              <Lightbulb className="w-12 h-12 mr-4" />
              <h3 className="text-4xl font-bold">آماده شروع هستید؟</h3>
            </div>
            
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-xl">
              همین امروز سفر یادگیری زبان خود را با ما شروع کنید و به اهداف خود برسید!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 px-10 py-4 text-xl rounded-2xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-2xl">
                  <span className="mr-2">🚀</span>
                  شروع رایگان
                  <ArrowRight className="w-6 h-6 mr-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-3 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-xl rounded-2xl font-semibold transition-colors transform hover:scale-105 shadow-2xl">
                  <Heart className="w-6 h-6 mr-2" />
                  مشاهده دوره‌ها
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
