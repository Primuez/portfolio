# Primuez.in Redesign Specification & Design System
**Author:** Antigravity / Principal UI/UX Architect  
**Domain:** https://primuez.in  
**Framework:** Astro + Tailwind CSS v4 + GSAP ScrollTrigger (Pure DOM / SVG — 0% WebGL)

---

## 1. Design Skills Applied & Concrete Design Decisions

| Installed Skill | Core Directive / Guideline Applied | Concrete Design Decision Produced |
|---|---|---|
| **impeccable** | Mode: *Experience* + *Persuade*. "The brief wins. No hedging, no shortcuts. Production-grade code, peak creativity, distinct visual world." | Dark-Tech Terminal aesthetic preserved & elevated. OLED canvas (`#070b12`), zero generic cards, tactile micro-badges with geometric status pings. Eliminates generic template fluff and highlights raw system autonomy. |
| **high-end-visual-design** | Double-Bezel Architecture (Doppelrand), nested CTA pill mechanics, spatial macro-whitespace (`py-28`), fluid cubic-bezier mass transitions. | All feature panels wrap an outer subtle shell (`p-1.5 rounded-[2rem] bg-white/[0.03] border border-white/10`) housing an inner machined core (`rounded-[calc(2rem-0.375rem)] bg-[#090d16]`). Buttons feature isolated nested circular icon anchors (`group-hover:translate-x-1`). |
| **ui-ux-pro-max** | High-contrast technical hierarchy, legible monospace metadata tags (`Space Mono`), balanced headings (`Syne`/`Plus Jakarta Sans`), zero layout shift, compact collapsible defaults. | Type scale: Display H1 (60px / 3.75rem, tracking -0.03em), H2 Section Titles (36px / 2.25rem), Body (15px / 1rem, line-height 1.65), Micro HUD tags (11px, tracking 0.2em, uppercase). Compact accordion defaults prevent vertical layout explosion. |
| **design-system** | Tokenized CSS variables for palette, surface elevation, borders, glow rings, and responsive typography clamp. | Standardized color palette: Cyber Neon (`#00f0ff`), Amber Core (`#fbbf24`), Emerald Pulse (`#10b981`), OLED Void (`#070b12`), Slate Surface (`#0d131f`). Hairline borders: `rgba(255,255,255,0.08)`. |

---

## 2. Research: Real Portfolio Analysis & Pattern Borrowing

We opened and analyzed 8 award-winning developer & designer portfolios (Awwwards SOTD / SiteInspire / FWA winners):

1. **Evan Bohringer (evanbohringer.com)**
   - *Patterns borrowed:* Crisp architectural typographic grid & subtle hairline divider lines anchoring section boundaries.
2. **Andreas Antonsson (andreasantonsson.dev)**
   - *Patterns borrowed:* Pinned scrubbed typography that highlights phrase-by-phrase, letting the narrative breathe without heavy 3D baggage.
3. **Michael Gatt (awwwards.com/sites/michael-gatt)**
   - *Patterns borrowed:* Micro-HUD status telemetry & nested technical pill tags that communicate real-time engineering precision.
4. **KKPK / Clement Pavageau (awwwards.com/sites/kkpk)**
   - *Patterns borrowed:* Multi-speed parallax column movement for work archives, giving immense optical depth without WebGL.
5. **Flayks (flayks.com)**
   - *Patterns borrowed:* Sticky stacking project cards that pin, scale down gently (to 0.96) and dim slightly as following cards slide over.
6. **Shelby Kay (shelbykay.dev)**
   - *Patterns borrowed:* Kinetic metrics roll-up and marquee motion that responds to scroll velocity.
7. **Hon Tran (hontran.dev)**
   - *Patterns borrowed:* High-performance GSAP ScrollTrigger scrub without Canvas/WebGL, keeping Lighthouse performance strictly at 95–100.
8. **Huy Phan (huyml.co)**
   - *Patterns borrowed:* SVG circuit-line draw-on animations and expanding clip-path masks revealing rich visual proof.

### Selected 8 Core Patterns for Primuez (AI Automation Freelancer):
1. **SVG Circuit-Mark Draw-on + Split-Text Entry** (Hero): Conveys autonomous system wiring and bare-metal intelligence without 3D canvas weight.
2. **Pinned Scrubbed Text + Bento Reveal** (About): Illuminates the operator's creed word-by-word as the user scrolls.
3. **Pinned Horizontal-Scroll Blade Track** (Services): Linear modular cards flowing across the screen horizontally on desktop, stacking seamlessly on mobile.
4. **Sticky Cascading Stack Cards** (Projects): Physical card stack where each project rests over the previous one.
5. **Scroll-Fill Glowing SVG Spine with Checkpoint Beacons** (Process): Visualizes end-to-end automation pipelines running through 4 stages.
6. **Kinetic Roll-up Counters + Velocity Marquee** (Why Primuez): Hard metrics (10+ systems, 3h saved/day) rolling dynamically into focus.
7. **Multi-Speed Parallax Stagger** (GitHub & Videos): Asymmetrical motion creating cinematic vertical depth.
8. **Underneath-Reveal Footer** (Footer): Main content lifts away to uncover the final call-to-action terminal.

---

## 3. Section Matrix Specification

Every section implements a completely distinct layout and unique scroll animation:

| Section | Current Layout | New Redesigned Layout | Unique Scroll Animation Technique | Skill Rules Applied | Mobile Variant (<768px) |
|---|---|---|---|---|---|
| **00. Hero** (`#hero`) | Centered text column with 3D canvas orb placeholder | Asymmetrical Split: Left technical statement & phrase matrix; Right dynamic SVG Cyber Circuit diagram | SVG stroke-dashoffset draw-on synchronized with scroll parallax fade-out | *impeccable*, *high-end-visual-design*: 0% WebGL, nested CTA pills, micro eyebrow badges | Single column vertical stack, SVG circuit scales smoothly, no layout shifts |
| **01. About** (`#whoami`) | 2x2 grid of static cards | Asymmetric Bento: Pinned headline with word-by-word luminance scrub on left; 3D-angled glass telemetry tiles on right | Pinned scrubbed text highlight (`opacity: 0.2 -> 1.0` per word) + staggered bento entrance | *high-end-visual-design*: Doppelrand double-bezel, concentric border-radius math | Unpinned vertical flow, gentle GPU translate fade-up |
| **02. Projects** (`#projects`) | Vertical accordion cards | Sticky Stacking Deck: Tiered cards that stick to sticky top thresholds (`top: 80px`, `top: 110px`, `top: 140px`) | Sticky card scale-down (`scale(0.95)`) & brightness dip (`brightness(0.7)`) as next card overlays | *impeccable*: Compact defaults on load, zero visual clutter before user interaction | Single column sticky stack with smaller offset increments |
| **03. Services** (`#services`) | Vertical accordion list | Horizontal Modular Track: 4 wide architecture blades pinned horizontally on desktop | Desktop pinned horizontal translate (`xPercent: -75`) driven by vertical scroll scrub | *ui-ux-pro-max*: High density system blades, status indicators | Graceful fallback to vertical stacked cyber blades |
| **04. Videos** (`#videos`) | 3-column static grid | Cinematic Media Rack: Large featured video showcase flanked by secondary transmission feeds | Clip-path mask expanding from center (`inset: 15% -> inset: 0%`) on scroll entrance | *high-end-visual-design*: Fluid dynamics, ambient colored backdrop blur | Vertical stacked cards with fixed 16:9 aspect ratios |
| **05. Process** (`#process`) | 4-step vertical boxes | Central Circuit Timeline: Interlocking step nodes flanking an illuminated central SVG power bus | SVG stroke scroll-fill path with active beacon pulses triggering at 25%, 50%, 75%, 100% | *impeccable*: Clear visual feedback, linear narrative clarity | Single-sided vertical line with left-aligned step cards |
| **06. Pricing** (`#pricing`) | 3 pricing cards with sticky scroll | Tiered Terminal Enclosures with live calculation toggles and glass badges | Staggered 3D tilt entry + hover magnetic scale | *high-end-visual-design*: Nested button pills, highlighted primary tier | Vertical swipeable or stacked cards with instant CTAs |
| **07. Why Primuez** (`#why-primuez`) | 4 feature blocks | Kinetic Telemetry Dashboard with comparison matrix and live counter dials | Numbers count up dynamically as section enters viewport + velocity marquee | *ui-ux-pro-max*: Hard contrast proof, clear value proposition | 2x2 compact metric grid with vertical list |
| **08. Stack** (`#stack`) | Tabbed category grid | Modular Chip Matrix with live category filter pills | Staggered diagonal matrix entrance (`x: -30, y: 30`) | *design-system*: Consistent token badges, hover glow | 2-column compact grid with horizontal category pills |
| **09. Credentials** (`#credentials`) | List of cards | Double-Bezel Holographic Badges with verified certificate download links | Alternating horizontal slide (`x: -50` vs `x: 50`) converging to center | *high-end-visual-design*: Hairline borders, gold accent for Oracle/IBM | Stacked cards with verified external verification links |
| **10. GitHub** (`#github`) | Static grid of repositories | Dual-Track Parallax Columns (odd repos speed 1.2x, even repos speed 0.8x) | Multi-speed vertical parallax scroll | *impeccable*: Dynamic optical depth without WebGL | Single column vertical feed with uniform scroll rate |
| **11. FAQ** (`#faq`) | Basic accordions | Terminal Man-Page style collapsible questions (strictly collapsed by default) | Staggered line reveal on open + smooth height tweening | *ui-ux-pro-max*: Zero layout flash, clean aria-expanded attributes | Full width touch-friendly accordions (min-height 54px) |
| **12. Contact** (`#contact`) | Simple contact form | Interactive Terminal Console with instant booking CTAs and WhatsApp channel | Pinned zoom-through entrance (`scale: 0.9 -> 1.05`) + magnetic button physics | *high-end-visual-design*: Tactile interactive states, active input glow | Responsive form fields with full-width action buttons |
| **13. Footer** (`#footer`) | Standard bottom bar | Underneath-Reveal Curtain: Fixed z-0 footer revealed as content scrolls off | Parallax curtain reveal (previous section lifts up to reveal footer) | *impeccable*: Memorable exit experience | Clean static bottom footer with complete copyright metadata |
