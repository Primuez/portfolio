import { useState } from 'react';

interface WorkflowItem {
  name: string;
  desc: string;
  image: string;
  videoUrl?: string;
}

const FAVORITES: WorkflowItem[] = [
  {
    name: "Autonomous ITC Guard & Vendor Chase",
    desc: "Enforces GST Section 16(2)(aa) compliance by reconciling purchase ledgers with GSTR-2B. Identifies trapped working capital, locks defaulting vendor payments, and automates legal recovery notices via WhatsApp & Email.",
    image: "https://images.pexels.com/photos/8927657/pexels-photo-8927657.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Pre-Liquidity Wealth & M&A Engine",
    desc: "Institutional M&A advisory engine for $2M-$100M ARR founders. Ingests financial statements via Mistral OCR, calculates Rule of 40 & concentration risk, and structures pre-exit tax shelters (QSBS/SLAT/GRAT).",
    image: "https://images.pexels.com/photos/5561915/pexels-photo-5561915.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Real Estate Underwriting & Lead Engine",
    desc: "24/7 autonomous underwriting analyst for brokerages. Computes NOI, Cap Rate, DSCR, and cash flow on property URLs, cross-monetizes internal inventory, and qualifies leads under a 5-minute speed-to-lead rule.",
    image: "https://images.pexels.com/photos/8954109/pexels-photo-8954109.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Daily AI News Agent",
    desc: "Gives me signal from the noise, tells me its use cases for AI news both international & national, and generates a TTS voice note of the entire news.",
    image: "https://images.pexels.com/photos/7865064/pexels-photo-7865064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    videoUrl: "https://youtu.be/mCPMyZor1nw?si=OqMp4jCl0_U9lRPF",
  },
  {
    name: "Personal Jarvis (Updated)",
    desc: "For extra daily needs, my updated personal jarvis orchestrates everything I need in a unified environment.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "n8n Updates Tester",
    desc: "Used for testing new n8n updates. It is the most easy and quick to use workflow.",
    image: "https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Drive & Docs Agent",
    desc: "Additional workflow to manage my drives, docs, and emails. Can be sent to WhatsApp and controlled via SAM.",
    image: "https://images.pexels.com/photos/7654452/pexels-photo-7654452.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "AI Outreach & Follow-up",
    desc: "One of my most complex and useful workflows—from AI cold outreach to strategic follow-ups, automated replies, and all extras.",
    image: "https://images.pexels.com/photos/8284724/pexels-photo-8284724.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Search MCP & Image Gen",
    desc: "My additional searching MCP combined with image generation. Fully automated and can be sent to WhatsApp controlled via SAM.",
    image: "https://images.pexels.com/photos/17279851/pexels-photo-17279851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "AI Presentation Generator",
    desc: "Free Gemma-alternative AI presentation generator capable of creating unlimited presentations. Can be sent to WhatsApp controlled via SAM.",
    image: "https://images.pexels.com/photos/8761324/pexels-photo-8761324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "PrimuezSure Policy Auditor",
    desc: "Autonomous health insurance policy auditor. Scans multi-page policy PDFs to expose hidden room-rent sub-limits, disease copays, and claim traps before you file.",
    image: "https://images.pexels.com/photos/7734574/pexels-photo-7734574.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "HackPulse Radar",
    desc: "Resilient autonomous hackathon ingestion pipeline. Ingests 44+ live hackathons with automated schema circuit breakers and deploy guards.",
    image: "https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Multimodal AI Expense Tracker",
    desc: "Telegram-first financial logging agent. Ingests audio voice memos, photographed physical receipts, and text notes, parsing GST and categorizing into Google Sheets.",
    image: "https://images.pexels.com/photos/7680741/pexels-photo-7680741.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    name: "Voice AI Agent",
    desc: "Doesn't just talk — it does the work for you. A voice-first agent that listens, reasons, and autonomously executes multi-step tasks across your stack while you keep your hands free.",
    image: "https://images.pexels.com/photos/765139/pexels-photo-765139.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
];

export default function FavoritesIsland() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-12 md:mt-16">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 px-5 min-h-[52px] font-mono text-xs uppercase tracking-[0.2em] text-cyan border border-cyan/30 rounded-xl bg-panel/60 hover:bg-cyan/10 transition-all cursor-pointer shadow-lg"
      >
        <span className="font-bold">▸ MY PERSONAL FAVOURITES (14 WORKFLOW SHOWCASES)</span>
        <span className="text-sm font-bold">{open ? '▲ Collapse' : '▼ Expand'}</span>
      </button>

      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {FAVORITES.map((wf, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-panel/80 border border-white/10 hover:border-cyan/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full overflow-hidden bg-black/50 relative">
                  <img
                    src={wf.image}
                    alt={wf.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent"></div>
                  {wf.videoUrl && (
                    <a
                      href={wf.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white font-mono text-[10px] uppercase rounded flex items-center gap-1 font-bold shadow"
                    >
                      <span>▶ Video</span>
                    </a>
                  )}
                </div>

                <div className="p-5">
                  <h4 className="text-base font-bold text-white font-sans mb-2 group-hover:text-cyan transition-colors">
                    {wf.name}
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                    {wf.desc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-cyan/80">
                  SYS // VERIFIED WORKFLOW
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
