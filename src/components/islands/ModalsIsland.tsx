import { useState, useEffect, useRef } from 'react';

type ModalType = 'form' | 'cert' | 'workflow' | null;

interface CertData {
  title: string;
  issuer: string;
  date: string;
  id: string;
  pdfUrl?: string;
}

export default function ModalsIsland() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [certData, setCertData] = useState<CertData | null>(null);

  // Workflow simulation state
  const [simStep, setSimStep] = useState<'idle' | 'webhook' | 'n8n' | 'parallel' | 'done'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [...prev, `[${timeStr}] ${msg}`]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Listen to custom events
  useEffect(() => {
    const handleOpen = (e: any) => {
      const type = e.detail?.type;
      const data = e.detail?.data;
      setModalType(type);
      if (data) setCertData(data);
    };

    window.addEventListener('open-modal', handleOpen);
    return () => window.removeEventListener('open-modal', handleOpen);
  }, []);

  const closeModal = () => {
    setModalType(null);
    setCertData(null);
    setSimStep('idle');
    setLogs([]);
    setIsSimulating(false);
  };

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
    }, 1200);

    setTimeout(() => {
      setSimStep('parallel');
      addLog('N8N: Logic router complete. Executing 3 parallel actions...');
      addLog('API: Dispatched request to Kickbox Auth for real-time mailbox check...');
      addLog('ODOO: Creating partner opportunity record in CRM ERP database...');
      addLog('WA_AGENT: Triggering WhatsApp Evolution API webhook callback...');
    }, 2400);

    setTimeout(() => {
      setSimStep('done');
      addLog('API: Kickbox verified - rahul@primuez.in is an active, deliverable mailbox.');
      addLog('ODOO: Partner record created successfully. Opportunity ID: #4892');
      addLog('WA_AGENT: Custom greeting message + company brochure dispatched.');
      addLog('SYSTEM: Core pipeline verification complete. Status: 100% active. Zero human friction!');
      setIsSimulating(false);
    }, 3800);
  };

  if (!modalType) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={closeModal}
    >
      {/* 1. Form Modal */}
      {modalType === 'form' && (
        <div
          className="bg-panel border border-cyan/40 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#0a0a0f] border-b border-white/[0.08] px-6 py-4 flex justify-between items-center font-mono text-xs">
            <span className="text-cyan font-bold flex items-center gap-2">
              <span>✉</span> SEND PROJECT DETAILS
            </span>
            <button
              type="button"
              onClick={closeModal}
              className="text-text-muted hover:text-white px-2 py-1 rounded border border-white/10 uppercase cursor-pointer"
            >
              Close [✕]
            </button>
          </div>
          <div className="flex-1 w-full relative bg-[#0a0a0f]">
            <iframe
              src="https://n8n.srv923105.hstgr.cloud/form/7af19c92-308e-4232-aab8-368b790c8bc2"
              className="absolute inset-0 w-full h-full border-none"
              title="Work With Me Form"
            />
          </div>
        </div>
      )}

      {/* 2. Certificate Modal */}
      {modalType === 'cert' && certData && (
        <div
          className="bg-panel border border-cyan/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#0a0a0f] border-b border-white/[0.08] px-6 py-4 flex justify-between items-center font-mono text-xs">
            <span className="text-cyan font-bold truncate pr-4">{certData.title}</span>
            <button
              type="button"
              onClick={closeModal}
              className="text-text-muted hover:text-white px-2 py-1 rounded border border-white/10 uppercase cursor-pointer shrink-0"
            >
              Close [✕]
            </button>
          </div>

          <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
            {certData.pdfUrl ? (
              <div className="flex flex-col gap-4">
                <iframe
                  src={certData.pdfUrl}
                  className="w-full h-[60vh] rounded-lg border border-white/10 bg-white"
                  title={certData.title}
                />
                <div className="flex justify-center">
                  <a
                    href={certData.pdfUrl}
                    download
                    className="px-6 py-2.5 bg-cyan/10 hover:bg-cyan hover:text-bg border border-cyan/40 text-cyan rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all"
                  >
                    Download Certificate (PDF) &rarr;
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-lg text-zinc-900 font-sans">
                <h3 className="text-2xl font-bold mb-2 text-[#0f2044]">{certData.title}</h3>
                <p className="text-sm text-zinc-600 mb-1">Issued by: <strong>{certData.issuer}</strong></p>
                <p className="text-sm text-zinc-600 mb-1">Date: {certData.date}</p>
                <p className="text-xs font-mono text-zinc-500 mt-4">Credential ID: {certData.id}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Interactive Workflow Modal */}
      {modalType === 'workflow' && (
        <div
          className="bg-panel border border-cyan/40 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#0a0a0f] border-b border-white/[0.08] px-6 py-4 flex justify-between items-center font-mono text-xs">
            <span className="text-cyan font-bold">⚙ SYSTEM ARCHITECTURE // THE AUTONOMOUS ENTERPRISE</span>
            <button
              type="button"
              onClick={closeModal}
              className="text-text-muted hover:text-white px-2 py-1 rounded border border-white/10 uppercase cursor-pointer"
            >
              Close [✕]
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white font-sans">Manufacturing Lead & ERP Architecture</h3>
                <p className="text-xs text-text-muted mt-1 font-sans">
                  Automated end-to-end pipeline connecting IndiaMART webhooks to Odoo CRM, email hygiene, and WhatsApp callbacks.
                </p>
              </div>

              <button
                type="button"
                onClick={startSimulation}
                disabled={isSimulating}
                className="px-5 py-2.5 bg-amber/10 border border-amber/40 text-amber hover:bg-amber hover:text-bg font-mono text-xs uppercase tracking-wider rounded-lg font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isSimulating ? 'Simulating Pipeline...' : '▶ Run Live Event Pipeline'}
              </button>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { step: '01', title: 'IndiaMART Webhook', active: simStep === 'webhook' || ['n8n', 'parallel', 'done'].includes(simStep) },
                { step: '02', title: 'n8n Central Logic', active: simStep === 'n8n' || ['parallel', 'done'].includes(simStep) },
                { step: '03', title: 'Parallel Execution', active: simStep === 'parallel' || simStep === 'done' },
                { step: '04', title: 'ERP & Client Dispatched', active: simStep === 'done' },
              ].map((st) => (
                <div
                  key={st.step}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    st.active
                      ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-white/[0.02] border-white/10 text-zinc-500'
                  }`}
                >
                  <span className="font-mono text-xs font-bold block mb-1">[{st.step}]</span>
                  <span className="text-xs font-bold block">{st.title}</span>
                </div>
              ))}
            </div>

            {/* Execution Logs */}
            <div className="bg-black/80 border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-400 flex-1 min-h-[220px] overflow-y-auto" ref={logContainerRef}>
              <div className="text-zinc-500 mb-2">// REAL-TIME PIPELINE LOG CONSOLE</div>
              {logs.length === 0 ? (
                <div className="text-zinc-600 italic">Click "Run Live Event Pipeline" to simulate real webhook ingestion...</div>
              ) : (
                logs.map((l, i) => <div key={i} className="py-0.5">{l}</div>)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
