import type { Metadata } from "next";
import { Vazirmatn, Noto_Sans_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/app/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Head from "next/head";

// فونت اصلی - Vazirmatn (بهترین فونت فارسی)
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

// فونت جایگزین - Noto Sans Arabic
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans",
  display: "swap",
});

// فونت جایگزین - IBM Plex Sans Arabic
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سِ وان - مرکز تخصصی آموزش زبان انگلیسی",
  description: "مرکز تخصصی آموزش زبان انگلیسی سِ وان با بیش از ۱۰ سال تجربه در زمینه آموزش زبان",
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
              "name": "سِ وان",
              "url": "https://www.se1a.org",
              "logo": "https://www.se1a.org/images/logo.png"
            }),
          }}
        />
      </Head>
      <body className={`${vazirmatn.variable} ${notoSansArabic.variable} ${ibmPlexSansArabic.variable} font-sans`}>
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
