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
  Crown,
  TrendingUp,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "./images/Hero.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, memo } from "react";

const Hero = memo(function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    // Throttle mouse move events for better performance
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
          });
        }
      }, 16); // ~60fps
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Reduced floating elements for better performance
  const floatingElements = [
    { icon: Star, delay: 0, duration: 4, x: 10, y: 20 },
    { icon: Sparkles, delay: 1, duration: 5, x: 80, y: 30 },
    { icon: Globe, delay: 2, duration: 6, x: 20, y: 70 },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen md:min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Simplified Background */}
      <div className="absolute inset-0">
        {/* Static Gradient Orbs for better performance */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />
        
        {/* Simplified Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156,146,172,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>

      {/* Simplified Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-white/20"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          <element.icon className="w-6 h-6" />
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
            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base backdrop-blur-sm">
                <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                آکادمی برتر آموزش زبان آنلاین
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-7xl font-bold leading-tight opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
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
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mr-0 leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
              به آکادمی زبان{" "}
              <span className="text-cyan-400 font-bold"> سِ وان (SE1A) </span> بپیوندید و
              با مربیان متخصص و روش‌های نوین یادگیری، سفر خود را به سوی تسلط
              زبانی آغاز کنید.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto lg:mr-0 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
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
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
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
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-6 text-xs md:text-sm text-gray-400 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.2s_forwards]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>09387279975</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@se1a.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>تهران، ایران</span>
              </div>
            </div>
          </motion.div>

          {/* Image/Visual */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10 opacity-0 animate-[fadeInScale_1s_ease-out_0.5s_forwards]">
                <Image
                  className="rounded-3xl shadow-2xl"
                  src={HeroImage}
                  alt="Learning Languages"
                  width={600}
                  height={600}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>

              {/* Simplified Floating Cards */}
              <div className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 opacity-0 animate-[fadeInLeft_0.8s_ease-out_1.2s_forwards]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">500+</div>
                    <div className="text-gray-300 text-sm">زبان‌آموز</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 opacity-0 animate-[fadeInRight_0.8s_ease-out_1.4s_forwards]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">4.9</div>
                    <div className="text-gray-300 text-sm">امتیاز</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-12 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.6s_forwards]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">95%</div>
                    <div className="text-gray-300 text-sm">موفقیت</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.8s_forwards]">
          {[
            { number: "500+", label: "زبان‌آموز", icon: Users },
            { number: "15+", label: "استاد مجرب", icon: Award },
            { number: "6", label: "دوره متنوع", icon: BookOpen },
            { number: "4.9", label: "امتیاز کاربران", icon: Star },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 backdrop-blur-sm border border-white/20">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{stat.number}</div>
              <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-[fadeIn_1s_ease-out_2.5s_forwards]">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center animate-bounce">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
});

export default Hero;
