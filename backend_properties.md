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
- `banner_pic` (text): URL to banner image (from `profile-images` bucket).
- `active_template` (text, default: 'premium-gradient'): ID of the active profile template.
- `ghost_mode` (bool): Legacy privacy setting (superseded by ghost_mode_until logic?).
- `ghost_mode_until` (timestamptz): Timestamp when ghost mode expires (NULL = off/indefinite).
- `webhook_url` (text): URL to send lead data to (via HTTP POST).

### Table: `profile_templates`
Stores available design templates for user profiles.
- `id` (text, PK): Template ID (e.g., 'premium-gradient').
- `name` (text): Display name.
- `description` (text): Description.
- `preview_image` (text): URL to preview image.
- `config` (jsonb): JSON configuration for the template (styles, options).
- `is_active` (bool): Whether the template is available.
- `sort_order` (int): Display order.
- `created_at` (timestamptz)

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

### Table: `webhook_logs`
Logs HTTP requests sent to user webhooks.
- `id` (uuid, PK)
- `user_id` (uuid, FK -> users.id)
- `lead_id` (uuid, FK -> leads.id)
- `status_code` (int): HTTP status code from the webhook endpoint.
- `success` (bool): Whether the request was successful.
- `error_message` (text): Error details if failed.
- `created_at` (timestamptz)

### Table: `campaign_overrides`
Global overrides for marketing campaigns.
- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `target_url` (text)
- `active` (bool)
- `start_date`, `end_date`

## RLS Policies

### Table: `users`
- `SELECT`: Publicly readable (`true`).
- `UPDATE`: Authenticated users can update their own profile (`auth.uid() = auth_user_id`).

## Storage


### Bucket: `profile-images`
Stores user profile pictures and banner images.
- **Public:** Yes
- **File Size Limit:** 5MB
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- **Path Structure:** `{auth_user_id}/{filename}`
- **Policies:**
  - `INSERT`: Authenticated users can upload to their own folder (`auth.uid()`).
  - `UPDATE`: Authenticated users can update their own files.
  - `DELETE`: Authenticated users can delete their own files.
  - `SELECT`: Publicly readable.

## Logic & Flows
- **Chip Redirection:** Logic to determine where a user is redirected upon scanning a chip (based on `active_mode` and `campaign_overrides`).
- **Lead Capture:** Logic for saving lead form data to the `leads` table.
- **Lead Webhook:** When a new lead is inserted, a Postgres trigger (`on_lead_created_webhook`) calls the `notify_webhook_on_lead` function. This function checks if the capturing user has a `webhook_url` configured. If so, it sends a POST request with the lead data using `pg_net`. Logs are stored in `webhook_logs`.
- **Bulk Import:** Frontend-driven logic to parse CSV/Excel files and batch insert new chips into the `chips` table, skipping duplicates based on `uid`.

## Maintenance
This document must be updated whenever:
1.  The database schema changes.
2.  New environment variables are added.
3.  Core backend logic (redirects, auth, etc.) is modified.
