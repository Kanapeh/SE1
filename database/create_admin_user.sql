-- ایجاد جدول admins
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- فعال کردن RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies برای جدول admins
CREATE POLICY "Admins can manage admins" ON public.admins
    FOR ALL USING (true);

-- اضافه کردن کاربر ادمین (ایمیل خود را اینجا قرار دهید)
-- ابتدا باید کاربر را در auth.users ایجاد کنید، سپس اینجا اضافه کنید

-- مثال: اگر ایمیل شما example@email.com است
-- INSERT INTO public.admins (user_id, role, permissions)
-- SELECT id, 'admin', ARRAY['all']
-- FROM auth.users 
-- WHERE email = 'example@email.com';

-- یا اگر می‌خواهید کاربر فعلی را ادمین کنید:
-- INSERT INTO public.admins (user_id, role, permissions)
-- VALUES (auth.uid(), 'admin', ARRAY['all']);

-- نمایش کاربران موجود
SELECT 
    au.id,
    au.email,
    au.role,
    CASE 
        WHEN adm.user_id IS NOT NULL THEN 'Admin'
        ELSE 'Regular User'
    END as user_type
FROM auth.users au
LEFT JOIN public.admins adm ON au.id = adm.user_id
ORDER BY au.created_at DESC;
