'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { ProjectGroup } from '@/components/projects/ProjectGroup';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { WorkflowCard } from '@/components/projects/WorkflowCard';
import { StockChart } from '@/components/StockChart';
import { YouTubeThumb } from '@/components/YouTubeThumb';
import { ModelViewer } from '@/components/ModelViewer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ShaderBackgroundSection } from '@/components/ShaderBackground';
import { LiquidGlassTitle } from '@/components/ui/liquid-glass-logo';
import { LiquidGlassParallaxSection } from '@/components/ui/liquid-glass-container';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { useUI } from '@/lib/contexts/UIContext';

export const ProjectsSection: React.FC = () => {
  const { isMobile, setModalType } = useUI();
  const [favOpen, setFavOpen] = useState(false);

  return (
    <motion.section 
      id="projects" 
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <LiquidGlassTitle glowColor="rgba(0, 240, 255, 0.25)">
        <SectionHeader number="02" command="> ./projects --all" title="Projects & Automated Systems" />
      </LiquidGlassTitle>
      
      <LiquidGlassParallaxSection parallaxDistance={40}>
        <article aria-labelledby="saas-heading">
          <h2 id="saas-heading" className="sr-only">How do these SaaS products work?</h2>
          <p className="sr-only">InkTwin converts handwriting photos into personal fonts via Cloudflare Workers and AI pipelines, while PrimuezSure delivers AI-powered insurance guidance through an autonomous LLM agent — both deployed on Supabase-backed edge infrastructure.</p>
          <ul className="sr-only">
            <li>Cloudflare Workers</li>
            <li>Supabase</li>
            <li>AI / LLM Agents</li>
            <li>JavaScript</li>
          </ul>
          <ProjectGroup title="SaaS Products" color="cyan">
            <ProjectCard 
              name="InkTwin" 
              url="https://ink-twin.primuez.in"
              desc="Upload a handwriting photo → generates your personal font. Type anything and it looks handwritten, download as PDF. Additional tools include AI homework solver from a photo."
              tags={["Cloudflare Workers", "AI", "JavaScript", "Font Generation"]}
              logoUrl="/logo-inktwin.png"
            />
            <ProjectCard 
              name="PrimuezSure Advisor" 
              url="https://primuezsure.primuez.in"
              desc="AI-powered insurance advisor SaaS. Helps users understand and choose the right insurance coverage via intelligent Q&A."
              tags={["AI Agent", "SaaS", "Cloudflare Workers", "LLM"]}
              logoUrl="/logo-primuezsure.png"
            />
          </ProjectGroup>
        </article>
      </LiquidGlassParallaxSection>

      <LiquidGlassParallaxSection parallaxDistance={50}>
        <article aria-labelledby="advisors-heading">
          <h2 id="advisors-heading" className="sr-only">How do these autonomous AI advisors work?</h2>
          <p className="sr-only">Each advisor ingests real-time data streams through customised financial LLMs, autonomously analyses risk or tax liability, and delivers structured insights — all without human intervention, running on n8n orchestration pipelines.</p>
          <ul className="sr-only">
            <li>Finance AI / LLM Agents</li>
            <li>RAG (Retrieval-Augmented Generation)</li>
            <li>n8n Orchestration</li>
            <li>Real-Time Data APIs</li>
          </ul>
          <ProjectGroup title="Autonomous Advisors" color="amber">
            <ProjectCard 
              name="AI Powered Stock Market Advisor" 
              desc="Intelligent trading and portfolio analysis agent. Monitors real-time market trends, evaluates risks, and provides autonomous stock insights using customized financial LLMs."
              tags={["Finance AI", "Algorithmic Analysis", "LLM Agents", "Real-Time Data"]}
              logoUrl="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=200&h=200&q=80"
            >
              <StockChart />
            </ProjectCard>
            <ProjectCard 
              name="AI Powered Tax Advisor" 
              desc="Automated reasoning engine for complex tax compliance. Consumes raw financial data to predict tax liabilities and autonomously draft compliance workflows for firms."
              tags={["Taxation", "RAG", "Automation", "Compliance"]}
              logoUrl="https://images.unsplash.com/photo-1639322537504-6427a16b0a28?auto=format&fit=crop&w=200&h=200&q=80"
            >
              <YouTubeThumb
                videoId="a41yEmFC7jw"
                url="https://www.youtube.com/watch?v=a41yEmFC7jw"
                label="Watch demo"
              />
            </ProjectCard>
          </ProjectGroup>
        </article>
      </LiquidGlassParallaxSection>

      <LiquidGlassParallaxSection parallaxDistance={45}>
        <article aria-labelledby="automation-heading">
          <h2 id="automation-heading" className="sr-only">How do these automation systems function?</h2>
          <p className="sr-only">These systems utilize event-driven architectures to automate repetitive tasks, featuring token lifecycle management, intelligent multi-model LLM routing, and workflow orchestration for complex business requirements, ensuring reliability through robust local and cloud-based automated pipeline execution logic.</p>
          <ul className="sr-only">
            <li>n8n</li>
            <li>WhatsApp API</li>
            <li>Multi-Model LLM</li>
            <li>Workflow Automation</li>
          </ul>
          <ProjectGroup title="Automation Systems" color="cyan">
            <ProjectCard 
              name="Autonomous Programmatic SEO & GEO Engine (Project GhostRank)" 
              url="https://github.com/Primuez/primuez-seo-vault"
              desc="A self-sustaining headless growth engine running on a Linux VPS. It autonomously polls keywords, invokes LLMs with multi-provider fallbacks (Gemini ⇄ DeepSeek), enforces strict GEO compliance templates (hidden questions, 40-word summaries, semantic markup), and deploys pages to a centralized GitHub Vault CDN."
              tags={["Node.js / Bash", "Gemini & DeepSeek APIs", "Linux Crontab", "Git Automation", "Programmatic SEO", "GEO compliance"]}
            />
            <ProjectCard 
              name="AI WhatsApp Agent" 
              desc="Semi-autonomous conversational AI agent with full token lifecycle management. Handles 60-day token expiry and auto-refresh entirely through n8n."
              tags={["n8n", "WhatsApp", "Evolution API", "Token Automation"]}
              videoUrl="https://youtu.be/r31--1h7FV0?si=P7Rm8En5NSSU4MgL"
            />
            <ProjectCard 
              name="CA Automation Suite" 
              desc="Full workflow automation for Chartered Accountants: GST filing automation, AI Legal Advisor, Tax Advisor, and Invoice Generator."
              tags={["n8n", "RAG", "AI Agents", "GST Automation", "Finance"]}
            />
            <ProjectCard 
              name="Multi-Model AI System" 
              desc="Local LLM orchestration with intelligent fallback logic. Primary model failure → auto-switches to fallback model. Supports DeepSeek-R1, LLaMA3, Mistral, Qwen3 via Ollama."
              tags={["Ollama", "Multi-Model", "Fallback Logic", "LLM Orchestration"]}
            />
          </ProjectGroup>
        </article>
      </LiquidGlassParallaxSection>
      
      <LiquidGlassParallaxSection parallaxDistance={45}>
        <article aria-labelledby="enterprise-heading">
          <h2 id="enterprise-heading" className="sr-only">How does the enterprise architecture function?</h2>
          <p className="sr-only">Our enterprise architecture streamlines manufacturing operations by integrating ERP systems with AI lead-capture, automated email verification, and continuous synchronization, effectively replacing manual routing with intelligent, error-free automated workflows that manage complex industrial business requirements and daily reconciliation.</p>
          <ul className="sr-only">
            <li>Odoo ERP</li>
            <li>n8n</li>
            <li>Enterprise Automation</li>
            <li>Lead Management</li>
          </ul>
          <ProjectGroup title="Enterprise Architecture" color="cyan">
            <div className="md:col-span-2">
              <ProjectCard 
                name="The Autonomous Enterprise Blueprint — Odoo + n8n" 
                desc="Production-ready automation architecture engineered for manufacturing businesses in the Raipur Industrial Corridor. Integrates IndiaMART lead capture → Kickbox email verification → Odoo CRM injection → WhatsApp greeting → manufacturing order creation → daily automated GST reconciliation. Designed to eliminate the 'Human Router Model' entirely."
                tags={["n8n", "Odoo ERP", "GST Automation", "IndiaMART", "Enterprise"]}
                bannerUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=400&q=80"
              />
            </div>
            
            <div className="md:col-span-2 mt-4 flex justify-center">
              <GlassButton 
                size="lg"
                onClick={() => setModalType('workflow')}
                glowColor="rgba(0, 240, 255, 0.2)"
                className="w-full md:w-auto glass-btn-glow text-cyan hover:text-white"
              >
                <Activity size={18} /> View Interactive Architecture Diagram
              </GlassButton>
            </div>
          </ProjectGroup>
        </article>
      </LiquidGlassParallaxSection>

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
                  className="text-2xl font-bold mb-4 font-sans border-l-4 border-cyan pl-4"
                >
                  Interactive 3D Orchestration Core
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="text-text-muted mb-6 leading-relaxed"
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
              <div>
                <ErrorBoundary>
                  <ModelViewer />
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
    </motion.section>
  );
};
