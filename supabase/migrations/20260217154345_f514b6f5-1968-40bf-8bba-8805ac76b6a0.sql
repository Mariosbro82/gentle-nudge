
-- Drop and recreate public_profiles view with video_url
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles WITH (security_invoker = true) AS
SELECT 
    id, name, slug, job_title, bio, profile_pic, banner_pic,
    company_name, social_links, active_template, ghost_mode, ghost_mode_until,
    website, linkedin_url, view_count, email, phone,
    background_image, background_color, banner_color, accent_color,
    custom_links, coupon_code, coupon_description, countdown_target, countdown_label,
    profile_pic_position, banner_pic_position, background_position, video_url
FROM public.users;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Create user_files table
CREATE TABLE public.user_files (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    file_size bigint,
    download_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own files" ON public.user_files FOR SELECT USING (user_id = get_user_id_from_auth());
CREATE POLICY "Users can insert own files" ON public.user_files FOR INSERT WITH CHECK (user_id = get_user_id_from_auth());
CREATE POLICY "Users can update own files" ON public.user_files FOR UPDATE USING (user_id = get_user_id_from_auth());
CREATE POLICY "Users can delete own files" ON public.user_files FOR DELETE USING (user_id = get_user_id_from_auth());
CREATE POLICY "Anyone can read user files" ON public.user_files FOR SELECT USING (true);

-- Create public-files storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('public-files', 'public-files', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Auth upload public files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public-files' AND auth.role() = 'authenticated');
CREATE POLICY "Public view public files" ON storage.objects FOR SELECT USING (bucket_id = 'public-files');
CREATE POLICY "Owner delete public files" ON storage.objects FOR DELETE USING (bucket_id = 'public-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner update public files" ON storage.objects FOR UPDATE USING (bucket_id = 'public-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create file_clicks tracking table
CREATE TABLE public.file_clicks (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id uuid NOT NULL REFERENCES public.user_files(id) ON DELETE CASCADE,
    clicked_at timestamp with time zone DEFAULT now(),
    ip_address text,
    user_agent text
);

ALTER TABLE public.file_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert file clicks" ON public.file_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "File owners can read clicks" ON public.file_clicks FOR SELECT USING (
    file_id IN (SELECT id FROM public.user_files WHERE user_id = get_user_id_from_auth())
);
