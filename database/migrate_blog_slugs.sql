-- Migration script to update existing blog posts with English slugs
-- This script will convert Persian titles to English slugs

-- First, let's see what posts we have
SELECT id, title, slug, status FROM blog_posts ORDER BY created_at DESC;

-- Update existing posts with English slugs based on their titles
-- This is a one-time migration

-- Example mappings for common Persian titles to English slugs
UPDATE blog_posts 
SET slug = 'best-english-learning-methods-2025'
WHERE title LIKE '%بهترین راهکارهای علمی برای یادگیری زبان انگلیسی%'
AND slug LIKE '%2025%';

-- Generic function to create English slugs from Persian titles
-- This will be applied to posts that don't have English slugs yet

-- For posts with Persian slugs, create English equivalents
UPDATE blog_posts 
SET slug = CASE 
  WHEN title LIKE '%یادگیری زبان انگلیسی%' THEN 'learn-english-effectively'
  WHEN title LIKE '%گرامر انگلیسی%' THEN 'english-grammar-guide'
  WHEN title LIKE '%مکالمه انگلیسی%' THEN 'english-conversation-tips'
  WHEN title LIKE '%آیلتس%' THEN 'ielts-preparation-guide'
  WHEN title LIKE '%تافل%' THEN 'toefl-preparation-tips'
  WHEN title LIKE '%واژگان انگلیسی%' THEN 'english-vocabulary-building'
  WHEN title LIKE '%تلفظ انگلیسی%' THEN 'english-pronunciation-guide'
  WHEN title LIKE '%نوشتن انگلیسی%' THEN 'english-writing-skills'
  WHEN title LIKE '%خواندن انگلیسی%' THEN 'english-reading-comprehension'
  WHEN title LIKE '%شنیدن انگلیسی%' THEN 'english-listening-skills'
  ELSE 'blog-post-' || EXTRACT(EPOCH FROM created_at)::text
END
WHERE slug ~ '[^\x00-\x7F]' -- Contains non-ASCII characters (Persian)
AND status = 'published';

-- Add a unique constraint to prevent duplicate slugs
ALTER TABLE blog_posts ADD CONSTRAINT unique_slug UNIQUE (slug);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_unique ON blog_posts(slug);

-- Show the updated posts
SELECT id, title, slug, status, created_at 
FROM blog_posts 
ORDER BY created_at DESC 
LIMIT 10;
