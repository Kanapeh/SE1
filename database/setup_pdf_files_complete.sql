-- ============================================
-- راه‌اندازی کامل سیستم PDF برای مقالات بلاگ
-- ============================================
-- این فایل را در Supabase SQL Editor اجرا کنید
-- تمام دستورات لازم برای PDF files را انجام می‌دهد

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
-- مرحله 3: ایجاد Storage Bucket
-- ============================================
-- ⚠️ توجه: ایجاد bucket از SQL ممکن است نیاز به permission داشته باشد
-- اگر خطا گرفتید، از Supabase Dashboard → Storage → New Bucket استفاده کنید
-- نام: blog-pdfs | Public: ✅ | File size: 52428800 | MIME: application/pdf

-- حذف bucket قدیمی (اگر وجود دارد)
DELETE FROM storage.buckets WHERE id = 'blog-pdfs';

-- ایجاد bucket جدید
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-pdfs',
  'blog-pdfs',
  true, -- دسترسی عمومی
  52428800, -- 50 مگابایت
  ARRAY['application/pdf']::text[] -- فقط فایل‌های PDF
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- مرحله 4: حذف Policies قدیمی (اگر وجود دارند)
-- ============================================
DROP POLICY IF EXISTS "Allow public read access to PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete PDFs" ON storage.objects;

-- ============================================
-- مرحله 5: ایجاد RLS Policy برای خواندن فایل‌های PDF (دسترسی عمومی)
-- ============================================
CREATE POLICY "Allow public read access to PDFs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-pdfs');

-- ============================================
-- مرحله 6: ایجاد RLS Policy برای آپلود فایل‌های PDF (فقط کاربران لاگین شده)
-- ============================================
CREATE POLICY "Allow authenticated users to upload PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog-pdfs' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- مرحله 7: ایجاد RLS Policy برای حذف فایل‌های PDF (فقط کاربران لاگین شده)
-- ============================================
CREATE POLICY "Allow authenticated users to delete PDFs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog-pdfs' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- مرحله 8: فعال کردن RLS برای storage.objects
-- ============================================
-- ⚠️ توجه: این دستور ممکن است نیاز به permission داشته باشد
-- اگر خطا گرفتید، RLS از قبل فعال است و مشکلی نیست
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- RLS ممکن است از قبل فعال باشد یا نیاز به permission داشته باشد
  RAISE NOTICE 'RLS برای storage.objects: %', SQLERRM;
END $$;

-- ============================================
-- ✅ تمام! سیستم PDF آماده استفاده است
-- ============================================
-- برای اطمینان، بررسی کنید:
-- 1. bucket 'blog-pdfs' در Storage ایجاد شده است
-- 2. bucket به صورت public است (در Dashboard بررسی کنید)
-- 3. Policies به درستی اعمال شده‌اند

-- ============================================
-- دستورات بررسی (اختیاری - برای تست)
-- ============================================

-- بررسی وجود فیلد pdf_files
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'pdf_files';

-- بررسی وجود bucket
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'blog-pdfs';

-- بررسی وجود policies (فقط نام‌ها)
SELECT policyname 
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects' 
AND policyname LIKE '%PDF%';

