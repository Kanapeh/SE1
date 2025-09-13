"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: "1",
    name: "علی احمدی",
    role: "دانشجوی پزشکی",
    content: "تجربه یادگیری در سِ وان فوق‌العاده بود. معلمان بسیار حرفه‌ای و روش‌های تدریس مدرن هستند.",
    rating: 5,
    avatar: "/images/student1.jpg"
  },
  {
    id: "2", 
    name: "فاطمه محمدی",
    role: "کارمند شرکت",
    content: "در مدت کوتاهی پیشرفت زیادی داشتم. کلاس‌های آنلاین بسیار راحت و موثر هستند.",
    rating: 5,
    avatar: "/images/student2.jpg"
  },
  {
    id: "3",
    name: "حسین رضایی", 
    role: "دانشجو",
    content: "قیمت‌ها مناسب و کیفیت آموزش عالی است. حتماً به دوستانم توصیه می‌کنم.",
    rating: 5,
    avatar: "/images/student3.jpg"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">نظرات دانش‌آموزان</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ببینید دانش‌آموزان ما درباره تجربه یادگیری‌شان چه می‌گویند
          </p>
        </motion.div>

        {/* Mobile: Horizontal scroll */}
        <div className="block md:hidden mb-8">
          <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80"
              >
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 h-full">
                  <Quote className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground mb-6 italic text-sm leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <Avatar className="w-12 h-12 mx-auto mb-3">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                <Quote className="h-8 w-8 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <Avatar className="w-12 h-12 mx-auto mb-3">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 