import { supabase } from "@/lib/supabase";
import TeachersClient from "./TeachersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "معلمان مجرب سِ وان | بهترین اساتید زبان انگلیسی",
  description: "با بهترین معلمان زبان انگلیسی آشنا شوید. تیم متخصص و مجرب آکادمی سِ وان آماده راهنمایی شما در یادگیری زبان است.",
  keywords: "معلم زبان انگلیسی, استاد زبان, معلم خصوصی, آموزش زبان, SE1A, سِ وان",
  openGraph: {
    title: "معلمان مجرب سِ وان | بهترین اساتید زبان انگلیسی",
    description: "با بهترین معلمان زبان انگلیسی آشنا شوید. تیم متخصص و مجرب آکادمی سِ وان",
    url: "https://www.se1a.org/teachers",
    siteName: "سِ وان - SE1A Academy",
    images: [
      {
        url: "https://www.se1a.org/images/teachers-og.jpg",
        width: 1200,
        height: 630,
        alt: "معلمان مجرب سِ وان",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "معلمان مجرب سِ وان | بهترین اساتید زبان انگلیسی",
    description: "با بهترین معلمان زبان انگلیسی آشنا شوید. تیم متخصص و مجرب آکادمی سِ وان",
    images: ["https://www.se1a.org/images/teachers-og.jpg"],
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
    canonical: '/teachers',
  },
};

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  birthdate: string | null;
  national_id: string | null;
  address: string | null;
  languages: string[];
  levels: string[] | null;
  class_types: string[];
  available_days: string[] | null;
  available_hours: string[] | null;
  max_students_per_class: number | null;
  bio: string | null;
  experience_years: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  certificates: string[] | null;
  teaching_methods: string[] | null;
  achievements: string[] | null;
  avatar: string | null;
  hourly_rate: number | null;
  location: string | null;
  available: boolean;
  education: string | null;
  preferred_time: string[] | null;
}

async function getTeachers(): Promise<Teacher[]> {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('status', 'Approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
}

export default async function TeachersPage() {
  const teachers = await getTeachers();

  return <TeachersClient teachers={teachers} />;
}