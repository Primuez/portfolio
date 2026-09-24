'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { checkDeviceCapability, isMobileDevice } from '@/lib/utils/hardwareDetect';
import { SectionHeader } from '@/components/SectionHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModelViewer } from '@/components/ModelViewer';

export default function InteractiveOrchestratorSection() {
  const [shouldRender, setShouldRender] = useState<boolean | null>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCapability = () => {
      // In mobile mode or weak devices: completely skip rendering 3D orchestrator/globe
      if (isMobileDevice() || !checkDeviceCapability()) {
        setShouldRender(false);
      } else {
        setShouldRender(true);
      }
    };

    updateCapability();

    window.addEventListener('resize', updateCapability);
    return () => window.removeEventListener('resize', updateCapability);
  }, []);

  // 1. LOADING / HYDRATION: Prevent layout shift while checking
  if (shouldRender === null) {
    return null;
  }

  // 2. MOBILE OR WEAK DEVICE: Safely nuke the entire 3D section.
  // Zero canvas creation, zero WebGL texture load, zero memory crashes.
  if (!shouldRender) {
    return null;
  }

  // 3. DESKTOP / HIGH SPEC DEVICE: Render interactive 3D core
  return (
    <section aria-labelledby="interactive-heading" className="relative w-full my-12 md:my-16">
      <div className="shader-section-divider absolute top-0 left-0 right-0" />
      <h2 id="interactive-heading" className="sr-only">Interactive 3D Elements & Personal Favourites</h2>
      <div className="pt-8 md:pt-12">
        <SectionHeader number="02.1" command="> ./render --3d" title="Interactive Elements & Favorites" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-12 mb-16 items-center">
        {/* The Text Content - Only renders if device is High Spec Desktop */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-50px' }}
            className="text-2xl font-bold mb-4 font-sans border-l-4 border-cyan pl-4 text-white"
          >
            Interactive 3D Orchestration Core
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-50px' }}
            className="text-text-muted mb-6 leading-relaxed font-sans"
          >
            Hover and grab the core object to rotate. This interactive 3D model powered by Three.js and React Three Fiber serves as an abstraction of my n8n central orchestrator—routing payloads, scaling compute, and connecting multiple AI pipelines.
          </motion.p>
          <ul className="space-y-2 font-mono text-xs text-text-muted">
            <motion.li
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span> @react-three/fiber processing
            </motion.li>
            <motion.li
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse delay-75"></span> MeshDistortMaterial applied
            </motion.li>
            <motion.li
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-50px' }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse delay-150"></span> Interactive rotation axes mapped
            </motion.li>
          </ul>
        </div>

        {/* The 3D Canvas */}
        <div ref={globeContainerRef} className="w-full h-[400px] relative">
          <ErrorBoundary>
            <ModelViewer />
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
