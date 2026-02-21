
-- Create support tickets table
CREATE TABLE public.support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'open',
    priority text NOT NULL DEFAULT 'normal',
    admin_reply text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    closed_at timestamptz
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can create their own tickets
CREATE POLICY "Users can create own tickets"
ON public.support_tickets FOR INSERT
WITH CHECK (user_id = get_user_id_from_auth());

-- Users can read their own tickets
CREATE POLICY "Users can read own tickets"
ON public.support_tickets FOR SELECT
USING (user_id = get_user_id_from_auth());

-- Admins can read all tickets
CREATE POLICY "Admins can read all tickets"
ON public.support_tickets FOR SELECT
USING (is_admin());

-- Admins can update all tickets
CREATE POLICY "Admins can update all tickets"
ON public.support_tickets FOR UPDATE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
