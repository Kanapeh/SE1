import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "درباره ما | آکادمی زبان سِ وان",
  description: "آکادمی زبان سِ وان با بیش از 5 سال تجربه در آموزش زبان انگلیسی. تیم متخصص ما آماده راهنمایی شما در یادگیری زبان است.",
  keywords: "درباره ما, آکادمی زبان, آموزش زبان انگلیسی, تیم متخصص, SE1A, سِ وان",
  openGraph: {
    title: "درباره ما | آکادمی زبان سِ وان",
    description: "آکادمی زبان سِ وان با بیش از 5 سال تجربه در آموزش زبان انگلیسی. تیم متخصص ما آماده راهنمایی شما در یادگیری زبان است.",
    url: "https://www.se1a.org/about",
    siteName: "سِ وان - SE1A Academy",
    images: [
      {
        url: "https://www.se1a.org/images/about-og.jpg",
        width: 1200,
        height: 630,
        alt: "درباره آکادمی زبان سِ وان",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره ما | آکادمی زبان سِ وان",
    description: "آکادمی زبان سِ وان با بیش از 5 سال تجربه در آموزش زبان انگلیسی. تیم متخصص ما آماده راهنمایی شما در یادگیری زبان است.",
    images: ["https://www.se1a.org/images/about-og.jpg"],
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
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
