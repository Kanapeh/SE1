-- راه‌حل نهایی برای مشکل عدم نمایش معلم‌ها
-- این اسکریپت مرحله به مرحله اجرا می‌شود

-- مرحله 1: بررسی وضعیت فعلی
SELECT COUNT(*) as total_teachers FROM public.teachers;

-- مرحله 2: نمایش معلمان موجود
SELECT id, first_name, last_name, email, status, created_at
FROM public.teachers
ORDER BY created_at DESC;

-- مرحله 3: ایجاد جدول admins
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- مرحله 4: فعال کردن RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- مرحله 5: اضافه کردن ستون user_id
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- مرحله 6: ایجاد ایندکس
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);

-- مرحله 7: حذف policies قدیمی
DROP POLICY IF EXISTS "Public can view approved teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public can view active teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;

-- مرحله 8: ایجاد policies جدید
CREATE POLICY "Public can view active teachers" ON public.teachers
    FOR SELECT USING (status IN ('active', 'Approved'));

CREATE POLICY "Teachers can update own profile" ON public.teachers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can insert own profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

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

-- مرحله 9: اعطای دسترسی‌ها
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- مرحله 10: اضافه کردن ادمین
INSERT INTO public.admins (user_id, role, is_active)
SELECT id, 'admin', true
FROM auth.users 
WHERE id = auth.uid()
ON CONFLICT (user_id) 
DO UPDATE SET 
    is_active = true,
    role = 'admin',
    updated_at = now();

-- مرحله 11: تست نهایی
SELECT COUNT(*) as final_teacher_count FROM public.teachers;
