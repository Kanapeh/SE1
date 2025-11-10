"use client";

import { useEffect, useState } from "react";
import { Download, X, Share2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isInStandaloneMode = (window.navigator as any).standalone === true;

    setIsIOS(isIOSDevice);
    setIsInstalled(isStandalone || isInStandaloneMode);

    // Show prompt for iOS devices after 3 seconds if not installed
    if (isIOSDevice && !isStandalone && !isInStandaloneMode) {
      const dismissed = sessionStorage.getItem("ios-prompt-dismissed");
      if (!dismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("ios-prompt-dismissed", "true");
  };

  if (!isIOS || isInstalled || !showPrompt) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">نصب اپلیکیشن سِ وان</DialogTitle>
          <DialogDescription className="text-right">
            برای نصب اپلیکیشن روی iPhone خود، مراحل زیر را دنبال کنید:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 text-right">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">دکمه Share را بزنید</p>
              <p className="text-sm text-muted-foreground">
                دکمه Share (اشتراک‌گذاری) در پایین صفحه Safari را پیدا کنید
              </p>
            </div>
            <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
          </div>

          <div className="flex items-start gap-3 text-right">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Add to Home Screen را انتخاب کنید</p>
              <p className="text-sm text-muted-foreground">
                در منوی Share، گزینه "Add to Home Screen" (افزودن به صفحه اصلی) را انتخاب کنید
              </p>
            </div>
            <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
          </div>

          <div className="flex items-start gap-3 text-right">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">3</span>
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Add را بزنید</p>
              <p className="text-sm text-muted-foreground">
                در صفحه بعدی، دکمه "Add" (افزودن) را بزنید تا اپلیکیشن به صفحه اصلی شما اضافه شود
              </p>
            </div>
            <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleDismiss}>
            بعداً
          </Button>
          <Button onClick={handleDismiss}>
            متوجه شدم
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

