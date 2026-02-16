
-- 1. Follow-up E-Mails Tabelle (voll personalisierbar pro Lead)
CREATE TABLE public.follow_up_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  delay_hours INTEGER NOT NULL DEFAULT 24,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.follow_up_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own follow ups"
  ON public.follow_up_emails FOR SELECT
  TO authenticated
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own follow ups"
  ON public.follow_up_emails FOR INSERT
  TO authenticated
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own follow ups"
  ON public.follow_up_emails FOR UPDATE
  TO authenticated
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own follow ups"
  ON public.follow_up_emails FOR DELETE
  TO authenticated
  USING (user_id = get_user_id_from_auth());

-- Index für Cron-Job: pending E-Mails effizient finden
CREATE INDEX idx_follow_up_pending 
  ON public.follow_up_emails (status, scheduled_at) 
  WHERE status = 'pending';

-- 2. User-Defaults für Follow-Up E-Mails + Reply-To Konfiguration
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS default_followup_subject TEXT,
  ADD COLUMN IF NOT EXISTS default_followup_body_html TEXT,
  ADD COLUMN IF NOT EXISTS default_followup_delay_hours INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS reply_to_email TEXT,
  ADD COLUMN IF NOT EXISTS reply_to_name TEXT;
