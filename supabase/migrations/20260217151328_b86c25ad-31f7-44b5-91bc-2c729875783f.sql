
-- Add new profile feature columns to users table
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#4f46e5',
  ADD COLUMN IF NOT EXISTS custom_links jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS coupon_description text,
  ADD COLUMN IF NOT EXISTS countdown_target timestamptz,
  ADD COLUMN IF NOT EXISTS countdown_label text;

-- Create profile_presets table for quick-switch presets
CREATE TABLE public.profile_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  preset_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profile_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own presets" ON public.profile_presets
  FOR SELECT USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own presets" ON public.profile_presets
  FOR INSERT WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own presets" ON public.profile_presets
  FOR UPDATE USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own presets" ON public.profile_presets
  FOR DELETE USING (user_id = get_user_id_from_auth());

CREATE TRIGGER update_profile_presets_updated_at
  BEFORE UPDATE ON public.profile_presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update public_profiles view to include new columns
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles WITH (security_invoker = false) AS
SELECT 
  id, name, slug, job_title, bio, profile_pic, banner_pic,
  company_name, active_template, website, linkedin_url,
  email, phone, social_links, view_count, ghost_mode, ghost_mode_until,
  background_image, background_color, banner_color,
  accent_color, custom_links, coupon_code, coupon_description,
  countdown_target, countdown_label
FROM public.users;
