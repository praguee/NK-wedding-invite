# NK Wedding Invite Website - Design Specification

**Date:** June 2, 2026  
**Event Date:** December 4, 2026 (Friday)  
**Expected Guests:** 350-400  
**Couple:** Nidhi Deepak Kesarkar (Bride) & Parag Khalde (Groom)

---

## 1. Overview

A modern, dynamic wedding invite website for Nidhi & Parag's Hindu Maharashtrian wedding celebration. The site will serve as a centralized hub for guests to learn about the wedding, RSVP, view the guest book, find accommodations, and access logistics information.

**Design Philosophy:** Apple-inspired aesthetic — minimalist, elegant, smooth animations, lots of whitespace, beautiful typography, high-quality photography.

**Key Constraint:** Single maintainer (Parag) with occasional updates.

---

## 2. Page Structure & Sections

The website is a single-page scrollable experience with 11 distinct sections:

### 2.1 Hero Section
- **Content:** Couple's names "Nidhi & Parag", wedding date (December 4, 2026), countdown timer
- **Design:** Full-width hero with gradient background, large typography, centered layout
- **Interactions:** Countdown timer updates every second, showing "X days, Y hours, Z minutes until the wedding"

### 2.2 Our Story
- **Content:** "How we met" narrative with 3-5 engagement/pre-wedding photos
- **Layout:** Text on left, rotating photo carousel on right (or stacked on mobile)
- **Design:** Warm, personal tone with Apple-style minimalism

### 2.3 Invite Details
- **Content:**
  - Wedding date & time: December 4, 2026, 5:30 PM
  - Reception date & time: December 4, 2026, 8:00 PM onwards
  - Venue address: Abhishek Farms, Narlepada, Yeoor Hills, Thane West, Maharashtra 400606
- **Design:** Clean card layout with icons (🕐, 📍)

### 2.4 House Addresses
- **Content:**
  - Bride's address: Nidhi Deepak Kesarkar, Room no 2, Plot no 70, Jai Milind CHS, Shivai Nagar, Thane West, THANE, MAHARASHTRA 400606
  - Groom's address: Parag Khalde, Flat no 41, 2nd floor, C wing, Rajhans Society, Vishwakarma Nagar, Mulund West, Mumbai, 400080
- **Design:** Two-column layout (or stacked on mobile) with clear labels
- **Functionality:** Addresses are clickable to open Google Maps

### 2.5 Gallery
- **Content:** 10-15 engagement & pre-wedding photos (to be provided by Parag)
- **Layout:** Grid layout (3 columns on desktop, 1-2 on mobile) with smooth hover effects
- **Interactions:** Click to open lightbox/modal for full-size viewing
- **Design:** Apple-style image showcase with subtle shadows and zoom animations

### 2.6 Accommodations
- **Content:** Curated list of 5-7 high-quality hotels in Thane and Mulund
- **Information per hotel:** Name, area, distance to venue, price range indicator, booking link (Google Maps or hotel website)
- **Design:** Card-based layout with clean typography, no cheap hotels included
- **Examples:** 5-star and 4-star hotels only (e.g., Four Seasons, JW Marriott, The Ritz, etc.)

### 2.7 Transportation & Logistics
- **Content:**
  - Venue location with embedded Google Map
  - Parking information
  - Local transportation options (taxis, auto-rickshaws, local buses)
  - Pickup options (if applicable)
  - Driving directions link
- **Design:** Map embed + text information in clean cards

### 2.8 Timeline
- **Content:** Event schedule for December 4, 2026
  - 5:30 PM - Wedding ceremony
  - 8:00 PM - Reception starts
- **Design:** Vertical timeline visualization with times and event names
- **Future:** Can be easily updated by Parag if timing changes

### 2.9 RSVP Form
- **Fields:**
  - Name (required, text input)
  - Email (required, email input)
  - Number of Plus-Ones (required, number input, 0-5 range)
  - Message (optional, textarea, max 500 characters)
- **Validation:** All required fields must be filled before submission
- **Success Behavior:** Form clears, success message shown ("Thank you for RSVPing! Your message will appear in the guest book shortly")
- **Error Handling:** Show validation errors for empty/invalid fields
- **Database:** Submissions stored in Supabase PostgreSQL database with timestamp

### 2.10 Guest Book
- **Content:** Displays all guest RSVP messages in chronological order (newest first)
- **Per Entry:** Guest name, message, timestamp (e.g., "Jun 2, 2026 at 3:45 PM")
- **Design:** Clean card layout, each message has plenty of whitespace
- **Interactions:** Messages load in real-time as new RSVPs come in (optional live refresh)
- **Visibility:** Public — all guests can see all messages

### 2.11 Contact & FAQ
- **Contact Info:**
  - Primary contacts: Parag Khalde & Raksha Kesarkar (bride's sister)
  - Phone: +91 9137540056
  - Brief note: "Have questions? Reach out to us!"
- **FAQ Section:** (to be populated with common questions Parag anticipates)
  - Example: "Can I bring a plus-one?", "Where should I park?", "What time should I arrive?", etc.
- **Design:** Q&A accordion layout for clean, expandable presentation

---

## 3. Technical Architecture

### 3.1 Frontend
- **Framework:** Next.js (React) for smooth animations and modern UI
- **Styling:** Tailwind CSS for Apple-inspired design system
- **Components:** Modular React components for each section (Hero, Story, Gallery, RSVP, etc.)
- **Animations:** Smooth scroll animations, fade-in effects, hover transitions
- **Responsiveness:** Mobile-first design, fully responsive across all devices

### 3.2 Backend
- **API Routes:** Next.js API routes (`/api/rsvp`) to handle form submissions
- **Database:** Supabase (PostgreSQL) with one main table: `rsvps`
- **Database Schema:**
  ```
  Table: rsvps
  - id (UUID, primary key)
  - name (text, required)
  - email (text, required)
  - plus_ones (integer, required, 0-5)
  - message (text, optional, max 500 chars)
  - created_at (timestamp, auto)
  - updated_at (timestamp, auto)
  ```

### 3.3 Hosting & Deployment
- **Hosting:** Vercel (free tier, seamless with Next.js)
- **Repository:** GitHub (source of truth)
- **Deployment Flow:** git push to main → Vercel auto-deploys
- **Domain:** Can use GitHub Pages subdomain or custom domain (optional)
- **SSL:** Automatic with Vercel

### 3.4 Admin Dashboard (for Parag)
- **Location:** Private page at `/admin` (password-protected)
- **Functionality:**
  - View all RSVPs in a table (name, email, plus-ones, message)
  - Sort by response date or name
  - Count total confirmed guests + total plus-ones
  - Export guest list as CSV for printing/reference
  - View real-time guest book messages
  - Simple stats: "X guests have RSVP'd, Y total plus-ones"

---

## 4. Key Features & Interactions

### 4.1 Countdown Timer
- Displays "X days, Y hours, Z minutes until the wedding"
- Updates every second
- Placed prominently in hero section
- Stops/shows "Today's the day!" on December 4, 2026

### 4.2 Photo Gallery
- Lazy-loading for performance
- Smooth grid layout with hover zoom effects
- Lightbox modal for full-size viewing
- Swipe navigation on mobile devices
- Touch-friendly

### 4.3 RSVP Form
- Real-time client-side validation (email format, number range)
- Server-side validation before database insertion
- Prevents duplicate submissions (check email + name combo)
- Success notification + confetti animation (optional nice-to-have)
- Email confirmation sent to guest upon RSVP

### 4.4 Guest Book
- Messages display in real-time (optional WebSocket for live updates)
- Infinite scroll or pagination (whichever feels smoother)
- No spam/moderation needed initially, but can add if needed later

### 4.5 Map Integrations
- Google Maps embed for venue location
- Clickable links to navigate to bride/groom addresses on Google Maps
- Clickable links to hotel booking pages

---

## 5. Design System (Apple-Inspired)

### 5.1 Color Palette
- **Primary:** Soft gradient (purples/blues) for hero section
- **Neutral:** White, off-white (#f5f5f5), light gray (#e0e0e0)
- **Text:** Dark gray (#333), medium gray (#666)
- **Accents:** Subtle pastels for card backgrounds
- **No bright colors** — keep it elegant and minimalist

### 5.2 Typography
- **Heading Font:** Clean sans-serif (e.g., Inter, Helvetica Neue, or system font)
- **Body Font:** Same sans-serif for consistency
- **Font Sizes:**
  - H1 (names): 48px-64px, light weight (300)
  - H2 (section titles): 32px, light weight (300)
  - H3 (subsections): 24px, medium weight (500)
  - Body text: 16px-18px, normal weight (400)
  - Small text: 14px, medium weight (500)

### 5.3 Spacing & Layout
- Lots of whitespace (generous padding/margins)
- Max content width: 1200px on desktop
- Section padding: 60px vertical, 20px horizontal (mobile)
- Card border radius: 8px-12px
- Subtle shadows (shadow-sm to shadow-md only)

### 5.4 Animations
- Scroll animations: Fade-in, slide-up as sections come into view
- Hover effects: Subtle scale, color change (no jarring transitions)
- Transitions: 300-500ms duration for smoothness
- No overly flashy animations — elegant and understated

---

## 6. Content Management

### 6.1 What Parag Will Manage
- **"How we met" story:** Simple markdown text file
- **Photos:** Upload image files (JPG/PNG) to gallery folder
- **Accommodations list:** Editable JSON or markdown file with hotel details
- **FAQ answers:** Markdown file with Q&A pairs
- **Timeline updates:** If timing changes, update a simple config file

### 6.2 Deployment Workflow
1. Edit content files locally in the repo
2. Add/replace images in the `/public/images/` folder
3. `git commit` and `git push`
4. Vercel auto-deploys within 1-2 minutes
5. Check the live site

---

## 7. Error Handling & Validation

### 7.1 Form Validation
- **Client-side:** Real-time feedback for invalid inputs (e.g., "Email format invalid")
- **Server-side:** Double-check all validations before inserting into database
- **Duplicate prevention:** If same name + email exists, show "You've already RSVP'd" message

### 7.2 Network Errors
- Show user-friendly error message if form submission fails
- Provide "Retry" button
- Log errors to console for debugging

### 7.3 Database Errors
- Graceful fallback messages (don't expose raw errors to users)
- Retry logic for transient failures

---

## 8. Performance & SEO

### 8.1 Performance
- Image optimization (automatic via Next.js Image component)
- Code splitting (each section lazy-loaded)
- Minimal JS bundle
- Fast initial load (target: < 3 seconds on 4G)

### 8.2 SEO
- Meta tags (title, description) for social sharing
- Open Graph tags for preview when shared on WhatsApp, Facebook, etc.
- Mobile-friendly (responsive design)
- Schema markup (optional) for structured data

---

## 9. Security & Privacy

### 9.1 RSVP Data
- All RSVP data (names, emails, messages) stored securely in Supabase
- HTTPS encryption in transit
- No data sharing with third parties

### 9.2 Admin Dashboard
- Password-protected admin page (basic auth with Parag's password)
- Only Parag can view guest data

### 9.3 Guest Book
- Messages are public, but guest emails are NOT displayed publicly (only names)

---

## 10. Timeline & Next Steps

1. **Design Approval:** ✅ Approved (this spec)
2. **Implementation:** Build all components and integrate with Supabase
3. **Content Gathering:** Parag provides photos, "How we met" story, FAQ details
4. **Testing:** Manual testing on mobile and desktop
5. **Deployment:** Push to Vercel, go live
6. **Buffer Time:** Completed well before December 4, 2026

---

## 11. Future Enhancements (Out of Scope for V1)

- Email invitations sent to specific guest list
- Dietary preferences tracking
- Gift registry integration
- Live streaming of ceremony
- Video message submissions from guests
- Multiple language support

---

## Approval Checklist

- [x] Page structure and sections
- [x] Technical architecture (Next.js + Supabase + Vercel)
- [x] Key features (RSVP, guest book, gallery, etc.)
- [x] Design aesthetic (Apple-inspired, modern, smooth)
- [x] Content management workflow
- [x] Admin dashboard functionality
- [x] Error handling and validation
- [x] Timeline and dependencies
