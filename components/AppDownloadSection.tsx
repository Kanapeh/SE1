"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Smartphone, Share2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function AppDownloadSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app was just installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show instructions
      alert(
        "برای نصب اپلیکیشن:\n\n" +
        "1. دکمه Share (اشتراک‌گذاری) در پایین صفحه Safari را بزنید\n" +
        "2. گزینه 'Add to Home Screen' را انتخاب کنید\n" +
        "3. دکمه 'Add' را بزنید"
      );
      return;
    }

    if (!deferredPrompt) {
      alert("مرورگر شما از نصب اپلیکیشن پشتیبانی نمی‌کند. لطفاً از Chrome یا Edge استفاده کنید.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return null; // Don't show section if app is already installed
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-right"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">دانلود برنامه سِ وان</h2>
            <p className="text-lg text-muted-foreground mb-8">
              یادگیری زبان را با خود همراه داشته باشید. اپلیکیشن ما را نصب کنید و در هر زمان و مکان زبان یاد بگیرید.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 justify-end">
                <span>کلاس‌های آنلاین در موبایل</span>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span>تمرین‌های تعاملی</span>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span>پیگیری پیشرفت</span>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span>چت با معلمان</span>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <Button 
                size="lg" 
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              >
                <Download className="w-4 h-4 ml-2" />
                {isIOS ? "راهنمای نصب iOS" : "نصب اپلیکیشن"}
              </Button>
            </div>
            {isIOS && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-2">راهنمای نصب برای iPhone:</p>
                <ol className="list-decimal list-inside space-y-1 text-right">
                  <li>دکمه Share (اشتراک‌گذاری) را بزنید</li>
                  <li>گزینه "Add to Home Screen" را انتخاب کنید</li>
                  <li>دکمه "Add" را بزنید</li>
                </ol>
              </div>
            )}
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
              <div className="text-2xl font-bold mb-2">سِ وان App</div>
              <div className="text-muted-foreground">در دسترس برای iOS و Android</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 