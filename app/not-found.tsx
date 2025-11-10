import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4" dir="rtl">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-slate-200 dark:text-slate-700 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            صفحه یافت نشد
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            متأسفانه صفحه‌ای که دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto flex items-center gap-2">
              <Home className="h-4 w-4" />
              بازگشت به صفحه اصلی
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
              مشاهده دوره‌ها
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

