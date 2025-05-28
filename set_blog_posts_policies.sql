-- Enable RLS on blog_posts table
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting new posts (authenticated users only)
CREATE POLICY "Enable insert for authenticated users only"
ON blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for viewing posts (public)
CREATE POLICY "Enable read access for all users"
ON blog_posts
FOR SELECT
TO public
USING (true);

-- Create policy for updating posts (authenticated users only)
CREATE POLICY "Enable update for authenticated users only"
ON blog_posts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for deleting posts (authenticated users only)
CREATE POLICY "Enable delete for authenticated users only"
ON blog_posts
FOR DELETE
TO authenticated
USING (true); 