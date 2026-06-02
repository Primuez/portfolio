'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionHeader } from '@/components/SectionHeader';

const FAQ_DATA = [
  {
    q: 'How long does a project typically take?',
    a: 'Micro-Builds are delivered in 2–4 days. Professional Automation projects take 5–10 days. Premium AI Integration or SaaS MVPs take 2–4 weeks depending on scope. Timeline is agreed before work begins — no vague "it depends."',
  },
  {
    q: 'Do I need to manage you or check in constantly?',
    a: "No. You describe the outcome you need, I ask any clarifying questions upfront, then disappear and build. You get async updates and a final handover call. You don't need to know how any of it works technically.",
  },
  {
    q: "You're self-taught — how do I know the work will be solid?",
    a: 'Look at what shipped: InkTwin (live SaaS), PrimuezSure (live SaaS), the Odoo Enterprise architecture presented at a business show in Raipur, the CA Automation Suite used by actual firms. Self-taught means I learned by building real systems, not passing exams. The credentials section has the verifiable proof.',
  },
  {
    q: "What if I don't know exactly what I need?",
    a: "That's fine — most clients don't. Fill the \"Work With Me\" form and describe the problem you're trying to solve, not the solution. I'll come back with a scoped proposal including what I'd build and which tier it falls under.",
  },
  {
    q: 'Can you integrate with tools I already use?',
    a: 'Almost certainly yes. If it has an API, webhook, or can export data — I can connect it. Current integrations include Odoo, Zoho, WhatsApp (via Evolution API), GST portal, IndiaMART, Kickbox, Cloudflare, Vercel, Google Workspace, and any standard REST/HTTP endpoint.',
  },
  {
    q: 'What happens if something breaks after delivery?',
    a: "Micro-Builds come with 0 days post-delivery support (it's priced that way). Professional builds include 30-day bug support. Premium builds include 60 days. Monthly retainers include ongoing support as part of the deal. Bugs caused by my code are always fixed at no extra cost within the support window.",
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes. Pricing is listed in both INR and USD. Communication is async-first and timezone-flexible. Payment in USD, EUR, or INR — all accepted.',
  },
  {
    q: 'I have a big project. Where do I start?',
    a: 'Book a scope call via the "Work With Me" form. Large projects are broken into scoped phases so you\'re never paying for everything upfront. We agree on Phase 1, I build it, you see it working — then we plan Phase 2.',
  },
];

const DX_CHARS = '<>/*&#01_?!@$%^~=|\\[]{}';

function FAQDecryptItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const [displayQ, setDisplayQ] = useState(q);
  const [displayA, setDisplayA] = useState('');
  const scrambleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decryptRaf = useRef<number>(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768 || 'ontouchstart' in window;
    return () => {
      if (scrambleTimer.current) clearTimeout(scrambleTimer.current);
      cancelAnimationFrame(decryptRaf.current);
    };
  }, []);

  function startScramble() {
    if (isMobile.current) return;
    let count = 0;
    function tick() {
      count++;
      const arr = q.split('');
      const taken = new Set<number>();
      while (taken.size < 2) {
        const idx = Math.floor(Math.random() * arr.length);
        if (arr[idx] !== ' ') taken.add(idx);
      }
      taken.forEach(i => { arr[i] = DX_CHARS[Math.floor(Math.random() * DX_CHARS.length)]; });
      setDisplayQ(arr.join(''));
      if (count < 9) scrambleTimer.current = setTimeout(tick, 55);
      else setDisplayQ(q);
    }
    if (scrambleTimer.current) clearTimeout(scrambleTimer.current);
    tick();
  }

  function stopScramble() {
    if (scrambleTimer.current) clearTimeout(scrambleTimer.current);
    setDisplayQ(q);
  }

  function runDecrypt() {
    const len = a.length;
    const t0 = performance.now();
    const DURATION = isMobile.current ? 600 : 1200;
    function frame() {
      const elapsed = performance.now() - t0;
      const progress = Math.min(elapsed / DURATION, 1);
      const revealed = Math.floor(progress * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        if (i < revealed) out += a[i];
        else if (a[i] === ' ') out += ' ';
        else out += DX_CHARS[Math.floor(Math.random() * DX_CHARS.length)];
      }
      setDisplayA(out);
      if (progress < 1) decryptRaf.current = requestAnimationFrame(frame);
      else setDisplayA(a);
    }
    decryptRaf.current = requestAnimationFrame(frame);
  }

  function handleClick() {
    if (!open) {
      const scrambled = a.split('').map(c => c === ' ' ? ' ' : DX_CHARS[Math.floor(Math.random() * DX_CHARS.length)]).join('');
      setDisplayA(scrambled);
      setOpen(true);
      setTimeout(runDecrypt, 40);
    } else {
      cancelAnimationFrame(decryptRaf.current);
      setOpen(false);
      setDisplayA('');
    }
  }

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden bg-panel/60 transition-colors duration-300 hover:border-cyan/20 active:border-cyan/30">
      <button
        onClick={handleClick}
        onMouseEnter={startScramble}
        onMouseLeave={stopScramble}
        className="w-full flex items-center justify-between gap-4 px-5 py-5 md:px-6 text-left group cursor-pointer min-h-[56px]"
        aria-expanded={open}
      >
        <span
          className="font-mono text-sm md:text-base text-text-main group-hover:text-white transition-colors leading-snug tracking-tight"
          style={{ textShadow: 'calc(-1 * var(--faq-gs, 0px)) 0 #00f0ff, var(--faq-gs, 0px) 0 #ff3366' }}
        >
          {displayQ}
        </span>
        <span className={`shrink-0 w-7 h-7 md:w-6 md:h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? 'border-cyan bg-cyan/10 rotate-45' : 'border-white/20 group-hover:border-cyan/40 group-active:border-cyan/60'}`}>
          <ChevronRight size={12} className={`transition-colors ${open ? 'text-cyan' : 'text-text-muted group-hover:text-white'}`} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 pt-3 text-sm md:text-[15px] text-[#00f0ff]/80 leading-relaxed border-t border-white/5 font-sans whitespace-pre-wrap break-words">
              {displayA || a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const glitch = useRef({ split: 0, skew: 0, raf: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    // Disable scroll-driven glitch on mobile — it causes jank and is disorienting
    if (isMobile) return;

    const el = listRef.current;
    if (!el) return;

    let lastY = window.scrollY;
    let lastT = performance.now();

    function apply(split: number, skew: number) {
      el!.style.setProperty('--faq-gs', `${split.toFixed(2)}px`);
      el!.style.transform = `skewX(${(-skew).toFixed(3)}deg)`;
    }

    function decay() {
      const g = glitch.current;
      g.split *= 0.84;
      g.skew  *= 0.84;
      if (g.split > 0.04 || g.skew > 0.002) {
        apply(g.split, g.skew);
        g.raf = requestAnimationFrame(decay);
      } else {
        g.split = 0; g.skew = 0;
        apply(0, 0);
      }
    }

    function onScroll() {
      const now = performance.now();
      const dt  = Math.max(now - lastT, 1);
      const dy  = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      lastT = now;

      const v = (dy / dt) * 1000;
      const t = Math.min(v / 1800, 1);
      const g = glitch.current;
      g.split = Math.max(g.split, t * 5);
      g.skew  = Math.max(g.skew,  t * 1.5);

      cancelAnimationFrame(g.raf);
      apply(g.split, g.skew);
      g.raf = requestAnimationFrame(decay);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(glitch.current.raf);
    };
  }, [isMobile]);

  return (
    <motion.section
      id="faq"
      aria-labelledby="faq-heading"
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <SectionHeader number="09" command="> ./faq --resolve-objections" title="Frequently Asked Questions" />
      <h2 id="faq-heading" className="sr-only">Frequently asked questions about Primuez AI automation projects, timelines, and pricing</h2>
      <p className="text-text-muted mt-4 mb-8 md:mb-12 max-w-2xl text-sm md:text-base leading-relaxed">
        Real answers to the questions clients ask before reaching out — so you don&apos;t have to wait for a reply to decide.
      </p>
      <div ref={listRef} className="max-w-3xl space-y-3 md:space-y-3" style={{ transformOrigin: 'center center' }}>
        {FAQ_DATA.map((item, i) => (
          <FAQDecryptItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </motion.section>
  );
}
