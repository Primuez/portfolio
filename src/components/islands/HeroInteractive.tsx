import React, { useState, useEffect } from 'react';
import { ChevronRight, Download, Calendar, Coffee } from 'lucide-react';

const PHRASES = [
  "Workflow Automation.",
  "Zero Manual Entry.",
  "Systems That Scale.",
  "Built for Indian SMEs."
];

export default function HeroInteractive() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PHRASES.length);
        setAnimating(false);
      }, 300);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const openContactModal = () => {
    window.dispatchEvent(new CustomEvent('open-modal', { detail: 'form' }));
  };

  return (
    <div className="w-full">
      {/* Cycling terminal prompt */}
      <div className="h-9 md:h-11 mb-4 font-mono text-xl sm:text-2xl md:text-3xl text-cyan flex items-center overflow-hidden">
        <span className="opacity-60 mr-2.5 text-zinc-400 select-none">&gt;</span>
        <span
          className={`transition-all duration-300 font-bold ${
            animating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
          }`}
        >
          {PHRASES[index]}
        </span>
      </div>

      {/* Action Buttons: View Work, Let's Talk, Resume */}
      <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
        <a
          href="#projects"
          className="px-8 py-4 bg-transparent border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:border-cyan hover:text-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300 text-center flex items-center justify-center gap-2 rounded-lg cursor-pointer"
        >
          <ChevronRight size={16} /> View My Work
        </a>

        <button
          type="button"
          onClick={openContactModal}
          className="px-8 py-4 bg-cyan/15 border border-cyan/50 text-cyan font-mono text-xs uppercase tracking-widest hover:bg-cyan hover:text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all duration-300 text-center flex items-center justify-center gap-2 rounded-lg cursor-pointer"
        >
          Let's Talk
        </button>

        <a
          href="/documents/resume.pdf"
          download="Rahul_Kasturiya_Resume.pdf"
          className="px-8 py-4 bg-transparent border border-amber/40 text-amber font-mono text-xs uppercase tracking-widest hover:bg-amber/10 hover:border-amber transition-all duration-300 text-center flex items-center justify-center gap-2 rounded-lg cursor-pointer"
        >
          <Download size={16} /> Resume
        </a>
      </div>

      {/* Direct Scope Call Cards */}
      <div className="flex flex-col gap-3 max-w-xl mb-8 border border-white/10 bg-[#090d16]/80 p-5 rounded-xl backdrop-blur-md relative z-10 shadow-xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          [ OR SCHEDULE A DIRECT CALL ]
        </p>
        <div className="flex flex-col min-[480px]:flex-row gap-3">
          <a
            href="https://cal.com/prime-s/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-cyan/10 border border-cyan/40 text-cyan hover:bg-cyan hover:text-black font-mono text-xs uppercase tracking-wider text-center transition-all duration-300 flex items-center justify-center gap-2 font-bold rounded-lg cursor-pointer"
          >
            <Calendar size={15} /> Book 30-min Scope Call
          </a>
          <a
            href="https://cal.com/prime-s/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-transparent border border-white/20 text-white hover:border-cyan/60 hover:text-cyan font-mono text-xs uppercase tracking-wider text-center transition-all duration-300 flex items-center justify-center gap-2 font-bold rounded-lg cursor-pointer"
          >
            <Coffee size={15} /> 15-min Quick Chat
          </a>
        </div>
        <p className="text-zinc-400 text-xs text-center min-[480px]:text-left font-sans">
          Prefer a quick call? No sales pitch — just scope your project.
        </p>
      </div>
    </div>
  );
}
