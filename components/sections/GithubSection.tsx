'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform, MotionValue } from 'motion/react';
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

  // Alternate 3D tilt directions for a gorgeous layout cascade
  const tiltAngle = index % 3 === 0 ? -12 : index % 3 === 2 ? 12 : 0;

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      style={isMobile ? {} : { skewY, skewX, scaleY, scaleX, filter, rotateZ, transformOrigin: 'center center' }}
      initial={{ opacity: 0, y: 50, scale: 0.92, rotateX: -15, rotateY: tiltAngle }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: isMobile ? '-15px' : '-40px' }}
      transition={{ duration: 0.85, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
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
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
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
    <motion.section 
      id="github" 
      className="pt-16 md:pt-32 pb-28 md:pb-20 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: isMobile ? "-30px" : "-100px" }}
    >
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
  );
}
