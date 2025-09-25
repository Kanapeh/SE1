-- Create blog_posts table with proper slug support
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  author VARCHAR(255) NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  video_url TEXT,
  chart_data JSONB,
  table_data JSONB,
  has_video BOOLEAN DEFAULT FALSE,
  has_chart BOOLEAN DEFAULT FALSE,
  has_table BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 5
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own posts" ON blog_posts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert their own posts" ON blog_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" ON blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts" ON blog_posts
    FOR DELETE USING (auth.uid() = author_id);

-- Create function to generate slug from English title
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Insert sample blog post for testing
INSERT INTO blog_posts (title, content, excerpt, slug, image_url, author, status, published_at, tags)
VALUES (
    'بهترین راهکارهای علمی برای یادگیری زبان انگلیسی سریع‌تر و مؤثرتر',
    '<p>یادگیری زبان انگلیسی یکی از مهم‌ترین مهارت‌های امروزی است که می‌تواند فرصت‌های شغلی و تحصیلی بسیاری را برای شما فراهم کند. در این مقاله، بهترین راهکارهای علمی و اثبات‌شده برای یادگیری سریع‌تر و مؤثرتر زبان انگلیسی را بررسی می‌کنیم.</p><p>مطالعات نشان داده‌اند که روش‌های مختلف یادگیری برای افراد مختلف مؤثر است. با این حال، برخی اصول کلی وجود دارد که می‌تواند به همه کمک کند.</p>',
    'راهکارهای علمی و اثبات‌شده برای یادگیری سریع‌تر زبان انگلیسی',
    'best-scientific-methods-learn-english-faster',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    'آکادمی زبان سِ وان',
    'published',
    NOW(),
    ARRAY['آموزش زبان', 'یادگیری سریع', 'روش‌های علمی']
) ON CONFLICT (slug) DO NOTHING;

-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Enable RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Anyone can view approved comments" ON comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authors can view all comments on their posts" ON comments
    FOR SELECT USING (
        post_id IN (
            SELECT id FROM blog_posts WHERE author_id = auth.uid()
        )
    );

-- Add email validation constraint
ALTER TABLE comments ADD CONSTRAINT comments_email_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
