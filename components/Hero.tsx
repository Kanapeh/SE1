"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "./images/Hero.jpg";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center md:justify-end order-2 md:order-1"
        >
          <Image
            className="rounded-xl shadow-2xl"
            src={HeroImage}
            alt="Learning Languages"
            width={500}
            height={500}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center md:items-end text-center md:text-right order-1 md:order-2"
        >
          <h1 className="text-3xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            زبان‌های جدید را یاد بگیرید، <br />
            درهای جدید را باز کنید
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
            به آکادمی زبان{" "}
            <span className="text-cyan-600 font-bold"> سِ وان (SE ONE) </span> بپیوندید و
            با مربیان متخصص و روش‌های نوین یادگیری، سفر خود را به سوی تسلط
            زبانی آغاز کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Play className="w-4 h-4 mr-2" />
                الان شروع کنید
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline">
                دوره‌ها را ببینید
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
