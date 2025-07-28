-- Complete blog_posts table structure with enhanced features
-- This shows the final structure after adding video, chart, and table support

CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NULL,
  image_url text NULL,
  author_id uuid NULL,
  status text NULL DEFAULT 'draft'::text,
  published_at timestamp with time zone NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  slug text NULL,
  author text NULL DEFAULT 'مدیر سیستم'::text,
  tags text[] NULL DEFAULT '{}'::text[],
  updated_at timestamp with time zone NULL DEFAULT now(),
  
  -- New fields for enhanced content
  video_url text NULL,
  chart_data jsonb NULL,
  table_data jsonb NULL,
  has_video boolean DEFAULT FALSE,
  has_chart boolean DEFAULT FALSE,
  has_table boolean DEFAULT FALSE,
  
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Existing indexes
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON public.blog_posts USING btree (published_at DESC) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts USING btree (slug) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON public.blog_posts USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts USING btree (status) TABLESPACE pg_default;

-- New indexes for enhanced features
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_video ON public.blog_posts(has_video);
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_chart ON public.blog_posts(has_chart);
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_table ON public.blog_posts(has_table);
CREATE INDEX IF NOT EXISTS idx_blog_posts_chart_data ON public.blog_posts USING GIN (chart_data);
CREATE INDEX IF NOT EXISTS idx_blog_posts_table_data ON public.blog_posts USING GIN (table_data);

-- Comments for documentation
COMMENT ON TABLE public.blog_posts IS 'Blog posts table with enhanced content support';
COMMENT ON COLUMN public.blog_posts.video_url IS 'URL of embedded video (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN public.blog_posts.chart_data IS 'JSON data for charts (Chart.js compatible)';
COMMENT ON COLUMN public.blog_posts.table_data IS 'JSON data for tables';
COMMENT ON COLUMN public.blog_posts.has_video IS 'Boolean flag indicating if post has video';
COMMENT ON COLUMN public.blog_posts.has_chart IS 'Boolean flag indicating if post has chart';
COMMENT ON COLUMN public.blog_posts.has_table IS 'Boolean flag indicating if post has table'; 