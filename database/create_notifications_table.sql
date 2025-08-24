-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('success', 'info', 'warning', 'error')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_teacher_id ON notifications(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_notifications_updated_at();

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample notification for the existing booking
INSERT INTO notifications (user_id, teacher_id, type, title, message, read)
SELECT 
    '5b60e402-ebc9-4424-bc28-a79b95853cd2'::UUID, -- teacher_id from the existing booking
    '5b60e402-ebc9-4424-bc28-a79b95853cd2'::UUID, -- same as user_id for teacher
    'success',
    'کلاس جدید رزرو شد',
    'سپنتا علیزاده کلاس انگلیسی سطح متوسط را برای شنبه صبح رزرو کرد',
    FALSE
WHERE NOT EXISTS (
    SELECT 1 FROM notifications 
    WHERE teacher_id = '5b60e402-ebc9-4424-bc28-a79b95853cd2'::UUID 
    AND title = 'کلاس جدید رزرو شد'
);
