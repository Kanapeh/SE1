-- ایجاد جدول کلاس‌ها برای مدیریت جلسات آنلاین
-- این فایل را در Supabase SQL Editor اجرا کنید

-- 1. ایجاد جدول classes
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- مدت زمان به دقیقه
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    subject TEXT,
    notes TEXT,
    meeting_url TEXT, -- لینک جلسه آنلاین
    recording_url TEXT, -- لینک ضبط جلسه
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. ایجاد index ها
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_student_id ON public.classes(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_status ON public.classes(status);
CREATE INDEX IF NOT EXISTS idx_classes_scheduled_time ON public.classes(scheduled_time);

-- 3. فعال کردن RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- 4. ایجاد policies
-- معلمان می‌توانند کلاس‌های خود را ببینند
CREATE POLICY "Teachers can view own classes" ON public.classes
    FOR SELECT
    TO authenticated
    USING (teacher_id = auth.uid());

-- معلمان می‌توانند کلاس‌های خود را ویرایش کنند
CREATE POLICY "Teachers can update own classes" ON public.classes
    FOR UPDATE
    TO authenticated
    USING (teacher_id = auth.uid());

-- دانش‌آموزان می‌توانند کلاس‌های خود را ببینند
CREATE POLICY "Students can view own classes" ON public.classes
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- دانش‌آموزان می‌توانند کلاس‌های خود را ویرایش کنند
CREATE POLICY "Students can update own classes" ON public.classes
    FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid());

-- ادمین‌ها می‌توانند تمام کلاس‌ها را ببینند
CREATE POLICY "Admins can view all classes" ON public.classes
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 5. اضافه کردن داده‌های نمونه (اختیاری)
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
LIMIT 1
ON CONFLICT DO NOTHING;

-- 6. بررسی جدول ایجاد شده
SELECT 
    'Classes table created' as status,
    COUNT(*) as total_classes
FROM public.classes;

-- 7. نمایش کلاس‌های موجود
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
ORDER BY c.scheduled_time DESC;

-- 8. پیام موفقیت
SELECT '✅ Classes table created successfully!' as status;
