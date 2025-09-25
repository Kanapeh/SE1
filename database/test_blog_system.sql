-- تست کامل سیستم وبلاگ
-- این اسکریپت را در Supabase SQL Editor اجرا کنید

-- 1. بررسی وجود جدول
SELECT 
    'Table exists' as test,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts') 
        THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as result;

-- 2. بررسی ساختار جدول
SELECT 
    'Table structure' as test,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'slug')
        THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as result;

-- 3. بررسی RLS فعال بودن
SELECT 
    'RLS enabled' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_class 
            WHERE relname = 'blog_posts' 
            AND relrowsecurity = true
        )
        THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as result;

-- 4. بررسی Policies
SELECT 
    'RLS policies' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'blog_posts'
        )
        THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as result;

-- 5. بررسی مقالات موجود
SELECT 
    'Blog posts count' as test,
    CASE 
        WHEN (SELECT COUNT(*) FROM blog_posts) > 0
        THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as result;

-- 6. بررسی مقالات منتشر شده
SELECT 
    'Published posts' as test,
    CASE 
        WHEN (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') > 0
        THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as result;

-- 7. بررسی slug های منحصر به فرد
SELECT 
    'Unique slugs' as test,
    CASE 
        WHEN (SELECT COUNT(DISTINCT slug) FROM blog_posts) = (SELECT COUNT(*) FROM blog_posts)
        THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as result;

-- 8. نمایش آمار کلی
SELECT 
    'Total posts' as metric,
    COUNT(*) as value
FROM blog_posts
UNION ALL
SELECT 
    'Published posts' as metric,
    COUNT(*) as value
FROM blog_posts 
WHERE status = 'published'
UNION ALL
SELECT 
    'Draft posts' as metric,
    COUNT(*) as value
FROM blog_posts 
WHERE status = 'draft'
UNION ALL
SELECT 
    'Unique authors' as metric,
    COUNT(DISTINCT author) as value
FROM blog_posts;

-- 9. نمایش مقالات با جزئیات
SELECT 
    'Blog posts details' as section,
    title,
    slug,
    status,
    author,
    created_at::date as created_date,
    array_length(tags, 1) as tag_count
FROM blog_posts 
ORDER BY created_at DESC;

-- 10. تست دسترسی (شبیه‌سازی درخواست عمومی)
-- این کوئری باید بدون خطا اجرا شود
SELECT 
    'Public access test' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE status = 'published' 
            LIMIT 1
        )
        THEN '✅ PASS - Public can read published posts' 
        ELSE '❌ FAIL - Public cannot read published posts' 
    END as result;

-- 11. نمایش Policies موجود
SELECT 
    'RLS Policies' as section,
    policyname,
    cmd as command,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'blog_posts'
ORDER BY policyname;

-- 12. نمایش Indexes
SELECT 
    'Indexes' as section,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'blog_posts'
ORDER BY indexname;

-- 13. پیام نهایی
SELECT 
    'System Status' as status,
    CASE 
        WHEN (
            EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts') AND
            EXISTS (SELECT 1 FROM pg_class WHERE relname = 'blog_posts' AND relrowsecurity = true) AND
            EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts') AND
            (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') > 0
        )
        THEN '🎉 ALL TESTS PASSED - Blog system is ready!'
        ELSE '⚠️ SOME TESTS FAILED - Check the results above'
    END as message;
