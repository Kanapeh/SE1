import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/app/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Head from "next/head";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "SE1A - مرکز تخصصی آموزش زبان انگلیسی",
  description: "مرکز تخصصی آموزش زبان انگلیسی SE1A با بیش از ۱۰ سال تجربه در زمینه آموزش زبان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SE1A",
              "url": "https://www.se1a.org",
              "logo": "https://www.se1a.org/images/logo.png"
            }),
          }}
        />
      </Head>
      <body className={`${vazirmatn.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
