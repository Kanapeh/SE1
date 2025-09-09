-- Add min_booking_notice column to teachers table
-- This column is used for teacher preferences but was missing from the table

-- 1. Add the missing column
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS min_booking_notice INTEGER DEFAULT 24;

-- 2. Add a comment to explain the column
COMMENT ON COLUMN public.teachers.min_booking_notice IS 'Minimum hours notice required for booking (default: 24 hours)';

-- 3. Update existing teachers to have the default value
UPDATE public.teachers 
SET min_booking_notice = 24 
WHERE min_booking_notice IS NULL;

-- 4. Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'teachers' 
AND column_name = 'min_booking_notice';
