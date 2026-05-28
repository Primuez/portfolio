'use client';

import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '@/components/SectionHeader';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 font-mono">
        <StackGroup title="AI & Orchestration" items={['n8n', 'OpenRouter', 'DeepSeek', 'Mistral', 'LLaMA3', 'Ollama', 'RAG Systems', 'AI Agents']} border="cyan" />
        <StackGroup title="Infra & Deploy" items={['Cloudflare Workers', 'Hostinger VPS', 'Vercel', 'Docker', 'Self-Hosted']} border="amber" />
        <StackGroup title="ERP & Business" items={['Odoo ERP', 'Odoo CRM', 'GST Portal', 'IndiaMART Webhooks', 'Kickbox (Email Vfy)']} border="cyan" />
        <StackGroup title="Dev Languages" items={['JavaScript / Node.js', 'Python', 'Bash / Shell', 'YAML', 'HTTP Proxies']} border="amber" />
      </div>
    </motion.section>
  );
}
