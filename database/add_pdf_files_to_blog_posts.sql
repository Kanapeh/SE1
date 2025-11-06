-- Add PDF files support to blog_posts table
-- This script adds a field to store PDF attachments as JSON array

-- Add pdf_files column to store array of PDF file information
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS pdf_files JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance on JSONB queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_pdf_files ON blog_posts USING GIN (pdf_files);

-- Comment on the column
COMMENT ON COLUMN blog_posts.pdf_files IS 'Array of PDF file attachments. Each entry contains: {name: string, url: string, size: number}';

