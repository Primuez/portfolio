'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { SectionHeader } from '@/components/SectionHeader';

interface Tool {
  name: string;
  desc: string;
  icon: React.ReactNode;
}

interface StackGroupProps {
  title: string;
  items: Tool[];
  border: 'cyan' | 'amber';
}

function StackGroup({ title, items, border }: StackGroupProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6]);

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);

    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const spotlightBg = useMotionTemplate`radial-gradient(280px circle at ${spotlightX}px ${spotlightY}px, ${
    border === 'cyan' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(245, 166, 35, 0.15)'
  }, transparent 80%)`;

  const textColor = border === 'cyan' ? 'text-cyan' : 'text-amber';
  const innerBezelColor = border === 'cyan' ? 'border-cyan/10 group-hover:border-cyan/25' : 'border-amber/10 group-hover:border-amber/25';
  const rivetColor = border === 'cyan' ? 'group-hover:bg-cyan group-hover:shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'group-hover:bg-amber group-hover:shadow-[0_0_8px_rgba(245,166,35,0.8)]';
  const textHoverColor = border === 'cyan' ? 'group-hover/item:text-cyan' : 'group-hover/item:text-amber';

  return (
    <div 
      className="perspective-1000 w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex flex-col p-6 rounded-2xl border border-white/[0.08] bg-[#07090e]/95 backdrop-blur-md h-full
          shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden liquid-glass-card group"
      >
        {/* Double Bezel Design Element */}
        <div className={`absolute inset-[4px] rounded-[14px] border ${innerBezelColor} transition-colors duration-300 pointer-events-none z-10`} />

        {/* 4 Corner Screws / Rivets for Physical Tactility */}
        <div className={`absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-white/10 ${rivetColor} transition-all duration-300 pointer-events-none z-20 flex items-center justify-center`}>
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>
        <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/10 ${rivetColor} transition-all duration-300 pointer-events-none z-20 flex items-center justify-center`}>
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>
        <div className={`absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-white/10 ${rivetColor} transition-all duration-300 pointer-events-none z-20 flex items-center justify-center`}>
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>
        <div className={`absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-white/10 ${rivetColor} transition-all duration-300 pointer-events-none z-20 flex items-center justify-center`}>
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>

        {/* Dynamic Cursor Spotlight Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: spotlightBg }}
        />

        {/* Title */}
        <div className={`text-xs font-mono uppercase tracking-[0.2em] mb-6 flex items-center justify-between ${textColor} font-bold z-20 relative`}>
          <span>[ {title} ]</span>
          <span className="opacity-40 text-[10px]">0x{items.length.toString(16).toUpperCase()}</span>
        </div>

        {/* List of tools with staggered fade-in */}
        <motion.ul
          className="space-y-4 block z-20 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
            hidden: {},
          }}
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group/item flex items-center gap-3.5 border-b border-white/[0.02] pb-3.5 last:border-0 last:pb-0 transition-all duration-300 cursor-default"
            >
              {/* Logo container */}
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.02] border border-white/[0.04] text-text-muted group-hover/item:text-white group-hover/item:bg-white/[0.05] group-hover/item:border-white/[0.1] group-hover/item:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 shrink-0 animate-grid">
                <div className="w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover/item:scale-110">
                  {item.icon}
                </div>
              </div>
              {/* Tool info */}
              <div className="flex-1 min-w-0">
                <div className={`text-white text-xs font-bold leading-none transition-colors duration-300 ${textHoverColor} font-sans truncate`}>
                  {item.name}
                </div>
                <div className="text-[10px] text-text-muted/60 mt-1 font-sans truncate">
                  {item.desc}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}

export default function StackSection() {
  // SVG Icons for the tools - custom crafted for premium aesthetic
  const icons = {
    n8n: (
      <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <path d="M5 16V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7" />
        <line x1="12" y1="8" x2="12" y2="16" />
      </svg>
    ),
    openrouter: (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
    deepseek: (
      <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 0-7.3 16.8L3 21l4.2-1.7A10 10 0 1 0 12 2z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 9a3.5 3.5 0 0 0-3.5 3.5" />
      </svg>
    ),
    mistral: (
      <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    llama: (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    ollama: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v12M8 10h8" />
      </svg>
    ),
    cloudflare: (
      <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42 0-.83.07-1.22.21a6.5 6.5 0 0 0-12.28 2.29A4 4 0 0 0 6.5 19h11z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9l-2.5 3h5L12 9z" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
    vps: (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
        <line x1="20" y1="6" x2="20" y2="6" />
        <line x1="20" y1="18" x2="20" y2="18" />
      </svg>
    ),
    vercel: (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22h20L12 2z" />
      </svg>
    ),
    docker: (
      <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="12" width="6" height="4" />
        <rect x="9" y="12" width="6" height="4" />
        <rect x="16" y="12" width="6" height="4" />
        <rect x="9" y="7" width="6" height="4" />
        <path d="M2 16c0 4 4 6 10 6s10-2 10-6" />
      </svg>
    ),
    odoo: (
      <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6a6 6 0 1 1-6 6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    gst: (
      <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    indiamart: (
      <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    js: (
      <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    ),
    python: (
      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v10m0 0v10m0-10h10m-10 0H2" />
        <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
      </svg>
    ),
    bash: (
      <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    agents: (
      <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    )
  };

  const aiTools: Tool[] = [
    { name: 'n8n Workflow Automation', desc: 'Primary workflows, APIs & auto-triggers', icon: icons.n8n },
    { name: 'OpenRouter Aggregator', desc: 'Unified LLM access & token cost optimizations', icon: icons.openrouter },
    { name: 'DeepSeek Reasoning', desc: 'Deep-reasoning chain for core decision logic', icon: icons.deepseek },
    { name: 'Mistral Weights', desc: 'Sleek open-weight engines for specific parsing', icon: icons.mistral },
    { name: 'LLaMA3 Inference', desc: 'Self-hosted LLMs for offline pattern analysis', icon: icons.llama },
    { name: 'AI Agents & RAG', desc: 'Vector search & autonomous prompt pipelines', icon: icons.agents }
  ];

  const infraTools: Tool[] = [
    { name: 'Cloudflare Workers', desc: 'Serverless deployment globally at the edge', icon: icons.cloudflare },
    { name: 'Hostinger VPS', desc: 'Long-lived cron queues & task schedulers', icon: icons.vps },
    { name: 'Docker Containers', desc: 'Secure system containment & virtualization', icon: icons.docker },
    { name: 'Vercel Deployment', desc: 'Edge CDN frontend hosting with instant builds', icon: icons.vercel }
  ];

  const erpTools: Tool[] = [
    { name: 'Odoo ERP / CRM', desc: 'Enterprise data hub & automated ledger entries', icon: icons.odoo },
    { name: 'GST Auto-Reconciliation', desc: 'Government tax filing verification engines', icon: icons.gst },
    { name: 'IndiaMART Webhooks', desc: 'Sub-second real-time lead capturing API', icon: icons.indiamart }
  ];

  const langTools: Tool[] = [
    { name: 'JavaScript / Node.js', desc: 'Custom serverless APIs & script logic', icon: icons.js },
    { name: 'Python Systems', desc: 'AI orchestration, math models & script agents', icon: icons.python },
    { name: 'Bash & Shell scripting', desc: 'VPS administration, backups & file checks', icon: icons.bash }
  ];

  return (
    <motion.section 
      id="stack" 
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="05" command="> ./stack --verbose" title="Technical Arsenal" />
      <p className="text-text-muted mt-4 mb-10 max-w-2xl text-base leading-relaxed">
        I don&apos;t just read tutorials. Below are the actual tools and technologies running live on my systems, fully customized for enterprise automation.
      </p>

      {/* Grid of Double-Bezel Hardware Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12">
        <StackGroup title="AI & Orchestration" items={aiTools} border="cyan" />
        <StackGroup title="Infra & Deploy" items={infraTools} border="amber" />
        <StackGroup title="ERP & Business" items={erpTools} border="cyan" />
        <StackGroup title="Dev Languages" items={langTools} border="amber" />
      </div>
    </motion.section>
  );
}
