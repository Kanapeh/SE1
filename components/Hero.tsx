"use client";

import Image from "next/image";
import Link from "next/link";
import HeroImage from "./images/Hero.jpg";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  BookOpenCheck,
  GraduationCap,
  Users,
  Star,
  Timer,
  CalendarCheck,
  Megaphone,
} from "lucide-react";

const highlightCards = [
  {
    title: "مسیر مبتدی تا مکالمه",
    description: "شروع از صفر تا مکالمه روان در ۱۴ هفته",
    badge: "پرفروش",
    link: "/courses",
    accent: "from-cyan-500/10 via-cyan-500/5 to-blue-500/10",
  },
  {
    title: "۵۰٪ تخفیف دوره زمستانی",
    description: "برای ثبت‌نام‌های قبل از ۱۵ دی",
    badge: "پیشنهاد ویژه",
    link: "/courses",
    accent: "from-orange-500/15 via-amber-400/10 to-rose-500/10",
  },
  {
    title: "کلاس خصوصی VIP",
    description: "برنامه شخصی‌سازی شده برای هر هدف زبانی",
    badge: "جدید",
    link: "/courses",
    accent: "from-emerald-500/10 via-teal-400/10 to-teal-500/5",
  },
  {
    title: "باشگاه مکالمه",
    description: "جلسات هفتگی با مربیان بین‌المللی",
    badge: "آنلاین",
    link: "/community",
    accent: "from-indigo-500/10 via-indigo-500/5 to-purple-500/10",
  },
];

const hashtags = ["#مکالمه_روان", "#IELTS", "#گرامر_پایه", "#کودکان", "#BusinessEnglish", "#SpeakingLab"];

export default function Hero() {
  return (
    <section dir="rtl" className="relative overflow-hidden bg-[#f5f4ff]">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f5f4ff] to-white" />
      <div className="absolute top-[-140px] right-[-140px] h-72 w-72 rounded-full bg-gradient-to-br from-purple-300/30 to-blue-300/20 blur-3xl" />
      <div className="absolute bottom-[-140px] left-[-140px] h-80 w-80 rounded-full bg-gradient-to-tr from-rose-300/30 to-orange-300/20 blur-3xl" />

      <div className="container relative mx-auto px-4 pb-20 pt-16 md:px-8 lg:pt-24">
        <div className="flex flex-col items-end justify-between gap-4 pb-10 lg:flex-row-reverse lg:items-center">
          <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm shadow-indigo-200 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            تازه‌ترین برنامه آیلتس ۲۰۲۵ منتشر شد
          </div>
          <div className="flex flex-wrap items-center justify-end gap-5 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              بیش از ۵۰۰ زبان‌آموز فعال
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              امتیاز ۴٫۹ از ۵ در نظرسنجی‌ها
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-emerald-500" />
              پشتیبانی سریع ۷ روز هفته
            </div>
          </div>
        </div>

        <div className="grid gap-8 rounded-[32px] bg-white/85 p-6 shadow-xl shadow-indigo-50 backdrop-blur lg:grid-cols-[1.4fr,1fr] lg:p-12">
          <div className="flex flex-col gap-10">
            <div className="space-y-6 text-right">
              <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-[56px]">
                <span className="inline-block bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 bg-clip-text text-transparent">
                  قفل مهارت‌های زبانت را باز کن
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
                مسیر یادگیری اختصاصی برای هر سطح؛ از کلاس‌های گروهی و خصوصی تا بوت‌کمپ‌های آیلتس و برنامه‌های
                مکالمه روزانه. همه چیز برای اینکه با اعتمادبه‌نفس صحبت کنی.
              </p>
              <div className="flex flex-wrap items-center justify-end gap-4">
                <Link href="/register" className="inline-flex">
                  <Button className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-300 sm:px-8 sm:py-4 sm:text-lg">
                    شروع رایگان
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/courses" className="inline-flex">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 sm:px-8 sm:py-4 sm:text-lg"
                  >
                    دوره‌ها را ببین
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlightCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.link}
                  className={`group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br ${card.accent} p-6 text-right shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">{card.badge}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative flex-1 overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-6 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-medium text-indigo-600">
                  <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">مشاوره آموزشی رایگان</span>
                  <span className="text-slate-500">در کمتر از ۲۴ ساعت</span>
                </div>
                <div className="relative mx-auto mt-6 h-72 w-full overflow-hidden rounded-3xl">
                  <Image
                    src={HeroImage}
                    alt="SE1A Language Coach"
                    fill
                    className="object-cover"
                    priority
                    placeholder="blur"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-white/85 p-4 text-center text-slate-700 shadow">
                  <div>
                    <div className="text-lg font-bold text-indigo-600">۱۴+</div>
                    <div className="text-xs text-slate-500">زبان ارائه شده</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-indigo-600">۲۴/۷</div>
                    <div className="text-xs text-slate-500">پشتیبانی</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-indigo-600">۹۵٪</div>
                    <div className="text-xs text-slate-500">رضایت زبان‌آموزان</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 text-right shadow-sm">
                <div className="flex items-center justify-between text-indigo-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-sm font-semibold">تقویم دوره‌ها</span>
                  </div>
                  <CalendarCheck className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  شروع دوره آیلتس: ۲۵ دی | بوت‌کمپ اسپیکینگ: هر سه‌شنبه | کلاس خصوصی: مطابق برنامه شما
                </p>
                <Link href="/courses" className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                  مشاهده برنامه کامل
                </Link>
              </div>

              <div className="flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-right text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-amber-300" />
                    <span className="text-sm font-semibold">بحث‌های داغ جامعه</span>
                  </div>
                  <Star className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber-100 backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href="/community" className="mt-4 text-xs font-semibold text-amber-200 hover:text-amber-100">
                  به جمع زبان‌آموزها بپیوند
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 rounded-3xl border border-slate-200/60 bg-white/90 p-6 text-right shadow-lg backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <BookOpenCheck className="h-6 w-6 text-indigo-500" />,
              title: "۶ مسیر یادگیری",
              description: "از پایه تا پیشرفته با برنامه قدم‌به‌قدم",
            },
            {
              icon: <Users className="h-6 w-6 text-emerald-500" />,
              title: "۱۵ استاد برتر",
              description: "مدرسان بین‌المللی با تجربه تدریس ۵+ سال",
            },
            {
              icon: <Star className="h-6 w-6 text-amber-500" />,
              title: "۴.۹ امتیاز کاربران",
              description: "بیش از ۹۰٪ زبان‌آموزان ما راضی هستند",
            },
            {
              icon: <Timer className="h-6 w-6 text-purple-500" />,
              title: "یادگیری انعطاف‌پذیر",
              description: "کلاس‌های آنلاین، حضوری و خصوصی ۱۰۰٪ منعطف",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-slate-100 p-3 shadow-inner">{item.icon}</div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

