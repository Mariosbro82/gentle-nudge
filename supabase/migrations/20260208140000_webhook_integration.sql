-- ============================================================
-- Migration: Webhook Integration (Zapier/Make Anbindung)
-- ============================================================

-- 1. webhook_url Spalte auf users Tabelle
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS webhook_url TEXT;

-- 2. pg_net Extension aktivieren (async HTTP aus der DB)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 3. Webhook-Log Tabelle
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  lead_id UUID REFERENCES public.leads(id),
  status_code INT,
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own webhook logs"
  ON public.webhook_logs FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- 4. Trigger-Funktion: Lead-Daten an Webhook senden
CREATE OR REPLACE FUNCTION public.notify_webhook_on_lead()
RETURNS TRIGGER AS $$
DECLARE
  _webhook_url TEXT;
  _user_name TEXT;
  _payload JSONB;
BEGIN
  -- Webhook-URL des Users nachschlagen
  SELECT webhook_url, name INTO _webhook_url, _user_name
  FROM public.users
  WHERE id = NEW.captured_by_user_id;

  -- Nur senden wenn URL konfiguriert
  IF _webhook_url IS NOT NULL AND _webhook_url != '' THEN
    _payload := jsonb_build_object(
      'event', 'new_lead',
      'timestamp', NOW(),
      'lead', jsonb_build_object(
        'name', NEW.lead_name,
        'email', NEW.lead_email,
        'phone', NEW.lead_phone,
        'sentiment', NEW.sentiment,
        'notes', NEW.notes,
        'created_at', NEW.created_at
      ),
      'captured_by', _user_name
    );

    -- Async HTTP POST via pg_net
    PERFORM net.http_post(
      url := _webhook_url,
      body := _payload::TEXT,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'User-Agent', 'NFC-Wear-Webhook/1.0'
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger registrieren
DROP TRIGGER IF EXISTS on_lead_created_webhook ON public.leads;
CREATE TRIGGER on_lead_created_webhook
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_webhook_on_lead();
