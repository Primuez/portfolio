'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LiquidGlassLogo } from '@/components/ui/liquid-glass-logo';
import { ShaderLogo } from '@/components/ShaderText';
import { ShaderLogoGlow } from '@/components/ShaderLogoGlow';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { useUI } from '@/lib/contexts/UIContext';
import { trackEvent } from '@/lib/analytics';

export function Navbar() {
  const { isMobile, setModalType, scrolled } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const showMobileLayout = mounted ? isMobile : false;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    setMenuOpen(false);
    
    trackEvent(`nav_click`, { label, href });

    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', href);
    }
  };

  return (
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
            {['About:#whoami', 'Work:#projects', 'Services:#services', 'Pricing:#pricing', 'Stack:#stack', 'Contact:#contact'].map(item => {
              const [label, href] = item.split(':');
              return (
                <a 
                  key={href} 
                  href={href} 
                  onClick={(e) => handleNavClick(e, href, label)}
                  className={`hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full ${label === 'Pricing' ? 'text-amber/80 after:bg-amber' : 'after:bg-cyan'} ${label === 'Contact' ? 'border border-white/20 px-3 py-1 -my-1 rounded hover:border-cyan/50 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)] after:hidden' : ''}`}
                >
                  {label}
                </a>
              );
            })}
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
                    <a key={href} href={href} onClick={(e) => handleNavClick(e, href, label)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-3">Info</div>
                {['Why Us:#why-primuez','Stack:#stack','Credentials:#credentials','FAQ:#faq'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={(e) => handleNavClick(e, href, label)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-3">Connect</div>
                {['GitHub:#github','Videos:#videos','Contact:#contact'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={(e) => handleNavClick(e, href, label)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <GlassButton 
                  size="lg"
                  onClick={() => { 
                    setMenuOpen(false); 
                    trackEvent('click_mobile_nav_letstalk');
                    setModalType('form'); 
                  }}
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
  );
}
