
# NFCwear Backend Setup with Lovable Cloud Supabase

## Overview

This plan sets up a complete Supabase backend for the NFCwear admin dashboard, fixing build errors and ensuring all dashboard features work correctly with proper database structure, authentication, and Row Level Security (RLS) policies.

## Current Issues

1. **Build Error**: `tsconfig.node.json` missing `noEmit: false` causes TypeScript reference error
2. **Next.js Code**: Server files (`server.ts`, `actions/`) use Next.js APIs that don't work in Vite
3. **No Backend**: Supabase is not connected - dashboard features won't function
4. **Missing RLS**: No security policies defined for data access

## Architecture

```text
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|   React Frontend  +---->+  Supabase Client  +---->+  Supabase Cloud   |
|   (Vite + React)  |     |  (Browser SDK)    |     |  (Database + Auth)|
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
         |                                                   |
         |                                                   |
         v                                                   v
+-------------------+                             +-------------------+
|                   |                             |                   |
|  Auth Context     |                             |  Tables:          |
|  Protected Routes |                             |  - companies      |
|                   |                             |  - users          |
+-------------------+                             |  - chips          |
                                                  |  - scans          |
                                                  |  - leads          |
                                                  |  - campaign_      |
                                                  |    overrides      |
                                                  +-------------------+
```

## Implementation Steps

### Step 1: Fix Build Errors

**File: `tsconfig.node.json`**
- Add `"noEmit": false` to fix the TypeScript reference error

### Step 2: Remove Next.js Server Code

Delete or refactor files that use Next.js APIs:

**Files to Remove:**
- `src/lib/supabase/server.ts` (uses Next.js `cookies()`)
- `src/lib/actions/leads.ts` (uses `"use server"` and `revalidatePath`)
- `src/lib/actions/users.ts` (if it has Next.js code)
- `src/lib/actions/analytics.ts` (uses `headers()` from Next.js)

**Files to Clean:**
- Remove `"use client"` directive from `sidebar.tsx` (not needed in Vite)

### Step 3: Enable Lovable Cloud Supabase

Connect the project to Lovable's built-in Supabase backend.

### Step 4: Create Database Schema

**Migration 1: Core Tables and Enums**

Create the following structure:

**Enums:**
- `plan_type`: starter, pro, enterprise
- `chip_mode`: corporate, hospitality, campaign
- `sentiment_type`: hot, warm, cold

**Tables:**

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| companies | Company/organization data | id, name, plan, crm_config |
| users | User profiles | id, auth_user_id, company_id, email, name, slug, job_title, profile_pic, vcard_data, social_links |
| chips | NFC chip registry | id, uid, company_id, assigned_user_id, active_mode, last_scan |
| scans | Scan event logs | id, chip_id, scanned_at, device_type, ip_address, user_agent |
| leads | Captured contacts | id, chip_id, captured_by_user_id, lead_name, lead_email, sentiment |
| campaign_overrides | Campaign redirects | id, company_id, target_url, active, start_date, end_date |

### Step 5: User Profile Auto-Creation

Create a database trigger that automatically creates a user profile when someone signs up:

```text
auth.users (signup) --> trigger --> public.users (profile created)
```

This ensures every authenticated user has a matching profile record.

### Step 6: Row Level Security (RLS) Policies

**Security Model:**
- Users can only see/edit their own data
- Company members can see company-wide data
- Public pages (profile, NFC tap) have anonymous read access

**Policies:**

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| companies | Own company only | Admin only | Admin only | Admin only |
| users | Own profile + public profiles | Via trigger | Own profile only | N/A |
| chips | Own/company chips | Authenticated | Own chips | Own chips |
| scans | Own chip scans | Anyone (for NFC) | N/A | N/A |
| leads | Own leads | Authenticated | Own leads | Own leads |

### Step 7: Update Frontend Queries

Ensure dashboard pages query the correct user:
- Use `auth_user_id` to link `auth.users` to `public.users`
- Update profile fetching to match by `auth_user_id`

## Technical Details

### Database Schema (SQL)

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
```

### User Auto-Creation Trigger

```sql
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
```

### Helper Function for User Lookup

```sql
CREATE OR REPLACE FUNCTION public.get_user_id_from_auth()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

### RLS Policy Examples

```sql
-- Users: Read own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth_user_id = auth.uid() OR ghost_mode = FALSE);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth_user_id = auth.uid());

-- Chips: Read own/company chips
ALTER TABLE chips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chips"
  ON chips FOR SELECT
  USING (
    assigned_user_id = public.get_user_id_from_auth()
    OR company_id IN (
      SELECT company_id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Scans: Anyone can insert (for NFC tracking)
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log scans"
  ON scans FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can read scans for their chips"
  ON scans FOR SELECT
  USING (
    chip_id IN (
      SELECT id FROM chips 
      WHERE assigned_user_id = public.get_user_id_from_auth()
         OR company_id IN (SELECT company_id FROM users WHERE auth_user_id = auth.uid())
    )
  );
```

## Frontend Updates Required

### Update User Profile Queries

Dashboard pages currently query by `user.id` (auth ID), but need to query by `auth_user_id`:

```typescript
// Before (incorrect)
.eq("id", user.id)

// After (correct)
.eq("auth_user_id", user.id)
```

### Files to Update
- `src/pages/dashboard/index.tsx`
- `src/pages/dashboard/analytics.tsx`
- `src/pages/dashboard/devices.tsx`
- `src/pages/dashboard/leads.tsx`
- `src/pages/dashboard/settings.tsx`

## Summary of Changes

| Category | Action |
|----------|--------|
| Build Fix | Update `tsconfig.node.json` |
| Cleanup | Remove 4 Next.js server files |
| Backend | Enable Lovable Cloud Supabase |
| Database | Create 6 tables with proper relations |
| Security | Add RLS policies for all tables |
| Auth | Add user profile auto-creation trigger |
| Frontend | Update 5 dashboard pages to use `auth_user_id` |

## Post-Implementation

After setup is complete:
1. Test user signup creates profile automatically
2. Test login redirects to dashboard
3. Verify dashboard loads data correctly
4. Test NFC tap routing works
5. Test device/chip CRUD operations
6. Verify leads capture and export
