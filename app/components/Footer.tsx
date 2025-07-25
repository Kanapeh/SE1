"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  BookOpen,
  Users,
  MessageCircle,
  ArrowRight,
  Heart,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import imageLogo from "@/components/images/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "خانه", href: "/", icon: GraduationCap },
    { name: "دوره‌ها", href: "/courses", icon: BookOpen },
    { name: "معلمان", href: "/teachers", icon: Users },
    { name: "وبلاگ", href: "/blog", icon: MessageCircle },
    { name: "درباره ما", href: "/about", icon: Users },
    { name: "تماس با ما", href: "/contact", icon: MessageCircle },
  ];

  const socialLinks = [
    { name: "اینستاگرام", href: "#", icon: Instagram, color: "hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600" },
    { name: "فیسبوک", href: "#", icon: Facebook, color: "hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700" },
    { name: "توییتر", href: "#", icon: Twitter, color: "hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-700" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Image src={imageLogo} alt="لوگو" className="h-12 w-12" />
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  <span className="text-white">SE1A</span>
                </h3>
                <p className="text-xs text-white">آکادمی زبان</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white mb-6">
              مرکز تخصصی آموزش زبان انگلیسی SE1A با بیش از ۱۰ سال تجربه در زمینه آموزش زبان،
              با استفاده از اساتید مجرب و متدهای نوین آموزشی، در خدمت شما عزیزان است.
            </p>
            <div className="flex items-center space-x-2 text-sm text-white">
              <Heart className="w-4 h-4 text-red-500" />
              <span>طراح و بنیانگذار: سپنتا علیزاده</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-white" />
              <span className="text-white">دسترسی سریع</span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href} 
                    className="flex items-center space-x-3 text-white hover:text-gray-200 transition-all duration-300 group"
                  >
                    <link.icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    <ArrowRight className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-white" />
              <span className="text-white">اطلاعات تماس</span>
            </h3>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start space-x-3 group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gradient-to-r from-primary to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm text-white block">آدرس:</span>
                  <span className="text-sm text-white">
                    پاسداران، نزدیک سام فود هال<br />
                    بوستان سوم
                  </span>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3 group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <a href="tel:09387279975" className="text-sm text-white hover:text-gray-200 transition-colors">
                  ۰۹۳۸۷۲۷۹۹۷۵
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center space-x-3 group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <a href="mailto:se1azaban@gmail.com" className="text-sm text-white hover:text-gray-200 transition-colors">
                  se1azaban@gmail.com
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-white" />
              <span className="text-white">شبکه‌های اجتماعی</span>
            </h3>
            <p className="text-sm text-white mb-6">
              ما را در شبکه‌های اجتماعی دنبال کنید و از آخرین اخبار و مطالب آموزشی باخبر شوید.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gray-800 p-3 rounded-xl hover:text-white transition-all duration-300 shadow-lg ${social.color}`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl border border-primary/20"
        >
          <div className="text-center">
            <h3 className="text-white text-xl font-semibold mb-4">
              <span className="text-white">خبرنامه ما</span>
            </h3>
            <p className="text-white mb-6 max-w-md mx-auto">
              برای دریافت آخرین اخبار، تخفیف‌ها و مطالب آموزشی در خبرنامه ما عضو شوید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105">
                عضویت
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white text-center md:text-right">
              © {currentYear} SE1A. تمامی حقوق محفوظ است.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-white hover:text-gray-200 transition-colors">
                حریم خصوصی
              </Link>
              <Link href="/terms" className="text-sm text-white hover:text-gray-200 transition-colors">
                شرایط استفاده
              </Link>
              <Link href="/sitemap" className="text-sm text-white hover:text-gray-200 transition-colors">
                نقشه سایت
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 