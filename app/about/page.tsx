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
  Languages
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "دانش‌آموزان آموزش‌دیده", value: "500+", color: "text-blue-600" },
    { icon: Globe2, label: "زبان‌های ارائه‌شده", value: "3+", color: "text-green-600" },
    { icon: Award, label: "سال‌های تجربه", value: "5+", color: "text-purple-600" },
    { icon: BookOpen, label: "مدرسان متخصص", value: "15+", color: "text-orange-600" },
  ];

  const values = [
    {
      icon: Target,
      title: "کیفیت بالا",
      description: "ارائه بهترین کیفیت آموزش با استفاده از روش‌های نوین و مدرسان مجرب"
    },
    {
      icon: Heart,
      title: "مشتری‌مداری",
      description: "رضایت دانش‌آموزان در اولویت ماست و همیشه آماده پاسخگویی هستیم"
    },
    {
      icon: Zap,
      title: "انعطاف‌پذیری",
      description: "کلاس‌های انعطاف‌پذیر با زمان‌بندی مناسب برای همه افراد"
    },
    {
      icon: Shield,
      title: "امنیت و اعتماد",
      description: "محیطی امن و قابل اعتماد برای یادگیری آنلاین"
    }
  ];

  const features = [
    "کلاس‌های خصوصی و گروهی",
    "مدرسین Native و مجرب",
    "متدهای نوین آموزشی",
    "پشتیبانی 24/7",
    "گواهینامه معتبر",
    "قیمت‌های مناسب"
  ];

  const team = [
    {
      name: "سپنتا علیزاده",
      role: "مدیر و بنیان‌گذار",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
      description: "متخصص در زمینه آموزش زبان با بیش از 5 سال تجربه",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sepanta@se1a.com"
      }
    },
    {
      name: "النا رودریگز",
      role: "مدرس ارشد زبان انگلیسی",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80",
      description: "Native speaker با تخصص در آموزش آنلاین و متدهای نوین",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "elena@se1a.com"
      }
    },
    {
      name: "دکتر محمد رضایی",
      role: "مشاور آموزشی",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
      description: "دکترای آموزش زبان با تخصص در طراحی برنامه‌های آموزشی",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "mohammad@se1a.com"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              آکادمی برتر آموزش زبان آنلاین
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              درباره آکادمی زبان سِ وان
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              توانمندسازی ارتباطات جهانی از طریق آموزش آنلاین و تخصصی. 
              ما باور داریم که یادگیری زبان باید در دسترس، لذت‌بخش و مؤثر باشد.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                شروع یادگیری
                <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="w-4 h-4 mr-2" />
                تماشای ویدیو معرفی
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">آمار و دستاوردهای ما</h2>
            <p className="text-muted-foreground">در طول سال‌های فعالیت، افتخار خدمت به هزاران دانش‌آموز را داشته‌ایم</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className="text-4xl font-bold mb-2 text-gray-800">{stat.value}</h3>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-4">داستان ما</Badge>
              <h2 className="text-4xl font-bold mb-6">
                چگونه همه چیز شروع شد
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  آکادمی زبان <span className="text-primary font-semibold">سِ وان</span> در سال 1398 
                  با هدف ارائه آموزش زبان باکیفیت تأسیس شد و به‌تازگی فعالیت خود را در فضای مجازی گسترش داده است.
                </p>
                <p>
                  ما به‌صورت تخصصی بر برگزاری کلاس‌های خصوصی و آنلاین تمرکز داریم تا یادگیری را برای هر فرد 
                  متناسب با نیازهایش شخصی‌سازی کنیم.
                </p>
                <p>
                  هدف ما ساده و شفاف است: از بین بردن موانع زبانی و ایجاد درک جهانی از طریق آموزش حرفه‌ای زبان.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  گواهینامه معتبر
                </Button>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  تیم متخصص
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="همکاری تیمی"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">500+ دانش‌آموز</p>
                    <p className="text-sm text-muted-foreground">موفق در یادگیری</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">ارزش‌های ما</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              این ارزش‌ها ستون‌های موفقیت ما هستند و در تمام جنبه‌های کار ما منعکس می‌شوند
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                alt="ویژگی‌های ما"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-4">چرا ما را انتخاب کنید؟</Badge>
              <h2 className="text-4xl font-bold mb-6">
                ویژگی‌های منحصر به فرد ما
              </h2>
              <p className="text-muted-foreground mb-8">
                ما با ارائه بهترین خدمات و امکانات، تجربه یادگیری متفاوتی را برای شما فراهم می‌کنیم
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Button size="lg" className="group">
                  مشاهده دوره‌ها
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">تیم متخصص ما</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              با تیم مجرب و متخصص ما آشنا شوید که با عشق و تعهد در خدمت شما هستند
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm mb-4">{member.description}</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">نظرات دانش‌آموزان</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ببینید دانش‌آموزان ما درباره تجربه یادگیری در آکادمی سِ وان چه می‌گویند
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              آماده شروع یادگیری هستید؟
            </h2>
            <p className="text-xl text-white/90 mb-8">
              همین امروز سفر یادگیری زبان خود را با ما شروع کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="group">
                شروع رایگان
                <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Phone className="w-4 h-4 mr-2" />
                تماس با ما
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
