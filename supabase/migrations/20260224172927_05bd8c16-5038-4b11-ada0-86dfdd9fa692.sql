-- Allow users to delete their own profile (DSGVO right to erasure)
CREATE POLICY "Users can delete own profile"
ON public.users
FOR DELETE
USING (auth_user_id = auth.uid());

-- Allow users to delete their own profile views
CREATE POLICY "Users can delete own profile views"
ON public.profile_views
FOR DELETE
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Allow users to delete own support tickets
CREATE POLICY "Users can delete own tickets"
ON public.support_tickets
FOR DELETE
USING (user_id = get_user_id_from_auth());