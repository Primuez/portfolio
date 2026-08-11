'use client';

import React, { useEffect, useState } from 'react';
import { checkDeviceCapability } from '@/lib/hardwareDetect';
import LightweightCyberOrb from './LightweightCyberOrb';
import { ModelViewer } from './ModelViewer';

export default function GlobeWrapper() {
  const [isHighSpec, setIsHighSpec] = useState<boolean | null>(null);

  useEffect(() => {
    setIsHighSpec(checkDeviceCapability());
  }, []);

  if (isHighSpec === null) {
    return (
      <div className="w-[340px] h-[340px] rounded-full bg-cyan-950/20 animate-pulse border border-cyan-500/20 flex items-center justify-center">
        <span className="font-mono text-xs text-cyan/60 tracking-widest">HARDWARE_CHECK…</span>
      </div>
    );
  }

  return isHighSpec ? (
    <ModelViewer />
  ) : (
    <div className="flex items-center justify-center p-4">
      <LightweightCyberOrb />
    </div>
  );
}
