'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Cpu, Zap, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useIsMobile } from '@/hooks/use-mobile';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Service {
  icon: string;
  title: string;
  outcome: string;
  desc: string;
  tags: string[];
  honestLabel?: string;
}

interface ServiceCategory {
  id: string;
  slotNumber: string;
  title: string;
  tagline: string;
  statusText: string;
  services: Service[];
}

const SERVICES_CATEGORIES: ServiceCategory[] = [
  {
    id: "automation-systems",
    slotNumber: "BLADE_01 // AUTO_SYSTEMS",
    title: "Business Automation & Workflow Systems",
    tagline: "Stop doing repetitive work manually. Custom n8n pipelines that execute 24/7.",
    statusText: "PIPELINES // ONLINE",
    services: [
      {
        icon: "⚙️",
        title: "n8n Workflow Automation",
        outcome: "Manual processes run themselves",
        desc: "Eliminate manual lead capture, CRM injection, automated email sequences, GST reconciliation, and WhatsApp outreach to save hours of daily work.",
        tags: ["n8n", "Webhooks", "API Chains", "Scheduling"]
      },
      {
        icon: "🔗",
        title: "Custom API & Webhook Integration",
        outcome: "Any system connected to any other",
        desc: "Connect ERPs, CRMs, WhatsApp, payment gateways, and government portals into a unified workflow with robust error handling and fail-safes.",
        tags: ["REST APIs", "Webhooks", "OAuth 2.0", "Fallback Logic"]
      },
      {
        icon: "🏢",
        title: "Enterprise Architecture (Odoo + IndiaMART + GST)",
        outcome: "Automated manufacturing sales pipeline",
        desc: "Automate manufacturing sales pipelines. Connect IndiaMART leads directly to Odoo CRM and set up daily automated GST reconciliation using n8n.",
        tags: ["Odoo ERP", "n8n", "IndiaMART", "Enterprise Architecture"],
        honestLabel: "Built to order — architecture ready"
      },
      {
        icon: "💼",
        title: "CA Automation & Compliance Suite",
        outcome: "Automated firm operations & filing",
        desc: "Automate CA firm efficiency with AI Legal Advisor, Tax Advisor Agent, and Invoice Generator tools for frictionless compliance.",
        tags: ["Taxation", "AI Legal", "Invoice Gen", "Compliance"]
      },
      {
        icon: "💬",
        title: "AI WhatsApp Business Agent",
        outcome: "24/7 lead qualification & follow-up",
        desc: "Engage leads and automate customer follow-ups 24/7 via semi-autonomous conversational agents featuring auto-token refresh lifecycles.",
        tags: ["WhatsApp API", "Evolution API", "n8n", "Lead Nurture"]
      }
    ]
  },
  {
    id: "ai-agents",
    slotNumber: "BLADE_02 // AGENT_RACK",
    title: "Autonomous AI Agents & Voice Systems",
    tagline: "Hands-free AI agents that think, reason, and execute actions across your stack.",
    statusText: "LLM REASONER // ACTIVE",
    services: [
      {
        icon: "🎙️",
        title: "Voice AI Customer Agents",
        outcome: "Voice agent that listens, reasons & acts",
        desc: "Execute complex tasks hands-free with voice-first agents that listen, reason via LLMs, and take real-time actions across your internal apps.",
        tags: ["Voice AI", "LLM Agents", "Real-Time Action", "n8n"]
      },
      {
        icon: "⚖️",
        title: "Tax & Legal Reasoning Agents",
        outcome: "Autonomous legal & tax compliance analysis",
        desc: "Automated reasoning engines that parse raw financial/legal data, forecast liabilities, and draft compliance documents with strict precision.",
        tags: ["Taxation AI", "RAG", "Legal Reasoning", "Document Synthesis"]
      },
      {
        icon: "🧠",
        title: "Multi-Model AI Orchestrator",
        outcome: "Zero-downtime model switching",
        desc: "Orchestrate local LLMs (DeepSeek-R1, LLaMA3, Qwen) with intelligent fallback logic that switches models automatically if primary providers fail.",
        tags: ["Ollama", "Multi-Model", "Auto-Fallback", "Local LLM"]
      }
    ]
  },
  {
    id: "ai-content",
    slotNumber: "BLADE_03 // MEDIA_ENGINE",
    title: "AI Content & Media Generation",
    tagline: "Generate original audio, video creatives, and marketing collateral at scale.",
    statusText: "GENERATOR // STANDBY",
    services: [
      {
        icon: "🎵",
        title: "AI Music Generation Pipelines",
        outcome: "Original audio tracks, zero licensing fees",
        desc: "Generate original background music, jingles, and brand tracks on demand. Suno-powered pipelines that are batch-ready and copyright-clean.",
        tags: ["Suno AI", "AI Audio", "Batch Processing", "Brand Audio"]
      },
      {
        icon: "🎬",
        title: "AI Video Ad & Clip Generator",
        outcome: "High-converting UGC ad creatives",
        desc: "Produce script-to-video ads, product demos, and social content automatically without studio production crews or expensive video teams.",
        tags: ["UGC Ads", "AI Video", "Script-to-Video", "Content Automation"]
      }
    ]
  },
  {
    id: "saas-development",
    slotNumber: "BLADE_04 // SAAS_CORE",
    title: "SaaS MVPs & Programmatic Growth Engines",
    tagline: "From idea to live production software. Global scale, edge infrastructure.",
    statusText: "EDGE_DEPLOY // READY",
    services: [
      {
        icon: "🚀",
        title: "Full-Stack SaaS MVP Build",
        outcome: "Production software in 4-6 weeks",
        desc: "Launch your custom SaaS product globally with zero server maintenance overhead. Built on Cloudflare Workers edge runtime for maximum speed.",
        tags: ["Next.js", "Hono", "Cloudflare Workers", "SaaS MVP"]
      },
      {
        icon: "📈",
        title: "GhostRank SEO Automation Engine",
        outcome: "Hands-off organic search domination",
        desc: "Self-sustaining search traffic engine that polls keywords, generates GEO-compliant landing pages via DeepSeek/Gemini, and pushes to CDN.",
        tags: ["Programmatic SEO", "GEO Compliance", "Git Automation", "Linux VPS"]
      }
    ]
  }
];

function CyberBlade({
  category,
  index,
  isFocused,
  anyFocused,
  onToggle,
  onWorkWithMe
}: {
  category: ServiceCategory;
  index: number;
  isFocused: boolean;
  anyFocused: boolean;
  onToggle: () => void;
  onWorkWithMe: () => void;
}) {
  const isMobile = useIsMobile();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || anyFocused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 8,
      y: (x / rect.width) * 8
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      layout
      className="cyber-blade-item w-full relative mb-4"
      animate={{
        scale: isFocused ? (isMobile ? 1.01 : 1.03) : (anyFocused ? 0.95 : 1),
        opacity: isFocused ? 1 : (anyFocused ? 0.35 : 1),
        filter: anyFocused && !isFocused ? 'grayscale(100%)' : 'grayscale(0%)',
        zIndex: isFocused ? 30 : 10 - index,
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: (!isMobile && !anyFocused && (tilt.x !== 0 || tilt.y !== 0))
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : undefined,
          transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out' : 'none'
        }}
        className={`group relative rounded-2xl bg-[#090c15]/90 backdrop-blur-xl border overflow-hidden transition-all duration-300 ${
          isFocused
            ? 'border-cyan shadow-[0_0_40px_rgba(0,240,255,0.25),0_0_15px_rgba(0,240,255,0.4)] ring-1 ring-cyan/40'
            : 'border-white/[0.08] hover:border-cyan/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Top glowing server rack accent line */}
        <div className={`h-[2px] w-full transition-all duration-500 ${
          isFocused ? 'bg-gradient-to-r from-cyan via-emerald-400 to-cyan' : 'bg-white/5 group-hover:bg-cyan/40'
        }`} />

        {/* Blade Header Bar */}
        <button
          onClick={onToggle}
          type="button"
          className="w-full p-5 md:p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 select-none min-h-[68px] cursor-pointer"
        >
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <span className="font-mono text-[10px] tracking-widest text-cyan uppercase bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded">
                {category.slotNumber}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/50 tracking-wider">
                <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-cyan animate-pulse' : 'bg-emerald-500'}`} />
                {category.statusText}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white tracking-wide font-sans flex items-center gap-2">
              {category.title}
            </h3>

            <p className="text-text-muted text-xs md:text-sm mt-1 leading-relaxed font-sans">
              {category.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <span className="font-mono text-[10px] uppercase text-white/40 hidden sm:inline-block">
              {isFocused ? 'COLLAPSE VAULT' : 'EXPAND SYSTEM'}
            </span>
            <motion.div
              animate={{ rotate: isFocused ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                isFocused
                  ? 'border-cyan text-cyan bg-cyan/15 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'border-white/10 text-white/60 bg-white/5 group-hover:border-cyan/40 group-hover:text-cyan'
              }`}
            >
              <Plus className="w-5 h-5" />
            </motion.div>
          </div>
        </button>

        {/* Expanded Content Area */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden"
            >
              <div className="p-5 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.services.map((service, sIdx) => (
                    <motion.div
                      key={sIdx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sIdx * 0.08, duration: 0.35 }}
                      className="group/card bg-[#0b0f19] border border-white/[0.08] hover:border-cyan/40 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] flex flex-col justify-between min-h-[220px]"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-xl shrink-0 group-hover/card:border-cyan/30 transition-colors">
                            {service.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {service.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Zap className="w-3 h-3 text-cyan" />
                              <span className="font-mono text-[9px] uppercase tracking-wider text-cyan/90 font-medium">
                                {service.outcome}
                              </span>
                            </div>
                          </div>
                        </div>

                        {service.honestLabel && (
                          <div className="mb-3 font-mono text-[9px] uppercase text-amber border border-amber/30 bg-amber/5 px-2.5 py-1 rounded-md flex items-center gap-1.5 w-fit">
                            <ShieldAlert className="w-3 h-3 text-amber" />
                            {service.honestLabel}
                          </div>
                        )}

                        <p className="text-text-muted text-xs leading-relaxed mb-4 font-sans">
                          {service.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                        {service.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/5 text-white/60 bg-white/[0.02]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Call to action bar for this category */}
                <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-cyan/[0.02] p-4 rounded-xl border border-cyan/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                    <Sparkles className="w-4 h-4 text-cyan" />
                    <span>Need a custom build in this category? Let&apos;s map your workflow.</span>
                  </div>
                  <button
                    onClick={onWorkWithMe}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-cyan/10 hover:bg-cyan/20 border border-cyan/40 text-cyan text-xs font-mono tracking-wider uppercase font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
                  >
                    <span>Request Custom System</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ServicesSection({ onWorkWithMe }: { onWorkWithMe: () => void }) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Entrance Animation (3D fly in from Z-axis)
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cyber-blade-item',
        {
          opacity: 0,
          scale: 0.6,
          y: 120,
          rotateX: 15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="pt-16 md:pt-32 relative">
      <div className="relative z-10">
        <SectionHeader
          number="03"
          command="> ./services --what-i-build-for-you"
          title="What I Build For You"
        />
        <h2 id="services-heading" className="sr-only">
          What services does Primuez offer for AI automation and SaaS development?
        </h2>

        <p className="text-text-muted mt-4 mb-8 max-w-2xl text-base leading-relaxed font-sans">
          Every system below is built to eliminate manual work. Select any category blade to expand details and inspect capabilities.
        </p>

        {/* 3D Cyber-Blade Accordion Container */}
        <div ref={containerRef} className="flex flex-col mt-8">
          {SERVICES_CATEGORIES.map((category, index) => (
            <CyberBlade
              key={category.id}
              category={category}
              index={index}
              isFocused={activeCategory === index}
              anyFocused={activeCategory !== null}
              onToggle={() => setActiveCategory(activeCategory === index ? null : index)}
              onWorkWithMe={onWorkWithMe}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
