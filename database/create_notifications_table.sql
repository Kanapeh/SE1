-- Create notifications table if it doesn't exist
-- This script creates the notifications table for the teacher dashboard

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'booking', 'payment', 'message', 'system'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_teacher_id ON public.notifications(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- 3. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Teachers can see their own notifications
CREATE POLICY "Teachers can view their own notifications" ON public.notifications
    FOR SELECT USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- Teachers can update their own notifications (mark as read)
CREATE POLICY "Teachers can update their own notifications" ON public.notifications
    FOR UPDATE USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- System can insert notifications (for booking confirmations, etc.)
CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- 5. Create function to automatically create notification when booking is made
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert notification for teacher when booking is created
    INSERT INTO public.notifications (
        teacher_id,
        type,
        title,
        message,
        read
    ) VALUES (
        NEW.teacher_id,
        'booking',
        'کلاس جدید رزرو شد',
        CONCAT(
            'یک دانش‌آموز کلاس ',
            COALESCE(NEW.language, 'زبان'),
            ' سطح ',
            COALESCE(NEW.level, 'متوسط'),
            ' را برای ',
            COALESCE(NEW.preferred_time, 'زمان مشخص شده'),
            ' رزرو کرد'
        ),
        false
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for booking notifications
DROP TRIGGER IF EXISTS trigger_create_booking_notification ON public.bookings;
CREATE TRIGGER trigger_create_booking_notification
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION create_booking_notification();

-- 7. Insert some sample notifications for testing
INSERT INTO public.notifications (teacher_id, type, title, message, read)
SELECT 
    t.id as teacher_id,
    'booking' as type,
    'کلاس جدید رزرو شد' as title,
    'سپنتا علیزاده کلاس انگلیسی سطح متوسط را برای شنبه صبح رزرو کرد' as message,
    false as read
FROM public.teachers t
LIMIT 1;

-- 8. Show created notifications
SELECT 
    'Created Notifications' as status,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN read = false THEN 1 END) as unread_notifications
FROM public.notifications;