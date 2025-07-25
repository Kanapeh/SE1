"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe2, BookOpen, Users, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "../components/images/Hero.jpg";
import { motion } from "framer-motion";
import InstagramStories from "@/components/InstagramStories";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Instagram Stories Section */}
      <InstagramStories />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* بخش متن سمت چپ */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
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
                <Button size="lg">الان شروع کنید</Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  دوره‌ها را ببینید
                </Button>
              </Link>
            </div>
          </div>

          {/* تصویر سمت راست */}
          <div className="flex justify-center">
            <Image
              className="rounded-xl"
              src={HeroImage}
              alt="Learning Languages"
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <Card className="p-6 bg-purple-200 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700">
              <Globe2 className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">متد های جهانی</h3>
              <p className="text-muted-foreground">
                از روش‌های مدرن و جهانی برای یادگیری زبان استفاده کنید.
              </p>
            </Card>
            <Card className="p-6 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700">
              <BookOpen className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">تدریس تخصصی</h3>
              <p className="text-muted-foreground">
                از معلمان مجرب با سال‌ها تجربه یاد بگیرید.
              </p>
            </Card>
            <Card className="p-6 bg-green-200 dark:bg-green-900/20 border-green-300 dark:border-green-700">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">کلاس‌های کوچک</h3>
              <p className="text-muted-foreground">
                توجه شخصی در گروه‌های کوچک.
              </p>
            </Card>
            <Card className="p-6 bg-pink-300 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700">
              <Trophy className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">گواهینامه</h3>
              <p className="text-muted-foreground">
                پس از اتمام دوره، گواهینامه‌های معتبر دریافت کنید.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            سوالات متداول
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟",
                answer:
                  "برای ثبت‌نام، کافی است به صفحه ثبت‌نام مراجعه کرده و فرم مربوطه را پر کنید.",
              },
              {
                question: "آیا دوره‌ها به صورت آنلاین برگزار می‌شوند؟",
                answer:
                  "بله، ما دوره‌های آنلاین و حضوری را برای راحتی شما ارائه می‌دهیم.",
              },
              {
                question: "آیا پس از اتمام دوره گواهینامه دریافت می‌کنم؟",
                answer:
                  "بله، پس از اتمام موفقیت‌آمیز دوره، گواهینامه معتبر دریافت خواهید کرد.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-background p-6 rounded-lg shadow-md border"
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-20 px-4 text-white text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/cta-background.jpg')", // مسیر تصویر در پوشه public
        }}
      >
        <div className="container mx-auto">
          {/* لایه نیمه‌شفاف */}
          <div className="bg-black/50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">آماده‌اید شروع کنید؟</h2>
            <p className="text-lg mb-8">
              همین حالا ثبت‌نام کنید و یادگیری زبان را آغاز کنید.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                ثبت‌نام
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
