'use client';

import React, { useState, useRef } from 'react';
import { motion, useTransform, AnimatePresence, MotionValue } from 'motion/react';
import { useScrollTarget } from '@/hooks/use-scroll-target';
import { CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useUI } from '@/lib/contexts/UIContext';

function CVAccordion({ title, children }: { title: string; children: React.ReactNode }) {
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
  );
}

function RubiksCredentials({ children }: { children: React.ReactNode }) {
  const { isMobile } = useUI();
  const { ref, scrollYProgress } = useScrollTarget<HTMLDivElement>({
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

export default function CredentialsSection() {
  const { setCertData, setModalType } = useUI();
  const openCert = (data: { title: string; issuer: string; date: string; id: string; pdfUrl?: string }) => {
    setCertData(data);
    setModalType('cert');
  };

  return (
    <motion.section 
      id="credentials" 
      aria-labelledby="creds-heading"
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="06" command="> ./credentials --verified" title="Credentials & Hackathons" />
      <h2 id="creds-heading" className="sr-only">What certifications and hackathon awards has Primuez earned in AI and automation?</h2>
      
      <RubiksCredentials>
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-amber uppercase font-mono tracking-widest text-sm mb-2 pl-2 border-l-2 border-amber">[ CERTIFICATIONS ]</h3>
            
            <CVAccordion title="Oracle AI Certifications (Triple Certified)">
              <p className="text-sm text-text-muted mb-3">Official Oracle credentials spanning Autonomous Agentic AI, Fusion AI Agent Studio, and OCI AI Foundations.</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">Agentic AI Certified Foundations Associate</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">Oracle · Aug 12, 2026 · ID: 330545114AAI26OFA</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'Agentic AI Certified Foundations Associate', issuer: 'Oracle', date: 'August 12, 2026', id: '330545114AAI26OFA', pdfUrl: '/documents/cert-oracle-agentic-ai.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">Oracle Fusion AI Agent Studio Certified Associate</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">Oracle · Aug 12, 2026 · ID: 330545114OFAASOFA</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'Oracle Fusion AI Agent Studio Certified Foundations Associate - Rel 1', issuer: 'Oracle', date: 'August 12, 2026', id: '330545114OFAASOFA', pdfUrl: '/documents/cert-oracle-fusion-ai.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">Oracle Cloud Infrastructure (OCI) AI Associate</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">Oracle · Aug 12, 2026 · ID: 330545114OCI26AICFA</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'Oracle Cloud Infrastructure Certified AI Foundations Associate', issuer: 'Oracle', date: 'August 12, 2026', id: '330545114OCI26AICFA', pdfUrl: '/documents/cert-oracle-oci-ai.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
              </div>
            </CVAccordion>

            <CVAccordion title="Cybersecurity & Defense (IBM & Cohesity)">
              <p className="text-sm text-text-muted mb-3">Enterprise cyber resilience, offensive &amp; defensive threat analysis, and cryptographic security architectures.</p>
              <div className="flex flex-col gap-2.5">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white leading-tight">Cybersecurity Fundamentals Specialization</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber/20 text-amber border border-amber/30">Credly Verified</span>
                      </div>
                      <span className="text-[10px] text-cyan font-mono mt-0.5">IBM SkillsBuild · Sep 15, 2026 · Credly Badge</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a 
                        href="https://www.credly.com/badges/1bd709be-42f9-4d0c-9b19-67db4e84b94d" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase bg-amber/10 text-amber border border-amber/30 px-3 py-1.5 hover:bg-amber hover:text-bg transition-colors flex items-center gap-1"
                      >
                        Credly <ExternalLink size={10} />
                      </a>
                      <button 
                        onClick={() => openCert({title: 'Cybersecurity Fundamentals Credential', issuer: 'IBM SkillsBuild', date: 'September 15, 2026', id: 'PLAN-4FB8400F05FC', pdfUrl: '/documents/cert-ibm-cybersecurity-fundamentals.pdf'})}
                        className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors"
                      >PDF</button>
                    </div>
                  </div>
                  
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button
                      onClick={() => openCert({title: 'Introduction to Cybersecurity', issuer: 'IBM SkillsBuild', date: 'September 15, 2026', id: 'ALM-COURSE_4058978', pdfUrl: '/documents/cert-ibm-cyber-intro.pdf'})}
                      className="text-left font-mono text-[10px] text-text-muted hover:text-cyan transition-colors truncate p-1 rounded bg-white/[0.01] hover:bg-cyan/5"
                    >
                      • 1. Intro to Security
                    </button>
                    <button
                      onClick={() => openCert({title: 'Your Future in Cybersecurity: Job Landscape', issuer: 'IBM SkillsBuild', date: 'September 15, 2026', id: 'ALM-COURSE_4058981', pdfUrl: '/documents/cert-ibm-cyber-job-landscape.pdf'})}
                      className="text-left font-mono text-[10px] text-text-muted hover:text-cyan transition-colors truncate p-1 rounded bg-white/[0.01] hover:bg-cyan/5"
                    >
                      • 2. Job Landscape
                    </button>
                    <button
                      onClick={() => openCert({title: 'Cybersecurity: On the Offense', issuer: 'IBM SkillsBuild', date: 'September 15, 2026', id: 'ALM-COURSE_4058979', pdfUrl: '/documents/cert-ibm-cyber-offense.pdf'})}
                      className="text-left font-mono text-[10px] text-text-muted hover:text-cyan transition-colors truncate p-1 rounded bg-white/[0.01] hover:bg-cyan/5"
                    >
                      • 3. On the Offense
                    </button>
                    <button
                      onClick={() => openCert({title: 'Cybersecurity: On the Defense', issuer: 'IBM SkillsBuild', date: 'September 15, 2026', id: 'ALM-COURSE_4058980', pdfUrl: '/documents/cert-ibm-cyber-defense.pdf'})}
                      className="text-left font-mono text-[10px] text-text-muted hover:text-cyan transition-colors truncate p-1 rounded bg-white/[0.01] hover:bg-cyan/5"
                    >
                      • 4. On the Defense
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">Cohesity Cyber Resilience Foundations</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">IBM SkillsBuild &amp; Cohesity · Sep 11, 2026 · ID: ISG-DL08027G</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'Cohesity Cyber Resilience Foundations', issuer: 'IBM SkillsBuild & Cohesity', date: 'September 11, 2026', id: 'ISG-DL08027G', pdfUrl: '/documents/cert-cohesity-cyber-resilience.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
              </div>
            </CVAccordion>

            <CVAccordion title="Automation & Autonomous Agents (n8n & Google)">
              <p className="text-sm text-text-muted mb-3">Production workflow automation, multi-agent frameworks, and serverless enterprise orchestration.</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">n8n Course Level 1 &amp; 2 (Master Automation)</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">n8n Official · Verified · ID: N8N-L1-L2</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'n8n Course Level 1 & 2', issuer: 'n8n', date: 'Verified', id: 'N8N-L1-L2', pdfUrl: '/documents/cert-n8n-1.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">5-Day AI Agents Intensive Course</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">Kaggle &amp; Google · Dec 18, 2025 · ID: KAG-GOOG</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: '5-Day AI Agents Intensive Course with Google', issuer: 'Kaggle & Google', date: 'December 18, 2025', id: 'KAG-GOOG', pdfUrl: '/documents/cert-kaggle-google.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">No Code AI Agent Builder</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">SimpliLearn SkillUP · Aug 2, 2025 · ID: 8723146</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'n8n Course: No Code AI Agent Builder', issuer: 'SimpliLearn SkillUP', date: '2nd August 2025', id: '8723146', pdfUrl: '/documents/cert-n8n-2.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
              </div>
            </CVAccordion>

            <CVAccordion title="Applied AI & Systems (IBM & Outskill)">
              <p className="text-sm text-text-muted mb-3">Advanced prompt engineering architectures, Python data pipelines, and generative AI execution.</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">Mastering the Art of Prompting</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">IBM SkillsBuild · Sep 11, 2026 · ID: ALM-COURSE_4058858</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'Mastering the Art of Prompting', issuer: 'IBM SkillsBuild', date: 'September 11, 2026', id: 'ALM-COURSE_4058858', pdfUrl: '/documents/cert-ibm-skillsbuild-prompting.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">Data Analysis with Python</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">IBM SkillsBuild · Sep 11, 2026 · ID: ALM-COURSE_4079777</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'Data Analysis with Python', issuer: 'IBM SkillsBuild', date: 'September 11, 2026', id: 'ALM-COURSE_4079777', pdfUrl: '/documents/cert-ibm-skillsbuild-data-analysis.pdf'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-white leading-tight">Generative AI Mastermind</span>
                    <span className="text-[10px] text-cyan font-mono mt-0.5">Outskill by Vaibhav Sisinty · Verified · ID: OUT-GENAI-M</span>
                  </div>
                  <button 
                    onClick={() => openCert({title: 'Generative AI Mastermind', issuer: 'Outskill by Vaibhav Sisinty', date: 'Verified', id: 'OUT-GENAI-M'})}
                    className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0"
                  >View</button>
                </div>
              </div>
            </CVAccordion>

            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2">
              <a 
                href="https://www.credly.com/users/rahul-kasturiya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-4 py-3 hover:bg-cyan hover:text-bg transition-colors flex items-center justify-center gap-2"
              >
                <span>🎖️ Verify Badges on Credly</span>
                <ExternalLink size={12} />
              </a>
              <button 
                onClick={() => openCert({title: 'Complete Master Certification Portfolio', issuer: 'Oracle, Google, IBM, n8n', date: 'August - September 2026', id: 'MASTER-PORTFOLIO', pdfUrl: '/documents/Certified.pdf'})}
                className="flex-1 font-mono text-xs uppercase bg-amber/10 text-amber border border-amber/30 px-4 py-3 hover:bg-amber hover:text-bg transition-colors flex items-center justify-center gap-2"
              >
                <span>📜 Master Portfolio (PDF)</span>
              </button>
            </div>
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
  );
}
