'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Download, Activity, Terminal, Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useUI } from '@/lib/contexts/UIContext';

const CertPdfViewer = dynamic(() => import('@/components/CertPdfViewer').then(m => m.CertPdfViewer), { ssr: false });

export default function ModalsSection() {
  const { modalType, setModalType, certData, isMobile } = useUI();

  // LIVE SIMULATION STATES
  const [simStep, setSimStep] = React.useState<'idle' | 'webhook' | 'n8n' | 'parallel' | 'done'>('idle');
  const [logs, setLogs] = React.useState<string[]>([]);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const logContainerRef = React.useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [...prev, `[${timeStr}] ${msg}`]);
  };

  React.useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep('webhook');
    setLogs([]);
    addLog('SYSTEM: Webhook listener mounted at /v1/indiamart/lead');
    addLog('WEBHOOK: Simulating inbound lead inquiry from IndiaMART API...');

    setTimeout(() => {
      setSimStep('n8n');
      addLog('WEBHOOK: Inbound validation passed. Payload pushed to n8n Central System.');
      addLog('N8N: Received payload. Initiating entity parsing & JSON schema checks...');
      addLog('N8N: Normalizing coordinates & phone metadata: Rahul K. | Indore, MP');
    }, 1500);

    setTimeout(() => {
      setSimStep('parallel');
      addLog('N8N: Logic router complete. Executing 3 parallel actions...');
      addLog('API: Dispatched request to Kickbox Auth for real-time mailbox check...');
      addLog('ODOO: Creating partner opportunity record in CRM ERP database...');
      addLog('WA_AGENT: Triggering WhatsApp Evolution API webhook callback...');
    }, 3200);

    setTimeout(() => {
      setSimStep('done');
      addLog('API: Kickbox verified - rahul@primuez.in is a active, deliverable mailbox.');
      addLog('ODOO: Partner record created successfully. Opportunity ID: #4892');
      addLog('WA_AGENT: Custom greeting message + company brochure dispatched.');
      addLog('SYSTEM: Autonomous workflow pipeline executed cleanly in 4.9 seconds.');
      setIsSimulating(false);
    }, 5000);
  };

  // Auto-run simulation on modal open to give an instant spectacular impression
  React.useEffect(() => {
    if (modalType === 'workflow') {
      const timer = setTimeout(() => {
        // Reset states first to ensure a clean slate, then trigger simulation
        setSimStep('webhook');
        setLogs([]);
        setIsSimulating(true);
        addLog('SYSTEM: Webhook listener mounted at /v1/indiamart/lead');
        addLog('WEBHOOK: Simulating inbound lead inquiry from IndiaMART API...');

        const t1 = setTimeout(() => {
          setSimStep('n8n');
          addLog('WEBHOOK: Inbound validation passed. Payload pushed to n8n Central System.');
          addLog('N8N: Received payload. Initiating entity parsing & JSON schema checks...');
          addLog('N8N: Normalizing coordinates & phone metadata: Rahul K. | Indore, MP');
        }, 1500);

        const t2 = setTimeout(() => {
          setSimStep('parallel');
          addLog('N8N: Logic router complete. Executing 3 parallel actions...');
          addLog('API: Dispatched request to Kickbox Auth for real-time mailbox check...');
          addLog('ODOO: Creating partner opportunity record in CRM ERP database...');
          addLog('WA_AGENT: Triggering WhatsApp Evolution API webhook callback...');
        }, 3200);

        const t3 = setTimeout(() => {
          setSimStep('done');
          addLog('API: Kickbox verified - rahul@primuez.in is a active, deliverable mailbox.');
          addLog('ODOO: Partner record created successfully. Opportunity ID: #4892');
          addLog('WA_AGENT: Custom greeting message + company brochure dispatched.');
          addLog('SYSTEM: Autonomous workflow pipeline executed cleanly in 4.9 seconds.');
          setIsSimulating(false);
        }, 5000);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }, 600); // 600ms delay to let the modal slide open fully
      return () => clearTimeout(timer);
    } else {
      setSimStep('idle');
      setLogs([]);
      setIsSimulating(false);
    }
  }, [modalType]);

  return (
    <AnimatePresence>
      {modalType && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setModalType(null)}
        >
          {/* WORK WITH ME FORM MODAL */}
          {modalType === 'form' && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-panel border border-cyan/30 rounded-xl w-full max-w-4xl shadow-[0_0_40px_rgba(0,240,255,0.2)] relative h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="bg-bg/80 border-b border-cyan/20 px-6 py-4 flex justify-between items-center font-mono text-sm">
                <span className="text-cyan flex items-center gap-2"><Send size={14}/> Send Your Project Details</span>
                <button onClick={() => setModalType(null)} className="text-text-muted hover:text-white transition-colors">✕ CLOSE</button>
              </div>
              <div className="flex-1 w-full relative bg-bg">
                <iframe 
                  src="https://n8n.srv923105.hstgr.cloud/form/7af19c92-308e-4232-aab8-368b790c8bc2" 
                  className="absolute inset-0 w-full h-full border-none bg-transparent"
                  title="Work With Me Form"
                ></iframe>
              </div>
            </motion.div>
          )}

          {/* HTML CERTIFICATE MODAL */}
          {modalType === 'cert' && certData && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f1520] border-2 border-cyan/50 rounded-lg w-full max-w-3xl shadow-[0_0_60px_rgba(0,240,255,0.15)] relative flex flex-col overflow-hidden"
            >
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
              
              <button onClick={() => setModalType(null)} className="absolute top-3 right-3 min-[375px]:top-4 min-[375px]:right-4 text-text-muted hover:text-white transition-colors z-20"><CheckCircle2 size={24}/></button>

              {certData.pdfUrl ? (
                <div className="flex flex-col w-full">
                  <div className="px-4 pr-12 pt-6 pb-4 min-[375px]:px-6 min-[375px]:pt-8 font-mono text-xs text-cyan uppercase tracking-widest border-b border-cyan/20 break-words">
                    {certData.title}
                  </div>
                  {isMobile ? (
                    <CertPdfViewer url={certData.pdfUrl!} title={certData.title} />
                  ) : (
                    <iframe
                      src={certData.pdfUrl}
                      className="w-full"
                      style={{ height: '70vh', border: 'none' }}
                      title={certData.title}
                    />
                  )}
                  <div className="flex justify-center py-4 border-t border-white/5">
                    <a
                      href={certData.pdfUrl}
                      download
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase bg-cyan/10 text-cyan border border-cyan/30 px-5 py-2 hover:bg-cyan hover:text-bg transition-colors"
                    >
                      <Download size={14} /> Download Certificate
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-3 min-[375px]:p-5 md:p-7 font-sans">
                  {/* Certificate document — styled like a real certificate */}
                  <div className="relative flex overflow-hidden rounded border-2 border-[#c8a84b] shadow-2xl" style={{ background: '#f9f7f1', minHeight: '380px' }}>
                    
                    {/* Gold corner ornaments */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#c8a84b] z-10 pointer-events-none" />
                    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#c8a84b] z-10 pointer-events-none" />
                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#c8a84b] z-10 pointer-events-none" />
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#c8a84b] z-10 pointer-events-none" />

                    {/* Left navy sidebar */}
                    <div className="hidden sm:flex w-[30%] bg-[#0f2044] flex-col items-center justify-between py-10 px-4 relative overflow-hidden">
                      {/* Diagonal accent stripe */}
                      <div className="absolute top-0 right-0 w-3 h-full bg-[#c8a84b] opacity-80" />
                      <div className="absolute top-0 right-3 w-1 h-full bg-[#c8a84b] opacity-30" />

                      {/* Top issuer name */}
                      <div className="text-center z-10">
                        <div className="text-[#c8a84b] text-[10px] uppercase tracking-[0.3em] mb-1">Issued by</div>
                        <div className="text-white text-sm font-bold leading-tight text-center">{certData.issuer}</div>
                      </div>

                      {/* Centre badge */}
                      <div className="z-10 flex flex-col items-center gap-3">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="#c8a84b" strokeWidth="2.5"/>
                          <circle cx="40" cy="40" r="29" fill="none" stroke="#c8a84b" strokeWidth="1" strokeDasharray="4 3"/>
                          <circle cx="40" cy="40" r="22" fill="#c8a84b" opacity="0.15"/>
                          <text x="40" y="37" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="serif" letterSpacing="1">CERTIFICATE</text>
                          <text x="40" y="48" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="serif" letterSpacing="1">OF COMPLETION</text>
                          <text x="40" y="59" textAnchor="middle" fill="#c8a84b" fontSize="16">✦</text>
                        </svg>
                      </div>

                      {/* Bottom credential id */}
                      <div className="text-center z-10">
                        <div className="text-[#c8a84b] text-[9px] uppercase tracking-[0.3em] mb-1">Credential ID</div>
                        <div className="text-white/60 text-[10px] font-mono">{certData.id}</div>
                      </div>
                    </div>

                    {/* Right main content */}
                    <div className="flex-1 flex flex-col justify-center px-4 min-[375px]:px-6 md:px-12 py-6 min-[375px]:py-8 md:py-10 relative">
                      {/* VERIFIED watermark stamp */}
                      <div className="absolute bottom-8 right-8 opacity-[0.12] select-none pointer-events-none"
                        style={{ transform: 'rotate(-18deg)' }}>
                        <div className="border-4 border-[#1a5cb0] rounded-full px-5 py-2 text-[#1a5cb0] text-xl font-black tracking-[0.3em]">
                          VERIFIED
                        </div>
                      </div>

                      {/* Certificate of Completion heading */}
                      <div className="mb-3 min-[375px]:mb-6">
                        <p className="text-[#c8a84b] text-[10px] uppercase tracking-[0.35em] font-semibold mb-0.5">Certificate of</p>
                        <h2 className="text-[#0f2044] text-2xl min-[375px]:text-3xl md:text-4xl font-black tracking-wide leading-none" style={{ fontFamily: 'Georgia, serif' }}>COMPLETION</h2>
                      </div>

                      {/* Recipient */}
                      <div className="mb-1">
                        <p className="text-gray-500 text-xs mb-2">This is to certify that</p>
                        <p className="text-gray-900 text-xl min-[375px]:text-2xl md:text-3xl font-bold pb-1 border-b border-dotted border-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                          Rahul Kasturiya
                        </p>
                      </div>

                      {/* Course */}
                      <div className="mt-4 mb-5">
                        <p className="text-gray-500 text-xs mb-1">has successfully completed the course</p>
                        <p className="text-[#0f2044] text-base md:text-lg font-bold leading-snug">{certData.title}</p>
                      </div>

                      {/* Footer row */}
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase tracking-widest">Date Issued</p>
                          <p className="text-gray-700 text-sm font-medium">{certData.date}</p>
                        </div>
                        {/* Signature line */}
                        <div className="text-right">
                          <div className="text-gray-400 text-2xl mb-0.5" style={{ fontFamily: 'cursive' }}>✦</div>
                          <div className="w-24 border-t border-gray-400" />
                          <p className="text-gray-500 text-[10px] mt-1">Authorised Signatory</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* INTERACTIVE WORKFLOW MODAL */}
          {modalType === 'workflow' && (
            <motion.div 
              initial={{ scale: 0.90, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.90, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg border border-cyan/30 rounded-xl w-full max-w-6xl shadow-[0_0_80px_rgba(0,240,255,0.15)] relative h-[85vh] overflow-y-auto flex flex-col font-sans"
            >
              <div className="sticky top-0 bg-bg/95 border-b border-cyan/20 px-6 py-4 flex justify-between items-center font-mono text-sm z-50 backdrop-blur">
                <span className="text-cyan flex items-center gap-2"><Activity size={14}/> SYSTEM ARCHITECTURE VIEWER</span>
                <button 
                  onClick={() => { setModalType(null); setSimStep('idle'); setLogs([]); }} 
                  className="text-text-muted hover:text-white transition-colors border border-white/10 px-3 py-1 rounded"
                >
                  CLOSE
                </button>
              </div>
              
              <div className="p-6 md:p-10 relative flex-1 flex flex-col">
                {/* Subtle grid background on diagram modal */}
                <div className="absolute inset-0 z-0 bg-blueprint opacity-10" style={{ backgroundSize: '30px 30px' }}></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Console Header - Mobile (standard layout) */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:hidden">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">The Autonomous Enterprise</h2>
                      <p className="text-zinc-400 text-xs md:text-sm max-w-2xl leading-relaxed">
                        This interactive sequence illustrates the automated data pipeline between lead entry, processing, and downstream fulfillment. Replacing human routers with digital operators saves hundreds of hours for manufacturing businesses in the Raipur Corridor.
                      </p>
                    </div>
                    <button
                      onClick={startSimulation}
                      disabled={isSimulating}
                      className={`font-mono text-xs uppercase tracking-widest px-5 py-3.5 border rounded-lg transition-all duration-300 flex items-center gap-2 select-none active:scale-95 shrink-0 ${
                        isSimulating 
                          ? 'border-cyan/40 bg-cyan/5 text-cyan cursor-not-allowed'
                          : 'border-amber bg-amber/5 text-amber hover:bg-amber hover:text-bg hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] cursor-pointer'
                      }`}
                    >
                      <Activity size={14} className={isSimulating ? 'animate-spin' : ''} />
                      {isSimulating ? 'Simulating Webhook...' : 'Trigger Live Simulation'}
                    </button>
                  </div>

                  {/* Console Header - Desktop (Centered Massive Launch Button) */}
                  <div className="hidden md:flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-3">The Autonomous Enterprise Core</h2>
                    <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed mb-6">
                      This interactive sequence illustrates the automated data pipeline between lead entry, processing, and downstream fulfillment. Replacing human routers with digital operators saves hundreds of hours for manufacturing businesses in the Raipur Corridor.
                    </p>
                    
                    {/* Centered Massive Glow Button */}
                    <button
                      onClick={startSimulation}
                      disabled={isSimulating}
                      className={`font-mono text-xs uppercase tracking-[0.2em] px-10 py-4.5 border-2 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 select-none active:scale-95 shadow-lg ${
                        isSimulating 
                          ? 'border-cyan bg-cyan/5 text-cyan/60 shadow-[0_0_25px_rgba(0,240,255,0.1)] cursor-not-allowed'
                          : 'border-amber bg-amber/5 text-amber hover:bg-amber hover:text-bg hover:shadow-[0_0_35px_rgba(245,166,35,0.55)] cursor-pointer scale-105 transform hover:scale-110 font-bold'
                      }`}
                    >
                      <Activity size={16} className={isSimulating ? 'animate-spin' : 'animate-pulse'} />
                      {isSimulating ? 'EXECUTION IN PROGRESS...' : 'TRIGGER LIVE EVENT PIPELINE'}
                    </button>
                  </div>

                  {/* Dual Column Console */}
                  <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1">
                    
                    {/* Left Column: Flow Diagram */}
                    <div className="flex-1 flex flex-col items-center gap-0 pb-6">
                      
                      {/* Node 1: Lead Entry */}
                      <div className={`w-full max-w-lg border rounded-lg p-5 relative transition-all duration-500 ${
                        simStep === 'webhook' 
                          ? 'border-amber bg-amber/10 shadow-[0_0_20px_rgba(245,166,35,0.2)] animate-pulse'
                          : ['n8n', 'parallel', 'done'].includes(simStep)
                            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                            : 'border-white/10 bg-white/[0.02] opacity-50'
                      }`}>
                        <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm flex items-center justify-center font-bold text-sm transition-colors duration-500 ${
                          ['n8n', 'parallel', 'done'].includes(simStep) ? 'bg-emerald-500 text-bg' : 'bg-amber text-bg'
                        }`}>
                          01
                        </div>
                        <h4 className={`text-sm font-bold font-mono mb-1 transition-colors duration-500 ${
                          ['n8n', 'parallel', 'done'].includes(simStep) ? 'text-emerald-400' : 'text-amber'
                        }`}>
                          Lead Entry (IndiaMART)
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          A potential customer submits an inquiry on IndiaMART. A webhook immediately pushes the raw payload to the orchestrator.
                        </p>
                      </div>

                      {/* Cable 1 */}
                      <div className="h-10 w-[2px] bg-white/5 relative overflow-hidden my-1">
                        {(simStep === 'webhook' || (simStep === 'idle' && isSimulating)) && (
                          <motion.div
                            initial={{ y: '-100%' }}
                            animate={{ y: '250%' }}
                            transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-amber to-transparent shadow-[0_0_8px_rgba(245,166,35,1)]"
                          />
                        )}
                        {['n8n', 'parallel', 'done'].includes(simStep) && (
                          <div className="absolute inset-0 bg-emerald-500/40" />
                        )}
                      </div>

                      {/* Node 2: n8n Central System */}
                      <div className={`w-full max-w-xl border rounded-lg p-5 relative transition-all duration-500 ${
                        simStep === 'n8n' 
                          ? 'border-cyan bg-cyan/10 shadow-[0_0_35px_rgba(0,240,255,0.25)]'
                          : ['parallel', 'done'].includes(simStep)
                            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                            : 'border-white/10 bg-white/[0.02] opacity-50'
                      }`}>
                        <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm flex items-center justify-center font-bold text-sm transition-colors duration-500 ${
                          ['parallel', 'done'].includes(simStep) ? 'bg-emerald-500 text-bg' : 'bg-cyan text-bg'
                        }`}>
                          02
                        </div>
                        <h4 className={`text-sm font-bold font-mono mb-1 transition-colors duration-500 ${
                          ['parallel', 'done'].includes(simStep) ? 'text-emerald-400' : 'text-cyan'
                        }`}>
                          n8n Central System
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                          The payload is parsed, normalized, and logic branches evaluate lead quality. The main data object routes to three parallel subsystems instantly.
                        </p>
                        
                        {/* Dynamic Progress Bar */}
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5 relative">
                          {simStep === 'n8n' && (
                            <motion.div 
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1.5, ease: 'easeInOut' }}
                              className="h-full bg-cyan shadow-[0_0_8px_rgba(0,240,255,1)]"
                            />
                          )}
                          {['parallel', 'done'].includes(simStep) && (
                            <div className="h-full bg-emerald-500 w-full" />
                          )}
                        </div>
                      </div>

                      {/* Cable 2 */}
                      <div className="h-10 w-[2px] bg-white/5 relative overflow-hidden my-1">
                        {simStep === 'n8n' && (
                          <motion.div
                            initial={{ y: '-100%' }}
                            animate={{ y: '250%' }}
                            transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-cyan to-transparent shadow-[0_0_8px_rgba(0,240,255,1)]"
                          />
                        )}
                        {['parallel', 'done'].includes(simStep) && (
                          <div className="absolute inset-0 bg-emerald-500/40" />
                        )}
                      </div>

                      {/* Splitting Parallel Nodes Container */}
                      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 relative">
                        {/* Splitting lines above (Desktop) */}
                        <div className="hidden md:block absolute top-0 left-1/6 right-1/6 h-[2px] bg-white/5">
                          {simStep === 'parallel' && (
                            <motion.div 
                              initial={{ width: '0%', left: '50%' }}
                              animate={{ width: '100%', left: '0%' }}
                              transition={{ duration: 1.0, ease: 'easeOut' }}
                              className="absolute h-full bg-cyan shadow-[0_0_6px_rgba(0,240,255,1)]"
                            />
                          )}
                          {simStep === 'done' && <div className="absolute inset-0 bg-emerald-500/40" />}
                        </div>

                        {/* Node 3A: Kickbox API */}
                        <div className={`border rounded-lg p-4 relative transition-all duration-500 ${
                          simStep === 'parallel'
                            ? 'border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.25)] animate-pulse'
                            : simStep === 'done'
                              ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                              : 'border-white/10 bg-white/[0.02] opacity-50'
                        }`}>
                          <div className="absolute -top-3 -right-3 bg-bg border border-green-500/30 px-2 py-0.5 text-[8px] text-green-400 font-mono rounded">
                            API
                          </div>
                          <h4 className="text-green-400 font-bold mb-1.5 font-mono text-xs">3A. Kickbox Auth</h4>
                          <p className="text-zinc-400 text-[10px] leading-normal font-sans">
                            Verifies the accuracy and deliverability of the email address preventing CRM pollution.
                          </p>
                        </div>

                        {/* Node 3B: Odoo CRM */}
                        <div className={`border rounded-lg p-4 relative transition-all duration-500 ${
                          simStep === 'parallel'
                            ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.25)] animate-pulse'
                            : simStep === 'done'
                              ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                              : 'border-white/10 bg-white/[0.02] opacity-50'
                        }`}>
                          <div className="absolute -top-3 -right-3 bg-bg border border-purple-500/30 px-2 py-0.5 text-[8px] text-purple-400 font-mono rounded">
                            ERP
                          </div>
                          <h4 className="text-purple-400 font-bold mb-1.5 font-mono text-xs">3B. CRM Injection</h4>
                          <p className="text-zinc-400 text-[10px] leading-normal font-sans">
                            Lead is injected into the ERP pipeline. Tags, priority state, and contact info are mapped instantly.
                          </p>
                        </div>

                        {/* Node 3C: Evolution API */}
                        <div className={`border rounded-lg p-4 relative transition-all duration-500 ${
                          simStep === 'parallel'
                            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.25)] animate-pulse'
                            : simStep === 'done'
                              ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                              : 'border-white/10 bg-white/[0.02] opacity-50'
                        }`}>
                          <div className="absolute -top-3 -right-3 bg-bg border border-indigo-500/30 px-2 py-0.5 text-[8px] text-indigo-400 font-mono rounded">
                            EVO WA
                          </div>
                          <h4 className="text-indigo-400 font-bold mb-1.5 font-mono text-xs">3C. WA Greeting</h4>
                          <p className="text-zinc-400 text-[10px] leading-normal font-sans">
                            Dispatches a personalized, automated greeting message and company profile PDF to the prospect.
                          </p>
                        </div>
                      </div>

                      {/* Cable Footer */}
                      <div className="h-8 w-[2px] bg-white/5 relative overflow-hidden mt-4">
                        {simStep === 'parallel' && (
                          <motion.div
                            initial={{ y: '-100%' }}
                            animate={{ y: '200%' }}
                            transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-cyan to-transparent shadow-[0_0_8px_rgba(0,240,255,1)]"
                          />
                        )}
                        {simStep === 'done' && (
                          <div className="absolute inset-0 bg-emerald-500/40" />
                        )}
                      </div>

                      {/* Footer Badge */}
                      <span className={`font-mono text-[9px] uppercase tracking-widest border px-4 py-1.5 rounded-full transition-colors duration-500 ${
                        simStep === 'done' 
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                          : 'border-cyan/20 text-cyan/40 bg-black/40'
                      }`}>
                        {simStep === 'done' ? 'Automated Flow Sequence Complete' : 'End of Automated Core Sequence'}
                      </span>
                    </div>

                    {/* Right Column: Live Terminal Console Logs */}
                    <div className="w-full lg:w-[360px] shrink-0 flex flex-col h-[280px] lg:h-auto min-h-[280px] border border-cyan/20 bg-black/70 rounded-xl p-4 font-mono text-[10px] md:text-[11px]">
                      <div className="flex items-center gap-2 border-b border-cyan/15 pb-2 mb-3 text-cyan/80 text-[9px] uppercase tracking-widest font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
                        <span>Terminal Log Viewer</span>
                      </div>
                      
                      <div 
                        ref={logContainerRef} 
                        className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1 scroll-smooth text-zinc-300"
                      >
                        {logs.length === 0 ? (
                          <div className="text-zinc-600 italic mt-6 text-center select-none leading-relaxed">
                            // Standby Mode.<br/>
                            // Click "Trigger Live Simulation" to initialize the live event bus.
                          </div>
                        ) : (
                          logs.map((log, i) => (
                            <div key={i} className="leading-relaxed border-l border-cyan/20 pl-2">
                              {log.includes('SUCCESS') ? (
                                <span className="text-emerald-400 font-bold">{log}</span>
                              ) : log.includes('SYSTEM:') ? (
                                <span className="text-zinc-400">{log}</span>
                              ) : log.includes('WEBHOOK:') ? (
                                <span className="text-amber/90">{log}</span>
                              ) : (
                                <span>{log}</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
