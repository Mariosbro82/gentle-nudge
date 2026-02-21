
-- Add live status columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS live_status_text TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS live_status_color TEXT DEFAULT NULL;

-- Recreate public_profiles view to include new columns + live status
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id, name, slug, job_title, bio, profile_pic, banner_pic, company_name,
  social_links, active_template, ghost_mode, ghost_mode_until, website,
  linkedin_url, view_count, email, phone, background_image, background_color,
  banner_color, accent_color, custom_links, coupon_code, coupon_description,
  countdown_target, countdown_label, profile_pic_position, banner_pic_position,
  background_position, video_url, live_status_text, live_status_color
FROM public.users;
