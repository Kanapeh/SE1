-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(50) NOT NULL,
  selected_days TEXT[] NOT NULL,
  selected_hours TEXT[] NOT NULL,
  session_type VARCHAR(50) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_teacher_id ON bookings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() IN (
        SELECT id FROM teachers WHERE id = teacher_id
    ));

CREATE POLICY "Users can insert their own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update their bookings" ON bookings
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM teachers WHERE id = teacher_id
    ));

-- Insert sample data (optional)
-- INSERT INTO bookings (teacher_id, student_name, student_email, student_phone, selected_days, selected_hours, session_type, duration, total_price) 
-- VALUES ('5b60e402-ebc9-4424-bc28-a79b95853cd2', 'Sepanta Alizadeh', 'spantaalizadeh@gmail.com', '0913077288', ARRAY['saturday'], ARRAY['morning'], 'hybrid', 90, 300000);
