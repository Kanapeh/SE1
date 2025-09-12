"use client";

import Hero from "@/components/Hero";
import PopularCoursesSection from "@/components/PopularCoursesSection";
import TopTeachersSection from "@/components/TopTeachersSection";
import StatisticsSection from "@/components/StatisticsSection";
import BenefitsSection from "@/components/BenefitsSection";
import YouTubeVideosSection from "@/components/YouTubeVideosSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import SupportSection from "@/components/SupportSection";
import AppDownloadSection from "@/components/AppDownloadSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PopularCoursesSection />
      <TopTeachersSection />
      <StatisticsSection />
      <BenefitsSection />
      <YouTubeVideosSection />
      <TestimonialsSection />
      <FAQSection />
      <SupportSection />
      <AppDownloadSection />
    </main>
  );
} 