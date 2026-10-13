'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform, MotionValue } from 'motion/react';
import { Github, Star, GitFork } from 'lucide-react';
import { ShaderBackgroundSection } from '@/components/ShaderBackground';
import { SectionHeader } from '@/components/SectionHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface GithubRepo {
  id: number;
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

const FALLBACK_REPOS: LiquidRepo[] = [
  {
    id: 1218800483,
    name: 'portfolio',
    description: 'High-performance developer portfolio, credential verification engine & presentation platform.',
    html_url: 'https://github.com/Primuez/portfolio',
    stargazers_count: 1,
    forks_count: 0,
    language: 'Astro',
  },
  {
    id: 1212318246,
    name: 'Ink-Twin',
    description: 'Instant handwriting synthesis, OCR vectorization & document intelligence engine on Cloudflare Workers.',
    html_url: 'https://github.com/Primmius/Ink-Twin',
    stargazers_count: 0,
    forks_count: 0,
    language: 'TypeScript',
  },
  {
    id: 1256932570,
    name: 'primuez-seo-vault',
    description: 'Headless programmatic SEO growth engine running autonomous keyword polling and CDN generation.',
    html_url: 'https://github.com/Primuez/primuez-seo-vault',
    stargazers_count: 0,
    forks_count: 0,
    language: 'TypeScript',
  },
  {
    id: 1366078942,
    name: 'career-ops',
    description: 'Multi-agent career intelligence pipeline, ATS resume parser and continuous opportunity triage.',
    html_url: 'https://github.com/Primuez/career-ops',
    stargazers_count: 0,
    forks_count: 0,
    language: 'Python',
  },
  {
    id: 1366078943,
    name: 'CLI-Skills-and-MDs',
    description: 'Curated skills, operational playbooks, and architectural system prompts for autonomous agent fleets.',
    html_url: 'https://github.com/Primuez/CLI-Skills-and-MDs',
    stargazers_count: 0,
    forks_count: 0,
    language: 'Markdown',
  },
  {
    id: 1366078944,
    name: 'agents-backup',
    description: 'Production container configuration, reverse proxy SSL configs, and automated n8n backup pipelines.',
    html_url: 'https://github.com/Primuez/agents-backup',
    stargazers_count: 0,
    forks_count: 0,
    language: 'Shell',
  },
];

function LiquidRepoGrid({ repos }: { repos: LiquidRepo[] }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothV = useSpring(velocity, { stiffness: 70, damping: 32, mass: 1 });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:[perspective:1200px]">
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

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      style={isMobile ? { willChange: 'transform, opacity' } : { skewY, skewX, scaleY, scaleX, filter, rotateZ, transformOrigin: 'center center' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min(index * 0.05, 0.2),
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-panel/60 backdrop-blur-md border border-cyan/10 p-6 rounded-xl hover:border-cyan/50 hover:bg-cyan/5 transition-colors group block shadow-lg flex flex-col justify-between min-h-[160px] will-change-transform liquid-glass-card relative overflow-hidden"
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
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-text-muted">
          <span className="w-2 h-2 rounded-full border border-cyan/50 bg-cyan/20"></span> {repo.language}
        </div>
      )}
    </motion.a>
  );
}

export default function GithubSection() {
  const [repos, setRepos] = useState<LiquidRepo[]>(FALLBACK_REPOS);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

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
          .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
          .slice(0, 6);
        if (combined.length > 0) {
          setRepos(combined);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRepos(false);
      }
    }
    loadRepos();
  }, []);

  return (
    <section 
      id="github" 
      aria-labelledby="github-heading"
      className="pt-16 md:pt-32 pb-28 md:pb-20 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.05 }}
        style={{ willChange: 'transform, opacity' }}
      >
        <ShaderBackgroundSection opacity={0.6} />
        <div className="relative z-10">
        <SectionHeader number="03" command="> curl -s https://api.github.com" title="GitHub Activity" />
        <h2 id="github-heading" className="sr-only">What open-source projects has Primuez published on GitHub?</h2>
        <p className="sr-only">Rahul Kasturiya (Primuez) publishes automation workflows, AI agent experiments, and SaaS boilerplates across two GitHub profiles: @primuez and @primmius.</p>
        
        <p className="text-text-muted mt-4 mb-6 max-w-2xl text-base leading-relaxed font-sans">
          Open-source repositories, developer tools, and automation scripts published across @primuez and @primmius.
        </p>

        <div className="mt-6">
          <button
            onClick={() => setIsOpen(o => !o)}
            className="w-full flex items-center justify-between py-3.5 px-5 min-h-[48px] font-mono text-xs uppercase tracking-[0.15em] text-cyan border border-cyan/20 rounded-lg bg-panel/40 hover:bg-cyan/5 transition-colors cursor-pointer text-left z-20 relative"
          >
            <span>{isOpen ? '▼ Hide GitHub Activity' : '▶ Show details (6 active repositories)'}</span>
            <span>{isOpen ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden mt-6"
              >
                <AnimatePresence mode="wait">
                  {loadingRepos ? (
                    <motion.div
                      key="fetching"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="flex flex-col items-center justify-center h-32 gap-4"
                    >
                      <div className="font-mono text-cyan text-sm tracking-widest animate-pulse">[ FETCHING REPOSITORIES ]</div>
                      <div className="w-1/2 max-w-sm h-1 bg-cyan/20 overflow-hidden">
                        <div className="h-full bg-cyan w-1/3 animate-[slide_1.5s_ease-in-out_infinite]"></div>
                      </div>
                    </motion.div>
                  ) : repos.length > 0 ? (
                    <motion.div
                      key="repos"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <LiquidRepoGrid repos={repos} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ratelimit"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="text-center font-mono text-text-muted p-12 border border-dashed border-cyan/20 rounded-xl bg-panel"
                    >
                      <span>[ Rate Limited by GitHub API. View profiles directly: ]</span>
                      <div className="flex justify-center gap-4 mt-4">
                        <a href="https://github.com/primuez" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">@primuez</a>
                        <a href="https://github.com/primmius" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">@primmius</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </motion.div>
    </section>
  );
}
