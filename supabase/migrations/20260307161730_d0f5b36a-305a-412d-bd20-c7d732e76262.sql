-- Recreate the public_profiles view WITHOUT security_invoker so anonymous users can read public profiles
-- The view already excludes sensitive fields (email, phone, webhook_url, etc.)
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
SELECT 
    id,
    name,
    slug,
    job_title,
    bio,
    profile_pic,
    profile_pic_position,
    banner_pic,
    banner_pic_position,
    company_name,
    website,
    linkedin_url,
    active_template,
    accent_color,
    background_color,
    background_image,
    background_position,
    banner_color,
    social_links,
    custom_links,
    view_count,
    ghost_mode,
    ghost_mode_until,
    hide_branding,
    avatar_emoji,
    avatar_style,
    custom_greeting,
    video_url,
    live_status_text,
    live_status_color,
    countdown_target,
    countdown_label,
    coupon_code,
    coupon_description
FROM public.users;