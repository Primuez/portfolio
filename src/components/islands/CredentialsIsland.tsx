import { useState } from 'react';

interface CertItem {
  title: string;
  issuer: string;
  date: string;
  id: string;
  pdfUrl?: string;
  credlyUrl?: string;
}

export default function CredentialsIsland() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    oracle: true,
    cyber: true,
    n8n: false,
    hackathons: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openCert = (data: CertItem) => {
    window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'cert', data } }));
  };

  return (
    <div className="space-y-4">
      {/* 1. Oracle AI Certifications */}
      <div className="bg-panel/90 border border-cyan/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('oracle')}
          className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-cyan font-bold">🛡️</span>
            <strong className="text-white text-sm md:text-base font-sans tracking-wide">
              Oracle AI Certifications (Triple Certified)
            </strong>
          </div>
          <span className="font-mono text-cyan text-xs">{openSections.oracle ? '▲' : '▼'}</span>
        </button>

        {openSections.oracle && (
          <div className="px-4 md:px-6 pb-5 pt-1 space-y-3 border-t border-white/[0.04]">
            <p className="text-xs text-text-muted mb-2 font-sans">
              Official Oracle credentials spanning Autonomous Agentic AI, Fusion AI Agent Studio, and OCI AI Foundations.
            </p>
            {[
              {
                title: 'Agentic AI Certified Foundations Associate',
                issuer: 'Oracle',
                date: 'August 12, 2026',
                id: '330545114AAI26OFA',
                pdfUrl: '/documents/cert-oracle-agentic-ai.pdf',
              },
              {
                title: 'Oracle Fusion AI Agent Studio Certified Foundations Associate - Rel 1',
                issuer: 'Oracle',
                date: 'August 12, 2026',
                id: '330545114OFAASOFA',
                pdfUrl: '/documents/cert-oracle-fusion-ai.pdf',
              },
              {
                title: 'Oracle Cloud Infrastructure Certified AI Foundations Associate',
                issuer: 'Oracle',
                date: 'August 12, 2026',
                id: '330545114OCI26AICFA',
                pdfUrl: '/documents/cert-oracle-oci-ai.pdf',
              },
            ].map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-xs font-bold text-white leading-tight font-sans">{c.title}</span>
                  <span className="text-[10px] text-cyan font-mono mt-0.5">
                    {c.issuer} · {c.date} · ID: {c.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openCert(c)}
                  className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors shrink-0 rounded cursor-pointer font-bold"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Linux Foundation & IBM */}
      <div className="bg-panel/90 border border-cyan/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('cyber')}
          className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-amber font-bold">🔒</span>
            <strong className="text-white text-sm md:text-base font-sans tracking-wide">
              Cybersecurity & Secure Software (Linux Foundation & IBM)
            </strong>
          </div>
          <span className="font-mono text-cyan text-xs">{openSections.cyber ? '▲' : '▼'}</span>
        </button>

        {openSections.cyber && (
          <div className="px-4 md:px-6 pb-5 pt-1 space-y-3 border-t border-white/[0.04]">
            <p className="text-xs text-text-muted mb-2 font-sans">
              Enterprise cyber resilience, offensive & defensive threat analysis, and cryptographic security architectures.
            </p>
            {/* Linux Foundation */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white leading-tight font-sans">Developing Secure Software (LFD121)</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber/20 text-amber border border-amber/30">Credly</span>
                </div>
                <span className="text-[10px] text-cyan font-mono mt-0.5 block">The Linux Foundation (OpenSSF) · ID: LF-rho2gumy1d</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.credly.com/badges/64211ae0-da26-4aaf-9d72-4dd87658a17f/public_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase bg-amber/10 text-amber border border-amber/30 px-3 py-1.5 hover:bg-amber hover:text-bg transition-colors rounded"
                >
                  Credly ↗
                </a>
                <button
                  type="button"
                  onClick={() => openCert({
                    title: 'Developing Secure Software (LFD121)',
                    issuer: 'The Linux Foundation (OpenSSF)',
                    date: 'October 10, 2026',
                    id: 'LF-rho2gumy1d',
                    pdfUrl: '/documents/cert-linux-foundation-lfd121.pdf',
                  })}
                  className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors rounded cursor-pointer font-bold"
                >
                  View
                </button>
              </div>
            </div>

            {/* IBM Cybersecurity */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white leading-tight font-sans">Cybersecurity Fundamentals Specialization</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber/20 text-amber border border-amber/30">Credly</span>
                </div>
                <span className="text-[10px] text-cyan font-mono mt-0.5 block">IBM SkillsBuild · Credly Badge · ID: PLAN-4FB8400F05FC</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.credly.com/badges/1bd709be-42f9-4d0c-9b19-67db4e84b94d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase bg-amber/10 text-amber border border-amber/30 px-3 py-1.5 hover:bg-amber hover:text-bg transition-colors rounded"
                >
                  Credly ↗
                </a>
                <button
                  type="button"
                  onClick={() => openCert({
                    title: 'Cybersecurity Fundamentals Credential',
                    issuer: 'IBM SkillsBuild',
                    date: 'September 15, 2026',
                    id: 'PLAN-4FB8400F05FC',
                    pdfUrl: '/documents/cert-ibm-cybersecurity-fundamentals.pdf',
                  })}
                  className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors rounded cursor-pointer font-bold"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. n8n Automation Specialist */}
      <div className="bg-panel/90 border border-cyan/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('n8n')}
          className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-cyan font-bold">⚙️</span>
            <strong className="text-white text-sm md:text-base font-sans tracking-wide">
              n8n Official Certification & Automation Badges
            </strong>
          </div>
          <span className="font-mono text-cyan text-xs">{openSections.n8n ? '▲' : '▼'}</span>
        </button>

        {openSections.n8n && (
          <div className="px-4 md:px-6 pb-5 pt-1 space-y-3 border-t border-white/[0.04]">
            <p className="text-xs text-text-muted mb-2 font-sans">
              Verified n8n workflow engineering credentials covering intermediate and advanced orchestration.
            </p>
            {[
              { title: 'n8n Workflow Automation - Level 1', issuer: 'n8n Academy', date: '2025', id: 'N8N-L1-VERIFIED', pdfUrl: '/documents/cert-n8n-1.pdf' },
              { title: 'n8n Workflow Automation - Level 2', issuer: 'n8n Academy', date: '2025', id: 'N8N-L2-VERIFIED', pdfUrl: '/documents/cert-n8n-2.pdf' },
            ].map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-cyan/20">
                <span className="text-xs font-bold text-white font-sans">{c.title}</span>
                <button
                  type="button"
                  onClick={() => openCert(c)}
                  className="font-mono text-[10px] uppercase bg-cyan/10 text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan hover:text-bg transition-colors rounded cursor-pointer font-bold"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
