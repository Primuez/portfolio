# Architectural & Design Decisions: Primuez.in Redesign

## 1. Palette & Typography Preservation
- **Preserved Theme**: Cyberpunk / Dark-Tech Terminal.
  - Background: `#070b12` (deep dark void)
  - Primary Neon: `#00f0ff` (electric cyan)
  - Secondary Accent: `#f5a623` / `#fbbf24` (warm amber/gold)
  - Surface Panels: `#090d16` with double-bezel `border-white/10` and subtle cyan ring highlights
  - Typography: `Space Mono` (terminal commands, metrics, tags) + `Syne` / geometric sans (headings and titles).
- **Justification**: The research confirms dark-tech / developer-first portfolios (Linear, Raycast, Awwwards SOTD developer profiles) perform best when high contrast cyan/amber typography anchors the technical authority of an AI-Automation & Systems Engineer.

## 2. Motion Choreography & Distinct Section Scroll Styles
Every section implements a distinct scroll-animation technique (no two sections identical):
1. **Header & Global Canvas**:
   - Fixed 1px scroll-progress bar scrub (`from-cyan via-cyan/60 to-amber/40`).
   - Desktop-only custom reactive cursor follower (hidden on touch).
   - Back-to-top floating glass button on scroll threshold.
2. **Hero Section (`#hero`)**:
   - **Technique**: Split-text entry + cycling terminal phrase matrix + Desktop-only 3D Cyber Orb (`@react-three/fiber` canvas enabled ONLY on desktop `md:`, completely absent on mobile to protect 100/100 CWV).
3. **About Section (`#whoami`)**:
   - **Technique**: 3D Bento Vault-Door swing entrance (`rotateY`/`rotateX` perspective stagger on desktop, gentle GPU fade-up on mobile) + Live telemetry HUD.
4. **Services Section (`#services`)**:
   - **Technique**: Magnetic hover physics + clip-path gradient border glow reveal on scroll entrance.
5. **Projects Section (`#projects`)**:
   - **Technique**: Sticky stacking scrub (cascading cards that stick, scale down to 0.96, and dim as subsequent cards scroll over) + compact accordion defaults.
6. **Process Section (`#process`)**:
   - **Technique**: Scroll-fill SVG timeline (vertical glowing trace that fills proportionally from 0% to 100% as steps 01-04 enter the viewport).
7. **Why Section (`#why-primuez`)**:
   - **Technique**: Kinetic Counter roll-up / metric reveal with staggered horizontal translation.
8. **GitHub Showcase (`#github`)**:
   - **Technique**: Parallax cards with alternating directional float (`y: -20` vs `y: +20`).
9. **Videos Section (`#videos`)**:
   - **Technique**: Horizontal perspective tilt & scale scrub on video preview thumbnails.
10. **Stack Section (`#stack`)**:
    - **Technique**: Staggered matrix grid reveal with category tab cross-fade.
11. **Credentials Section (`#credentials`)**:
    - **Technique**: Double-bezel badge hover lift with holographic shimmer.
12. **FAQ Section (`#faq`)**:
    - **Technique**: Smooth accordion collapse/expand with zero layout flash (defaulting strictly closed).
13. **Contact Section (`#contact`)**:
    - **Technique**: Terminal command prompt pulse with instant interactive booking buttons.

## 3. Performance & Mobile Safeguards
- Zero Three.js / WebGL execution on mobile (`window.innerWidth < 768` or CSS media query check).
- Hardware-accelerated CSS `transform: translate3d` and `will-change: transform, opacity`.
- `prefers-reduced-motion` media queries globally disable transform transitions and snap opacity instantly to 1.
- All accordions and collapsibles default to compact on initial server render and hydration.
