import { useState } from 'react';

const FAQ_DATA = [
  {
    q: 'Who is Primuez?',
    a: 'Primuez is the developer brand and identity of Rahul Kasturiya — a Triple Oracle Certified AI Systems Builder, n8n Automation Specialist, and founder of InkTwin, PrimuezSure, and Primuez Guard based in Raipur/Durg, India.',
  },
  {
    q: 'What is Primuez Guard and how does it protect businesses?',
    a: 'Primuez Guard is an autonomous AI verification agent designed to eliminate invoice fraud. It extracts PDF line items via OCR, verifies vendor legitimacy via web search and GST records, and validates invoice totals before authorizing payments.',
  },
  {
    q: 'How long does a project typically take?',
    a: 'Micro-Builds are delivered in 2–4 days. Professional Automation projects take 5–10 days. Premium AI Integration or SaaS MVPs take 2–4 weeks depending on scope. Timeline is agreed before work begins — zero vague estimates.',
  },
  {
    q: 'Do I need to manage you or check in constantly?',
    a: "No. You describe the outcome you need, I ask any clarifying questions upfront, then build with zero friction. You receive transparent async progress updates and a comprehensive handover recording.",
  },
  {
    q: "You're self-taught — how do I know the work will be solid?",
    a: 'Look at what shipped: InkTwin (live SaaS), PrimuezSure (live SaaS), the Odoo Enterprise architecture presented at a business show in Raipur, and the CA Automation Suite. Self-taught means I learned by building resilient, production-grade systems.',
  },
  {
    q: "What if I don't know exactly what I need?",
    a: "That's fine — most clients don't. Click \"Let's Talk\" and describe the operational problem you're trying to solve. I'll respond with a scoped proposal detailing what I'd build, timeline, and exact fixed pricing.",
  },
  {
    q: 'Can you integrate with tools I already use?',
    a: 'Almost certainly yes. If it has an API, webhook, or can export data — I can connect it. Current integrations include Odoo, Zoho, WhatsApp (Evolution API), GST portal, IndiaMART, Kickbox, Cloudflare, Vercel, and Google Workspace.',
  },
  {
    q: 'What happens if something breaks after delivery?',
    a: 'All professional and enterprise builds include 30-day comprehensive bug support and SLA tuning. Monthly retainers include continuous monitoring. Bugs caused by my code are always resolved at zero extra cost within the support window.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes. Pricing is listed in both INR and USD. Communication is async-first and timezone-flexible across US, EU, and APAC time zones. Payment in USD, EUR, or INR is supported.',
  },
  {
    q: 'I have a large multi-department project. Where do I start?',
    a: "Book a scope call via Cal.com or the contact terminal. Large projects are partitioned into scoped phases so you're never paying for everything upfront. We ship Phase 1, verify ROI, and then expand into Phase 2.",
  },
];

export default function FAQIsland() {
  // STRICT RULE: Must default to compact (null) on initial load at all viewports
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto faq-accordion-container">
      {FAQ_DATA.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className={`p-1 rounded-2xl bg-gradient-to-b transition-all duration-300 ${
              isOpen
                ? 'from-cyan/30 via-white/10 to-transparent border border-cyan/40 shadow-[0_10px_30px_rgba(0,240,255,0.15)]'
                : 'from-white/10 via-white/[0.02] to-transparent border border-white/10 hover:border-cyan/30'
            }`}
          >
            <div className="rounded-[calc(1rem-0.25rem)] bg-[#070b12]/95 overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors cursor-pointer gap-4 select-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan text-xs font-bold">
                    [ 0{idx + 1} ]
                  </span>
                  <span className="font-bold text-white text-sm sm:text-base font-sans leading-snug">
                    {item.q}
                  </span>
                </div>
                
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all ${
                  isOpen
                    ? 'border-cyan bg-cyan text-black'
                    : 'border-white/20 bg-white/5 text-zinc-300'
                }`}>
                  {isOpen ? '−' : '+'}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/[0.06] bg-black/40 text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans animate-fadeIn">
                  <p className="border-l-2 border-cyan/40 pl-3.5 py-1">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
