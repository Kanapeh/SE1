-- Create sample notifications for testing
-- This script creates sample notifications to test the recent activities section

-- 1. Get a teacher ID to create notifications for
DO $$
DECLARE
    teacher_uuid UUID;
BEGIN
    -- Get the first teacher's ID
    SELECT id INTO teacher_uuid FROM public.teachers LIMIT 1;
    
    IF teacher_uuid IS NOT NULL THEN
        -- Insert sample notifications
        INSERT INTO public.notifications (teacher_id, type, title, message, read, created_at)
        VALUES 
            (
                teacher_uuid,
                'booking',
                'کلاس جدید رزرو شد',
                'سپنتا علیزاده کلاس انگلیسی سطح متوسط را برای شنبه صبح رزرو کرد',
                false,
                NOW() - INTERVAL '1 hour'
            ),
            (
                teacher_uuid,
                'payment',
                'پرداخت جدید دریافت شد',
                'پرداخت کلاس انگلیسی سطح پیشرفته با مبلغ 150,000 تومان دریافت شد',
                false,
                NOW() - INTERVAL '2 hours'
            ),
            (
                teacher_uuid,
                'message',
                'پیام جدید از دانش‌آموز',
                'احمد محمدی پیام جدیدی برای شما ارسال کرده است',
                true,
                NOW() - INTERVAL '3 hours'
            ),
            (
                teacher_uuid,
                'system',
                'بروزرسانی سیستم',
                'سیستم با موفقیت بروزرسانی شد. ویژگی‌های جدید اضافه شده است',
                true,
                NOW() - INTERVAL '1 day'
            ),
            (
                teacher_uuid,
                'booking',
                'کلاس لغو شد',
                'کلاس انگلیسی سطح مبتدی برای فردا لغو شد',
                false,
                NOW() - INTERVAL '4 hours'
            );
            
        RAISE NOTICE 'Sample notifications created for teacher: %', teacher_uuid;
    ELSE
        RAISE NOTICE 'No teachers found to create notifications for';
    END IF;
END $$;

-- 2. Show created notifications
SELECT 
    'Sample Notifications Created' as status,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN read = false THEN 1 END) as unread_notifications,
    COUNT(CASE WHEN read = true THEN 1 END) as read_notifications
FROM public.notifications;

-- 3. Show recent notifications
SELECT 
    'Recent Notifications' as section,
    id,
    type,
    title,
    message,
    read,
    created_at
FROM public.notifications 
ORDER BY created_at DESC 
LIMIT 5;
