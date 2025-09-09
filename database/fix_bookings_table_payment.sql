-- Fix bookings table for payment functionality
-- Add missing columns needed for payment processing

-- Add missing columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS number_of_sessions INTEGER DEFAULT 1;

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'card_to_card';

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS receipt_image TEXT;

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Update the status check constraint to include pending_payment
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'pending_payment', 'confirmed', 'completed', 'cancelled'));

-- Fix the incomplete RLS policy
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;

CREATE POLICY "Users can insert their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Add policy for admins to manage all bookings
CREATE POLICY "Admins can manage all bookings" ON public.bookings
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Add policy for teachers to view their bookings
CREATE POLICY "Teachers can view their bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.teachers WHERE id = teacher_id
        )
    );

-- Add policy for teachers to update their bookings
CREATE POLICY "Teachers can update their bookings" ON public.bookings
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM public.teachers WHERE id = teacher_id
        )
    );
