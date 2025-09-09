-- Fix user_id columns in teachers and students tables
-- This script ensures the tables have the correct structure for the API

-- 1. Check current table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('teachers', 'students')
AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;

-- 2. Add user_id column to teachers table if it doesn't exist
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Add user_id column to students table if it doesn't exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar TEXT,
    birth_date DATE,
    gender TEXT,
    country TEXT DEFAULT 'ایران',
    city TEXT,
    bio TEXT,
    level TEXT,
    primary_language TEXT DEFAULT 'فارسی',
    experience_years INTEGER DEFAULT 0,
    preferred_time TEXT,
    session_duration INTEGER DEFAULT 60,
    group_size TEXT DEFAULT 'individual',
    learning_style TEXT DEFAULT 'interactive',
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    class_reminders BOOLEAN DEFAULT TRUE,
    progress_updates BOOLEAN DEFAULT TRUE,
    promotional_emails BOOLEAN DEFAULT FALSE,
    profile_visibility TEXT DEFAULT 'public',
    show_progress BOOLEAN DEFAULT TRUE,
    allow_messages BOOLEAN DEFAULT TRUE,
    show_online_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON public.teachers(email);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);

-- 6. Enable RLS on students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for students table
DROP POLICY IF EXISTS "Students can view own profile" ON public.students;
DROP POLICY IF EXISTS "Students can update own profile" ON public.students;
DROP POLICY IF EXISTS "Students can insert own profile" ON public.students;
DROP POLICY IF EXISTS "Admins can manage all students" ON public.students;

CREATE POLICY "Students can view own profile" ON public.students
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update own profile" ON public.students
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own profile" ON public.students
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 8. Update existing records to populate user_id from id
UPDATE public.teachers 
SET user_id = id 
WHERE user_id IS NULL;

UPDATE public.students 
SET user_id = id 
WHERE user_id IS NULL;

-- 9. Verify the fixes
SELECT 
    'teachers' as table_name,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id
FROM public.teachers
UNION ALL
SELECT 
    'students' as table_name,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id
FROM public.students;
