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
      role: "مدیر و بنیان‌گذار",
      image: "/images/sepanta.jpg",
      description: "متخصص در زمینه آموزش زبان با بیش از 5 سال تجربه",
      social: {
        linkedin: "#",
        twitter: "#",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-8 px-6 py-3 text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                آکادمی برتر آموزش زبان آنلاین
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
            >
              درباره آکادمی زبان
              <br />
              <span className="text-5xl md:text-6xl">سِ وان</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              توانمندسازی ارتباطات جهانی از طریق آموزش آنلاین و تخصصی. 
              ما باور داریم که یادگیری زبان باید در دسترس، لذت‌بخش و مؤثر باشد.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" className="group px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                شروع یادگیری
                <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group px-8 py-4 text-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                تماشای ویدیو معرفی
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 -mt-16 relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:transform hover:-translate-y-2 group">
                  <div className={`w-16 h-16 mx-auto mb-6 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-5xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{stat.value}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Badge variant="outline" className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200 text-blue-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  داستان ما
                </Badge>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl font-bold mb-8 text-gray-900 leading-tight"
              >
                چگونه همه چیز
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">شروع شد</span>
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6 text-gray-700 leading-relaxed text-lg"
              >
                <p className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-r-4 border-blue-500">
                  آکادمی زبان <span className="text-blue-600 font-bold">سِ وان</span> در تاریخ ۲۱ آوریل ۲۰۲۵ 
                  توسط <span className="text-blue-600 font-bold">علی علیزاده</span> ملقب به <span className="text-blue-600 font-bold">سپنتا</span> تأسیس شده است.
                </p>
                <p>
                  هدف اصلی تأسیس این موسسه کمک به معلمان و دانش‌آموزانی است که مشکل دسترسی به آموزش دارند، 
                  مانند دختران و پسران افغانستان و دیگر دانش‌آموزانی که از تدریس محروم هستند.
                </p>
                <p>
                  ما به‌صورت تخصصی بر برگزاری کلاس‌های خصوصی و آنلاین تمرکز داریم تا یادگیری را برای هر فرد 
                  متناسب با نیازهایش شخصی‌سازی کنیم و فرصت آموزش را برای همه فراهم آوریم.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Button variant="outline" className="px-6 py-3 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                  گواهینامه معتبر
                </Button>
                <Button variant="outline" className="px-6 py-3 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  تیم متخصص
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="همکاری تیمی"
                  className="rounded-3xl shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">500+ زبان‌آموز</p>
                    <p className="text-sm text-gray-600">موفق در یادگیری</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">ارزش‌های ما</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              این ارزش‌ها ستون‌های موفقیت ما هستند و در تمام جنبه‌های کار ما منعکس می‌شوند
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm h-full group hover:transform hover:-translate-y-3">
                  <div className={`w-20 h-20 mx-auto mb-8 ${value.bgColor} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className={`w-10 h-10 ${value.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-50/30 to-purple-50/30"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                alt="ویژگی‌های ما"
                className="rounded-3xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Badge variant="outline" className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-green-100 to-blue-100 border-green-200 text-green-700">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  چرا ما را انتخاب کنید؟
                </Badge>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl font-bold mb-8 text-gray-900 leading-tight"
              >
                ویژگی‌های منحصر به
                <br />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">فرد ما</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 mb-10 leading-relaxed"
              >
                ما با ارائه بهترین خدمات و امکانات، تجربه یادگیری متفاوتی را برای شما فراهم می‌کنیم
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <span className="text-gray-700 text-lg font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-10"
              >
                <Button size="lg" className="group px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  مشاهده دوره‌ها
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">تیم متخصص ما</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              با تیم مجرب و متخصص ما آشنا شوید که با عشق و تعهد در خدمت شما هستند
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="col-span-full"
              >
                <Card className="p-10 text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm group hover:transform hover:-translate-y-3">
                  <div className="relative mb-8">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden ring-8 ring-gradient-to-r from-blue-500 to-purple-600 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{member.name}</h3>
                  <Badge variant="secondary" className="mb-6 px-6 py-2 text-lg bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">{member.role}</Badge>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">{member.description}</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="ghost" size="lg" className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="lg" className="hover:bg-purple-50 hover:text-purple-600 transition-all duration-300">
                      <Phone className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900">نظرات زبان‌آموزان</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              ببینید زبان‌آموزان ما درباره تجربه یادگیری در آکادمی سِ وان چه می‌گویند
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 group hover:transform hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white leading-tight">
              آماده شروع یادگیری
              <br />
              <span className="text-blue-200">هستید؟</span>
            </h2>
            <p className="text-2xl text-white/90 mb-12 leading-relaxed">
              همین امروز سفر یادگیری زبان خود را با ما شروع کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" className="group px-10 py-5 text-xl bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
                شروع رایگان
                <ArrowRight className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="px-10 py-5 text-xl border-3 border-white text-white hover:bg-white hover:text-blue-600 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
                <Phone className="w-6 h-6 mr-2" />
                تماس با ما
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
