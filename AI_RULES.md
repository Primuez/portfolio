# Tech Stack & AI Rules (v2 - Next.js 15 Edition)

- **Framework**: Next.js 15 (App Router).
- **React**: React 19 (Server/Client boundary awareness is critical).
- **Styling**: Tailwind CSS v4 (Use new `@theme` and `@import "tailwindcss"` patterns).
- **UI Components**: shadcn/ui (Radix UI primitives).
- **3D**: Three.js + @react-three/fiber + @react-three/drei (Prefer declarative 3D).
- **Animation**: Framer Motion (use `motion/react` import).
- **Icons**: Lucide React.
- **Project Structure**:
    - `app/`: Next.js App Router pages and layouts.
    - `components/`: Reusable UI components.
    - `components/sections/`: Modularized sections for large pages.
    - `hooks/`: Custom React hooks.
    - `lib/`: Shared utilities.

## Operational Rules

1. **Keep it Modular**: Large pages (like `app/page.tsx`) MUST be split into modular components in `components/sections/`.
2. **Technical Hygiene**: No monolithic files over 500 lines.
3. **No Legacy Hacks**: Avoid manual DOM manipulation inside `useEffect` (like `appendChild` for Three.js) unless absolutely necessary. Use `React Three Fiber` for declarative 3D.
4. **Hydration Safety**: Be careful with `useIsMobile` conditional rendering. Use CSS media queries or `Suspense` where possible to avoid hydration mismatches.
5. **No Emojis as Icons**: Always use `Lucide` or SVGs.
6. **Cursor Management**: Do not force `cursor: none` unless requested for specific game-like experiences.
