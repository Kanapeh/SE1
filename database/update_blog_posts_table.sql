-- Add new fields to blog_posts table for enhanced content
-- Based on current table structure

-- Add video support
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS has_video BOOLEAN DEFAULT FALSE;

-- Add chart support
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS chart_data JSONB,
ADD COLUMN IF NOT EXISTS has_chart BOOLEAN DEFAULT FALSE;

-- Add table support
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS table_data JSONB,
ADD COLUMN IF NOT EXISTS has_table BOOLEAN DEFAULT FALSE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_video ON public.blog_posts(has_video);
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_chart ON public.blog_posts(has_chart);
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_table ON public.blog_posts(has_table);

-- Create indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_chart_data ON public.blog_posts USING GIN (chart_data);
CREATE INDEX IF NOT EXISTS idx_blog_posts_table_data ON public.blog_posts USING GIN (table_data);

-- Add comments for documentation
COMMENT ON COLUMN public.blog_posts.video_url IS 'URL of embedded video (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN public.blog_posts.chart_data IS 'JSON data for charts (Chart.js compatible)';
COMMENT ON COLUMN public.blog_posts.table_data IS 'JSON data for tables';
COMMENT ON COLUMN public.blog_posts.has_video IS 'Boolean flag indicating if post has video';
COMMENT ON COLUMN public.blog_posts.has_chart IS 'Boolean flag indicating if post has chart';
COMMENT ON COLUMN public.blog_posts.has_table IS 'Boolean flag indicating if post has table';

-- Update existing posts to have default values
UPDATE public.blog_posts 
SET has_video = FALSE, 
    has_chart = FALSE, 
    has_table = FALSE 
WHERE has_video IS NULL 
   OR has_chart IS NULL 
   OR has_table IS NULL; 