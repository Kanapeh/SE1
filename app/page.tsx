"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "../components/images/Hero.jpg";
import { motion } from "framer-motion";
import InstagramStories from "@/components/InstagramStories";
import InstagramStoriesMobile from "@/components/InstagramStoriesMobile";

// Import all the new components
import StatisticsSection from "@/components/StatisticsSection";
import FeaturesSection from "@/components/FeaturesSection";
import TopTeachersSection from "@/components/TopTeachersSection";
import PopularCoursesSection from "@/components/PopularCoursesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SupportSection from "@/components/SupportSection";
import AppDownloadSection from "@/components/AppDownloadSection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Instagram Stories Section */}
      <div className="hidden md:block">
        <InstagramStories />
      </div>
      <div className="md:hidden">
        <InstagramStoriesMobile />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center md:justify-end order-2 md:order-1"
          >
            <Image
              className="rounded-xl shadow-2xl"
              src={HeroImage}
              alt="Learning Languages"
              width={500}
              height={500}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center md:items-end text-center md:text-right order-1 md:order-2"
          >
            <h1 className="text-3xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              زبان‌های جدید را یاد بگیرید، <br />
              درهای جدید را باز کنید
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
              به آکادمی زبان{" "}
              <span className="text-cyan-600 font-bold"> سِ وان </span> بپیوندید و
              با مربیان متخصص و روش‌های نوین یادگیری، سفر خود را به سوی تسلط
              زبانی آغاز کنید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <Play className="w-4 h-4 mr-2" />
                  الان شروع کنید
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  دوره‌ها را ببینید
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Top Teachers Section */}
      <TopTeachersSection />

      {/* Popular Courses Section */}
      <PopularCoursesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Support Section */}
      <SupportSection />

      {/* App Download Section */}
      <AppDownloadSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1500"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Main Content */}
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  آماده‌اید شروع کنید؟
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  همین حالا ثبت‌نام کنید و یادگیری زبان را آغاز کنید. 
                  <span className="text-yellow-300 font-bold">آینده شما منتظر است!</span>
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="mr-2">🚀</span>
                    ثبت‌نام رایگان
                    <span className="ml-2">✨</span>
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white/50 text-white hover:bg-white hover:text-purple-600 font-bold text-lg px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-2">📞</span>
                    تماس با ما
                    <span className="ml-2">💬</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-8 pt-8 border-t border-white/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span className="text-2xl">🎯</span>
                    <span className="text-sm">یادگیری تضمینی</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span className="text-2xl">⭐</span>
                    <span className="text-sm">معلمان متخصص</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span className="text-2xl">💎</span>
                    <span className="text-sm">کیفیت برتر</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 