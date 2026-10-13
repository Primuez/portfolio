import { useState } from 'react';

interface Project {
  name: string;
  url?: string;
  status: string;
  desc: string;
  techDetails: string;
  tags: string[];
  logoUrl?: string;
  bannerUrl?: string;
  colSpan?: string;
  hasCustomBtn?: boolean;
}

interface ProjectCategory {
  title: string;
  tagline: string;
  projects: Project[];
}

const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    title: "SaaS & Programmatic SEO Products",
    tagline: "Live, production-grade applications serving real users and generating traffic.",
    projects: [
      {
        name: "InkTwin",
        url: "https://ink-twin.primuez.in",
        status: "Live",
        desc: "For students, creators, and professionals who want to automate manual writing — instantly convert text to your custom handwriting font to effortlessly generate documents.",
        techDetails: "Generates custom handwriting fonts from a photo. Performs OCR and stroke vectorization using Hono on Cloudflare Workers, storing user state in D1 and files in R2 CDN. Includes AI solver powered by Gemini API.",
        tags: ["Cloudflare Workers", "AI", "JavaScript", "Font Generation"],
        logoUrl: "/logo-inktwin.png"
      },
      {
        name: "PrimuezSure Advisor",
        url: "https://primuezsure.primuez.in",
        status: "Live",
        desc: "For insurance advisors who need instant, multilingual policy decoding and automated fraud prevention, built securely on official data.",
        techDetails: "Integrates Retrieval-Augmented Generation (RAG) over PDF insurance policy clauses. Built on Cloudflare Workers with serverless vector embeddings for sub-second multilingual response times.",
        tags: ["AI Agent", "SaaS", "Cloudflare Workers", "LLM"],
        logoUrl: "/logo-primuezsure.png"
      },
      {
        name: "GhostRank SEO Engine",
        url: "https://github.com/Primuez/primuez-seo-vault",
        status: "Built",
        desc: "A self-sustaining headless growth engine running on a Linux VPS. It autonomously polls keywords, invokes LLMs with fallbacks, and deploys pages to a GitHub CDN.",
        techDetails: "Utilizes crontab jobs to trigger keyword research scripts. Orchestrates API fallback logic between Gemini and DeepSeek models, generates markup pages, commits to git, and pushes updates to a CDN.",
        tags: ["Node.js / Bash", "Gemini & DeepSeek", "Git Automation", "Programmatic SEO"]
      }
    ]
  },
  {
    title: "Autonomous AI Agents",
    tagline: "Intelligent cognitive layers that query compliance/legal frameworks and execute stack workflows.",
    projects: [
      {
        name: "Autonomous ITC Guard & Vendor Recovery Suite",
        status: "Production Built",
        desc: "Autonomous tax audit and working capital preservation agent. Reconciles purchase ledgers against GSTR-2B to enforce Section 16(2)(aa) compliance, halts payment to defaulting suppliers, and drafts itemized legal recovery notices.",
        techDetails: "Built in n8n with Gemini 3.8 Flash, fuzzy invoice reconciliation, and penny-rounding tolerance. Queries live vendor GSTIN filings via self-hosted SearXNG, generating CFO audit briefings, withholding schedules, and automated WhatsApp/Email chase notices.",
        tags: ["n8n", "Gemini 3.8 Flash", "GST Section 16(2)(aa)", "SearXNG", "WhatsApp API", "Autonomous Agent"]
      },
      {
        name: "Pre-Liquidity Wealth & M&A Advisory Engine",
        status: "Production Built",
        desc: "Autonomous M&A advisory engine for business owners ($2M–$100M ARR) and RIAs. Ingests financial statements to synthesize institutional valuation spreads, comps, and pre-exit estate tax shelters (QSBS, SLAT, GRAT) in 60 seconds.",
        techDetails: "Routes balance sheets and cap tables through Mistral OCR. Couples LangChain deterministic calculators (Rule of 40, concentration risk) with Gemini Pro synthesis. Benchmarks live sector ARR/EBITDA multiples via Composio MCP and SearXNG.",
        tags: ["n8n", "Mistral OCR", "Composio MCP", "LangChain", "M&A Valuation", "SearXNG"]
      },
      {
        name: "Autonomous Real Estate Due Diligence & Underwriting Agent",
        status: "Production Built",
        desc: "24/7 autonomous underwriting analyst and speed-to-lead conversion engine for brokerages. Ingests property listings to execute institutional underwriting (NOI, Cap Rate, DSCR, cash flow) and cross-monetizes internal inventory within seconds.",
        techDetails: "Evaluates listing URLs (Zillow/Redfin) via n8n Assistant and self-hosted SearXNG. Runs leveraged debt-service calculations, identifies negative leverage risks, and executes automatic buyer intent scoring (Hot/Warm/Cold) with CRM ingestion.",
        tags: ["n8n", "SearXNG", "Real Estate AI", "Institutional Underwriting", "Speed-to-Lead", "Autonomous Agent"]
      },
      {
        name: "Voice AI Agent",
        status: "Production Built",
        desc: "A voice-first agent that listens, reasons, and autonomously executes multi-step tasks across your stack while you keep your hands free.",
        techDetails: "Ties real-time audio WebSockets to TTS and STT engines. Processes incoming commands through n8n tool-calling agents to execute operations across business apps.",
        tags: ["Voice AI", "LLM", "n8n", "Real-Time"],
        logoUrl: "/voice-ai-agent.png"
      }
    ]
  },
  {
    title: "Custom Automations & Enterprise Systems",
    tagline: "Bespoke integrations connecting ERP platforms, lead pipelines, and physical checkpoints.",
    projects: [
      {
        name: "Invoice Generator",
        status: "Built",
        desc: "Automated system that compiles data and builds professional PDF invoices.",
        techDetails: "Pulls order/delivery data from ERP webhooks, formats it according to GST template specifications, compiles the PDF via dynamic HTML-to-PDF APIs, and routes it to WhatsApp/email.",
        tags: ["n8n", "Node.js", "PDF generation"]
      },
      {
        name: "Odoo Eye Attendance",
        status: "Built",
        desc: "AI-powered camera attendance system that logs check-ins directly into Odoo ERP.",
        techDetails: "Captures face signatures locally on edge cameras, evaluates them using OpenCV, and calls Odoo JSON-RPC API via n8n to log employee attendance in real-time.",
        tags: ["Odoo ERP", "Computer Vision", "n8n", "Python"]
      },
      {
        name: "The Autonomous Enterprise Blueprint",
        status: "Architecture Blueprint — Available to Build",
        desc: "End-to-end automation architecture designed for manufacturing businesses: IndiaMART lead capture → email verification → Odoo CRM → WhatsApp follow-up → order creation → GST reconciliation.",
        techDetails: "Integrates IndiaMART webhook API, Kickbox email validation, Odoo CRM API calls, WhatsApp Evolution API message queues, Odoo manufacturing order triggers, and daily automated GST ledger reconciliation workflows. Presented at Odoo Business Show, Raipur.",
        tags: ["n8n", "Odoo ERP", "GST Automation", "IndiaMART", "Enterprise", "Architecture Blueprint"],
        hasCustomBtn: true
      }
    ]
  }
];

export default function ProjectsIsland() {
  // All categories strictly default to compact (closed) on initial load at all viewports
  const [openCategories, setOpenCategories] = useState<{ [key: number]: boolean }>({});

  const toggleCategory = (idx: number) => {
    setOpenCategories((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const openWorkflowModal = () => {
    window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'workflow' } }));
  };

  return (
    <div className="space-y-10 projects-stack-container pb-8">
      {PROJECT_CATEGORIES.map((cat, idx) => {
        const isOpen = !!openCategories[idx];
        return (
          <div
            key={idx}
            style={{
              top: `${80 + idx * 24}px`,
            }}
            className="sticky project-deck-card p-1.5 rounded-[2rem] bg-gradient-to-b from-white/10 via-white/[0.03] to-transparent border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300 hover:border-cyan/40 mb-8 backdrop-blur-2xl"
          >
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#070b12]/95 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCategory(idx)}
                className="w-full p-6 sm:p-7 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cyan/5 transition-colors select-none cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-cyan text-[10px] tracking-widest uppercase bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded">
                      DECK_0{idx + 1} // ARCHITECTURE
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      [{cat.projects.length} VERIFIED SYSTEMS]
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-sans">
                    {cat.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed font-sans max-w-2xl">
                    {cat.tagline}
                  </p>
                </div>
                
                {/* Nested Island Button Pill (High-End-Visual-Design) */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <div className="px-4 py-2 rounded-full border border-cyan/40 bg-cyan/10 text-cyan font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-2 group-hover:bg-cyan group-hover:text-black transition-all">
                    <span>{isOpen ? 'Collapse Category' : 'Inspect Systems'}</span>
                    <span className="text-xs transition-transform duration-200">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 bg-black/40 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                  {cat.projects.map((project, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-1 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                    >
                      <div className="p-5 rounded-[calc(1rem-0.25rem)] bg-[#090e18] flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            {project.logoUrl ? (
                              <img
                                src={project.logoUrl}
                                alt={project.name}
                                className="w-8 h-8 rounded object-contain bg-white/5 p-1"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xl">⚡</span>
                            )}
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              {project.status}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white font-sans mb-1.5 leading-snug">
                            {project.name}
                          </h4>

                          <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-sans">
                            {project.desc}
                          </p>

                          <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.04] mb-4">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-cyan block mb-1">
                              VERIFIED STACK ARCHITECTURE //
                            </span>
                            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                              {project.techDetails}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.02]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan hover:text-white font-bold transition-colors"
                            >
                              <span>Visit Live System</span>
                              <span>↗</span>
                            </a>
                          )}

                          {project.hasCustomBtn && (
                            <button
                              type="button"
                              onClick={openWorkflowModal}
                              className="w-full mt-2 py-2.5 px-3 bg-cyan/15 hover:bg-cyan hover:text-black border border-cyan/40 text-cyan rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                            >
                              <span>⚙ View Architecture Diagram</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
