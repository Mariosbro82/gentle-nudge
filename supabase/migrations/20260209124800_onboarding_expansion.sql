-- Migration: Add onboarding expansion fields

-- Add template selection to users table (if not exists)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS active_template TEXT DEFAULT 'minimalist';

-- Add automation fields to onboarding_data table
ALTER TABLE onboarding_data
ADD COLUMN IF NOT EXISTS selected_template TEXT,
ADD COLUMN IF NOT EXISTS automation_interest BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS automation_delay_hours INTEGER;

-- Update existing records to have default template
UPDATE users
SET active_template = 'minimalist'
WHERE active_template IS NULL;
