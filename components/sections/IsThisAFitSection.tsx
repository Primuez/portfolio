'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';

export default function IsThisAFitSection() {
  return (
    <section id="fit" className="pt-16 md:pt-32">
      <SectionHeader number="04.1" command="> ./fit --check" title="Is This a Fit?" />
      
      <p className="text-text-muted mt-4 mb-10 max-w-2xl text-base leading-relaxed font-sans">
        I value your time and mine. Here is a transparent look at who I work best with, and when we might not be a good match.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Good Fit */}
        <div className="bg-panel/40 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300">
          <h3 className="text-emerald-400 font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-2 font-bold border-b border-emerald-500/10 pb-3">
            <CheckCircle2 size={16} /> ✅ Good Fit
          </h3>
          <ul className="space-y-4 font-sans text-sm text-text-main leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span><strong>Manufacturers & traders</strong> drowning in manual data entry (IndiaMART, Odoo, custom ERPs).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span><strong>Chartered Accountants (CAs)</strong> handling GST, reconciliation, or client reporting by hand.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span><strong>Founders</strong> who need a working SaaS MVP shipped fast without hiring a full development team.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span><strong>Business owners</strong> who want always-on AI agents handling customer/legal queries automatically.</span>
            </li>
          </ul>
        </div>

        {/* Not a Fit */}
        <div className="bg-panel/40 border border-rose-500/20 rounded-2xl p-6 backdrop-blur-sm hover:border-rose-500/40 transition-all duration-300">
          <h3 className="text-rose-400 font-mono text-sm uppercase tracking-widest mb-6 flex items-center gap-2 font-bold border-b border-rose-500/10 pb-3">
            <XCircle size={16} /> ❌ Not a Fit
          </h3>
          <ul className="space-y-4 font-sans text-sm text-text-main leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
              <span><strong>Cheapest option seekers</strong>. I write custom, robust production code that is priced for long-term reliability.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
              <span>Projects requiring a large ongoing team or bureaucratic management layers.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
              <span>Anyone who is not clear on what business outcome they want to automate.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center font-mono text-xs text-text-muted/80">
        🛡️ Fixed-price proposals — no surprise invoices &middot; 30-day free support on every build &middot; Clear delivery timeline agreed upfront
      </div>
    </section>
  );
}
