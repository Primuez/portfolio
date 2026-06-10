'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';

export default function LeadMagnetSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    window.location.href = `mailto:contact@primuez.in?subject=Blueprint Request&body=Please send the IndiaMART -> Odoo Automation Blueprint to: ${encodeURIComponent(email)}`;
  };

  return (
    <section id="blueprint-magnet" className="pt-16 md:pt-32">
      <SectionHeader number="04.2" command="> ./grab --blueprint" title="Free Automation Blueprint" />
      
      <div className="mt-8 max-w-4xl mx-auto rounded-2xl border border-cyan/30 bg-panel/40 backdrop-blur-md p-6 md:p-8 hover:border-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.08)] transition-all duration-300 relative overflow-hidden liquid-glass-card">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide font-sans mb-2">
              Free: IndiaMART &rarr; Odoo Automation Blueprint
            </h3>
            <p className="text-text-muted text-sm leading-relaxed font-sans">
              The architecture I use to connect IndiaMART leads directly into Odoo — with zero manual entry. Grab the architectural blueprint free.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 z-20">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-white text-sm font-sans focus:outline-none focus:border-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all min-w-[240px] h-[48px]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-cyan text-bg border border-cyan hover:bg-transparent hover:text-cyan font-mono text-xs uppercase tracking-wider text-center transition-all duration-300 font-bold rounded-lg h-[48px] cursor-pointer"
            >
              Send me the Blueprint
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
