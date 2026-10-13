import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 80;
      const elPos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: elPos, behavior: 'smooth' });
      history.pushState(null, '', href);
    }
  };

  const openFormModal = () => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'form' } }));
  };

  return (
    <>
      <header role="banner" className="fixed top-0 left-0 right-0 z-50">
        <nav
          aria-label="Main navigation"
          className={`w-full transition-all duration-300 ${
            scrolled || menuOpen
              ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/[0.08] shadow-lg'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
            {/* Brand Logo */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="font-mono text-cyan text-lg md:text-xl tracking-widest font-bold flex items-center gap-2 group cursor-pointer"
            >
              <span className="shader-logo-shimmer">PRIMUEZ</span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-7 font-mono text-[11px] tracking-widest uppercase text-text-muted">
              {[
                { label: 'About', href: '#whoami' },
                { label: 'Work', href: '#projects' },
                { label: 'Services', href: '#services' },
                { label: 'Process', href: '#process' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Stack', href: '#stack' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="hover:text-cyan transition-colors duration-200 relative py-1"
                >
                  {item.label}
                </a>
              ))}

              <button
                type="button"
                onClick={openFormModal}
                className="px-4 py-2 border border-cyan/40 bg-cyan/10 hover:bg-cyan hover:text-bg text-cyan rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer font-bold shadow-[0_0_12px_rgba(0,240,255,0.15)]"
              >
                Let's Talk
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 rounded-lg active:bg-white/5 transition-colors cursor-pointer"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-6 h-0.5 bg-cyan transition-transform duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-cyan transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-cyan transition-transform duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>

          {/* Mobile Dropdown Drawer */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 border-b border-cyan/20 bg-[#0a0a0f]/98 backdrop-blur-xl ${
              menuOpen ? 'max-h-[85vh] py-6 px-6 opacity-100' : 'max-h-0 py-0 px-6 opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col gap-4 font-mono text-sm tracking-widest uppercase text-text-muted">
              <span className="text-[10px] text-text-muted/60 tracking-[0.3em]">Sections</span>
              {[
                { label: 'About Me', href: '#whoami' },
                { label: 'Projects & SaaS', href: '#projects' },
                { label: 'Services', href: '#services' },
                { label: 'How We Work', href: '#process' },
                { label: 'Pricing Scopes', href: '#pricing' },
                { label: 'Tech Stack', href: '#stack' },
                { label: 'Credentials', href: '#credentials' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="hover:text-white transition-colors pl-2 border-l border-white/10 py-2"
                >
                  {item.label}
                </a>
              ))}

              <button
                type="button"
                onClick={openFormModal}
                className="mt-4 w-full py-3.5 bg-cyan text-bg font-bold font-mono text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer"
              >
                Let's Talk &rarr;
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating Scroll-to-Top Button */}
      {scrolled && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-panel/90 border border-cyan/40 backdrop-blur-md flex items-center justify-center text-cyan hover:bg-cyan hover:text-bg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer shadow-lg active:scale-90"
          aria-label="Scroll to top"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 13V3M3 7l5-5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </>
  );
}
