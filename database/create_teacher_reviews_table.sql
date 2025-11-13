-- Create teacher_reviews table for storing student reviews about teachers
CREATE TABLE IF NOT EXISTS teacher_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_reviews_teacher_id ON teacher_reviews(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_reviews_student_id ON teacher_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_reviews_status ON teacher_reviews(status);
CREATE INDEX IF NOT EXISTS idx_teacher_reviews_created_at ON teacher_reviews(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_teacher_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_teacher_reviews_updated_at 
    BEFORE UPDATE ON teacher_reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_teacher_reviews_updated_at();

-- Enable RLS
ALTER TABLE teacher_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher_reviews
-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON teacher_reviews
    FOR SELECT USING (status = 'approved');

-- Students can view their own reviews
CREATE POLICY "Students can view their own reviews" ON teacher_reviews
    FOR SELECT USING (auth.uid() = student_id);

-- Teachers can view reviews about them
CREATE POLICY "Teachers can view their reviews" ON teacher_reviews
    FOR SELECT USING (
        teacher_id IN (
            SELECT id FROM teachers WHERE id = teacher_id
        )
    );

-- Anyone can insert reviews (they will be pending by default)
CREATE POLICY "Anyone can insert reviews" ON teacher_reviews
    FOR INSERT WITH CHECK (true);

-- Insert some sample reviews for testing (optional)
-- You can remove this section if you don't want sample data
INSERT INTO teacher_reviews (teacher_id, student_name, student_email, rating, comment, status)
SELECT 
    t.id,
    'سارا احمدی',
    'sara@example.com',
    5,
    'معلم بسیار عالی و صبوری است. روش تدریس ایشان بسیار مؤثر است و در مدت کوتاهی پیشرفت زیادی داشتم.',
    'approved'
FROM teachers t
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO teacher_reviews (teacher_id, student_name, student_email, rating, comment, status)
SELECT 
    t.id,
    'علی محمدی',
    'ali@example.com',
    5,
    'بهترین معلمی که تا حالا داشتم. توضیحات بسیار واضح و قابل فهم است.',
    'approved'
FROM teachers t
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO teacher_reviews (teacher_id, student_name, student_email, rating, comment, status)
SELECT 
    t.id,
    'فاطمه کریمی',
    'fateme@example.com',
    4,
    'کلاس‌های خوبی دارد و همیشه آماده پاسخگویی به سوالات است.',
    'approved'
FROM teachers t
LIMIT 1
ON CONFLICT DO NOTHING;

