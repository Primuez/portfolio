'use client';

import { motion, AnimatePresence, useScroll, useSpring, useTransform, useVelocity, useMotionValue, useMotionTemplate, useInView, animate, MotionValue } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code2, Link as IconLink, 
  MapPin, CheckCircle2, ChevronRight, ChevronDown,
  MonitorPlay, Youtube, Github, Twitter, Instagram, Linkedin, Send,
  Star, GitFork, Activity, Download
} from 'lucide-react';
import { StockChart } from '@/components/StockChart';
import { YouTubeThumb } from '@/components/YouTubeThumb';
import { ModelViewer } from '@/components/ModelViewer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ShaderBackground, ShaderBackgroundSection } from '@/components/ShaderBackground';
import { ShaderText, ShaderLogo, ShaderGlowLine, ShaderIridescentText } from '@/components/ShaderText';
import { ShaderLogoGlow } from '@/components/ShaderLogoGlow';
import { CustomCursor } from '@/components/CustomCursor';
import { HexShaderBackground } from '@/components/HexShaderBackground';
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { LiquidGlassParallaxSection } from '@/components/ui/liquid-glass-container';
import { LiquidGlassLogo, LiquidGlassTitle, GlassRefractionOverlay } from '@/components/ui/liquid-glass-logo';
import { ContainerScroll } from '@/components/ui/container-scroll';
import { HowWeWorkBackground } from '@/components/HowWeWorkBackground';
import dynamic from 'next/dynamic';
const CertPdfViewer = dynamic(() => import('@/components/CertPdfViewer').then(m => m.CertPdfViewer), { ssr: false });
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileStickyCtA } from '@/components/MobileStickyCtA';

import { UIProvider, useUI } from '@/lib/contexts/UIContext';
import { HeroSection } from '@/components/sections/HeroSection';

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export default function Home() {
  return (
    <UIProvider>
      <HomeContent />
    </UIProvider>
  );
}

function HomeContent() {
  const { isMobile, modalType, setModalType, scrolled, certData, setCertData } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  
  // Process section scroll-fill
  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: processScrollY } = useScroll({ target: processRef, offset: ['start 0.8', 'end 0.2'] });
  const lineScale = useTransform(processScrollY, [0, 1], [0, 1]);

  const openCert = (data: {title: string, issuer: string, date: string, id: string, pdfUrl?: string}) => {
    setCertData(data);
    setModalType('cert');
  };

  // Github state
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);

  useEffect(() => {
    // Ensure the page boots at the very top, clearing any hash the browser may have jumped to.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Fetch Github
  useEffect(() => {
    async function loadRepos() {
      try {
        const [res1, res2] = await Promise.all([
          fetch('https://api.github.com/users/primuez/repos?sort=updated&per_page=5'),
          fetch('https://api.github.com/users/primmius/repos?sort=updated&per_page=5')
        ]);
        const data1 = res1.ok ? await res1.json() : [];
        const data2 = res2.ok ? await res2.json() : [];
        
        const combined = [...(Array.isArray(data1) ? data1 : []), ...(Array.isArray(data2) ? data2 : [])]
          .filter(r => !r.fork && !r.name.toLowerCase().includes('first-to-paste-osi-henti'))
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        setRepos(combined);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRepos(false);
      }
    }
    loadRepos();
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Custom cursor & touch response */}
      <CustomCursor />
      {/* Interactive WebGL shader background — renders on desktop only; mobile gets a premium gradient */}
      {isMobile ? (
        <div className="fixed inset-0 z-0 w-full h-full bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0e1a]" />
      ) : (
        <ShaderBackground className="fixed inset-0 z-0 w-full h-full" opacity={0.85} variant="hero" />
      )}
      {/* Interactive liquid glass refraction overlay — responds to cursor/touch */}
      {!isMobile && <GlassRefractionOverlay />}
      {/* Blueprint animated grid overlay */}
      <div className="fixed inset-0 z-[1] bg-blueprint opacity-15 animate-grid pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent'}`}>
        <div className="w-full px-4 sm:px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <div className="font-mono text-cyan text-lg md:text-xl tracking-widest font-bold transition-all duration-300">
            {isMobile ? (
              <LiquidGlassLogo>
                <ShaderLogo>PRIMUEZ</ShaderLogo>
              </LiquidGlassLogo>
            ) : (
              <ShaderLogoGlow>
                <LiquidGlassLogo>
                  <ShaderLogo>PRIMUEZ</ShaderLogo>
                </LiquidGlassLogo>
              </ShaderLogoGlow>
            )}
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 font-mono text-[11px] tracking-widest uppercase text-text-muted">
            <a href="#whoami" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">About</a>
            <a href="#projects" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">Work</a>
            <a href="#services" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">Services</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200 text-amber/80 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-amber after:transition-all after:duration-300 hover:after:w-full">Pricing</a>
            <a href="#stack" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-cyan after:transition-all after:duration-300 hover:after:w-full">Stack</a>
            <a href="#contact" className="hover:text-white transition-colors duration-200 border border-white/20 px-3 py-1 -my-1 rounded hover:border-cyan/50 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)]">Contact</a>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-12 h-12 gap-1.5 z-50 rounded-lg active:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-cyan transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-cyan transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-cyan transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
        {/* Mobile menu drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-bg/95 backdrop-blur-md border-b border-cyan/20 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4 font-mono text-sm tracking-widest uppercase text-text-muted">
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-1">Work</div>
                {['About:#whoami','Projects:#projects','Services:#services','Pricing:#pricing'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-3">Info</div>
                {['Why Us:#why-primuez','Stack:#stack','Credentials:#credentials','FAQ:#faq'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <div className="text-[10px] text-text-muted/50 tracking-[0.3em] mt-3">Connect</div>
                {['GitHub:#github','Videos:#youtube','Contact:#contact'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors pl-2 border-l border-white/10 py-3">{label}</a>
                  );
                })}
                <GlassButton 
                  size="lg"
                  onClick={() => { setMenuOpen(false); setModalType('form'); }}
                  glowColor="rgba(0, 240, 255, 0.3)"
                  className="mt-4 w-full glass-btn-glow text-cyan"
                >
                  Work With Me
                </GlassButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ScrollProgressBar />

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 pb-16 md:pb-32">
        <HeroSection />

        {/* 01. ABOUT */}
        <motion.section 
          id="whoami" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="01" command="> whoami" title="About" />
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center">
                <h2 className="text-[2.5rem] leading-[1.1] md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <ShaderIridescentText as="span" className="text-[2.5rem] leading-[1.1] md:text-6xl lg:text-7xl font-bold">Architecting Autonomy</ShaderIridescentText>
                </h2>
                <p className="text-text-muted text-sm md:text-lg max-w-2xl leading-relaxed">
                  Turning repetitive business operations into systems that run themselves.
                </p>
              </div>
            }
          >
            {/* Card content: Bio + Info Grid */}
            <div className="flex flex-col h-full justify-between gap-6 text-left">
              <div className="space-y-4 max-w-3xl">
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                  I&apos;m <strong className="text-cyan font-mono">Rahul Kasturiya (Primuez)</strong> — I design systems that use tools, adapt, and execute workflows autonomously. Your leads, invoices, follow-ups, and reports flow without anyone touching a keyboard.
                </p>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  My work sits at the intersection of <strong className="text-white">n8n orchestration</strong>, <strong className="text-white">LLM agent design</strong>, and <strong className="text-white">Cloudflare-based deployment</strong>. I&apos;ve built SaaS products, enterprise automation architectures, and client-facing AI systems that run 24/7 without manual intervention.
                </p>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  I think in systems before I write a single line of logic. I build for modularity, fallback reliability, and zero manual intervention.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 border-t border-zinc-700/60">
                <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Education</span>
                  <span className="text-zinc-200 text-xs font-medium">KPS, Dunda · SSIPS (BCA)</span>
                </div>
                <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Experience</span>
                  <span className="text-zinc-200 text-xs font-medium">AI Automation · Since July 2025</span>
                </div>
                <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Location</span>
                  <span className="text-zinc-200 text-xs font-medium flex items-center gap-1"><MapPin size={10} /> Indore, MP, India</span>
                </div>
                <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/40">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">Languages</span>
                  <span className="text-zinc-200 text-xs font-medium">Hindi · English C2 · Sindhi C2</span>
                </div>
              </div>
              {/* Personal backstory — relocated from hero/above-fold */}
              <div className="pt-4 border-t border-zinc-700/40">
                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed italic">
                  Self-taught. No CS degree. No team. Everything here was built by doing — from central India, one system at a time.
                </p>
              </div>
            </div>
          </ContainerScroll>
        </motion.section>

        {/* 02. PROJECTS */}
        <motion.section 
          id="projects" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <LiquidGlassTitle glowColor="rgba(0, 240, 255, 0.25)">
            <SectionHeader number="02" command="> ./projects --all" title="Projects & Automated Systems" />
          </LiquidGlassTitle>
          
          <LiquidGlassParallaxSection parallaxDistance={40}>
          <ProjectGroup title="SaaS Products" color="cyan">
            <ProjectCard 
              name="InkTwin" 
              url="https://ink-twin.primueztech.workers.dev"
              desc="Upload a handwriting photo → generates your personal font. Type anything and it looks handwritten, download as PDF. Additional tools include AI homework solver from a photo."
              tags={["Cloudflare Workers", "AI", "JavaScript", "Font Generation"]}
              logoUrl="/logo-inktwin.png"
            />
            <ProjectCard 
              name="PrimuezSure Advisor" 
              url="https://primuezsure-advisor.primueztech.workers.dev"
              desc="AI-powered insurance advisor SaaS. Helps users understand and choose the right insurance coverage via intelligent Q&A."
              tags={["AI Agent", "SaaS", "Cloudflare Workers", "LLM"]}
              logoUrl="/logo-primuezsure.png"
            />
          </ProjectGroup>
          </LiquidGlassParallaxSection>

          <LiquidGlassParallaxSection parallaxDistance={50}>
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
          </LiquidGlassParallaxSection>

          <LiquidGlassParallaxSection parallaxDistance={45}>
          <ProjectGroup title="Automation Systems" color="cyan">
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
          </LiquidGlassParallaxSection>
          
          <LiquidGlassParallaxSection parallaxDistance={45}>
          <ProjectGroup title="Enterprise Architecture" color="cyan">
            <div className="md:col-span-2">
              <ProjectCard 
                name="The Autonomous Enterprise — Odoo + n8n" 
                desc="Full automation architecture for manufacturing businesses in the Raipur Industrial Corridor. Pipeline: IndiaMART lead capture → Kickbox email verification → Odoo CRM injection → WhatsApp greeting → manufacturing order creation → daily automated GST reconciliation → e-way bill generation. Eliminated the 'Human Router Model' entirely."
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
          </LiquidGlassParallaxSection>

          {/* NEW SECTION: VISUAL WORKFLOWS & 3D ELEMENTS */}
          <div className="mt-12 md:mt-24 pt-10 md:pt-16 relative">
            {/* 3D Globe subsection — desktop only (too heavy for mobile GPU) */}
            {!isMobile && (
              <>
                <div className="shader-section-divider absolute top-0 left-0 right-0" />
                <SectionHeader number="02.1" command="> ./render --3d" title="Interactive Elements & Favorites" />
                
                <div className="grid md:grid-cols-2 gap-12 mt-12 mb-16 items-center">
                  <div>
                    <motion.h3
                      initial={{ filter: 'blur(10px)', opacity: 0 }}
                      whileInView={{ filter: 'blur(0px)', opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="text-2xl font-bold mb-4 font-sans border-l-4 border-cyan pl-4"
                    >
                      Interactive 3D Orchestration Core
                    </motion.h3>
                    <motion.p
                      initial={{ filter: 'blur(10px)', opacity: 0 }}
                      whileInView={{ filter: 'blur(0px)', opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="text-text-muted mb-6 leading-relaxed"
                    >
                      Hover and grab the core object to rotate. This interactive 3D model powered by Three.js and React Three Fiber serves as an abstraction of my n8n central orchestrator—routing payloads, scaling compute, and connecting multiple AI pipelines.
                    </motion.p>
                    <ul className="space-y-2 font-mono text-xs text-text-muted">
                      <motion.li
                        initial={{ filter: 'blur(10px)', opacity: 0 }}
                        whileInView={{ filter: 'blur(0px)', opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span> @react-three/fiber processing
                      </motion.li>
                      <motion.li
                        initial={{ filter: 'blur(10px)', opacity: 0 }}
                        whileInView={{ filter: 'blur(0px)', opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse delay-75"></span> MeshDistortMaterial applied
                      </motion.li>
                      <motion.li
                        initial={{ filter: 'blur(10px)', opacity: 0 }}
                        whileInView={{ filter: 'blur(0px)', opacity: 1 }}
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
              </>
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

        {/* 03. SERVICES */}
        <BlueprintServicesSection onWorkWithMe={() => setModalType('form')} />

        {/* HOW WE WORK */}
        <motion.section
          id="process"
          className="pt-16 md:pt-32 relative overflow-hidden"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <HowWeWorkBackground />
          <div ref={processRef} className="relative z-10">
          <SectionHeader number="03.1" command="> ./process --steps" title="How We Usually Work Together" />
          <div className="mt-12 relative max-w-3xl">
            {/* Spine - desktop only */}
            <div className="hidden md:block">
              {/* Grey track */}
              <div className="absolute left-7 top-10 bottom-10 w-px bg-white/10" />
              {/* Cyan fill */}
              <motion.div
                className="absolute left-7 top-10 bottom-10 w-px bg-gradient-to-b from-cyan to-cyan/20"
                style={{ scaleY: lineScale, transformOrigin: 'top' }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-8 md:space-y-10">
              {[
                { step: '01', title: 'Discovery', desc: 'You describe your goal or the process that\u2019s slowing you down.', icon: '\u25CE' },
                { step: '02', title: 'Proposal', desc: 'I send a clear scope with a fixed price. No hourly surprises. (1\u20132 days)', icon: '\u25A4' },
                { step: '03', title: 'Build & Iterate', desc: 'I build in small iterations and share progress with you throughout.', icon: '\u27F3' },
                { step: '04', title: 'Handover', desc: 'Live system + full documentation + a training session so you own it completely.', icon: '\u2197' },
                { step: '05', title: 'Support', desc: '30 days of free bug fixes and adjustments included after launch.', icon: '\u25C8' },
              ].map(({ step, title, desc, icon }) => (
                <ProcessStep key={step} step={step} title={title} desc={desc} icon={icon} />
              ))}
            </div>
          </div>
          <p className="mt-8 font-mono text-xs text-text-muted tracking-widest uppercase">[ Most projects go live in 1–4 weeks. ]</p>
          </div>
        </motion.section>

        {/* WHY PRIMUEZ */}
        <section id="why-primuez" className="pt-16 md:pt-32">
          <SectionHeader number="03.5" command="> ./why --us" title="Why Primuez?" />
          <p className="text-text-muted mt-4 mb-10 max-w-2xl text-base leading-relaxed">
            Four sharp arguments for working with us — not a pitch deck, just the truth.
          </p>
          <WhyPrimuez />
        </section>

        {/* 04. PRICING */}
        <ReceiptPricingSection />

        {/* 05. GITHUB */}
        <motion.section 
          id="github" 
          className="pt-16 md:pt-32 pb-28 md:pb-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* PR #16: Section-level shader background for GitHub area */}
          {!isMobile && <ShaderBackgroundSection opacity={0.6} />}
          <div className="relative z-10">
          <SectionHeader number="03" command="> curl -s https://api.github.com" title="GitHub Activity" />
          <div className="mt-12">
            {loadingRepos ? (
               <div className="flex flex-col items-center justify-center h-32 gap-4">
               <div className="font-mono text-cyan text-sm tracking-widest animate-pulse">[ FETCHING REPOSITORIES ]</div>
               <div className="w-1/2 max-w-sm h-1 bg-cyan/20 overflow-hidden">
                 <div className="h-full bg-cyan w-1/3 animate-[slide_1.5s_ease-in-out_infinite]"></div>
               </div>
             </div>
            ) : repos.length > 0 ? (
              <LiquidRepoGrid repos={repos} />
            ) : (
              <div className="text-center font-mono text-text-muted p-12 border border-dashed border-cyan/20 rounded-xl bg-panel">
                <span>[ Rate Limited by GitHub API. View profiles directly: ]</span>
                <div className="flex justify-center gap-4 mt-4">
                  <a href="https://github.com/primuez" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">@primuez</a>
                  <a href="https://github.com/primmius" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">@primmius</a>
                </div>
              </div>
            )}
          </div>
          </div>
        </motion.section>

        {/* 04. YOUTUBE CONTENT */}
        <motion.section 
          id="youtube" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="04" command="> ./content --media" title="Video Presentations" />
          <div className="relative mt-12">
            <PhysicsChipsLayer />
            <div className="grid lg:grid-cols-2 gap-8 relative z-0">

              <DropCard delay={0.08} initialRotate={-3}>
                <div className="bg-panel/60 border border-white/[0.06] p-8 rounded-2xl backdrop-blur-lg flex flex-col justify-center items-center text-center font-mono relative overflow-hidden group hover:border-cyan/30 transition-all duration-500 liquid-glass-card">
                  <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent pointer-events-none"></div>
                  <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mb-6 border border-cyan/20">
                    <IconLink className="text-cyan" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-sans">Automating Your Business & Playlists</h3>
                  <p className="text-text-muted mb-8 max-w-sm text-sm">
                    Access my curated playlists for complete run-throughs of the autonomous enterprise model, n8n orchestration setups, and advanced system architecture.
                  </p>
                  <a href="https://www.youtube.com/@Primuez/playlists" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-sm tracking-widest uppercase border border-cyan bg-cyan/5 text-cyan px-8 py-4 rounded-xl hover:bg-cyan/15 hover:border-cyan/80 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] backdrop-blur-sm">
                    View Playlists
                  </a>
                </div>
              </DropCard>

              <DropCard delay={0.24} initialRotate={2.5}>
                <div className="bg-panel/60 border border-white/[0.06] p-8 rounded-2xl backdrop-blur-lg flex flex-col justify-center items-center text-center font-mono relative overflow-hidden group hover:border-cyan/30 transition-all duration-500 liquid-glass-card">
                  <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none"></div>
                  <div className="w-16 h-16 bg-cyan/5 rounded-full flex items-center justify-center mb-6 border border-cyan/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                    <img src="/primuez-icon.svg" alt="Primuez" width={40} height={40} className="rounded-full" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-sans">Subscribe to Primuez</h3>
                  <p className="text-text-muted mb-8 max-w-sm text-sm">
                    Subscribe for detailed walkthroughs of n8n automation deployments, multi-agent AI setups, and live build sessions from scratch.
                  </p>
                  <a href="https://youtube.com/@Primuez" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-sm tracking-widest uppercase border border-red-500/50 hover:border-red-500 text-red-500 px-8 py-4 hover:bg-red-500/10 transition-colors">
                    <MonitorPlay size={16} /> Watch Channel
                  </a>
                </div>
              </DropCard>

            </div>
          </div>
        </motion.section>

        {/* 05. TECH STACK */}
        <motion.section 
          id="stack" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="05" command="> ./stack --verbose" title="Technical Arsenal" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 font-mono">
            <StackGroup title="AI & Orchestration" items={['n8n', 'OpenRouter', 'DeepSeek', 'Mistral', 'LLaMA3', 'Ollama', 'RAG Systems', 'AI Agents']} border="cyan" />
            <StackGroup title="Infra & Deploy" items={['Cloudflare Workers', 'Hostinger VPS', 'Vercel', 'Docker', 'Self-Hosted']} border="amber" />
            <StackGroup title="ERP & Business" items={['Odoo ERP', 'Odoo CRM', 'GST Portal', 'IndiaMART Webhooks', 'Kickbox (Email Vfy)']} border="cyan" />
            <StackGroup title="Dev Languages" items={['JavaScript / Node.js', 'Python', 'Bash / Shell', 'YAML', 'HTTP Proxies']} border="amber" />
          </div>
        </motion.section>

        {/* 06. CREDENTIALS */}
        <motion.section 
          id="credentials" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="06" command="> ./credentials --verified" title="Credentials & Hackathons" />
          
          <RubiksCredentials>
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="flex flex-col gap-4">
              <h3 className="text-amber uppercase font-mono tracking-widest text-sm mb-2 pl-2 border-l-2 border-amber">[ CERTIFICATIONS ]</h3>
              
              <CVAccordion title="n8n Official Certifications">
                <p className="text-sm text-text-muted mb-4">Completed both official n8n course levels demonstrating advanced automation mastery.</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => openCert({title: 'n8n Course Level 1 & 2', issuer: 'n8n', date: 'Verified', id: 'N8N-L1-L2', pdfUrl: '/documents/cert-n8n-1.pdf'})}
                    className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-3 md:py-2 hover:bg-cyan hover:text-bg transition-colors"
                  >View Master Certificate</button>
                </div>
              </CVAccordion>

              <CVAccordion title="SimpliLearn: n8n No Code AI Agent">
                <p className="text-sm text-text-muted mb-4">Certificate #8723146 - Completed Aug 2, 2025.</p>
                <button 
                  onClick={() => openCert({title: 'n8n Course: No Code AI Agent Builder', issuer: 'SimpliLearn SkillUP', date: '2nd August 2025', id: '8723146', pdfUrl: '/documents/cert-n8n-2.pdf'})}
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-3 md:py-2 hover:bg-cyan hover:text-bg transition-colors"
                >View Certificate</button>
              </CVAccordion>

              <CVAccordion title="Outskill: Generative AI Mastermind">
                <p className="text-sm text-text-muted mb-4">Successfully completed Generative AI Mastermind hosted by Vaibhav Sisinty.</p>
                <button 
                  onClick={() => openCert({title: 'Generative AI Mastermind', issuer: 'Outskill by Vaibhav Sisinty', date: 'Verified', id: 'OUT-GENAI-M'})}
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-3 md:py-2 hover:bg-cyan hover:text-bg transition-colors"
                >View Certificate</button>
              </CVAccordion>

              <CVAccordion title="Kaggle × Google: AI Agents Intensive">
                <p className="text-sm text-text-muted mb-4">5-Day AI Agents Intensive Course with Google. Earned Official Badge.</p>
                <button 
                  onClick={() => openCert({title: '5-Day AI Agents Intensive Course with Google', issuer: 'Kaggle & Google', date: 'December 18, 2025', id: 'KAG-GOOG', pdfUrl: '/documents/cert-kaggle-google.pdf#page=2'})}
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-3 md:py-2 hover:bg-cyan hover:text-bg transition-colors"
                >View Badge</button>
              </CVAccordion>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-cyan uppercase font-mono tracking-widest text-sm mb-2 pl-2 border-l-2 border-cyan">[ HACKATHONS & EVENTS ]</h3>
              
              <CVAccordion title="Odoo Business Show — Presenter">
                <p className="text-sm text-text-muted mb-2"><strong>March 18, 2026 · Hotel Babylon Inn, Raipur</strong></p>
                <p className="text-sm text-text-muted">Presented &quot;The Autonomous Enterprise&quot; architecture mapping IndiaMART webhooks to Odoo ERP via n8n.</p>
              </CVAccordion>

              <CVAccordion title="Rilo Hackathon 2026">
                <p className="text-sm text-text-muted mb-4">Jan 10–11, 2026. Built and shipped a live automation workflow. Recognized for technical creativity.</p>
                <button 
                  onClick={() => openCert({title: 'Rilo Hackathon Participant', issuer: 'Rilo', date: 'Jan 11, 2026', id: 'RILO-26', pdfUrl: '/documents/cert-rilo-hackathon.pdf'})}
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-3 md:py-2 hover:bg-cyan hover:text-bg transition-colors"
                >View Certificate</button>
              </CVAccordion>
              
              <CVAccordion title="Arc Hackathon — Agentic Commerce">
                <p className="text-sm text-text-muted mt-2">Built <strong>Primuez Guard</strong> — autonomous trust verification agent.</p>
              </CVAccordion>
            </div>
          </div>
          </RubiksCredentials>
        </motion.section>

        {/* 09. FAQ */}
        <FAQDecryptionSection />

        {/* 10. CONTACT */}
        <motion.section 
          id="contact" 
          className="pt-16 md:pt-32 text-center pb-28 md:pb-20"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="10" command="> ./contact --init" title="Connect" center />
          
          <GravityCollapse onContact={() => setModalType('form')} />
        </motion.section>

      </div>

      {/* Mobile sticky CTA — appears after scrolling past hero */}
      <MobileStickyCtA />

      {/* Scroll to top button */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-11 md:h-11 rounded-full bg-panel/90 border border-cyan/30 backdrop-blur-md flex items-center justify-center text-cyan hover:bg-cyan/10 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 group active:scale-90"
            aria-label="Scroll to top"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:-translate-y-0.5 transition-transform">
              <path d="M8 13V3M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/[0.06] bg-bg relative z-10">
        <div className="w-full px-4 sm:px-6 md:px-12 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="font-mono text-cyan text-lg tracking-widest font-bold"><ShaderLogoGlow><LiquidGlassLogo><ShaderLogo>PRIMUEZ</ShaderLogo></LiquidGlassLogo></ShaderLogoGlow></span>
              <span className="font-mono text-xs text-text-muted">AI Systems & Autonomous Workflows</span>
            </div>
            <div className="flex items-center gap-6 font-mono text-xs text-text-muted">
              <a href="https://github.com/primuez" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-glow-cyan transition-colors duration-200">GitHub</a>
              <a href="https://youtube.com/@Primuez" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-glow-cyan transition-colors duration-200">YouTube</a>
              <a href="https://www.linkedin.com/in/rahul-kasturiya-796910363" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-glow-cyan transition-colors duration-200">LinkedIn</a>
            </div>
            <div className="font-mono text-xs text-text-muted/60">
              &copy; 2026 Primuez &middot; Built with intent.
            </div>
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}
      <AnimatePresence>
        {modalType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setModalType(null)}
          >
            {/* WORK WITH ME FORM MODAL */}
            {modalType === 'form' && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-panel border border-cyan/30 rounded-xl w-full max-w-4xl shadow-[0_0_40px_rgba(0,240,255,0.2)] relative h-[85vh] flex flex-col overflow-hidden"
              >
                <div className="bg-bg/80 border-b border-cyan/20 px-6 py-4 flex justify-between items-center font-mono text-sm">
                  <span className="text-cyan flex items-center gap-2"><Send size={14}/> Send Your Project Details</span>
                  <button onClick={() => setModalType(null)} className="text-text-muted hover:text-white transition-colors">✕ CLOSE</button>
                </div>
                <div className="flex-1 w-full relative bg-bg">
                  <iframe 
                    src="https://n8n.srv923105.hstgr.cloud/form/7af19c92-308e-4232-aab8-368b790c8bc2" 
                    className="absolute inset-0 w-full h-full border-none bg-transparent"
                    title="Work With Me Form"
                  ></iframe>
                </div>
              </motion.div>
            )}

            {/* HTML CERTIFICATE MODAL */}
            {modalType === 'cert' && certData && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0f1520] border-2 border-cyan/50 rounded-lg w-full max-w-3xl shadow-[0_0_60px_rgba(0,240,255,0.15)] relative flex flex-col overflow-hidden"
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
                
                <button onClick={() => setModalType(null)} className="absolute top-3 right-3 min-[375px]:top-4 min-[375px]:right-4 text-text-muted hover:text-white transition-colors z-20"><CheckCircle2 size={24}/></button>

                {certData.pdfUrl ? (
                  <div className="flex flex-col w-full">
                    <div className="px-4 pr-12 pt-6 pb-4 min-[375px]:px-6 min-[375px]:pt-8 font-mono text-xs text-cyan uppercase tracking-widest border-b border-cyan/20 break-words">
                      {certData.title}
                    </div>
                    {isMobile ? (
                      <CertPdfViewer url={certData.pdfUrl!} title={certData.title} />
                    ) : (
                      <iframe
                        src={certData.pdfUrl}
                        className="w-full"
                        style={{ height: '70vh', border: 'none' }}
                        title={certData.title}
                      />
                    )}
                    <div className="flex justify-center py-4 border-t border-white/5">
                      <a
                        href={certData.pdfUrl}
                        download
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-5 py-2 hover:bg-cyan hover:text-bg transition-colors"
                      >
                        <Download size={14} /> Download Certificate
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 min-[375px]:p-5 md:p-7 font-sans">
                    {/* Certificate document — styled like a real certificate */}
                    <div className="relative flex overflow-hidden rounded border-2 border-[#c8a84b] shadow-2xl" style={{ background: '#f9f7f1', minHeight: '380px' }}>
                      
                      {/* Gold corner ornaments */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#c8a84b] z-10 pointer-events-none" />
                      <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#c8a84b] z-10 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#c8a84b] z-10 pointer-events-none" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#c8a84b] z-10 pointer-events-none" />

                      {/* Left navy sidebar */}
                      <div className="hidden sm:flex w-[30%] bg-[#0f2044] flex-col items-center justify-between py-10 px-4 relative overflow-hidden">
                        {/* Diagonal accent stripe */}
                        <div className="absolute top-0 right-0 w-3 h-full bg-[#c8a84b] opacity-80" />
                        <div className="absolute top-0 right-3 w-1 h-full bg-[#c8a84b] opacity-30" />

                        {/* Top issuer name */}
                        <div className="text-center z-10">
                          <div className="text-[#c8a84b] text-[10px] uppercase tracking-[0.3em] mb-1">Issued by</div>
                          <div className="text-white text-sm font-bold leading-tight text-center">{certData.issuer}</div>
                        </div>

                        {/* Centre badge */}
                        <div className="z-10 flex flex-col items-center gap-3">
                          <svg width="80" height="80" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="36" fill="none" stroke="#c8a84b" strokeWidth="2.5"/>
                            <circle cx="40" cy="40" r="29" fill="none" stroke="#c8a84b" strokeWidth="1" strokeDasharray="4 3"/>
                            <circle cx="40" cy="40" r="22" fill="#c8a84b" opacity="0.15"/>
                            <text x="40" y="37" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="serif" letterSpacing="1">CERTIFICATE</text>
                            <text x="40" y="48" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="serif" letterSpacing="1">OF COMPLETION</text>
                            <text x="40" y="59" textAnchor="middle" fill="#c8a84b" fontSize="16">✦</text>
                          </svg>
                        </div>

                        {/* Bottom credential id */}
                        <div className="text-center z-10">
                          <div className="text-[#c8a84b] text-[9px] uppercase tracking-[0.3em] mb-1">Credential ID</div>
                          <div className="text-white/60 text-[10px] font-mono">{certData.id}</div>
                        </div>
                      </div>

                      {/* Right main content */}
                      <div className="flex-1 flex flex-col justify-center px-4 min-[375px]:px-6 md:px-12 py-6 min-[375px]:py-8 md:py-10 relative">
                        {/* VERIFIED watermark stamp */}
                        <div className="absolute bottom-8 right-8 opacity-[0.12] select-none pointer-events-none"
                          style={{ transform: 'rotate(-18deg)' }}>
                          <div className="border-4 border-[#1a5cb0] rounded-full px-5 py-2 text-[#1a5cb0] text-xl font-black tracking-[0.3em]">
                            VERIFIED
                          </div>
                        </div>

                        {/* Certificate of Completion heading */}
                        <div className="mb-3 min-[375px]:mb-6">
                          <p className="text-[#c8a84b] text-[10px] uppercase tracking-[0.35em] font-semibold mb-0.5">Certificate of</p>
                          <h2 className="text-[#0f2044] text-2xl min-[375px]:text-3xl md:text-4xl font-black tracking-wide leading-none" style={{ fontFamily: 'Georgia, serif' }}>COMPLETION</h2>
                        </div>

                        {/* Recipient */}
                        <div className="mb-1">
                          <p className="text-gray-500 text-xs mb-2">This is to certify that</p>
                          <p className="text-gray-900 text-xl min-[375px]:text-2xl md:text-3xl font-bold pb-1 border-b border-dotted border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                            Rahul Kasturiya
                          </p>
                        </div>

                        {/* Course */}
                        <div className="mt-4 mb-5">
                          <p className="text-gray-500 text-xs mb-1">has successfully completed the course</p>
                          <p className="text-[#0f2044] text-base md:text-lg font-bold leading-snug">{certData.title}</p>
                        </div>

                        {/* Footer row */}
                        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-200">
                          <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest">Date Issued</p>
                            <p className="text-gray-700 text-sm font-medium">{certData.date}</p>
                          </div>
                          {/* Signature line */}
                          <div className="text-right">
                            <div className="text-gray-400 text-2xl mb-0.5" style={{ fontFamily: 'cursive' }}>✦</div>
                            <div className="w-24 border-t border-gray-400" />
                            <p className="text-gray-500 text-[10px] mt-1">Authorised Signatory</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* INTERACTIVE WORKFLOW MODAL */}
            {modalType === 'workflow' && (
              <motion.div 
                initial={{ scale: 0.90, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.90, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-bg border border-cyan/30 rounded-xl w-full max-w-6xl shadow-[0_0_80px_rgba(0,240,255,0.15)] relative h-[85vh] overflow-y-auto flex flex-col"
              >
                <div className="sticky top-0 bg-bg/95 border-b border-cyan/20 px-6 py-4 flex justify-between items-center font-mono text-sm z-50 backdrop-blur">
                  <span className="text-cyan flex items-center gap-2"><Activity size={14}/> SYSTEM ARCHITECTURE VIEWER</span>
                  <button onClick={() => setModalType(null)} className="text-text-muted hover:text-white transition-colors border border-white/10 px-3 py-1 rounded">CLOSE</button>
                </div>
                
                <div className="p-8 md:p-12 relative">
                  {/* Subtle grid background on diagram modal */}
                  <div className="absolute inset-0 z-0 bg-blueprint opacity-10" style={{ backgroundSize: '30px 30px' }}></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">The Autonomous Enterprise</h2>
                    <p className="text-text-muted mb-12 max-w-3xl leading-relaxed">This interactive sequence illustrates the automated data pipeline between lead entry, processing, and downstream fulfillment. Replacing human routers with digital operators saves hundreds of hours for manufacturing businesses in the Raipur Corridor.</p>
                    
                    {/* Interactive Flow Diagram */}
                    <div className="flex flex-col items-center gap-0 font-mono text-xs w-full pb-12">
                      
                      {/* Node 1 */}
                      <div className="w-full max-w-lg border border-amber/40 bg-amber/5 rounded-lg p-6 relative group mb-0 shadow-[0_0_15px_rgba(245,166,35,0.05)]">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber rounded-sm flex items-center justify-center text-bg font-bold font-sans">01</div>
                        <h4 className="text-amber text-lg font-bold mb-2">Lead Entry (IndiaMART)</h4>
                        <p className="text-text-muted">A potential customer submits an inquiry on IndiaMART. A webhook immediately pushes the raw payload to the orchestrator.</p>
                      </div>
                      
                      {/* Connector Add Animation */}
                      <div className="h-12 w-[2px] bg-gradient-to-b from-amber/40 to-cyan/40 relative">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
                      </div>
                      
                      {/* Node 2 */}
                      <div className="w-full max-w-2xl border-2 border-cyan bg-cyan/5 rounded-xl p-8 relative shadow-[0_0_30px_rgba(0,240,255,0.1)] my-0">
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyan rounded-sm flex items-center justify-center text-bg font-bold font-sans text-sm outline outline-4 outline-bg">02</div>
                        <h4 className="text-cyan text-xl font-bold mb-2 flex items-center gap-2"><Terminal size={20}/> n8n Central System</h4>
                        <p className="text-text-muted mb-6 text-sm">The payload is parsed, normalized, and logic branches evaluate lead quality. The main data object routes to three parallel subsystems instantly.</p>
                        
                        <div className="flex justify-between items-center px-4 bg-bg/50 py-3 rounded-lg border border-cyan/20">
                          <span className="text-[10px] tracking-widest uppercase text-cyan/70">Raw JSON</span>
                          <div className="h-[1px] flex-1 bg-cyan/20 mx-4 relative overflow-hidden">
                             <div className="absolute top-0 left-0 h-full w-1/4 bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-[slide_1.5s_linear_infinite]"></div>
                          </div>
                          <span className="text-[10px] tracking-widest uppercase text-cyan/70">Parsed Entity</span>
                          <div className="h-[1px] flex-1 bg-cyan/20 mx-4 relative overflow-hidden">
                             <div className="absolute top-0 left-0 h-full w-1/4 bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-[slide_1.5s_linear_infinite_0.5s]"></div>
                          </div>
                          <span className="text-[10px] tracking-widest uppercase text-cyan font-bold block">Execute API</span>
                        </div>
                      </div>
                      
                      <div className="h-10 w-[2px] bg-cyan/40"></div>
                      
                      {/* Parallel Nodes Container */}
                      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative">
                        {/* Splitting lines above (Desktop) */}
                        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[calc(66.666%)] h-[2px] bg-cyan/40"></div>
                        <div className="hidden md:block absolute top-0 left-1/6 w-[2px] h-4 bg-cyan/40"></div>
                        <div className="hidden md:block absolute top-0 right-1/6 w-[2px] h-4 bg-cyan/40"></div>
                        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-cyan/40"></div>

                        {/* Node 3A */}
                        <div className="border border-green-500/40 bg-green-500/5 rounded-lg p-6 relative">
                          <div className="absolute -top-3 -right-3 bg-bg border border-green-500/40 px-2 py-1 text-[10px] text-green-500 rounded">API</div>
                          <h4 className="text-green-500 font-bold mb-3 text-sm">3A. Kickbox Auth</h4>
                          <p className="text-text-muted text-xs leading-relaxed">Verifies the accuracy and deliverability of the email address preventing CRM pollution.</p>
                        </div>
                        
                        {/* Node 3B */}
                        <div className="border border-purple-500/40 bg-purple-500/5 rounded-lg p-6 relative">
                           <div className="absolute -top-3 -right-3 bg-bg border border-purple-500/40 px-2 py-1 text-[10px] text-purple-500 rounded">Odoo</div>
                          <h4 className="text-purple-500 font-bold mb-3 text-sm">3B. CRM Injection</h4>
                          <p className="text-text-muted text-xs leading-relaxed">Lead is injected into the ERP pipeline. Tags, priority state, and contact info are mapped instantly.</p>
                        </div>
                        
                        {/* Node 3C */}
                        <div className="border border-indigo-500/40 bg-indigo-500/5 rounded-lg p-6 relative">
                           <div className="absolute -top-3 -right-3 bg-bg border border-indigo-500/40 px-2 py-1 text-[10px] text-indigo-500 rounded">Evo / WA</div>
                          <h4 className="text-indigo-500 font-bold mb-3 text-sm">3C. WA Greeting</h4>
                          <p className="text-text-muted text-xs leading-relaxed">Dispatches a personalized, automated greeting message and company profile PDF to the prospect.</p>
                        </div>
                      </div>

                      <div className="h-16 w-[2px] bg-gradient-to-b from-cyan/40 to-transparent mt-8"></div>
                      <span className="text-cyan/40 font-mono text-[10px] uppercase tracking-widest border border-cyan/20 px-3 py-1 rounded-full">End of Automated Core Sequence</span>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Subcomponents

function ProcessStep({ step, title, desc, icon }: { step: string; title: string; desc: string; icon: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-30% 0px -30% 0px', once: false });

  return (
    <div ref={ref} className="relative flex items-start">
      {/* Dot on spine - desktop only */}
      <div
        className={`hidden md:block absolute left-5 top-5 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
          inView
            ? 'border-cyan bg-cyan/20 shadow-[0_0_12px_rgba(0,255,255,0.6)]'
            : 'border-zinc-600 bg-zinc-900'
        }`}
      />
      {/* Card */}
      <motion.div
        className="ml-0 md:ml-20 w-full p-5 border border-cyan/15 rounded-lg bg-[#0a0f1a]/70"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">{icon}</span>
          <div>
            <span className="font-mono text-cyan text-xs font-bold">{step}</span>
            <h4 className="font-bold text-white text-sm mt-1 mb-1">{title}</h4>
            <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CVAccordion({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-panel border border-cyan/10 rounded-lg overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`shrink-0 transition-colors ${isOpen ? 'text-amber' : 'text-cyan'}`} size={18} />
          <strong className={`font-sans tracking-wide transition-colors ${isOpen ? 'text-white' : 'text-text-main'} text-sm md:text-base`}>{title}</strong>
        </div>
        <ChevronDown className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 pt-1 ml-9"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GravityCollapse({ onContact }: { onContact: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [reassembling, setReassembling] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('rahulkasturiya420@gmail.com').then(() => {
      setCopied(true);
      if (copyRef.current) clearTimeout(copyRef.current);
      copyRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };
  const isMobile = useIsMobile();

  const reassemble = () => {
    if (reassembling) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setReassembling(true);
    setCollapsed(false);
    timerRef.current = setTimeout(() => {
      setCollapsed(true);
      setReassembling(false);
    }, 2800);
  };

  const reassemblePermanent = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setReassembling(false);
    setCollapsed(false);
    setPermanent(true);
  };

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (copyRef.current) clearTimeout(copyRef.current);
  }, []);
  const xs = isMobile ? 0.45 : 1;
  const ys = isMobile ? 0.7 : 1;

  const headingWords = [
    { text: "Let's", x: -180 * xs, y: 360 * ys, rot: -14, delay: 0.00, cyan: false },
    { text: 'Build', x: -60 * xs, y: 410 * ys, rot: 9, delay: 0.06, cyan: false },
    { text: 'Something', x: 80 * xs, y: 380 * ys, rot: -7, delay: 0.12, cyan: false },
    { text: 'Autonomous.', x: 200 * xs, y: 340 * ys, rot: 16, delay: 0.18, cyan: true },
  ];

  const socials = [
    { icon: <Github size={20} />, label: 'GitHub (primuez)', href: 'https://github.com/primuez', x: -260 * xs, y: 60 * ys, rot: -22, delay: 0.55 },
    { icon: <Github size={20} />, label: 'GitHub (primmius)', href: 'https://github.com/primmius', x: -180 * xs, y: 80 * ys, rot: 14, delay: 0.58 },
    { icon: <Linkedin size={20} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahul-kasturiya-796910363', x: -90 * xs, y: 50 * ys, rot: -9, delay: 0.61 },
    { icon: <Twitter size={20} />, label: 'X / Twitter', href: 'https://x.com/RKasturiya6738', x: 0, y: 90 * ys, rot: 28, delay: 0.64 },
    { icon: <Instagram size={20} />, label: 'Instagram', href: 'https://www.instagram.com/primuez5', x: 100 * xs, y: 60 * ys, rot: -18, delay: 0.67 },
    { icon: <span className="font-bold text-lg leading-none">k</span>, label: 'Ko-fi', href: 'https://ko-fi.com/primuez', x: 190 * xs, y: 80 * ys, rot: 11, delay: 0.70 },
    { icon: <span className="font-bold text-lg leading-none">Up</span>, label: 'Upwork', href: 'https://www.upwork.com/freelancers/~012ee7737a8d40746f', x: 270 * xs, y: 50 * ys, rot: -25, delay: 0.73 },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-[70vh] md:min-h-[85vh] overflow-hidden"
      onViewportEnter={() => { if (!permanent) setCollapsed(true); }}
      viewport={{ amount: 0.4, once: true }}
    >
      <div className="text-center pt-12 pointer-events-none">
        <div className="text-3xl md:text-5xl font-bold mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 leading-tight">
          {headingWords.map((w, i) => (
            <FallingPiece
              key={i}
              container={containerRef}
              collapsed={collapsed}
              dx={w.x}
              dy={w.y}
              rotate={w.rot}
              delay={w.delay}
              className={w.cyan ? 'text-cyan' : ''}
            >
              <span className="inline-block px-1">{w.text}</span>
            </FallingPiece>
          ))}
        </div>

        <FallingPiece container={containerRef} collapsed={collapsed} dx={-140 * xs} dy={300 * ys} rotate={-6} delay={0.28}>
          <p className="text-text-muted max-w-2xl mx-auto px-4 bg-bg/40 backdrop-blur-sm rounded-md py-2">
            Open to freelance projects, automation consulting, SaaS collabs, and enterprise systems. Drop an inquiry or book a synchronous demo.
          </p>
        </FallingPiece>

        <div className="mt-10 flex justify-center">
          <FallingPiece container={containerRef} collapsed={collapsed} dx={120 * xs} dy={240 * ys} rotate={12} delay={0.4}>
            <GlassButton
              size="lg"
              onClick={onContact}
              glowColor="rgba(0, 240, 255, 0.3)"
              className="glass-btn-glow text-cyan hover:text-white"
            >
              <Send size={16} /> Work With Me
            </GlassButton>
          </FallingPiece>
        </div>

        <div className="mt-12 flex justify-center">
          <FallingPiece container={containerRef} collapsed={collapsed} dx={-200 * xs} dy={180 * ys} rotate={-11} delay={0.48}>
            <p className="font-mono text-sm bg-bg/40 backdrop-blur-sm rounded-md px-3 py-2 flex items-center gap-2 flex-wrap justify-center">
              Or direct comm-link: <a href="mailto:rahulkasturiya420@gmail.com" className="text-amber hover:text-white transition-colors py-2 md:py-0">rahulkasturiya420@gmail.com</a>
              <button
                onClick={copyEmail}
                className={`inline-flex items-center gap-1 px-3 py-2 md:px-2 md:py-0.5 rounded border text-[10px] uppercase tracking-widest transition-all duration-200 ${copied ? 'border-cyan/60 text-cyan bg-cyan/10' : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/70'}`}
                aria-label="Copy email address"
              >
                {copied ? '✓ copied' : 'copy'}
              </button>
            </p>
          </FallingPiece>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {socials.map((s, i) => (
            <FallingPiece key={i} container={containerRef} collapsed={collapsed} dx={s.x} dy={s.y} rotate={s.rot} delay={s.delay}>
              <SocialIcon icon={s.icon} label={s.label} href={s.href} />
            </FallingPiece>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan/[0.04] to-transparent" />

      <AnimatePresence>
        {collapsed && !permanent && (
          <motion.div
            key="reassemble-group"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-10 z-[60] flex flex-col items-center gap-2"
          >
            <button
              onClick={reassemble}
              disabled={reassembling}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-cyan/40 bg-bg/70 backdrop-blur-sm text-cyan hover:bg-cyan hover:text-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.15)] flex items-center gap-2"
              aria-label="Reassemble fallen elements"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${reassembling ? 'bg-amber animate-pulse' : 'bg-cyan'}`} />
              {reassembling ? 'Rebuilding...' : 'Reassemble Section'}
            </button>
            <button
              onClick={reassemblePermanent}
              className="font-mono text-xs uppercase tracking-[0.25em] px-5 py-3 border border-white/20 bg-bg/70 backdrop-blur-sm text-white/60 hover:border-white/50 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2"
              aria-label="Reassemble permanently"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
              &gt; Keep it assembled
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FallingPiece({
  children,
  container,
  collapsed,
  dx,
  dy,
  rotate,
  delay,
  className = '',
}: {
  children: React.ReactNode;
  container: React.RefObject<HTMLDivElement | null>;
  collapsed: boolean;
  dx: number;
  dy: number;
  rotate: number;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`inline-block pointer-events-auto cursor-grab active:cursor-grabbing ${className}`}
      drag={collapsed}
      dragConstraints={container}
      dragElastic={0.55}
      dragMomentum
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      animate={collapsed ? { x: dx, y: dy, rotate } : { x: 0, y: 0, rotate: 0 }}
      transition={
        collapsed
          ? { type: 'spring', stiffness: 70, damping: 7, mass: 1.1, delay }
          : { duration: 0 }
      }
      style={{ touchAction: 'none' }}
    >
      {children}
    </motion.div>
  );
}

function RubiksCredentials({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 25%'],
  });

  const cols = [
    { dir: -1, speed: 1.4, delay: 0.00, label: 'RESOLVING' },
    { dir:  1, speed: 1.0, delay: 0.06, label: 'SHUFFLE' },
    { dir: -1, speed: 1.7, delay: 0.02, label: 'ALIGN' },
    { dir:  1, speed: 1.2, delay: 0.10, label: 'SCAN' },
    { dir: -1, speed: 1.1, delay: 0.04, label: 'SYNC' },
    { dir:  1, speed: 1.5, delay: 0.08, label: 'LOCK' },
    { dir: -1, speed: 1.3, delay: 0.01, label: 'READY' },
  ];

  return (
    <div ref={ref} className="relative w-full max-w-5xl mx-auto mt-12">
      {children}
      <div className="absolute inset-0 pointer-events-none flex z-20 overflow-hidden rounded-md">
        {cols.map((c, i) => (
          <RubiksColumn key={i} progress={scrollYProgress} {...c} />
        ))}
      </div>
    </div>
  );
}

function RubiksColumn({
  progress,
  dir,
  speed,
  delay,
  label,
}: {
  progress: MotionValue<number>;
  dir: number;
  speed: number;
  delay: number;
  label: string;
}) {
  const start = delay;
  const end = Math.min(0.98, delay + 1 / speed);
  const y = useTransform(progress, [start, end], ['0%', `${dir * 115}%`]);
  const opacity = useTransform(progress, [end - 0.08, end], [1, 0]);

  return (
    <motion.div
      style={{ y, opacity, flex: '1 1 0' }}
      className="relative bg-bg border-r border-cyan/15 last:border-0"
    >
      <div
        className="absolute left-0 right-0 top-0 h-12"
        style={{
          background:
            dir === 1
              ? 'linear-gradient(to bottom, rgba(0,240,255,0.18), transparent)'
              : 'linear-gradient(to bottom, transparent, transparent)',
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 h-12"
        style={{
          background:
            dir === -1
              ? 'linear-gradient(to top, rgba(0,240,255,0.18), transparent)'
              : 'linear-gradient(to top, transparent, transparent)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="font-mono text-[9px] text-cyan/40 tracking-[0.4em] -rotate-90 whitespace-nowrap select-none">
          [ {label} ]
        </div>
      </div>
    </motion.div>
  );
}

function DropCard({ children, delay, initialRotate }: { children: React.ReactNode; delay: number; initialRotate: number }) {
  return (
    <motion.div
      initial={{ y: -420, rotate: initialRotate * 4, opacity: 0 }}
      whileInView={{ y: 0, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 8, mass: 1.2, delay }}
      whileHover={{ scale: 1.015, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      {children}
    </motion.div>
  );
}

const PHYSICS_CHIPS: { label: string; color: 'cyan' | 'amber' | 'red'; x: string; y: string; delay: number; desktopOnly?: boolean }[] = [
  // ── Top row: always visible ──────────────────────────────────────
  { label: 'n8n',        color: 'cyan',  x: '2%',  y: '-5%',  delay: 0.10 },
  { label: 'Mistral',    color: 'red',   x: '33%', y: '-5%',  delay: 0.16 },
  { label: 'Supabase',   color: 'amber', x: '62%', y: '-5%',  delay: 0.22 },
  { label: 'Python',     color: 'cyan',  x: '83%', y: '-5%',  delay: 0.28 },
  // ── Top row: desktop-only extras ────────────────────────────────
  { label: 'LangChain',  color: 'cyan',  x: '17%', y: '-2%',  delay: 0.13, desktopOnly: true },
  { label: 'Pinecone',   color: 'amber', x: '47%', y: '-2%',  delay: 0.19, desktopOnly: true },
  { label: 'Ollama',     color: 'cyan',  x: '72%', y: '-2%',  delay: 0.25, desktopOnly: true },
  // ── Side edges: desktop-only ────────────────────────────────────
  { label: 'Redis',      color: 'red',   x: '-1%', y: '32%',  delay: 0.34, desktopOnly: true },
  { label: 'Whisper',    color: 'cyan',  x: '89%', y: '32%',  delay: 0.40, desktopOnly: true },
  { label: 'GPT-4',      color: 'red',   x: '89%', y: '62%',  delay: 0.46, desktopOnly: true },
  // ── Bottom row: always visible ───────────────────────────────────
  { label: 'Docker',     color: 'amber', x: '2%',  y: '103%', delay: 0.52 },
  { label: 'Cloudflare', color: 'amber', x: '33%', y: '103%', delay: 0.56 },
  { label: 'Vercel',     color: 'cyan',  x: '62%', y: '103%', delay: 0.60 },
  { label: 'FastAPI',    color: 'amber', x: '83%', y: '103%', delay: 0.64 },
];

function PhysicsChipsLayer() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none z-10 overflow-visible">
      {PHYSICS_CHIPS.map((c) => (
        <PhysicsChip key={c.label} {...c} />
      ))}
    </div>
  );
}

function PhysicsChip({ label, color, x, y, delay, desktopOnly }: { label: string; color: 'cyan' | 'amber' | 'red'; x: string; y: string; delay: number; desktopOnly?: boolean }) {
  const colorMap = {
    cyan:  'border-cyan/50 text-cyan bg-cyan/10 shadow-[0_0_18px_rgba(0,240,255,0.30)]',
    amber: 'border-amber/50 text-amber bg-amber/10 shadow-[0_0_18px_rgba(255,176,0,0.30)]',
    red:   'border-red-500/50 text-red-400 bg-red-500/10 shadow-[0_0_18px_rgba(239,68,68,0.30)]',
  };
  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 280, bounceDamping: 14 }}
      whileDrag={{ scale: 1.18, zIndex: 50, rotate: 8 }}
      whileHover={{ scale: 1.1 }}
      initial={{ y: -500, rotate: -30, opacity: 0 }}
      whileInView={{ y: 0, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 9, mass: 1, delay }}
      style={{ left: x, top: y, position: 'absolute', touchAction: 'none' }}
      className={`${desktopOnly ? 'hidden md:flex' : 'flex'} pointer-events-auto select-none cursor-grab active:cursor-grabbing font-mono text-[9px] md:text-[11px] uppercase tracking-widest px-2 md:px-3 py-1 md:py-1.5 rounded-full border backdrop-blur-md whitespace-nowrap items-center ${colorMap[color]}`}
    >
      {label}
    </motion.div>
  );
}

type LiquidRepo = {
  id: number | string;
  html_url: string;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
};

function LiquidRepoGrid({ repos }: { repos: LiquidRepo[] }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothV = useSpring(velocity, { stiffness: 100, damping: 35, mass: 0.8 });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1400px' }}>
      {repos.map((repo, i) => (
        <LiquidRepoCard key={repo.id} repo={repo} velocity={smoothV} index={i} />
      ))}
    </div>
  );
}

function LiquidRepoCard({
  repo,
  velocity,
  index,
}: {
  repo: LiquidRepo;
  velocity: MotionValue<number>;
  index: number;
}) {
  const isMobile = useIsMobile();
  const col = index % 3;
  const colSign = col === 0 ? -1 : col === 2 ? 1 : 0;
  const sensitivity = 1 + (index % 4) * 0.08;

  // Apple-style: gentler distortion with smoother interpolation
  const skewY = useTransform(velocity, (v) => {
    if (isMobile) return '0deg';
    const raw = (v / 320) * sensitivity;
    return `${Math.max(-6, Math.min(6, raw))}deg`;
  });
  const skewX = useTransform(velocity, (v) => {
    if (isMobile) return '0deg';
    const raw = (v / 1000) * colSign * sensitivity;
    return `${Math.max(-2, Math.min(2, raw))}deg`;
  });
  const scaleY = useTransform(velocity, (v) => isMobile ? 1 : 1 + Math.min(0.08, Math.abs(v) / 8000));
  const scaleX = useTransform(velocity, (v) => isMobile ? 1 : 1 - Math.min(0.04, Math.abs(v) / 16000));
  const filter = useTransform(velocity, (v) => isMobile ? 'blur(0px)' : `blur(${Math.min(2, Math.abs(v) / 1000)}px)`);
  const rotateZ = useTransform(velocity, (v) => {
    if (isMobile) return '0deg';
    const raw = (v / 1800) * colSign;
    return `${Math.max(-1.5, Math.min(1.5, raw))}deg`;
  });

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ skewY, skewX, scaleY, scaleX, filter, rotateZ, transformOrigin: 'center center' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      className="bg-panel/60 backdrop-blur-md border border-cyan/10 p-6 rounded-xl hover:border-cyan/50 hover:bg-cyan/5 transition-colors group block shadow-lg flex flex-col justify-between min-h-[160px] will-change-transform liquid-glass-card relative overflow-hidden"
    >
      {/* Glass highlight */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div>
        <div className="flex items-start justify-between mb-4">
          <Github className="text-text-muted group-hover:text-white group-hover:scale-110 transition-all" size={24} />
          <div className="flex gap-3 text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1 group-hover:text-amber transition-colors"><Star size={12} /> {repo.stargazers_count}</span>
            <span className="flex items-center gap-1 group-hover:text-amber transition-colors"><GitFork size={12} /> {repo.forks_count}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2 text-white group-hover:text-white transition-colors line-clamp-1">{repo.name}</h3>
        <p className="text-sm text-text-muted line-clamp-2">{repo.description || 'No description provided.'}</p>
      </div>
      {repo.language && (
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-text-muted">
          <span className="w-2 h-2 rounded-full border border-cyan/50 bg-cyan/20"></span> {repo.language}
        </div>
      )}
    </motion.a>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[1px] z-[60] bg-gradient-to-r from-cyan via-cyan/60 to-amber/40 pointer-events-none"
    />
  );
}

function SectionHeader({ number, command, title, center = false }: { number: string, command: string, title: string, center?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className={`mb-10 ${center ? 'text-center' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        className="font-mono text-[11px] tracking-[0.25em] text-text-muted/60 mb-3"
      >
        <span className="text-cyan/50">{number}</span> &nbsp; <span className="text-text-muted/40">{command}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight"
      >
        <ShaderText preset="aurora">{title}</ShaderText>
      </motion.h2>
      <ShaderGlowLine className="mt-3 max-w-[200px]" />
    </motion.div>
  );
}

function ProjectGroup({ title, children, color }: { title: string, children: React.ReactNode, color: string }) {
  const borderColor = color === 'cyan' ? 'border-cyan/30' : 'border-amber/30';
  const textColor = color === 'cyan' ? 'text-cyan' : 'text-amber';
  const glowColor = color === 'cyan' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(245, 166, 35, 0.08)';
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Apple-style liquid glass: smoother spring for buttery feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.0005 });
  
  // Gentler, more refined transforms (Apple prefers subtlety)
  const opacity = useTransform(smoothProgress, [0, 0.12, 0.3, 0.7, 0.88, 1], [0, 0.6, 1, 1, 0.6, 0]);
  const scale = useTransform(smoothProgress, [0, 0.15, 0.3, 0.7, 0.85, 1], [0.96, 0.98, 1, 1, 0.98, 0.96]);
  const rotateX = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [4, 1, 0, -1, -4]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [50, 12, 0, -12, -50]);
  
  // Glass backdrop effects: more nuanced
  const backdropBlur = useTransform(smoothProgress, [0, 0.15, 0.3, 0.7, 0.85, 1], [8, 3, 0, 0, 3, 8]);
  const glassOpacity = useTransform(smoothProgress, [0, 0.2, 0.35, 0.65, 0.8, 1], [0, 0.4, 0.8, 0.8, 0.4, 0]);
  // Subtle horizontal shift for depth perception
  const x = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [-8, -2, 0, 2, 8]);
  
  return (
    <motion.div 
      ref={ref}
      className="mt-16 relative liquid-glass-v2"
      style={{
        opacity,
        scale,
        rotateX,
        y,
        x,
        perspective: '1400px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Apple-style liquid glass backdrop glow — softer, larger */}
      <motion.div
        className="absolute -inset-8 rounded-3xl pointer-events-none -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${glowColor}, transparent 65%)`,
          filter: useTransform(backdropBlur, (v) => `blur(${v * 4}px)`),
          opacity: glassOpacity,
        }}
      />
      {/* Frosted glass border overlay — refined edge treatment */}
      <motion.div
        className="absolute -inset-4 rounded-2xl pointer-events-none -z-10 border border-white/[0.03]"
        style={{
          backdropFilter: useTransform(backdropBlur, (v) => `blur(${Math.max(v * 1.2, 0)}px) saturate(1.4)`),
          WebkitBackdropFilter: useTransform(backdropBlur, (v) => `blur(${Math.max(v * 1.2, 0)}px) saturate(1.4)`),
          opacity: glassOpacity,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 40%, rgba(0,240,255,0.015) 100%)',
        }}
      />
      {/* Animated shimmer line at top — Apple-style highlight */}
      <motion.div
        className="absolute -top-px left-[10%] right-[10%] h-px pointer-events-none -z-10 rounded-full"
        style={{
          background: color === 'cyan'
            ? 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), rgba(255,255,255,0.15), rgba(0,240,255,0.4), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(245,166,35,0.4), rgba(255,255,255,0.15), rgba(245,166,35,0.4), transparent)',
          opacity: glassOpacity,
        }}
      />
      <div className="relative z-10">
        <h3 className={`font-mono text-xs uppercase tracking-[0.2em] ${textColor} mb-6 pb-2 border-b ${borderColor} inline-block`}>
          ▸ {title}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ name, url, desc, tags, logoUrl, bannerUrl, videoUrl, children }: { name: string, url?: string, desc: string, tags: string[], logoUrl?: string, bannerUrl?: string, videoUrl?: string, children?: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Zero-rerender hover tracking via motion values (bypasses React reconciliation)
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const glowBackground = useMotionTemplate`radial-gradient(300px circle at ${mouseX}% ${mouseY}%, rgba(0,240,255,0.06), transparent 60%)`;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      onMouseMove={handleMouseMove}
      className="bg-panel/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-6 transition-all duration-300 group overflow-hidden relative flex flex-col hover:border-cyan/30 hover:shadow-[0_8px_40px_rgba(0,240,255,0.08)] liquid-glass-card"
    >
      {/* Liquid glass refraction overlay — follows mouse (zero re-renders) */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl z-0 will-change-transform"
        style={{ background: glowBackground }}
      />
      {/* Glass top edge highlight */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
      {/* Glass bottom refraction */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none z-10"></div>
      {videoUrl && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} — watch demo`}
          className="absolute inset-0 z-10 cursor-pointer"
        />
      )}
      
      {bannerUrl && (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden border border-white/[0.06] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent z-10"></div>
          <img src={bannerUrl} alt={`${name} schematic`} loading="lazy" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" referrerPolicy="no-referrer" />
        </div>
      )}

      <div className="flex justify-between items-start mb-4 gap-4 relative z-[1]">
        <div className="flex items-center gap-4">
          {logoUrl && (
            <div className="w-11 h-11 rounded-lg border border-white/[0.08] overflow-hidden shrink-0 group-hover:border-cyan/30 transition-all duration-300">
              <img src={logoUrl} alt={`${name} logo`} loading="lazy" className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
            </div>
          )}
          <h4 className="text-lg font-bold group-hover:text-white transition-colors duration-300">{name}</h4>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase px-3 py-2 md:px-2 md:py-1 bg-white/5 text-text-muted border border-white/10 rounded hover:bg-cyan/10 hover:text-cyan hover:border-cyan/30 transition-colors relative z-20">
            <IconLink size={12} /> Live
          </a>
        )}
      </div>
      
      <p className="text-text-muted text-sm leading-relaxed mb-6 relative z-[1]">{desc}</p>
      
      {children && (
        <div className="mb-6 relative z-10">
          {children}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-auto relative z-[1]">
        {tags.map((tag, i) => (
          <span key={i} className="font-mono text-[10px] uppercase text-text-muted/70 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.06] group-hover:border-white/10 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function WorkflowCard({ name, desc, image, delay = 0, videoUrl }: { name: string, desc: string, image: string, delay?: number, videoUrl?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100, scale: 0.88, rotateX: 18, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.05, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      whileTap={{ scale: 0.97 }}
      className="group w-full block h-full md:[perspective:1000px]"
      style={{ transformPerspective: 1200 }}
    >
      <div className="w-full h-full bg-panel/60 backdrop-blur-md border border-cyan/20 rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform-gpu md:group-hover:rotate-x-12 md:group-hover:-rotate-y-12 group-hover:-translate-y-2 md:group-hover:-translate-y-4 group-hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] md:group-hover:shadow-[20px_20px_60px_rgba(0,240,255,0.2)] flex flex-col relative md:[transform-style:preserve-3d] liquid-glass-card">
        {/* Glassmorphism shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.03] via-transparent to-white/[0.02] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        {/* Top edge glass refraction */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none z-20"></div>
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} — watch demo`}
            className="absolute inset-0 z-20 cursor-pointer"
          />
        )}
        
        {/* Image Banner */}
        <div className="w-full h-40 sm:h-48 relative overflow-hidden border-b border-cyan/20 bg-black/50 p-2">
           <div className="w-full h-full relative rounded-lg overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-bg/50">
             <img 
               src={image} 
               alt={name} 
               loading="lazy"
               className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" 
               referrerPolicy="no-referrer" 
             />
           </div>
        </div>
        
        <div className="p-4 sm:p-6 relative z-10 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-2 rounded-full bg-amber group-hover:shadow-[0_0_10px_#f5a623] transition-shadow shrink-0"></div>
             <h4 className="text-base sm:text-xl font-bold group-hover:text-white transition-colors">{name}</h4>
          </div>
          <p className="text-sm text-text-muted leading-relaxed flex-grow">{desc}</p>
          
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 text-[10px] font-mono uppercase">
            <span className="bg-amber/10 text-amber border border-amber/20 px-2 py-1 rounded">n8n core</span>
            <span className="bg-cyan/10 text-cyan border border-cyan/20 px-2 py-1 rounded group-hover:bg-cyan group-hover:text-bg transition-colors">SAM Controlled</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StackGroup({ title, items, border }: { title: string, items: string[], border: string }) {
  const textColor = border === 'cyan' ? 'text-cyan/80' : 'text-amber/80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-panel/60 border border-white/[0.06] p-6 rounded-xl hover:border-white/[0.12] transition-colors duration-300"
    >
      <div className={`text-[11px] uppercase tracking-[0.2em] mb-5 ${textColor} font-semibold`}>[ {title} ]</div>
      <motion.ul
        className="space-y-3 block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
          hidden: {},
        }}
      >
        {items.map((item, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -12 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-sm text-text-muted flex items-center gap-2 border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
          >
            <span className="w-1 h-1 rounded-full bg-cyan/50"></span> {item}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

function SocialIcon({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className="group relative flex items-center justify-center w-12 h-12 bg-panel border border-cyan/20 rounded-lg text-text-muted hover:text-white hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1"
    >
      {icon}
      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-panel border border-cyan/30 text-cyan text-xs font-mono px-3 py-1 rounded pointer-events-none whitespace-nowrap shadow-[0_0_10px_rgba(0,240,255,0.2)] flex flex-col items-center">
        {label}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-cyan/30"></div>
      </span>
    </a>
  );
}

// ─── Blueprint to Reality Scanner — Services ──────────────────────────────────

const SERVICES_DATA = [
  {
    icon: '⚙️',
    title: 'n8n Workflow Automation',
    outcome: 'Your manual processes run themselves',
    desc: "Custom n8n workflows that automate lead capture, CRM injection, email sequences, GST reconciliation, WhatsApp outreach — whatever you're doing by hand today.",
    tags: ['n8n', 'Webhooks', 'API Chains', 'Scheduling'],
  },
  {
    icon: '🎙️',
    title: 'Voice AI Agents',
    outcome: 'An agent that listens, reasons & acts',
    desc: 'Voice-first AI agents that go beyond talking — they execute multi-step tasks across your stack while your hands stay free. Deployable to WhatsApp, web, or phone.',
    tags: ['Voice AI', 'LLM', 'n8n', 'Real-Time'],
  },
  {
    icon: '🔗',
    title: 'Custom API Integration',
    outcome: 'Any system connected to any other',
    desc: 'ERP ↔ CRM ↔ WhatsApp ↔ payment gateway ↔ government portals. If there\'s an API or webhook, I can wire it into your workflow with full error handling and fallback logic.',
    tags: ['REST APIs', 'Webhooks', 'OAuth', 'Odoo', 'IndiaMART'],
  },
  {
    icon: '🎵',
    title: 'AI Music Generation',
    outcome: 'Original tracks on demand, zero licensing fees',
    desc: 'Automated music generation pipelines via Suno — jingles, background scores, brand tracks, YouTube intros. Fully automated, batch-ready, and copyright-clean.',
    tags: ['Suno', 'AI Audio', 'Automation', 'Content'],
  },
  {
    icon: '🎬',
    title: 'AI Video / Movie Clips',
    outcome: 'UGC-style ad creatives at scale',
    desc: 'AI-generated video clips for ads, product demos, and social content. UGC-style scripts, voiceovers, and visuals — all automated and batch-produced.',
    tags: ['UGC Ads', 'AI Video', 'Content Automation'],
  },
  {
    icon: '🚀',
    title: 'SaaS MVP Build',
    outcome: 'A working product your users can log into',
    desc: 'Full-stack SaaS products built on Cloudflare Workers — fast, globally deployed, no server bills. From idea to live URL. InkTwin and PrimuezSure are examples of what ships.',
    tags: ['Next.js', 'Cloudflare Workers', 'AI', 'Full-Stack'],
  },
];

function WireframeCard({ icon, title, outcome, desc, tags }: (typeof SERVICES_DATA)[0]) {
  return (
    <div className="flex flex-col p-6 rounded-xl border-2 border-dashed border-[#333] bg-transparent min-h-[260px]">
      <div className="text-3xl mb-4 grayscale opacity-40">{icon}</div>
      <h4 className="text-base font-bold mb-1 text-[#555]">{title}</h4>
      <p className="font-mono text-xs uppercase tracking-widest mb-4 text-[#444]">→ {outcome}</p>
      <p className="text-[#3a3a3a] text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <span key={i} className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-[#333] text-[#444] bg-transparent">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function RenderedCard({ icon, title, outcome, desc, tags }: (typeof SERVICES_DATA)[0]) {
  return (
    <div className="flex flex-col p-6 rounded-xl border border-cyan/40 bg-[#12161E]/80 backdrop-blur-md min-h-[260px]
      shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_20px_rgba(0,240,255,0.06)] relative overflow-hidden liquid-glass-card group">
      {/* Glass edge highlight */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent pointer-events-none z-10"></div>
      <div className="text-3xl mb-4">{icon}</div>
      <h4 className="text-base font-bold mb-1 text-white">{title}</h4>
      <p className="font-mono text-xs uppercase tracking-widest mb-4 text-cyan">→ {outcome}</p>
      <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <span key={i} className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-cyan/40 text-cyan bg-cyan/10">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function BlueprintServicesSection({ onWorkWithMe }: { onWorkWithMe: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile     = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // scrub: smooth lag (equivalent to GSAP scrub: 1)
  const smoothP = useSpring(scrollYProgress, { stiffness: 55, damping: 18, restDelta: 0.001 });

  // clipBottom: 100 → 0 as user scrolls through section
  const clipBottom  = useTransform(smoothP, [0.04, 0.88], [100, 0]);
  const clipPath    = useTransform(clipBottom, v => {
    const clamped = Math.max(0, Math.min(100, isNaN(v) ? 100 : v));
    return `inset(0 0 ${clamped.toFixed(2)}% 0)`;
  });

  // laser sits right at the clip boundary
  const laserTop    = useTransform(clipBottom, v => {
    const clamped = Math.max(0, Math.min(100, isNaN(v) ? 100 : v));
    return `${(100 - clamped).toFixed(2)}%`;
  });
  const laserOpacity= useTransform(clipBottom, [100, 96, 4, 0], [0, 1, 1, 0]);

  // section height: desktop ~290vh gives plenty of scroll room through 2 card rows
  // mobile: auto height, no scroll-jacking (handled via style conditional below)
  const sectionHeight = '290vh';

  return (
    <section
      id="services"
      ref={containerRef}
      style={isMobile ? undefined : { height: sectionHeight, position: 'relative' }}
      className={isMobile ? 'pt-16' : ''}
    >
      <div
        style={isMobile ? undefined : { position: 'sticky', top: '72px' }}
        className={isMobile ? '' : 'pt-16 md:pt-20 pb-16'}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader number="03" command="> ./services --what-i-build-for-you" title="What I Build For You" />
          <p className="text-text-muted mt-4 mb-3 max-w-2xl text-base leading-relaxed">
            Every service below ships as a working system — not a prototype, not a template. You describe the outcome you need; I design, build, and hand it over ready to run.
          </p>
          {!isMobile && (
            <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2">
              <span className="text-[#00FFCC] animate-pulse">▼</span> scroll to scan services
            </p>
          )}
        </motion.div>

        {/* ── Blueprint Scanner Grid ── */}
        {!isMobile ? (
          /* Desktop: scroll-driven laser scanner */
          <div className="relative" style={{ position: 'relative' }}>
            {/* Bottom layer — wireframe blueprint */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES_DATA.map((s, i) => <WireframeCard key={i} {...s} />)}
            </div>

            {/* Top layer — rendered, clipped by laser */}
            <motion.div
              className="absolute inset-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{ clipPath }}
            >
              {SERVICES_DATA.map((s, i) => <RenderedCard key={i} {...s} />)}
            </motion.div>

            {/* Glowing laser line */}
            <motion.div
              className="absolute left-0 right-0 pointer-events-none z-10"
              style={{ top: laserTop, opacity: laserOpacity }}
            >
              <div className="w-full h-[2px] bg-[#00FFCC]
                shadow-[0_0_8px_#00FFCC,0_0_20px_#00FFCC,0_0_40px_rgba(0,255,204,0.6)]" />
            </motion.div>
          </div>
        ) : (
          /* Mobile: each card fades+slides in as user scrolls — simpler but still smooth */
          <div className="grid grid-cols-1 gap-6 mt-8">
            {SERVICES_DATA.map((s, i) => (
              <MobileServiceCard key={i} card={s} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="font-mono text-xs text-text-muted tracking-widest mb-4">[ NOT SURE WHICH ONE YOU NEED? ]</p>
          <GlassButton
            size="lg"
            onClick={onWorkWithMe}
            glowColor="rgba(0, 240, 255, 0.2)"
            className="glass-btn-glow text-cyan hover:text-white"
          >
            Describe your project &rarr; I&apos;ll figure out the rest
          </GlassButton>
        </div>
      </div>
    </section>
  );
}

function MobileServiceCard({ card }: { card: (typeof SERVICES_DATA)[0] }) {
  const scanEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      className="relative"
      whileInView="visible"
      initial="hidden"
      viewport={{ margin: '-80px 0px -80px 0px', once: true }}
    >
      {/* ── Bottom layer: Wireframe blueprint ── */}
      <div className="flex flex-col p-6 rounded-xl border-2 border-dashed border-[#333] bg-transparent min-h-[260px]">
        <div className="text-3xl mb-4 grayscale opacity-40">{card.icon}</div>
        <h4 className="text-base font-bold mb-1 text-[#666]">{card.title}</h4>
        <p className="font-mono text-xs uppercase tracking-widest mb-4 text-[#555]">→ {card.outcome}</p>
        <p className="text-[#444] text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {card.tags.map((tag, i) => (
            <span key={i} className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-[#333] text-[#555] bg-transparent">{tag}</span>
          ))}
        </div>
      </div>

      {/* ── Top layer: Rendered card, revealed by clip-path scan ── */}
      <motion.div
        className="absolute inset-0 flex flex-col p-6 rounded-xl border border-cyan/20 bg-[#12161E] min-h-[260px] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        variants={{
          hidden:  { clipPath: 'inset(0 0 100% 0)' },
          visible: { clipPath: 'inset(0 0 0% 0)' },
        }}
        transition={{ duration: 1.1, ease: scanEase }}
      >
        <div className="text-3xl mb-4">{card.icon}</div>
        <h4 className="text-base font-bold mb-1 text-white">{card.title}</h4>
        <p className="font-mono text-xs uppercase tracking-widest mb-4 text-[#00FFCC]">→ {card.outcome}</p>
        <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {card.tags.map((tag, i) => (
            <span key={i} className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-cyan/25 text-cyan bg-cyan/5">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* ── Laser line: sweeps from top to bottom in sync with the reveal ── */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none z-10"
        variants={{
          hidden:  { top: '0%' },
          visible: { top: '100%' },
        }}
        transition={{ duration: 1.1, ease: scanEase }}
      >
        <div className="w-full h-[2px] bg-[#00FFCC]"
          style={{ boxShadow: '0 0 15px #00FFCC, 0 0 30px rgba(0,255,204,0.5)' }} />
      </motion.div>
    </motion.div>
  );
}

function ServiceCard({ icon, title, outcome, desc, tags, color }: {
  icon: string;
  title: string;
  outcome: string;
  desc: string;
  tags: string[];
  color: 'cyan' | 'amber';
}) {
  const borderColor = color === 'cyan' ? 'border-cyan/20 hover:border-cyan/50 hover:shadow-[0_8px_40px_rgba(0,240,255,0.15)]' : 'border-amber/20 hover:border-amber/50 hover:shadow-[0_8px_40px_rgba(245,166,35,0.15)]';
  const outcomeColor = color === 'cyan' ? 'text-cyan' : 'text-amber';
  const tagColor = color === 'cyan' ? 'bg-cyan/10 text-cyan border-cyan/20' : 'bg-amber/10 text-amber border-amber/20';
  const topBar = color === 'cyan' ? 'from-cyan/60 to-transparent' : 'from-amber/60 to-transparent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      className={`group bg-panel border ${borderColor} rounded-xl p-6 flex flex-col transition-all duration-300 relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${topBar} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="text-3xl mb-4">{icon}</div>
      <h4 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">{title}</h4>
      <p className={`font-mono text-xs uppercase tracking-widest mb-4 ${outcomeColor}`}>→ {outcome}</p>
      <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">{desc}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <span key={i} className={`font-mono text-[10px] uppercase px-2 py-1 rounded border ${tagColor}`}>{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Receipt Printer Pricing ──────────────────────────────────────────────────

const RECEIPT_CARDS = [
  {
    tier: 'Professional Automation',
    usd: 'Starts at $150',
    inr: '₹12,000+',
    color: 'cyan' as const,
    features: [
      'Multi-step workflows & CRM setups',
      'Full error handling & logging',
      '3–6 node workflow or AI agent',
      'Documentation + handover call',
      '30-day bug support',
    ],
    cta: 'Get Professional Build',
    footerNote: "Need a micro-fix under $150? Let's discuss it.",
  },
  {
    tier: 'Premium AI Integration',
    usd: '$300 - $800',
    inr: '₹25,000 - ₹65,000',
    color: 'amber' as const,
    popular: true,
    features: [
      'End-to-end AI systems',
      'Multi-model orchestration',
      'SaaS MVPs & enterprise pipelines',
      'Full system architecture',
      'Unlimited revisions in scope',
    ],
    cta: 'Build Something Premium',
  },
  {
    tier: 'Advanced Enterprise Systems',
    usd: 'Up to $1,000',
    inr: '₹75,000 - ₹1,00,000+',
    color: 'violet' as const,
    features: [
      'High-level complex architectures',
      'Full architecture ownership',
      'Multi-department automation',
      'Ongoing async support',
      'Architecture reviews & Roadmap planning',
    ],
    cta: 'Discuss Scope',
  },
];

const VIP_CARD = {
  tier: 'Enterprise / Fractional CTO',
  usd: 'Custom / Retainer',
  inr: 'Open for discussion',
  features: [
    'Full architecture ownership',
    'Multi-department automation',
    'Ongoing async support',
    'Weekly strategic check-ins',
    'Architecture reviews',
    'Roadmap planning',
  ],
  cta: 'Discuss Scope',
};

type ReceiptCardData = (typeof RECEIPT_CARDS)[0];

function cardClasses(c: string) {
  return {
    border:   c === 'cyan' ? 'border-cyan/40'   : c === 'amber' ? 'border-amber/50'   : 'border-violet-400/40',
    ring:     c === 'cyan' ? 'ring-cyan/25'      : c === 'amber' ? 'ring-amber/30'      : 'ring-violet-400/25',
    text:     c === 'cyan' ? 'text-cyan'         : c === 'amber' ? 'text-amber'         : 'text-violet-400',
    divider:  c === 'cyan' ? 'bg-cyan/20'        : c === 'amber' ? 'bg-amber/20'        : 'bg-violet-400/20',
    line:     c === 'cyan'
      ? 'bg-cyan shadow-[0_0_6px_#00f0ff,0_0_16px_rgba(0,240,255,0.4)]'
      : c === 'amber'
      ? 'bg-amber shadow-[0_0_6px_#f5a623,0_0_16px_rgba(245,166,35,0.4)]'
      : 'bg-violet-400 shadow-[0_0_6px_#a78bfa,0_0_16px_rgba(167,139,250,0.4)]',
    btn:      c === 'cyan'
      ? 'border-cyan text-cyan hover:bg-cyan hover:text-bg shadow-[0_0_14px_rgba(0,240,255,0.15)]'
      : c === 'amber'
      ? 'border-amber text-amber hover:bg-amber hover:text-bg shadow-[0_0_14px_rgba(245,166,35,0.15)]'
      : 'border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-bg shadow-[0_0_14px_rgba(167,139,250,0.15)]',
  };
}

function ReceiptCardInner({
  card,
  clipPct,
  ctaOpacity,
  ctaY,
}: {
  card: ReceiptCardData;
  clipPct: MotionValue<number>;
  ctaOpacity: MotionValue<number>;
  ctaY: MotionValue<number>;
}) {
  const cls = cardClasses(card.color);
  const clipPath    = useTransform(clipPct, v => `inset(0 0 ${v.toFixed(1)}% 0)`);
  const lineTop     = useTransform(clipPct, v => `${(100 - v).toFixed(1)}%`);
  const lineOpacity = useTransform(clipPct, [0, 4, 96, 100], [0, 1, 1, 0]);

  return (
    <div
      className={`relative flex flex-col bg-panel border ${cls.border} rounded-xl overflow-visible
        shadow-[0_14px_44px_rgba(0,0,0,0.65),0_3px_10px_rgba(0,0,0,0.45)]
        ${card.popular ? `ring-1 ${cls.ring}` : ''}`}
    >
      {/* ── MOST POPULAR badge — solid, bright, highly visible ── */}
      {card.popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-full
            font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap
            bg-[#00FFCC] text-[#0a0a0f]
            shadow-[0_0_18px_rgba(0,255,204,0.7),0_2px_8px_rgba(0,0,0,0.5)]"
        >
          ★ Most Popular
        </div>
      )}

      {/* ── HEADER — always visible ── */}
      <div className={`p-6 pb-4 ${card.popular ? 'pt-8' : ''}`}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">{card.tier}</p>
        <h2 className={`font-sans font-bold text-3xl leading-tight ${cls.text}`}>{card.usd}</h2>
        <span className="font-mono text-sm text-text-muted block mt-1">{card.inr}</span>
      </div>

      {/* paper edge divider */}
      <div className={`h-px mx-6 ${cls.divider}`} />

      {/* ── RECEIPT BODY — scroll-printed ── */}
      <div className="relative flex-1 overflow-hidden rounded-b-xl">
        <motion.div style={{ clipPath }} className="px-6 pt-4">
          <ul className="space-y-2.5 pb-6">
            {card.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-main font-mono">
                <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${cls.text}`} />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* glowing print line */}
        <motion.div
          className={`absolute left-4 right-4 h-px pointer-events-none ${cls.line}`}
          style={{ top: lineTop, opacity: lineOpacity }}
        />
      </div>

      {/* ── CTA — pops in when fully printed ── */}
      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="px-6 pb-6 pt-2">
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className={`w-full font-mono text-xs uppercase tracking-widest border py-3 transition-all duration-300 rounded ${cls.btn}`}
        >
          {card.cta}
        </button>
        {card.footerNote && (
          <p className="text-center text-[11px] text-text-muted mt-2.5 font-mono leading-snug">{card.footerNote}</p>
        )}
      </motion.div>
    </div>
  );
}

// Mobile card — each unrolls independently when it enters the viewport center
function MobileReceiptCard({ card }: { card: ReceiptCardData }) {
  const clipPct    = useMotionValue(100);
  const ctaOpacity = useMotionValue(0);
  const ctaY       = useMotionValue(14);
  const ref        = useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once: true, margin: '-80px 0px -80px 0px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(clipPct, 0, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    const ctaCtrl  = animate(ctaOpacity, 1, { duration: 0.4, delay: 0, ease: 'easeOut' });
    const ctaYCtrl = animate(ctaY, 0, { duration: 0.4, delay: 0, ease: 'easeOut' });
    return () => { controls.stop(); ctaCtrl.stop(); ctaYCtrl.stop(); };
  }, [inView, clipPct, ctaOpacity, ctaY]);

  return (
    <div ref={ref}>
      <ReceiptCardInner card={card} clipPct={clipPct} ctaOpacity={ctaOpacity} ctaY={ctaY} />
    </div>
  );
}

// ── Full-width VIP Enterprise card ────────────────────────────────────────────
function VipReceiptCard({
  clipPct,
  ctaOpacity,
  ctaY,
}: {
  clipPct: MotionValue<number>;
  ctaOpacity: MotionValue<number>;
  ctaY: MotionValue<number>;
}) {
  const clipPath    = useTransform(clipPct, v => `inset(0 0 ${v.toFixed(1)}% 0)`);
  const lineTop     = useTransform(clipPct, v => `${(100 - v).toFixed(1)}%`);
  const lineOpacity = useTransform(clipPct, [0, 4, 96, 100], [0, 1, 1, 0]);

  const left  = VIP_CARD.features.slice(0, 3);
  const right = VIP_CARD.features.slice(3);

  return (
    <div className="group relative flex flex-col bg-panel rounded-xl overflow-visible
      border border-red-500/30
      shadow-[0_14px_44px_rgba(0,0,0,0.65)]
      transition-shadow duration-500
      hover:shadow-[0_0_0_1px_rgba(239,68,68,0.5),0_0_30px_rgba(239,68,68,0.25),0_14px_44px_rgba(0,0,0,0.65)]">

      {/* ── HEADER — always visible ── */}
      <div className="p-6 md:p-8 pb-4 md:pb-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
              {VIP_CARD.tier}
            </p>
            <h2 className="font-sans font-bold text-3xl md:text-4xl leading-tight text-red-400">
              {VIP_CARD.usd}
            </h2>
            <span className="font-mono text-sm text-text-muted block mt-1">{VIP_CARD.inr}</span>
          </div>
          {/* CTA anchored top-right on desktop, visible when printed */}
          <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="hidden md:block shrink-0">
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-mono text-xs uppercase tracking-widest border border-red-500/60 text-red-400
                px-8 py-3 rounded transition-all duration-300
                hover:bg-red-500/10 hover:border-red-400
                shadow-[0_0_14px_rgba(239,68,68,0.1)]"
            >
              {VIP_CARD.cta}
            </button>
          </motion.div>
        </div>
      </div>

      {/* paper edge divider */}
      <div className="h-px mx-6 md:mx-8 bg-red-500/20" />

      {/* ── RECEIPT BODY — scroll-printed, 2-col feature grid ── */}
      <div className="relative flex-1 overflow-hidden rounded-b-xl">
        <motion.div style={{ clipPath }} className="px-6 md:px-8 pt-5 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {VIP_CARD.features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-text-main font-mono">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-red-400" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        {/* glowing red print line */}
        <motion.div
          className="absolute left-4 right-4 h-px pointer-events-none
            bg-red-500 shadow-[0_0_6px_#ef4444,0_0_16px_rgba(239,68,68,0.4)]"
          style={{ top: lineTop, opacity: lineOpacity }}
        />
      </div>

      {/* CTA — mobile only (bottom) */}
      <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="md:hidden px-6 pb-6 pt-2">
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full font-mono text-xs uppercase tracking-widest border border-red-500/60 text-red-400
            py-3 rounded transition-all duration-300
            hover:bg-red-500/10 hover:border-red-400"
        >
          {VIP_CARD.cta}
        </button>
      </motion.div>
    </div>
  );
}

// Mobile VIP card — unrolls when it enters viewport
function MobileVipCard() {
  const clipPct    = useMotionValue(100);
  const ctaOpacity = useMotionValue(0);
  const ctaY       = useMotionValue(14);
  const ref        = useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once: true, margin: '-80px 0px -80px 0px' });

  useEffect(() => {
    if (!inView) return;
    const c1 = animate(clipPct, 0, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    const c2 = animate(ctaOpacity, 1, { duration: 0.5, delay: 0.9, ease: 'easeOut' });
    const c3 = animate(ctaY, 0, { duration: 0.5, delay: 0.9, ease: 'easeOut' });
    return () => { c1.stop(); c2.stop(); c3.stop(); };
  }, [inView, clipPct, ctaOpacity, ctaY]);

  return (
    <div ref={ref}>
      <VipReceiptCard clipPct={clipPct} ctaOpacity={ctaOpacity} ctaY={ctaY} />
    </div>
  );
}

function ReceiptPricingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 160, damping: 40, restDelta: 0.001 });

  // Top-3 cards: unroll 8% → 68% of scroll
  const clipPct    = useTransform(smoothP, [0.06, 0.62], [100, 0]);
  const ctaOpacity = useTransform(smoothP, [0.60, 0.72], [0, 1]);
  const ctaY       = useTransform(smoothP, [0.60, 0.72], [14, 0]);

  // VIP card: unroll after top-3 are done, 72% → 92%
  const vipClip    = useTransform(smoothP, [0.72, 0.93], [100, 0]);
  const vipCtaOp   = useTransform(smoothP, [0.91, 0.98], [0, 1]);
  const vipCtaY    = useTransform(smoothP, [0.91, 0.98], [14, 0]);

  return (
    <section
      id="pricing"
      ref={containerRef}
      style={isMobile ? undefined : { height: '240vh', position: 'relative' }}
      className={isMobile ? 'pt-16' : ''}
    >
      <div
        style={isMobile ? undefined : { position: 'sticky', top: '72px' }}
        className={isMobile ? '' : 'pt-16 md:pt-20 pb-16'}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader number="04" command="> ./pricing --transparent" title="Pricing" />
          <p className="text-text-muted mt-4 mb-10 max-w-2xl text-base leading-relaxed">
            No hidden rates. No surprise scope creep. Pick the tier that fits — or tell me what you need and I&apos;ll tell you which applies.
          </p>
          {!isMobile && (
            <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted mb-8 flex items-center gap-2">
              <span className="text-cyan animate-pulse">▼</span> scroll to print pricing
            </p>
          )}
        </motion.div>

        {/* ── Desktop layout ── */}
        {!isMobile && (
          <>
            {/* Top 3 — 3-column grid */}
            <div className="grid lg:grid-cols-3 gap-6 pt-6">
              {RECEIPT_CARDS.map((card, i) => (
                <ReceiptCardInner
                  key={i}
                  card={card}
                  clipPct={clipPct}
                  ctaOpacity={ctaOpacity}
                  ctaY={ctaY}
                />
              ))}
            </div>

            {/* VIP card — full width below */}
            <div className="mt-6">
              <VipReceiptCard clipPct={vipClip} ctaOpacity={vipCtaOp} ctaY={vipCtaY} />
            </div>
          </>
        )}

        {/* ── Mobile layout — all cards stack, each unrolls individually ── */}
        {isMobile && (
          <div className="flex flex-col gap-8 pt-6">
            {RECEIPT_CARDS.map((card, i) => (
              <MobileReceiptCard key={i} card={card} />
            ))}
            <MobileVipCard />
          </div>
        )}

        <p className="mt-10 text-center font-mono text-xs text-text-muted tracking-widest">
          All prices are project-based, not hourly. Scope is agreed before any work begins.
        </p>
      </div>
    </section>
  );
}

// ─── WHY PRIMUEZ ─────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    num: '01',
    title: 'We Ship,\nNot Just Plan',
    detail: "Real products. Live URLs. InkTwin and PrimuezSure aren't concepts on a slide deck — they're deployed, working SaaS tools built by a solo developer from Raipur.",
  },
  {
    num: '02',
    title: 'Automation-First\nThinking',
    detail: 'Every solution starts with: what can be automated? Powered by n8n, LLMs, autonomous agents, and custom API pipelines — we remove the manual work before it becomes your problem.',
  },
  {
    num: '03',
    title: 'Certified &\nSelf-Taught',
    detail: "n8n Official Badge Holder. SimpliLearn Certified. But more importantly — everything here was built by doing, not just studying.",
  },
  {
    num: '04',
    title: 'Young, Hungry\n& Agile',
    detail: "Still in college, already running a SaaS brand. Zero bureaucratic red tape. That means faster turnaround, lower overhead, and direct access to the architect.",
  },
];

function WhyPrimuezDot({
  index, total, scrollYProgress,
}: { index: number; total: number; scrollYProgress: MotionValue<number> }) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, (v) => (v >= start && v < end) ? 1 : 0.25);
  const scale = useTransform(scrollYProgress, [start, Math.min(start + 0.08, end), Math.max(end - 0.08, start), end], [1, 1.7, 1.7, 1]);
  return (
    <motion.div
      className="w-1.5 h-1.5 rounded-full bg-indigo-400"
      style={{ opacity, scale }}
    />
  );
}

function WhyPrimuezSlide({
  item, index, total, scrollYProgress,
}: {
  item: typeof WHY_ITEMS[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const inEnd = start + (end - start) * 0.40;
  const outStart = start + (end - start) * 0.60;

  const isFirst = index === 0;
  const opacityInput  = isFirst ? [outStart, end]         : [start, inEnd, outStart, end];
  const opacityOutput = isFirst ? [1, 0]                  : [0, 1, 1, 0];
  const opacity    = useTransform(scrollYProgress, opacityInput,  opacityOutput);
  const leftY      = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [-50, 0]);
  const rightY     = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [50, 0]);
  const leftClip   = useTransform(scrollYProgress, [start, inEnd], isFirst ? ['inset(0 0 0% 0)', 'inset(0 0 0% 0)'] : ['inset(0 0 110% 0)', 'inset(0 0 0% 0)']);
  const rightClip  = useTransform(scrollYProgress, [start, inEnd], isFirst ? ['inset(0% 0 0 0)', 'inset(0% 0 0 0)'] : ['inset(110% 0 0 0)', 'inset(0% 0 0 0)']);
  const lineScaleY = useTransform(scrollYProgress, isFirst ? [start, outStart, end] : [start, inEnd, outStart, end], isFirst ? [1, 1, 0] : [0, 1, 1, 0]);

  return (
    <motion.div className="absolute inset-0 flex" style={{ opacity }}>
      {/* Left panel — title */}
      <div className="w-1/2 flex items-center justify-end pr-10 md:pr-16 lg:pr-24">
        <motion.div style={{ y: leftY, clipPath: leftClip }} className="text-right">
          <span className="font-mono text-indigo-400 text-xs uppercase tracking-[0.25em] block mb-3">
            {item.num} / 04
          </span>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ whiteSpace: 'pre-line' }}
          >
            {item.title}
          </h3>
        </motion.div>
      </div>

      {/* Center lock line */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px bg-indigo-500"
        style={{ scaleY: lineScaleY, height: '80px', originY: '50%' }}
      />

      {/* Right panel — detail */}
      <div className="w-1/2 flex items-center justify-start pl-10 md:pl-16 lg:pl-24">
        <motion.div style={{ y: rightY, clipPath: rightClip }} className="max-w-xs md:max-w-sm">
          <p className="text-base md:text-lg text-gray-300 leading-relaxed font-sans">
            {item.detail}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function WhyPrimuez() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 45, restDelta: 0.001 });

  if (isMobile) {
    return (
      <MobileWhyPrimuez />
    );
  }

  return (
    <div ref={containerRef} style={{ height: `${WHY_ITEMS.length * 100}vh` }} className="relative -mx-4 sm:-mx-6">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.6) 0%, rgba(10,10,15,0.97) 15%, rgba(10,10,15,0.97) 85%, rgba(10,10,15,0.6) 100%)' }}
      >
        <div className="relative w-full h-full">
          {WHY_ITEMS.map((item, i) => (
            <WhyPrimuezSlide
              key={i}
              item={item}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
            />
          ))}

          {/* Dot nav */}
          <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {WHY_ITEMS.map((_, i) => (
              <WhyPrimuezDot key={i} index={i} total={WHY_ITEMS.length} scrollYProgress={smoothProgress} />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2 pointer-events-none">
            <span className="w-4 h-px bg-gray-700" />
            scroll to explore
            <span className="w-4 h-px bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile-optimized WhyPrimuez — now mirrors desktop scroll-driven split animation */
function MobileWhyPrimuez() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 40, restDelta: 0.001 });

  return (
    <div ref={containerRef} style={{ height: `${WHY_ITEMS.length * 50}vh` }} className="relative -mx-4 sm:-mx-6">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,0.6) 0%, rgba(10,10,15,0.97) 15%, rgba(10,10,15,0.97) 85%, rgba(10,10,15,0.6) 100%)' }}
      >
        <div className="relative w-full h-full">
          {WHY_ITEMS.map((item, i) => (
            <MobileWhySlide
              key={i}
              item={item}
              index={i}
              total={WHY_ITEMS.length}
              scrollYProgress={smoothProgress}
            />
          ))}

          {/* Dot nav */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {WHY_ITEMS.map((_, i) => (
              <MobileWhyDot key={i} index={i} total={WHY_ITEMS.length} scrollYProgress={smoothProgress} />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2 pointer-events-none">
            <span className="w-3 h-px bg-gray-700" />
            scroll
            <span className="w-3 h-px bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile slide — mirrors desktop WhyPrimuezSlide with vertically stacked layout */
function MobileWhySlide({
  item, index, total, scrollYProgress,
}: {
  item: typeof WHY_ITEMS[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const inEnd = start + (end - start) * 0.40;
  const outStart = start + (end - start) * 0.60;

  const isFirst = index === 0;
  const opacityInput  = isFirst ? [outStart, end]         : [start, inEnd, outStart, end];
  const opacityOutput = isFirst ? [1, 0]                  : [0, 1, 1, 0];
  const opacity    = useTransform(scrollYProgress, opacityInput, opacityOutput);
  const titleY     = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [-30, 0]);
  const detailY    = useTransform(scrollYProgress, [start, inEnd], isFirst ? [0, 0] : [30, 0]);
  const lineScaleY = useTransform(scrollYProgress, isFirst ? [start, outStart, end] : [start, inEnd, outStart, end], isFirst ? [1, 1, 0] : [0, 1, 1, 0]);

  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ opacity }}>
      {/* Title */}
      <motion.div style={{ y: titleY }} className="text-center mb-6">
        <span className="font-mono text-indigo-400 text-xs uppercase tracking-[0.25em] block mb-3">
          {item.num} / 04
        </span>
        <h3
          className="text-2xl sm:text-3xl font-bold text-white leading-tight"
          style={{ whiteSpace: 'pre-line' }}
        >
          {item.title}
        </h3>
      </motion.div>

      {/* Center lock line */}
      <motion.div
        className="w-px bg-indigo-500 mb-6"
        style={{ scaleY: lineScaleY, height: '50px', originY: '50%' }}
      />

      {/* Detail */}
      <motion.div style={{ y: detailY }} className="max-w-xs text-center">
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
          {item.detail}
        </p>
      </motion.div>
    </motion.div>
  );
}

function MobileWhyDot({
  index, total, scrollYProgress,
}: { index: number; total: number; scrollYProgress: MotionValue<number> }) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, (v) => (v >= start && v < end) ? 1 : 0.25);
  const scale = useTransform(scrollYProgress, [start, Math.min(start + 0.05, end), Math.max(end - 0.05, start), end], [1, 1.8, 1.8, 1]);
  return (
    <motion.div
      className="w-1.5 h-1.5 rounded-full bg-indigo-400"
      style={{ opacity, scale }}
    />
  );
}



// ─── Quantum Decryption FAQ ───────────────────────────────────────────────────

const FAQ_DATA = [
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
    a: 'Look at what shipped: InkTwin (live SaaS), PrimuezSure (live SaaS), the Odoo Enterprise architecture presented at a business show in Raipur, the CA Automation Suite used by actual firms. Self-taught means I learned by building real systems, not passing exams. The credentials section has the verifiable proof.',
  },
  {
    q: "What if I don't know exactly what I need?",
    a: "That's fine — most clients don't. Fill the \"Work With Me\" form and describe the problem you're trying to solve, not the solution. I'll come back with a scoped proposal including what I'd build and which tier it falls under.",
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
    a: 'Book a scope call via the "Work With Me" form. Large projects are broken into scoped phases so you\'re never paying for everything upfront. We agree on Phase 1, I build it, you see it working — then we plan Phase 2.',
  },
];

const DX_CHARS = '<>/*&#01_?!@$%^~=|\\[]{}';

function FAQDecryptItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const [displayQ, setDisplayQ] = useState(q);
  const [displayA, setDisplayA] = useState('');
  const scrambleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decryptRaf = useRef<number>(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768 || 'ontouchstart' in window;
    return () => {
      if (scrambleTimer.current) clearTimeout(scrambleTimer.current);
      cancelAnimationFrame(decryptRaf.current);
    };
  }, []);

  function startScramble() {
    if (isMobile.current) return;
    let count = 0;
    function tick() {
      count++;
      const arr = q.split('');
      const taken = new Set<number>();
      while (taken.size < 2) {
        const idx = Math.floor(Math.random() * arr.length);
        if (arr[idx] !== ' ') taken.add(idx);
      }
      taken.forEach(i => { arr[i] = DX_CHARS[Math.floor(Math.random() * DX_CHARS.length)]; });
      setDisplayQ(arr.join(''));
      if (count < 9) scrambleTimer.current = setTimeout(tick, 55);
      else setDisplayQ(q);
    }
    if (scrambleTimer.current) clearTimeout(scrambleTimer.current);
    tick();
  }

  function stopScramble() {
    if (scrambleTimer.current) clearTimeout(scrambleTimer.current);
    setDisplayQ(q);
  }

  function runDecrypt() {
    const len = a.length;
    const t0 = performance.now();
    const DURATION = isMobile.current ? 600 : 1200;
    function frame() {
      const elapsed = performance.now() - t0;
      const progress = Math.min(elapsed / DURATION, 1);
      const revealed = Math.floor(progress * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        if (i < revealed) out += a[i];
        else if (a[i] === ' ') out += ' ';
        else out += DX_CHARS[Math.floor(Math.random() * DX_CHARS.length)];
      }
      setDisplayA(out);
      if (progress < 1) decryptRaf.current = requestAnimationFrame(frame);
      else setDisplayA(a);
    }
    decryptRaf.current = requestAnimationFrame(frame);
  }

  function handleClick() {
    if (!open) {
      const scrambled = a.split('').map(c => c === ' ' ? ' ' : DX_CHARS[Math.floor(Math.random() * DX_CHARS.length)]).join('');
      setDisplayA(scrambled);
      setOpen(true);
      setTimeout(runDecrypt, 40);
    } else {
      cancelAnimationFrame(decryptRaf.current);
      setOpen(false);
      setDisplayA('');
    }
  }

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden bg-panel/60 transition-colors duration-300 hover:border-cyan/20 active:border-cyan/30">
      <button
        onClick={handleClick}
        onMouseEnter={startScramble}
        onMouseLeave={stopScramble}
        className="w-full flex items-center justify-between gap-4 px-5 py-5 md:px-6 text-left group cursor-pointer min-h-[56px]"
        aria-expanded={open}
      >
        <span
          className="font-mono text-sm md:text-base text-text-main group-hover:text-white transition-colors leading-snug tracking-tight"
          style={{ textShadow: 'calc(-1 * var(--faq-gs, 0px)) 0 #00f0ff, var(--faq-gs, 0px) 0 #ff3366' }}
        >
          {displayQ}
        </span>
        <span className={`shrink-0 w-7 h-7 md:w-6 md:h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? 'border-cyan bg-cyan/10 rotate-45' : 'border-white/20 group-hover:border-cyan/40 group-active:border-cyan/60'}`}>
          <ChevronRight size={12} className={`transition-colors ${open ? 'text-cyan' : 'text-text-muted group-hover:text-white'}`} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 pt-3 text-sm md:text-[15px] text-[#00f0ff]/80 leading-relaxed border-t border-white/5 font-sans whitespace-pre-wrap break-words">
              {displayA || a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQDecryptionSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const glitch = useRef({ split: 0, skew: 0, raf: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    // Disable scroll-driven glitch on mobile — it causes jank and is disorienting
    if (isMobile) return;

    const el = listRef.current;
    if (!el) return;

    let lastY = window.scrollY;
    let lastT = performance.now();

    function apply(split: number, skew: number) {
      el!.style.setProperty('--faq-gs', `${split.toFixed(2)}px`);
      el!.style.transform = `skewX(${(-skew).toFixed(3)}deg)`;
    }

    function decay() {
      const g = glitch.current;
      g.split *= 0.84;
      g.skew  *= 0.84;
      if (g.split > 0.04 || g.skew > 0.002) {
        apply(g.split, g.skew);
        g.raf = requestAnimationFrame(decay);
      } else {
        g.split = 0; g.skew = 0;
        apply(0, 0);
      }
    }

    function onScroll() {
      const now = performance.now();
      const dt  = Math.max(now - lastT, 1);
      const dy  = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      lastT = now;

      const v = (dy / dt) * 1000;
      const t = Math.min(v / 1800, 1);
      const g = glitch.current;
      g.split = Math.max(g.split, t * 5);
      g.skew  = Math.max(g.skew,  t * 1.5);

      cancelAnimationFrame(g.raf);
      apply(g.split, g.skew);
      g.raf = requestAnimationFrame(decay);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(glitch.current.raf);
    };
  }, [isMobile]);

  return (
    <motion.section
      id="faq"
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <SectionHeader number="09" command="> ./faq --resolve-objections" title="Frequently Asked Questions" />
      <p className="text-text-muted mt-4 mb-8 md:mb-12 max-w-2xl text-sm md:text-base leading-relaxed">
        Real answers to the questions clients ask before reaching out — so you don&apos;t have to wait for a reply to decide.
      </p>
      <div ref={listRef} className="max-w-3xl space-y-3 md:space-y-3" style={{ transformOrigin: 'center center' }}>
        {FAQ_DATA.map((item, i) => (
          <FAQDecryptItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </motion.section>
  );
}
