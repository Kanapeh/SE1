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
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              زبان‌های جدید را یاد بگیرید، <br />
              درهای جدید را باز کنید
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
              به آکادمی زبان{" "}
              <span className="text-cyan-600 font-bold"> SE1A </span> بپیوندید و
              با مربیان متخصص و روش‌های نوین یادگیری، سفر خود را به سوی تسلط
              زبانی آغاز کنید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <Image
              className="rounded-xl shadow-2xl"
              src={HeroImage}
              alt="Learning Languages"
              width={500}
              height={500}
            />
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
      <section
        className="py-20 px-4 text-white text-center bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/cta-background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/30 p-8 rounded-2xl backdrop-blur-sm"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">آماده‌اید شروع کنید؟</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              همین حالا ثبت‌نام کنید و یادگیری زبان را آغاز کنید. آینده شما منتظر است!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  ثبت‌نام رایگان
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  تماس با ما
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 