'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'motion/react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
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
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useUI();
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
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none flex z-20 overflow-hidden rounded-md">
          {cols.map((c, i) => (
            <RubiksColumn key={i} progress={scrollYProgress} {...c} />
          ))}
        </div>
      )}
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
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
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
  );
}
