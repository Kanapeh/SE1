"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { supabase } from "@/lib/supabase";

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
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  // Structured data for blog page
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "بلاگ آکادمی زبان سِ وان",
    "description": "مطالب آموزشی و مقالات مرتبط با یادگیری زبان انگلیسی در آکادمی زبان سِ وان",
    "url": "https://www.se1a.org/blog",
    "publisher": {
      "@type": "Organization",
      "name": "آکادمی زبان سِ وان",
      "url": "https://www.se1a.org",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.se1a.org/images/logo.png"
      }
    },
    "inLanguage": "fa-IR",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.se1a.org/blog"
    }
  };

  return (
    <>
      <Head>
        <title>بلاگ | آکادمی زبان سِ وان - مقالات آموزشی زبان انگلیسی</title>
        <meta name="description" content="مطالب آموزشی و مقالات مرتبط با یادگیری زبان انگلیسی در آکادمی زبان سِ وان. نکات کاربردی، روش‌های یادگیری و راهنمای کامل آموزش زبان." />
        <meta name="keywords" content="بلاگ آموزش زبان, مقالات زبان انگلیسی, یادگیری زبان, آموزش زبان, نکات زبان انگلیسی, آکادمی زبان سِ وان" />
        <meta name="author" content="SE1A Academy" />
        <link rel="canonical" href="https://www.se1a.org/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="بلاگ | آکادمی زبان سِ وان" />
        <meta property="og:description" content="مطالب آموزشی و مقالات مرتبط با یادگیری زبان انگلیسی در آکادمی زبان سِ وان" />
        <meta property="og:url" content="https://www.se1a.org/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.se1a.org/images/blog-og.jpg" />
        <meta property="og:site_name" content="سِ وان - SE1A Academy" />
        <meta property="og:locale" content="fa_IR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="بلاگ | آکادمی زبان سِ وان" />
        <meta name="twitter:description" content="مطالب آموزشی و مقالات مرتبط با یادگیری زبان انگلیسی" />
        <meta name="twitter:image" content="https://www.se1a.org/images/blog-og.jpg" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      </Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">بلاگ</h1>

        <div className="mb-8">
          <Input
            type="search"
            placeholder="جستجوی مقالات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {filteredPosts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            مقاله‌ای یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <Card className="overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-200"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.published_at).toLocaleDateString('fa-IR')}
                      </span>
                      <span className="text-sm text-primary">
                        {post.author}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <div className="text-muted-foreground mb-4" 
                      dangerouslySetInnerHTML={{ __html: post.excerpt || post.content.substring(0, 150) }} />
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-foreground px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-primary group-hover:text-blue-600 transition-colors duration-200">
                      ادامه مطلب →
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
