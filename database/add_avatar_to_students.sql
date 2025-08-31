-- Add missing columns to students table
-- This script adds all missing columns needed for the student profile functionality

-- Add avatar column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS avatar TEXT NULL;

-- Add birth_date column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS birth_date DATE NULL;

-- Add gender column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS gender TEXT NULL;

-- Add country column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS country TEXT NULL DEFAULT 'ایران';

-- Add city column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS city TEXT NULL;

-- Add bio column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS bio TEXT NULL;

-- Add level column (alias for current_language_level)
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS level TEXT NULL;

-- Add primary_language column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS primary_language TEXT NULL DEFAULT 'فارسی';

-- Add experience_years column
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS experience_years INTEGER NULL DEFAULT 0;

-- Study preferences columns
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS preferred_time TEXT NULL;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS session_duration INTEGER NULL DEFAULT 60;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS group_size TEXT NULL DEFAULT 'individual';

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS learning_style TEXT NULL DEFAULT 'interactive';

-- Notification preferences
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN NULL DEFAULT TRUE;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN NULL DEFAULT FALSE;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN NULL DEFAULT TRUE;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS class_reminders BOOLEAN NULL DEFAULT TRUE;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS progress_updates BOOLEAN NULL DEFAULT TRUE;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS promotional_emails BOOLEAN NULL DEFAULT FALSE;

-- Privacy settings
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS profile_visibility TEXT NULL DEFAULT 'public';

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS show_progress BOOLEAN NULL DEFAULT TRUE;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS allow_messages BOOLEAN NULL DEFAULT TRUE;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS show_online_status BOOLEAN NULL DEFAULT TRUE;

-- Add comments for documentation
COMMENT ON COLUMN public.students.avatar IS 'Base64 encoded avatar image for student profile';
COMMENT ON COLUMN public.students.birth_date IS 'Student birth date';
COMMENT ON COLUMN public.students.gender IS 'Student gender (male, female, other)';
COMMENT ON COLUMN public.students.country IS 'Student country';
COMMENT ON COLUMN public.students.city IS 'Student city';
COMMENT ON COLUMN public.students.bio IS 'Student biography/description';
COMMENT ON COLUMN public.students.level IS 'Current language level';
COMMENT ON COLUMN public.students.primary_language IS 'Primary language of student';
COMMENT ON COLUMN public.students.experience_years IS 'Years of language learning experience';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'students' 
AND column_name IN ('avatar', 'birth_date', 'gender', 'country', 'city', 'bio', 'level', 'primary_language', 'experience_years')
ORDER BY column_name;
