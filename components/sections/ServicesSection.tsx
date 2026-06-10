'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { SectionHeader } from '@/components/SectionHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface Service {
  icon: string;
  title: string;
  outcome: string;
  desc: string;
  tags: string[];
  honestLabel?: string;
}

interface ServiceCategory {
  title: string;
  tagline: string;
  services: Service[];
}

const SERVICES_CATEGORIES: ServiceCategory[] = [
  {
    title: "Business Automation & Workflow Systems",
    tagline: "Stop doing repetitive work manually. I build systems that run 24/7.",
    services: [
      {
        icon: "⚙️",
        title: "n8n Workflow Automation",
        outcome: "Your manual processes run themselves",
        desc: "Eliminate manual lead capture, CRM injection, email sequences, GST reconciliation, and WhatsApp outreach to save hours of daily work. Powered by custom n8n pipelines that replace repetitive tasks.",
        tags: ["n8n", "Webhooks", "API Chains", "Scheduling"]
      },
      {
        icon: "🔗",
        title: "Custom API Integration",
        outcome: "Any system connected to any other",
        desc: "Connect your ERP, CRM, WhatsApp, payment gateways, and government portals into a unified workflow. Wire any system with an API or webhook using robust error handling and fallback logic.",
        tags: ["REST APIs", "Webhooks", "OAuth", "API Integrations"]
      },
      {
        icon: "🏢",
        title: "Enterprise Architecture (Odoo + IndiaMART + GST)",
        outcome: "Fully automated manufacturing pipeline",
        desc: "Automate your manufacturing sales pipeline and back-office operations. Connect IndiaMART leads directly to Odoo CRM and set up daily GST reconciliation using n8n.",
        tags: ["Odoo ERP", "n8n", "IndiaMART", "Enterprise"],
        honestLabel: "Built to order — architecture ready"
      },
      {
        icon: "💼",
        title: "CA Automation Suite",
        outcome: "Automated tax compliance & tools",
        desc: "Increase firm efficiency and automate tax compliance. AI Legal Advisor, Tax Advisor Agent, and Invoice Generator tools built and working. GST filing automation pipeline architecture designed and available on request.",
        tags: ["Taxation", "AI Legal", "Invoice Gen", "n8n"]
      },
      {
        icon: "💬",
        title: "AI WhatsApp Agent",
        outcome: "Automate customer follow-ups 24/7",
        desc: "Engage leads and automate customer follow-ups 24/7. Semi-autonomous conversational agent featuring automatic 60-day token refresh lifecycle managed entirely through n8n.",
        tags: ["WhatsApp", "Evolution API", "n8n", "Automated Follow-ups"]
      }
    ]
  },
  {
    title: "AI Agents & Intelligent Systems",
    tagline: "Hands-free AI that thinks and acts for you across your tools.",
    services: [
      {
        icon: "🎙️",
        title: "Voice AI Agents",
        outcome: "An agent that listens, reasons & acts",
        desc: "Execute complex tasks across your stack completely hands-free. Voice-first agents that listen, reason via LLMs, and take action. Deployable to WhatsApp, web, or phone.",
        tags: ["Voice AI", "LLM", "n8n", "Real-Time"]
      },
      {
        icon: "⚖️",
        title: "Tax & Legal Advisor Agents",
        outcome: "Autonomous legal & tax compliance analysis",
        desc: "Speed up complex compliance and legal analysis. Automated reasoning engines that consume raw financial/legal data, predict liabilities, and draft documents autonomously.",
        tags: ["Taxation AI", "RAG", "Legal Advisor", "Compliance"]
      },
      {
        icon: "🧠",
        title: "Multi-Model AI System",
        outcome: "Zero-downtime model orchestration",
        desc: "Ensure zero downtime for your AI systems. Orchestrate local LLMs (DeepSeek-R1, LLaMA3, Qwen3) with intelligent fallback logic that switches models automatically if primary fails.",
        tags: ["Ollama", "Multi-Model", "Fallback Logic", "Inference"]
      }
    ]
  },
  {
    title: "AI Content Generation",
    tagline: "Create professional music, videos, and ads automatically.",
    services: [
      {
        icon: "🎵",
        title: "AI Music Generation",
        outcome: "Original tracks on demand, zero licensing fees",
        desc: "Generate original background music, jingles, and brand tracks on demand without licensing fees. Automated Suno-powered pipelines that are batch-ready and copyright-clean.",
        tags: ["Suno", "AI Audio", "Automation", "Content"]
      },
      {
        icon: "🎬",
        title: "AI Video / Movie Clips",
        outcome: "UGC-style ad creatives at scale",
        desc: "Produce script-to-video ads, product demos, and social content automatically. AI-generated scripts, voiceovers, and visuals batch-produced without a production crew.",
        tags: ["UGC Ads", "AI Video", "Content Automation"]
      }
    ]
  },
  {
    title: "SaaS & Product Development",
    tagline: "From idea to live product. Fast, global, low-cost.",
    services: [
      {
        icon: "🚀",
        title: "SaaS MVP Build",
        outcome: "A working product your users can log into",
        desc: "Launch your custom SaaS product globally in 4-6 weeks with zero server maintenance. Full-stack applications built on Cloudflare Workers (InkTwin and PrimuezSure are live examples).",
        tags: ["Next.js", "Hono", "Cloudflare Workers", "SaaS"]
      },
      {
        icon: "📈",
        title: "GhostRank SEO Engine",
        outcome: "Hands-off organic traffic generation",
        desc: "Grow search traffic organically without paying for content writers. Self-sustaining engine that polls keywords, generates GEO-compliant pages via DeepSeek/Gemini, and pushes to a Git CDN.",
        tags: ["Programmatic SEO", "GEO Compliance", "Git Automation", "Linux VPS"]
      }
    ]
  }
];

function ServiceCategoryBlock({
  category,
  index,
  isFocused,
  anyFocused,
  onToggle,
}: {
  category: ServiceCategory;
  index: number;
  isFocused: boolean;
  anyFocused: boolean;
  onToggle: () => void;
}) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll animation: only active when NO category is focused
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start center"]
  });

  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.85],
    [index % 2 === 0 ? -25 : 25, 0]
  );
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.85],
    [index % 2 === 0 ? -80 : 80, 0]
  );
  const opacityScroll = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const scaleScroll = useTransform(scrollYProgress, [0, 0.85], [0.95, 1]);

  // Framer Motion variants for Focus Mode (Horizontal Dispersion & Digital Dissolve)
  const variants = {
    normal: {
      height: 'auto',
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      marginBottom: 24,
      display: 'block',
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    },
    hidden: {
      height: 0,
      opacity: 0,
      scale: 0.9,
      x: index % 2 === 0 ? -200 : 200, // horizontal dispersion!
      y: 0,
      marginBottom: 0,
      transitionEnd: { display: 'none' },
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }
    },
    focused: {
      height: 'auto',
      opacity: 1,
      scale: 1.02, // slightly bigger neon frame
      x: 0,
      y: 0,
      marginBottom: 24,
      display: 'block',
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const activeVariant = anyFocused ? (isFocused ? 'focused' : 'hidden') : 'normal';

  // Under normal scrolling (no focus active), apply 3D transform on desktop
  const style3D = (!isMobile && !anyFocused) ? {
    rotateY,
    x: translateX,
    transformPerspective: 1200,
    scale: scaleScroll,
    opacity: opacityScroll
  } : {};

  return (
    <motion.div
      layout="position"
      variants={variants}
      animate={activeVariant}
      className="w-full"
    >
      <motion.div
        ref={cardRef}
        style={style3D}
        className={`border rounded-2xl bg-[#090b11] backdrop-blur-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 ${
          isFocused 
            ? 'border-cyan/60 shadow-[0_0_30px_rgba(0,240,255,0.15)] ring-1 ring-cyan/30' 
            : 'border-white/10 hover:border-cyan/35'
        }`}
      >
        <button 
          onClick={onToggle}
          className="w-full p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cyan/5 transition-colors select-none min-h-[80px] cursor-pointer"
        >
          <div>
            <span className="font-mono text-cyan text-[10px] tracking-widest uppercase block mb-1">
              {isFocused ? '← BACK TO CATEGORIES' : `0${index + 1} // CATEGORY`}
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide font-sans flex items-center gap-2">
              {isFocused && <span className="text-cyan animate-pulse">●</span>}
              {category.title}
            </h3>
            <p className="text-text-muted text-xs md:text-sm mt-1 leading-relaxed font-sans">{category.tagline}</p>
          </div>
          <div className={`flex items-center gap-2 font-mono text-[10px] uppercase border px-3 py-1.5 rounded-lg transition-all duration-300 ${
            isFocused 
              ? 'text-amber border-amber/30 bg-amber/5 shadow-[0_0_15px_rgba(245,166,35,0.1)] hover:bg-amber/10' 
              : 'text-cyan border-cyan/20 bg-cyan/5 hover:bg-cyan/15 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]'
          }`}>
            <span>{isFocused ? 'CLOSE ×' : 'EXPLORE ➔'}</span>
          </div>
        </button>
        
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="border-t border-white/5 bg-black/25 overflow-hidden"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-[1000px]">
                {category.services.map((service, sIdx) => (
                  <motion.div
                    key={sIdx}
                    initial={{ opacity: 0, y: 30, rotateX: -15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, rotateX: 10, scale: 0.95 }}
                    transition={{ delay: sIdx * 0.06 + 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="bg-panel border border-white/[0.05] rounded-xl p-5 hover:border-cyan/25 hover:shadow-[0_0_20px_rgba(0,240,255,0.05)] transition-all duration-300 flex flex-col min-h-[220px]"
                  >
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-xl shrink-0">
                        {service.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5 flex-wrap">
                          {service.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                          <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">{service.outcome}</span>
                        </div>
                      </div>
                    </div>
                    
                    {service.honestLabel && (
                      <div className="mb-3 font-mono text-[9px] uppercase text-amber border border-amber/30 bg-amber/5 px-2 py-1 rounded-md inline-block w-fit">
                        ⚠️ {service.honestLabel}
                      </div>
                    )}

                    <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1 font-sans">
                      {service.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {service.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/5 text-text-muted bg-white/[0.01]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection({ onWorkWithMe }: { onWorkWithMe: () => void }) {
  const [activeCategory, setActiveCategory] = React.useState<number | null>(null);

  return (
    <section id="services" className="pt-16 md:pt-32 relative">
      <div className="relative z-10">
        <SectionHeader number="03" command="> ./services --what-i-build-for-you" title="What I Build For You" />
        <h2 id="services-heading" className="sr-only">What services does Primuez offer for AI automation and SaaS development?</h2>
        
        <p className="text-text-muted mt-4 mb-8 max-w-2xl text-base leading-relaxed font-sans">
          Every service below is a working system built to automate manual work. Pick a category, expand to scan capabilities, and select what your workflow needs.
        </p>

        {/* Categories Stack with scroll-driven alternating Y-axis swing and horizontal dispersion */}
        <div className="flex flex-col mt-8 perspective-[1500px]">
          {SERVICES_CATEGORIES.map((category, index) => (
            <ServiceCategoryBlock 
              key={index} 
              category={category} 
              index={index} 
              isFocused={activeCategory === index}
              anyFocused={activeCategory !== null}
              onToggle={() => setActiveCategory(activeCategory === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
