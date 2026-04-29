# Primuez Portfolio — AI Studio App

Next.js 15 personal portfolio for Rahul "Primuez" Kasturiya. Features a 3D interactive Earth globe, automation workflow showcases, GitHub integration, and a dark terminal-inspired UI.

## Tech Stack

- **Framework**: Next.js 15.5.15 (App Router, `'use client'` page)
- **Styling**: Tailwind CSS v4 with custom theme
- **3D Globe**: Raw Three.js (lazy-loaded via dynamic `import()` inside `useEffect` — zero SSR footprint)
- **Animation**: Motion v12 (`motion/react`)
- **Charts**: Recharts
- **Deployment**: Cloudflare Workers via `@opennextjs/cloudflare`

## Project Structure

```
app/
  layout.tsx          - Root layout with full SEO metadata (OG, Twitter, favicon)
  page.tsx            - Main portfolio page (hero, about, projects, stack, creds, contact)
  opengraph-image.tsx - Dynamic OG image (ImageResponse, edge runtime)
  icon.svg            - Site favicon (served automatically by Next.js)
  apple-icon.svg      - Apple touch icon
  globals.css         - Global styles + Tailwind theme
components/
  ModelViewer.tsx     - 3D Earth globe (Three.js, lazy-loaded, drag-to-rotate)
  StockChart.tsx      - Recharts stock visualization
  ErrorBoundary.tsx   - React error boundary wrapping ModelViewer
public/
  textures/           - earth_color.jpg, earth_normal.jpg, earth_clouds.png
```

## Running the App

```bash
npm run dev              # Development server on port 5000
npm run build            # Production build (run without dev server active)
npm run build:cloudflare # Cloudflare Worker build → .open-next/worker.js
npm run deploy:cloudflare # Deploy to Cloudflare Workers
```

## Key Implementation Notes

### 3D Globe (ModelViewer)
- Three.js is imported via `Promise.all([ import('three'), import('three/examples/jsm/controls/OrbitControls.js') ])` inside `useEffect` — never in the server bundle
- `import type * as THREE` at the top for TypeScript types only (erased at runtime)
- Full cleanup: all geometries, materials, textures, controls, renderer disposed on unmount
- `mounted` boolean guard prevents async import running after unmount (React Strict Mode safe)

### Cloudflare Build
- `open-next.config.ts` configures `@opennextjs/cloudflare` v1.19.4
- `transpilePackages: ['motion']` must NOT be in `next.config.ts` (breaks SSR prerender)
- `output: 'standalone'` must NOT be in `next.config.ts` (breaks OpenNext)
- Production builds must be run without the dev server active (both write to `.next/`)

### SEO / OG
- `metadataBase: 'https://primuez.com'` in `layout.tsx`
- OG image generated via `app/opengraph-image.tsx` (1200×630, edge runtime)

## Replit Configuration

- Dev server runs on `0.0.0.0:5000` for Replit preview compatibility
- Workflow: `npm run dev`
- `allowedDevOrigins` in `next.config.ts` covers `*.replit.dev`, `*.replit.app`, `*.worf.replit.dev`
