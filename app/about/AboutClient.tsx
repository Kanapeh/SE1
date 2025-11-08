"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Users, 
  Globe2, 
  BookOpen, 
  Target, 
  Heart, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Play,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Zap,
  GraduationCap,
  Languages,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Globe,
  BookOpenCheck
} from "lucide-react";
import Link from "next/link";

export default function AboutClient() {
  const stats = [
    { icon: Users, label: "زبان‌آموزان آموزش‌دیده", value: "500+", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Globe2, label: "زبان‌های ارائه‌شده", value: "3+", color: "text-green-600", bgColor: "bg-green-50" },
    { icon: Award, label: "سال‌های تجربه", value: "5+", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: BookOpen, label: "مدرسان متخصص", value: "15+", color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const values = [
    {
      icon: Target,
      title: "کیفیت بالا",
      description: "ارائه بهترین کیفیت آموزش با استفاده از روش‌های نوین و مدرسان مجرب",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Heart,
      title: "مشتری‌مداری",
      description: "رضایت زبان‌آموزان در اولویت ماست و همیشه آماده پاسخگویی هستیم",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: Zap,
      title: "انعطاف‌پذیری",
      description: "کلاس‌های انعطاف‌پذیر با زمان‌بندی مناسب برای همه افراد",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Shield,
      title: "امنیت و اعتماد",
      description: "محیطی امن و قابل اعتماد برای یادگیری آنلاین",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  const features = [
    { text: "کلاس‌های خصوصی و گروهی", icon: Users, color: "text-blue-600" },
    { text: "مدرسین Native و مجرب", icon: Globe, color: "text-green-600" },
    { text: "متدهای نوین آموزشی", icon: Lightbulb, color: "text-yellow-600" },
    { text: "پشتیبانی 24/7", icon: Clock, color: "text-purple-600" },
    { text: "گواهینامه معتبر", icon: BookOpenCheck, color: "text-orange-600" },
    { text: "قیمت‌های مناسب", icon: TrendingUp, color: "text-red-600" }
  ];

  const team = [
    {
      name: "سپنتا علیزاده",
      role: "مدیر و بنیان‌گذار سِ وان",
      image: "/images/sepanta.jpg",
      description: "مدرس و طراح برنامه‌های آموزشی با تمرکز بر یادگیری سفارشی‌سازی‌شده و دسترسی برابر به آموزش زبان.",
      social: {
        linkedin: "https://www.linkedin.com",
        twitter: "https://twitter.com",
        email: "sepanta@se1a.com"
      }
    }
  ];

  const testimonials = [
    {
      name: "سارا احمدی",
      role: "دانشجوی پزشکی",
      content: "تجربه یادگیری زبان در آکادمی سِ وان فوق‌العاده بود. مدرسین بسیار حرفه‌ای و روش‌های آموزشی عالی هستند.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      name: "علی محمدی",
      role: "مهندس نرم‌افزار",
      content: "کلاس‌های خصوصی به من کمک کرد تا در مدت کوتاهی مهارت‌های زبانی خود را بهبود دهم.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      name: "فاطمه کریمی",
      role: "معلم",
      content: "قیمت‌های مناسب و کیفیت بالا باعث شد که آکادمی سِ وان را انتخاب کنم. بسیار راضی هستم.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      {/* Hero */}
      <section className="relative overflow-hidden py-28 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(167,139,250,0.18),_transparent_50%)]" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 text-center sm:px-10">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-sky-300 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              داستان یک آکادمی انسان‌محور
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              آموزش زبان برای همه، بدون مرز
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-300 md:text-xl">
              در سِ وان یادگیری با یک برنامهٔ شخصی، مربی همراه و تکنولوژی روز پیش می‌رود؛ تا هر زبان‌آموز در کمتر از چند ماه بتواند با اعتمادبه‌نفس در گفت‌وگوهای جهانی حضور داشته باشد.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mx-auto flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-8 py-3 text-base font-semibold shadow-xl">
              شروع یادگیری
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl border border-white/20 bg-white/5 px-8 py-3 text-base text-white backdrop-blur transition hover:bg-white/10">
              <Play className="mr-2 h-4 w-4" />
              تماشای معرفی
            </Button>
          </motion.div>
          <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bgColor}`}
                  ><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[1.1fr,0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">چطور سِ وان شکل گرفت؟</h2>
            <div className="space-y-4 text-slate-200">
              <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
                در بهار ۲۰۲۵، <strong className="text-sky-300">سپنتا علیزاده</strong> سِ وان را با هدف دسترسی برابر به آموزش زبان تأسیس کرد. ما از اولین روز تلاش کردیم تا هر کسی—از دانش‌آموزان افغانستانی گرفته تا علاقه‌مندان داخل ایران—بتواند به کلاس باکیفیت و مربی حرفه‌ای دسترسی داشته باشد.
              </p>
              <p className="text-slate-200">
                امروز تیم ما با ترکیب مربیان Native، مسیرهای یادگیری هوشمند و پشتیبانی ۲۴ ساعته، کلاس‌هایی را خلق می‌کند که متناسب با هدف و سبک یادگیری شما طراحی شده‌اند.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
              <h3 className="mb-2 text-lg font-semibold text-white">آنچه به آن متعهدیم:</h3>
              <ul className="grid gap-2 text-sm text-slate-100">
                <li className="flex items-center gap-2 text-slate-50"><CheckCircle className="h-4 w-4 text-emerald-400" />دسترسی برابر به آموزش با تمرکز بر مناطق کمتر برخوردار</li>
                <li className="flex items-center gap-2 text-slate-50"><CheckCircle className="h-4 w-4 text-emerald-400" />یادگیری کاملاً شخصی‌سازی‌شده با بازخورد لحظه‌ای</li>
                <li className="flex items-center gap-2 text-slate-50"><CheckCircle className="h-4 w-4 text-emerald-400" />استفاده از فناوری برای تسهیل تمرین و مکالمه مستمر</li>
              </ul>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/20 via-indigo-500/15 to-purple-500/20 blur-2xl" />
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" alt="همکاری تیمی" className="relative rounded-3xl border border-white/10 bg-white/5 object-cover shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Milestones */}
      <section className="border-t border-white/10 bg-slate-950/60 py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-6">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">مسیر رشد ما</h2>
            <p className="text-base text-slate-200">از یک ایده تا جامعه‌ای از زبان‌آموزان فعال</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { year: '2025', title: 'تأسیس آکادمی', body: 'شروع کلاس‌های آنلاین با ۴ مربی و صد زبان‌آموز اولیه.' },
              { year: '2026', title: 'گسترش خدمات', body: 'راه‌اندازی چالش‌های مکالمه، اتاق‌های تمرین و پشتیبانی ۲۴ ساعته.' },
              { year: '2027', title: 'همکاری جهانی', body: 'پیوستن مربیان Native و ایجاد برنامه‌های مشترک با مدارس بین‌المللی.' },
            ].map((item) => (
              <Card key={item.year} className="border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="text-sm text-sky-300">{item.year}</span>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-200">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,116,144,0.15),_transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">ارزش‌هایی که هر روز اجرا می‌کنیم</h2>
            <p className="mt-3 text-base text-slate-200">هر تصمیم، محصول و کلاس با این چهار اصل طراحی می‌شود</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${value.bgColor}`}><value.icon className={`h-7 w-7 ${value.color}`} /></div>
                <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 bg-slate-950/80 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-14 lg:grid-cols-[0.9fr,1.1fr]">
            <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-emerald-300">
                <Lightbulb className="h-4 w-4" />
                چرا زبان‌آموزان ما را انتخاب می‌کنند؟
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">یک تجربه‌ی حرفه‌ای از ثبت‌نام تا تسلط</h2>
              <p className="mt-4 text-sm text-slate-200">
                از لحظه اول که وارد سِ وان می‌شوید، مربی اختصاصی، مسیر یادگیری قابل اندازه‌گیری و دسترسی به محتوای تعاملی در اختیار شماست.
              </p>
              <Button className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-3 text-sm font-semibold text-white">
                مشاهده دوره‌ها
              </Button>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.text} className="border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <p className="text-sm text-slate-100">{feature.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,29,149,0.3),_transparent_60%)]" />
        <div className="mx-auto max-w-4xl px-6">
          <Card className="border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
              <img src={team[0].image} alt={team[0].name} className="h-full w-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-white">{team[0].name}</h3>
            <p className="mt-2 text-sm text-slate-300">{team[0].role}</p>
            <p className="mt-6 text-sm text-slate-300 leading-relaxed">
              {team[0].description}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/10 bg-slate-950/80 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">زبان‌آموزان چه می‌گویند؟</h2>
            <p className="mt-3 text-base text-slate-300">صداهای واقعی از کسانی که با ما مسیر یادگیری‌شان را آغاز کرده‌اند</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-4 flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{testimonial.name}</h4>
                    <span className="text-xs text-slate-300">{testimonial.role}</span>
                  </div>
                </div>
                <div className="mb-3 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">“{testimonial.content}”</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/40 via-indigo-500/40 to-purple-500/40 blur-3xl" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">همین امروز اولین جلسه‌ات را تنظیم کن</h2>
          <p className="text-base text-slate-200">
            مسیر یادگیری اختصاصی، مربی منتخب و ابزارهای تمرین در کمتر از چند دقیقه در دسترس توست.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-slate-900">
              شروع رایگان
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl border border-white/20 bg-white/5 px-8 py-3 text-sm text-white">
              تماس با پشتیبانی
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
