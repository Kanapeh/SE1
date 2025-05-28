"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* درباره ما */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">درباره ما</h3>
            <p className="text-sm leading-relaxed">
              مرکز تخصصی آموزش زبان انگلیسی SE1A با بیش از ۱۰ سال تجربه در زمینه آموزش زبان،
              با استفاده از اساتید مجرب و متدهای نوین آموزشی، در خدمت شما عزیزان است.
            </p>
          </motion.div>

          {/* دسترسی سریع */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  دوره‌ها
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* اطلاعات تماس */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">اطلاعات تماس</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <span className="text-sm">
                  پاسداران، نزدیک سام فود هال<br />
                  بوستان سوم
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:09387279975" className="text-sm hover:text-white transition-colors">
                  ۰۹۳۸۷۲۷۹۹۷۵
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:se1azaban@gmail.com" className="text-sm hover:text-white transition-colors">
                  se1azaban@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>

          {/* شبکه‌های اجتماعی */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">شبکه‌های اجتماعی</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* خط جداکننده */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-center md:text-right">
              © {new Date().getFullYear()} SE1A. تمامی حقوق محفوظ است.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                حریم خصوصی
              </Link>
              <Link href="/terms" className="text-sm hover:text-white transition-colors">
                شرایط استفاده
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 