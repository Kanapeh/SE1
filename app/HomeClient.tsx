"use client";

import { Suspense, lazy } from "react";
import Hero from "@/components/Hero";

// Lazy load non-critical sections for better performance
const InteractiveFeatures = lazy(() => import("@/components/InteractiveFeatures"));
const PopularCoursesSection = lazy(() => import("@/components/PopularCoursesSection"));
const TopTeachersSection = lazy(() => import("@/components/TopTeachersSection"));
const StatisticsSection = lazy(() => import("@/components/StatisticsSection"));
const BenefitsSection = lazy(() => import("@/components/BenefitsSection"));
const YouTubeVideosSection = lazy(() => import("@/components/YouTubeVideosSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const SupportSection = lazy(() => import("@/components/SupportSection"));
const AppDownloadSection = lazy(() => import("@/components/AppDownloadSection"));

// Loading component for better UX
const SectionLoader = () => (
  <div className="w-full h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
);

export default function HomeClient() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Lazy load sections with intersection observer */}
      <Suspense fallback={<SectionLoader />}>
        <InteractiveFeatures />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <PopularCoursesSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TopTeachersSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <StatisticsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <BenefitsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <YouTubeVideosSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <SupportSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <AppDownloadSection />
      </Suspense>
    </main>
  );
}
