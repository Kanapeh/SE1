import type { Metadata } from "next";
import { Vazirmatn, Noto_Sans_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/app/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
// import PKCEDebugger from "@/components/PKCEDebugger";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ClientOnly from "@/components/ClientOnly";
import SchemaOrg from "@/components/SchemaOrg";

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
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
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
        {/* Meta tags and other head content will be here */}
      </head>
      <body className={`${vazirmatn.variable} ${notoSansArabic.variable} ${ibmPlexSansArabic.variable} font-sans`} suppressHydrationWarning>
        <ClientOnly>
          <SchemaOrg />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
            <Toaster position="top-center" richColors />
            {/* <PKCEDebugger /> */}
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
