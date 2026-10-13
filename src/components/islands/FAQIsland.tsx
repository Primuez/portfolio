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
    a: 'Micro-Builds are delivered in 2–4 days. Professional Automation projects take 5–10 days. Premium AI Integration or SaaS MVPs take 2–4 weeks depending on scope. Timeline is agreed before work begins — no vague "it depends."',
  },
  {
    q: 'Do I need to manage you or check in constantly?',
    a: "No. You describe the outcome you need, I ask any clarifying questions upfront, then disappear and build. You get async updates and a final handover call. You don't need to know how any of it works technically.",
  },
  {
    q: "You're self-taught — how do I know the work will be solid?",
    a: 'Look at what shipped: InkTwin (live SaaS), PrimuezSure (live SaaS), the Odoo Enterprise architecture presented at a business show in Raipur, and the CA Automation Suite (AI Legal and Tax advisors built and working). Self-taught means I learned by building real systems, not passing exams. The credentials section has the verifiable proof.',
  },
  {
    q: "What if I don't know exactly what I need?",
    a: 'That\'s fine — most clients don\'t. Click the "Let\'s Talk" button and describe the problem you\'re trying to solve, not the solution. I\'ll come back with a scoped proposal including what I\'d build and which tier it falls under.',
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
    a: 'Book a scope call via the "Let\'s Talk" button or schedule directly on Cal.com. Large projects are broken into scoped phases so you\'re never paying for everything upfront. We agree on Phase 1, I build it, you see it working — then we plan Phase 2.',
  },
];

export default function FAQIsland() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {FAQ_DATA.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-panel/80 overflow-hidden transition-all duration-200 hover:border-cyan/30"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors cursor-pointer gap-4"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-white text-sm sm:text-base font-sans leading-snug">
                {item.q}
              </span>
              <span className="text-cyan font-mono text-sm shrink-0">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/[0.04] text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
