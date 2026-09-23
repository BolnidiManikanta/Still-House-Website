"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Plus,
  Minus,
  Sparkles,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { PHOTOGRAPHY_CATEGORIES, CONTACT_ADDONS } from '@/lib/contact-reviews/initialData';
import { ContactFormData, ShootCategory } from '@/lib/contact-reviews/types';
import confetti from 'canvas-confetti';

interface ContactFormProps {
  onOpenRatingModal: () => void;
  categoryOverride?: ShootCategory;
  onCategoryChange?: (category: ShootCategory) => void;
  onPriceChange?: (priceInr: number) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onOpenRatingModal,
  categoryOverride,
  onCategoryChange,
  onPriceChange,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    category: categoryOverride || 'portrait',
    shootDate: '',
    timePreference: 'golden_hour',
    locationType: 'studio',
    locationDetails: '',
    durationHours: 2,
    addons: ['rush_delivery'],
    visionNotes: '',
    inspirationLink: '',
  });

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent?: number;
    flatDiscount?: number;
    label: string;
  } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [showLedgerDetails, setShowLedgerDetails] = useState(true);

  // Sync category override
  useEffect(() => {
    if (categoryOverride && categoryOverride !== formData.category) {
      setFormData((prev) => ({ ...prev, category: categoryOverride }));
    }
  }, [categoryOverride]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<{
    id: string;
    dateSubmitted: string;
    summary: ContactFormData;
    estimatedCost: number;
    discountAmount: number;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategoryObj = useMemo(() => {
    return (
      PHOTOGRAPHY_CATEGORIES.find((c) => c.id === formData.category) ||
      PHOTOGRAPHY_CATEGORIES[0]
    );
  }, [formData.category]);

  const EXTRA_HOUR_RATE_INR = 3500;

  const subtotalCost = useMemo(() => {
    const base = selectedCategoryObj.basePrice;
    const extraHoursCost =
      formData.durationHours > 1
        ? (formData.durationHours - 1) * EXTRA_HOUR_RATE_INR
        : 0;
    const addonsCost = formData.addons.reduce((acc, addonId) => {
      const found = CONTACT_ADDONS.find((a) => a.id === addonId);
      return acc + (found ? found.price : 0);
    }, 0);

    return base + extraHoursCost + addonsCost;
  }, [selectedCategoryObj, formData.durationHours, formData.addons]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountPercent) {
      return Math.round((subtotalCost * appliedPromo.discountPercent) / 100);
    }
    if (appliedPromo.flatDiscount) {
      return Math.min(subtotalCost, appliedPromo.flatDiscount);
    }
    return 0;
  }, [subtotalCost, appliedPromo]);

  const estimatedCost = useMemo(() => {
    return Math.max(0, subtotalCost - discountAmount);
  }, [subtotalCost, discountAmount]);

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(estimatedCost);
    }
  }, [estimatedCost, onPriceChange]);

  const estimatedDeliverables = useMemo(() => {
    return Math.round(formData.durationHours * 22 + 15);
  }, [formData.durationHours]);

  const toggleAddon = (addonId: string) => {
    setFormData((prev) => {
      const exists = prev.addons.includes(addonId);
      return {
        ...prev,
        addons: exists
          ? prev.addons.filter((id) => id !== addonId)
          : [...prev.addons, addonId],
      };
    });
  };

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    setPromoError('');
    if (!code) {
      setPromoError('Enter voucher code');
      return;
    }
    if (code === 'STUDIO10' || code === 'WELCOME10') {
      setAppliedPromo({
        code,
        discountPercent: 10,
        label: '10% Studio Privilege',
      });
    } else if (code === 'APEX3000' || code === 'EARLYBIRD') {
      setAppliedPromo({
        code,
        flatDiscount: 3000,
        label: '₹3,000 Early Booking Credit',
      });
    } else {
      setPromoError('Invalid code. Try STUDIO10 or APEX3000');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  const handleCopyQuoteText = () => {
    const summaryText = `APEX LIGHT PHOTOGRAPHY STUDIO QUOTE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPackage: ${selectedCategoryObj.name}\nBase Rate: ₹${selectedCategoryObj.basePrice.toLocaleString('en-IN')}\nDuration: ${formData.durationHours} Hours (~${estimatedDeliverables} hand-graded deliverables)\nLocation: ${(formData.locationType || 'studio').toUpperCase()}\nEstimated Investment: ₹${estimatedCost.toLocaleString('en-IN')}\nStudio: inquiries@apexlightphoto.com | +91 98230 45678`;
    navigator.clipboard.writeText(summaryText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2200);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number required';
    }
    if (!formData.shootDate) {
      newErrors.shootDate = 'Please specify a preferred date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const inquiryId = `APX-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedInquiry({
        id: inquiryId,
        dateSubmitted: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        summary: { ...formData },
        estimatedCost,
        discountAmount,
      });

      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#151515', '#666666', '#B8B8B3', '#DCDCD8'],
      });
    }, 500);
  };

  const handleResetForm = () => {
    setSubmittedInquiry(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      category: 'portrait',
      shootDate: '',
      timePreference: 'golden_hour',
      locationType: 'studio',
      locationDetails: '',
      durationHours: 2,
      addons: ['rush_delivery'],
      visionNotes: '',
      inspirationLink: '',
    });
    setErrors({});
  };

  return (
    <div id="hero-section" className="pt-12 sm:pt-20 pb-20">
      {/* ========================================================================= */}
      {/* SECTION 01 — MINIMAL HERO                                                 */}
      {/* ========================================================================= */}
      <section className="mb-24 sm:mb-32">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A8A86]">
            CONTACT / 01
          </span>
          <div className="w-12 h-px bg-[#DCDCD8]" />
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#666666]">
            Studio Atelier & Commissions
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-[#151515] leading-[0.92] tracking-[-0.02em] uppercase max-w-5xl mb-10">
          LET&apos;S
          <br />
          CREATE
          <br />
          SOMETHING
          <br />
          MEANINGFUL.
        </h1>

        {/* Large whitespace & supporting text */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-[#DCDCD8]">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-[#666666] text-base sm:text-lg leading-relaxed font-light">
              We specialize in timeless character portraits, cinematic weddings,
              and fine art editorial campaigns. Guided by natural illumination,
              medium-format optics, and deliberate composition.
            </p>
          </div>

          <div className="md:col-span-6 lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-start md:justify-end gap-6 text-xs tracking-[0.15em] uppercase">
            <a
              href="#contact-section"
              className="group inline-flex items-center gap-2 text-[#151515] font-medium transition-all"
            >
              <span>Scroll to Inquiry Form</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <button
              type="button"
              onClick={onOpenRatingModal}
              className="group inline-flex items-center gap-2 text-[#666666] hover:text-[#151515] transition-colors cursor-pointer"
            >
              <span className="text-[#8A8A86]">★ 4.9</span>
              <span>Rate Photography</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 & 03 — EDITORIAL CONTACT INFO & FORM                           */}
      {/* ========================================================================= */}
      <section id="contact-section" className="scroll-mt-24">
        {submittedInquiry ? (
          /* Editorial Confirmation Ticket */
          <div className="max-w-2xl mx-auto py-16 px-8 sm:px-12 bg-[#FFFFFF] border border-[#DCDCD8] text-[#151515] transition-all">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A8A86] block mb-3">
              COMMISSION INQUIRY #{submittedInquiry.id}
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-[#151515] mb-4">
              Inquiry Received.
            </h2>
            <p className="text-[#666666] text-base leading-relaxed mb-8 font-light">
              Thank you, {submittedInquiry.summary.fullName}. Your creative commission
              brief has been transferred to our lead photographer for the{' '}
              <span className="text-[#151515] font-medium">{selectedCategoryObj.name}</span>{' '}
              session. We will review date availability and respond within four hours.
            </p>

            <div className="border-t border-b border-[#DCDCD8] py-6 space-y-3 text-xs tracking-wide">
              <div className="flex justify-between items-baseline">
                <span className="text-[#666666] uppercase text-[11px]">Requested Date</span>
                <span className="font-mono text-[#151515]">{submittedInquiry.summary.shootDate}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[#666666] uppercase text-[11px]">Session Duration</span>
                <span className="text-[#151515]">
                  {submittedInquiry.summary.durationHours} Hours (~{estimatedDeliverables} edited master proofs)
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[#666666] uppercase text-[11px]">Estimated Investment</span>
                <span className="font-mono text-base font-semibold text-[#151515]">
                  ₹{submittedInquiry.estimatedCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-3 border border-[#DCDCD8] hover:border-[#151515] text-xs uppercase tracking-[0.16em] text-[#151515] transition-colors cursor-pointer"
              >
                Submit Another Inquiry
              </button>
              <button
                type="button"
                onClick={onOpenRatingModal}
                className="w-full sm:w-auto px-6 py-3 bg-[#151515] hover:bg-[#2a2a2a] text-xs uppercase tracking-[0.16em] text-[#F7F7F5] transition-colors cursor-pointer"
              >
                Rate Our Studio Experience
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: Clean Editorial Contact Information              */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-10">
              <div>
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A8A86] block mb-2">
                  INFORMATION
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#151515] uppercase tracking-wide">
                  GET IN TOUCH
                </h2>
              </div>

              {/* Group 1: Electronic Mail */}
              <div className="group border-b border-[#DCDCD8] pb-6 transition-all">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8A8A86] block mb-2">
                  Email
                </span>
                <a
                  href="mailto:hello@apexlightphoto.com"
                  className="text-base sm:text-lg text-[#151515] group-hover:text-[#666666] font-light transition-all flex items-center justify-between"
                >
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                    hello@apexlightphoto.com
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </a>
                <a
                  href="mailto:inquiries@apexlightphoto.com"
                  className="text-xs text-[#666666] hover:text-[#151515] mt-1 block transition-colors"
                >
                  inquiries@apexlightphoto.com (Client Commissions)
                </a>
              </div>

              {/* Group 2: Telephone Line */}
              <div className="group border-b border-[#DCDCD8] pb-6 transition-all">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8A8A86] block mb-2">
                  Phone & Desk
                </span>
                <a
                  href="tel:+919823045678"
                  className="text-base sm:text-lg text-[#151515] group-hover:text-[#666666] font-light transition-all flex items-center justify-between font-mono"
                >
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                    +91 98230 45678
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </a>
                <p className="text-xs text-[#666666] mt-1 font-mono">
                  +91 (020) 2567-9100 (Atelier Switchboard)
                </p>
              </div>

              {/* Group 3: Location */}
              <div className="group border-b border-[#DCDCD8] pb-6 transition-all">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8A8A86] block mb-2">
                  Location
                </span>
                <p className="text-base sm:text-lg text-[#151515] font-light group-hover:translate-x-1.5 transition-transform duration-300">
                  Pune, Maharashtra, India
                </p>
                <p className="text-xs text-[#666666] mt-1">
                  Atelier Suite 4B, Koregaon Park North • Available for global travel
                </p>
              </div>

              {/* Group 4: Schedule / Calendar */}
              <div className="group border-b border-[#DCDCD8] pb-6 transition-all">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8A8A86] block mb-2">
                  Studio Schedule
                </span>
                <p className="text-sm text-[#151515] font-light">
                  Monday — Saturday : 08:30 — 19:30 IST
                </p>
                <p className="text-xs text-[#666666] mt-1">
                  Currently scheduling commissions for Q4 2026 & 2027
                </p>
              </div>

              {/* Group 5: Social Channels */}
              <div className="border-b border-[#DCDCD8] pb-6">
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#8A8A86] block mb-3">
                  Social Archive
                </span>
                <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.16em]">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#666666] hover:text-[#151515] transition-colors relative group py-1"
                  >
                    <span>Instagram</span>
                    <span className="absolute bottom-0 left-0 w-full h-px bg-[#151515] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#666666] hover:text-[#151515] transition-colors relative group py-1"
                  >
                    <span>LinkedIn</span>
                    <span className="absolute bottom-0 left-0 w-full h-px bg-[#151515] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </a>
                  <a
                    href="https://behance.net"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#666666] hover:text-[#151515] transition-colors relative group py-1"
                  >
                    <span>Behance</span>
                    <span className="absolute bottom-0 left-0 w-full h-px bg-[#151515] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: Minimal Editorial Form & Quotation Ledger       */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A8A86] block mb-2">
                  INQUIRY
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#151515] uppercase tracking-wide">
                  COMMISSION BRIEF
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Field 1: Name */}
                <div className="relative">
                  <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] mb-1">
                    Your Name *
                  </label>
                  <input
                    id="input-full-name"
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    className={`w-full bg-transparent border-0 border-b ${
                      errors.fullName ? 'border-[#B8B8B3] text-[#151515]' : 'border-[#DCDCD8]'
                    } focus:border-[#151515] py-3 text-base text-[#151515] placeholder-[#B8B8B3] focus:outline-none transition-colors duration-300 font-light`}
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-[#666666] font-mono mt-1 block">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Field 2 & 3: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      placeholder="elena@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full bg-transparent border-0 border-b ${
                        errors.email ? 'border-[#B8B8B3]' : 'border-[#DCDCD8]'
                      } focus:border-[#151515] py-3 text-base text-[#151515] placeholder-[#B8B8B3] focus:outline-none transition-colors duration-300 font-light`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-[#666666] font-mono mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="input-phone"
                      type="tel"
                      placeholder="+91 98230 45678"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, phone: e.target.value }));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full bg-transparent border-0 border-b ${
                        errors.phone ? 'border-[#B8B8B3]' : 'border-[#DCDCD8]'
                      } focus:border-[#151515] py-3 text-base text-[#151515] placeholder-[#B8B8B3] focus:outline-none transition-colors duration-300 font-light`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-[#666666] font-mono mt-1 block">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Field 4: Photography Genre / Category */}
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666]">
                      Photography Focus
                    </label>
                    <span className="text-[11px] font-mono text-[#8A8A86]">
                      Base Rates in INR (₹)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {PHOTOGRAPHY_CATEGORIES.map((cat) => {
                      const isSelected = formData.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          id={`category-select-${cat.id}`}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, category: cat.id }));
                            if (onCategoryChange) {
                              onCategoryChange(cat.id);
                            }
                          }}
                          className={`p-3 text-left border transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'border-[#151515] bg-[#151515] text-[#F7F7F5]'
                              : 'border-[#DCDCD8] bg-[#FFFFFF] text-[#151515] hover:border-[#151515]'
                          }`}
                        >
                          <div className="text-xs tracking-wide font-medium truncate">
                            {cat.name}
                          </div>
                          <div
                            className={`text-[11px] font-mono mt-1 ${
                              isSelected ? 'text-[#B8B8B3]' : 'text-[#666666]'
                            }`}
                          >
                            ₹{cat.basePrice.toLocaleString('en-IN')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 5: Desired Date & Location Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] mb-1">
                      Preferred Shoot Date *
                    </label>
                    <input
                      id="input-shoot-date"
                      type="date"
                      value={formData.shootDate}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, shootDate: e.target.value }));
                        if (errors.shootDate) setErrors((prev) => ({ ...prev, shootDate: '' }));
                      }}
                      className={`w-full bg-transparent border-0 border-b ${
                        errors.shootDate ? 'border-[#B8B8B3]' : 'border-[#DCDCD8]'
                      } focus:border-[#151515] py-3 text-base text-[#151515] focus:outline-none transition-colors duration-300 font-light`}
                    />
                    {errors.shootDate && (
                      <span className="text-[11px] text-[#666666] font-mono mt-1 block">
                        {errors.shootDate}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] mb-1">
                      Setting / Atmosphere
                    </label>
                    <select
                      id="select-lighting"
                      value={formData.timePreference}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          timePreference: e.target.value as any,
                        }))
                      }
                      className="w-full bg-transparent border-0 border-b border-[#DCDCD8] focus:border-[#151515] py-3 text-sm text-[#151515] focus:outline-none transition-colors duration-300 font-light"
                    >
                      <option value="golden_hour">Golden Hour (Natural Ambient Sunlight)</option>
                      <option value="morning">Morning Daylight (Crisp Diffused Clean)</option>
                      <option value="afternoon">Studio Strobes & Modifiers (Controlled High-End)</option>
                      <option value="full_day">Continuous Documentary (Full-Day Coverage)</option>
                    </select>
                  </div>
                </div>

                {/* Field 6: Message / Creative Notes */}
                <div>
                  <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] mb-1">
                    Project Vision & Creative Details
                  </label>
                  <textarea
                    id="textarea-vision"
                    rows={3}
                    placeholder="Tell us about the mood, styling ideas, preferred location, or special deliverable requirements..."
                    value={formData.visionNotes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, visionNotes: e.target.value }))
                    }
                    className="w-full bg-transparent border-0 border-b border-[#DCDCD8] focus:border-[#151515] py-3 text-base text-[#151515] placeholder-[#B8B8B3] focus:outline-none transition-colors duration-300 font-light resize-none"
                  />
                </div>

                {/* Field 7: Moodboard Link (Optional) */}
                <div>
                  <label className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#666666] mb-1">
                    Moodboard / Inspiration URL (Optional)
                  </label>
                  <input
                    id="input-inspiration"
                    type="url"
                    placeholder="https://pinterest.com/... or https://are.na/..."
                    value={formData.inspirationLink}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, inspirationLink: e.target.value }))
                    }
                    className="w-full bg-transparent border-0 border-b border-[#DCDCD8] focus:border-[#151515] py-3 text-sm text-[#151515] placeholder-[#B8B8B3] focus:outline-none transition-colors duration-300 font-light"
                  />
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Minimal Architectural Session Ledger (Pricing & Duration)     */}
                {/* ------------------------------------------------------------- */}
                <div className="pt-6 border-t border-[#DCDCD8]">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => setShowLedgerDetails(!showLedgerDetails)}
                      className="text-xs uppercase tracking-[0.18em] text-[#151515] font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <span>Session Duration & Production Options</span>
                      <span className="text-[10px] text-[#8A8A86]">
                        {showLedgerDetails ? '— Hide' : '+ View'}
                      </span>
                    </button>
                    <span className="text-xs font-mono text-[#151515]">
                      {formData.durationHours} hr session
                    </span>
                  </div>

                  {showLedgerDetails && (
                    <div className="space-y-6 pt-2 pb-4 text-xs text-[#666666]">
                      {/* Duration slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] uppercase tracking-wider text-[#666666]">
                            Estimated Duration
                          </span>
                          <span className="font-mono text-[#151515]">
                            ~{estimatedDeliverables} Hand-Retouched Master Deliverables
                          </span>
                        </div>
                        <input
                          id="slider-duration"
                          type="range"
                          min="1"
                          max="8"
                          step="1"
                          value={formData.durationHours}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              durationHours: parseInt(e.target.value, 10),
                            }))
                          }
                          className="w-full accent-[#151515] cursor-pointer h-1 bg-[#DCDCD8]"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-[#8A8A86] mt-1">
                          <span>1 hr (Base)</span>
                          <span>2 hrs</span>
                          <span>4 hrs (Half-Day)</span>
                          <span>8 hrs (Full-Day)</span>
                        </div>
                      </div>

                      {/* Addons line list */}
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#666666] block mb-2">
                          Optional Production Upgrades
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {CONTACT_ADDONS.map((addon) => {
                            const isChecked = formData.addons.includes(addon.id);
                            return (
                              <button
                                key={addon.id}
                                type="button"
                                onClick={() => toggleAddon(addon.id)}
                                className={`p-2.5 text-left border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                  isChecked
                                    ? 'border-[#151515] bg-[#FFFFFF] text-[#151515]'
                                    : 'border-[#DCDCD8] bg-transparent text-[#666666] hover:border-[#B8B8B3]'
                                }`}
                              >
                                <span className="truncate pr-2">{addon.name}</span>
                                <span className="font-mono text-[11px] whitespace-nowrap">
                                  +₹{addon.price.toLocaleString('en-IN')}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Promo Code Input */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Promo / Voucher Code"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="border border-[#DCDCD8] focus:border-[#151515] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#151515] uppercase font-mono focus:outline-none"
                        />
                        {appliedPromo ? (
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="px-3 py-1.5 border border-[#DCDCD8] text-xs uppercase tracking-wider text-[#666666] hover:text-[#151515] cursor-pointer"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="px-4 py-1.5 bg-[#151515] text-[#F7F7F5] text-xs uppercase tracking-wider hover:bg-[#2a2a2a] cursor-pointer"
                          >
                            Apply
                          </button>
                        )}
                        {appliedPromo && (
                          <span className="text-[11px] text-[#151515] font-mono">
                            {appliedPromo.label} (-₹{discountAmount.toLocaleString('en-IN')})
                          </span>
                        )}
                      </div>
                      {promoError && (
                        <p className="text-[11px] text-[#666666] font-mono">{promoError}</p>
                      )}
                    </div>
                  )}

                  {/* Dynamic Investment Total */}
                  <div className="pt-4 border-t border-[#DCDCD8] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8A8A86] block">
                        Estimated Total Investment
                      </span>
                      <span className="text-xs text-[#666666]">
                        Includes high-resolution color grading and digital archival license
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <button
                        type="button"
                        onClick={handleCopyQuoteText}
                        className="text-[11px] font-mono text-[#8A8A86] hover:text-[#151515] underline transition-colors cursor-pointer"
                      >
                        {copiedQuote ? 'Copied' : 'Copy Quote'}
                      </button>
                      <span className="font-editorial text-3xl sm:text-4xl text-[#151515] font-semibold">
                        ₹{estimatedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    id="submit-contact-form"
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex items-center justify-between w-full sm:w-auto min-w-[240px] px-8 py-4 bg-[#151515] text-[#F7F7F5] hover:bg-[#2a2a2a] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <span>
                      {isSubmitting ? 'TRANSMITTING...' : 'SEND INQUIRY'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                  <p className="text-[11px] text-[#8A8A86] mt-3">
                    No initial deposit required to submit an inquiry. We confirm dates prior to booking.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
