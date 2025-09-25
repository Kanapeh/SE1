-- تنظیم RLS Policies برای جدول blog_posts
-- این اسکریپت را در Supabase SQL Editor اجرا کنید

-- فعال کردن RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- حذف policies قدیمی (اگر وجود دارند)
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can view their own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can insert their own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON public.blog_posts;

-- Policy 1: هر کسی می‌تواند مقالات منتشر شده را ببیند
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

-- Policy 2: نویسندگان می‌توانند مقالات خود را ببینند
CREATE POLICY "Authors can view their own posts" ON public.blog_posts
    FOR SELECT USING (auth.uid() = author_id);

-- Policy 3: نویسندگان می‌توانند مقالات خود را اضافه کنند
CREATE POLICY "Authors can insert their own posts" ON public.blog_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy 4: نویسندگان می‌توانند مقالات خود را ویرایش کنند
CREATE POLICY "Authors can update their own posts" ON public.blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

-- Policy 5: نویسندگان می‌توانند مقالات خود را حذف کنند
CREATE POLICY "Authors can delete their own posts" ON public.blog_posts
    FOR DELETE USING (auth.uid() = author_id);

-- Policy 6: برای کاربران غیر احراز هویت شده - فقط مقالات منتشر شده
CREATE POLICY "Anonymous users can view published posts" ON public.blog_posts
    FOR SELECT USING (status = 'published' AND auth.role() = 'anon');

-- Policy 7: برای کاربران احراز هویت شده - همه مقالات خود + مقالات منتشر شده
CREATE POLICY "Authenticated users can view published and own posts" ON public.blog_posts
    FOR SELECT USING (
        status = 'published' OR 
        auth.uid() = author_id
    );

-- بررسی policies ایجاد شده
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'blog_posts'
ORDER BY policyname;

-- نمایش پیام موفقیت
SELECT 'RLS policies for blog_posts table have been set up successfully!' as message;
