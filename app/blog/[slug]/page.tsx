"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import CommentForm from "@/app/components/CommentForm";
import VideoPlayer from "@/app/components/VideoPlayer";
import ChartDisplay from "@/app/components/ChartDisplay";
import DataTable from "@/app/components/DataTable";
import { Metadata } from "next";

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
  video_url?: string;
  chart_data?: any;
  table_data?: any;
  has_chart?: boolean;
  has_video?: boolean;
  has_table?: boolean;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<{
    id: string;
    post_id: string;
    name: string;
    email: string;
    content: string;
    status: string;
    created_at: string;
  }[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  // Helper function to create a proper slug
  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s\-|+]/g, '') // Keep Persian, Arabic, basic Latin chars, hyphens, pipes, and plus signs
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const fetchPost = useCallback(async () => {
    try {
      console.log('🔍 Starting fetchPost with slug:', slug);
      console.log('🔍 Slug type:', typeof slug);
      console.log('🔍 Slug length:', slug?.length);
      
      if (!slug || slug.trim() === '') {
        console.error('❌ Empty or invalid slug');
        throw new Error('Slug نامعتبر است');
      }

      // Decode URL-encoded slug
      const decodedSlug = decodeURIComponent(slug);
      console.log('🔍 Original slug:', slug);
      console.log('🔍 Decoded slug:', decodedSlug);
      
      // For English slugs, use as-is. For Persian slugs, create proper slug
      const isEnglishSlug = /^[a-z0-9-]+$/.test(decodedSlug);
      const searchSlug = isEnglishSlug ? decodedSlug : createSlug(decodedSlug);
      console.log('🔍 Is English slug:', isEnglishSlug);
      console.log('🔍 Search slug:', searchSlug);

      // First, let's check if there are any posts at all
      console.log('🔍 Checking if any posts exist in database...');
      const { data: anyPosts, error: anyError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, status')
        .limit(5);
      
      console.log('🔍 Any posts in database:', anyPosts);
      console.log('🔍 Any error:', anyError);

      if (anyError) {
        console.error('❌ Database connection error:', anyError);
        throw new Error(`خطا در اتصال به دیتابیس: ${anyError.message}`);
      }

      if (!anyPosts || anyPosts.length === 0) {
        console.log('❌ No posts found in database at all');
        throw new Error('هیچ مقاله‌ای در دیتابیس وجود ندارد');
      }

      console.log('✅ Database has posts, now checking specific slug...');

      // Now check for posts with this specific slug
      console.log('🔍 Querying posts with slug:', searchSlug);
      const { data: allPosts, error: allError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', searchSlug)
        .order('created_at', { ascending: false });

      console.log('🔍 Supabase response - allPosts:', allPosts);
      console.log('🔍 Supabase response - allError:', allError);

      if (allError) {
        console.error('❌ Supabase error (all posts):', allError);
        throw allError;
      }

      console.log('✅ All posts with this slug:', allPosts);
      console.log('✅ Number of posts found:', allPosts?.length || 0);

      if (!allPosts || allPosts.length === 0) {
        console.log('❌ No post found with slug:', searchSlug);
        console.log('🔍 Available slugs in database:', anyPosts.map(p => p.slug));
        
        // Try to find a similar slug
        const similarSlug = anyPosts.find(post => 
          post.slug.includes(searchSlug.split('-')[0]) || 
          searchSlug.includes(post.slug.split('-')[0])
        );
        
        if (similarSlug) {
          console.log('🔍 Found similar slug:', similarSlug.slug);
          // Try to fetch the similar post
          const { data: similarPost, error: similarError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', similarSlug.slug)
            .eq('status', 'published')
            .single();
            
          if (!similarError && similarPost) {
            console.log('✅ Using similar post:', similarPost);
            setPost(similarPost);
            return;
          }
        }
        
        throw new Error(`مقاله با slug "${searchSlug}" یافت نشد. Slug های موجود: ${anyPosts.map(p => p.slug).join(', ')}`);
      }

      // Check if any post is published
      const publishedPosts = allPosts.filter(post => post.status === 'published');
      console.log('✅ Published posts:', publishedPosts);
      console.log('✅ Number of published posts:', publishedPosts.length);

      if (publishedPosts.length === 0) {
        // Check what statuses exist
        const statuses = Array.from(new Set(allPosts.map(post => post.status)));
        console.log('⚠️ Available statuses for this slug:', statuses);
        console.log('⚠️ All posts details:', allPosts.map(p => ({ id: p.id, title: p.title, status: p.status })));
        throw new Error(`مقاله یافت شد اما منتشر نشده است. وضعیت: ${statuses.join(', ')}`);
      }

      // Use the latest published post
      const latestPost = publishedPosts[0];
      console.log('✅ Using latest published post:', latestPost);
      setPost(latestPost);

    } catch (error: any) {
      console.error('❌ Error fetching post:', error);
      console.error('❌ Error stack:', error.stack);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  useEffect(() => {
    if (post) {
      fetchComments(post.id);
    }
  }, [post]);

  const fetchComments = async (postId: string) => {
    setCommentsLoading(true);
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      
      if (response.ok) {
        setComments(data);
      } else {
        console.error('Error fetching comments:', data.error);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          {error || 'مقاله یافت نشد'}
        </div>
        <div className="text-center mt-4">
          <Link href="/blog" className="text-blue-600 hover:underline">
            بازگشت به لیست مقالات
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.content.substring(0, 160),
    "image": post.image_url,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://www.se1a.org"
    },
    "publisher": {
      "@type": "Organization",
      "name": "آکادمی زبان سِ وان",
      "url": "https://www.se1a.org",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.se1a.org/images/logo.png"
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.se1a.org/blog/${post.slug}`
    },
    "keywords": post.tags.join(", "),
    "articleSection": "آموزش زبان انگلیسی",
    "inLanguage": "fa-IR"
  };

  return (
    <>
      <Head>
        <title>{post.title} | آکادمی زبان سِ وان</title>
        <meta name="description" content={post.content.substring(0, 160)} />
        <meta property="og:title" content={`${post.title} | آکادمی زبان سِ وان`} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        <meta property="og:image" content={post.image_url} />
        <meta property="og:url" content={`https://www.se1a.org/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:section" content="آموزش زبان انگلیسی" />
        <meta property="article:tag" content={post.tags.join(", ")} />
        <link rel="canonical" href={`https://www.se1a.org/blog/${post.slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="text-blue-600 hover:underline mb-8 inline-block">
            ← بازگشت به لیست مقالات
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-gray-600 mb-4">
              <span>نویسنده: {post.author}</span>
              <span>{new Date(post.published_at).toLocaleDateString('fa-IR')}</span>
            </div>
            {post.image_url && (
              <Image
                src={post.image_url}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Video Section */}
          {(post.has_video || post.video_url) && post.video_url && (
            <div className="mt-8">
              <VideoPlayer 
                videoUrl={post.video_url} 
                title="ویدیو مرتبط"
              />
            </div>
          )}
          


          {/* Chart Section */}
          {(post.has_chart || post.chart_data) && post.chart_data && (
            <div className="mt-8">
              <ChartDisplay 
                chartData={post.chart_data}
                title="نمودار داده‌ها"
              />
            </div>
          )}

          {/* Table Section */}
          {(post.has_table || post.table_data) && post.table_data && (
            <div className="mt-8">
              <DataTable 
                tableData={post.table_data}
                sortable={true}
                searchable={true}
                pagination={true}
                itemsPerPage={5}
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-xl font-semibold mb-4">برچسب‌ها:</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-6">نظرات کاربران</h2>
            
            {/* Comment Form */}
            <div className="mb-8">
              <CommentForm 
                postId={post.id} 
                onCommentSubmitted={() => fetchComments(post.id)}
              />
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-8">در حال بارگذاری نظرات...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">نظرات ({comments.length})</h3>
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-foreground">{comment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                    <div className="text-foreground leading-relaxed">{comment.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
} 