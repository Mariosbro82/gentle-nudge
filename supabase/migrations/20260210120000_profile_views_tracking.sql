-- Create profile_views table
CREATE TABLE IF NOT EXISTS public.profile_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    device_type TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    is_unique BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_views_user_id_viewed_at ON public.profile_views(user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_lookup ON public.profile_views(ip_address, user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_recurring ON public.profile_views(user_id) WHERE is_recurring = TRUE;

-- Enable RLS
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone (anon) to insert views
CREATE POLICY "Anyone can insert profile views"
ON public.profile_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow users to view their own profile stats
CREATE POLICY "Users can view own profile stats"
ON public.profile_views
FOR SELECT
TO authenticated
USING (
    user_id IN (
        SELECT id FROM public.users WHERE auth_user_id = auth.uid()
    )
);

-- Add ip_address to leads table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'ip_address') THEN
        ALTER TABLE public.leads ADD COLUMN ip_address TEXT;
    END IF;
END $$;

-- DB Function: log_profile_view
CREATE OR REPLACE FUNCTION public.log_profile_view(
    p_user_id UUID,
    p_ip_address TEXT,
    p_device_type TEXT,
    p_user_agent TEXT,
    p_referrer TEXT,
    p_country TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_last_view_at TIMESTAMPTZ;
    v_is_unique BOOLEAN := false;
    v_is_recurring BOOLEAN := false;
    v_result JSONB;
BEGIN
    -- Check for previous views from this IP for this user
    SELECT viewed_at INTO v_last_view_at
    FROM public.profile_views
    WHERE user_id = p_user_id AND ip_address = p_ip_address
    ORDER BY viewed_at DESC
    LIMIT 1;

    -- Logic for uniqueness and recurrence
    IF v_last_view_at IS NOT NULL THEN
        -- If seen within last 12 hours, consider it a duplicate (debounce)
        IF v_last_view_at > (now() - INTERVAL '12 hours') THEN
            RETURN jsonb_build_object(
                'inserted', false,
                'reason', 'duplicate'
            );
        ELSE
            -- Seen before, but older than 12h -> Recurring visitor
            v_is_recurring := true;
            v_is_unique := false;
        END IF;
    ELSE
        -- Never seen this IP for this user -> Unique visitor
        v_is_unique := true;
    END IF;

    -- Insert the view
    INSERT INTO public.profile_views (
        user_id, ip_address, device_type, user_agent, referrer, country, is_unique, is_recurring
    ) VALUES (
        p_user_id, p_ip_address, p_device_type, p_user_agent, p_referrer, p_country, v_is_unique, v_is_recurring
    );

    RETURN jsonb_build_object(
        'inserted', true,
        'is_unique', v_is_unique,
        'is_recurring', v_is_recurring
    );
END;
$$;

-- DB Function: get_interested_leads
CREATE OR REPLACE FUNCTION public.get_interested_leads(p_user_id UUID)
RETURNS TABLE (
    lead_id UUID,
    lead_name TEXT,
    recurring_views BIGINT,
    last_viewed_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        l.id as lead_id,
        l.lead_name,
        COUNT(pv.id) as recurring_views,
        MAX(pv.viewed_at) as last_viewed_at
    FROM public.leads l
    JOIN public.profile_views pv ON l.ip_address = pv.ip_address
    WHERE l.captured_by_user_id = p_user_id
      AND pv.user_id = p_user_id
      AND pv.is_recurring = TRUE
    GROUP BY l.id, l.lead_name
    HAVING COUNT(pv.id) > 0
    ORDER BY recurring_views DESC;
$$;
