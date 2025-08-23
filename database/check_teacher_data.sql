-- بررسی اطلاعات معلم سپنتا علیزاده
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. بررسی تمام معلمان موجود
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    created_at
FROM public.teachers 
ORDER BY created_at DESC;

-- 2. بررسی معلم سپنتا علیزاده
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    bio,
    languages,
    teaching_methods,
    status,
    created_at
FROM public.teachers 
WHERE first_name = 'سپنتا' AND last_name = 'علیزاده';

-- 3. بررسی معلم با ID مشخص
-- ID را از URL کپی کنید: 5b60e402-ebc9-4424-bc28-a79b95853cd2
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    bio,
    languages,
    teaching_methods,
    status,
    created_at
FROM public.teachers 
WHERE id = '5b60e402-ebc9-4424-bc28-a79b95853cd2';

-- 4. بررسی معلم احمدی (اگر وجود دارد)
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    bio,
    languages,
    teaching_methods,
    status,
    created_at
FROM public.teachers 
WHERE first_name LIKE '%احمد%' OR last_name LIKE '%احمد%';

-- 5. بررسی کلاس‌های موجود
SELECT 
    c.id,
    c.subject,
    c.status,
    c.scheduled_time,
    t.id as teacher_id,
    t.first_name || ' ' || t.last_name as teacher_name,
    s.id as student_id,
    s.first_name || ' ' || s.last_name as student_name
FROM public.classes c
JOIN public.teachers t ON c.teacher_id = t.id
JOIN public.students s ON c.student_id = s.id
ORDER BY c.scheduled_time DESC;

-- 6. بررسی کلاس‌های معلم سپنتا
SELECT 
    c.id,
    c.subject,
    c.status,
    c.scheduled_time,
    t.first_name || ' ' || t.last_name as teacher_name,
    s.first_name || ' ' || s.last_name as student_name
FROM public.classes c
JOIN public.teachers t ON c.teacher_id = t.id
JOIN public.students s ON c.student_id = s.id
WHERE t.first_name = 'سپنتا' AND t.last_name = 'علیزاده'
ORDER BY c.scheduled_time DESC;

-- 7. بررسی کلاس‌های معلم با ID مشخص
SELECT 
    c.id,
    c.subject,
    c.status,
    c.scheduled_time,
    t.first_name || ' ' || t.last_name as teacher_name,
    s.first_name || ' ' || s.last_name as student_name
FROM public.classes c
JOIN public.teachers t ON c.teacher_id = t.id
JOIN public.students s ON c.student_id = s.id
WHERE t.id = '5b60e402-ebc9-4424-bc28-a79b95853cd2'
ORDER BY c.scheduled_time DESC;

-- 8. بررسی دانش‌آموزان موجود
SELECT 
    id,
    first_name,
    last_name,
    email,
    education_level,
    preferred_languages,
    status
FROM public.students 
ORDER BY created_at DESC;
