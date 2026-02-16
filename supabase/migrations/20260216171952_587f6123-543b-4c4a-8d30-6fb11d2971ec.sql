
-- 1. Create app_role enum and user_roles table for proper role management
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can read all roles; users can read their own
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE from client - managed server-side only

-- 2. Create has_role helper function (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 3. Migrate existing admin roles from users table to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT auth_user_id, 'admin'::app_role
FROM public.users
WHERE role = 'admin' AND auth_user_id IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Update is_admin() to use user_roles table instead of users.role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 5. Add webhook URL validation trigger to prevent SSRF
CREATE OR REPLACE FUNCTION public.validate_webhook_url()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.webhook_url IS NOT NULL AND NEW.webhook_url <> '' THEN
    -- Must use HTTPS
    IF NEW.webhook_url !~ '^https://' THEN
      RAISE EXCEPTION 'Webhook URL must use HTTPS protocol';
    END IF;
    -- Block private/internal addresses
    IF NEW.webhook_url ~* '(localhost|127\.0\.0\.1|169\.254\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|0\.0\.0\.0|::1)' THEN
      RAISE EXCEPTION 'Webhook URL cannot target private/internal addresses';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_webhook_url_before_change
  BEFORE INSERT OR UPDATE OF webhook_url ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.validate_webhook_url();

-- 6. Restrict public profile SELECT to non-sensitive columns using a view
-- Create a public-safe view that excludes sensitive fields
CREATE VIEW public.public_profiles
WITH (security_invoker = on) AS
SELECT 
  id, name, slug, job_title, bio, profile_pic, banner_pic,
  company_name, social_links, active_template, ghost_mode, 
  ghost_mode_until, website, linkedin_url, view_count
FROM public.users
WHERE ghost_mode = false;

-- Grant access to the view for anon and authenticated
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Tighten the "Public profiles readable" policy - only own profile or admin
DROP POLICY IF EXISTS "Public profiles readable" ON public.users;
CREATE POLICY "Users can read own full profile"
  ON public.users FOR SELECT
  USING (auth_user_id = auth.uid());
