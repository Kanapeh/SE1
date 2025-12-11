import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import VideoPlayer from "@/app/components/VideoPlayer";
import ChartDisplay from "@/app/components/ChartDisplay";
import DataTable from "@/app/components/DataTable";
import CommentsSection from "./CommentsSection";
import { createClient } from "@/lib/supabase-server";

type PdfFile = {
  name: string;
  url: string;
  size?: number;
};

type RawPost = {
  id: string;
  title: string | null;
  content: string | null;
  slug: string;
  image_url: string | null;
  author: string | null;
  published_at: string | null;
  status: string;
  tags: unknown;
  video_url?: string | null;
  chart_data?: unknown;
  table_data?: unknown;
  has_chart?: boolean | null;
  has_video?: boolean | null;
  has_table?: boolean | null;
  pdf_files?: unknown;
};

type BlogPost = {
  id: string;
  title: string;
  content: string;
  slug: string;
  image_url: string | null;
  author: string;
  published_at: string;
  tags: string[];
  video_url?: string | null;
  chart_data?: unknown;
  table_data?: unknown;
  has_chart?: boolean;
  has_video?: boolean;
  has_table?: boolean;
  pdf_files: PdfFile[];
};

const SELECT_COLUMNS =
  "id, title, content, slug, image_url, author, published_at, status, tags, video_url, chart_data, table_data, has_chart, has_video, has_table, pdf_files";

export const revalidate = 300;

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function normalizeSlug(value: string): string {
  return value
      .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s\-|+]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function safeParseJSON<T>(value: unknown): T | null {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    const parsed = safeParseJSON<string[]>(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean);
    }

    return trimmed
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
      }

  return [];
}

function parsePdfFiles(value: unknown): PdfFile[] {
  if (!value) {
    return [];
  }

  const normalize = (input: any): PdfFile | null => {
    if (!input) return null;

    if (typeof input === "string") {
      const parsed = safeParseJSON<PdfFile>(input);
      if (parsed && parsed.url) {
        return parsed;
      }
      return null;
    }

    if (typeof input === "object") {
      const name = "name" in input ? String((input as { name?: string }).name ?? "") : "";
      const url = "url" in input ? String((input as { url?: string }).url ?? "") : "";

      if (!url) {
        return null;
      }

      const size =
        "size" in input && typeof (input as { size?: number }).size === "number"
          ? (input as { size?: number }).size
          : undefined;

      return {
        name: name || url.split("/").pop() || "file.pdf",
        url,
        size,
      };
    }

    return null;
  };

  if (typeof value === "string") {
    const parsed = safeParseJSON<unknown>(value);
    if (parsed) {
      return parsePdfFiles(parsed);
    }
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalize(item))
      .filter((item): item is PdfFile => Boolean(item));
  }

  const normalized = normalize(value);
  return normalized ? [normalized] : [];
      }

function sanitizePost(raw: RawPost): BlogPost {
  return {
    id: raw.id,
    title: raw.title || "",
    content: raw.content || "",
    slug: raw.slug,
    image_url: raw.image_url || null,
    author: raw.author || "آکادمی زبان سِ وان",
    published_at: raw.published_at || new Date().toISOString(),
    tags: toStringArray(raw.tags),
    video_url: raw.video_url,
    chart_data:
      typeof raw.chart_data === "string" ? safeParseJSON(raw.chart_data) ?? raw.chart_data : raw.chart_data,
    table_data:
      typeof raw.table_data === "string" ? safeParseJSON(raw.table_data) ?? raw.table_data : raw.table_data,
    has_chart: Boolean(raw.has_chart),
    has_video: Boolean(raw.has_video),
    has_table: Boolean(raw.has_table),
    pdf_files: parsePdfFiles(raw.pdf_files),
  };
      }

const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const supabase = await createClient();
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = normalizeSlug(decodedSlug);

  const candidateSlugs = Array.from(
    new Set(
      [decodedSlug, normalizedSlug]
        .map((item) => item.trim())
        .filter(Boolean)
    )
        );
        
  for (const candidate of candidateSlugs) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(SELECT_COLUMNS)
      .eq("slug", candidate)
      .eq("status", "published")
      .maybeSingle();
            
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching blog post", { candidate, error });
      continue;
    }

    if (data) {
      return sanitizePost(data as RawPost);
    }
  }

  return null;
});

const getRelatedPosts = cache(async (currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> => {
  const supabase = await createClient();
  
  // Get all published posts except current
  const { data: allPosts, error } = await supabase
    .from("blog_posts")
    .select(SELECT_COLUMNS)
    .eq("status", "published")
    .neq("id", currentPost.id)
    .order("published_at", { ascending: false })
    .limit(20); // Get more to filter by tags

  if (error || !allPosts || allPosts.length === 0) {
    return [];
  }

  const sanitized = allPosts.map((post) => sanitizePost(post as RawPost));

  // If no tags, return latest posts
  if (!currentPost.tags || currentPost.tags.length === 0) {
    return sanitized.slice(0, limit);
  }

  // Filter posts with matching tags
  const related = sanitized.filter((post) => {
    if (!post.tags || post.tags.length === 0) return false;
    // Check if at least one tag matches
    return post.tags.some((tag) => currentPost.tags.includes(tag));
  });

  // If we have enough related posts, return them
  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  // Otherwise, combine related with latest and remove duplicates
  const relatedIds = new Set(related.map((p) => p.id));
  const additional = sanitized.filter((post) => !relatedIds.has(post.id));
  const combined = [...related, ...additional];

  // Remove duplicates
  const unique = combined.filter((post, index, self) => 
    index === self.findIndex((p) => p.id === post.id)
  );
  
  return unique.slice(0, limit);
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "مقاله یافت نشد | آکادمی زبان سِ وان",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const plainTitle = stripHtmlTags(post.title);
  const description = stripHtmlTags(post.content).replace(/\s+/g, " ").trim().slice(0, 160);
  const url = `https://www.se1a.org/blog/${post.slug}`;

  return {
    title: `${plainTitle} | آکادمی زبان سِ وان`,
    description,
    keywords: post.tags.length > 0 ? post.tags.join(", ") : "آموزش زبان انگلیسی, مقالات آموزشی",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${plainTitle} | آکادمی زبان سِ وان`,
      description,
      url,
      type: "article",
      siteName: "آکادمی زبان سِ وان",
      publishedTime: post.published_at,
      modifiedTime: post.published_at,
      authors: [post.author],
      tags: post.tags,
      images: post.image_url
        ? [
            {
              url: post.image_url,
              alt: plainTitle,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
      locale: "fa_IR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${plainTitle} | آکادمی زبان سِ وان`,
      description,
      images: post.image_url ? [post.image_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
      
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 3);

  const plainTitle = stripHtmlTags(post.title);
  const plainContent = stripHtmlTags(post.content);
  const description = plainContent.replace(/\s+/g, " ").trim().slice(0, 160);
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;
  const url = `https://www.se1a.org/blog/${post.slug}`;
  
  // Article Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: plainTitle,
    description,
    articleBody: plainContent,
    wordCount,
    image: post.image_url ? [post.image_url] : undefined,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://www.se1a.org",
    },
    publisher: {
      "@type": "Organization",
      name: "آکادمی زبان سِ وان",
      url: "https://www.se1a.org",
      logo: {
        "@type": "ImageObject",
        url: "https://www.se1a.org/images/logo.png",
        width: 512,
        height: 512,
      },
    },
    datePublished: post.published_at,
    dateModified: post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.join(", "),
    articleSection: "آموزش زبان انگلیسی",
    inLanguage: "fa-IR",
    url,
    isAccessibleForFree: true,
    genre: ["آموزش", "زبان انگلیسی", "مقالات آموزشی"],
  };

  // Breadcrumbs Structured Data
  const breadcrumbsData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: "https://www.se1a.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "بلاگ",
        item: "https://www.se1a.org/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: plainTitle,
        item: url,
      },
    ],
  };

  return (
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs Navigation */}
          <nav className="mb-8" aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  خانه
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  بلاگ
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-md">
                {plainTitle}
              </li>
            </ol>
          </nav>

          <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{plainTitle}</h1>
            <div className="flex items-center justify-between text-gray-600 mb-4">
              <span>نویسنده: {post.author}</span>
            <span>{new Date(post.published_at).toLocaleDateString("fa-IR")}</span>
            </div>
            {post.image_url && (
              <Image
                src={post.image_url}
              alt={plainTitle}
                width={800}
                height={400}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {(post.has_video || post.video_url) && post.video_url && (
            <div className="mt-8">
            <VideoPlayer videoUrl={post.video_url} title="ویدیو مرتبط" />
            </div>
          )}
          
          {(post.has_chart || post.chart_data) && post.chart_data && (
            <div className="mt-8">
            <ChartDisplay chartData={post.chart_data} title="نمودار داده‌ها" />
            </div>
          )}

          {(post.has_table || post.table_data) && post.table_data && (
            <div className="mt-8">
            <DataTable tableData={post.table_data} sortable searchable pagination itemsPerPage={5} />
            </div>
          )}

        {post.pdf_files.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                فایل‌های قابل دانلود
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                می‌توانید جزوات، کتاب‌ها و منابع مرتبط با این مقاله را دانلود کنید
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.pdf_files.map((pdf, index) => (
                  <a
                  key={`${pdf.url}-${index}`}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={pdf.name}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {pdf.name}
                        </h3>
                      {typeof pdf.size === "number" && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {(pdf.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

        {post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">برچسب‌ها:</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="bg-gray-100 text-foreground px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        <CommentsSection postId={post.id} />

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">مقالات مرتبط</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => {
                  const relatedTitle = stripHtmlTags(relatedPost.title);
                  const relatedDescription = stripHtmlTags(relatedPost.content)
                    .replace(/\s+/g, " ")
                    .trim()
                    .slice(0, 120);
                  
                  return (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      {relatedPost.image_url && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <Image
                            src={relatedPost.image_url}
                            alt={relatedTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {relatedTitle}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                          {relatedDescription}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{new Date(relatedPost.published_at).toLocaleDateString("fa-IR")}</span>
                          <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
                            ادامه مطلب →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
            </div>

      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsData) }}
      />
      </article>
  );
} 

