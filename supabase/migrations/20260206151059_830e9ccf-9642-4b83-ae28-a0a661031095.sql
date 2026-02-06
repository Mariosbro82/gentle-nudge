
-- Enums
CREATE TYPE plan_type AS ENUM ('starter', 'pro', 'enterprise');
CREATE TYPE chip_mode AS ENUM ('corporate', 'hospitality', 'campaign');
CREATE TYPE sentiment_type AS ENUM ('hot', 'warm', 'cold');

-- Companies
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan plan_type DEFAULT 'starter',
  crm_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (profiles)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  slug TEXT UNIQUE,
  job_title TEXT,
  bio TEXT,
  profile_pic TEXT,
  phone TEXT,
  website TEXT,
  linkedin_url TEXT,
  company_name TEXT,
  vcard_data JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  ghost_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chips
CREATE TABLE public.chips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  active_mode chip_mode DEFAULT 'corporate',
  target_url TEXT,
  menu_data JSONB,
  review_data JSONB,
  vcard_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_scan TIMESTAMPTZ
);

-- Scans
CREATE TABLE public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chip_id UUID REFERENCES public.chips(id) ON DELETE SET NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  device_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  location_data JSONB,
  mode_at_scan chip_mode
);

-- Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chip_id UUID REFERENCES public.chips(id) ON DELETE SET NULL,
  captured_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  sentiment sentiment_type DEFAULT 'warm',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  follow_up_sent BOOLEAN DEFAULT FALSE
);

-- Campaign Overrides
CREATE TABLE public.campaign_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
);

-- User auto-creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function for RLS
CREATE OR REPLACE FUNCTION public.get_user_id_from_auth()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_overrides ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can read own company" ON public.companies FOR SELECT
  USING (id IN (SELECT company_id FROM public.users WHERE auth_user_id = auth.uid()));

-- Users policies
CREATE POLICY "Public profiles readable" ON public.users FOR SELECT
  USING (ghost_mode = FALSE OR auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE
  USING (auth_user_id = auth.uid());

-- Chips policies
CREATE POLICY "Users can read own chips" ON public.chips FOR SELECT
  USING (
    assigned_user_id = public.get_user_id_from_auth()
    OR company_id IN (SELECT company_id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Authenticated can insert chips" ON public.chips FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own chips" ON public.chips FOR UPDATE
  USING (
    assigned_user_id = public.get_user_id_from_auth()
    OR company_id IN (SELECT company_id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can delete own chips" ON public.chips FOR DELETE
  USING (
    assigned_user_id = public.get_user_id_from_auth()
    OR company_id IN (SELECT company_id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- Scans policies
CREATE POLICY "Anyone can insert scans" ON public.scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own scans" ON public.scans FOR SELECT
  USING (
    chip_id IN (
      SELECT id FROM public.chips
      WHERE assigned_user_id = public.get_user_id_from_auth()
         OR company_id IN (SELECT company_id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

-- Leads policies
CREATE POLICY "Users can read own leads" ON public.leads FOR SELECT
  USING (captured_by_user_id = public.get_user_id_from_auth());

CREATE POLICY "Authenticated can insert leads" ON public.leads FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own leads" ON public.leads FOR UPDATE
  USING (captured_by_user_id = public.get_user_id_from_auth());

CREATE POLICY "Users can delete own leads" ON public.leads FOR DELETE
  USING (captured_by_user_id = public.get_user_id_from_auth());

-- Campaign overrides policies
CREATE POLICY "Users can read company overrides" ON public.campaign_overrides FOR SELECT
  USING (
    company_id IN (SELECT company_id FROM public.users WHERE auth_user_id = auth.uid())
  );
