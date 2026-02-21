-- Recreate public_profiles view as security definer so anon can read it
DROP VIEW IF EXISTS public_profiles;

CREATE VIEW public_profiles WITH (security_invoker = false) AS
SELECT 
    id, name, slug, job_title, bio, profile_pic, banner_pic,
    company_name, social_links, active_template, ghost_mode, ghost_mode_until,
    website, linkedin_url, view_count,
    background_image, background_color, banner_color, accent_color,
    custom_links, coupon_code, coupon_description,
    countdown_target, countdown_label,
    profile_pic_position, banner_pic_position, background_position,
    video_url, live_status_text, live_status_color,
    custom_greeting, avatar_style, avatar_emoji
FROM users
WHERE (ghost_mode = false OR ghost_mode IS NULL);

-- Grant SELECT to anon and authenticated
GRANT SELECT ON public_profiles TO anon, authenticated;