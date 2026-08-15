'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { checkDeviceCapability } from '@/lib/utils/hardwareDetect';
import { SectionHeader } from '@/components/SectionHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModelViewer } from '@/components/ModelViewer';

export default function InteractiveOrchestratorSection() {
  const [isHighSpec, setIsHighSpec] = useState<boolean | null>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const isGlobeInView = useInView(globeContainerRef, { once: true, margin: '200px' });

  useEffect(() => {
    // Check if the device is a powerful PC vs weak mobile/laptop
    setIsHighSpec(checkDeviceCapability());
  }, []);

  // 1. LOADING STATE / HYDRATION: Prevent layout shift while checking
  if (isHighSpec === null) {
    return null;
  }

  // 2. WEAK DEVICE: Nuke the ENTIRE section safely.
  // No text, no empty gaps, just seamless scrolling to the next section.
  if (!isHighSpec) {
    return null;
  }

  // 3. POWERFUL DEVICE: Render the full, beautiful UI and Shaders.
  // KEEP ALL MY EXISTING 3D CODE INTACT HERE.
  return (
    <section aria-labelledby="interactive-heading" className="relative w-full my-12 md:my-16">
      <div className="shader-section-divider absolute top-0 left-0 right-0" />
      <h2 id="interactive-heading" className="sr-only">Interactive 3D Elements & Personal Favourites</h2>
      <div className="pt-8 md:pt-12">
        <SectionHeader number="02.1" command="> ./render --3d" title="Interactive Elements & Favorites" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-12 mb-16 items-center">
        {/* The Text Content - Only renders if device is High Spec */}
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
            {isGlobeInView ? (
              <ModelViewer />
            ) : (
              <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
                <span className="font-mono text-xs text-cyan tracking-widest">LOADING ORCHESTRATION CORE…</span>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
