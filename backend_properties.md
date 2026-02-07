# Backend Structure & Data Documentation

**Last Updated:** 2026-02-07

## Overview
This document serves as the single source of truth for the backend logic, database schema, and environment variables for the **Gemini-nfc** project.

## Supabase Configuration
- **Project Name:** Gemini-nfc
- **Project ID:** `apkufbirizugthtlznzm`
- **Region:** eu-west-1

## Environment Variables
(To be populated with actual env vars used in the project, currently inferred)
- `VITE_SUPABASE_URL`: The URL of the Supabase project.
- `VITE_SUPABASE_ANON_KEY`: The anonymous public key for Supabase.

## Database Schema

### Table: `chips`
Stores information about the physical NTAG424 DNA chips.
- `id` (uuid, PK): Unique identifier for the record.
- `uid` (text, unique): The unique ID of the physical chip.
- `company_id` (uuid, FK -> companies.id): The company active on this chip.
- `assigned_user_id` (uuid, FK -> users.id): The user assigned to this chip.
- `active_mode` (enum: corporate, hospitality, campaign): The currently active mode.
- `mode` (text): additional mode text field (seems redundant with active_mode, needs clarification).
- `last_scan` (timestamptz): Timestamp of the last scan.
- `vcard_data` (jsonb): Specific data for vCard mode.
- `menu_data` (jsonb): Specific data for Menu mode.
- `review_data` (jsonb): Specific data for Review mode.
- `created_at` (timestamptz): Creation timestamp.

### Table: `users`
Stores user profiles and authentication links.
- `id` (uuid, PK): Unique identifier.
- `auth_user_id` (uuid): Link to Supabase Auth user.
- `company_id` (uuid, FK -> companies.id): The company the user belongs to.
- `slug` (text, unique): Public profile URL slug.
- `email`, `name`, `job_title`, `bio`, `website`, `linkedin_url`, `profile_pic`: Profile fields.
- `ghost_mode` (bool): Privacy setting.

### Table: `companies`
Stores company details.
- `id` (uuid, PK): Unique identifier.
- `name` (text): Company name.
- `plan` (enum: starter, pro, enterprise): Subscription plan.
- `crm_config` (jsonb): Configuration for CRM integrations.

### Table: `leads`
Stores leads captured via the NFC chips.
- `id` (uuid, PK): Unique identifier.
- `chip_id` (uuid, FK -> chips.id): Source chip.
- `captured_by_user_id` (uuid, FK -> users.id): The user whose chip captured the lead.
- `lead_name`, `lead_email`, `lead_phone`: Lead contact info.
- `sentiment` (enum: hot, warm, cold): Lead quality.
- `notes` (text): Additional notes.
- `follow_up_sent` (bool): Status of follow-up.

### Table: `scans`
Analytics for chip scans.
- `id` (uuid, PK): Unique identifier.
- `chip_id` (uuid, FK -> chips.id): The chip scanned.
- `scan_time` (timestamptz): Time of scan.
- `ip_address`, `user_agent`, `device_type`: Client info.
- `location`, `location_data`: Geolocation data.
- `mode_at_scan` (enum): The mode active when scanned.

### Table: `campaign_overrides`
Global overrides for marketing campaigns.
- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `target_url` (text)
- `active` (bool)
- `start_date`, `end_date`

## Logic & Flows
- **Chip Redirection:** Logic to determine where a user is redirected upon scanning a chip (based on `active_mode` and `campaign_overrides`).
- **Lead Capture:** Logic for saving lead form data to the `leads` table.
- **Bulk Import:** Frontend-driven logic to parse CSV/Excel files and batch insert new chips into the `chips` table, skipping duplicates based on `uid`.

## Maintenance
This document must be updated whenever:
1.  The database schema changes.
2.  New environment variables are added.
3.  Core backend logic (redirects, auth, etc.) is modified.
