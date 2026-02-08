# NFCwear Marketing Video - Handoff Document

## Project Overview
**Repository**: `https://github.com/Mariosbro82/app-nfc`  
**Local Path**: `/Users/fabianharnisch/nfc-website`  
**Supabase Project**: `Gemini-nfc` / `https://apkufbirizugthtlznzm.supabase.co`

> [!CAUTION]
> **DO NOT** access or edit `maybe-working` / `https://airpomlmvtfcetyvdmsq.supabase.co`

---

## Marketing Video Project

### Location
`/Users/fabianharnisch/nfc-website/marketing-video/` - Remotion project for motion graphics

### Video Structure (18 seconds @ 30fps = 540 frames)
| Phase | Frames | Time | Content |
|-------|--------|------|---------|
| 1 | 0-90 | 0-3s | Full hoodie → zoom to right sleeve cuff |
| 2 | 90-280 | 3-9.3s | iPhone taps NFC chip, shows profile |
| 3 | 280-420 | 9.3-14s | Salesforce dashboard with new lead |
| 4 | 420-540 | 14-18s | Final CTA text overlay |

### Key Components
| File | Purpose |
|------|---------|
| `SleeveCloseUp.tsx` | Hoodie zoom animation with NFC chip overlay |
| `PhoneInteraction.tsx` | iPhone entering, tapping chip, showing profile |
| `LaptopDashboard.tsx` | Salesforce-style dashboard with lead notification |
| `NFCChip.tsx` | NFC chip SVG component |
| `Composition.tsx` | Main composition orchestrating all sequences |

### Assets in `marketing-video/src/assets/`
| Asset | Description |
|-------|-------------|
| `hoodie.png` | New white hoodie image (copied from `hoodie-final.png`) |
| `iphone-default.png` | iPhone home screen (before tap) |
| `iphone-ui.png` | iPhone showing NFC profile (after tap) |

---

## Current State (As of 2026-02-08)

### ✅ Completed Tasks
1. Created Remotion marketing video project
2. Implemented 4-phase video flow
3. Added new hoodie image (`hoodie-final.png`)
4. Positioned zoom on right sleeve cuff (scale 12x, translateX -850, translateY -600)
5. NFC chip positioned in lower-right quadrant
6. Raw iPhone images only (no coded frames)
7. Salesforce dashboard styled as macOS window
8. Final text overlay with gradient
9. **All code pushed to git** (`main` branch)

### 🔧 Current Zoom Settings (`SleeveCloseUp.tsx`)
```typescript
const scale = interpolate(zoomProgress, [0, 1], [1, 12]);
const translateX = interpolate(zoomProgress, [0, 1], [0, -850]);
const translateY = interpolate(zoomProgress, [0, 1], [0, -600]);
const chipOffsetX = 180;  // Far right
const chipOffsetY = 200;  // Far down
```

### 📸 Verification Screenshots
- Frame 0: `/Users/fabianharnisch/.gemini/antigravity/brain/481161d1-d2ab-4dcc-ba69-a7a8044fb25c/hoodie_actual_frame_0_1770500255747.png`
- Frame 90: `/Users/fabianharnisch/.gemini/antigravity/brain/481161d1-d2ab-4dcc-ba69-a7a8044fb25c/hoodie_frame_90_verify_1770500277641.png`

---

## Commands Reference

### Run Dev Server
```bash
cd /Users/fabianharnisch/nfc-website/marketing-video
npm run dev
# Opens http://localhost:3000
```

### Render Video
```bash
cd /Users/fabianharnisch/nfc-website/marketing-video
npx remotion render src/index.ts MyComp out/video.mp4
```

---

## User Rules (CRITICAL)
1. **Hosting format**: Keep the same as GitHub repo
2. **Local dependencies**: Create separate folder, delete when prompted
3. **Git operations**: Only commit/push when explicitly prompted
4. **Supabase**: Only use `Gemini-nfc` project
5. **Changes documentation**: All backend/data changes must update a markdown doc with logic, env vars, etc.

---

## Potential Next Steps
- User may want to **adjust zoom position further** (more right/down)
- User may want to **render the final MP4**
- User may want to **add more scenes or modify existing ones**
- User may want to **export for different platforms** (social media sizes)

---

## File References
- **Task List**: `/Users/fabianharnisch/.gemini/antigravity/brain/481161d1-d2ab-4dcc-ba69-a7a8044fb25c/task.md`
- **Walkthrough**: `/Users/fabianharnisch/.gemini/antigravity/brain/481161d1-d2ab-4dcc-ba69-a7a8044fb25c/walkthrough.md`
- **This Document**: `/Users/fabianharnisch/.gemini/antigravity/brain/481161d1-d2ab-4dcc-ba69-a7a8044fb25c/handoff_document.md`
