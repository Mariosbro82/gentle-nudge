
-- Add banner_color field to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS banner_color text DEFAULT '#4f46e5';

-- Recreate public_profiles view to include banner_color
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id, name, slug, job_title, bio, profile_pic, banner_pic, company_name,
  social_links, active_template, ghost_mode, ghost_mode_until, website,
  linkedin_url, view_count, email, phone, background_image, background_color,
  banner_color
FROM public.users;
