
-- Fix overly permissive INSERT policies

-- 1. chips: Restrict INSERT to authenticated users, scope to their company or unassigned
DROP POLICY IF EXISTS "Authenticated can insert chips" ON public.chips;
CREATE POLICY "Authenticated users can insert chips"
  ON public.chips FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      assigned_user_id IS NULL 
      OR assigned_user_id = get_user_id_from_auth()
    )
    AND (
      company_id IS NULL
      OR company_id IN (SELECT users.company_id FROM public.users WHERE users.auth_user_id = auth.uid())
      OR is_admin()
    )
  );

-- 2. scans: These are inserted by edge functions with service_role key.
-- The WITH CHECK(true) is needed because anon/service role inserts scans.
-- We tighten it to require a valid chip_id reference.
DROP POLICY IF EXISTS "Anyone can insert scans" ON public.scans;
CREATE POLICY "Anyone can insert scans with valid chip"
  ON public.scans FOR INSERT
  WITH CHECK (
    chip_id IS NOT NULL 
    AND chip_id IN (SELECT id FROM public.chips)
  );

-- 3. leads: Inserted by edge functions (submit-lead) with service_role.
-- Tighten to require valid captured_by_user_id reference.
DROP POLICY IF EXISTS "Authenticated can insert leads" ON public.leads;
CREATE POLICY "Service can insert leads with valid user"
  ON public.leads FOR INSERT
  WITH CHECK (
    captured_by_user_id IS NULL
    OR captured_by_user_id IN (SELECT id FROM public.users)
  );

-- 4. profile_views: Inserted by edge functions with service_role.
-- Tighten to require valid user_id reference.
DROP POLICY IF EXISTS "Service role can insert views" ON public.profile_views;
CREATE POLICY "Service can insert views with valid user"
  ON public.profile_views FOR INSERT
  WITH CHECK (
    user_id IS NOT NULL
    AND user_id IN (SELECT id FROM public.users)
  );
