
-- Helper: Get the organization_id for the current authenticated user
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT om.organization_id 
  FROM public.organization_members om
  JOIN public.users u ON u.id = om.user_id
  WHERE u.auth_user_id = auth.uid()
  LIMIT 1
$$;

-- Helper: Check if the current user is an admin/owner of their organization
CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organization_members om
    JOIN public.users u ON u.id = om.user_id
    WHERE u.auth_user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
  )
$$;

-- Helper: Get all user IDs in the same organization as the current user (for org admins only)
CREATE OR REPLACE FUNCTION public.get_org_member_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT om2.user_id
  FROM public.organization_members om1
  JOIN public.users u ON u.id = om1.user_id
  JOIN public.organization_members om2 ON om2.organization_id = om1.organization_id
  WHERE u.auth_user_id = auth.uid()
    AND om1.role IN ('owner', 'admin')
$$;

-- ============================================
-- RLS: users table - Org admins can read team
-- ============================================
CREATE POLICY "Org admins can read team profiles"
ON public.users FOR SELECT
USING (id IN (SELECT get_org_member_ids()));

CREATE POLICY "Org admins can update team profiles"
ON public.users FOR UPDATE
USING (id IN (SELECT get_org_member_ids()));

-- ============================================
-- RLS: chips table - Org admins can manage team chips
-- ============================================
CREATE POLICY "Org admins can read team chips"
ON public.chips FOR SELECT
USING (assigned_user_id IN (SELECT get_org_member_ids()));

CREATE POLICY "Org admins can update team chips"
ON public.chips FOR UPDATE
USING (assigned_user_id IN (SELECT get_org_member_ids()));

-- ============================================
-- RLS: leads table - Org admins can read team leads
-- ============================================
CREATE POLICY "Org admins can read team leads"
ON public.leads FOR SELECT
USING (captured_by_user_id IN (SELECT get_org_member_ids()));

-- ============================================
-- RLS: profile_views - Org admins can read team views
-- ============================================
CREATE POLICY "Org admins can read team views"
ON public.profile_views FOR SELECT
USING (user_id IN (SELECT get_org_member_ids()));

-- ============================================
-- RLS: organizations - Allow admins to insert
-- ============================================
CREATE POLICY "Super admins can insert organizations"
ON public.organizations FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Super admins can delete organizations"
ON public.organizations FOR DELETE
USING (is_admin());

CREATE POLICY "Super admins can read all organizations"
ON public.organizations FOR SELECT
USING (is_admin());

CREATE POLICY "Super admins can update all organizations"
ON public.organizations FOR UPDATE
USING (is_admin());

-- ============================================
-- RLS: organization_members - Allow super admins full access
-- ============================================
CREATE POLICY "Super admins can insert org members"
ON public.organization_members FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Super admins can read all org members"
ON public.organization_members FOR SELECT
USING (is_admin());

CREATE POLICY "Super admins can update all org members"
ON public.organization_members FOR UPDATE
USING (is_admin());

CREATE POLICY "Super admins can delete all org members"
ON public.organization_members FOR DELETE
USING (is_admin());
