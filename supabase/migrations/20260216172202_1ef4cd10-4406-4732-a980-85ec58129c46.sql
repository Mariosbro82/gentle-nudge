
-- Fix: The public_profiles view needs to work for anonymous users.
-- Drop and recreate without security_invoker so anon can query it.
-- The view itself provides column-level security by only exposing safe fields.

DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
SELECT 
  id, name, slug, job_title, bio, profile_pic, banner_pic,
  company_name, social_links, active_template, ghost_mode, 
  ghost_mode_until, website, linkedin_url, view_count,
  email, phone
FROM public.users
WHERE ghost_mode = false;

-- Grant access to anon and authenticated
GRANT SELECT ON public.public_profiles TO anon, authenticated;
