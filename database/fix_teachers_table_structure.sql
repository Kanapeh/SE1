-- اصلاح ساختار جدول teachers برای تطبیق با کد اپلیکیشن
-- این اسکریپت جدول teachers را اصلاح می‌کند

-- 1. بررسی وضعیت فعلی
-- شمارش معلمان
SELECT 
    COUNT(*) as total_teachers,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_teachers,
    COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved_teachers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_teachers
FROM public.teachers;

-- نمایش معلمان موجود
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers
ORDER BY created_at DESC;

-- 2. اضافه کردن ستون user_id اگر وجود ندارد
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. ایجاد ایندکس برای user_id
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);

-- 4. حذف policies قدیمی
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;

-- 5. ایجاد policies جدید
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

-- 6. اعطای دسترسی‌های لازم
GRANT ALL ON public.teachers TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. اضافه کردن کاربر فعلی به عنوان ادمین (اگر وجود ندارد)
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT 
    id, 
    'admin', 
    ARRAY['all'], 
    true
FROM auth.users 
WHERE id = auth.uid()
ON CONFLICT (user_id) 
DO UPDATE SET 
    is_active = true,
    role = 'admin',
    permissions = ARRAY['all'],
    updated_at = now();

-- 8. تست دسترسی
-- تست دسترسی کلی
SELECT 
    COUNT(*) as total_teachers_accessible,
    '✅ دسترسی موفق' as access_status
FROM public.teachers;

-- تست دسترسی به معلمان در انتظار
SELECT 
    COUNT(*) as pending_teachers_accessible,
    '✅ دسترسی موفق' as access_status
FROM public.teachers 
WHERE status = 'pending';

-- نمایش معلمان بعد از اصلاح
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

-- 9. بررسی policies ایجاد شده
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'teachers'
ORDER BY policyname;
