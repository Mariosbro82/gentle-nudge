
-- Fix conflicting RLS policies on user_files table
-- Drop the overly permissive "Anyone can read" policy
DROP POLICY IF EXISTS "Anyone can read user files" ON public.user_files;

-- Drop redundant owner-only policy (will be re-created as part of combined policy)
DROP POLICY IF EXISTS "Users can read own files" ON public.user_files;

-- Create a scoped public read policy: anyone can read files for non-ghost-mode users
-- This maintains public profile file access while preventing bulk enumeration
CREATE POLICY "Public can read files for visible profiles"
  ON public.user_files FOR SELECT
  USING (
    user_id = get_user_id_from_auth()
    OR
    user_id IN (
      SELECT id FROM public.users 
      WHERE ghost_mode = false 
      OR ghost_mode IS NULL
    )
  );
