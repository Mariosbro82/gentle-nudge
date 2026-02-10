# Media Assets Documentation

This document tracks all manual media asset integrations and the logic behind them.

## New Assets (Added 2026-02-10)

| File Name | Project Path | Context | Purpose |
| :--- | :--- | :--- | :--- |
| `tjark-portrait.jpg` | `public/images/founders/tjark-portrait.jpg` | About Page | High-res portrait for Tjark Schmitt. |
| `noah-portrait.jpg` | `public/images/founders/noah-portrait.jpg` | About Page | High-res portrait for Noah Solaker. |
| `founders-team-new.jpg` | `public/images/journey/founders-team-new.jpg` | About Page Gallery | Team photo showing both founders back-to-back. |
| `founding-signing.jpg` | `public/images/journey/founding-signing.jpg` | About Page Gallery | Action shot of founders signing documents (Founding). |
| `award-ceremony-new.jpg` | `public/images/journey/award-ceremony-new.jpg` | About Page Gallery | Founders on stage receiving the U21 award. |
| `behind-the-scenes-v2.mp4` | `public/images/journey/behind-the-scenes-v2.mp4` | About Page Gallery | New cinematic BTS video showing day-to-day operations. |

## Implementation Logic

### Goal
The goal was to replace existing generic or placeholder images with high-quality personal photos provided by the founders, while strictly following the rule: **"home screen keines chnages erlaubt"** (no changes to the home screen).

### Separation Strategy
- **Home Screen (`/`)**: Uses `FoundersSection` tracking images from `/images/founders/tjark.png` and `/images/founders/noah.png`. These files were **NOT** touched to maintain home screen integrity.
- **About Page (`/about`)**: Uses its own independent `founders` array and `journey` gallery. The new high-res assets were mapped specifically to this page's state.

### Video Playback Logic (Added 2026-02-10)
- **Manual Control**: The "Behind the Scenes" video on the About page no longer starts automatically.
- **Sound**: Sound is enabled by default (removing `muted`).
- **Interaction**: Users must click the video or the play button overlay to start/pause playback.
- **State Management**: Uses React `useState` and `useRef` to track playback status and control the HTML5 video element.
- **UI Overlay**: A dynamic Play/Pause button overlay appears on hover or when paused to indicate interactivity.

### File Naming Convention
New assets use descriptive suffixes (e.g., `-portrait`, `-new`, `-v2`) to distinguish them from previous assets without overwriting them, ensuring easy rollback and comparison.

## Variables & Environment
- **Public URL Root**: Assets are served relative to the root `/`.
- **Component Path**: `src/pages/about.tsx`
