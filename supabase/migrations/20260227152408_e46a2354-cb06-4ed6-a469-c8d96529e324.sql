-- Fix file_clicks INSERT policy to validate file existence
DROP POLICY IF EXISTS "Anyone can insert file clicks" ON public.file_clicks;

CREATE POLICY "Anyone can track valid file clicks" 
ON public.file_clicks FOR INSERT 
WITH CHECK (
    file_id IN (SELECT id FROM public.user_files)
);

-- Add DELETE policy for file owners
CREATE POLICY "File owners can delete clicks"
ON public.file_clicks FOR DELETE
USING (file_id IN (SELECT id FROM public.user_files WHERE user_id = get_user_id_from_auth()));

-- Fix SECURITY DEFINER functions missing search_path
ALTER FUNCTION public.test_webhook(text) SET search_path = 'public';
ALTER FUNCTION public.trigger_lead_webhook() SET search_path = 'public';
ALTER FUNCTION public.get_interested_leads(uuid) SET search_path = 'public';
ALTER FUNCTION public.log_profile_view(uuid, text, text, text, text, text) SET search_path = 'public';
ALTER FUNCTION public.is_admin() SET search_path = 'public';