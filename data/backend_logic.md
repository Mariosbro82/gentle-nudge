# Backend Logic & Security Documentation

This document outlines the backend logic, Rank Level Security (RLS) policies, and environmental variables for the NFC application. It must be updated whenever changes are made to the data structure or access control.

## Overview
The application uses Supabase (PostgreSQL) for data storage and authentication. 
- **Users**: Profiles for individuals or companies.
- **Chips**: NFC hardware that redirects to specific URLs or internal pages based on assignment.
- **Scans**: Logs of NFC tap events.

## Row Level Security (RLS) Policies

### `users` Table
| Policy Name | Operation | Role | Condition | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Admins can read all users` | SELECT | authenticated | `is_admin()` | Admins have full read access. |
| `Admins can update all users` | UPDATE | authenticated | `is_admin()` | Admins have full update access. |
| `Public profiles readable` | SELECT | public | `((ghost_mode = false) OR (auth_user_id = auth.uid()))` | Profiles are public unless `ghost_mode` is active. Owners can always see their own profile. |
| `Users can insert their own profile` | INSERT | public | `(auth.uid() = auth_user_id)` | Users can create their own profile upon registration. |
| `Users can update own profile` | UPDATE | public | `(auth_user_id = auth.uid())` | Users can only update their own profile. |

### `chips` Table
| Policy Name | Operation | Role | Condition | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Authenticated can insert chips` | INSERT | authenticated | `true` | Authenticated users can create chips (needs refinement if only admins should create). |
| `Users can delete own chips` | DELETE | authenticated | `(is_admin() OR (assigned_user_id = get_user_id_from_auth()) OR (company_id IN ( SELECT users.company_id FROM users WHERE (users.auth_user_id = auth.uid()))))` | Owners or Admins can delete. |
| `Users can read own chips` | SELECT | authenticated | `(is_admin() OR (assigned_user_id = get_user_id_from_auth()) OR (company_id IN ( SELECT users.company_id FROM users WHERE (users.auth_user_id = auth.uid()))))` | Owners or Admins can read details locally. |
| `Users can update own chips` | UPDATE | authenticated | `(is_admin() OR (assigned_user_id = get_user_id_from_auth()) OR (company_id IN ( SELECT users.company_id FROM users WHERE (users.auth_user_id = auth.uid()))))` | Owners or Admins have write access. |
| `Public chips readable` | SELECT | public | `true` | **CRITICAL**: Allows public access to read chip data. Required for the NFC redirection logic (`/t/[uid]`) to function for non-logged-in users. |

## Backend Logic

### NFC Redirection (`/t/[uid]`)
1.  **Lookup**: The page fetches a chip by its `uid`.
2.  **Access**: Thanks to `Public chips readable`, this works without a session.
3.  **Ghost Mode Check**:
    - If the chip is assigned to a user with `ghost_mode` active (and not expired), it **always** redirects to the profile page (where the Ghost Page component handles the display) instead of performing other actions.
4.  **Modes**:
    - `corporate`: Redirects to the assigned user's profile (`/p/[slug]` or `/p/[id]`).
    - `hospitality`: Redirects to a menu URL or review page (`/review/[company_id]`).
    - `campaign`: Redirects to a campaign page (`/campaign/[company_id]`).

### Profile Page (`/p/[userId]`)
1.  **Lookup**: Fetches user by `slug` or `id`.
2.  **Access**: Publicly accessible if `ghost_mode` is false.
3.  **Ghost Mode**: If `ghost_mode` is true, the backend returns the data (if the user is the owner), but the frontend *should* handle the "Ghost" view.
    - *Note*: If `ghost_mode` is true and the viewer is NOT the owner, the `Public profiles readable` policy will prevent the data fetch entirely (returning no data/error), which correctly results in a "User not found" or Ghost view depending on implementation.

## Critical Environmental Variables
- `VITE_SUPABASE_URL`: The Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: The public anonymous key. safe for client-side use.

## Security Notes
- **Modification**: Only the owner (matching `auth_user_id`) or an Admin can modify chip or user data. Authenticated users cannot modify others' data.
- **Public Access**: Explicitly granted for `SELECT` on `chips` and `users` (non-ghosted) to enable core functionality.
