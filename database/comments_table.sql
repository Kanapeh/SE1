-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert comments
CREATE POLICY "Allow public comment insertion" ON comments
  FOR INSERT WITH CHECK (true);

-- Allow reading approved comments
CREATE POLICY "Allow reading approved comments" ON comments
  FOR SELECT USING (status = 'approved');

-- Allow admin to read all comments (you'll need to implement admin check in your app)
CREATE POLICY "Allow admin to read all comments" ON comments
  FOR SELECT USING (true);

-- Allow admin to update comments
CREATE POLICY "Allow admin to update comments" ON comments
  FOR UPDATE USING (true);

-- Allow admin to delete comments
CREATE POLICY "Allow admin to delete comments" ON comments
  FOR DELETE USING (true); 