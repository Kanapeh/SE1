-- ============================================
-- راه‌اندازی سیستم PDF برای مقالات بلاگ (نسخه ساده)
-- ============================================
-- این نسخه فقط دستورات ضروری را دارد و بدون permission اضافی کار می‌کند

-- ============================================
-- مرحله 1: افزودن فیلد pdf_files به جدول blog_posts
-- ============================================
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS pdf_files JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- مرحله 2: افزودن ایندکس برای عملکرد بهتر
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_pdf_files 
ON blog_posts USING GIN (pdf_files);

-- ============================================
-- مرحله 3: حذف Policies قدیمی (اگر وجود دارند)
-- ============================================
DROP POLICY IF EXISTS "Allow public read access to PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete PDFs" ON storage.objects;

-- ============================================
-- مرحله 4: ایجاد RLS Policy برای خواندن فایل‌های PDF (دسترسی عمومی)
-- ============================================
CREATE POLICY "Allow public read access to PDFs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-pdfs');

-- ============================================
-- مرحله 5: ایجاد RLS Policy برای آپلود فایل‌های PDF (فقط کاربران لاگین شده)
-- ============================================
CREATE POLICY "Allow authenticated users to upload PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog-pdfs' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- مرحله 6: ایجاد RLS Policy برای حذف فایل‌های PDF (فقط کاربران لاگین شده)
-- ============================================
CREATE POLICY "Allow authenticated users to delete PDFs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog-pdfs' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- ✅ تمام! 
-- ============================================
-- حالا باید bucket را از Dashboard ایجاد کنید:
-- 1. به Supabase Dashboard → Storage بروید
-- 2. روی "New bucket" کلیک کنید
-- 3. Name: blog-pdfs
-- 4. Public bucket: ✅ (تیک بزنید)
-- 5. File size limit: 52428800 (50 مگابایت)
-- 6. Allowed MIME types: application/pdf
-- 7. Create bucket


