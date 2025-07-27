"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Award, Users, Globe2, BookOpen } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "دانش‌آموزان آموزش‌دیده", value: "100+" },
    { icon: Globe2, label: "زبان‌های ارائه‌شده", value: "1" },
    { icon: Award, label: "سال‌های افتخار", value: "1" },
    { icon: BookOpen, label: "مدرسان متخصص", value: "10+" },
  ];

  const team = [
    {
      name: "سپنتا علیزاده ",
      role: "مدیر و بنیان گذار ",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      name: "النا رودریگز",
      role: "مدرس ارشد زبان",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* بخش معرفی */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-6">درباره آکادمی زبان سِ وان</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              توانمندسازی ارتباطات جهانی از طریق آموزش آنلاین و تخصصی.
            </p>
          </motion.div>
        </div>
      </section>

      {/* بخش آمار */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center bg-green-50">
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* بخش داستان ما */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">داستان ما</h2>

              <p className="text-lg text-muted-foreground">
                آکادمی زبان{" "}
                <span className="text-cyan-600 font-bold"> سِ وان</span> دو سال
                پیش با هدف ارائه آموزش زبان باکیفیت تأسیس شد و به‌تازگی فعالیت
                خود را در فضای مجازی گسترش داده است. ما به‌صورت تخصصی بر برگزاری
                کلاس‌های خصوصی و آنلاین تمرکز داریم تا یادگیری را برای هر فرد
                متناسب با نیازهایش شخصی‌سازی کنیم. هدف ما ساده و شفاف است: از
                بین بردن موانع زبانی و ایجاد درک جهانی از طریق آموزش حرفه‌ای
                زبان. ما به یادگیرندگان کمک می‌کنیم تا مهارت‌های زبانی خود را
                تقویت کرده و در مشاغل بین‌المللی، ارتباطات بین‌فرهنگی و رشد فردی
                پیشرفت کنند. همچنین، آکادمی سِ وان با فراهم کردن دسترسی آسان‌تر
                معلمان به تدریس و ارائه یادگیری کم‌هزینه و باکیفیت‌تر برای
                دانش‌آموزان، مسیر آموزش را هموارتر و کارآمدتر ساخته است.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                alt="همکاری تیمی"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* بخش تیم ما */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-center"
          >
            آشنایی با تیم رهبری ما
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="p-6 text-center bg-slate-200">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
