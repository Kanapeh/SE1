"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Head from "next/head";
import CommentForm from "@/app/components/CommentForm";
import VideoPlayer from "@/app/components/VideoPlayer";
import ChartDisplay from "@/app/components/ChartDisplay";
import DataTable from "@/app/components/DataTable";

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
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchComments(post.id);
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      if (!data) throw new Error('مقاله یافت نشد');

      setPost(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <Head>
        <title>{post.title} | آکادمی زبان سِ وان</title>
        <meta name="description" content={post.content.substring(0, 160)} />
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
              <img
                src={post.image_url}
                alt={post.title}
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