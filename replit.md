# AI Studio Portfolio App

A Next.js 15 personal portfolio and AI studio showcase, featuring 3D interactive elements, GitHub integration, project showcases, and a dark terminal-inspired UI.

## Tech Stack

- **Framework**: Next.js 15.3.1 (App Router)
- **Styling**: Tailwind CSS v4 with custom theme
- **3D**: Three.js + @react-three/fiber + @react-three/drei
- **Animation**: Framer Motion (via `motion` package)
- **Charts**: Recharts
- **AI**: @google/genai (Gemini)

## Project Structure

```
app/           - Next.js App Router pages and layouts
  api/         - API route handlers
  globals.css  - Global styles
  layout.tsx   - Root layout
  page.tsx     - Main portfolio page
components/    - Shared UI components
  ModelViewer.tsx  - 3D interactive model (Three.js)
  StockChart.tsx   - Recharts stock visualization
hooks/         - React hooks
lib/           - Utilities
public/        - Static assets
```

## Running the App

```bash
npm run dev    # Development server on port 5000
npm run build  # Production build
npm run start  # Production server on port 5000
```

## Replit Configuration

- Dev server runs on `0.0.0.0:5000` for Replit preview compatibility
- `allowedDevOrigins` includes `*.replit.dev` and `*.replit.app`
- Unsplash and picsum.photos are whitelisted in `next.config.ts` image remote patterns
- Next.js pinned to 15.3.1 for SWC binary compatibility with Node.js 20

## Environment Variables

- `GEMINI_API_KEY` - Required for Gemini AI API calls
- `APP_URL` - The URL where the app is hosted
