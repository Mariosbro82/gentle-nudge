
-- 0. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. Organizations table
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    logo_url TEXT,
    plan public.plan_type DEFAULT 'starter',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- 2. Org role enum & members table
CREATE TYPE public.org_role AS ENUM ('owner', 'admin', 'member', 'viewer');

CREATE TABLE public.organization_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role public.org_role NOT NULL DEFAULT 'member',
    invited_by UUID REFERENCES public.users(id),
    invited_at TIMESTAMPTZ DEFAULT now(),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(organization_id, user_id)
);
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- 3. Webhooks table
CREATE TABLE public.webhooks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Webhook',
    url TEXT NOT NULL,
    secret TEXT,
    event_types TEXT[] NOT NULL DEFAULT ARRAY['scan.created', 'lead.created'],
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- 4. Triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. RLS: Organizations
CREATE POLICY "Members can view their organization" ON public.organizations FOR SELECT
    USING (id IN (SELECT organization_id FROM public.organization_members WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())));

CREATE POLICY "Owners and admins can update their organization" ON public.organizations FOR UPDATE
    USING (id IN (SELECT organization_id FROM public.organization_members WHERE user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) AND role IN ('owner', 'admin')));

-- 6. RLS: Organization members
CREATE POLICY "Members can view org members" ON public.organization_members FOR SELECT
    USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())));

CREATE POLICY "Admins can insert org members" ON public.organization_members FOR INSERT
    WITH CHECK (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) AND om.role IN ('owner', 'admin')));

CREATE POLICY "Admins can update org members" ON public.organization_members FOR UPDATE
    USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) AND om.role IN ('owner', 'admin')));

CREATE POLICY "Admins can delete org members" ON public.organization_members FOR DELETE
    USING (organization_id IN (SELECT om.organization_id FROM public.organization_members om WHERE om.user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) AND om.role IN ('owner', 'admin')));

-- 7. RLS: Webhooks
CREATE POLICY "Users can view their webhooks" ON public.webhooks FOR SELECT
    USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create webhooks" ON public.webhooks FOR INSERT
    WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their webhooks" ON public.webhooks FOR UPDATE
    USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their webhooks" ON public.webhooks FOR DELETE
    USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
