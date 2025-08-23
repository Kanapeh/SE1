-- اضافه کردن کاربر فعلی به عنوان دانش‌آموز
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. بررسی کاربران موجود
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. ایجاد جدول students (اگر وجود ندارد)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'students') THEN
        CREATE TABLE public.students (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT,
            gender TEXT,
            birthdate DATE,
            address TEXT,
            education_level TEXT,
            learning_goals TEXT,
            preferred_languages TEXT[],
            preferred_learning_style TEXT,
            availability TEXT[],
            notes TEXT,
            avatar TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
        
        RAISE NOTICE 'Table students created successfully';
    ELSE
        RAISE NOTICE 'Table students already exists';
    END IF;
END $$;

-- 3. اضافه کردن کاربر فعلی به عنوان دانش‌آموز
-- ایمیل خود را اینجا قرار دهید
INSERT INTO public.students (id, email, first_name, last_name, phone, education_level, preferred_languages, status)
SELECT 
    id,
    email,
    COALESCE(email, 'دانش‌آموز') as first_name,
    'فعلی' as last_name,
    '09123456789' as phone,
    'متوسط' as education_level,
    ARRAY['انگلیسی'] as preferred_languages,
    'active' as status
FROM auth.users 
WHERE email = 'your-email@example.com'  -- ایمیل خود را اینجا قرار دهید
ON CONFLICT (email) DO UPDATE SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    education_level = EXCLUDED.education_level,
    preferred_languages = EXCLUDED.preferred_languages,
    status = EXCLUDED.status,
    updated_at = timezone('utc'::text, now());

-- 4. بررسی دانش‌آموزان موجود
SELECT 
    id,
    first_name,
    last_name,
    email,
    education_level,
    preferred_languages,
    status,
    created_at
FROM public.students 
ORDER BY created_at DESC;

-- 5. اضافه کردن کلاس نمونه برای معلم سپنتا علیزاده
INSERT INTO public.classes (teacher_id, student_id, scheduled_time, duration, subject, notes, status)
SELECT 
    t.id as teacher_id,
    s.id as student_id,
    now() + interval '1 hour' as scheduled_time,
    60 as duration,
    'کلاس آنلاین زبان انگلیسی' as subject,
    'تمرکز روی مکالمه و گرامر' as notes,
    'scheduled' as status
FROM public.teachers t, public.students s
WHERE t.first_name = 'سپنتا' AND t.last_name = 'علیزاده'
AND s.email = 'your-email@example.com'  -- ایمیل خود را اینجا قرار دهید
ON CONFLICT DO NOTHING;

-- 6. بررسی کلاس‌های ایجاد شده
SELECT 
    c.id,
    c.subject,
    c.status,
    c.scheduled_time,
    t.first_name || ' ' || t.last_name as teacher_name,
    s.first_name || ' ' || s.last_name as student_name,
    s.email as student_email
FROM public.classes c
JOIN public.teachers t ON c.teacher_id = t.id
JOIN public.students s ON c.student_id = s.id
ORDER BY c.scheduled_time DESC;

-- 7. پیام موفقیت
SELECT '✅ Current user added as student successfully!' as status;
