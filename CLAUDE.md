# NK Wedding Invite — Project Guide

## What This Is
Wedding invite website for **Nidhi Kesarkar (bride)** and **Parag Khalde (groom)**.
- Wedding: **Friday, December 4, 2026 at 5:30 PM**
- Reception: **8:00 PM onwards**
- Venue: **Abhishek Farms, Narlepada, Yeoor Hills, Thane West, Maharashtra 400606**

## Live Site
- **Production:** https://nk-wedding-invite.vercel.app
- **Admin dashboard:** https://nk-wedding-invite.vercel.app/admin
- **Admin password:** stored in Vercel env var `ADMIN_PASSWORD` (set to Vadapav@774)

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL) — project `ccchzhvfndunfxvmgglh`
- **Hosting:** Vercel (auto-deploys on push to `main`)

## Project Structure
```
app/
  components/       — All 11 page sections as React components
  api/rsvp/         — POST endpoint for RSVP form submissions
  api/admin/verify/ — POST endpoint for admin password check
  admin/            — Password-protected admin dashboard
  page.tsx          — Main page assembling all components
  layout.tsx        — Root layout with metadata and Toaster
lib/
  constants.ts      — All wedding data (names, addresses, hotels, FAQ)
  supabase.ts       — Public Supabase client (used by client components)
  supabase-admin.ts — Admin Supabase client (server-side only)
  types.ts          — TypeScript interfaces (RSVP, RSVPFormData, AdminStats)
public/images/      — Add photos here (photo-1.jpg, photo-2.jpg, etc.)
docs/
  how-we-met.md     — Write your story here, then update Story.tsx
  superpowers/specs/2026-06-02-wedding-invite-site-design.md
  superpowers/plans/2026-06-02-wedding-invite-implementation.md
```

## Supabase Database
Table: `rsvps`
- `id` UUID, `name` TEXT, `email` TEXT, `plus_ones` INTEGER (0-5)
- `message` TEXT (nullable), `created_at`, `updated_at` TIMESTAMP
- Unique constraint on (name, email) — prevents duplicate RSVPs

## Deployment
Push to `main` → Vercel auto-deploys. That's it.

## What Still Needs to Be Done
- [ ] **"How we met" story** — write it in `docs/how-we-met.md`, then edit `app/components/Story.tsx`
- [ ] **Photos** — add engagement/pre-wedding photos to `public/images/` (name them photo-1.jpg, photo-2.jpg, etc.), then update the `photos` array in `app/components/Gallery.tsx`
- [ ] **Enable Supabase Realtime** — in Supabase dashboard, go to Database → Replication → enable `rsvps` table for realtime (needed for live guest book updates)
- [ ] **Row Level Security** — in Supabase, enable RLS on `rsvps` table and add policies: allow INSERT for all (anon), allow SELECT for all (anon)
- [ ] **Custom domain** (optional) — add in Vercel → Domains

## Key Files to Edit for Content Updates
| What to change | File |
|----------------|------|
| Names, addresses, hotels, FAQ | `lib/constants.ts` |
| "How we met" story | `app/components/Story.tsx` |
| Photos in gallery | `app/components/Gallery.tsx` |
| Event timeline | `app/components/Timeline.tsx` |
| Wedding/reception times | `lib/constants.ts` → `EVENT` |

## Local Development
```bash
npm run dev    # starts at http://localhost:3000
npm run build  # verify build before pushing
```

Requires `.env.local` with Supabase credentials (already set up).
