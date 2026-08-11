'use client';

import { useEffect, useState } from 'react';
import { checkDeviceCapability } from '@/lib/utils/hardwareDetect';
import { ModelViewer } from './ModelViewer';
import LightweightCyberOrb from './LightweightCyberOrb';

export default function AdaptiveOrchestrationCore() {
  const [isHighSpec, setIsHighSpec] = useState<boolean | null>(null);

  useEffect(() => {
    setIsHighSpec(checkDeviceCapability());
  }, []);

  if (isHighSpec === null) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-cyan-950/20 animate-pulse border border-cyan-500/20 flex items-center justify-center">
        <span className="font-mono text-xs text-cyan tracking-widest">INITIALIZING HARDWARE CHECK…</span>
      </div>
    );
  }

  return isHighSpec ? <ModelViewer /> : <LightweightCyberOrb />;
}
