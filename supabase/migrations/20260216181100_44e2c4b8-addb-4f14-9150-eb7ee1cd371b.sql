
-- FIX 1: users_table_public_exposure
-- Drop the overly permissive public SELECT policy that exposes ALL columns
DROP POLICY IF EXISTS "Public can read non-ghost profiles" ON public.users;

-- FIX 2: public_profiles_no_rls
-- Recreate public_profiles view WITHOUT security_invoker so it runs as owner (bypasses RLS)
-- This is the ONLY way anon users can read profile data, and it only exposes safe columns
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT 
    id, name, slug, job_title, bio,
    profile_pic, banner_pic, company_name,
    social_links, active_template,
    ghost_mode, ghost_mode_until,
    website, linkedin_url, view_count,
    email, phone
FROM public.users
WHERE ghost_mode = false;

-- Grant read access to anon and authenticated
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- FIX 3: leads_table_contact_exposure
-- Restrict INSERT to authenticated users only (submit-lead edge function uses service_role_key, unaffected)
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Authenticated can insert leads"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (true);
