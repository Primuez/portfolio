'use client';

import dynamic from 'next/dynamic';

// Dynamic SSR-disabled Island (client-only hydration)
const InteractiveOrchestratorSection = dynamic(
  () => import('./InteractiveOrchestratorSection'),
  { ssr: false }
);

export default InteractiveOrchestratorSection;
export { InteractiveOrchestratorSection };
