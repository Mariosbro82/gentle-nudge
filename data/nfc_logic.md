# NFC Redirection Logic

The redirection logic for NFC chips is located in `src/pages/t/[uid].tsx`. It determines where a user is sent based on the `active_mode` of the scanned chip.

## Modes

### Custom Logic (Frontend)

| Mode | Destination | Logic |
| :--- | :--- | :--- |
| `corporate` | User Profile (`/p/[slug]`) | Redirects to the assigned user's profile page. |
| `hospitality` | Review / Menu / **Profile** | 1. Menu URL<br>2. Review Page (`/review/[id]`)<br>3. **Fallback**: User Profile. |
| `campaign` | Campaign / **Profile** | 1. Campaign Page (`/campaign/[id]`)<br>2. **Fallback**: User Profile. |
| `lost` | **Profile** (Contact Owner) | Redirects to the User Profile so the finder can contact the owner. |
| `[unknown]` | **Profile** | If the mode is invalid (e.g., deprecated or typo), it falls back to the User Profile. |

## Universal Fallback
**Rule of Thumb**: If the specific destination for a mode is not configured (e.g., missing Company ID), the system **automatically** redirects to the assigned User Profile. This ensures the chip "always works" and leads to a meaningful page.

## Database Enum
The `chip_mode` enum in the database supports:
- `corporate`
- `hospitality`
- `campaign`
- `lost`

## Ghost Mode Override
Regardless of the mode, if the assigned user has `ghost_mode` enabled (and active), the system **always** redirects to the user's profile page. This allows the "Ghost Page" component on the profile route to handle the "Account is ghosted" display.
