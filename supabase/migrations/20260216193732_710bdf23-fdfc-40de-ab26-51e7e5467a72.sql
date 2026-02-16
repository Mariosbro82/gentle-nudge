
-- Add background fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS background_image text,
ADD COLUMN IF NOT EXISTS background_color text DEFAULT '#0a0a0a';

-- Recreate public_profiles view to include new fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  name,
  slug,
  job_title,
  bio,
  profile_pic,
  banner_pic,
  company_name,
  social_links,
  active_template,
  ghost_mode,
  ghost_mode_until,
  website,
  linkedin_url,
  view_count,
  email,
  phone,
  background_image,
  background_color
FROM public.users;
