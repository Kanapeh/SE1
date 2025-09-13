import { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "دوره‌های زبان انگلیسی | کلاس آنلاین و حضوری | آکادمی سِ وان",
  description: "بهترین دوره‌های زبان انگلیسی برای همه سطوح از مبتدی تا پیشرفته. کلاس‌های آنلاین، حضوری و خصوصی با اساتید مجرب. قیمت مناسب و کیفیت تضمین شده. آیلتس، مکالمه، گرامر و کودکان.",
  keywords: "دوره زبان انگلیسی, کلاس زبان انگلیسی, آموزش زبان آنلاین, معلم خصوصی زبان, آیلتس, مکالمه انگلیسی, گرامر انگلیسی, کلاس کودکان, SE1A, آکادمی سِ وان, آموزش زبان تهران",
  authors: [{ name: "SE1A Academy" }],
  creator: "SE1A Academy",
  publisher: "SE1A Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.se1a.org'),
  openGraph: {
    title: "دوره‌های زبان انگلیسی | کلاس آنلاین و حضوری | آکادمی سِ وان",
    description: "بهترین دوره‌های زبان انگلیسی برای همه سطوح از مبتدی تا پیشرفته. کلاس‌های آنلاین، حضوری و خصوصی با اساتید مجرب.",
    url: "https://www.se1a.org/courses",
    siteName: "سِ وان - SE1A Academy",
    images: [
      {
        url: "https://www.se1a.org/images/courses-og.jpg",
        width: 1200,
        height: 630,
        alt: "دوره‌های زبان انگلیسی آکادمی سِ وان - کلاس آنلاین و حضوری",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "دوره‌های زبان انگلیسی | آکادمی سِ وان",
    description: "بهترین دوره‌های زبان انگلیسی برای همه سطوح. کلاس‌های آنلاین، حضوری و خصوصی با اساتید مجرب.",
    images: ["https://www.se1a.org/images/courses-og.jpg"],
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
  alternates: {
    canonical: '/courses',
    languages: {
      'fa-IR': '/courses',
    },
  },
  verification: {
    google: "gHW_n1GYHPWhQoj46nxuPhE5TKG9G0hMgk5X7Kn1xsM",
  },
  category: "Education",
  classification: "Language Learning",
};

export default function CoursesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "آکادمی زبان سِ وان",
    "alternateName": "SE1A Academy",
    "description": "مرکز تخصصی آموزش زبان انگلیسی با بهترین دوره‌ها و اساتید مجرب",
    "url": "https://www.se1a.org",
    "logo": "https://www.se1a.org/images/logo.png",
    "image": "https://www.se1a.org/images/courses-og.jpg",
    "telephone": "+98-21-1234-5678",
    "email": "info@se1a.org",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressLocality": "تهران",
      "addressRegion": "تهران"
    },
    "sameAs": [
      "https://www.instagram.com/se1a_academy",
      "https://www.linkedin.com/company/se1a-academy"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "دوره‌های زبان انگلیسی",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "انگلیسی برای شروع",
          "description": "دوره کامل برای شروع یادگیری زبان انگلیسی از صفر",
          "provider": {
            "@type": "Organization",
            "name": "آکادمی زبان سِ وان"
          },
          "courseMode": "blended",
          "educationalLevel": "beginner",
          "inLanguage": "fa-IR",
          "offers": {
            "@type": "Offer",
            "price": "2800000",
            "priceCurrency": "IRR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Course",
          "name": "انگلیسی کاربردی",
          "description": "تقویت مهارت‌های زبانی برای استفاده در محیط کار و تحصیل",
          "provider": {
            "@type": "Organization",
            "name": "آکادمی زبان سِ وان"
          },
          "courseMode": "blended",
          "educationalLevel": "intermediate",
          "inLanguage": "fa-IR",
          "offers": {
            "@type": "Offer",
            "price": "4200000",
            "priceCurrency": "IRR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Course",
          "name": "انگلیسی حرفه‌ای",
          "description": "آمادگی کامل برای محیط‌های کاری بین‌المللی",
          "provider": {
            "@type": "Organization",
            "name": "آکادمی زبان سِ وان"
          },
          "courseMode": "blended",
          "educationalLevel": "advanced",
          "inLanguage": "fa-IR",
          "offers": {
            "@type": "Offer",
            "price": "6800000",
            "priceCurrency": "IRR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Course",
          "name": "آمادگی آیلتس",
          "description": "دوره تخصصی آمادگی آزمون آیلتس با استراتژی‌های تست زنی",
          "provider": {
            "@type": "Organization",
            "name": "آکادمی زبان سِ وان"
          },
          "courseMode": "blended",
          "educationalLevel": "advanced",
          "inLanguage": "fa-IR",
          "offers": {
            "@type": "Offer",
            "price": "7500000",
            "priceCurrency": "IRR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Course",
          "name": "انگلیسی کودکان",
          "description": "آموزش جذاب و بازی محور برای کودکان 6-12 سال",
          "provider": {
            "@type": "Organization",
            "name": "آکادمی زبان سِ وان"
          },
          "courseMode": "blended",
          "educationalLevel": "beginner",
          "inLanguage": "fa-IR",
          "audience": {
            "@type": "Audience",
            "audienceType": "children"
          },
          "offers": {
            "@type": "Offer",
            "price": "2200000",
            "priceCurrency": "IRR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Course",
          "name": "کلاس خصوصی VIP",
          "description": "کلاس خصوصی با استاد مجرب برای یادگیری سریع و شخصی‌سازی شده",
          "provider": {
            "@type": "Organization",
            "name": "آکادمی زبان سِ وان"
          },
          "courseMode": "online",
          "educationalLevel": "mixed",
          "inLanguage": "fa-IR",
          "offers": {
            "@type": "Offer",
            "price": "850000",
            "priceCurrency": "IRR",
            "availability": "https://schema.org/InStock"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CoursesClient />
    </>
  );
}
