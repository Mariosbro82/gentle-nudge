
-- Add hide_branding column to users table
ALTER TABLE public.users ADD COLUMN hide_branding boolean DEFAULT false;

-- Update public_profiles view to include hide_branding
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT
    id, name, slug, job_title, bio, profile_pic, banner_pic, company_name,
    social_links, active_template, ghost_mode, ghost_mode_until,
    website, linkedin_url, view_count, custom_links,
    accent_color, background_color, background_image, background_position,
    banner_color, banner_pic_position, profile_pic_position,
    coupon_code, coupon_description, countdown_target, countdown_label,
    live_status_text, live_status_color, video_url, custom_greeting,
    avatar_style, avatar_emoji, hide_branding
FROM public.users;
