'use client';

import React from 'react';
import { motion } from 'motion/react';
import { YouTubeThumb } from '@/components/YouTubeThumb';
import { SectionHeader } from '@/components/SectionHeader';

export default function VideosSection() {
  return (
    <motion.section 
      id="videos" 
      className="pt-16 md:pt-32"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SectionHeader number="04" command="> ./content --media" title="Video Presentations" />
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-panel group">
            <YouTubeThumb 
              videoId="RzB_7PqR8G0" 
              url="https://youtu.be/RzB_7PqR8G0"
              label="Watch n8n Demo"
            />
          </div>
          <h3 className="font-bold text-base mt-4 mb-2 text-white">n8n Odoo Manufacturing Automation</h3>
          <p className="text-sm text-text-muted leading-relaxed">Full demonstration of mapping IndiaMART webhooks to Odoo ERP via custom n8n pipelines, complete with automatic GST checks and WhatsApp invoice routing.</p>
        </div>
        
        <div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-panel group">
            <YouTubeThumb 
              videoId="hOaV_C8h1Zg" 
              url="https://youtu.be/hOaV_C8h1Zg"
              label="Watch Voice Agent Demo"
            />
          </div>
          <h3 className="font-bold text-base mt-4 mb-2 text-white">InkTwin: Custom AI Voice Agents</h3>
          <p className="text-sm text-text-muted leading-relaxed">A walkthrough of building human-sounding, low-latency voice agents that can book calls, query inventory, and trigger background automations while speaking.</p>
        </div>
      </div>
    </motion.section>
  );
}
