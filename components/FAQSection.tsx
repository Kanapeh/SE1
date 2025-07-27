"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, CheckCircle } from "lucide-react";

const faqs = [
  {
    question: "چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟",
    answer: "برای ثبت‌نام، کافی است به صفحه ثبت‌نام مراجعه کرده و فرم مربوطه را پر کنید. پس از تکمیل فرم، با شما تماس خواهیم گرفت.",
    icon: "📝",
    category: "ثبت‌نام"
  },
  {
    question: "آیا دوره‌ها به صورت آنلاین برگزار می‌شوند؟",
    answer: "بله، ما دوره‌های آنلاین و حضوری را برای راحتی شما ارائه می‌دهیم. کلاس‌های آنلاین از طریق پلتفرم‌های مدرن برگزار می‌شوند.",
    icon: "💻",
    category: "کلاس‌ها"
  },
  {
    question: "آیا پس از اتمام دوره گواهینامه دریافت می‌کنم؟",
    answer: "بله، پس از اتمام موفقیت‌آمیز دوره، گواهینامه معتبر و قابل ترجمه دریافت خواهید کرد.",
    icon: "🏆",
    category: "گواهینامه"
  },
  {
    question: "آیا امکان تغییر زمان کلاس وجود دارد؟",
    answer: "بله، در صورت اطلاع قبلی، امکان تغییر زمان کلاس وجود دارد. ما انعطاف‌پذیری کامل برای دانش‌آموزان قائل هستیم.",
    icon: "⏰",
    category: "زمان‌بندی"
  },
  {
    question: "آیا دوره‌های خصوصی هم دارید؟",
    answer: "بله، علاوه بر کلاس‌های گروهی، دوره‌های خصوصی با معلمان متخصص نیز ارائه می‌دهیم.",
    icon: "👨‍🏫",
    category: "کلاس‌ها"
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            سوالات متداول
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            پاسخ سوالات رایج شما درباره خدمات ما
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div
                  onClick={() => toggleFAQ(index)}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 space-x-reverse flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                        {faq.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {faq.question}
                        </h3>
                        {openIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-start space-x-3 space-x-reverse pt-4 border-t border-gray-200 dark:border-gray-700">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      >
                        {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-3xl text-white">
              <h3 className="text-2xl font-bold mb-4">هنوز سوالی دارید؟</h3>
              <p className="text-blue-100 mb-6">
                تیم پشتیبانی ما آماده پاسخگویی به سوالات شما است
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
                تماس با پشتیبانی
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 