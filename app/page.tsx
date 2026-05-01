'use client';

import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { 
  Terminal, Code2, Link as IconLink, 
  MapPin, CheckCircle2, ChevronRight, ChevronDown,
  MonitorPlay, Youtube, Github, Twitter, Instagram, Linkedin, Send,
  Star, GitFork, Activity, Download
} from 'lucide-react';
import { StockChart } from '@/components/StockChart';
import { ModelViewer } from '@/components/ModelViewer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';
const CertPdfViewer = dynamic(() => import('@/components/CertPdfViewer').then(m => m.CertPdfViewer), { ssr: false });
import { useIsMobile } from '@/hooks/use-mobile';

const phrases = [
  "AI Developer.",
  "Automation Engineer.",
  "Systems Builder.",
  "SaaS Founder."
];

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
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Modals state
  const [modalType, setModalType] = useState<'form' | 'cert' | 'workflow' | null>(null);
  const [certData, setCertData] = useState<{title: string, issuer: string, date: string, id: string, pdfUrl?: string} | null>(null);
  const isMobile = useIsMobile();

  const openCert = (data: {title: string, issuer: string, date: string, id: string, pdfUrl?: string}) => {
    setCertData(data);
    setModalType('cert');
  };

  // Github state
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);

  useEffect(() => {
    // Ensure the page boots at the very top.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing effect
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex < currentPhrase.length) {
      timeout = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 50);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(c => c - 1);
      }, 30);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((p) => (p + 1) % phrases.length);
      }, 50);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

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
      {/* Blueprint animated background */}
      <div className="fixed inset-0 z-0 bg-blueprint opacity-30 animate-grid"></div>
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg/90 backdrop-blur-md border-b border-cyan/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="font-mono text-cyan text-lg md:text-xl tracking-widest font-bold hover:text-glow-cyan transition-all duration-300">
            PRIMUEZ
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 font-mono text-xs tracking-widest uppercase text-text-muted">
            <a href="#whoami" className="hover:text-cyan transition-colors">About</a>
            <a href="#projects" className="hover:text-cyan transition-colors">Projects</a>
            <a href="#github" className="hover:text-cyan transition-colors">GitHub</a>
            <a href="#youtube" className="hover:text-cyan transition-colors">Videos</a>
            <a href="#stack" className="hover:text-cyan transition-colors">Stack</a>
            <a href="#credentials" className="hover:text-cyan transition-colors">Credentials</a>
            <a href="#contact" className="hover:text-cyan transition-colors">Contact</a>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
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
              <div className="flex flex-col px-6 py-4 gap-5 font-mono text-sm tracking-widest uppercase text-text-muted">
                {['About:#whoami','Projects:#projects','GitHub:#github','Videos:#youtube','Stack:#stack','Credentials:#credentials','Contact:#contact'].map(item => {
                  const [label, href] = item.split(':');
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-cyan transition-colors border-b border-cyan/10 pb-3 last:border-0 last:pb-0"
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-32">
        {/* HERO SECTION */}
        <section id="hero" className="min-h-screen flex flex-col justify-center pt-16 md:pt-20">
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="font-mono text-amber text-sm mb-6 flex items-center gap-2">
              <Terminal size={14} /> SYS.INIT()
            </div>
            
            <div className="h-8 md:h-10 mb-4 font-mono text-xl md:text-2xl text-cyan break-words">
              {typedText}
              <span className="inline-block w-2.5 h-6 md:h-8 bg-cyan ml-1 animate-pulse"></span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              I Build Systems <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-white">That Work For You.</span>
            </h1>

            <p className="text-text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-sans">
              Autonomous agents, intelligent workflows, and real shipped products — from Indore, India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#projects" className="px-8 py-4 bg-transparent border border-cyan text-cyan font-mono text-sm uppercase tracking-widest hover:bg-cyan/10 hover:border-glow-cyan transition-all duration-300 text-center flex items-center justify-center gap-2">
                <ChevronRight size={16} /> View My Work
              </a>
              <button onClick={() => setModalType('form')} className="px-8 py-4 bg-cyan text-bg font-mono font-bold text-sm uppercase tracking-widest hover:border-glow-cyan transition-all duration-300 text-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                Work With Me
              </button>
              <a href="/documents/resume.pdf" download="Rahul_Kasturiya_Resume.pdf" className="px-8 py-4 bg-transparent border border-amber text-amber font-mono text-sm uppercase tracking-widest hover:bg-amber/10 transition-all duration-300 text-center flex items-center justify-center gap-2">
                <Download size={16} /> Download Resume
              </a>
            </div>

            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <span className="bg-panel border border-cyan/20 text-text-main px-3 py-1.5 rounded flex items-center gap-2">
                <Code2 size={14} className="text-amber" /> 10+ Projects Built
              </span>
              <span className="bg-panel border border-cyan/20 text-text-main px-3 py-1.5 rounded flex items-center gap-2">
                <Terminal size={14} className="text-cyan" /> Self-Taught, No CS Degree
              </span>
            </div>
          </motion.div>
        </section>

        {/* 01. ABOUT */}
        <motion.section 
          id="whoami" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="01" command="> whoami" title="About" />
          <div className="grid md:grid-cols-2 gap-12 mt-12 bg-panel/50 border border-cyan/10 p-8 md:p-12 backdrop-blur-sm rounded-xl">
            <div className="space-y-6 text-text-main leading-relaxed">
              <p>
                I&apos;m <strong className="text-cyan font-mono">Rahul Kasturiya (Primuez)</strong> — a self-taught AI developer and automation engineer. I don&apos;t just use AI tools. I design systems that use tools, adapt, and execute workflows autonomously.
              </p>
              <p>
                My work sits at the intersection of <strong className="text-white">n8n orchestration</strong>, <strong className="text-white">LLM agent design</strong>, and <strong className="text-white">Cloudflare-based deployment</strong>. I&apos;ve built SaaS products, enterprise automation architectures, hackathon submissions, and client-facing AI systems — without a CS degree, without a team, from central India.
              </p>
              <p>
                I think in systems before I write a single line of logic. I build for modularity, fallback reliability, and zero manual intervention.
              </p>
            </div>
            <div className="flex flex-col gap-4 font-mono text-sm justify-center">
              <div className="p-4 border-l-2 border-amber bg-bg/50">
                <span className="text-text-muted mb-1 block">Education</span>
                Commerce Graduate · KPS, Dunda
              </div>
              <div className="p-4 border-l-2 border-cyan bg-bg/50">
                <span className="text-text-muted mb-1 block">Experience</span>
                AI Automation · Since July 2025
              </div>
              <div className="p-4 border-l-2 border-amber bg-bg/50">
                <span className="text-text-muted mb-1 block">Location</span>
                <span className="flex items-center gap-2"><MapPin size={14} /> Indore, Madhya Pradesh, India</span>
              </div>
              <div className="p-4 border-l-2 border-cyan bg-bg/50">
                <span className="text-text-muted mb-1 block">Languages</span>
                Hindi · English (C2) · Sindhi (C2)
              </div>
            </div>
          </div>
        </motion.section>

        {/* 02. PROJECTS */}
        <motion.section 
          id="projects" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="02" command="> ./projects --all" title="Projects & Automated Systems" />
          
          <ProjectGroup title="SaaS Products" color="cyan">
            <ProjectCard 
              name="InkTwin" 
              url="https://ink-twin.primuez.com"
              desc="Upload a handwriting photo → generates your personal font. Type anything and it looks handwritten, download as PDF. Additional tools include AI homework solver from a photo."
              tags={["Cloudflare Workers", "AI", "JavaScript", "Font Generation"]}
              logoUrl="https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&w=200&h=200&q=80"
            />
            <ProjectCard 
              name="PrimuezSure Advisor" 
              url="https://primuezsure.primuez.com"
              desc="AI-powered insurance advisor SaaS. Helps users understand and choose the right insurance coverage via intelligent Q&A."
              tags={["AI Agent", "SaaS", "Cloudflare Workers", "LLM"]}
              logoUrl="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=200&h=200&q=80"
            />
          </ProjectGroup>

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
            />
          </ProjectGroup>

          <ProjectGroup title="Automation Systems" color="cyan">
            <ProjectCard 
              name="AI WhatsApp Agent" 
              desc="Semi-autonomous conversational AI agent with full token lifecycle management. Handles 60-day token expiry and auto-refresh entirely through n8n."
              tags={["n8n", "WhatsApp", "Evolution API", "Token Automation"]}
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
              <button 
                onClick={() => setModalType('workflow')}
                className="w-full md:w-auto px-8 py-4 bg-panel border border-cyan/40 rounded-xl hover:border-cyan text-cyan font-mono text-sm uppercase tracking-widest transition-all hover:bg-cyan/10 flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              >
                <Activity size={18} /> View Interactive Architecture Diagram
              </button>
            </div>
          </ProjectGroup>

          {/* NEW SECTION: VISUAL WORKFLOWS & 3D ELEMENTS */}
          <div className="mt-12 md:mt-24 pt-10 md:pt-16 border-t border-cyan/10">
            <SectionHeader number="02.1" command="> ./render --3d" title="Interactive Elements & Favorites" />
            
            <div className="grid md:grid-cols-2 gap-12 mt-12 mb-16 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 font-sans border-l-4 border-cyan pl-4">Interactive 3D Orchestration Core</h3>
                <p className="text-text-muted mb-6 leading-relaxed">
                  Hover and grab the core object to rotate. This interactive 3D model powered by Three.js and React Three Fiber serves as an abstraction of my n8n central orchestrator—routing payloads, scaling compute, and connecting multiple AI pipelines.
                </p>
                <ul className="space-y-2 font-mono text-xs text-text-muted">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span> @react-three/fiber processing</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse delay-75"></span> MeshDistortMaterial applied</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse delay-150"></span> Interactive rotation axes mapped</li>
                </ul>
              </div>
              <div>
                <ErrorBoundary>
                  <ModelViewer />
                </ErrorBoundary>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan mb-6 pb-2 border-b border-cyan/30 inline-block">
                ▸ My Personal Favourites
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-[2000px]">
                <WorkflowCard 
                  name="Daily AI News Agent" 
                  desc="Gives me signal from the noise, tells me its use cases for AI news both international & national, and generates a TTS voice note of the entire news."
                  image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&h=600&q=80"
                  delay={0}
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
              </div>
            </div>
          </div>
        </motion.section>

        {/* 03. GITHUB */}
        <motion.section 
          id="github" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo) => (
                  <a 
                    key={repo.id} 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-panel border border-cyan/10 p-6 rounded-xl hover:border-cyan/50 hover:bg-cyan/5 transition-all group block shadow-lg flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <Github className="text-text-muted group-hover:text-cyan group-hover:scale-110 transition-all" size={24}/>
                        <div className="flex gap-3 text-xs font-mono text-text-muted">
                          <span className="flex items-center gap-1 group-hover:text-amber transition-colors"><Star size={12}/> {repo.stargazers_count}</span>
                          <span className="flex items-center gap-1 group-hover:text-amber transition-colors"><GitFork size={12}/> {repo.forks_count}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-cyan transition-colors line-clamp-1">{repo.name}</h3>
                      <p className="text-sm text-text-muted line-clamp-2">{repo.description || 'No description provided.'}</p>
                    </div>
                    {repo.language && (
                      <div className="mt-4 flex items-center gap-2 text-xs font-mono text-text-muted">
                        <span className="w-2 h-2 rounded-full border border-cyan/50 bg-cyan/20"></span> {repo.language}
                      </div>
                    )}
                  </a>
                ))}
              </div>
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
        </motion.section>

        {/* 04. YOUTUBE CONTENT */}
        <motion.section 
          id="youtube" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="04" command="> ./content --media" title="Video Presentations" />
          <div className="grid lg:grid-cols-2 gap-8 mt-12">
            
            <div className="bg-panel border border-cyan/20 p-8 rounded-xl backdrop-blur-md flex flex-col justify-center items-center text-center font-mono">
              <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mb-6 border border-cyan/20">
                <IconLink className="text-cyan" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 font-sans">Automating Your Business & Playlists</h3>
              <p className="text-text-muted mb-8 max-w-sm text-sm">
                Access my curated playlists for complete run-throughs of the autonomous enterprise model, n8n orchestration setups, and advanced system architecture.
              </p>
              <a href="https://www.youtube.com/@Primuez/playlists" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-sm tracking-widest uppercase border border-cyan bg-cyan/10 text-cyan px-8 py-4 hover:bg-cyan hover:text-bg transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                 View Playlists
              </a>
            </div>

            <div className="bg-panel border border-cyan/20 p-8 rounded-xl backdrop-blur-md flex flex-col justify-center items-center text-center font-mono">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <Youtube className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 font-sans">Subscribe to Primuez</h3>
              <p className="text-text-muted mb-8 max-w-sm text-sm">
                Subscribe for detailed walkthroughs of n8n automation deployments, multi-agent AI setups, and live build sessions from scratch.
              </p>
              <a href="https://youtube.com/@Primuez" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-sm tracking-widest uppercase border border-red-500/50 hover:border-red-500 text-red-500 px-8 py-4 hover:bg-red-500/10 transition-colors">
                <MonitorPlay size={16} /> Watch Channel
              </a>
            </div>

          </div>
        </motion.section>

        {/* 05. TECH STACK */}
        <motion.section 
          id="stack" 
          className="pt-16 md:pt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="06" command="> ./credentials --verified" title="Credentials & Hackathons" />
          
          <div className="grid md:grid-cols-2 gap-8 mt-12 relative z-10 w-full max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
              <h3 className="text-amber uppercase font-mono tracking-widest text-sm mb-2 pl-2 border-l-2 border-amber">[ CERTIFICATIONS ]</h3>
              
              <CVAccordion title="n8n Official Certifications">
                <p className="text-sm text-text-muted mb-4">Completed both official n8n course levels demonstrating advanced automation mastery.</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => openCert({title: 'n8n Course Level 1 & 2', issuer: 'n8n', date: 'Verified', id: 'N8N-L1-L2', pdfUrl: '/documents/cert-n8n-1.pdf'})}
                    className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-2 hover:bg-cyan hover:text-bg transition-colors"
                  >View Master Certificate</button>
                </div>
              </CVAccordion>

              <CVAccordion title="SimpliLearn: n8n No Code AI Agent">
                <p className="text-sm text-text-muted mb-4">Certificate #8723146 - Completed Aug 2, 2025.</p>
                <button 
                  onClick={() => openCert({title: 'n8n Course: No Code AI Agent Builder', issuer: 'SimpliLearn SkillUP', date: '2nd August 2025', id: '8723146', pdfUrl: '/documents/cert-n8n-2.pdf'})}
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-2 hover:bg-cyan hover:text-bg transition-colors"
                >View Certificate</button>
              </CVAccordion>

              <CVAccordion title="Outskill: Generative AI Mastermind">
                <p className="text-sm text-text-muted mb-4">Successfully completed Generative AI Mastermind hosted by Vaibhav Sisinty.</p>
                <button 
                  onClick={() => openCert({title: 'Generative AI Mastermind', issuer: 'Outskill by Vaibhav Sisinty', date: 'Verified', id: 'OUT-GENAI-M'})}
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-2 hover:bg-cyan hover:text-bg transition-colors"
                >View Certificate</button>
              </CVAccordion>

              <CVAccordion title="Kaggle × Google: AI Agents Intensive">
                <p className="text-sm text-text-muted mb-4">5-Day AI Agents Intensive Course with Google. Earned Official Badge.</p>
                <button 
                  onClick={() => openCert({title: '5-Day AI Agents Intensive Course with Google', issuer: 'Kaggle & Google', date: 'December 18, 2025', id: 'KAG-GOOG', pdfUrl: '/documents/cert-kaggle-google.pdf#page=2'})}
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-2 hover:bg-cyan hover:text-bg transition-colors"
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
                  className="font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-2 hover:bg-cyan hover:text-bg transition-colors"
                >View Certificate</button>
              </CVAccordion>
              
              <CVAccordion title="Arc Hackathon — Agentic Commerce">
                <p className="text-sm text-text-muted mt-2">Built <strong>Primuez Guard</strong> — autonomous trust verification agent.</p>
              </CVAccordion>
            </div>
          </div>
        </motion.section>

        {/* 07. CONTACT */}
        <motion.section 
          id="contact" 
          className="pt-16 md:pt-32 text-center pb-12 md:pb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionHeader number="07" command="> ./contact --init" title="Connect" center />
          
          <h2 className="text-3xl md:text-5xl font-bold mt-12 mb-6">
            Let&apos;s Build Something <br className="hidden md:block"/> <span className="text-cyan">Autonomous.</span>
          </h2>
          <p className="text-text-muted mb-10 max-w-2xl mx-auto">
            Open to freelance projects, automation consulting, SaaS collabs, and enterprise systems. Drop an inquiry or book a synchronous demo.
          </p>

          <button onClick={() => setModalType('form')} className="inline-flex items-center gap-3 px-8 py-4 bg-cyan text-bg font-mono font-bold text-sm uppercase tracking-widest hover:bg-cyan/90 transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-12">
            <Send size={16} /> Work With Me
          </button>

          <p className="font-mono text-sm mb-16">
            Or direct comm-link: <a href="mailto:rahulkasturiya420@gmail.com" className="text-amber hover:text-cyan transition-colors">rahulkasturiya420@gmail.com</a>
          </p>

          {/* Social Icons row */}
          <div className="flex flex-wrap justify-center gap-4">
            <SocialIcon icon={<Github size={20}/>} label="GitHub (primuez)" href="https://github.com/primuez" />
            <SocialIcon icon={<Github size={20}/>} label="GitHub (primmius)" href="https://github.com/primmius" />
            <SocialIcon icon={<Linkedin size={20}/>} label="LinkedIn" href="https://www.linkedin.com/in/rahul-kasturiya-796910363" />
            <SocialIcon icon={<Twitter size={20}/>} label="X / Twitter" href="https://x.com/RKasturiya6738" />
            <SocialIcon icon={<Instagram size={20}/>} label="Instagram" href="https://www.instagram.com/primuez5" />
            <SocialIcon icon={<span className="font-bold text-lg leading-none">k</span>} label="Ko-fi" href="https://ko-fi.com/primuez" />
            <SocialIcon icon={<span className="font-bold text-lg leading-none">Up</span>} label="Upwork" href="https://www.upwork.com/freelancers/~012ee7737a8d40746f" />
          </div>
        </motion.section>

      </div>

      <footer className="border-t border-cyan/10 bg-bg p-8 text-center font-mono text-sm text-text-muted mt-20 relative z-10">
        &copy; 2026 Primuez · Built with intent.
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
                  <span className="text-cyan flex items-center gap-2"><Send size={14}/> [ SECURE COMM-LINK ESTABLISHED ]</span>
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

function SectionHeader({ number, command, title, center = false }: { number: string, command: string, title: string, center?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`mb-8 ${center ? 'text-center' : ''}`}
    >
      <div className="font-mono text-xs tracking-[0.2em] text-cyan/70 mb-2">
        {"//"} {number} &nbsp; {command}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-text-muted inline-block">
        {title}
      </h2>
    </motion.div>
  );
}

function ProjectGroup({ title, children, color }: { title: string, children: React.ReactNode, color: string }) {
  const borderColor = color === 'cyan' ? 'border-cyan/30' : 'border-amber/30';
  const textColor = color === 'cyan' ? 'text-cyan' : 'text-amber';
  
  return (
    <div className="mt-16">
      <h3 className={`font-mono text-xs uppercase tracking-[0.2em] ${textColor} mb-6 pb-2 border-b ${borderColor} inline-block`}>
        ▸ {title}
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function ProjectCard({ name, url, desc, tags, logoUrl, bannerUrl, children }: { name: string, url?: string, desc: string, tags: string[], logoUrl?: string, bannerUrl?: string, children?: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ scale: 1.02, y: -8, boxShadow: "0 15px 50px -10px rgba(0,240,255,0.3)" }}
      className="bg-panel border border-cyan/10 rounded-xl p-6 transition-colors duration-300 group overflow-hidden relative flex flex-col"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {bannerUrl && (
        <div className="w-full h-48 mb-6 rounded-lg overflow-hidden border border-cyan/20 relative shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent z-10"></div>
          <img src={bannerUrl} alt={`${name} schematic`} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 hover:scale-105" referrerPolicy="no-referrer" />
        </div>
      )}

      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex items-center gap-4">
          {logoUrl && (
            <div className="w-12 h-12 rounded-lg border border-cyan/20 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-shadow">
              <img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
            </div>
          )}
          <h4 className="text-xl font-bold group-hover:text-cyan transition-colors">{name}</h4>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase px-2 py-1 bg-cyan/10 text-cyan border border-cyan/20 rounded hover:bg-cyan hover:text-bg transition-colors relative z-20">
            <IconLink size={12} /> Live
          </a>
        )}
      </div>
      
      <p className="text-text-muted text-sm leading-relaxed mb-6">{desc}</p>
      
      {children && (
        <div className="mb-6 relative z-10">
          {children}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {tags.map((tag, i) => (
          <span key={i} className="font-mono text-[10px] uppercase text-text-muted bg-bg/50 px-2 py-1 rounded border border-white/5 group-hover:border-cyan/20 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function WorkflowCard({ name, desc, image, delay = 0 }: { name: string, desc: string, image: string, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, type: "spring", stiffness: 100 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group w-full block h-full md:[perspective:1000px]"
    >
      <div className="w-full h-full bg-panel/80 border border-cyan/30 rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform-gpu md:group-hover:rotate-x-12 md:group-hover:-rotate-y-12 group-hover:-translate-y-2 md:group-hover:-translate-y-4 group-hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] md:group-hover:shadow-[20px_20px_60px_rgba(0,240,255,0.2)] flex flex-col relative md:[transform-style:preserve-3d]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Image Banner */}
        <div className="w-full h-40 sm:h-48 relative overflow-hidden border-b border-cyan/20 bg-black/50 p-2">
           <div className="w-full h-full relative rounded-lg overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-bg/50">
             <img 
               src={image} 
               alt={name} 
               className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" 
               referrerPolicy="no-referrer" 
             />
           </div>
        </div>
        
        <div className="p-4 sm:p-6 relative z-10 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-2 rounded-full bg-amber group-hover:shadow-[0_0_10px_#f5a623] transition-shadow shrink-0"></div>
             <h4 className="text-base sm:text-xl font-bold group-hover:text-cyan transition-colors">{name}</h4>
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
  const borderColor = border === 'cyan' ? 'border-cyan/30' : 'border-amber/30';
  const textColor = border === 'cyan' ? 'text-cyan' : 'text-amber';

  return (
    <div className={`bg-panel border border-cyan/10 p-6 rounded-xl hover:${borderColor} transition-colors duration-300`}>
      <div className={`text-xs uppercase tracking-widest mb-4 ${textColor}`}>[ {title} ]</div>
      <ul className="space-y-3 block">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-text-muted flex items-center gap-2 border-b border-white/5 pb-2 last:border-0 last:pb-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan/40"></span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group relative flex items-center justify-center w-12 h-12 bg-panel border border-cyan/20 rounded-lg text-text-muted hover:text-cyan hover:border-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 hover:-translate-y-1"
    >
      {icon}
      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-panel border border-cyan/30 text-cyan text-xs font-mono px-3 py-1 rounded pointer-events-none whitespace-nowrap shadow-[0_0_10px_rgba(0,240,255,0.2)] flex flex-col items-center">
        {label}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-cyan/30"></div>
      </span>
    </a>
  );
}
