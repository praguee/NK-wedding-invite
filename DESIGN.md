---
name: NK Wedding Invite
description: A floating mandap, two Mumbaikars, and a love story that crossed continents — digital wedding invitation for Nidhi & Parag, December 4 2026.
colors:
  gold: "#C49A28"
  gold-light: "#D4AA38"
  gold-muted: "#C49A2830"
  ivory: "#FFFDF6"
  ivory-warm: "#FAF3E0"
  burgundy: "#8B2252"
  text-deep: "#2A1200"
  text-warm: "#5C3A2E"
  text-mid: "#7C5A3A"
  text-muted: "#9C7A5A"
  text-whisper: "#C4B09A"
  surface-dark: "#0D0600"
typography:
  display:
    fontFamily: "system-ui, Georgia, serif"
    fontSize: "clamp(48px, 11vw, 92px)"
    fontWeight: 100
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "system-ui, Georgia, serif"
    fontSize: "clamp(36px, 6vw, 48px)"
    fontWeight: 100
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.09em"
rounded:
  full: "100px"
  2xl: "16px"
  xl: "12px"
  md: "8px"
  sm: "6px"
spacing:
  section: "96px"
  card: "32px"
  gap: "24px"
  tight: "16px"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, #B8850A, #E8C547, {colors.gold})"
    textColor: "{colors.text-deep}"
    rounded: "{rounded.full}"
    padding: "13px 44px"
  button-primary-hover:
    backgroundColor: "linear-gradient(135deg, #C49A28, #F0D060, #D4AA38)"
    textColor: "{colors.text-deep}"
    rounded: "{rounded.full}"
    padding: "13px 44px"
  button-ghost:
    backgroundColor: "{colors.gold-muted}"
    textColor: "{colors.gold}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  card-glass:
    backgroundColor: "rgba(255,253,248,0.52)"
    textColor: "{colors.text-warm}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card}"
  input-default:
    backgroundColor: "rgba(255,253,246,0.7)"
    textColor: "{colors.text-warm}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
---

# Design System: NK Wedding Invite

## 1. Overview

**Creative North Star: "The Water Temple"**

This is a site built around a single extraordinary image: two people exchanging vows on a floating mandap, surrounded by water, flowers, and firelight. Every design decision draws from that image — the warm gold of oil lamps on still water, the frosted glass of reflections, the slow ritual weight of ceremony. The system is intimate before it is impressive. It does not announce itself; it pulls you in.

The palette glows from within rather than dazzling from without. Surfaces are warm ivory — the colour of candlelight on white cloth — with gold used sparingly as a signal of importance: a name, a button, a divider. The jali diamond lattice sits beneath everything at near-invisibility, a cultural anchor that rewards close attention. Text is light-weight and airy, giving the words room to breathe. Spacing is generous; content never crowds.

This system explicitly rejects all-white, cold editorial minimalism — the kind of luxury that signals restraint over warmth. This wedding has Indian cultural identity and a love story with real texture. Stripping it to cool geometry would erase that. This is not a SaaS landing page with warm colours applied over the top. The Indian identity — the lotus, the jali, the floating mandap — is structural, not decorative.

**Key Characteristics:**
- Warm ivory body with a near-invisible golden jali pattern
- Gold is the single accent; used at ≤15% surface area, its rarity is the point
- Frosted glass cards ("glass-gold") float content above the textured background
- Typography is extralight at large sizes — names feel carved, not printed
- Cinematic hero with full-bleed parallax; all other sections are essentially flat
- Indian ornamental motifs (lotus, mandala, diamond) used authentically, never pastiche

## 2. Colors: The Candlelit Pool

The palette is a single fire source reflected on dark water: deep warm gold, warm ivory, a whisper of burgundy, and graduated brown-warm text tones. There is no cool colour in the system.

### Primary
- **Temple Gold** (`#C49A28`): The single accent. Used on CTAs, active nav states, section ornaments, icon fills, hover transitions. Applied at rest as a border, a shimmer, a ring — rarely as a solid fill. Its restraint is intentional: every gold element catches the eye because the surrounding surface is neutral.
- **Shimmer Gold** (`#D4AA38`): Lighter shift used in gradient endpoints and on hover. Never standalone — always in gradient company with Temple Gold.

### Secondary
- **Ceremony Burgundy** (`#8B2252`): Reserved for the bride's map pin, link hover states, and rare accent moments. Signals intimacy and occasion without competing with gold.

### Neutral
- **Warm Ivory** (`#FFFDF6`): The body canvas. Every `bg-white` overrides to this. The subtle warmth is what separates it from clinical white.
- **Golden Cream** (`#FAF3E0`): Alternate-section background. Used on `bg-slate-50` overrides. Slightly more golden — shifts the temperature one step warmer for visual rhythm between sections.
- **Deep Brown** (`#2A1200`): Button text on gold fills. The darkest warm tone.
- **Story Brown** (`#5C3A2E`): Primary body text. Warm, readable, never cold black.
- **Warm Taupe** (`#7C5A3A`): Secondary text, nav links at rest, address body.
- **Dusty Sienna** (`#9C7A5A`): Tertiary text — labels, captions, metadata.
- **Whisper Gold** (`#C4B09A`): Decorative text, word counters at rest, dividers. Barely visible on ivory.
- **Void** (`#0D0600`): Favicon background, dark overlays (hero gradients approach this tone). As dark as it gets — not black, still warm.

### Named Rules
**The One Voice Rule.** Gold is used on ≤15% of any given screen. Its restraint is the source of its power. When everything glows gold, nothing does.

**The No Cold Rule.** There are no greys, blues, or neutral blacks in this system. Every colour is warm. A `#666` text colour would read as intrusive; reach for `#9C7A5A` instead.

## 3. Typography

**Display Font:** system-ui (with Georgia, serif fallback on devices that resolve it elegantly)
**Body Font:** system-ui, sans-serif
**Label/UI Font:** system-ui, sans-serif — tightened tracking, uppercase

**Character:** The type pairing leans heavily on weight contrast rather than font contrast. Display sizes use weight 100 (extralight) at large scales — the names "Nidhi" and "Parag" feel engraved. UI labels and navigation use tight tracking at weight 500 to create ceremonial formality without needing a custom display font. The system font stack means reliable rendering across Indian and international devices.

### Hierarchy
- **Display** (weight 100, `clamp(48px, 11vw, 92px)`, line-height 1.15): The couple's names only. Full-bleed hero, gold shimmer treatment. Nothing else uses this size.
- **Headline** (weight 100, `clamp(36px, 6vw, 48px)`, line-height 1.2): Section headings ("Will you be there?", "The Way of Water"). One per section. Extralight preserves airiness at mid-size.
- **Title** (weight 400, 16px, line-height 1.6): Card headers, hotel names, timeline event titles. Normal weight provides contrast with surrounding extralight headlines.
- **Body** (weight 300, 16px, line-height 1.6, max ~65ch): Story paragraphs, FAQ answers, guest book messages. Light weight, generous line-height, story brown (`#5C3A2E`).
- **Label** (weight 500, 12px, letter-spacing 0.09–0.22em, uppercase): Navigation links, section sub-labels ("Together with their families"), form field labels, countdown units. The caps + tracking creates ceremonial formality.

### Named Rules
**The Extralight Headline Rule.** Section headings are always weight 100. Never bold a section title. The lightness is what gives the words room to carry meaning. A bold "Will you be there?" feels like advertising; a light one feels like an invitation.

## 4. Elevation

This system uses a cinematic two-tier approach: dramatic layered shadows on the hero only; flat surfaces with glass-effect cards everywhere else.

The hero is the only screen element with deep, multi-layer shadow — four gradient overlays create a cinematic vignette (dark top, very dark bottom, warm radial centre, mobile-specific reinforcement). This is where the drama lives. Once a user scrolls past the hero, the page settles into near-flat warmth.

Content cards use the `.glass-gold` treatment: frosted glass (blur(48px) saturate(200%)) with layered internal reflections and a subtle gold rim. This creates perceived depth through light physics — the blurred background shows through, giving a sense of floating — rather than through hard shadows. On hover, cards rise 4px with a soft gold ambient glow.

### Shadow Vocabulary
- **Hero cinematic overlay** (`linear-gradient(to top, rgba(5,2,15,0.97) 0%... transparent 75%)`): The only structural shadow in the system. Dark at top and bottom, warm radial centre. Creates the floating-mandap-at-night atmosphere.
- **Glass card hover** (`0 12px 40px rgba(196,154,40,0.16)`): Warm gold ambient glow on card hover. Not a drop shadow — an aura.
- **Glass card rest** (layered inset + `0 16px 48px rgba(0,0,0,0.08)` + `0 0 0 0.5px rgba(196,154,40,0.12)`): Four-layer system — top specular, glass edge, ambient shadow, gold rim. Reads as frosted glass, not as a box.
- **RSVP button** (`0 6px 24px rgba(196,154,40,0.45)`): Warm gold halo beneath the primary CTA.

### Named Rules
**The Flat-by-Default Rule.** Outside the hero, surfaces are flat at rest. Shadows appear only as response to hover or the glass-gold treatment. A section background with a box-shadow would feel out of system.

## 5. Components

### Buttons
The primary button is the warmest element on the page — a three-stop gold gradient that reads like a lit surface.

- **Shape:** Fully rounded pill (100px radius). Never rectangular, never sharp.
- **Primary:** Gold gradient (`#B8850A → #E8C547 → #C49A28`), deep brown text (`#2A1200`), 13px top/bottom 44px left/right, font-weight 700, 12px tracking-widest uppercase. Gold halo shadow at rest (`0 6px 24px rgba(196,154,40,0.45)`).
- **Hover / Focus:** Scale 1.06 via Framer Motion spring (stiffness 380, damping 18). No colour shift — scale alone is the feedback.
- **Tap:** Scale 0.96. Immediate tactile response.
- **Ghost / Pill (nav links):** Gold-tinted bg (`rgba(196,154,40,0.1)`), gold border (`rgba(196,154,40,0.25)`), gold text, rounded-full, 6px 12px padding. Used for Menu and Trivia nav links — secondary CTAs that don't compete with primary.
- **Disabled:** 50% opacity. No other change.

### Cards / Containers
The glass-gold card is the signature container of the system.

- **Corner Style:** Gently rounded (16px — `rounded-2xl`). Never sharp, never a full circle.
- **Background:** `rgba(255,253,248,0.52)` — translucent warm white. Content behind shows through.
- **Backdrop:** `blur(48px) saturate(200%) brightness(1.04)` — the frosted glass depth.
- **Border:** `1px solid rgba(255,255,255,0.72)` top/sides; `rgba(255,255,255,0.38)` bottom. Simulates a glass edge catching light.
- **Shadow:** Four layers — top specular inset, glass top-edge inset, glass bottom-edge inset, ambient outer shadow, gold rim. See Elevation section.
- **Hover:** `translateY(-4px)` + gold glow (`0 12px 40px rgba(196,154,40,0.16)`).
- **Internal Padding:** 32px (`p-8`).

### Inputs / Fields
Inputs use a lighter version of the glass-gold treatment — warm but not frosted.

- **Style:** Warm ivory background (`rgba(255,253,246,0.7)`), gold-tinted border (`rgba(196,154,40,0.2)`), 12px radius (`rounded-xl`), 12px vertical 16px horizontal padding.
- **Focus:** Gold ring (`rgba(196,154,40,0.4)`) via `focus:ring-2`. No border colour shift — the ring is the only focus signal.
- **Error state:** Text turns rose (`#e11d48`) on word count exceeded. No border change.
- **Disabled:** Not used in this system.

### Navigation
The nav is a frosted ivory bar with a gold accent line at the very top.

- **Background:** `rgba(255,253,246,0.88)`, `blur(28px) saturate(160%)` — lighter than the glass-gold cards, since it spans full width.
- **Top accent:** 2px gradient line (`transparent → #C49A28 → #E8C547 → #C49A28 → transparent`) at 70% opacity. The only coloured element on the nav at rest.
- **Border:** `1px solid rgba(196,154,40,0.15)` bottom; `0 4px 24px rgba(0,0,0,0.04)` shadow. Barely perceptible separation.
- **Logo:** SVG lotus diamond (4-petal) + "N ✦ P" in `#5C3A2E`, letter-spacing 0.12em, weight 300. Gold ✦ separator at 11px.
- **Links at rest:** `#7C5A3A`, uppercase, tracking 0.09em, 12px.
- **Links active:** `#C49A28` + 1.5px gold underline.
- **Links hover:** Transition to `#C49A28`.
- **Mobile:** Full-width dropdown, ivory background `rgba(255,253,246,0.97)`, links at 56px minimum height (44px+ touch target met).

### Section Ornament (Signature Component)
The `<SectionOrnament />` is the visual full stop between sections — a gold lotus diamond SVG divider that appears at the top of every section.

- A 4-petal lotus enclosed in a diamond outline, flanked by thin horizontal rules that fade to transparent.
- Gold (`#C49A28`), 32px height, centred.
- Used at the top of every content section, inside the section padding before the heading.
- Establishes a rhythm: ornament → headline → content. This pattern is non-negotiable; sections that skip it feel unanchored.

### Countdown Cards
Frosted glass mini-cards in the hero for the wedding countdown.

- Width: `clamp(62px, 15vw, 86px)`. Background: `rgba(255,255,255,0.07)`. Blur: 28px. Gold border.
- Number: `clamp(30px, 8vw, 48px)`, weight 100, white. Animated digit flip (slide in from above on change).
- Label: `clamp(8px, 1.8vw, 10px)`, gold-muted (`rgba(196,154,40,0.65)`), tracking 0.22em, uppercase.
- Separator colon: `clamp(20px, 5vw, 32px)`, `rgba(196,154,40,0.35)`, weight 200.

## 6. Do's and Don'ts

### Do:
- **Do** use `#FFFDF6` (Warm Ivory) as the body background. Never `#FFFFFF`. The warmth is the whole point.
- **Do** keep section headings at font-weight 100. The airiness is intentional and must not be "fixed."
- **Do** use `<SectionOrnament />` at the top of every content section before the heading.
- **Do** apply Temple Gold (`#C49A28`) only where it matters — CTAs, active states, ornaments, the occasional inline emphasis. Rarity is power.
- **Do** use the glass-gold card (`backdrop-filter: blur(48px) saturate(200%)`) for any floating content panel — RSVP, invite details, schedule items.
- **Do** honour Indian cultural identity structurally. The jali pattern, lotus motifs, and mandala are load-bearing — they are not decorative novelty. Any new feature should find a way to sit within this vocabulary.
- **Do** respect `prefers-reduced-motion` — disable lotus rotation, particles, and cursor effects. The content works without them.
- **Do** keep touch targets at minimum 44px on mobile. The nav dropdown links are already 56px; new interactive elements must match.
- **Do** write copy that rewards close reading. The wit is deliberate ("not directed by James Cameron", "Single, tho looking for someone"). Match the tone.

### Don't:
- **Don't** use all-white, cold editorial minimalism — the kind of luxury that signals restraint over warmth. This is the primary anti-reference. A screen that could belong on a Parisian fashion brand or a tech product landing page is wrong here.
- **Don't** add cool colours — no greys, no blue-greys, no neutral blacks. Every colour in the system is warm. `#666` is forbidden; use `#9C7A5A`.
- **Don't** make the jali background pattern more prominent. It is intentionally near-invisible (13% opacity). If you notice it on first look, it's too strong.
- **Don't** bold section headings. Weight 100 is correct. Weight 700 on "Will you be there?" turns an invitation into a billboard.
- **Don't** use the burgundy (`#8B2252`) as a primary accent. It is reserved for the bride's map pin and link hover — a whisper, not a voice.
- **Don't** add drop shadows to section backgrounds or page-level containers. Shadows outside the hero and glass-gold cards break the flat-by-default rule.
- **Don't** introduce a new typeface without strong justification. The weight contrast within system-ui is doing significant work; adding a third font family fragments the system.
- **Don't** use generic wedding stock imagery or emoji-decorated UI. Specificity beats generic elegance: the shower proposal, the Runwal Greens wallet story, the actual couple's Bitmojis. If it could belong on any wedding site, it doesn't belong here.
- **Don't** apply the gold gradient button style to secondary actions. The pill ghost button (`rgba(196,154,40,0.1)` bg, gold border) exists for this. Two gold CTAs on one screen dilute both.
