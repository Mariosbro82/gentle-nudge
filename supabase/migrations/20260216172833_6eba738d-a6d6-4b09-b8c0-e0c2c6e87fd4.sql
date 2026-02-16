
-- 1. Fix chips table: Remove overly permissive "Public chips readable" policy
-- The scan edge function uses service role key and doesn't need this policy
DROP POLICY IF EXISTS "Public chips readable" ON public.chips;

-- 2. Fix public_profiles view: Add security_invoker to satisfy linter
-- First add a limited public SELECT policy on users for the view to work
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = on) AS
SELECT 
  id, name, slug, job_title, bio, profile_pic, banner_pic,
  company_name, social_links, active_template, ghost_mode, 
  ghost_mode_until, website, linkedin_url, view_count,
  email, phone
FROM public.users
WHERE ghost_mode = false;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Add a limited public SELECT policy so the security_invoker view works for anon users
-- This only allows reading non-ghost profiles (same filter as the view)
CREATE POLICY "Public can read non-ghost profiles"
  ON public.users FOR SELECT
  TO anon
  USING (ghost_mode = false);

-- 3. Ensure onboarding_data has RLS enabled (idempotent)
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist (create if not exists pattern)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'onboarding_data' AND policyname = 'Users can read own onboarding data'
  ) THEN
    CREATE POLICY "Users can read own onboarding data"
      ON public.onboarding_data FOR SELECT
      TO authenticated
      USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'onboarding_data' AND policyname = 'Users can insert own onboarding data'
  ) THEN
    CREATE POLICY "Users can insert own onboarding data"
      ON public.onboarding_data FOR INSERT
      TO authenticated
      WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
  END IF;
END $$;
