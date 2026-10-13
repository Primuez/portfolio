'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform, MotionValue } from 'motion/react';
import { Github, Star, GitFork, ExternalLink } from 'lucide-react';
import { ShaderBackgroundSection } from '@/components/ShaderBackground';
import { SectionHeader } from '@/components/SectionHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface GithubRepo {
  id: number | string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
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

const DEFAULT_REPOS: GithubRepo[] = [
  {
    id: 'ink-twin',
    name: 'Ink-Twin',
    description: 'BYOK 4-phase AI handwriting synthesis and homework automation platform with OCR & vector font generation.',
    html_url: 'https://github.com/Primmius/Ink-Twin',
    stargazers_count: 14,
    forks_count: 3,
    language: 'TypeScript',
  },
  {
    id: 'portfolio',
    name: 'portfolio',
    description: 'High-performance developer portfolio, credential verification engine & dual-mode presentation platform.',
    html_url: 'https://github.com/Primuez/portfolio',
    stargazers_count: 8,
    forks_count: 2,
    language: 'TypeScript',
  },
  {
    id: 'traiecta-contracts',
    name: 'traiecta-contracts',
    description: 'Cross-chain router contracts for Stellar and EVM networks, with CCTP, Axelar, and Allbridge integrations.',
    html_url: 'https://github.com/Primuez/traiecta-contracts',
    stargazers_count: 5,
    forks_count: 1,
    language: 'Rust',
  },
  {
    id: 'local-ai-registry',
    name: 'local-ai-registry',
    description: 'Local AI registry: one validated recipe per machine, with verified execution evidence attached.',
    html_url: 'https://github.com/Primuez/local-ai-registry',
    stargazers_count: 6,
    forks_count: 1,
    language: 'Shell',
  },
  {
    id: 'traiecta-api',
    name: 'traiecta-api',
    description: 'Backend infrastructure for indexing, monitoring, and managing Traiecta cross-chain transfers.',
    html_url: 'https://github.com/Primuez/traiecta-api',
    stargazers_count: 4,
    forks_count: 1,
    language: 'Go',
  },
  {
    id: 'primuez-seo-vault',
    name: 'primuez-seo-vault',
    description: 'A self-sustaining headless growth engine running on Linux VPS, polling keywords and deploying to GitHub CDN.',
    html_url: 'https://github.com/Primuez/primuez-seo-vault',
    stargazers_count: 7,
    forks_count: 2,
    language: 'Python',
  },
];

function LiquidRepoGrid({ repos }: { repos: LiquidRepo[] }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothV = useSpring(velocity, { stiffness: 70, damping: 32, mass: 1 });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
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

  const rotations = [
    { rotateX: 90, rotateY: 0, rotateZ: -10, x: -80, y: 0, scale: 0.8 },
    { rotateX: 0, rotateY: -90, rotateZ: 10, x: 0, y: -80, scale: 0.8 },
    { rotateX: -90, rotateY: 0, rotateZ: -10, x: 80, y: 0, scale: 0.8 },
    { rotateX: 0, rotateY: 90, rotateZ: 10, x: -80, y: 80, scale: 0.8 },
    { rotateX: 90, rotateY: 90, rotateZ: 0, x: 0, y: 80, scale: 0.8 },
    { rotateX: -90, rotateY: -90, rotateZ: 15, x: 80, y: 80, scale: 0.8 }
  ];
  
  const cardRotation = rotations[index % rotations.length];

  const initialAnim = isMobile
    ? { 
        opacity: 0, 
        y: 18,
      }
    : { 
        opacity: 0, 
        rotateX: cardRotation.rotateX, 
        rotateY: cardRotation.rotateY, 
        rotateZ: cardRotation.rotateZ, 
        x: cardRotation.x, 
        y: cardRotation.y, 
        scale: cardRotation.scale,
        filter: 'blur(8px)'
      };

  const whileInViewAnim = isMobile
    ? { 
        opacity: 1, 
        y: 0,
      }
    : { 
        opacity: 1, 
        rotateX: 0, 
        rotateY: 0, 
        rotateZ: 0,
        x: 0, 
        y: 0, 
        scale: 1,
        filter: 'blur(0px)'
      };

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      style={isMobile ? {} : { skewY, skewX, scaleY, scaleX, filter, rotateZ, transformOrigin: 'center center' }}
      initial={false}
      whileInView={whileInViewAnim}
      viewport={{ once: true, margin: isMobile ? '80px' : '-40px' }}
      transition={isMobile ? {
        duration: 0.2,
        delay: 0,
        ease: 'easeOut',
      } : { 
        type: 'spring',
        stiffness: 45,
        damping: 12,
        mass: 1,
        delay: index * 0.15
      }}
      whileHover={isMobile ? undefined : { scale: 1.02, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      className={`border border-cyan/15 p-6 rounded-xl hover:border-cyan/50 hover:bg-cyan/5 transition-colors group block shadow-lg flex flex-col justify-between min-h-[160px] will-change-transform liquid-glass-card relative overflow-hidden ${
        isMobile ? 'bg-panel/90' : 'bg-panel/60 backdrop-blur-md'
      }`}
    >
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
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-text-muted">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border border-cyan/50 bg-cyan/20"></span> {repo.language}
          </span>
          <ExternalLink size={12} className="opacity-0 group-hover:opacity-70 transition-opacity" />
        </div>
      )}
    </motion.a>
  );
}

export default function GithubSection() {
  const [repos, setRepos] = useState<GithubRepo[]>(DEFAULT_REPOS);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    let active = true;
    async function loadRepos() {
      try {
        const [res1, res2] = await Promise.all([
          fetch('https://api.github.com/users/primuez/repos?sort=updated&per_page=6').catch(() => null),
          fetch('https://api.github.com/users/primmius/repos?sort=updated&per_page=6').catch(() => null)
        ]);
        const data1 = res1 && res1.ok ? await res1.json() : [];
        const data2 = res2 && res2.ok ? await res2.json() : [];
        
        const combined = [...(Array.isArray(data1) ? data1 : []), ...(Array.isArray(data2) ? data2 : [])]
          .filter(r => !r.fork && !r.name.toLowerCase().includes('first-to-paste-osi-henti'))
          .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
          .slice(0, 6);
          
        if (active && combined.length > 0) {
          setRepos(combined);
        }
      } catch (e) {
        console.warn('GitHub API live fetch fallback triggered:', e);
      }
    }
    loadRepos();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section 
      id="github" 
      aria-labelledby="github-heading"
      className="pt-16 md:pt-32 pb-28 md:pb-20 relative overflow-hidden"
    >
      {!isMobile && <ShaderBackgroundSection opacity={0.6} />}
      <div className="relative z-10">
        <SectionHeader number="03" command="> curl -s https://api.github.com" title="GitHub Activity" />
        <h2 id="github-heading" className="sr-only">What open-source projects has Primuez published on GitHub?</h2>
        <p className="sr-only">Rahul Kasturiya (Primuez) publishes automation workflows, AI agent experiments, and SaaS boilerplates across two GitHub profiles: @primuez and @primmius.</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
          <p className="text-text-muted max-w-2xl text-base leading-relaxed font-sans">
            Open-source repositories, developer tools, and automation scripts published across @primuez and @primmius.
          </p>
          <div className="flex items-center gap-3 font-mono text-xs text-text-muted shrink-0">
            <a href="https://github.com/primuez" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline hover:text-white transition-colors">@primuez</a>
            <span>&middot;</span>
            <a href="https://github.com/primmius" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline hover:text-white transition-colors">@primmius</a>
          </div>
        </div>

        <div className="mt-8">
          <LiquidRepoGrid repos={repos} />
        </div>
      </div>
    </section>
  );
}
