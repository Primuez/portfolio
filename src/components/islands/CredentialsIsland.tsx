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
  // STRICT RULE: All collapsibles MUST default to compact (false) on initial load at all viewports
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    oracle: false,
    cyber: false,
    n8n: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openCert = (data: CertItem) => {
    window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'cert', data } }));
  };

  return (
    <div className="space-y-6 credentials-deck">
      {/* 1. Oracle AI Certifications (Triple Certified) */}
      <div className="credentials-card p-1.5 rounded-[2rem] bg-gradient-to-b from-amber/20 via-white/[0.03] to-transparent border border-amber/30 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-amber/60">
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#070b12]/95 overflow-hidden">
          <button
            type="button"
            onClick={() => toggle('oracle')}
            className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-amber/5 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 flex items-center justify-center text-xl text-amber">
                🛡️
              </div>
              <div>
                <span className="font-mono text-amber text-[10px] tracking-widest uppercase block mb-1 font-bold">
                  ORACLE CLOUD INFRASTRUCTURE // TRIPLE CERTIFIED
                </span>
                <strong className="text-white text-base sm:text-lg font-sans tracking-wide block">
                  Oracle AI Professional Certifications (2025/2026)
                </strong>
              </div>
            </div>
            
            <div className="px-3.5 py-1.5 rounded-full border border-amber/30 bg-amber/10 text-amber font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-2">
              <span>{openSections.oracle ? 'Collapse' : 'Inspect Credentials'}</span>
              <span>{openSections.oracle ? '▲' : '▼'}</span>
            </div>
          </button>

          {openSections.oracle && (
            <div className="px-6 sm:px-8 pb-7 pt-2 space-y-4 border-t border-white/[0.08] bg-black/40 animate-fadeIn">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Official credentials issued by Oracle University verifying mastery of Autonomous Agentic AI, Fusion AI Agent Studio, and OCI Foundation models.
              </p>
              {[
                {
                  title: 'Agentic AI Certified Foundations Associate',
                  issuer: 'Oracle University',
                  date: 'August 12, 2026',
                  id: '330545114AAI26OFA',
                  pdfUrl: '/documents/cert-oracle-agentic-ai.pdf',
                },
                {
                  title: 'Oracle Fusion AI Agent Studio Certified Foundations Associate - Rel 1',
                  issuer: 'Oracle University',
                  date: 'August 12, 2026',
                  id: '330545114OFAASOFA',
                  pdfUrl: '/documents/cert-oracle-fusion-ai.pdf',
                },
                {
                  title: 'Oracle Cloud Infrastructure Certified AI Foundations Associate',
                  issuer: 'Oracle University',
                  date: 'August 12, 2026',
                  id: '330545114OCI26AICFA',
                  pdfUrl: '/documents/cert-oracle-oci-ai.pdf',
                },
              ].map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-amber/20 hover:border-amber/40 transition-colors"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-sm font-bold text-white leading-tight font-sans">{c.title}</span>
                    <span className="text-[11px] text-amber/90 font-mono mt-1">
                      {c.issuer} · {c.date} · ID: {c.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCert(c)}
                    className="font-mono text-[10px] uppercase bg-amber/15 text-amber border border-amber/40 px-3.5 py-2 hover:bg-amber hover:text-black transition-colors shrink-0 rounded-lg cursor-pointer font-bold self-start sm:self-auto"
                  >
                    View Verified PDF ↗
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Linux Foundation & IBM Cybersecurity */}
      <div className="credentials-card p-1.5 rounded-[2rem] bg-gradient-to-b from-cyan/20 via-white/[0.03] to-transparent border border-cyan/30 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan/60">
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#070b12]/95 overflow-hidden">
          <button
            type="button"
            onClick={() => toggle('cyber')}
            className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-xl text-cyan">
                🔒
              </div>
              <div>
                <span className="font-mono text-cyan text-[10px] tracking-widest uppercase block mb-1 font-bold">
                  DEFENSIVE SECURITY &amp; SYSTEMS RESILIENCE
                </span>
                <strong className="text-white text-base sm:text-lg font-sans tracking-wide block">
                  Cybersecurity &amp; Secure Software (Linux Foundation &amp; IBM)
                </strong>
              </div>
            </div>
            
            <div className="px-3.5 py-1.5 rounded-full border border-cyan/30 bg-cyan/10 text-cyan font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-2">
              <span>{openSections.cyber ? 'Collapse' : 'Inspect Credentials'}</span>
              <span>{openSections.cyber ? '▲' : '▼'}</span>
            </div>
          </button>

          {openSections.cyber && (
            <div className="px-6 sm:px-8 pb-7 pt-2 space-y-4 border-t border-white/[0.08] bg-black/40 animate-fadeIn">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Enterprise cyber resilience, vulnerability audits, OpenSSF security architecture, and defensive threat modeling credentials.
              </p>
              
              {/* Linux Foundation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">Developing Secure Software (LFD121)</span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber/20 text-amber border border-amber/30">Credly Verified</span>
                  </div>
                  <span className="text-[11px] text-cyan/90 font-mono mt-1 block">
                    The Linux Foundation (OpenSSF) · ID: LF-rho2gumy1d
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://www.credly.com/badges/64211ae0-da26-4aaf-9d72-4dd87658a17f/public_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] uppercase bg-amber/15 text-amber border border-amber/40 px-3 py-2 hover:bg-amber hover:text-black transition-colors rounded-lg font-bold"
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
                    className="font-mono text-[10px] uppercase bg-cyan/15 text-cyan border border-cyan/40 px-3 py-2 hover:bg-cyan hover:text-black transition-colors rounded-lg cursor-pointer font-bold"
                  >
                    PDF ↗
                  </button>
                </div>
              </div>

              {/* IBM Cybersecurity */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-cyan/20 hover:border-cyan/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">Cybersecurity Fundamentals Specialization</span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber/20 text-amber border border-amber/30">Credly Verified</span>
                  </div>
                  <span className="text-[11px] text-cyan/90 font-mono mt-1 block">
                    IBM SkillsBuild · Credly Badge · ID: PLAN-4FB8400F05FC
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://www.credly.com/badges/1bd709be-42f9-4d0c-9b19-67db4e84b94d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] uppercase bg-amber/15 text-amber border border-amber/40 px-3 py-2 hover:bg-amber hover:text-black transition-colors rounded-lg font-bold"
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
                    className="font-mono text-[10px] uppercase bg-cyan/15 text-cyan border border-cyan/40 px-3 py-2 hover:bg-cyan hover:text-black transition-colors rounded-lg cursor-pointer font-bold"
                  >
                    PDF ↗
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. n8n Automation Specialist */}
      <div className="credentials-card p-1.5 rounded-[2rem] bg-gradient-to-b from-white/10 via-white/[0.03] to-transparent border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan/50">
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#070b12]/95 overflow-hidden">
          <button
            type="button"
            onClick={() => toggle('n8n')}
            className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-cyan/5 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-xl text-cyan">
                ⚙️
              </div>
              <div>
                <span className="font-mono text-cyan text-[10px] tracking-widest uppercase block mb-1 font-bold">
                  OFFICIAL N8N WORKFLOW CREDENTIALS
                </span>
                <strong className="text-white text-base sm:text-lg font-sans tracking-wide block">
                  n8n Official Certification &amp; Automation Badges
                </strong>
              </div>
            </div>
            
            <div className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 text-zinc-300 font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-2">
              <span>{openSections.n8n ? 'Collapse' : 'Inspect Credentials'}</span>
              <span>{openSections.n8n ? '▲' : '▼'}</span>
            </div>
          </button>

          {openSections.n8n && (
            <div className="px-6 sm:px-8 pb-7 pt-2 space-y-4 border-t border-white/[0.08] bg-black/40 animate-fadeIn">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Official certifications verifying proficiency in complex multi-node automation, sub-workflows, webhook security, and node architecture.
              </p>
              {[
                { title: 'n8n Workflow Automation - Level 1', issuer: 'n8n Academy', date: '2025', id: 'N8N-L1-VERIFIED', pdfUrl: '/documents/cert-n8n-1.pdf' },
                { title: 'n8n Workflow Automation - Level 2', issuer: 'n8n Academy', date: '2025', id: 'N8N-L2-VERIFIED', pdfUrl: '/documents/cert-n8n-2.pdf' },
              ].map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="text-sm font-bold text-white font-sans">{c.title}</span>
                  <button
                    type="button"
                    onClick={() => openCert(c)}
                    className="font-mono text-[10px] uppercase bg-cyan/15 text-cyan border border-cyan/40 px-3.5 py-2 hover:bg-cyan hover:text-black transition-colors rounded-lg cursor-pointer font-bold"
                  >
                    View PDF ↗
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
