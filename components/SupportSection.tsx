"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Phone, Mail, Headphones, Clock, Users, Zap, Shield } from "lucide-react";
import { Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const supportMethods = [
  {
    icon: MessageCircle,
    title: "چت زنده",
    description: "پشتیبانی آنلاین در تمام ساعات شبانه‌روز",
    action: "شروع چت",
    gradient: "from-green-500 to-emerald-500",
    features: ["پاسخ فوری", "24/7", "متخصصان مجرب"],
    emoji: "💬"
  },
  {
    icon: Phone,
    title: "تماس تلفنی",
    description: "شماره: 00989387279975",
    action: "تماس بگیرید",
    gradient: "from-blue-500 to-cyan-500",
    features: ["پشتیبانی مستقیم", "حل سریع مشکل", "راهنمایی تخصصی"],
    emoji: "📞"
  },
  {
    icon: Mail,
    title: "ایمیل",
    description: "support@se1a.org",
    action: "ارسال ایمیل",
    gradient: "from-purple-500 to-pink-500",
    features: ["پاسخ دقیق", "مستندات کامل", "پیگیری آسان"],
    emoji: "📧"
  }
];

const supportFeatures = [
  {
    icon: Clock,
    title: "پشتیبانی 24/7",
    description: "در تمام ساعات شبانه‌روز در خدمت شما"
  },
  {
    icon: Users,
    title: "تیم متخصص",
    description: "کارشناسان مجرب و حرفه‌ای"
  },
  {
    icon: Zap,
    title: "پاسخ فوری",
    description: "حل مشکلات در کمترین زمان ممکن"
  },
  {
    icon: Shield,
    title: "امنیت کامل",
    description: "اطلاعات شما کاملاً محفوظ است"
  }
];

export default function SupportSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            پشتیبانی 24/7
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ما همیشه آماده کمک به شما هستیم. با ما در تماس باشید
          </p>
        </motion.div>

        {/* Support Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-3xl hover:-translate-y-2 group-hover:scale-[1.02]">
                {/* Header with gradient */}
                <div className={`h-32 bg-gradient-to-br ${method.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-6 h-6 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border border-white/30 rounded-full"></div>
                  </div>

                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                    {method.emoji}
                  </div>

                  {/* Method icon */}
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {method.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-1">
                      {method.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg">
                    <span className="mr-2">🚀</span>
                    {method.action}
                    <span className="ml-2">✨</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Support Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {supportFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-3xl text-white">
            <div className="flex items-center justify-center mb-4">
              <Headphones className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">نیاز به کمک دارید؟</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              تیم پشتیبانی ما آماده پاسخگویی به تمام سوالات و مشکلات شما است. 
              در هر زمان و هر مکان، ما در کنار شما هستیم!
            </p>
            <Button 
              onClick={() => window.open('https://wa.me/989387279975', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-20 h-20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
              title="ارتباط از طریق WhatsApp"
            >
              <Smartphone className="w-10 h-10" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 