# Backend Data Logic & Documentation

> [!IMPORTANT]
> This document must be updated whenever changes are made to the data structure, backend logic, or environment variables.

## 1. Environment Variables

The application relies on the following environment variables (typically found in `.env.local`):

| Variable | Description |
| :--- | :--- |
| `VITE_SUPABASE_URL` | The URL of the Supabase project. |
| `VITE_SUPABASE_ANON_KEY` | The anonymous public key for Supabase client usage. |

## 2. Database Schema (Public)

The application uses Supabase (PostgreSQL). Key tables and their usage in the frontend are described below.

### `profile_views` Table
Stores detailed analytics for profile visits.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK -> `users.id` |
| `ip_address` | Text | Visitor IP (extracted via Edge Function) |
| `device_type` | Text | Mobile/Desktop/Tablet |
| `user_agent` | Text | Browser User Agent |
| `referrer` | Text | Referral source |
| `country` | Text | Geo-IP location |
| `is_unique` | Boolean | True if first visit from IP |
| `is_recurring` | Boolean | True if visit after >12 hours from repeat IP |
| `viewed_at` | TIMESTAMPTZ | Timestamp of visit |

### `users` Table
Stores user profile information, separate from `auth.users`.

| Column | Type | Description | Frontend Usage |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | - |
| `auth_user_id` | UUID | Foreign Key -> `auth.users` | Links profile to authenticated user. |
| `email` | Text | **Contact Email** | **Required** (NOT NULL) for `upsert`. Must be included in every update. |
| `name` | Text | Full Name | Displayed on profile. Editable in Settings. |
| `email` | Text | **Contact Email** | Publicly displayed contact email (distinct from auth email). **Added to Settings form.** |
| `phone` | Text | **Contact Phone** | Publicly displayed phone number. **Added to Settings form.** |
| `job_title` | Text | Job Title | Displayed on profile. Editable in Settings. |
| `bio` | Text | Biography | Displayed on profile. Editable in Settings. |
| `website` | Text | Website URL | Displayed on profile. Editable in Settings. |
| `linkedin_url` | Text | LinkedIn URL | Displayed on profile. Editable in Settings. |
| `profile_pic` | Text | URL | Profile picture. Managed via storage upload. |
| `banner_pic` | Text | URL | Banner image. Managed via storage upload. |
| `active_template`| Text | Context | Design template for the public profile (e.g., 'premium-gradient'). |
| `ghost_mode` | Boolean | Status | If true, profile returns 404/Ghost page. |
| `ghost_mode_until` | TIMESTAMPTZ | Status | Timestamp until which ghost mode is active. |
| `webhook_url` | Text | URL | URL for sending lead capture events (Integrations). |
| `view_count` | Integer | Analytics | Total number of profile views. Defaults to 0. Incremented via RPC. |
| `role` | Text | Auth Role | 'user' or 'admin'. Default: 'user'. |
| `notes` | Text | Admin Notes | Internal notes visible only to admins. |

### `functions` (RPC)
| Function | Parameters | Logic | Permissions |
| :--- | :--- | :--- | :--- |
| `log_profile_view` | `p_user_id`, `p_ip_address`, `p_device_type`, `p_user_agent`, `p_referrer`, `p_country` | **Restored:** Logs a view. Checks for duplicates (<12h) and recurring visitors (>12h) based on IP. Increments `users.view_count`. | `anon` (service role via Edge Function) |
| `get_interested_leads` | `p_user_id` | Returns leads that have recurring profile views (same IP). | `authenticated` |
| `is_admin` | None | Returns TRUE if current user has `role = 'admin'`. Used in RLS policies. | `authenticated` (Security Definer) |
| `scan` | `uid` (via URL) | **Edge Function**: Handles NFC scanning. Lookups chip, logs scan, and redirects based on mode. | `anon` / `public` |
| `test_webhook` | `url` | Sends a test POST request to the specified URL to verify webhook connectivity. Requires `http` extension. | `authenticated` / `service_role` |

### `leads` Table
Stores leads captured via the NFC profile "Connect" feature.

| Column | Type | Description |
| :--- | :--- | :--- |
| `lead_name` | Text | Name of the person connecting. |
| `lead_email` | Text | Email of the person connecting. |
| `captured_by_user_id` | UUID | The user whose profile was scanned. |
| `ip_address` | Text | IP address of the lead (for interest matching). |

### `chips` Table
Stores data for physical NFC tags.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `uid` | Text | Unique identifier of the NTAG424 Chip (Hex string). |
| `company_id` | UUID | FK -> `companies.id` |
| `assigned_user_id` | UUID | FK -> `users.id` |
| `active_mode` | Enum | `corporate`, `hospitality`, `campaign`, or `lost`. |
| `last_scan` | TIMESTAMPTZ | Last time the chip was scanned. |
| `vcard_data` | JSONB | Data for vCard mode. |
| `menu_data` | JSONB | Data for Menu (hospitality) mode. |
| `review_data` | JSONB | Data for Review mode. |

### `scans` Table
Stores analytics for every NFC scan.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `chip_id` | UUID | FK -> `chips.id` |
| `scanned_at` | TIMESTAMPTZ | Timestamp of scan. |
| `device_type` | Text | Mobile/Tablet/Desktop. |
| `ip_address` | Text | Scanner IP. |
| `user_agent` | Text | Scanner User Agent. |
| `mode_at_scan` | Enum | Mode the chip was in during scan. |

## 3. Frontend <-> Backend Logic

### Profile Updates (`src/pages/dashboard/settings.tsx`)
- **Fetch**: On load, fetches `users` row where `auth_user_id` matches the current session user.
- **Analytics**: Both `dashboard/index.tsx` and `dashboard/analytics.tsx` fetch `view_count` from `users` table to display profile traffic stats.
- **Save**: Updates the `users` table.
  - **Logic**: 
    - `handleSave` collects form data (Slug, Name, Title, Bio, **Email**, **Phone**, Website, LinkedIn).
    - Sends `UPDATE` query to `users` table matching `auth_user_id`.
    - Updates local state on success.
- **Images**: Uploads to Supabase Storage (`profile-images` bucket?), gets public URL, then updating `users.profile_pic` or `users.banner_pic`.

### Admin Dashboard (`src/pages/admin/chips.tsx`)
- **Chip Management**:
    - **Add**: Admins can manually register chips by UID.
    - **Import**: Mass import via CSV (`UID, Mode`).
    - **Edit**: Admins can change the `active_mode` (Corporate, Hospitality, Campaign, Lost) of any chip.
    - **Delete**: Chips can be permanently deleted.
    - **Assign**: Chips can be assigned to Users or Companies.

### User Dashboard (`src/pages/dashboard/devices.tsx`)
- **Add Chip**: Users can add chips and select the initial `active_mode`.
- **Overview**: Shows aggregated stats including active chips count.

### Public Profile (`src/pages/p/[userId].tsx`)
- **Fetch**: Looks up user by `slug` first. If not found, tries by `id`.
- **Display**: Renders the profile using the `active_template`.
- **View Tracking**: Calls `log_profile_view` Edge Function on mount to record detailed analytics (IP, device, referrer) and manage visitor uniqueness/recurrence.
- **Ghost Mode**: Checks `ghost_mode` and `ghost_mode_until`. If active, shows Ghost page.

## 4. RLS Component (Row Level Security)
- **Users**: Users can only update their own row (based on `auth_user_id`).
- **Public Read**: `users` table should be readable by everyone (for public profiles), or at least the columns needed for rendering.
- **Admin Access**: Users with `role = 'admin'` have full access (SELECT, UPDATE, DELETE) to `users`, `chips`, and read access to `profile_views`, `leads` via the `is_admin()` function.

## 5. Recent Changes
- **Feature**: Added `email` and `phone` inputs to the Settings page.
- **Backend Fix**: Added missing columns (`phone`, `slug`, `bio`, `website`, `linkedin_url`, `active_template`, `banner_pic`, `webhook_url`, `ghost_mode_until`) to the `users` table via migration `add_missing_user_columns`.
- **Logic**: Updated `handleSave` in `settings.tsx` to persist these fields to the `users` table.
- **Analytics**: Added `view_count` column and `increment_view_count` RPC. Frontend now tracks views on profile mount and displays stats in Dashboard.
- **Onboarding**: Added post-signup onboarding flow with `has_completed_onboarding` flag and `onboarding_data` table.
- **Analytics System**: Implemented extensive profile view tracking using Edge Functions and `profile_views` table. Replaced simple `view_count` with detailed dashboard analytics (unique visitors, recurring leads, device/country breakdown). Updated `leads` table to track recurring interest.
- **Deep Analytics Restoration**: Re-implemented `log_profile_view` RPC to correctly track IP addresses and identify recurring visitors (visits > 12h apart). Added NFC Scan analytics to the dashboard.
- **Marketing Update**: Updated the donation claim on the Sustainability page from "1€ pro Artikel" to "Ein Teil jedes Verkaufs".
## 6. Onboarding System

### `users.has_completed_onboarding` Column
| Column | Type | Description | Frontend Usage |
| :--- | :--- | :--- | :--- |
| `has_completed_onboarding` | Boolean | Default: false | Checked by `ProtectedRoute` to redirect new users to `/onboarding`. |

### `onboarding_data` Table
Stores survey responses from the onboarding wizard.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK → users.id |
| `industry` | Text | Industry/profession |
| `use_case` | Text | Primary use case (networking, sales, branding, team) |
| `referral_source` | Text | How they heard about NFCwear |
| `company_name` | Text | Company name (optional) |
| `team_size` | Text | Team size (solo, 2-10, 11-50, 50+) |
| `expected_contacts` | Text | Expected contacts per month |
| `completed_at` | TIMESTAMPTZ | When onboarding completed |

### Onboarding Flow Logic
1. `ProtectedRoute` checks `has_completed_onboarding` flag
2. If `false` or no user profile exists, redirects to `/onboarding`
3. Wizard collects data in 5 steps (Welcome → Personalization → Business → Profile Setup → Completion)
4. On completion:
   - Creates/updates `users` row with profile info and sets `has_completed_onboarding = true`
   - Inserts `onboarding_data` row with survey responses
5. Redirects to `/dashboard`

## 7. Email Verification (Auth Callback)

### `/auth/callback` Page (`src/pages/auth/callback.tsx`)
Handles Supabase email confirmation links (magic links, OTP verification) and PKCE code exchange.

| State | UI | Logic |
| :--- | :--- | :--- |
| `loading` | Spinner + "Ihre E-Mail wird verifiziert..." | Checks for `code` (PKCE) or hash fragment (Implicit). Exchanges code for session or verifies existing session. |
| `success` | Green checkmark + countdown | Redirects to `/dashboard` after 3s (countdown). |
| `error` | Red X + error message | Shows retry button (reload) and "Back to Login". |

### Logic Flow
1. **Detection**: Checks URL for `?code=` (PKCE) or `#access_token` (Implicit/Magic Link).
2. **Exchange**: 
   - If `code`: Calls `exchangeCodeForSession(code)`.
   - If hash: Waits 500ms for Supabase client to auto-detect session.
3. **Session Check**: Verifies `supabase.auth.getSession()`.
   - If no session, waits 1500ms and retries once (handling race conditions).
4. **Completion**:
   - **Success**: Sets state to `success`, starts 3s countdown -> Redirects to `/dashboard`.
   - **Failure**: Sets state to `error` with specific message (e.g., "Link expired").

### Supabase Configuration Required
Add to **Authentication > URL Configuration > Redirect URLs**:
- `http://localhost:1234/auth/callback` (development)
- `https://your-domain.com/auth/callback` (production)

### Shop Data Logic (Mocked)
Currently, product data is mocked on the frontend (`src/pages/shop/[id].tsx`) to simulate a Shopify experience. Payment flow is also mocked to simulate a Stripe checkout.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique Product ID (`premium-nfc-tshirt`, `lifestyle-nfc-tee`) |
| `name` | String | Product Name |
| `price` | Number | Price in EUR |
| `description` | String | Detailed product description |
| `images` | Array | List of image URLs (located in `/public/assets/shop/`) |
| `variants` | Array | Available sizes (S, M, L, XL) |

### Navigation & Page Structure
The website has been transitioned from a one-pager to a multi-page architecture:
- `/`: Home (formerly Features)
- `/platform`: Severmore OS details
- `/solutions`: Target group specific solutions
- `/sustainability`: ESG & Compliance standards
- `/shop`: Hardware store ("The Fleet")
- `/about`: Company storytelling and contact
- `/pricing`: Subscription and hardware pricing
