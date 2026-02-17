
-- Add image position columns for focal point adjustment
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS profile_pic_position text DEFAULT '50% 50%',
  ADD COLUMN IF NOT EXISTS banner_pic_position text DEFAULT '50% 50%',
  ADD COLUMN IF NOT EXISTS background_position text DEFAULT '50% 50%';

-- Update public_profiles view to include new columns
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles WITH (security_invoker = false) AS
SELECT 
  id, name, slug, job_title, bio, profile_pic, banner_pic,
  company_name, active_template, website, linkedin_url,
  email, phone, social_links, view_count, ghost_mode, ghost_mode_until,
  background_image, background_color, banner_color,
  accent_color, custom_links, coupon_code, coupon_description,
  countdown_target, countdown_label,
  profile_pic_position, banner_pic_position, background_position
FROM public.users;
