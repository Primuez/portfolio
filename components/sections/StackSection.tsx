'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from '@/components/SectionHeader';

// Interface for interactive tools
interface Tool {
  name: string;
  desc: string;
  icon: React.ReactNode;
  border: 'cyan' | 'amber';
  cmd: string;
  output: string[];
}

// Categories of technical stack
interface Category {
  id: string;
  folder: string;
  title: string;
  tools: Tool[];
}

export default function StackSection() {
  const [activeCategory, setActiveCategory] = useState<string>('ai');
  const [selectedTool, setSelectedTool] = useState<string>('n8n');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

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
    )
  };

  const STACK_CATEGORIES: Category[] = [
    {
      id: 'ai',
      folder: 'ai_orchestration',
      title: 'AI & Orchestration',
      tools: [
        {
          name: 'n8n',
          desc: 'Primary workflow orchestrator connecting LLMs, databases, and webhooks.',
          icon: icons.n8n,
          border: 'cyan',
          cmd: 'cat /etc/n8n/workflows.json | grep -A 3 "status"',
          output: [
            '[SYSTEM] Accessing database... ok',
            '[INFO] Fetching active pipelines:',
            '  - IndiaMART Webhook -> Odoo CRM sync: ACTIVE (Uptime 99.9%)',
            '  - WhatsApp Auto-Followup Agent: ACTIVE (1,240 runs today)',
            '  - GST Reconciliation Cron: IDLE (Triggers daily 20:00 IST)',
            '[SUCCESS] All 14 custom automation services operating normally.'
          ]
        },
        {
          name: 'OpenRouter',
          desc: 'Unified router for optimal LLM access to DeepSeek, GPT-4, and Claude.',
          icon: icons.openrouter,
          border: 'cyan',
          cmd: 'curl -s https://openrouter.ai/api/v1/models/active',
          output: [
            '[HTTP] GET /api/v1/models/active 200 OK',
            '[SUCCESS] Connected to router engine.',
            '  * deepseek/deepseek-chat : Primary (Fallback: mistralai/mistral-large)',
            '  * openai/gpt-4o-mini : Active (Fallback: claude-3-haiku)',
            '  * Average Routing Latency: 168ms',
            '  * Cost optimization rules applied: -42% token overhead saved.'
          ]
        },
        {
          name: 'DeepSeek',
          desc: 'Elite cost-effective reasoning engine for core automation logic.',
          icon: icons.deepseek,
          border: 'cyan',
          cmd: 'python3 -m deepseek --prompt="Reconcile invoices"',
          output: [
            '[AGENT] Starting DeepSeek-R1 deep reasoning chain...',
            '[THOUGHT] Step 1: Query un-reconciled invoices from Odoo...',
            '[THOUGHT] Step 2: Correlate transaction IDs against PDF bank statement...',
            '[THOUGHT] Step 3: Flag exceptions (3 items missing matching metadata)...',
            '[AGENT] Audit completed. Output: 147 reconciled, 3 flagged. Accuracy 100%.'
          ]
        },
        {
          name: 'Mistral & LLaMA',
          desc: 'Advanced open-weight models for self-hosted parsing tasks.',
          icon: icons.mistral,
          border: 'cyan',
          cmd: 'ollama run llama3:8b "Check spam pattern"',
          output: [
            '[LOCAL] Initializing LLaMA3 neural weights on self-hosted GPU...',
            '[SYSTEM] Model loaded successfully in 45ms. VRAM utilized: 4.8GB.',
            '[PROCESS] Scanning input email content for phishing pattern...',
            '  * Confidence Score: 0.94 (Spam detected)',
            '  * Classification: Auto-archive webhook triggered.',
            '[SUCCESS] Process completed.'
          ]
        }
      ]
    },
    {
      id: 'infra',
      folder: 'infra_deploy',
      title: 'Infra & Deploy',
      tools: [
        {
          name: 'Cloudflare Workers',
          desc: 'Global serverless hosting at the edge with zero cold starts.',
          icon: icons.cloudflare,
          border: 'amber',
          cmd: 'wrangler deploy --env production',
          output: [
            '[WRANGLER] Bundling serverless code with esbuild...',
            '[SUCCESS] Uploaded core script to edge servers globally!',
            '  - Global latency: 12ms average (34 edge centers mapped)',
            '  - Deployment URL: https://api.primuez.com',
            '  - Rate limiter: ACTIVE (Max 100 req/min/IP)',
            '  - Serverless bill: $0.00 (operating well below free limit!)'
          ]
        },
        {
          name: 'Hostinger VPS',
          desc: 'Dedicated VPS running long-lived background automation queues.',
          icon: icons.vps,
          border: 'amber',
          cmd: 'ssh vps.primuez.com "uptime && free -m"',
          output: [
            'rahul@vps.primuez.com\'s password: **********',
            '06:17:42 up 14 days,  2:12,  1 user,  load average: 0.12, 0.08, 0.05',
            '              total        used        free      shared  buff/cache   available',
            'Mem:           7980        1840        4210         110        1930        5820',
            'Swap:          2048         124        1924',
            '[SUCCESS] Server running smoothly. CPU usage minimal.'
          ]
        },
        {
          name: 'Docker',
          desc: 'Safe sandboxed container environment for self-hosted utilities.',
          icon: icons.docker,
          border: 'amber',
          cmd: 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"',
          output: [
            'NAMES                      STATUS                  PORTS',
            'primuez-n8n-main           Up 14 days (healthy)    0.0.0.0:5678->5678/tcp',
            'postgres-odoo-db           Up 14 days (healthy)    5432/tcp',
            'redis-cache-layer          Up 14 days (healthy)    6379/tcp',
            'local-deepseek-inference   Up 4 days (healthy)     8000/tcp'
          ]
        },
        {
          name: 'Vercel',
          desc: 'High-performance hosting for interactive frontend interfaces.',
          icon: icons.vercel,
          border: 'amber',
          cmd: 'vercel --prod',
          output: [
            'Vercel CLI 34.0.0',
            '[SYSTEM] Retrieving project settings...',
            '[PROCESS] Building site bundle (Next.js SSR)...',
            '[SUCCESS] Production deployment verified: https://primuez.com',
            '  - Performance Score: 100/100 (Google Lighthouse Mobile/Desktop)',
            '  - Edge Network: Global Anycast CDN'
          ]
        }
      ]
    },
    {
      id: 'business',
      folder: 'erp_business',
      title: 'ERP & Business',
      tools: [
        {
          name: 'Odoo ERP/CRM',
          desc: 'Enterprise business suite configured for automated ledger entries.',
          icon: icons.odoo,
          border: 'cyan',
          cmd: 'odoo-client --action sync_partners',
          output: [
            '[ODOO-API] Initializing XML-RPC client session... ok',
            '[INFO] Fetching newly created leads from pipeline...',
            '  * Found: 12 new leads in inbox.',
            '  * Match: 12 partners successfully injected into Odoo database.',
            '  * Ledgers: Auto-generated draft invoices for outstanding orders.',
            '[SUCCESS] Sync finished. CRM database up-to-date.'
          ]
        },
        {
          name: 'GST Portal',
          desc: 'Auto-reconciliation code for tax filing calculations.',
          icon: icons.gst,
          border: 'cyan',
          cmd: 'node gst-reconciler.js --period="Q1-2026"',
          output: [
            '[SYSTEM] Reading Excel purchase register files...',
            '[PROCESS] Cross-matching against GST portal JSON tables...',
            '  - Matches found: 412 transactions (Input Tax Credit validated)',
            '  - Discrepancies: 2 flagged (Auto-notified suppliers via email)',
            '  - Saved tax leakages: INR 42,500 calculated.',
            '[SUCCESS] Reconciled data locked and exported to docs/gst/Q1_2026.xlsx'
          ]
        },
        {
          name: 'IndiaMART API',
          desc: 'Instant webhooks capturing client queries under 1.5 seconds.',
          icon: icons.indiamart,
          border: 'cyan',
          cmd: 'tail -n 5 /var/log/indiamart-webhook.log',
          output: [
            '2026-05-29 06:15:10 [WEBHOOK] Lead Received: "Anish Steel Pvt Ltd"',
            '2026-05-29 06:15:11 [PARSER] Identified Intent: "Stainless steel sheets Qty 500"',
            '2026-05-29 06:15:11 [ODOO] Created CRM Lead #8493',
            '2026-05-29 06:15:12 [WHATSAPP] Sent catalog link to client +91-98765-XXXXX',
            '2026-05-29 06:15:12 [STATUS] Pipeline execution completed. Duration: 1.42s'
          ]
        }
      ]
    },
    {
      id: 'languages',
      folder: 'dev_languages',
      title: 'Dev Languages',
      tools: [
        {
          name: 'JavaScript / Node',
          desc: 'Primary runtime for serverless systems and custom API logic.',
          icon: icons.js,
          border: 'amber',
          cmd: 'node --version && npm run test',
          output: [
            'v20.11.0',
            '[VITEST] Running integration suites...',
            '  ✓ tests/integration/n8n-odoo.test.ts (242ms)',
            '  ✓ tests/integration/whatsapp-api.test.ts (118ms)',
            '  ✓ tests/unit/gst-parser.test.ts (45ms)',
            '[SUCCESS] 12 unit tests passed. Uptime verified.'
          ]
        },
        {
          name: 'Python',
          desc: 'Core standard for agent programming, LLM scripts, and math models.',
          icon: icons.python,
          border: 'amber',
          cmd: 'python3 -c "import sys; print(sys.version)"',
          output: [
            '3.11.2 (main, Apr  5 2024, 12:43:10) [GCC 11.2.0]',
            '[SYSTEM] Virtual environment: active (venv)',
            '[SYSTEM] Loaded packages: openai, langchain, pydantic, pandas, numpy',
            '[SUCCESS] Runtime fully optimized for agent execution.'
          ]
        },
        {
          name: 'Bash & Shell',
          desc: 'Defensive automation scripts, cron jobs, and backup pipelines.',
          icon: icons.bash,
          border: 'amber',
          cmd: 'bash backup-ledger.sh --force',
          output: [
            '[BACKUP] Initiating database backup routine...',
            '[INFO] Compressing PostgreSQL table structures (pg_dump)...',
            '[INFO] Size: 18.2 MB compressed (gzip).',
            '[S3] Uploading block to Cloudflare R2 bucket... ok',
            '[SUCCESS] Secure offsite backup verification completed successfully.'
          ]
        }
      ]
    }
  ];

  // Run the bash simulation typing effect
  const runSimulatedCommand = (tool: Tool) => {
    // Clear any active typing simulation to prevent race conditions & leaks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsTyping(true);
    setTerminalLines([]);

    // Line 1: Typing command
    const lines = [
      `rahul@primuez-vps:~/${STACK_CATEGORIES.find(c => c.id === activeCategory)?.folder || 'stack'}$ ${tool.cmd}`,
      ...tool.output
    ];

    let currentLineIndex = 0;
    
    const printNextLine = () => {
      if (currentLineIndex < lines.length) {
        setTerminalLines(prev => [...prev, lines[currentLineIndex]]);
        currentLineIndex++;
        
        // Speed up output logs, slow down first typed line
        const delay = currentLineIndex === 1 ? 400 : 150;
        timeoutRef.current = setTimeout(printNextLine, delay);
      } else {
        setIsTyping(false);
      }
    };

    printNextLine();
  };

  // Run command on tool click
  const selectToolHandler = (tool: Tool) => {
    if (isTyping) return;
    setSelectedTool(tool.name);
    runSimulatedCommand(tool);
  };

  // Run command on active folder tab change
  const selectCategoryHandler = (catId: string) => {
    if (isTyping) return;
    setActiveCategory(catId);
    const firstTool = STACK_CATEGORIES.find(c => c.id === catId)?.tools[0];
    if (firstTool) {
      setSelectedTool(firstTool.name);
      runSimulatedCommand(firstTool);
    }
  };

  // Initialize terminal console with n8n logs on mount
  useEffect(() => {
    const defaultTool = STACK_CATEGORIES[0].tools[0];
    runSimulatedCommand(defaultTool);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Scroll terminal logs automatically to the bottom locally (keeping window scroll undisturbed)
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLines]);

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
        I don&apos;t just read tutorials. Below is the exact operational console of my active system stack. Click the directories and tools to query their active status on my VPS.
      </p>

      {/* ── INTERACTIVE LIVE HARDWARE TERMINAL PLATE ── */}
      <div className="relative border border-white/[0.08] bg-[#07090e]/95 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden group">
        
        {/* Double Bezel Design Element */}
        <div className="absolute inset-[4px] rounded-[14px] border border-white/[0.03] pointer-events-none z-10" />

        {/* 4 Corner Screws / Rivets for Physical Tactility */}
        <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-cyan/60 group-hover:shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all duration-300 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>
        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-cyan/60 group-hover:shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all duration-300 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-cyan/60 group-hover:shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all duration-300 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-cyan/60 group-hover:shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all duration-300 pointer-events-none z-20 flex items-center justify-center">
          <div className="w-[3px] h-[3px] rounded-full bg-black/40"></div>
        </div>

        {/* TERMINAL TOP HEADER BAR */}
        <div className="border-b border-white/[0.08] px-5 py-3 md:py-4 flex items-center justify-between bg-[#0a0d15] relative select-none">
          <div className="flex items-center gap-2">
            {/* mock terminal dots */}
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          </div>
          
          <div className="font-mono text-[10px] md:text-xs text-text-muted/80 flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
            <span>rahul@primuez-vps: ~/{STACK_CATEGORIES.find(c => c.id === activeCategory)?.folder || 'stack'}</span>
          </div>

          <div className="hidden md:flex font-mono text-[9px] text-text-muted/50 items-center gap-3">
            <span>PING: <span className="text-emerald-400">12ms</span></span>
            <span>CPU: <span className="text-cyan">8%</span></span>
            <span>LOAD: <span className="text-amber">0.12</span></span>
          </div>
        </div>

        {/* SPLIT WINDOW LAYOUT */}
        <div className="flex flex-col lg:flex-row h-auto lg:h-[480px]">
          
          {/* LEFT SIDEBAR: DIRECTORY TREE */}
          <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#05070a]/60 p-4 font-mono text-xs">
            <div className="text-text-muted/40 uppercase tracking-widest text-[9px] mb-4 font-bold select-none">[ VPS DIRECTORIES ]</div>
            
            <div className="space-y-1">
              <div className="text-text-muted/60 pl-1 select-none flex items-center gap-2 mb-2">
                <span>📁</span>
                <span>/root/portfolio/stack</span>
              </div>
              
              {STACK_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => selectCategoryHandler(cat.id)}
                    className={`w-full text-left pl-4 py-2 rounded-md transition-all duration-300 flex items-center justify-between group/dir border ${
                      isActive 
                        ? 'bg-cyan/5 border-cyan/25 text-cyan hover:bg-cyan/10 font-bold shadow-[0_0_12px_rgba(0,240,255,0.06)]' 
                        : 'border-transparent text-text-muted hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`transition-transform duration-300 ${isActive ? 'rotate-90 text-cyan scale-110' : 'text-text-muted/40 group-hover/dir:text-white'}`}>
                        {isActive ? '▾' : '▸'}
                      </span>
                      <span className="truncate">📂 {cat.folder}/</span>
                    </div>
                    <span className="text-[9px] opacity-40 font-normal">0x{cat.tools.length}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.05] hidden lg:block select-none">
              <div className="text-text-muted/40 uppercase tracking-widest text-[9px] mb-2 font-bold">[ SYSTEM LOGS ]</div>
              <div className="text-[10px] text-text-muted/50 leading-relaxed font-mono">
                <div>IP: 147.93.XX.XX</div>
                <div>OS: Ubuntu 22.04 LTS</div>
                <div>PORT: 5678 (n8n SSL)</div>
                <div>SSL: Cloudflare Keyless</div>
              </div>
            </div>
          </div>

          {/* RIGHT PANELS (TOOLS LIST + SIMULATED CONSOLE) */}
          <div className="w-full lg:w-3/4 flex flex-col h-full bg-[#030406]/30">
            
            {/* TOP PANEL: TACTILE MICRO-PLATES CARD GRID */}
            <div className="p-4 md:p-6 flex-1 overflow-y-auto">
              <div className="text-text-muted/40 uppercase tracking-widest text-[9px] mb-4 font-bold select-none">[ SELECT A TOOL TO EXECUTE STATUS LOG ]</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STACK_CATEGORIES.find((c) => c.id === activeCategory)?.tools.map((tool) => {
                  const isSelected = selectedTool === tool.name;
                  
                  return (
                    <button
                      key={tool.name}
                      onClick={() => selectToolHandler(tool)}
                      disabled={isTyping}
                      className={`relative flex flex-col p-4 rounded-xl border bg-[#090c13] transition-all duration-300 text-left cursor-pointer select-none group/tool ${
                        isSelected 
                          ? 'border-cyan shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan/50 scale-[1.01]' 
                          : 'border-white/[0.05] hover:bg-white/[0.02]'
                      } ${isTyping ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {/* Inner Bezels */}
                      <div className={`absolute inset-[3px] rounded-lg border pointer-events-none transition-colors duration-300 z-10 ${
                        isSelected ? 'border-cyan/20' : 'border-white/[0.02] group-hover/tool:border-white/[0.06]'
                      }`} />

                      <div className="flex items-center gap-3 mb-2 z-10 relative">
                        <div className={`p-1.5 rounded-lg bg-panel transition-all duration-300 ${isSelected ? 'shadow-[0_0_10px_rgba(0,240,255,0.2)] scale-105' : ''}`}>
                          {tool.icon}
                        </div>
                        <h4 className="text-sm font-bold text-white leading-none font-sans">{tool.name}</h4>
                      </div>
                      
                      <p className="text-[11px] text-text-muted leading-relaxed font-sans z-10 relative flex-1">{tool.desc}</p>
                      
                      {/* Tiny interactive execution indicator */}
                      <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-text-muted/40 z-10 relative">
                        <span>[ click to query ]</span>
                        {isSelected && (
                          <span className="text-cyan animate-pulse flex items-center gap-1 font-bold">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan"></span>
                            ACTIVE_EXECUTION
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM PANEL: LIVE BASH CONSOLE */}
            <div 
              ref={terminalContainerRef}
              className="border-t border-white/[0.08] bg-black/90 p-4 font-mono text-[10px] md:text-xs h-[180px] lg:h-[200px] overflow-y-auto relative flex flex-col justify-between"
            >
              
              {/* Overlay terminal background grid */}
              <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none z-0" />
              
              <div className="space-y-1 z-10 relative">
                {terminalLines.map((line, idx) => {
                  const isCmdLine = line.includes('$ ');
                  return (
                    <div 
                      key={idx} 
                      className={`${
                        isCmdLine 
                          ? 'text-cyan font-bold' 
                          : line.startsWith('[SUCCESS]') 
                            ? 'text-emerald-400 font-semibold'
                            : line.startsWith('[AGENT]')
                              ? 'text-indigo-400 font-medium'
                              : line.startsWith('[THOUGHT]')
                                ? 'text-text-muted/60 pl-2 italic'
                                : line.startsWith('[ERROR]')
                                  ? 'text-red-400 font-bold'
                                  : 'text-text-muted'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="text-cyan font-bold inline-flex items-center gap-1">
                    <span>█</span>
                    <span className="text-[9px] text-text-muted/40 animate-pulse">[Executing VPS Task...]</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-white/[0.05] text-[9px] text-text-muted/30 flex items-center justify-between z-10 relative select-none">
                <span>Console connection: ESTABLISHED</span>
                <span>Type: Secure Tunnel SSHv2</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.section>
  );
}
