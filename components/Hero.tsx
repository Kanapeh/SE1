"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  BookOpen, 
  Users, 
  Award, 
  Star,
  Zap,
  Target,
  Heart,
  Crown,
  TrendingUp,
  CheckCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "./images/Hero.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { icon: Star, delay: 0, duration: 3, x: 10, y: 20 },
    { icon: Sparkles, delay: 0.5, duration: 4, x: 80, y: 30 },
    { icon: Globe, delay: 1, duration: 5, x: 20, y: 70 },
    { icon: BookOpen, delay: 1.5, duration: 3.5, x: 70, y: 80 },
    { icon: Award, delay: 2, duration: 4.5, x: 90, y: 60 },
    { icon: Users, delay: 2.5, duration: 3.8, x: 15, y: 50 },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen md:min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 50,
            y: mousePosition.y * 50,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -30,
            y: mousePosition.y * -30,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-white/20"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          <element.icon className="w-8 h-8" />
        </motion.div>
      ))}

      <div className="container mx-auto relative z-10 pt-16 pb-16 md:pt-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12">
          {/* Content */}
          <motion.div 
            style={{ y, opacity }}
            className="text-center lg:text-right space-y-6 md:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base backdrop-blur-sm">
                <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                آکادمی برتر آموزش زبان آنلاین
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                زبان‌های جدید
              </span>
              <br />
              <span className="text-white">
                را یاد بگیرید،
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                درهای جدید
              </span>
              <br />
              <span className="text-white">را باز کنید</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mr-0 leading-relaxed"
            >
              به آکادمی زبان{" "}
              <span className="text-cyan-400 font-bold"> سِ وان (SE1A) </span> بپیوندید و
              با مربیان متخصص و روش‌های نوین یادگیری، سفر خود را به سوی تسلط
              زبانی آغاز کنید.
            </motion.p>

            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto lg:mr-0"
            >
              {[
                { icon: CheckCircle, text: "اساتید مجرب" },
                { icon: CheckCircle, text: "قیمت مناسب" },
                { icon: CheckCircle, text: "گواهینامه معتبر" },
                { icon: CheckCircle, text: "پشتیبانی 24/7" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 md:gap-3 text-gray-300">
                  <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  <span className="text-xs md:text-sm">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end"
            >
              <Link href="/register">
                <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1">
                  <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  الان شروع کنید
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1">
                  دوره‌ها را ببینید
                </Button>
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-6 text-xs md:text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>021-1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@se1a.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>تهران، ایران</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative z-10"
              >
                <Image
                  className="rounded-3xl shadow-2xl"
                  src={HeroImage}
                  alt="Learning Languages"
                  width={600}
                  height={600}
                />
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">500+</div>
                    <div className="text-gray-300 text-sm">زبان‌آموز</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">4.9</div>
                    <div className="text-gray-300 text-sm">امتیاز</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute top-1/2 -right-12 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">95%</div>
                    <div className="text-gray-300 text-sm">موفقیت</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { number: "500+", label: "زبان‌آموز", icon: Users },
            { number: "15+", label: "استاد مجرب", icon: Award },
            { number: "6", label: "دوره متنوع", icon: BookOpen },
            { number: "4.9", label: "امتیاز کاربران", icon: Star },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 backdrop-blur-sm border border-white/20">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{stat.number}</div>
              <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
