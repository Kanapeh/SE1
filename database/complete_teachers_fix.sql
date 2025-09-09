-- راه‌حل کامل برای مشکل عدم نمایش معلم‌ها
-- این اسکریپت جدول admins را درست ایجاد می‌کند

-- 1. بررسی وضعیت فعلی
SELECT 
    COUNT(*) as total_teachers,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_teachers,
    COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved_teachers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_teachers
FROM public.teachers;

-- 2. نمایش معلمان موجود
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers
ORDER BY created_at DESC;

-- 3. ایجاد جدول admins (اگر وجود ندارد)
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. فعال کردن RLS برای جدول admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 5. اضافه کردن ستون user_id به جدول teachers (اگر وجود ندارد)
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. ایجاد ایندکس برای user_id
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);

-- 7. حذف policies قدیمی
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;

-- 8. ایجاد policies جدید برای teachers
-- عموم می‌تواند معلمان فعال را ببینند
CREATE POLICY "Public can view active teachers" ON public.teachers
    FOR SELECT USING (status IN ('active', 'Approved'));

-- معلمان می‌توانند پروفایل خود را ویرایش کنند (بر اساس user_id)
CREATE POLICY "Teachers can update own profile" ON public.teachers
    FOR UPDATE USING (auth.uid() = user_id);

-- معلمان می‌توانند پروفایل خود را ایجاد کنند
CREATE POLICY "Teachers can insert own profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ادمین‌ها می‌توانند همه کار را با معلمان انجام دهند
CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 9. ایجاد policies برای admins
CREATE POLICY "Admins can view all admins" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

CREATE POLICY "Admins can manage admins" ON public.admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 10. اعطای دسترسی‌های لازم
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 11. اضافه کردن کاربر فعلی به عنوان ادمین (اگر وجود ندارد)
INSERT INTO public.admins (user_id, role, is_active)
SELECT 
    id, 
    'admin', 
    true
FROM auth.users 
WHERE id = auth.uid()
ON CONFLICT (user_id) 
DO UPDATE SET 
    is_active = true,
    role = 'admin',
    updated_at = now();

-- 12. تست دسترسی
SELECT 
    COUNT(*) as total_teachers_accessible,
    '✅ دسترسی موفق' as access_status
FROM public.teachers;

-- 13. تست دسترسی به معلمان در انتظار
SELECT 
    COUNT(*) as pending_teachers_accessible,
    '✅ دسترسی موفق' as access_status
FROM public.teachers 
WHERE status = 'pending';

-- 14. نمایش معلمان بعد از اصلاح
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at,
    '✅ قابل مشاهده' as visibility_status
FROM public.teachers
ORDER BY created_at DESC;

-- 15. بررسی ادمین‌ها
SELECT 
    a.user_id,
    u.email,
    a.role,
    a.is_active,
    a.created_at
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at;

-- 16. بررسی policies ایجاد شده
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('teachers', 'admins')
ORDER BY tablename, policyname;
