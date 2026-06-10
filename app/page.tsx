'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { CustomCursor } from '@/components/CustomCursor';
import { ShaderBackground } from '@/components/ShaderBackground';
import { GlassRefractionOverlay, LiquidGlassLogo } from '@/components/ui/liquid-glass-logo';
import { ShaderLogo } from '@/components/ShaderText';
import { ShaderLogoGlow } from '@/components/ShaderLogoGlow';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { UIProvider, useUI } from '@/lib/contexts/UIContext';
import { MobileStickyCtA } from '@/components/MobileStickyCtA';

// Modularized Sections
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';

import ProcessSection from '@/components/sections/ProcessSection';
import WhySection from '@/components/sections/WhySection';
import PricingSection from '@/components/sections/PricingSection';
import GithubSection from '@/components/sections/GithubSection';
import VideosSection from '@/components/sections/VideosSection';
import StackSection from '@/components/sections/StackSection';
import CredentialsSection from '@/components/sections/CredentialsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import ModalsSection from '@/components/sections/ModalsSection';

export default function Home() {
  return (
    <UIProvider>
      <HomeContent />
    </UIProvider>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[1px] z-[60] bg-gradient-to-r from-cyan via-cyan/60 to-amber/40 pointer-events-none"
    />
  );
}

function ScrollToTopButton({ scrolled }: { scrolled: boolean }) {
  return (
    <AnimatePresence>
      {scrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-11 md:h-11 rounded-full bg-panel/90 border border-cyan/30 backdrop-blur-md flex items-center justify-center text-cyan hover:bg-cyan/10 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 group active:scale-90"
          aria-label="Scroll to top"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:-translate-y-0.5 transition-transform">
            <path d="M8 13V3M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function HomeContent() {
  const { isMobile, setModalType, scrolled } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure the page boots at the very top, clearing any hash the browser may have jumped to.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const showMobileLayout = mounted ? isMobile : false;

  return (
    <div className="relative min-h-screen">
      {/* Custom cursor & touch response */}
      <CustomCursor />
      
      {/* Interactive WebGL shader background */}
      {showMobileLayout ? (
        <div className="fixed inset-0 z-0 w-full h-full bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0e1a]" />
      ) : (
        <ShaderBackground className="fixed inset-0 z-0 w-full h-full" opacity={0.85} variant="hero" />
      )}
      
      {/* Interactive liquid glass refraction overlay */}
      {!showMobileLayout && <GlassRefractionOverlay />}
      
      {/* Blueprint animated grid overlay */}
      <div className="fixed inset-0 z-[1] bg-blueprint opacity-15 animate-grid pointer-events-none"></div>
      
      {/* Navigation */}
      <header role="banner">
      <nav aria-label="Main navigation" className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent'}`}>
        <div className="w-full px-4 sm:px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <div className="font-mono text-cyan text-lg md:text-xl tracking-widest font-bold transition-all duration-300">
            {showMobileLayout ? (
              <LiquidGlassLogo>
                <ShaderLogo>PRIMUEZ</ShaderLogo>
              </LiquidGlassLogo>
            ) : (
              <ShaderLogoGlow>
                <LiquidGlassLogo>
                  <ShaderLogo>PRIMUEZ</ShaderLogo>
                </LiquidGlassLogo>
              </ShaderLogoGlow>
            )}
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 font-mono text-[11px] tracking-widest uppercase text-text-muted">
            <a href="#whoami" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">About</a>
            <a href="#projects" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">Work</a>
            <a href="#services" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">Services</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200 text-amber/80 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-amber after:transition-all after:duration-300 hover:after:w-full">Pricing</a>
            <a href="#stack" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">Stack</a>
            <a href="#contact" className="hover:text-white transition-colors duration-200 border border-white/20 px-3 py-1 -my-1 rounded hover:border-cyan/50 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)]">Contact</a>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-12 h-12 gap-1.5 z-50 rounded-lg active:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-cyan transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-cyan transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-cyan transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
        {/* Mobile menu drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-bg/95 backdrop-blur-md border-b border-cyan/20 overflow-y-auto max-h-[calc(100vh-64px)]"
            >
              <div className="flex flex-col px-6 py-4 gap-4 font-mono text-sm tracking-widest uppercase text-text-muted">
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-1">Work</div>
                {['About:#whoami','Projects:#projects','Services:#services','Pricing:#pricing'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-3">Info</div>
                {['Why Us:#why-primuez','Stack:#stack','Credentials:#credentials','FAQ:#faq'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-3">Connect</div>
                {['GitHub:#github','Videos:#youtube','Contact:#contact'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <GlassButton 
                  size="lg"
                  onClick={() => { setMenuOpen(false); setModalType('form'); }}
                  glowColor="rgba(0, 240, 255, 0.3)"
                  className="mt-4 w-full glass-btn-glow text-cyan"
                >
                  Let&apos;s Talk
                </GlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      </header>
 
      <ScrollProgressBar />
 
      <main id="main-content" aria-label="Portfolio content">
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 pb-16 md:pb-32">
        <HeroSection />

        <AboutSection />

        <ServicesSection onWorkWithMe={() => setModalType('form')} />

        <ProjectsSection />

        <PricingSection />

        <ProcessSection />

        <WhySection />

        <GithubSection />

        <VideosSection />

        <StackSection />

        <CredentialsSection />

        <FAQSection />

        <ContactSection />
      </div>
      </main>

      {/* Mobile sticky CTA */}
      <MobileStickyCtA />

      {/* Scroll to top button */}
      <ScrollToTopButton scrolled={scrolled} />



      {/* ALL MODALS */}
      <ModalsSection />
    </div>
  );
}
