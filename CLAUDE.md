# NK Wedding Invite — Project Guide

## What This Is
Wedding invite website for **Nidhi Kesarkar (bride, lives in Birmingham UK)** and **Parag Khalde (groom, lives in Mumbai India)**.
- Wedding: **Friday, December 4, 2026 at 5:30 PM**
- Reception: **8:00 PM onwards**
- Venue: **Abhishek Farms, Narlepada, Yeoor Hills, Thane West, Maharashtra 400606**
- Wedding is on a **floating mandap in a pool**
- First met: **23 December 2022** | Started dating: **8 July 2023** (Parag asked her out in a shower — yes, really)

## Live Site
- **Production:** https://nk-wedding-invite.vercel.app
- **Admin dashboard:** https://nk-wedding-invite.vercel.app/admin
- **Admin password:** `Vadapav@774` (stored in Vercel env var `ADMIN_PASSWORD`)

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom CSS (globals.css)
- **Database:** Supabase (PostgreSQL) — project ref `ccchzhvfndunfxvmggih`
- **Supabase URL:** `https://ccchzhvfndunfxvmggih.supabase.co` ← NOTE: ends in `ggih` not `gglh`
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Map:** Leaflet.js + CartoDB Dark Matter tiles (intro screen)

## Project Structure
```
app/
  components/
    Hero.tsx              — Full-screen cover photo hero with countdown + mandala watermark
    Navigation.tsx        — Fixed nav with gold top bar, lotus diamond logo, "N ✦ P"
    Story.tsx             — "Our Story" — water/shower proposal, relationship counter from 8 Jul 2023
    JabWeMet.tsx          — "Jab We Met" — first meeting, live counter from 23 Dec 2022
    InviteDetails.tsx     — Wedding & reception times, venue with glass-gold cards
    Gallery.tsx           — Photo grid with lightbox (photos to be added)
    Poll.tsx              — Live "Pick a side" poll (Team Nidhi vs Team Parag), Supabase realtime
    Timeline.tsx          — Vertical event schedule with coloured dots
    RSVPForm.tsx          — Casual RSVP form, 100-word message limit, gold submit button
    GuestBook.tsx         — Fixed-height scrollable guest messages with coloured avatars
    Transportation.tsx    — Getting There section with venue photo background
    Addresses.tsx         — Bride (Birmingham) + Groom (Mumbai) home addresses
    Accommodations.tsx    — Compact hotel list with price dots
    ContactFAQ.tsx        — Parag & Raksha contact info
    IntroScreen.tsx       — Interactive map unlock (drag plane Birmingham→Mumbai)
    IntroScreen.module.css — Liquid glass, animations for intro screen
    SectionOrnament.tsx   — Reusable gold lotus diamond divider between sections
  api/
    rsvp/route.ts         — POST RSVP (uses Node.js https, NOT fetch — Supabase connectivity fix)
    admin/verify/route.ts — POST admin password check
    poll/route.ts         — GET/POST poll votes
  admin/page.tsx          — Password-protected dashboard (RSVP table, stats, CSV export)
  page.tsx                — Main page with IntroScreen overlay logic + section ordering
  layout.tsx              — Root layout with Leaflet CSS + Toaster
  globals.css             — Indian jali background pattern, warm ivory palette, glass-gold class
lib/
  constants.ts            — All wedding data (names, addresses, hotels)
  supabase.ts             — Public client (NEXT_PUBLIC_ keys only — client-safe)
  supabase-admin.ts       — Admin client (service role key — server-side only, NEVER import in client components)
  types.ts                — TypeScript interfaces
public/images/
  hero-cover.jpg          — Silhouette sunset cover photo (hero background)
  venue-cover.jpg         — Abhishek Farms venue photo (Transportation section)
  parag-avatar.png        — Parag Snapchat Bitmoji (poll + intro screen)
  nidhi-crop.png          — Nidhi Bitmoji face crop (intro screen markers)
  nidhi-stand.png         — Nidhi Bitmoji standing full body (poll)
  nidhi-full.png          — Nidhi Bitmoji full (backup)
  couple-avatar.png       — Couple Bitmoji dancing (intro unlock success card)
```

## Page Section Order
1. Hero (cover photo, countdown, gold RSVP button)
2. Our Story (shower proposal, relationship counter from 8 Jul 2023)
3. Jab We Met (first meeting, counter from 23 Dec 2022 — story coming soon)
4. You're Invited (wedding/reception times, venue)
5. Gallery (photo grid — photos to be added)
6. Pick a Side (Team Nidhi vs Team Parag live poll)
7. Schedule (vertical timeline: 5PM, 5:30PM, 7:30PM, 8PM)
8. Will You Be There? (RSVP form)
9. Guest Book (scrollable messages)
10. Getting There (Transportation — venue photo background)
11. Where to Find Us (Addresses)
12. Where to Stay (Hotels)
13. Questions? (Contact: Parag 9819048377, Raksha 9137540056)

## Supabase Database
### Table: `rsvps`
- `id` UUID, `name` TEXT, `email` TEXT (nullable, default ''), `plus_ones` INTEGER (0-5)
- `message` TEXT (nullable), `created_at`, `updated_at` TIMESTAMP
- Unique constraint on `name` only (email removed from form)

### Table: `poll_votes`
- `id` UUID, `side` TEXT ('bride' | 'groom'), `created_at` TIMESTAMP
- Run `ALTER TABLE poll_votes REPLICA IDENTITY FULL;` to enable realtime

### CRITICAL: RSVP API uses Node.js `https` module
The `/api/rsvp/route.ts` uses Node.js built-in `https` (NOT `fetch`) because Vercel's Node 18 undici/fetch has TLS issues reaching Supabase. Do NOT switch back to fetch.

## Design System
- **Palette:** Warm ivory `#FFFDF6` body, gold `#C49A28`, burgundy `#8B2252`
- **Background pattern:** SVG Indian jali (diamond lattice) at 13% opacity in globals.css
- **Glass effect:** `.glass-gold` class — `blur(48px) saturate(200%)`, white borders, 4-layer shadow
- **Ornament:** `<SectionOrnament />` — gold lotus diamond divider, use at top of sections
- **Section backgrounds:** `bg-white` → `#FFFDF6`, `bg-slate-50` → `#FAF3E0` (overridden in CSS)

## Intro Screen (Interactive Map)
- **Library:** Leaflet.js (loaded client-side only via dynamic import)
- **Tiles:** CartoDB Dark Matter (`cartocdn.com/dark_all`)
- **City markers:** Float ABOVE map point (z-index 25, transform: translate(-50%, -100%))
- **Airplane:** SVG, z-index 20, draggable via pointer events
- **Zone detection:** Geographic lat/lng bounds (not pixel distance)
- **Success:** Couple Bitmoji image shown when plane reaches Mumbai
- **Mobile fix:** `window.innerWidth/Height` set explicitly on map container for iOS Safari
- **FitBounds:** Portrait `padding: [8, 30]`, landscape `padding: [55, 60]`

## Contact Numbers
- **Parag Khalde:** +91 9819048377
- **Raksha Kesarkar (Bride's Sister):** +91 9137540056

## Deployment
```bash
git push origin main  # Vercel auto-deploys
```

## Local Development
```bash
npm run dev    # http://localhost:3000
npm run build  # verify before pushing
```
`.env.local` is already set up with Supabase credentials.

## What Still Needs to Be Done
- [ ] **"Jab We Met" story** — write it and update `app/components/JabWeMet.tsx`
- [ ] **Photos** — add engagement/pre-wedding photos to `public/images/` then update `app/components/Gallery.tsx`
- [ ] **Enable Supabase Realtime** — Dashboard → Database → Replication → enable `rsvps` table
- [ ] **Row Level Security** — enable RLS on `rsvps` + `poll_votes` tables, add anon INSERT + SELECT policies
- [ ] **Custom domain** (optional) — Vercel → Domains

## Key Files to Edit for Content Updates
| What to change | File |
|---|---|
| Couple names, addresses, hotels | `lib/constants.ts` |
| "Jab We Met" story text | `app/components/JabWeMet.tsx` |
| "Our Story" text | `app/components/Story.tsx` |
| Photos in gallery | `app/components/Gallery.tsx` |
| Event schedule times | `app/components/Timeline.tsx` |
| Wedding/reception times | `lib/constants.ts` → `EVENT` |
| Sarcastic messages on map | `app/components/IntroScreen.tsx` → `GEO_ZONES` |
| Poll options text | `app/components/Poll.tsx` |
