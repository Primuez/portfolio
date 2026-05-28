'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Download, Activity, Terminal, Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useUI } from '@/lib/contexts/UIContext';

const CertPdfViewer = dynamic(() => import('@/components/CertPdfViewer').then(m => m.CertPdfViewer), { ssr: false });

export default function ModalsSection() {
  const { modalType, setModalType, certData, isMobile } = useUI();

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
              className="bg-bg border border-cyan/30 rounded-xl w-full max-w-6xl shadow-[0_0_80px_rgba(0,240,255,0.15)] relative h-[85vh] overflow-y-auto flex flex-col"
            >
              <div className="sticky top-0 bg-bg/95 border-b border-cyan/20 px-6 py-4 flex justify-between items-center font-mono text-sm z-50 backdrop-blur">
                <span className="text-cyan flex items-center gap-2"><Activity size={14}/> SYSTEM ARCHITECTURE VIEWER</span>
                <button onClick={() => setModalType(null)} className="text-text-muted hover:text-white transition-colors border border-white/10 px-3 py-1 rounded">CLOSE</button>
              </div>
              
              <div className="p-8 md:p-12 relative">
                {/* Subtle grid background on diagram modal */}
                <div className="absolute inset-0 z-0 bg-blueprint opacity-10" style={{ backgroundSize: '30px 30px' }}></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-4xl font-bold mb-4">The Autonomous Enterprise</h2>
                  <p className="text-text-muted mb-12 max-w-3xl leading-relaxed">This interactive sequence illustrates the automated data pipeline between lead entry, processing, and downstream fulfillment. Replacing human routers with digital operators saves hundreds of hours for manufacturing businesses in the Raipur Corridor.</p>
                  
                  {/* Interactive Flow Diagram */}
                  <div className="flex flex-col items-center gap-0 font-mono text-xs w-full pb-12">
                    
                    {/* Node 1 */}
                    <div className="w-full max-w-lg border border-amber/40 bg-amber/5 rounded-lg p-6 relative group mb-0 shadow-[0_0_15px_rgba(245,166,35,0.05)]">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber rounded-sm flex items-center justify-center text-bg font-bold font-sans">01</div>
                      <h4 className="text-amber text-lg font-bold mb-2">Lead Entry (IndiaMART)</h4>
                      <p className="text-text-muted">A potential customer submits an inquiry on IndiaMART. A webhook immediately pushes the raw payload to the orchestrator.</p>
                    </div>
                    
                    {/* Connector Add Animation */}
                    <div className="h-12 w-[2px] bg-gradient-to-b from-amber/40 to-cyan/40 relative">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
                    </div>
                    
                    {/* Node 2 */}
                    <div className="w-full max-w-2xl border-2 border-cyan bg-cyan/5 rounded-xl p-8 relative shadow-[0_0_30px_rgba(0,240,255,0.1)] my-0">
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyan rounded-sm flex items-center justify-center text-bg font-bold font-sans text-sm outline outline-4 outline-bg">02</div>
                      <h4 className="text-cyan text-xl font-bold mb-2 flex items-center gap-2"><Terminal size={20}/> n8n Central System</h4>
                      <p className="text-text-muted mb-6 text-sm">The payload is parsed, normalized, and logic branches evaluate lead quality. The main data object routes to three parallel subsystems instantly.</p>
                      
                      <div className="flex justify-between items-center px-4 bg-bg/50 py-3 rounded-lg border border-cyan/20">
                        <span className="text-[10px] tracking-widest uppercase text-cyan/70">Raw JSON</span>
                        <div className="h-[1px] flex-1 bg-cyan/20 mx-4 relative overflow-hidden">
                           <div className="absolute top-0 left-0 h-full w-1/4 bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-[slide_1.5s_linear_infinite]"></div>
                        </div>
                        <span className="text-[10px] tracking-widest uppercase text-cyan/70">Parsed Entity</span>
                        <div className="h-[1px] flex-1 bg-cyan/20 mx-4 relative overflow-hidden">
                           <div className="absolute top-0 left-0 h-full w-1/4 bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-[slide_1.5s_linear_infinite_0.5s]"></div>
                        </div>
                        <span className="text-[10px] tracking-widest uppercase text-cyan font-bold block">Execute API</span>
                      </div>
                    </div>
                    
                    <div className="h-10 w-[2px] bg-cyan/40"></div>
                    
                    {/* Parallel Nodes Container */}
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative">
                      {/* Splitting lines above (Desktop) */}
                      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[calc(66.666%)] h-[2px] bg-cyan/40"></div>
                      <div className="hidden md:block absolute top-0 left-1/6 w-[2px] h-4 bg-cyan/40"></div>
                      <div className="hidden md:block absolute top-0 right-1/6 w-[2px] h-4 bg-cyan/40"></div>
                      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-cyan/40"></div>

                      {/* Node 3A */}
                      <div className="border border-green-500/40 bg-green-500/5 rounded-lg p-6 relative">
                        <div className="absolute -top-3 -right-3 bg-bg border border-green-500/40 px-2 py-1 text-[10px] text-green-500 rounded">API</div>
                        <h4 className="text-green-500 font-bold mb-3 text-sm">3A. Kickbox Auth</h4>
                        <p className="text-text-muted text-xs leading-relaxed">Verifies the accuracy and deliverability of the email address preventing CRM pollution.</p>
                      </div>
                      
                      {/* Node 3B */}
                      <div className="border border-purple-500/40 bg-purple-500/5 rounded-lg p-6 relative">
                         <div className="absolute -top-3 -right-3 bg-bg border border-purple-500/40 px-2 py-1 text-[10px] text-purple-500 rounded">Odoo</div>
                        <h4 className="text-purple-500 font-bold mb-3 text-sm">3B. CRM Injection</h4>
                        <p className="text-text-muted text-xs leading-relaxed">Lead is injected into the ERP pipeline. Tags, priority state, and contact info are mapped instantly.</p>
                      </div>
                      
                      {/* Node 3C */}
                      <div className="border border-indigo-500/40 bg-indigo-500/5 rounded-lg p-6 relative">
                         <div className="absolute -top-3 -right-3 bg-bg border border-indigo-500/40 px-2 py-1 text-[10px] text-indigo-500 rounded">Evo / WA</div>
                        <h4 className="text-indigo-500 font-bold mb-3 text-sm">3C. WA Greeting</h4>
                        <p className="text-text-muted text-xs leading-relaxed">Dispatches a personalized, automated greeting message and company profile PDF to the prospect.</p>
                      </div>
                    </div>

                    <div className="h-16 w-[2px] bg-gradient-to-b from-cyan/40 to-transparent mt-8"></div>
                    <span className="text-cyan/40 font-mono text-[10px] uppercase tracking-widest border border-cyan/20 px-3 py-1 rounded-full">End of Automated Core Sequence</span>

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
