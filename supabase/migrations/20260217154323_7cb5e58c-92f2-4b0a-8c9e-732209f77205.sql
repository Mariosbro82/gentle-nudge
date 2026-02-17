
-- Step 1: Add video_url column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS video_url text;
