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

### `users` Table
Stores user profile information, separate from `auth.users`.

| Column | Type | Description | Frontend Usage |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | - |
| `auth_user_id` | UUID | Foreign Key -> `auth.users` | Links profile to authenticated user. |
| `slug` | Text | Unique Handle | Used for public profile URL (`nfc.wear/p/[slug]`). Editable in Settings. |
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

### `leads` Table
Stores leads captured via the NFC profile "Connect" feature.

| Column | Type | Description |
| :--- | :--- | :--- |
| `lead_name` | Text | Name of the person connecting. |
| `lead_email` | Text | Email of the person connecting. |
| `captured_by_user_id` | UUID | The user whose profile was scanned. |

## 3. Frontend <-> Backend Logic

### Profile Updates (`src/pages/dashboard/settings.tsx`)
- **Fetch**: On load, fetches `users` row where `auth_user_id` matches the current session user.
- **Save**: Updates the `users` table.
  - **Logic**: 
    - `handleSave` collects form data (Slug, Name, Title, Bio, **Email**, **Phone**, Website, LinkedIn).
    - Sends `UPDATE` query to `users` table matching `auth_user_id`.
    - Updates local state on success.
- **Images**: Uploads to Supabase Storage (`profile-images` bucket?), gets public URL, then updates `users.profile_pic` or `users.banner_pic`.

### Public Profile (`src/pages/p/[userId].tsx`)
- **Fetch**: Looks up user by `slug` first. If not found, tries by `id`.
- **Display**: Renders the profile using the `active_template`.
- **Ghost Mode**: Checks `ghost_mode` and `ghost_mode_until`. If active, shows Ghost page.

## 4. RLS Component (Row Level Security)
- **Users**: Users can only update their own row (based on `auth_user_id`).
- **Public Read**: `users` table should be readable by everyone (for public profiles), or at least the columns needed for rendering.

## 5. Recent Changes
- **Feature**: Added `email` and `phone` inputs to the Settings page.
- **Backend Fix**: Added missing columns (`phone`, `slug`, `bio`, `website`, `linkedin_url`, `active_template`, `banner_pic`, `webhook_url`, `ghost_mode_until`) to the `users` table via migration `add_missing_user_columns`.
- **Logic**: Updated `handleSave` in `settings.tsx` to persist these fields to the `users` table.
