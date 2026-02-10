-- Create a function to check if a slug is available
-- This is needed because RLS might hide users (ghost mode), but we still need to know if the slug is taken.
CREATE OR REPLACE FUNCTION public.check_slug_availability(slug_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres/admin) to bypass RLS
SET search_path = public
AS $$
BEGIN
  -- Check if any user already has this slug
  -- We use count(*) > 0 to return true if taken, false if available
  -- BUT we want "is available", so return NOT exists
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE slug = slug_to_check
  );
END;
$$;

-- Allow public access (or authenticated) to this function
GRANT EXECUTE ON FUNCTION public.check_slug_availability(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_slug_availability(text) TO anon;
