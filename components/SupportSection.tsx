"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function SupportSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">پشتیبانی 24/7</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ما همیشه آماده کمک به شما هستیم. با ما در تماس باشید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">چت زنده</h3>
              <p className="text-muted-foreground mb-4">پشتیبانی آنلاین در تمام ساعات شبانه‌روز</p>
              <Button variant="outline">شروع چت</Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
              <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">تماس تلفنی</h3>
              <p className="text-muted-foreground mb-4">شماره: 00989387279975</p>
              <Button variant="outline">تماس بگیرید</Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">ایمیل</h3>
              <p className="text-muted-foreground mb-4">support@se1a.org</p>
              <Button variant="outline">ارسال ایمیل</Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 