"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Head from "next/head";

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
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.slug]);

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
        .eq('slug', resolvedParams.slug)
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
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved') // فقط کامنت‌های تایید شده
      .order('created_at', { ascending: false });

    if (!error) setComments(data);
    setCommentsLoading(false);
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
        <title>{post.title} | آکادمی زبان SE1A</title>
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

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-xl font-semibold mb-4">برچسب‌ها:</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">نظرات کاربران</h2>
            {commentsLoading ? (
              <div>در حال بارگذاری نظرات...</div>
            ) : comments.length === 0 ? (
              <div>هنوز نظری ثبت نشده است.</div>
            ) : (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-50 p-4 rounded shadow">
                    <div className="text-sm text-gray-700 mb-2">{comment.content}</div>
                    <div className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString('fa-IR')}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>
    </>
  );
} 