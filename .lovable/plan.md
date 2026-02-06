

# NFCwear Backend Rebuild - Complete Supabase Setup

## Overview

Rebuild the entire NFCwear backend on the connected Supabase project (airpomlmvtfcetyvdmsq). The database is currently empty with no tables. The codebase has a build error and leftover Next.js server code that needs cleanup. This plan creates all tables, security policies, triggers, and fixes all frontend code to work correctly.

## What Will Be Done

### 1. Fix Build Error
The `tsconfig.node.json` is missing `"noEmit": false`, causing the TypeScript build to fail. This is a one-line fix.

### 2. Remove Next.js Server Code
Four files use Next.js-specific APIs (`cookies()`, `headers()`, `"use server"`, `revalidatePath`) that do not work in Vite/React:
- `src/lib/supabase/server.ts` -- delete
- `src/lib/actions/analytics.ts` -- delete
- `src/lib/actions/users.ts` -- delete
- `src/lib/actions/leads.ts` -- delete

The client-side equivalents already exist in `src/lib/api/` and will be used instead.

### 3. Fix Duplicate Supabase Client
There are two Supabase client files:
- `src/lib/supabase/client.ts` (uses VITE env vars, has placeholder fallback)
- `src/integrations/supabase/client.ts` (auto-generated, has correct hardcoded values)

The auth context and all pages import from `src/lib/supabase/client.ts`. This file will be updated to re-export from the official `src/integrations/supabase/client.ts` to keep a single source of truth.

### 4. Create Database Schema (Migration)

All six core tables plus enums, created in one migration:

| Table | Purpose |
|-------|---------|
| **companies** | Organizations/clients |
| **users** | User profiles (linked to auth.users via `auth_user_id`) |
| **chips** | NFC chip registry |
| **scans** | Scan event log |
| **leads** | Captured contacts |
| **campaign_overrides** | Campaign redirect rules |

Key design decisions:
- `users.auth_user_id` references `auth.users(id)` with `ON DELETE CASCADE`
- `users.slug` has a unique constraint for vanity URLs
- All IDs use `gen_random_uuid()`
- The `scans` table uses `scanned_at` (not `scan_time`) to match frontend code

### 5. Auto-Create User Profile on Signup

A database trigger (`on_auth_user_created`) will automatically insert a row into `public.users` whenever someone signs up, populating `auth_user_id`, `email`, and `name`.

### 6. Helper Function for Auth Lookup

A `SECURITY DEFINER` function `get_user_id_from_auth()` returns the `public.users.id` for the currently authenticated user. Used in RLS policies to avoid recursive lookups.

### 7. Row Level Security (RLS)

Every table gets RLS enabled with appropriate policies:

| Table | Rules |
|-------|-------|
| **companies** | Authenticated users can read their own company |
| **users** | Anyone can read non-ghost profiles (for public NFC pages); users can update their own profile |
| **chips** | Users can read/manage chips assigned to them or their company |
| **scans** | Anyone can insert (NFC taps are anonymous); users can read scans for their chips |
| **leads** | Users can read/insert/update/delete their own leads |
| **campaign_overrides** | Users can read overrides for their company |

### 8. Fix Frontend Queries (auth_user_id mapping)

All dashboard pages currently query `users` table with `.eq("id", user.id)` where `user.id` is the **auth** user ID. Since the `users` table uses a separate `id` (with `auth_user_id` linking to auth), all dashboard queries need to use `.eq("auth_user_id", user.id)` instead.

Files to update:
- `src/pages/dashboard/index.tsx`
- `src/pages/dashboard/devices.tsx`
- `src/pages/dashboard/leads.tsx`
- `src/pages/dashboard/analytics.tsx`
- `src/pages/dashboard/settings.tsx`

### 9. Clean Up Login Page

Remove the debug info panel at the bottom of the login page that displays environment variables.

### 10. Update Auth Context

Switch the auth context import from `src/lib/supabase/client` to `src/integrations/supabase/client`.

## Technical Details

### Database Migration SQL

```sql
-- Enums
CREATE TYPE plan_type AS ENUM ('starter', 'pro', 'enterprise');
CREATE TYPE chip_mode AS ENUM ('corporate', 'hospitality', 'campaign');
CREATE TYPE sentiment_type AS ENUM ('hot', 'warm', 'cold');

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan plan_type DEFAULT 'starter',
  crm_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (profiles)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  slug TEXT UNIQUE,
  job_title TEXT,
  bio TEXT,
  profile_pic TEXT,
  phone TEXT,
  website TEXT,
  linkedin_url TEXT,
  company_name TEXT,
  vcard_data JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  ghost_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chips
CREATE TABLE chips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  active_mode chip_mode DEFAULT 'corporate',
  target_url TEXT,
  menu_data JSONB,
  review_data JSONB,
  vcard_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_scan TIMESTAMPTZ
);

-- Scans
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chip_id UUID REFERENCES chips(id) ON DELETE SET NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  device_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  location_data JSONB,
  mode_at_scan chip_mode
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Campaign Overrides
CREATE TABLE campaign_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
);

-- User auto-creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function
CREATE OR REPLACE FUNCTION public.get_user_id_from_auth()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_overrides ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can read own company" ON companies FOR SELECT
  USING (id IN (SELECT company_id FROM users WHERE auth_user_id = auth.uid()));

-- Users policies
CREATE POLICY "Public profiles readable" ON users FOR SELECT
  USING (ghost_mode = FALSE OR auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON users FOR UPDATE
  USING (auth_user_id = auth.uid());

-- Chips policies
CREATE POLICY "Users can read own chips" ON chips FOR SELECT
  USING (
    assigned_user_id = public.get_user_id_from_auth()
    OR company_id IN (SELECT company_id FROM users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Authenticated can insert chips" ON chips FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own chips" ON chips FOR UPDATE
  USING (
    assigned_user_id = public.get_user_id_from_auth()
    OR company_id IN (SELECT company_id FROM users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can delete own chips" ON chips FOR DELETE
  USING (
    assigned_user_id = public.get_user_id_from_auth()
    OR company_id IN (SELECT company_id FROM users WHERE auth_user_id = auth.uid())
  );

-- Scans policies
CREATE POLICY "Anyone can insert scans" ON scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own scans" ON scans FOR SELECT
  USING (
    chip_id IN (
      SELECT id FROM chips
      WHERE assigned_user_id = public.get_user_id_from_auth()
         OR company_id IN (SELECT company_id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Leads policies
CREATE POLICY "Users can read own leads" ON leads FOR SELECT
  USING (captured_by_user_id = public.get_user_id_from_auth());

CREATE POLICY "Authenticated can insert leads" ON leads FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own leads" ON leads FOR UPDATE
  USING (captured_by_user_id = public.get_user_id_from_auth());

CREATE POLICY "Users can delete own leads" ON leads FOR DELETE
  USING (captured_by_user_id = public.get_user_id_from_auth());

-- Campaign overrides policies
CREATE POLICY "Users can read company overrides" ON campaign_overrides FOR SELECT
  USING (
    company_id IN (SELECT company_id FROM users WHERE auth_user_id = auth.uid())
  );
```

### Frontend Query Fix Pattern

All dashboard pages need this change when looking up the user profile:

```typescript
// Before (broken - auth.uid != users.id)
.eq("id", user.id)

// After (correct - match via auth_user_id)
.eq("auth_user_id", user.id)
```

For leads queries that use `captured_by_user_id`, these need to first fetch the user's profile ID, then use that.

### Files Changed Summary

| Action | File |
|--------|------|
| Fix | `tsconfig.node.json` (add noEmit) |
| Delete | `src/lib/supabase/server.ts` |
| Delete | `src/lib/actions/analytics.ts` |
| Delete | `src/lib/actions/users.ts` |
| Delete | `src/lib/actions/leads.ts` |
| Update | `src/lib/supabase/client.ts` (re-export from integrations) |
| Update | `src/contexts/auth-context.tsx` (fix import) |
| Update | `src/pages/dashboard/index.tsx` (auth_user_id queries) |
| Update | `src/pages/dashboard/devices.tsx` (auth_user_id queries) |
| Update | `src/pages/dashboard/leads.tsx` (auth_user_id queries) |
| Update | `src/pages/dashboard/analytics.tsx` (auth_user_id queries) |
| Update | `src/pages/dashboard/settings.tsx` (auth_user_id queries) |
| Update | `src/pages/login.tsx` (remove debug panel) |
| Migration | Create all 6 tables + enums + trigger + RLS |

