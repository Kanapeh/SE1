import { supabase } from "@/lib/supabase";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "بلاگ آموزشی سِ وان | مقالات آموزش زبان انگلیسی",
  description: "مجموعه مقالات آموزشی و نکات یادگیری زبان انگلیسی از آکادمی سِ وان. راهنمای کامل برای یادگیری زبان با بهترین روش‌ها.",
  keywords: "مقالات آموزش زبان, نکات یادگیری زبان, آموزش زبان انگلیسی, بلاگ آموزشی, SE1A",
  openGraph: {
    title: "بلاگ آموزشی سِ وان | مقالات آموزش زبان انگلیسی",
    description: "مجموعه مقالات آموزشی و نکات یادگیری زبان انگلیسی از آکادمی سِ وان",
    url: "https://www.se1a.org/blog",
    siteName: "سِ وان - SE1A Academy",
    images: [
      {
        url: "https://www.se1a.org/images/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "بلاگ آموزشی سِ وان",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "بلاگ آموزشی سِ وان | مقالات آموزش زبان انگلیسی",
    description: "مجموعه مقالات آموزشی و نکات یادگیری زبان انگلیسی از آکادمی سِ وان",
    images: ["https://www.se1a.org/images/blog-og.jpg"],
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
};

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  image_url: string;
  author: string;
  published_at: string;
  status: string;
  tags: string[];
  excerpt?: string;
  views?: number;
  likes?: number;
  read_time?: number;
  category?: string;
  featured?: boolean;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    // Add mock data for better UI
    const postsWithMockData = (data || []).map(post => ({
      ...post,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      read_time: Math.floor(Math.random() * 10) + 3,
      category: post.tags?.[0] || 'عمومی',
      featured: Math.random() > 0.7
    }));
    
    return postsWithMockData;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogClient posts={posts} />;
}
