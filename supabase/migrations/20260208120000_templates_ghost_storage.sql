-- ============================================================
-- Migration: Profile Templates, Image Storage & Ghost Mode
-- ============================================================

-- 1. Add new columns to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS banner_pic TEXT,
  ADD COLUMN IF NOT EXISTS active_template TEXT DEFAULT 'premium-gradient',
  ADD COLUMN IF NOT EXISTS ghost_mode_until TIMESTAMPTZ;

-- 2. Profile templates table
CREATE TABLE IF NOT EXISTS public.profile_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed predefined templates
INSERT INTO public.profile_templates (id, name, description, config, sort_order) VALUES
  ('premium-gradient', 'Premium Gradient', 'Glassmorphism mit Gradient-Banner', '{"gradient":"from-blue-600 to-purple-600","card_style":"glassmorphism"}', 1),
  ('minimalist-card', 'Minimalist Card', 'Klares, Apple-inspiriertes Design', '{"bg":"white","card_style":"flat"}', 2),
  ('event-badge', 'Event Badge', 'Messe-optimiert mit Event-Info', '{"show_countdown":true,"show_discount":true}', 3)
ON CONFLICT (id) DO NOTHING;

-- RLS: templates readable by everyone
ALTER TABLE public.profile_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are publicly readable" ON public.profile_templates FOR SELECT USING (true);

-- 3. Update users RLS: always allow SELECT (ghost mode handled in app layer)
DROP POLICY IF EXISTS "Public profiles readable" ON public.users;
CREATE POLICY "Public profiles readable" ON public.users FOR SELECT USING (true);

-- 4. Storage bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own profile images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own profile images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own profile images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public can read profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');
