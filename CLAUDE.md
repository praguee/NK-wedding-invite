# NK Wedding Invite — Project Guide

## What This Is
Wedding invite website for **Nidhi Kesarkar (bride, from Mumbai/Thane India — currently in Birmingham UK for PhD in Economics at University of Birmingham)** and **Parag Khalde (groom, lives in Mumbai India)**.
- Wedding: **Friday, December 4, 2026 at 5:30 PM**
- Reception: **8:00 PM onwards**
- Venue: **Abhishek Farms, Narlepada, Yeoor Hills, Thane West, Maharashtra 400606**
- Wedding is on a **floating mandap in a pool**
- First met: **23 December 2022** | Started dating: **8 July 2023** (Parag asked her out in a shower — yes, really)

## Live Site
- **Production:** https://nk-wedding-invite.vercel.app
- **Admin dashboard:** https://nk-wedding-invite.vercel.app/admin
- **Games page:** https://nk-wedding-invite.vercel.app/games
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
    Navigation.tsx        — Fixed nav with gold top bar, lotus diamond logo, "N ✦ P", Games link
    Story.tsx             — "Our Story" — water/shower proposal, relationship counter from 8 Jul 2023
    JabWeMet.tsx          — "Jab We Met" — first meeting at Runwal Greens, wallet story, live counter from 23 Dec 2022
    InviteDetails.tsx     — Wedding & reception times, venue with glass-gold cards
    Gallery.tsx           — Editorial asymmetric photo grid with hover captions + lightbox
    Poll.tsx              — (REMOVED from main page — now only on /games)
    Timeline.tsx          — Vertical event schedule with coloured dots
    RSVPForm.tsx          — Casual RSVP form, 100-word message limit, auto-redirect to /games after submit
    GuestBook.tsx         — Fixed-height scrollable guest messages with coloured avatars per person
    Transportation.tsx    — Getting There section with venue photo background
    Addresses.tsx         — Bride (Birmingham) + Groom (Mumbai) home addresses
    Accommodations.tsx    — Compact hotel list with price dots
    ContactFAQ.tsx        — Parag & Raksha contact info
    IntroScreen.tsx       — Interactive map unlock (drag plane Birmingham→Mumbai)
    IntroScreen.module.css — Liquid glass, animations for intro screen
    SectionOrnament.tsx   — Reusable gold lotus diamond divider between sections
  api/
    rsvp/route.ts         — POST RSVP (uses Node.js https, NOT fetch — Supabase connectivity fix)
                            GET returns 405 (not a debug endpoint)
    admin/verify/route.ts — POST admin password check
    poll/route.ts         — GET/POST poll votes (Supabase poll_votes table)
  admin/page.tsx          — Password-protected dashboard (RSVP table, stats, CSV export)
  games/page.tsx          — Games page: Poll (Team Nidhi vs Team Parag) + Quiz (5 questions, Ginny cat)
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
  parag-avatar.png        — Parag Snapchat Bitmoji (poll + intro screen markers)
  nidhi-crop.png          — Nidhi Bitmoji face crop (intro screen markers)
  nidhi-stand.png         — Nidhi Bitmoji standing full body (poll voting card)
  nidhi-full.png          — Nidhi Bitmoji full body on map (backup)
  couple-avatar.png       — Couple Bitmoji dancing (intro unlock success card)
  ginny-idle.jpg          — Ginny cat sprawled (quiz intro "hosted by Ginny")
  ginny-win.jpg           — Ginny cat cute wide-eyed (quiz WIN result)
  ginny-lose.jpg          — Ginny cat judgy side-eye (quiz LOSE result)
  gallery-diwali.jpg      — Diwali B&W couple photo
  gallery-agentjacks.jpg  — Agent Jack's bar, Birmingham
  gallery-wish.jpg        — Nidhi's wish written in Birmingham (converted from HEIC)
  gallery-longdistance.jpg — Long distance started Sept 23 2025 (converted from HEIC)
```

## Page Section Order (Main Page)
1. Hero (cover photo, countdown, gold RSVP button)
2. Our Story (shower proposal, relationship counter from 8 Jul 2023)
3. Jab We Met (first meeting at Runwal Greens, wallet story, counter from 23 Dec 2022)
4. You're Invited (wedding/reception times, venue)
5. Gallery (editorial asymmetric layout, hover captions, lightbox)
6. Schedule (vertical timeline: 5PM, 5:30PM, 7:30PM, 8PM)
7. Will You Be There? (RSVP form — after submit, redirects to /games)
8. Guest Book (scrollable messages, coloured avatars)
9. Getting There (venue photo background, valet parking, auto-rickshaw joke)
10. Where to Find Us (Addresses)
11. Where to Stay (Hotels)
12. Questions? (Contact: Parag 9819048377, Raksha 9137540056)

## Games Page (/games)
- **Poll:** Team Nidhi vs Team Parag live voting — auto-advances to quiz after 3s countdown
- **Quiz:** 5 questions about the couple, Ginny cat reveals result
  - Win (60%+): Ginny wide-eyed + caricature CTA ("show Abhishek at reception")
  - Lose: Ginny judgy + "participation trophy" message
  - Artist: @joyofcaricaturestudio (https://www.instagram.com/joyofcaricaturestudio)
- **Flow:** RSVP submit → auto-redirect to /games (2.5s) → Poll → Quiz (auto-advance after 3s)
- **Change vote:** "Change vote" button lets guests re-vote
- Poll key: `nk_poll_vote_v3` in localStorage

## Supabase Database
### Table: `rsvps`
- `id` UUID, `name` TEXT, `email` TEXT (nullable, default ''), `plus_ones` INTEGER (0-5)
- `message` TEXT (nullable, max 100 words), `created_at`, `updated_at` TIMESTAMP
- Unique constraint on `name` only (email removed from form)

### Table: `poll_votes`
- `id` UUID, `side` TEXT ('bride' | 'groom'), `created_at` TIMESTAMP
- RLS enabled with anon INSERT + SELECT policies
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
  - Birmingham: Nidhi's cropped Bitmoji face (nidhi-crop.png)
  - Mumbai: Parag's Bitmoji face (parag-avatar.png)
  - Success unlock: Couple Bitmoji (couple-avatar.png)
- **Airplane:** SVG, z-index 20, draggable via pointer events
- **Ghost plane:** Animated SVG animateMotion flying Birmingham→Mumbai arc continuously
- **Zone detection:** Geographic lat/lng bounds (not pixel distance) — 18 sarcastic zones
- **Mobile fix:** `window.innerWidth/Height` set explicitly on map container for iOS Safari
- **FitBounds:** Portrait `padding: [8, 30]`, landscape `padding: [55, 60]`

## Gallery
- **Layout:** Editorial asymmetric grid — tall Diwali (col-span-5), 2 stacked center (col-span-4), tall long-distance (col-span-3)
- **Hover:** Image zooms in, caption slides up, ↗ button
- **Lightbox:** Full-screen with prev/next navigation
- **Photo captions:** Witty short lines per photo

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
- [ ] **"Jab We Met" story** — add the full story text to `app/components/JabWeMet.tsx` (placeholder text currently)
- [ ] **More quiz questions** — Parag said he'd provide more; add to `QUESTIONS` array in `app/games/page.tsx`
- [ ] **More gallery photos** — add to `public/images/` and update `PHOTOS` array in `app/components/Gallery.tsx`
- [ ] **Enable Supabase Realtime** — Dashboard → Database → Replication → enable `rsvps` table
- [ ] **Custom domain** (optional) — Vercel → Domains

## Key Files to Edit for Content Updates
| What to change | File |
|---|---|
| Couple names, addresses, hotels | `lib/constants.ts` |
| "Jab We Met" story text | `app/components/JabWeMet.tsx` |
| "Our Story" text | `app/components/Story.tsx` |
| Photos in gallery | `app/components/Gallery.tsx` → `PHOTOS` array |
| Event schedule times | `app/components/Timeline.tsx` |
| Wedding/reception times | `lib/constants.ts` → `EVENT` |
| Sarcastic messages on map | `app/components/IntroScreen.tsx` → `GEO_ZONES` |
| Quiz questions | `app/games/page.tsx` → `QUESTIONS` array |
| Poll vote key (reset votes) | `app/games/page.tsx` → `POLL_KEY` constant |
