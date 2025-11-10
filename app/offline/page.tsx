"use client";

import { WifiOff, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-slate-200 dark:bg-slate-700 p-6">
            <WifiOff className="h-16 w-16 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          شما آفلاین هستید
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
          به نظر می‌رسد اتصال اینترنت شما قطع شده است. لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => window.location.reload()}
            size="lg"
            className="w-full"
          >
            تلاش مجدد
          </Button>
          
          <Link href="/" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              بازگشت به صفحه اصلی
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-8">
          برخی از صفحات ممکن است به صورت آفلاین در دسترس باشند
        </p>
      </div>
    </div>
  );
}

