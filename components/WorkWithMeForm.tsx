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
  Building2
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
    desc: 'Connect tools like Google Sheets, CRM, WhatsApp, Stripe & Email to eliminate repetitive manual work' 
  },
  { 
    id: 'agents', 
    label: 'Custom AI Agents & Copilots', 
    icon: Bot, 
    desc: 'Autonomous AI assistants for 24/7 lead qualification, customer inquiries, and smart document processing' 
  },
  { 
    id: 'voice', 
    label: 'AI Voice & Phone Call Agents', 
    icon: Mic, 
    desc: 'Conversational voice assistants that answer incoming calls, qualify prospects, and schedule meetings' 
  },
  { 
    id: 'video', 
    label: 'Content & Media Automation', 
    icon: Video, 
    desc: 'Automated video generation, branded graphics, and multi-channel creative publishing workflows' 
  },
  { 
    id: 'integration', 
    label: 'Custom Software & API Integration', 
    icon: Layers, 
    desc: 'Seamlessly link your internal databases, customer portals, payment systems, and custom APIs' 
  },
  { 
    id: 'consulting', 
    label: 'Strategic AI Consulting & Advisory', 
    icon: Sparkles, 
    desc: '1-on-1 workflow audit to design your technical architecture and uncover high-ROI automation opportunities' 
  },
];

const BUDGET_RANGES = [
  { 
    id: 'starter', 
    label: 'Starter Project ($250 – $600 / ₹20k – ₹50k)', 
    desc: 'Single focused workflow, basic CRM/Sheets sync, or proof-of-concept AI bot' 
  },
  { 
    id: 'growth', 
    label: 'Growth System ($600 – $1,500 / ₹50k – ₹1.2L)', 
    desc: 'Multi-step automated pipeline, webhook error handling, database sync, and multi-tool routing' 
  },
  { 
    id: 'enterprise', 
    label: 'Full Enterprise Solution ($1,500+ / ₹1.2L+)', 
    desc: 'End-to-end multi-agent system, custom user portal, high-volume data handling, and private deployment' 
  },
  { 
    id: 'retainer', 
    label: 'Monthly Fractional Partner (Custom Retainer)', 
    desc: 'Ongoing engineering sprints, dedicated roadmap, 24/7 autonomous monitoring, and priority turnaround' 
  },
];

const TIMELINES = [
  '⚡ Urgent (1 – 2 Weeks)',
  '🗓️ Standard (2 – 4 Weeks)',
  '⏳ Next Quarter (1 – 2 Months)',
  '🔄 Flexible / Planning Phase'
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
    budgetRange: 'Growth System ($600 – $1,500 / ₹50k – ₹1.2L)',
    deadline: '🗓️ Standard (2 – 4 Weeks)',
    projectDescription: '',
    currentTools: '',
    company: '',
    fullName: '',
    email: '',
    phone: '',
    contactMethod: 'WhatsApp (Fastest response)',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'IST (UTC+5:30)',
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
        setSubmitError('Please select what you would like to build and an estimated investment tier.');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 15) {
        setSubmitError('Please provide a brief overview of your project (at least 15 characters).');
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
        setSubmitError('Please enter a valid WhatsApp or phone number with country code.');
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-[#0a0e1a]/95 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl backdrop-blur-xl relative flex flex-col text-slate-100 font-sans ${
        inline ? 'my-8 text-left' : 'max-h-[92vh] overflow-hidden'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-[#0f172a]/90 border-b border-white/10 px-6 py-5 flex justify-between items-center z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Direct Founder Pipeline
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Let&apos;s Build Your AI Automation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Share your project requirements below. You will receive a custom proposal & estimate within 24 hours.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5 flex items-center justify-center shrink-0 active:scale-[0.96]"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Step Progress Bar */}
      {!submitSuccess && (
        <div className="bg-[#0b1120] border-b border-white/5 px-6 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              type="button"
              onClick={() => setStep(1)} 
              className={`flex items-center gap-2 transition-all ${
                step === 1 ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step > 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : (step === 1 ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700')
              }`}>
                {step > 1 ? <Check size={11} /> : '1'}
              </span>
              <span className="text-xs">Goals & Budget</span>
            </button>

            <span className="text-slate-700">/</span>

            <button 
              type="button"
              onClick={() => step > 1 && setStep(2)} 
              disabled={step < 2}
              className={`flex items-center gap-2 transition-all ${
                step === 2 ? 'text-cyan-400 font-semibold' : (step > 2 ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 cursor-not-allowed')
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step > 2 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : (step === 2 ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700')
              }`}>
                {step > 2 ? <Check size={11} /> : '2'}
              </span>
              <span className="text-xs">Project Details</span>
            </button>

            <span className="text-slate-700">/</span>

            <button 
              type="button"
              onClick={() => step > 2 && setStep(3)} 
              disabled={step < 3}
              className={`flex items-center gap-2 transition-all ${
                step === 3 ? 'text-cyan-400 font-semibold' : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 3 ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'
              }`}>
                3
              </span>
              <span className="text-xs">Contact</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-medium tabular-nums hidden sm:inline">
            Step {step} of 3
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-8 px-4 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={34} className="text-emerald-400" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-3">
              Inquiry Confirmed
            </span>

            <h3 className="text-2xl font-bold text-white mb-2">
              Thank You, {formData.fullName}!
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Your project inquiry has been delivered directly to Rahul Kasturiya. We have also sent a confirmation to <strong className="text-cyan-300">{formData.email}</strong>. You can expect a response within 24 hours.
            </p>

            {/* Inquiry Summary Box */}
            <div className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-left text-xs mb-8 space-y-2.5">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400">Requested Area:</span>
                <span className="text-cyan-300 font-semibold">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400">Target Investment:</span>
                <span className="text-amber-300 font-semibold">{formData.budgetRange}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Turnaround Guarantee:</span>
                <span className="text-emerald-400 font-semibold">Priority &lt; 24 Hours</span>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="w-full flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a
                href="https://cal.com/prime-s/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-md active:scale-[0.96]"
              >
                <Calendar size={15} /> Book a 15-Min Intro Call <ExternalLink size={12} />
              </a>
              <a
                href={`https://wa.me/917024637099?text=${encodeURIComponent(`Hi Rahul, I just submitted the project inquiry for "${formData.serviceType}". My name is ${formData.fullName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold px-5 py-3 rounded-xl text-xs transition-all active:scale-[0.96]"
              >
                <MessageSquare size={15} /> Chat on WhatsApp <ExternalLink size={12} />
              </a>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                Close this window
              </button>
            )}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* STEP 1: SERVICE & BUDGET */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-3 flex items-center gap-2">
                      <Zap size={14} className="text-cyan-400" /> 1. What area would you like to streamline? <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SERVICES.map((s) => {
                        const Icon = s.icon;
                        const active = formData.serviceType === s.label;
                        return (
                          <div
                            key={s.id}
                            onClick={() => updateField('serviceType', s.label)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
                              active
                                ? 'bg-cyan-500/10 border-cyan-400/80 shadow-md shadow-cyan-500/10 text-white'
                                : 'bg-[#0f172a]/70 border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className={`p-1.5 rounded-lg ${active ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-400'}`}>
                                <Icon size={16} />
                              </div>
                              <span className="text-xs font-bold text-white">{s.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed pl-8">{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-3 flex items-center gap-2">
                      <DollarSign size={14} className="text-emerald-400" /> 2. Estimated Investment Tier <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-2.5">
                      {BUDGET_RANGES.map((b) => {
                        const active = formData.budgetRange === b.label;
                        return (
                          <div
                            key={b.id}
                            onClick={() => updateField('budgetRange', b.label)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 active:scale-[0.99] ${
                              active
                                ? 'bg-emerald-500/10 border-emerald-400/80 text-white shadow-md shadow-emerald-500/10'
                                : 'bg-[#0f172a]/70 border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-slate-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${active ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'}`}>
                              {active && <Check size={10} className="text-slate-950 font-bold" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{b.label}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{b.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2.5 flex items-center gap-2">
                      <Clock size={14} className="text-amber-400" /> 3. Target Launch Timeline
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TIMELINES.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => updateField('deadline', t)}
                          className={`py-2.5 px-3 rounded-lg border text-xs text-center transition-all active:scale-[0.96] ${
                            formData.deadline === t
                              ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold shadow-sm'
                              : 'bg-[#0f172a]/70 border-white/10 hover:border-white/20 text-slate-300'
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
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                      <Cpu size={14} className="text-cyan-400" /> 1. What challenge or process are you looking to automate? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={formData.projectDescription}
                      onChange={(e) => updateField('projectDescription', e.target.value)}
                      placeholder="Describe what your business does and where you are spending manual time (e.g., qualifying leads on WhatsApp, copying orders into Google Sheets, sending email reminders, generating documents, or building a 24/7 AI customer assistant)..."
                      className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl p-4 text-xs md:text-sm text-white placeholder-slate-500 leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                      <span>A clear summary helps us prepare an accurate roadmap & quote.</span>
                      <span className="tabular-nums">{formData.projectDescription.length} characters</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <Layers size={14} className="text-cyan-400" /> What tools does your business currently use?
                      </label>
                      <input
                        type="text"
                        value={formData.currentTools}
                        onChange={(e) => updateField('currentTools', e.target.value)}
                        placeholder="e.g., WhatsApp, Google Sheets, Shopify, HubSpot, Notion, none yet"
                        className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <Building2 size={14} className="text-cyan-400" /> Company or Website (Optional)
                      </label>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => updateField('company', e.target.value)}
                          placeholder="https://yourcompany.com or brand name"
                          className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CONTACT INFORMATION */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <User size={13} className="text-cyan-400" /> Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="e.g., Sarah Johnson"
                        className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <Mail size={13} className="text-cyan-400" /> Business Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="sarah@yourcompany.com"
                        className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <Phone size={13} className="text-emerald-400" /> WhatsApp / Phone (With Country Code) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+91 98765 43210 or +1 415 555 2671"
                        className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <MessageSquare size={13} className="text-cyan-400" /> Preferred Way to Connect
                      </label>
                      <select
                        value={formData.contactMethod}
                        onChange={(e) => updateField('contactMethod', e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs text-white"
                      >
                        {CONTACT_METHODS.map((m) => (
                          <option key={m} value={m} className="bg-[#0f172a] text-white">{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
                        <Globe size={13} className="text-cyan-400" /> Your Time Zone
                      </label>
                      <input
                        type="text"
                        value={formData.timeZone}
                        onChange={(e) => updateField('timeZone', e.target.value)}
                        placeholder="IST / EST / PST / GMT"
                        className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2">
                        How did you find @Primuez?
                      </label>
                      <select
                        value={formData.source}
                        onChange={(e) => updateField('source', e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs text-white"
                      >
                        {SOURCES.map((s) => (
                          <option key={s} value={s} className="bg-[#0f172a] text-white">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Privacy & Confirmation Checkbox */}
                  <div className="bg-[#0f172a]/70 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsAgreement}
                      onChange={(e) => updateField('termsAgreement', e.target.checked)}
                      className="mt-0.5 accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                      I agree to be contacted regarding this project inquiry. Your information is confidential and will never be shared with third parties.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            {submitError && (
              <div className="mt-4 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Navigation & Submit Controls */}
            <div className="mt-8 pt-5 border-t border-white/10 flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all active:scale-[0.96]"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Guaranteed response within 24 hours
                </span>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-[0.96] ml-auto"
                >
                  Next Step <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 text-xs font-bold px-6 py-3 rounded-xl transition-all ml-auto active:scale-[0.96] ${
                    isSubmitting
                      ? 'bg-cyan-500/30 text-cyan-200 cursor-wait'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      Submitting Your Inquiry...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send Project Inquiry
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
