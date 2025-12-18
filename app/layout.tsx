import type { Metadata } from "next";
import { Vazirmatn, Noto_Sans_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
// import PKCEDebugger from "@/components/PKCEDebugger";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ClientOnly from "@/components/ClientOnly";
import SchemaOrg from "@/components/SchemaOrg";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import PWARegister from "@/components/PWARegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import IOSInstallPrompt from "@/components/IOSInstallPrompt";
import NavigationLoader from "@/app/components/NavigationLoader";

// فونت اصلی - Vazirmatn (بهترین فونت فارسی) - Reduced weights for better performance
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

// فونت جایگزین - Noto Sans Arabic - Reduced weights
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
  preload: false,
});

// فونت جایگزین - IBM Plex Sans Arabic - Reduced weights
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "سِ وان - مرکز تخصصی آموزش زبان انگلیسی | SE1A Academy",
  description: "مرکز تخصصی آموزش زبان انگلیسی سِ وان با بیش از ۱۰ سال تجربه در زمینه آموزش زبان. دوره‌های حضوری و آنلاین با بهترین اساتید.",
  keywords: "آموزش زبان انگلیسی, کلاس زبان, دوره زبان, معلم خصوصی زبان, آکادمی زبان, SE1A, سِ وان",
  authors: [{ name: "SE1A Academy" }],
  creator: "SE1A Academy",
  publisher: "SE1A Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.se1a.org'),
  alternates: {
    canonical: '/',
    languages: {
      'fa-IR': '/',
      'en-US': '/en',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#2b3a67',
    'theme-color': '#2b3a67',
  },
  openGraph: {
    title: "سِ وان - مرکز تخصصی آموزش زبان انگلیسی",
    description: "مرکز تخصصی آموزش زبان انگلیسی سِ وان با بیش از ۱۰ سال تجربه در زمینه آموزش زبان. دوره‌های حضوری و آنلاین با بهترین اساتید.",
    url: "https://www.se1a.org",
    siteName: "سِ وان - SE1A Academy",
    images: [
      {
        url: "https://www.se1a.org/images/logo.png",
        width: 1200,
        height: 630,
        alt: "سِ وان - مرکز تخصصی آموزش زبان انگلیسی",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سِ وان - مرکز تخصصی آموزش زبان انگلیسی",
    description: "مرکز تخصصی آموزش زبان انگلیسی سِ وان با بیش از ۱۰ سال تجربه در زمینه آموزش زبان",
    images: ["https://www.se1a.org/images/logo.png"],
    creator: "@se1a_academy",
    site: "@se1a_academy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "gHW_n1GYHPWhQoj46nxuPhE5TKG9G0hMgk5X7Kn1xsM", // کد تایید گوگل
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Font preloading for better performance */}
        <link
          rel="preload"
          href="/fonts/vazirmatn-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vazirmatn-medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vazirmatn-semibold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vazirmatn-bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* PWA Manifest - defer loading */}
        <link rel="manifest" href="/site.webmanifest" />
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#2b3a67" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="سِ وان" />
      </head>
      <body className={`${vazirmatn.variable} ${notoSansArabic.variable} ${ibmPlexSansArabic.variable} font-sans`} suppressHydrationWarning>
        <ClientOnly>
          <SchemaOrg />
          <PWARegister />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <NavigationLoader />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
            <PWAInstallPrompt />
            <IOSInstallPrompt />
            <PerformanceMonitor />
            {/* <PKCEDebugger /> */}
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
