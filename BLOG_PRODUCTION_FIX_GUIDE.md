# 🔧 راهنمای حل مشکل عدم نمایش مقاله در Production

## 🎯 مشکل
مقاله در `http://localhost:3000/blog/2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively` کار می‌کند اما در `https://www.se1a.org/blog/2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively` نمایش داده نمی‌شود.

## 🔍 مراحل عیب‌یابی

### مرحله 1: بررسی دیتابیس
1. به صفحه عیب‌یابی بروید: `http://localhost:3000/debug-blog-production`
2. Slug مقاله را وارد کنید: `2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively`
3. روی "بررسی Slug" کلیک کنید
4. نتایج را بررسی کنید

### مرحله 2: بررسی Environment Variables
مطمئن شوید که در Vercel (یا hosting provider شما) این متغیرها تنظیم شده‌اند:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### مرحله 3: بررسی جدول دیتابیس
در Supabase SQL Editor این کوئری را اجرا کنید:

```sql
-- بررسی وجود جدول
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'blog_posts';

-- بررسی مقالات موجود
SELECT id, title, slug, status, created_at 
FROM blog_posts 
ORDER BY created_at DESC 
LIMIT 10;

-- بررسی مقاله خاص
SELECT * FROM blog_posts 
WHERE slug = '2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively';
```

### مرحله 4: بررسی RLS Policies
```sql
-- بررسی RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'blog_posts';

-- غیرفعال کردن موقت RLS برای تست
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
```

## 🚀 راه‌حل‌های ممکن

### راه‌حل 1: ایجاد جدول در Production
اگر جدول `blog_posts` در production وجود ندارد:

1. فایل `database/create_blog_posts_table.sql` را در Supabase اجرا کنید
2. مطمئن شوید که RLS policies درست تنظیم شده‌اند

### راه‌حل 2: مهاجرت مقالات از Localhost
اگر مقالات فقط در localhost هستند:

1. مقالات را از localhost export کنید
2. در production import کنید
3. یا مستقیماً در production ایجاد کنید

### راه‌حل 3: بررسی Environment Variables
اگر environment variables درست نیستند:

1. در Vercel Dashboard بروید
2. به Settings > Environment Variables بروید
3. متغیرهای Supabase را اضافه کنید
4. پروژه را redeploy کنید

### راه‌حل 4: بررسی RLS Policies
اگر RLS policies مشکل دارند:

```sql
-- حذف policies قدیمی
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;

-- ایجاد policy جدید
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');
```

## 🧪 تست‌های اضافی

### تست 1: بررسی API Endpoint
```bash
# تست API در localhost
curl "http://localhost:3000/api/debug-blog-post?slug=2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively"

# تست API در production
curl "https://www.se1a.org/api/debug-blog-post?slug=2025-best-scientific-solutions-for-learning-english-faster-and-more-effectively"
```

### تست 2: بررسی مستقیم دیتابیس
```sql
-- بررسی اتصال به دیتابیس
SELECT current_database(), current_user, version();

-- بررسی جدول blog_posts
\d blog_posts;

-- بررسی داده‌ها
SELECT COUNT(*) FROM blog_posts;
SELECT COUNT(*) FROM blog_posts WHERE status = 'published';
```

### تست 3: بررسی Log ها
1. در Vercel Dashboard به Functions بروید
2. Log های مربوط به API calls را بررسی کنید
3. خطاهای احتمالی را پیدا کنید

## 🔧 اسکریپت‌های کمکی

### اسکریپت بررسی دیتابیس
```sql
-- بررسی کامل وضعیت دیتابیس
SELECT 
    'blog_posts' as table_name,
    COUNT(*) as total_rows,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_rows,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_rows
FROM blog_posts
UNION ALL
SELECT 
    'comments' as table_name,
    COUNT(*) as total_rows,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_rows,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_rows
FROM comments;
```

### اسکریپت ایجاد مقاله تست
```sql
-- ایجاد مقاله تست
INSERT INTO blog_posts (
    title, 
    content, 
    slug, 
    image_url, 
    author, 
    status, 
    published_at,
    tags
) VALUES (
    'تست مقاله Production',
    '<p>این یک مقاله تست برای بررسی عملکرد در production است.</p>',
    'test-production-article',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    'سیستم تست',
    'published',
    NOW(),
    ARRAY['تست', 'production']
);
```

## 📞 در صورت ادامه مشکل

اگر بعد از انجام این مراحل مشکل حل نشد:

1. **بررسی Console**: خطاهای JavaScript در مرورگر را بررسی کنید
2. **بررسی Network**: درخواست‌های HTTP در Developer Tools را بررسی کنید
3. **بررسی Supabase Logs**: در Supabase Dashboard به Logs بروید
4. **بررسی Vercel Logs**: در Vercel Dashboard به Functions > Logs بروید

## ✅ چک‌لیست نهایی

- [ ] جدول `blog_posts` در Supabase وجود دارد
- [ ] RLS policies درست تنظیم شده‌اند
- [ ] Environment variables در Vercel تنظیم شده‌اند
- [ ] مقاله با status 'published' وجود دارد
- [ ] API endpoint در production کار می‌کند
- [ ] پروژه در Vercel redeploy شده است

---

**نکته مهم**: همیشه قبل از تغییرات مهم، از دیتابیس خود پشتیبان تهیه کنید.
