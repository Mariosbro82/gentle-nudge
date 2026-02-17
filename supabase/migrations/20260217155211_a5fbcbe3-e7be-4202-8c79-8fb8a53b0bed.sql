-- Add marketing consent column for DSGVO compliance
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false;