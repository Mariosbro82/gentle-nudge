-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE plan_type AS ENUM ('starter', 'pro', 'enterprise');
CREATE TYPE chip_mode AS ENUM ('corporate', 'hospitality', 'campaign');
CREATE TYPE sentiment_type AS ENUM ('hot', 'warm', 'cold');

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan plan_type DEFAULT 'starter',
  crm_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  auth_user_id UUID UNIQUE, -- Link to Supabase Auth
  email TEXT NOT NULL,
  name TEXT,
  slug TEXT UNIQUE,
  job_title TEXT,
  bio TEXT,
  profile_pic TEXT,
  banner_pic TEXT,
  phone TEXT,
  website TEXT,
  linkedin_url TEXT,
  company_name TEXT,
  vcard_data JSONB DEFAULT '{}'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  ghost_mode BOOLEAN DEFAULT FALSE,
  ghost_mode_until TIMESTAMPTZ,
  webhook_url TEXT,
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user',
  active_template TEXT DEFAULT 'premium-gradient',
  view_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chips Table
CREATE TABLE IF NOT EXISTS chips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  active_mode chip_mode DEFAULT 'corporate',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_scan TIMESTAMPTZ
);

-- Scans Table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chip_id UUID REFERENCES chips(id) ON DELETE SET NULL,
  scan_time TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  location JSONB,
  mode_at_scan chip_mode
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chip_id UUID REFERENCES chips(id) ON DELETE SET NULL,
  captured_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  sentiment sentiment_type DEFAULT 'warm',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  follow_up_sent BOOLEAN DEFAULT FALSE
);

-- Campaign Overrides Table
CREATE TABLE IF NOT EXISTS campaign_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
);
