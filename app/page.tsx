import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "آکادمی زبان سِ وان | بهترین آموزش زبان انگلیسی آنلاین | SE1A Academy",
  description: "بهترین آکادمی آموزش زبان انگلیسی در ایران. کلاس‌های آنلاین، حضوری و خصوصی با اساتید مجرب. دوره‌های آیلتس، مکالمه، گرامر و کودکان. قیمت مناسب و کیفیت تضمین شده.",
  keywords: "آموزش زبان انگلیسی, کلاس زبان آنلاین, معلم خصوصی زبان, آیلتس, مکالمه انگلیسی, گرامر انگلیسی, کلاس کودکان, SE1A, آکادمی سِ وان, آموزش زبان تهران",
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
    title: "آکادمی زبان سِ وان | بهترین آموزش زبان انگلیسی آنلاین",
    description: "بهترین آکادمی آموزش زبان انگلیسی در ایران. کلاس‌های آنلاین، حضوری و خصوصی با اساتید مجرب. دوره‌های آیلتس، مکالمه، گرامر و کودکان.",
    url: "https://www.se1a.org",
    siteName: "سِ وان - SE1A Academy",
    images: [
      {
        url: "https://www.se1a.org/images/home-og.jpg",
        width: 1200,
        height: 630,
        alt: "آکادمی زبان سِ وان - بهترین آموزش زبان انگلیسی آنلاین",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "آکادمی زبان سِ وان | بهترین آموزش زبان انگلیسی آنلاین",
    description: "بهترین آکادمی آموزش زبان انگلیسی در ایران. کلاس‌های آنلاین، حضوری و خصوصی با اساتید مجرب.",
    images: ["https://www.se1a.org/images/home-og.jpg"],
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
    canonical: '/',
    languages: {
      'fa-IR': '/',
    },
  },
  verification: {
    google: "gHW_n1GYHPWhQoj46nxuPhE5TKG9G0hMgk5X7Kn1xsM",
  },
  category: "Education",
  classification: "Language Learning",
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "آکادمی زبان سِ وان",
    "alternateName": "SE1A Academy",
    "description": "بهترین آکادمی آموزش زبان انگلیسی در ایران با اساتید مجرب و روش‌های نوین یادگیری",
    "url": "https://www.se1a.org",
    "logo": "https://www.se1a.org/images/logo.png",
    "image": "https://www.se1a.org/images/home-og.jpg",
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
      "https://www.linkedin.com/company/se1a-academy",
      "https://www.youtube.com/@Se1-academy"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "دوره‌های آموزش زبان انگلیسی",
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
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+98-21-1234-5678",
      "contactType": "customer service",
      "availableLanguage": ["Persian", "English"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Iran"
    },
    "serviceType": "Language Education",
    "priceRange": "$$"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient />
    </>
  );
} 