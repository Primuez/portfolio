'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  CheckCircle2, 
  Workflow, 
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
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';

interface WorkWithMeFormProps {
  onClose?: () => void;
  inline?: boolean;
}

const SERVICES = [
  { id: 'n8n', label: 'n8n Workflow Automation', icon: Workflow, desc: 'Self-healing webhooks, ERP & CRM data pipelines' },
  { id: 'agents', label: 'Autonomous AI Agents & Swarms', icon: Bot, desc: 'Multi-agent reasoning, Claude/Hermes/LangGraph architectures' },
  { id: 'video', label: 'AI Video & Media Generation', icon: Video, desc: 'HyperFrames, Remotion, programmatic UGC & Suno audio' },
  { id: 'voice', label: 'Voice AI & Telephony', icon: Mic, desc: 'Sub-second real-time conversational voice agents' },
  { id: 'api', label: 'Custom API & Infrastructure', icon: Cpu, desc: 'Docker VPS setups, reverse engineering, scrapers & integrations' },
  { id: 'cto', label: 'Fractional AI CTO & Advisory', icon: Sparkles, desc: 'End-to-end technical roadmap & architecture guidance' },
];

const BUDGET_RANGES = [
  { id: 'micro', label: 'Micro-Build (< ₹5k / $60)', desc: 'Small isolated script, quick patch, or simple webhook test' },
  { id: 'pro', label: 'Professional Automation (₹5k – ₹20k / $60 – $250)', desc: 'Complete production workflow, multi-node CRM/Sheets integration' },
  { id: 'premium', label: 'Premium AI Integration (₹20k – ₹50k / $250 – $600)', desc: 'Autonomous multi-agent system, LLM triage, custom database' },
  { id: 'scaling', label: 'Custom Scaling / High-Volume (₹50k+ / $600+)', desc: 'Enterprise architecture, Dockerized VPS fleet, high-throughput' },
  { id: 'retainer', label: 'Monthly Retainer / Fractional CTO (Open)', desc: 'Ongoing development, 24/7 autonomous monitoring & support' },
];

const TIMELINES = [
  '⚡ Urgent / This Week',
  '🗓️ 2 – 4 Weeks',
  '⏳ 1 – 2 Months',
  '🔄 Flexible'
];

const CONTACT_METHODS = ['WhatsApp', 'Telegram', 'Email', 'Discord', 'Other'];
const SOURCES = ['YouTube (@Primuez)', 'LinkedIn', 'X / Twitter', 'GitHub', 'Upwork / Fiverr', 'Direct Referral'];

export function WorkWithMeForm({ onClose, inline = false }: WorkWithMeFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    serviceType: 'n8n Workflow Automation',
    budgetRange: 'Professional Automation (₹5k – ₹20k / $60 – $250)',
    deadline: '🗓️ 2 – 4 Weeks',
    projectDescription: '',
    apiKeys: 'Yes (Kie.ai/Fal.ai/OpenAI/etc.)',
    company: '',
    fullName: '',
    email: '',
    phone: '',
    contactMethod: 'WhatsApp',
    timeZone: 'IST (UTC+5:30)',
    source: 'YouTube (@Primuez)',
    termsAgreement: true,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError(null);
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.serviceType || !formData.budgetRange) {
        setSubmitError('Please select a service and an investment range.');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 15) {
        setSubmitError('Please provide a brief project description (at least 15 characters).');
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
        setSubmitError('Please enter a valid email address.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 7) {
        setSubmitError('Please enter a valid WhatsApp contact number with country code.');
        return false;
      }
      if (!formData.termsAgreement) {
        setSubmitError('Please accept the project terms to proceed.');
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
    setLogs([
      '⚡ [01/03] Encrypting project transmission payload...',
      '📡 [02/03] Beaming alert to Rahul Kasturiya via Telegram Agent API...',
      '✉️ [03/03] Generating priority acknowledgment via ZeptoMail...'
    ]);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Server rejected transmission.');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      // Fallback: If network failed, provide direct mail link notice
      setSubmitError(err.message || 'Transmission failed. Please check your connection or email directly to contact@primuez.in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-[#0a0a0f] border-2 border-cyan/40 rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(0,240,255,0.2)] relative flex flex-col text-white font-mono ${
        inline ? 'my-8 text-left' : 'max-h-[90vh] overflow-hidden'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-[#0f121d] border-b border-cyan/20 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan"></span>
          </span>
          <span className="text-cyan font-bold tracking-wider text-xs md:text-sm flex items-center gap-2">
            <Send size={15} /> DIRECT COMM-LINK // WORK WITH PRIMUEZ
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1.5 text-xs font-bold"
          >
            <X size={16} /> <span className="hidden sm:inline">CLOSE</span>
          </button>
        )}
      </div>

      {/* Step Progress Indicator (when not completed) */}
      {!submitSuccess && (
        <div className="bg-[#08090d] border-b border-white/5 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setStep(1)} 
              className={`flex items-center gap-2 transition-colors ${step === 1 ? 'text-cyan font-bold' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-cyan text-black font-bold' : 'border border-gray-600'}`}>1</span>
              <span>SCOPE</span>
            </button>
            <span className="text-gray-700">/</span>
            <button 
              onClick={() => step > 1 && setStep(2)} 
              disabled={step < 2}
              className={`flex items-center gap-2 transition-colors ${step === 2 ? 'text-cyan font-bold' : (step > 2 ? 'text-gray-300' : 'text-gray-600 cursor-not-allowed')}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-cyan text-black font-bold' : 'border border-gray-600'}`}>2</span>
              <span>SPECS</span>
            </button>
            <span className="text-gray-700">/</span>
            <button 
              onClick={() => step > 2 && setStep(3)} 
              disabled={step < 3}
              className={`flex items-center gap-2 transition-colors ${step === 3 ? 'text-cyan font-bold' : 'text-gray-600 cursor-not-allowed'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-cyan text-black font-bold' : 'border border-gray-600'}`}>3</span>
              <span>CONTACT</span>
            </button>
          </div>
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            STEP 0{step} OF 03
          </span>
        </div>
      )}

      {/* Main Form Body / Success Screen */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-8 px-4 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-cyan/10 border-2 border-cyan flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
              <CheckCircle2 size={36} className="text-cyan animate-pulse" />
            </div>

            <span className="text-xs uppercase tracking-widest text-cyan font-bold px-3 py-1 bg-cyan/10 rounded-full border border-cyan/30 mb-3">
              MISSION RECEIVED // COMM-LINK ACTIVE
            </span>

            <h3 className="text-2xl font-bold font-sans text-white mb-2">
              Transmission Beamed to Telegram
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-sans">
              Thank you, <strong className="text-white">{formData.fullName}</strong>. Your project brief has been logged directly into Rahul Kasturiya&apos;s Telegram console. A detailed confirmation email has also been dispatched to <strong className="text-cyan">{formData.email}</strong>.
            </p>

            <div className="w-full bg-[#0f121d] border border-cyan/20 rounded-xl p-4 text-left text-xs mb-8 space-y-2">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Target Track:</span>
                <span className="text-cyan font-semibold">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Budget Range:</span>
                <span className="text-amber-400 font-semibold">{formData.budgetRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Response SLA:</span>
                <span className="text-emerald-400 font-semibold">Priority &lt; 24 Hours</span>
              </div>
            </div>

            {/* Direct Quick Action CTAs */}
            <div className="w-full flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a
                href="https://cal.com/prime-s/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan/20 to-blue-600/30 hover:from-cyan/30 hover:to-blue-600/40 border border-cyan text-cyan hover:text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              >
                <Calendar size={15} /> 15-Min Quick Intro Call <ExternalLink size={12} />
              </a>
              <a
                href={`https://wa.me/917024637099?text=${encodeURIComponent(`Hi Rahul, I just submitted the project form for ${formData.serviceType}. My name is ${formData.fullName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#122319] hover:bg-[#183424] border border-emerald-500/40 text-emerald-400 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              >
                <MessageSquare size={15} /> Chat on WhatsApp <ExternalLink size={12} />
              </a>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Close this window
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* STEP 1: SERVICE & BUDGET */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-3 flex items-center gap-2">
                      <Workflow size={14} /> 1. Select Requested Architecture / Service <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SERVICES.map((s) => {
                        const Icon = s.icon;
                        const active = formData.serviceType === s.label;
                        return (
                          <div
                            key={s.id}
                            onClick={() => updateField('serviceType', s.label)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              active
                                ? 'bg-cyan/10 border-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)] text-white'
                                : 'bg-[#0f121d] border-white/10 hover:border-cyan/40 text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 mb-1">
                              <Icon size={16} className={active ? 'text-cyan' : 'text-gray-400'} />
                              <span className="text-xs font-bold">{s.label}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-sans pl-6">{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-3 flex items-center gap-2">
                      <DollarSign size={14} /> 2. Target Project Investment Range <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-2">
                      {BUDGET_RANGES.map((b) => {
                        const active = formData.budgetRange === b.label;
                        return (
                          <div
                            key={b.id}
                            onClick={() => updateField('budgetRange', b.label)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                              active
                                ? 'bg-cyan/10 border-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                                : 'bg-[#0f121d] border-white/10 hover:border-white/30 text-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${active ? 'border-cyan' : 'border-gray-500'}`}>
                              {active && <div className="w-2 h-2 rounded-full bg-cyan"></div>}
                            </div>
                            <div>
                              <div className="text-xs font-bold">{b.label}</div>
                              <div className="text-[11px] text-gray-400 font-sans">{b.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2 flex items-center gap-2">
                      <Clock size={14} /> 3. Target Timeline / Urgency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TIMELINES.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => updateField('deadline', t)}
                          className={`py-2 px-3 rounded-lg border text-xs text-center transition-all ${
                            formData.deadline === t
                              ? 'bg-cyan/15 border-cyan text-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                              : 'bg-[#0f121d] border-white/10 hover:border-white/20 text-gray-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROJECT SPECS & DETAILS */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2 flex items-center gap-2">
                      <Cpu size={14} /> 1. Project Brief & Technical Objectives <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={formData.projectDescription}
                      onChange={(e) => updateField('projectDescription', e.target.value)}
                      placeholder="Describe what you want to automate or build (e.g., current bottlenecks, tools like n8n/PostgreSQL/Supabase, required endpoints, business goals, or video script details)..."
                      className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] rounded-xl p-4 text-xs md:text-sm text-white placeholder-gray-500 font-sans leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1">
                      <span>Detailed briefs get prioritized custom quotes.</span>
                      <span>{formData.projectDescription.length} chars</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2">
                        Do you provide required API keys?
                      </label>
                      <div className="space-y-2">
                        {['Yes (Kie.ai/Fal.ai/OpenAI/etc.)', 'No (Need guidance on API pricing)'].map((opt) => (
                          <div
                            key={opt}
                            onClick={() => updateField('apiKeys', opt)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 ${
                              formData.apiKeys === opt
                                ? 'bg-cyan/15 border-cyan text-white'
                                : 'bg-[#0f121d] border-white/10 text-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="apiKeys"
                              checked={formData.apiKeys === opt}
                              onChange={() => {}}
                              className="accent-cyan"
                            />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2">
                        Company or Project Website (Optional)
                      </label>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => updateField('company', e.target.value)}
                          placeholder="https://yourcompany.com or business name"
                          className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DIRECT COMM-LINK */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2 flex items-center gap-2">
                        <User size={13} /> Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2 flex items-center gap-2">
                        <Mail size={13} /> Email Address (For Welcome Brief) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2 flex items-center gap-2">
                        <Phone size={13} /> WhatsApp Phone (With Country Code) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+91 98765 43210 or +1 415 555 2671"
                        className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2 flex items-center gap-2">
                        <MessageSquare size={13} /> Preferred Contact Channel
                      </label>
                      <select
                        value={formData.contactMethod}
                        onChange={(e) => updateField('contactMethod', e.target.value)}
                        className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                      >
                        {CONTACT_METHODS.map((m) => (
                          <option key={m} value={m} className="bg-[#0f121d] text-white">{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2 flex items-center gap-2">
                        <Globe size={13} /> Time Zone
                      </label>
                      <input
                        type="text"
                        value={formData.timeZone}
                        onChange={(e) => updateField('timeZone', e.target.value)}
                        placeholder="IST / EST / PST / GMT"
                        className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cyan font-bold mb-2">
                        How did you find @Primuez?
                      </label>
                      <select
                        value={formData.source}
                        onChange={(e) => updateField('source', e.target.value)}
                        className="w-full bg-[#0f121d] border border-white/15 focus:border-cyan focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                      >
                        {SOURCES.map((s) => (
                          <option key={s} value={s} className="bg-[#0f121d] text-white">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="bg-[#08090d] border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsAgreement}
                      onChange={(e) => updateField('termsAgreement', e.target.checked)}
                      className="mt-0.5 accent-cyan w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-[11px] text-gray-300 font-sans leading-relaxed cursor-pointer select-none">
                      I agree to @Primuez Terms: Minimum ₹5k / $60 projects only. Custom architectures remain @Primuez IP. Direct Telegram alert and welcome brief will be dispatched upon sending.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            {submitError && (
              <div className="mt-4 p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Terminal Logs During Submit */}
            {isSubmitting && (
              <div className="mt-4 p-3 bg-black/60 border border-cyan/30 rounded-xl font-mono text-[11px] text-cyan space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <span className="text-[11px] text-gray-500 font-sans">
                  Direct pipeline to Rahul Kasturiya
                </span>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 text-xs font-bold bg-cyan/15 hover:bg-cyan/25 border border-cyan/60 text-cyan px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] ml-auto"
                >
                  Next Step <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 text-xs font-bold px-6 py-3 rounded-xl transition-all ml-auto ${
                    isSubmitting
                      ? 'bg-cyan/20 text-cyan/60 border border-cyan/30 cursor-wait'
                      : 'bg-cyan text-black hover:bg-white hover:text-black border border-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      Dispatching Comm-Link...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send Project Transmission
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default WorkWithMeForm;
