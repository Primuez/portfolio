'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  CheckCircle2, 
  Zap, 
  Bot, 
  Video, 
  Mic, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Phone, 
  User, 
  Globe, 
  DollarSign, 
  Clock, 
  AlertCircle,
  ExternalLink,
  X,
  Layers,
  Check,
  Building2,
  Compass
} from 'lucide-react';

interface WorkWithMeFormProps {
  onClose?: () => void;
  inline?: boolean;
}

const SERVICES = [
  { 
    id: 'workflow', 
    label: 'Workflow & Operations Automation', 
    icon: Zap, 
    desc: 'End-to-end sync across CRM, Sheets, Webhooks, Stripe & Databases.' 
  },
  { 
    id: 'agents', 
    label: 'Custom AI Agents & Copilots', 
    icon: Bot, 
    desc: 'Autonomous reasoning agents for 24/7 lead triage, support & document pipelines.' 
  },
  { 
    id: 'voice', 
    label: 'AI Voice & Phone Call Agents', 
    icon: Mic, 
    desc: 'Real-time inbound/outbound voice assistants with live CRM scheduling.' 
  },
  { 
    id: 'video', 
    label: 'Content & Media Automation', 
    icon: Video, 
    desc: 'Programmatic video, visual generation & automated social distribution.' 
  },
  { 
    id: 'integration', 
    label: 'Custom Software & API Integration', 
    icon: Layers, 
    desc: 'Custom microservices, ERP connectors & secure legacy system links.' 
  },
  { 
    id: 'consulting', 
    label: 'Strategic AI Architecture', 
    icon: Sparkles, 
    desc: '1-on-1 workflow audit, systems design & high-ROI roadmap scoping.' 
  },
];

const BUDGET_RANGES = [
  { 
    id: 'starter', 
    label: 'Starter Project ($500 – $1,200)', 
    sub: 'Single pipeline or automation fix',
    desc: 'Single focused workflow, basic CRM/Sheets sync, or proof-of-concept AI bot' 
  },
  { 
    id: 'growth', 
    label: 'Growth System ($1,200 – $3,500)', 
    sub: 'Multi-agent or core business sync',
    desc: 'Multi-step automated pipeline, webhook error handling, database sync, and multi-tool routing' 
  },
  { 
    id: 'enterprise', 
    label: 'Full Enterprise Solution ($3,500+)', 
    sub: 'Custom infrastructure & private deployment',
    desc: 'End-to-end multi-agent system, custom user portal, high-volume data handling, and private deployment' 
  },
  { 
    id: 'retainer', 
    label: 'Monthly Fractional Partner (Retainer)', 
    sub: 'Ongoing sprint capacity & 24/7 ops',
    desc: 'Ongoing engineering sprints, dedicated roadmap, 24/7 autonomous monitoring, and priority turnaround' 
  },
];

const TIMELINES = [
  '⚡ Within 2 Weeks',
  '🗓️ 2 – 4 Weeks',
  '⏳ 1 – 2 Months',
  '🔄 Flexible Planning'
];

const QUICK_TOOL_TAGS = [
  { name: 'WhatsApp', group: 'Messaging' },
  { name: 'Google Sheets', group: 'Data' },
  { name: 'Gmail / Workspace', group: 'Comms' },
  { name: 'Stripe', group: 'Payments' },
  { name: 'Shopify', group: 'E-com' },
  { name: 'HubSpot', group: 'CRM' },
  { name: 'Zoho / Odoo', group: 'CRM' },
  { name: 'Telegram', group: 'Messaging' },
  { name: 'Airtable', group: 'Data' },
  { name: 'Notion', group: 'Ops' },
  { name: 'n8n', group: 'Automation' },
  { name: 'PostgreSQL', group: 'DB' },
  { name: 'Starting fresh (Need recommendations)', group: 'New' },
];

const CONTACT_METHODS = [
  'WhatsApp (Fastest response)', 
  'Email', 
  'Google Meet Video Call', 
  'Telegram', 
  'Phone Call'
];

const SOURCES = [
  'YouTube (@Primuez)', 
  'LinkedIn', 
  'X / Twitter', 
  'Direct Referral / Word of Mouth', 
  'GitHub', 
  'Other'
];

export function WorkWithMeForm({ onClose, inline = false }: WorkWithMeFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    serviceType: 'Workflow & Operations Automation',
    budgetRange: 'Growth System ($1,200 – $3,500)',
    deadline: '🗓️ 2 – 4 Weeks',
    projectDescription: '',
    currentTools: '',
    company: '',
    fullName: '',
    email: '',
    phone: '',
    contactMethod: 'WhatsApp (Fastest response)',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'UTC',
    source: 'YouTube (@Primuez)',
    termsAgreement: true,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError(null);
  };

  const toggleQuickTool = (tool: string) => {
    const tools = formData.currentTools ? formData.currentTools.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (tools.includes(tool)) {
      updateField('currentTools', tools.filter(t => t !== tool).join(', '));
    } else {
      updateField('currentTools', [...tools, tool].join(', '));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.serviceType || !formData.budgetRange) {
        setSubmitError('Please select a focus area and an estimated investment tier.');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 15) {
        setSubmitError('Please provide a brief summary of what you need to build (at least 15 characters).');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!formData.fullName.trim()) {
        setSubmitError('Please enter your full name.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        setSubmitError('Please enter a valid business email address.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 7) {
        setSubmitError('Please enter a valid phone or WhatsApp number with country code.');
        return false;
      }
      if (!formData.termsAgreement) {
        setSubmitError('Please confirm your consent to be contacted.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setSubmitError(null);
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrev = () => {
    setSubmitError(null);
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          apiKeys: formData.currentTools || 'Not specified'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Server could not process your submission. Please try again.');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Something went wrong. Please check your connection or contact directly at contact@primuez.in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-[#07090e] border border-white/[0.08] rounded-2xl w-full max-w-4xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative flex flex-col text-zinc-100 font-sans ${
        inline ? 'my-8 text-left' : 'max-h-[96vh] overflow-hidden'
      }`}
    >
      {/* Header Bar */}
      <div className="shrink-0 bg-[#090d16]/90 border-b border-white/[0.07] px-6 py-3 flex justify-between items-center z-10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_#00f0ff]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan font-semibold">
              Project Intake // Rahul Kasturiya
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Start an Automation Initiative
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Direct technical scoping. Scoped architecture & turnaround estimate within 24 hours.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06] flex items-center justify-center shrink-0 active:scale-[0.96]"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Stepper Progress */}
      {!submitSuccess && (
        <div className="shrink-0 bg-[#05070b] border-b border-white/[0.05] px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 sm:gap-6 font-mono text-[11px]">
            <button 
              type="button"
              onClick={() => setStep(1)} 
              className={`flex items-center gap-2 transition-colors ${
                step === 1 ? 'text-cyan font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                step > 1 ? 'bg-cyan/20 text-cyan border border-cyan/40' : (step === 1 ? 'bg-cyan text-black' : 'border border-zinc-700 text-zinc-500')
              }`}>
                {step > 1 ? <Check size={11} /> : '1'}
              </span>
              <span className="hidden sm:inline">Objectives & Budget</span>
              <span className="sm:hidden">Budget</span>
            </button>

            <span className="text-zinc-700">/</span>

            <button 
              type="button"
              onClick={() => step > 1 && setStep(2)} 
              disabled={step < 2}
              className={`flex items-center gap-2 transition-colors ${
                step === 2 ? 'text-cyan font-bold' : (step > 2 ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 cursor-not-allowed')
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                step > 2 ? 'bg-cyan/20 text-cyan border border-cyan/40' : (step === 2 ? 'bg-cyan text-black' : 'border border-zinc-700 text-zinc-500')
              }`}>
                {step > 2 ? <Check size={11} /> : '2'}
              </span>
              <span className="hidden sm:inline">Specification</span>
              <span className="sm:hidden">Scope</span>
            </button>

            <span className="text-zinc-700">/</span>

            <button 
              type="button"
              onClick={() => step > 2 && setStep(3)} 
              disabled={step < 3}
              className={`flex items-center gap-2 transition-colors ${
                step === 3 ? 'text-cyan font-bold' : 'text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                step === 3 ? 'bg-cyan text-black' : 'border border-zinc-700 text-zinc-500'
              }`}>
                3
              </span>
              <span className="hidden sm:inline">Contact & Channel</span>
              <span className="sm:hidden">Contact</span>
            </button>
          </div>

          <span className="font-mono text-[11px] text-zinc-500 tabular-nums hidden sm:inline">
            Phase 0{step} / 03
          </span>
        </div>
      )}

      {/* Form Body with Smooth Scroll */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar pb-16">
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-6 px-4 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/30 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <CheckCircle2 size={32} className="text-cyan" />
            </div>

            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan px-3 py-1 bg-cyan/10 rounded-full border border-cyan/20 mb-3">
              Inquiry Dispatched
            </span>

            <h3 className="text-2xl font-bold text-white mb-2">
              Confirmed, {formData.fullName}.
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              Your project specs have landed directly in my private operations feed. A confirmation has been routed to <strong className="text-cyan font-mono">{formData.email}</strong>. Scoped response within 24 hours.
            </p>

            {/* Summary Box */}
            <div className="w-full bg-[#0b0e17] border border-white/[0.08] rounded-xl p-4 text-left text-xs mb-6 space-y-2.5 font-mono">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
                <span className="text-zinc-400">Focus Area:</span>
                <span className="text-cyan font-medium">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
                <span className="text-zinc-400">Investment Tier:</span>
                <span className="text-amber font-medium">{formData.budgetRange}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Channel SLA:</span>
                <span className="text-emerald-400 font-medium">Priority Dispatch &lt; 24h</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a
                href="https://cal.com/prime-s/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-cyan text-black font-bold px-5 py-3 rounded-xl text-xs hover:bg-cyan/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] active:scale-[0.96]"
              >
                <Calendar size={14} /> Schedule 15-Min Intro <ExternalLink size={12} />
              </a>
              <a
                href={`https://wa.me/917024637099?text=${encodeURIComponent(`Hi Rahul, I just submitted the project inquiry for "${formData.serviceType}". My name is ${formData.fullName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold px-5 py-3 rounded-xl text-xs transition-all active:scale-[0.96]"
              >
                <MessageSquare size={14} /> Direct WhatsApp Message <ExternalLink size={12} />
              </a>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs text-zinc-500 hover:text-white underline underline-offset-4 transition-colors"
              >
                Close dialog
              </button>
            )}
          </motion.div>
        ) : (
          <form id="intake-form" onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {/* STEP 1: SERVICE & BUDGET */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3.5"
                >
                  {/* Service Grid */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-2 flex items-center gap-2">
                      <Zap size={13} className="text-cyan" /> 01 // Select Core Focus Area <span className="text-cyan">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {SERVICES.map((s) => {
                        const Icon = s.icon;
                        const active = formData.serviceType === s.label;
                        return (
                          <div
                            key={s.id}
                            onClick={() => updateField('serviceType', s.label)}
                            className={`py-2 px-2.5 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
                              active
                                ? 'bg-cyan/[0.07] border-cyan/70 shadow-[0_0_15px_rgba(0,240,255,0.12)] text-white'
                                : 'bg-[#0a0d17]/80 border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.02] text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded-md border ${
                                  active ? 'bg-cyan/20 border-cyan/50 text-cyan' : 'bg-white/[0.03] border-white/[0.08] text-zinc-400'
                                }`}>
                                  <Icon size={13} />
                                </div>
                                <span className="text-xs font-bold text-white tracking-tight">{s.label}</span>
                              </div>
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                active ? 'border-cyan bg-cyan' : 'border-zinc-700'
                              }`}>
                                {active && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-normal pl-6">{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Ranges */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-2 flex items-center gap-2">
                      <DollarSign size={13} className="text-amber" /> 02 // Estimated Investment Tier <span className="text-cyan">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {BUDGET_RANGES.map((b) => {
                        const active = formData.budgetRange === b.label;
                        return (
                          <div
                            key={b.id}
                            onClick={() => updateField('budgetRange', b.label)}
                            className={`py-2 px-2.5 rounded-xl border cursor-pointer transition-all active:scale-[0.98] flex items-start gap-2.5 ${
                              active
                                ? 'bg-amber/[0.08] border-amber/70 text-white shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                                : 'bg-[#0a0d17]/80 border-white/[0.08] hover:border-white/[0.18] text-zinc-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              active ? 'border-amber bg-amber' : 'border-zinc-700'
                            }`}>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white tracking-tight">{b.label}</div>
                              <div className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{b.sub}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline Pills */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-2 flex items-center gap-2">
                      <Clock size={13} className="text-cyan" /> 03 // Target Timeline
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TIMELINES.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => updateField('deadline', t)}
                          className={`py-2 px-2.5 rounded-lg border text-xs text-center transition-all active:scale-[0.96] font-mono ${
                            formData.deadline === t
                              ? 'bg-cyan/15 border-cyan text-cyan font-bold shadow-sm'
                              : 'bg-[#0a0d17]/80 border-white/[0.08] hover:border-white/[0.18] text-zinc-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROJECT SPECS */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-2 flex items-center gap-2">
                      <Cpu size={13} className="text-cyan" /> 01 // What workflow or bottleneck are you solving? <span className="text-cyan">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.projectDescription}
                      onChange={(e) => updateField('projectDescription', e.target.value)}
                      placeholder="Outline what manual process consumes your time (e.g., qualifying leads on WhatsApp, syncing orders into Google Sheets, generating PDFs, or deploying an autonomous voice agent)..."
                      className="w-full bg-[#090c15] border border-white/[0.14] hover:border-white/[0.24] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30 rounded-xl p-3 text-xs md:text-sm text-white placeholder-zinc-400 leading-relaxed transition-all resize-none"
                    />
                    <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500 mt-1">
                      <span>Specific goals yield faster architecture plans & quotes.</span>
                      <span className="tabular-nums">{formData.projectDescription.length} chars</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col gap-1 mb-2">
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-200 font-semibold flex items-center gap-2">
                        <Layers size={13} className="text-cyan" /> 02 // Your Current Stack & Tools
                      </label>
                      <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                        Which tools does your business already run on? (CRM, spreadsheets, messaging, payments, or custom apps). We integrate directly into your current setup so you never have to start over or learn a new platform.
                      </p>
                    </div>

                    {/* Quick Tool Tags with Categories — DISPLAYED FIRST */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {QUICK_TOOL_TAGS.map((t) => {
                        const active = formData.currentTools.includes(t.name);
                        const isFresh = t.group === 'New';
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => toggleQuickTool(t.name)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all active:scale-[0.95] flex items-center gap-1.5 ${
                              active
                                ? 'bg-cyan text-black border-cyan font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                                : isFresh
                                ? 'bg-amber/10 border-amber/30 text-amber hover:border-amber/50 hover:bg-amber/20 font-semibold'
                                : 'bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20'
                            }`}
                          >
                            <span>{active ? '✓' : '+'}</span>
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Tool Input with Clear Placeholder */}
                    <input
                      type="text"
                      value={formData.currentTools}
                      onChange={(e) => updateField('currentTools', e.target.value)}
                      placeholder="Selected tools appear here, or type custom ones..."
                      className="w-full bg-[#090c15] border border-white/[0.14] hover:border-white/[0.24] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 transition-all mb-1.5"
                    />

                    <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                      <span className="text-cyan">ℹ</span>
                      <span>Don&apos;t worry if your exact tool isn&apos;t listed or if you&apos;re starting fresh — if it has an API, webhook, or email, we can automate it.</span>
                    </p>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-2 flex items-center gap-2">
                      <Building2 size={13} className="text-cyan" /> 03 // Company or Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe size={13} className="absolute left-3.5 top-3 text-zinc-500" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        placeholder="https://yourcompany.com or brand name"
                        className="w-full bg-[#090c15] border border-white/[0.14] hover:border-white/[0.24] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-400 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CONTACT & DISPATCH */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-1.5 flex items-center gap-2">
                        <User size={12} className="text-cyan" /> Full Name <span className="text-cyan">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="e.g., Sarah Johnson"
                        className="w-full bg-[#080b12] border border-white/[0.1] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-1.5 flex items-center gap-2">
                        <Mail size={12} className="text-cyan" /> Business Email <span className="text-cyan">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="sarah@company.com"
                        className="w-full bg-[#080b12] border border-white/[0.1] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-1.5 flex items-center gap-2">
                        <Phone size={12} className="text-emerald-400" /> Phone / WhatsApp <span className="text-cyan">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+1 415 555 2671 or +91 98765 43210 (include country code)"
                        className="w-full bg-[#090c15] border border-white/[0.14] hover:border-white/[0.24] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-1.5 flex items-center gap-2">
                        <MessageSquare size={12} className="text-cyan" /> Preferred Channel
                      </label>
                      <select
                        value={formData.contactMethod}
                        onChange={(e) => updateField('contactMethod', e.target.value)}
                        className="w-full bg-[#090c15] border border-white/[0.14] hover:border-white/[0.24] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30 rounded-xl px-3.5 py-2.5 text-xs text-white transition-all cursor-pointer"
                      >
                        {CONTACT_METHODS.map((m) => (
                          <option key={m} value={m} className="bg-[#090d16] text-white">{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-1.5 flex items-center gap-2">
                        <Globe size={12} className="text-cyan" /> Time Zone
                      </label>
                      <input
                        type="text"
                        value={formData.timeZone}
                        onChange={(e) => updateField('timeZone', e.target.value)}
                        placeholder="e.g., America/New_York or IST"
                        className="w-full bg-[#090c15] border border-white/[0.14] hover:border-white/[0.24] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-400 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold mb-1.5 flex items-center gap-2">
                        <Compass size={12} className="text-cyan" /> How did you find Primuez?
                      </label>
                      <select
                        value={formData.source}
                        onChange={(e) => updateField('source', e.target.value)}
                        className="w-full bg-[#090c15] border border-white/[0.14] hover:border-white/[0.24] focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/30 rounded-xl px-3.5 py-2.5 text-xs text-white transition-all cursor-pointer"
                      >
                        {SOURCES.map((s) => (
                          <option key={s} value={s} className="bg-[#090d16] text-white">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="pt-2 flex items-start gap-3 px-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsAgreement}
                      onChange={(e) => updateField('termsAgreement', e.target.checked)}
                      className="mt-0.5 accent-cyan w-4 h-4 rounded cursor-pointer shrink-0"
                    />
                    <label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed cursor-pointer select-none">
                      I agree to be contacted regarding this project scope. Information remains confidential and will never be shared.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            {submitError && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Sticky Bottom Actions Bar (Guaranteed visible on all viewports) */}
      {!submitSuccess && (
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.08] bg-[#07090e]/95 backdrop-blur-md flex justify-between items-center z-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl border border-white/[0.08] hover:border-white/[0.18] transition-all active:scale-[0.96]"
            >
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Direct SLA &lt; 24h
            </span>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 text-xs font-bold bg-cyan hover:bg-cyan/90 text-black px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] active:scale-[0.96] ml-auto font-mono"
            >
              Next Step <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="submit"
              form="intake-form"
              disabled={isSubmitting}
              className={`flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl transition-all ml-auto active:scale-[0.96] font-mono ${
                isSubmitting
                  ? 'bg-cyan/30 text-cyan-200 cursor-wait'
                  : 'bg-cyan hover:bg-cyan/90 text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Dispatching...
                </>
              ) : (
                <>
                  <Send size={13} /> Dispatch Inquiry
                </>
              )}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default WorkWithMeForm;
