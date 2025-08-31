-- Setup Admin Teacher Access
-- This script ensures admins can access and manage teachers

-- 1. Ensure teachers table exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    gender TEXT,
    birthdate DATE,
    national_id TEXT UNIQUE,
    
    -- Teaching profile
    languages TEXT[] DEFAULT '{}',
    levels TEXT[] DEFAULT '{}',
    class_types TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    education TEXT,
    bio TEXT,
    
    -- Availability and pricing
    available_days TEXT[] DEFAULT '{}',
    available_hours TEXT[] DEFAULT '{}',
    preferred_time TEXT[] DEFAULT '{}',
    hourly_rate INTEGER,
    max_students_per_class INTEGER DEFAULT 1,
    location TEXT,
    
    -- Certificates and methods
    certificates TEXT[] DEFAULT '{}',
    teaching_methods TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    
    -- Additional info
    address TEXT,
    notes TEXT,
    
    -- Status and availability
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'Approved', 'active', 'rejected', 'inactive')),
    available BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_students INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teachers_status ON public.teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_languages ON public.teachers USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_teachers_levels ON public.teachers USING GIN(levels);
CREATE INDEX IF NOT EXISTS idx_teachers_location ON public.teachers(location);
CREATE INDEX IF NOT EXISTS idx_teachers_hourly_rate ON public.teachers(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_teachers_available ON public.teachers(available);
CREATE INDEX IF NOT EXISTS idx_teachers_created_at ON public.teachers(created_at);

-- 3. Ensure admins table exists
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create RLS policies for teachers table
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Teachers are viewable by everyone" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Only admins can insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can manage all teachers" ON public.teachers;

-- Public can view approved teachers
CREATE POLICY "Public can view approved teachers" ON public.teachers
    FOR SELECT USING (status IN ('Approved', 'active'));

-- Teachers can update their own profile
CREATE POLICY "Teachers can update own profile" ON public.teachers
    FOR UPDATE USING (auth.uid() = id);

-- Teachers can insert their own profile
CREATE POLICY "Teachers can insert own profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can do everything with teachers
CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 5. Create RLS policies for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Only super admins can modify admins" ON public.admins;

-- Admins can view all admins
CREATE POLICY "Admins can view all admins" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- Only existing admins can modify admin records
CREATE POLICY "Admins can manage admins" ON public.admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- 6. Grant necessary permissions
GRANT ALL ON public.teachers TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. Create functions for admin operations
CREATE OR REPLACE FUNCTION public.approve_teacher(teacher_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE user_id = auth.uid() 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Only admins can approve teachers';
    END IF;
    
    -- Update teacher status
    UPDATE public.teachers 
    SET status = 'Approved', updated_at = now()
    WHERE id = teacher_id;
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_teacher(teacher_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE user_id = auth.uid() 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Only admins can reject teachers';
    END IF;
    
    -- Update teacher status
    UPDATE public.teachers 
    SET status = 'rejected', updated_at = now()
    WHERE id = teacher_id;
    
    RETURN FOUND;
END;
$$;

-- 8. Create a function to get teacher statistics
CREATE OR REPLACE FUNCTION public.get_teacher_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE user_id = auth.uid() 
        AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Only admins can view teacher statistics';
    END IF;
    
    SELECT json_build_object(
        'total', COUNT(*),
        'pending', COUNT(*) FILTER (WHERE status = 'pending'),
        'approved', COUNT(*) FILTER (WHERE status IN ('Approved', 'active')),
        'rejected', COUNT(*) FILTER (WHERE status = 'rejected')
    ) INTO result
    FROM public.teachers;
    
    RETURN result;
END;
$$;

-- 9. Sample data for testing (optional)
-- Uncomment the lines below if you want to create sample teachers for testing

-- INSERT INTO public.teachers (
--     id, email, first_name, last_name, phone, languages, levels,
--     experience_years, bio, status, created_at
-- ) VALUES 
-- (gen_random_uuid(), 'teacher1@example.com', 'احمد', 'محمدی', '09123456789', 
--  ARRAY['انگلیسی', 'فرانسوی'], ARRAY['مبتدی', 'متوسط'], 3, 
--  'معلم با تجربه در آموزش زبان انگلیسی', 'pending', now()),
-- (gen_random_uuid(), 'teacher2@example.com', 'فاطمه', 'احمدی', '09987654321', 
--  ARRAY['آلمانی', 'انگلیسی'], ARRAY['پیشرفته'], 5, 
--  'متخصص آموزش زبان آلمانی و انگلیسی', 'pending', now()),
-- (gen_random_uuid(), 'teacher3@example.com', 'علی', 'رضایی', '09111222333', 
--  ARRAY['اسپانیایی'], ARRAY['مبتدی', 'متوسط', 'پیشرفته'], 7, 
--  'معلم اسپانیایی با مدرک بین‌المللی', 'Approved', now());

-- 10. Success message
DO $$
BEGIN
    RAISE NOTICE 'Admin teacher access setup completed successfully!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Add yourself as admin: INSERT INTO public.admins (user_id) VALUES ((SELECT id FROM auth.users WHERE email = ''your-email@example.com''));';
    RAISE NOTICE '2. Visit /admin/teachers to manage teachers';
    RAISE NOTICE '3. Test teacher approval functionality';
END $$;
