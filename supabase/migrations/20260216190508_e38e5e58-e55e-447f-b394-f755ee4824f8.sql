
-- Drop the recursive policies on organizations
DROP POLICY IF EXISTS "Members can view their organization" ON public.organizations;
DROP POLICY IF EXISTS "Owners and admins can update their organization" ON public.organizations;

-- Drop the recursive policies on organization_members
DROP POLICY IF EXISTS "Members can view org members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can insert org members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can update org members" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can delete org members" ON public.organization_members;

-- Create a SECURITY DEFINER helper to get the user's org IDs without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_organization_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT om.organization_id
  FROM organization_members om
  JOIN users u ON u.id = om.user_id
  WHERE u.auth_user_id = auth.uid();
$$;

-- Create a SECURITY DEFINER helper to check if user is org admin/owner
CREATE OR REPLACE FUNCTION public.is_org_admin_of(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_members om
    JOIN users u ON u.id = om.user_id
    WHERE u.auth_user_id = auth.uid()
      AND om.organization_id = org_id
      AND om.role IN ('owner', 'admin')
  );
$$;

-- Re-create organizations policies using the helper functions
CREATE POLICY "Members can view their organization"
ON public.organizations FOR SELECT
USING (id IN (SELECT get_user_organization_ids()) OR is_admin());

CREATE POLICY "Owners and admins can update their organization"
ON public.organizations FOR UPDATE
USING (is_org_admin_of(id) OR is_admin());

-- Re-create organization_members policies using helper functions
CREATE POLICY "Members can view org members"
ON public.organization_members FOR SELECT
USING (organization_id IN (SELECT get_user_organization_ids()) OR is_admin());

CREATE POLICY "Admins can insert org members"
ON public.organization_members FOR INSERT
WITH CHECK (is_org_admin_of(organization_id) OR is_admin());

CREATE POLICY "Admins can update org members"
ON public.organization_members FOR UPDATE
USING (is_org_admin_of(organization_id) OR is_admin());

CREATE POLICY "Admins can delete org members"
ON public.organization_members FOR DELETE
USING (is_org_admin_of(organization_id) OR is_admin());
