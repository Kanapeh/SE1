"use client";

import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

export default function AppDownloadSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">اپلیکیشن موبایل SE1A</h2>
            <p className="text-lg text-muted-foreground mb-8">
              یادگیری زبان را با خود همراه داشته باشید. اپلیکیشن ما را دانلود کنید و در هر زمان و مکان زبان یاد بگیرید.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>کلاس‌های آنلاین در موبایل</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>تمرین‌های تعاملی</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>پیگیری پیشرفت</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>چت با معلمان</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button size="lg" className="bg-black hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                دانلود برای iOS
              </Button>
              <Button size="lg" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                دانلود برای Android
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl inline-block">
              <Smartphone className="h-32 w-32 mx-auto text-primary mb-4" />
              <div className="text-2xl font-bold mb-2">SE1A App</div>
              <div className="text-muted-foreground">در دسترس برای iOS و Android</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 