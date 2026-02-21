
-- Add welcome screen columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS custom_greeting text DEFAULT 'Willkommen auf meinem Profil 👋',
ADD COLUMN IF NOT EXISTS avatar_style text DEFAULT 'image',
ADD COLUMN IF NOT EXISTS avatar_emoji text DEFAULT '👋';
