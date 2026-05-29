'use client';

import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
import { SectionHeader } from '@/components/SectionHeader';

interface StackGroupProps {
  title: string;
  items: string[];
  border: 'cyan' | 'amber';
}

function StackGroup({ title, items, border }: StackGroupProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const textColor = border === 'cyan' ? 'text-cyan/90' : 'text-amber/90';
  const shadowColor = border === 'cyan' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(245, 166, 35, 0.15)';
  const focusBorderColor = border === 'cyan' ? 'group-hover:border-cyan/40' : 'group-hover:border-amber/40';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative bg-panel/40 border border-white/[0.04] p-6 rounded-2xl transition-all duration-500 hover:bg-panel/60 overflow-hidden"
      style={{
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.7)`
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 40px -15px ${shadowColor}`,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      {/* Dynamic Cursor Spotlight Border */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              ${border === 'cyan' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(245, 166, 35, 0.15)'},
              transparent 80%
            )
          `
        }}
      />
      <motion.div
        className={`pointer-events-none absolute -inset-px rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${focusBorderColor}`}
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              180px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              180px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent
            )
          `
        }}
      />

      <div className={`text-[11px] font-mono uppercase tracking-[0.25em] mb-6 flex items-center justify-between ${textColor} font-bold z-20 relative`}>
        <span>[ {title} ]</span>
        <span className="opacity-40 text-[9px]">0x{items.length.toString(16).toUpperCase()}</span>
      </div>

      <motion.ul
        className="space-y-3.5 block z-20 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          hidden: {},
        }}
      >
        {items.map((item, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-xs text-text-muted/90 flex items-center gap-3 border-b border-white/[0.03] pb-2.5 last:border-0 last:pb-0 font-mono transition-colors duration-300 hover:text-white group/item"
          >
            <motion.span 
              className={`w-1.5 h-1.5 rounded-full ${border === 'cyan' ? 'bg-cyan/40 group-hover/item:bg-cyan' : 'bg-amber/40 group-hover/item:bg-amber'} transition-colors duration-300`}
              whileHover={{ scale: 1.3 }}
            />
            <span className="flex-1 truncate">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

export default function StackSection() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <StackGroup title="AI & Orchestration" items={['n8n', 'OpenRouter', 'DeepSeek', 'Mistral', 'LLaMA3', 'Ollama', 'RAG Systems', 'AI Agents']} border="cyan" />
        <StackGroup title="Infra & Deploy" items={['Cloudflare Workers', 'Hostinger VPS', 'Vercel', 'Docker', 'Self-Hosted']} border="amber" />
        <StackGroup title="ERP & Business" items={['Odoo ERP', 'Odoo CRM', 'GST Portal', 'IndiaMART Webhooks', 'Kickbox (Email Vfy)']} border="cyan" />
        <StackGroup title="Dev Languages" items={['JavaScript / Node.js', 'Python', 'Bash / Shell', 'YAML', 'HTTP Proxies']} border="amber" />
      </div>
    </motion.section>
  );
}
