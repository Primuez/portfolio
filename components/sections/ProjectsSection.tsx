'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useInView } from 'motion/react';
import { Activity } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { WorkflowCard } from '@/components/projects/WorkflowCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';
import { useIsMobile } from '@/hooks/use-mobile';

const ModelViewer = dynamic(
  () => import('@/components/ModelViewer').then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
        <span className="font-mono text-xs text-cyan tracking-widest animate-pulse">LOADING GLOBE…</span>
      </div>
    ),
  }
);

import { LiquidGlassTitle } from '@/components/ui/liquid-glass-logo';
import { LiquidGlassParallaxSection } from '@/components/ui/liquid-glass-container';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { useUI } from '@/lib/contexts/UIContext';
import { trackEvent } from '@/lib/analytics';

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
        name: "Tax Advisor Agent",
        status: "Built",
        desc: "Automated reasoning engine for complex tax compliance. Consumes raw financial data to predict tax liabilities and autonomously draft compliance workflows for firms.",
        techDetails: "Uses advanced financial prompt-chains to ingest GST/tax sheets and cross-reference them with regional tax rules. Generates structured JSON reports for Odoo or custom ledgers.",
        tags: ["Taxation", "RAG", "Automation", "Compliance"],
        logoUrl: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        name: "Legal Advisor Agent",
        status: "Built",
        desc: "Autonomous legal Q&A assistant trained on regulatory guidelines and contracts.",
        techDetails: "Uses RAG models to parse Indian legal acts, contract drafts, and corporate bylaws. Generates structured risk summaries and contract redlines with citation tracking.",
        tags: ["Legal AI", "Contract Analysis", "LLM"],
        logoUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        name: "Voice AI Agent",
        status: "Built",
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
        bannerUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=400&q=80",
        colSpan: "md:col-span-2 lg:col-span-3",
        hasCustomBtn: true
      }
    ]
  }
];

function ProjectCategoryBlock({ category, index, total }: { category: ProjectCategory; index: number; total: number }) {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const { setModalType } = useUI();

  // Track the scroll of this category relative to the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  // Scale down and fade as the card scrolls up under the next cards
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0.88]);
  const filter = useTransform(scrollYProgress, [0.75, 1], ["brightness(1)", "brightness(0.7)"]);

  const yOffset = index * 24; // cascading layout spacing on desktop

  const motionStyle = isMobile ? {} : {
    position: 'sticky' as const,
    top: `${90 + yOffset}px`,
    scale,
    opacity,
    filter
  };

  return (
    <motion.div 
      ref={cardRef}
      style={motionStyle}
      className="border border-white/10 rounded-2xl bg-[#090b11] backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-cyan/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-8"
    >
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cyan/5 transition-colors select-none min-h-[80px] cursor-pointer"
      >
        <div>
          <span className="font-mono text-cyan text-[10px] tracking-widest uppercase block mb-1">0{index + 1} // PORTFOLIO CATEGORY</span>
          <h3 className="text-xl font-bold text-white tracking-wide font-sans">{category.title}</h3>
          <p className="text-text-muted text-xs md:text-sm mt-1 leading-relaxed font-sans">{category.tagline}</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-cyan shrink-0">
          <span>{expanded ? '▼ Hide Projects' : '▶ Show Projects'}</span>
        </div>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/5 bg-black/25 overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.projects.map((project, pIdx) => (
                <div key={pIdx} className={project.colSpan || ''}>
                  <ProjectCard {...project}>
                    {project.hasCustomBtn && (
                      <div className="mt-4 flex justify-center">
                        <GlassButton 
                          size="lg"
                          onClick={() => { trackEvent('click_project_architecture'); setModalType('workflow'); }}
                          glowColor="rgba(0, 240, 255, 0.2)"
                          className="w-full md:w-auto glass-btn-glow text-cyan hover:text-white relative z-20 cursor-pointer"
                        >
                          <Activity size={18} /> View Interactive Architecture Diagram
                        </GlassButton>
                      </div>
                    )}
                  </ProjectCard>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const ProjectsSection: React.FC = () => {
  const { isMobile } = useUI();
  const [favOpen, setFavOpen] = useState(false);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const isGlobeInView = useInView(globeContainerRef, { once: true, margin: "200px" });

  return (
    <section id="projects" className="pt-16 md:pt-32">
      <LiquidGlassTitle glowColor="rgba(0, 240, 255, 0.25)">
        <SectionHeader number="02" command="> ./projects --what-i-built" title="What I've Actually Built and Shipped" />
      </LiquidGlassTitle>
      
      <p className="text-text-muted mt-4 mb-8 max-w-2xl text-base leading-relaxed font-sans">
        No fake case studies. These are real products and agents I built, own, and run. Expand any category, and toggle details on cards to see full architecture.
      </p>

      <LiquidGlassParallaxSection parallaxDistance={30}>
        {/* Categories Stack with scroll-driven cascading sticky pin on desktop */}
        <div className={`flex flex-col gap-0 mt-8 ${isMobile ? '' : 'pb-[10vh]'}`}>
          {PROJECT_CATEGORIES.map((category, index) => (
            <ProjectCategoryBlock 
              key={index} 
              category={category} 
              index={index} 
              total={PROJECT_CATEGORIES.length} 
            />
          ))}
        </div>
      </LiquidGlassParallaxSection>

      {/* Credibility Line */}
      <div className="mt-6 text-center">
        <p className="font-mono text-xs text-amber border border-amber/35 bg-amber/5 px-4 py-3 rounded-lg inline-block shadow-[0_0_15px_rgba(245,166,35,0.1)]">
          🛡️ Presented automation architecture publicly at Odoo Business Show, Raipur.
        </p>
      </div>
      
      <div className="mt-12 md:mt-24 pt-10 md:pt-16 relative">
        {!isMobile && (
          <section aria-labelledby="interactive-heading">
            <div className="shader-section-divider absolute top-0 left-0 right-0" />
            <h2 id="interactive-heading" className="sr-only">Interactive 3D Elements & Personal Favourites</h2>
            <SectionHeader number="02.1" command="> ./render --3d" title="Interactive Elements & Favorites" />
            
            <div className="grid md:grid-cols-2 gap-12 mt-12 mb-16 items-center">
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="text-2xl font-bold mb-4 font-sans border-l-4 border-cyan pl-4 text-white"
                >
                  Interactive 3D Orchestration Core
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="text-text-muted mb-6 leading-relaxed font-sans"
                >
                  Hover and grab the core object to rotate. This interactive 3D model powered by Three.js and React Three Fiber serves as an abstraction of my n8n central orchestrator—routing payloads, scaling compute, and connecting multiple AI pipelines.
                </motion.p>
                <ul className="space-y-2 font-mono text-xs text-text-muted">
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span> @react-three/fiber processing
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse delay-75"></span> MeshDistortMaterial applied
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse delay-150"></span> Interactive rotation axes mapped
                  </motion.li>
                </ul>
              </div>
              <div ref={globeContainerRef}>
                <ErrorBoundary>
                  {isGlobeInView ? (
                    <ModelViewer />
                  ) : (
                    <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,240,255,0.1)] bg-bg flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
                      <span className="font-mono text-xs text-cyan tracking-widest">LOADING GLOBE…</span>
                    </div>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </section>
        )}

        <div className={isMobile ? "" : "mt-16"}>
          <button
            onClick={() => setFavOpen(o => !o)}
            className="w-full flex items-center justify-between py-3 px-4 min-h-[48px] font-mono text-xs uppercase tracking-[0.2em] text-cyan border border-cyan/20 rounded-lg bg-panel/40 hover:bg-cyan/5 transition-colors cursor-pointer"
          >
            <span>▸ MY PERSONAL FAVOURITES</span>
            <span>{favOpen ? '▲' : '▼'}</span>
          </button>
          {favOpen && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-[2000px] mt-6">
              <WorkflowCard 
                name="Daily AI News Agent" 
                desc="Gives me signal from the noise, tells me its use cases for AI news both international & national, and generates a TTS voice note of the entire news."
                image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&h=600&q=80"
                delay={0}
                videoUrl="https://youtu.be/mCPMyZor1nw?si=OqMp4jCl0_U9lRPF"
              />
              <WorkflowCard 
                name="Personal Jarvis (Updated)" 
                desc="For extra daily needs, my updated personal jarvis orchestrates everything I need in a unified environment."
                image="https://images.unsplash.com/photo-1639322537231-2f206e06af84?auto=format&fit=crop&w=800&h=600&q=80"
                delay={100}
              />
              <WorkflowCard 
                name="n8n Updates Tester" 
                desc="Used for testing new n8n updates. It is the most easy and quick to use workflow."
                image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&h=600&q=80"
                delay={200}
              />
              <WorkflowCard 
                name="Drive & Docs Agent" 
                desc="Additional workflow to manage my drives, docs, and emails. Can be sent to WhatsApp and controlled via SAM."
                image="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&h=600&q=80"
                delay={300}
              />
              <WorkflowCard 
                name="AI Outreach & Follow-up" 
                desc="One of my most complex and useful workflows—from AI cold outreach to strategic follow-ups, automated replies, and all extras."
                image="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&h=600&q=80"
                delay={400}
              />
              <WorkflowCard 
                name="Search MCP & Image Gen" 
                desc="My additional searching MCP combined with image generation. Fully automated and can be sent to WhatsApp controlled via SAM."
                image="https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&w=800&h=600&q=80"
                delay={500}
              />
              <WorkflowCard 
                name="AI Presentation Generator" 
                desc="Free Gemma-alternative AI presentation generator capable of creating unlimited presentations. Can be sent to WhatsApp controlled via SAM."
                image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&h=600&q=80"
                delay={600}
              />
              <WorkflowCard 
                name="Voice AI Agent" 
                desc="Doesn't just talk — it does the work for you. A voice-first agent that listens, reasons, and autonomously executes multi-step tasks across your stack while you keep your hands free."
                image="/voice-ai-agent.png"
                delay={700}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
