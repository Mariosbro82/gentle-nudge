# Backend & Data Logic Documentation

**Project**: Gemini-nfc (Supabase ID: `apkufbirizugthtlznzm`)
**Last Updated**: 2026-02-08

## Database Schema

### Table: `public.users`
This is the core table storing user profiles. It is linked 1:1 with Supabase Auth (`auth.users`).

- **Primary Key**: `id` (UUID, default: `uuid_generate_v4()`)
- **Foreign Key**: `auth_user_id` -> `auth.users.id` (UUID, Unique Index)
    - *Note*: This is the critical link between the authenticated user and their profile data.
- **Constraints**:
    - `email` (Text, NOT NULL): Required for system integrity.
    - `slug` (Text, Unique): Public handle for the user's profile URL.

#### Key Fields
| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | `uuid_generate_v4()` | Internal ID (Primary Key) |
| `auth.user_id` | UUID | NULL | References `auth.users`. Unique. |
| `email` | Text | NULL | **Required** (NOT NULL). Must be provided on Upsert. |
| `slug` | Text | NULL | User's customs URL handle. |
| `name` | Text | NULL | Display name. |
| `job_title` | Text | NULL | |
| `profile_pic` | Text | NULL | Public URL to image in storage. |
| `banner_pic` | Text | NULL | Public URL to image in storage. |
| `webhook_url` | Text | NULL | Zapier/Make webhook URL. |
| `updated_at` | Timestamptz | `now()` | Timestamp of last update. |
| `ghost_mode` | Boolean | `false` | Hides public profile if true. |
| `active_template`| Text | `'premium-gradient'` | Selected UI template. |

### RLS Policies (`public.users`)
- **Enable RLS**: Yes.
- **Select**: Public (Anyone can read, needed for public profiles).
- **Update**: Users can update their own rows (`auth.uid() = auth_user_id`).
- **Insert**: Users can insert their own rows (`auth.uid() = auth_user_id`).

### Indexes
- `users_pkey` (id)
- `users_auth_user_id_key` (auth_user_id) - *Added to enable UPSERT interactions.*
- `users_slug_key` (slug)

---

## Storage Buckets

### Bucket: `profile-images`
Stores user uploads (Profile Pictures and Banners).

- **Public Access**: Enabled.
- **File Path Structure**: `{userId}/{filename}`
    - Example: `6ba29fe3-7b40-47fd-935d-838580087a7d/profile.jpg`
    - *Note*: The `userId` folder must match the authenticated user's ID.

#### RLS Policies (`storage.objects`)
- **Select**: Public.
- **Insert/Update/Delete**: Authenticated users ONLY, where the path folder name matches their `auth.uid()`.

---

## Integrations

### Frontend Data Handling
- **Profile Saving**: Uses `upsert` on `public.users`.
    - **Critical**: Must include `email` in the payload as it is NOT NULL.
- **Images**: Uploaded to Storage, then public URL saved to `profile_pic` / `banner_pic` columns via `upsert`.
- **Zapier**: Webhook URL saved to `webhook_url` via `upsert`.

### Database Functions
- Standard Supabase Postgres extensions (e.g., `uuid-ossp`).
