-- Add name and email fields to existing comments table
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

-- Create index for email field
CREATE INDEX IF NOT EXISTS idx_comments_email ON public.comments(email);

-- Update existing comments to have default values if needed
UPDATE public.comments 
SET name = 'کاربر ناشناس', 
    email = 'unknown@example.com' 
WHERE name IS NULL OR email IS NULL;

-- Make name and email NOT NULL for new comments
ALTER TABLE public.comments 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN email SET NOT NULL;

-- Add check constraint for email format
ALTER TABLE public.comments 
ADD CONSTRAINT comments_email_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'); 