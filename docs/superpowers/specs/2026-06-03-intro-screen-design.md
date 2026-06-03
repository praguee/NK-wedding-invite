# Intro Screen — Design Specification

**Date:** June 3, 2026
**Feature:** Interactive map unlock screen before the wedding invite

---

## 1. Concept

A full-screen interactive intro experience that guests must "unlock" before seeing the wedding invite. The invite loads blurred and locked underneath. A dark map overlays it with two city markers (Birmingham and Mumbai) and a draggable airplane. Guests drag the airplane from Birmingham to Mumbai to reveal the invite.

**Design language:** Apple-level dark minimalism + iOS 26 Liquid Glass effects.

---

## 2. Visual Treatment

### Map
- **Tile provider:** CartoDB Dark Matter (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
- **Initial view:** World map centered to show both Birmingham (UK) and Mumbai (India) — approximately centered at `(35°N, 35°E)`, zoom level 3
- **Map controls:** All disabled (no zoom buttons, no drag, no scroll zoom) — the map is purely decorative
- **Attribution:** Hidden (standard practice for branded experiences)

### Color Palette
- Background overlay: `rgba(0, 0, 0, 0.35)` over the map
- Birmingham city color: Rose — `#fb7185`
- Mumbai city color: Amber — `#fbbf24`
- Airplane: White `#ffffff`
- Typography: White at varying opacities
- Liquid glass: `rgba(255, 255, 255, 0.06)` base with strong blur

### City Markers
Each city has three layers:
1. **Pulse ring** — 40px circle, 1px border matching city color, animates scale 1→2 and opacity 1→0 infinitely (2s loop)
2. **Dot** — 10px filled circle, city color, subtle drop shadow glow
3. **Label pill** — Liquid glass pill floating 16px above the dot

**Label content:**
- Birmingham: `Birmingham  ·  Nidhi 💙`
- Mumbai: `Mumbai  ·  Parag ✨`

**Label style (Liquid Glass pill):**
```css
background: rgba(255, 255, 255, 0.06);
backdrop-filter: blur(48px) saturate(160%) brightness(1.1);
border: 1px solid rgba(255, 255, 255, 0.14);
border-radius: 100px;
box-shadow:
  0 0 0 0.5px rgba(255,255,255,0.06) inset,
  0 8px 24px rgba(0,0,0,0.5);
padding: 6px 14px;
font: 300 12px/1 system-ui;
letter-spacing: 0.04em;
color: rgba(255,255,255,0.85);
```

### Flight Path Arc
- Faint dashed SVG arc drawn between Birmingham and Mumbai screen coordinates
- Stroke: `rgba(255, 255, 255, 0.08)`, width 1, dasharray `4 6`
- Decorative only, not interactive

### Airplane
- Clean white SVG airplane icon (not emoji)
- Size: 32×32px
- Default rotation: angled ~30° toward Mumbai
- **Dragging state:** slight scale-up (1.15×), subtle white glow `drop-shadow(0 0 12px rgba(255,255,255,0.6))`
- Updates rotation dynamically to face direction of drag

### Instruction Bar
Bottom center of screen, liquid glass pill:
- Text: *"✈️  Drag the plane from Birmingham to Mumbai"*
- Font: 13px, weight 300, letter-spacing 0.05em
- Fades out once user starts dragging
- Returns if user releases without reaching Mumbai

### Background (main invite)
- `filter: blur(24px) brightness(0.4)` on the main page
- `pointer-events: none` (fully non-interactive while locked)
- Transition to `filter: none` on unlock (1.2s ease)

---

## 3. Interaction Mechanics

### Drag System
- Pointer events (pointerdown, pointermove, pointerup) on the airplane SVG
- Airplane follows cursor/finger precisely
- On release: check nearest city/zone
- Uses `map.latLngToContainerPoint()` for accurate geographic hit detection

### Hit Zones (radius in screen pixels)
| City / Zone | Coords | Radius | Action |
|---|---|---|---|
| Mumbai (target) | 19.076°N, 72.877°E | 60px | **UNLOCK** |
| Birmingham (start) | 52.486°N, -1.890°E | 50px | Snap back + "That's where Nidhi is! Drag east!" |
| London | 51.507°N, -0.127°W | 55px | Sarcastic message |
| Paris | 48.856°N, 2.352°E | 55px | Sarcastic message |
| Dubai | 25.204°N, 55.270°E | 60px | Sarcastic message |
| Delhi | 28.613°N, 77.209°E | 60px | Sarcastic message |
| Karachi | 24.860°N, 67.010°E | 55px | Sarcastic message |
| New York | 40.712°N, -74.006°W | 70px | Sarcastic message |
| Sydney | -33.868°S, 151.209°E | 70px | Sarcastic message |
| Tokyo | 35.676°N, 139.650°E | 65px | Sarcastic message |

If no zone hit: airplane snaps back to Birmingham with a gentle spring animation.

### "Mumbai → Birmingham" Direction Detection
If the airplane is dragged leftward (westward) from roughly Mumbai's longitude while near Mumbai's latitude, trigger the special Parag message instead of snapping back.

---

## 4. Sarcastic Messages

Each message appears as a **Liquid Glass card** sliding up from bottom:
- `backdrop-filter: blur(60px) saturate(180%)`
- Border: `1px solid rgba(255,255,255,0.12)`
- Prismatic top edge: gradient border `linear-gradient(90deg, #fb7185, #818cf8, #fbbf24)`
- Dismiss: auto-dismisses after 3.5s OR immediately on next drag

| Trigger | Message |
|---|---|
| London | "That's London! Nidhi actually moved to Birmingham 😄 Try a bit north-west!" |
| Paris | "Paris?! Très romantique — save that for the honeymoon 💕 The wedding is in Mumbai!" |
| Dubai | "Ooh, Dubai! Tempting… but the mandap is in Mumbai. Just a little further east! ✈️" |
| Delhi | "So close!! That's Delhi. Mumbai is just 1,400 km south. Almost there! 🎯" |
| Karachi | "Hmm, that's Karachi 👀 Mumbai is just across the border to the right →" |
| New York | "WRONG DIRECTION 😂 You've flown the wrong way across the planet. Turn around!" |
| Sydney | "You've overshot Mumbai by about 9,000 km 🦘 Come back!" |
| Tokyo | "Tokyo! Great sushi, wrong wedding venue 🍣 Mumbai is way west!" |
| Birmingham (snap back) | "Nidhi is waiting here! Drag the plane east toward Mumbai! →" |
| Mumbai → Birmingham | "Parag going to Birmingham?! He doesn't have a flight ticket yet 😂 The wedding is in Mumbai, not Birmingham!" |

---

## 5. Unlock Sequence

1. Airplane enters Mumbai hit zone (60px radius)
2. Airplane snaps smoothly to the Mumbai marker (spring animation, 300ms)
3. Mumbai marker pulse ring expands to full screen and fades (600ms)
4. Liquid glass success card rises from bottom:
   - "You found us! ✨" (large, light)
   - "Nidhi & Parag · December 4, 2026" (small, muted)
5. After 1.5s: success card fades, blur on main page dissolves (1.2s ease-out)
6. Intro overlay fades out (0.8s)
7. Main invite is fully revealed — guest can scroll normally
8. State saved to `sessionStorage` so refreshing doesn't re-show intro

---

## 6. Architecture

### Files
- `app/components/IntroScreen.tsx` — full intro screen client component
- `app/components/IntroScreen.module.css` — CSS module for complex animations
- `app/page.tsx` — wraps main content with IntroScreen overlay

### Dependencies
- `leaflet` + `@types/leaflet` — map rendering
- `react-leaflet` — React wrapper for Leaflet

### State Flow
```
sessionStorage 'invite_unlocked' === 'true'
  → true:  render main page directly (no intro)
  → false: render <IntroScreen onUnlock={...} /> over blurred main page
```

### IntroScreen Props
```typescript
interface IntroScreenProps {
  onUnlock: () => void
}
```

---

## 7. Mobile Considerations
- Touch events handled via `pointer events` API (works on mobile)
- Map view adjusted on small screens (zoom level 2)
- City labels scale down on mobile (font-size: 11px)
- Instruction text wraps on small screens
- Airplane hit target enlarged to 80px radius on touch devices

---

## 8. Performance
- Leaflet loaded only client-side (`dynamic(() => import(...), { ssr: false })`)
- Map tiles cached by browser
- No Mapbox API key required (CartoDB tiles are free)
- Intro screen code-split from main bundle
