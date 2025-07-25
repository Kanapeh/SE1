"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    question: "چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟",
    answer: "برای ثبت‌نام، کافی است به صفحه ثبت‌نام مراجعه کرده و فرم مربوطه را پر کنید. پس از تکمیل فرم، با شما تماس خواهیم گرفت.",
  },
  {
    question: "آیا دوره‌ها به صورت آنلاین برگزار می‌شوند؟",
    answer: "بله، ما دوره‌های آنلاین و حضوری را برای راحتی شما ارائه می‌دهیم. کلاس‌های آنلاین از طریق پلتفرم‌های مدرن برگزار می‌شوند.",
  },
  {
    question: "آیا پس از اتمام دوره گواهینامه دریافت می‌کنم؟",
    answer: "بله، پس از اتمام موفقیت‌آمیز دوره، گواهینامه معتبر و قابل ترجمه دریافت خواهید کرد.",
  },
  {
    question: "آیا امکان تغییر زمان کلاس وجود دارد؟",
    answer: "بله، در صورت اطلاع قبلی، امکان تغییر زمان کلاس وجود دارد. ما انعطاف‌پذیری کامل برای دانش‌آموزان قائل هستیم.",
  },
  {
    question: "آیا دوره‌های خصوصی هم دارید؟",
    answer: "بله، علاوه بر کلاس‌های گروهی، دوره‌های خصوصی با معلمان متخصص نیز ارائه می‌دهیم.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">سوالات متداول</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            پاسخ سوالات رایج شما درباره خدمات ما
          </p>
        </motion.div>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background p-6 rounded-lg shadow-md border hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 