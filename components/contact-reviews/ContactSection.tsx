"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { PHOTOGRAPHY_CATEGORIES, CONTACT_ADDONS } from '@/lib/contact-reviews/initialData';
import { ContactFormData, ShootCategory } from '@/lib/contact-reviews/types';
import confetti from 'canvas-confetti';
import { useSiteConfig } from "@/lib/admin/siteConfigStore";

interface ContactSectionProps {
  onOpenRatingModal: () => void;
  categoryOverride?: ShootCategory;
  onCategoryChange?: (category: ShootCategory) => void;
  onPriceChange?: (priceInr: number) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenRatingModal,
  categoryOverride,
  onCategoryChange,
  onPriceChange,
}) => {
  const { config } = useSiteConfig();
  const contactInfo = config.contactReviews;
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

  const [copiedQuote, setCopiedQuote] = useState(false);
  const [showConfigurator, setShowConfigurator] = useState(false);

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
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategoryObj = useMemo(() => {
    return (
      PHOTOGRAPHY_CATEGORIES.find((c) => c.id === formData.category) ||
      PHOTOGRAPHY_CATEGORIES[0]
    );
  }, [formData.category]);

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

  const handleCopyBriefText = () => {
    const summaryText = `APEX LIGHT PHOTOGRAPHY STUDIO — COMMISSION BRIEF\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFocus: ${selectedCategoryObj.name}\nScope: ${formData.durationHours} Hours (~${estimatedDeliverables} Hand-Graded Deliverables)\nStaging: ${(formData.locationType || 'studio').toUpperCase()}\nClient: ${formData.fullName || 'Anonymous'}\nEmail: ${formData.email || 'N/A'}\nVision: ${formData.visionNotes || 'Standard studio commission'}\nStudio: inquiries@apexlightphoto.com | +91 98230 45678`;
    navigator.clipboard.writeText(summaryText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2200);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email address required';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required for dispatch';
    }
    if (!formData.visionNotes.trim()) {
      errs.visionNotes = 'Please provide details about your commission or project';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstErr = document.querySelector('.border-[#B8B8B3], .border-red-500');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newDocket = {
        id: `APX-${Math.floor(100000 + Math.random() * 900000)}`,
        dateSubmitted: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        summary: { ...formData },
      };
      setSubmittedInquiry(newDocket);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#111111', '#555555', '#999999', '#D7D7D2', '#FFFFFF'],
      });
    }, 850);
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
  };

  // Magnetic Button Interaction (Requirement #11)
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleMagneticMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magneticBtnRef.current) return;
    const rect = magneticBtnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.28;
    const distanceY = (e.clientY - centerY) * 0.28;
    setMagneticOffset({
      x: Math.max(-12, Math.min(12, distanceX)),
      y: Math.max(-8, Math.min(8, distanceY)),
    });
  };

  const handleMagneticMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="contact-section"
      className="py-20 sm:py-32 scroll-mt-24 border-t border-[#D7D7D2]"
    >
      {/* ========================================================================= */}
      {/* 1. WIDE 12-COLUMN EDITORIAL GRID: LEFT (Atelier) + RIGHT (Message)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* ======================================================================= */}
        {/* LEFT / MIDDLE COLUMNS (Cols 1-5): GET IN TOUCH + CHANNELS + IMAGE       */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-24">
          {/* Section Eyebrow & Title */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#8A8A86]">
                COMMUNICATIONS / 01
              </span>
              <div className="w-10 h-px bg-[#D7D7D2]" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#666666] font-mono">
                GET IN TOUCH
              </span>
            </div>

            <h2 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#111111] uppercase tracking-tight leading-[0.9] mb-6">
              {contactInfo.headline ? (
                contactInfo.headline
              ) : (
                <>
                  CONTACT
                  <br />
                  US.
                </>
              )}
            </h2>

            <p className="text-[#666666] text-sm sm:text-base font-light leading-relaxed max-w-md">
              {contactInfo.description || "We welcome commissions across architectural spaces, editorial portraiture, and private client documentation. Tell us about your project or reach our atelier desk directly."}
            </p>
          </div>

          {/* Contact Channels with Expanding Thin Hairlines (Requirement #9) */}
          <div className="border-t border-[#D7D7D2] divide-y divide-[#D7D7D2] text-xs font-mono">
            {/* Email */}
            <div className="py-4 group">
              <span className="text-[10px] text-[#8A8A86] uppercase tracking-[0.2em] block mb-1">
                EMAIL DIRECTORY
              </span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="font-editorial text-xl sm:text-2xl text-[#111111] hover:text-[#666666] tracking-wide inline-flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1"
              >
                <span>{contactInfo.email}</span>
                <ArrowRight className="w-4 h-4 text-[#8A8A86] group-hover:text-[#111111] transition-colors" />
              </a>
              <span className="block text-[10px] text-[#8A8A86] mt-0.5">
                Typical response window within 4 hours
              </span>
            </div>

            {/* Phone */}
            <div className="py-4 group">
              <span className="text-[10px] text-[#8A8A86] uppercase tracking-[0.2em] block mb-1">
                TELEPHONE & WHATSAPP
              </span>
              <a
                href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                className="font-editorial text-xl sm:text-2xl text-[#111111] hover:text-[#666666] tracking-wide inline-flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1"
              >
                <span>{contactInfo.phone}</span>
                <ArrowRight className="w-4 h-4 text-[#8A8A86] group-hover:text-[#111111] transition-colors" />
              </a>
              <span className="block text-[10px] text-[#8A8A86] mt-0.5">
                Mon - Sat, 10:00 - 19:00 IST
              </span>
            </div>

            {/* Location */}
            <div className="py-4 group">
              <span className="text-[10px] text-[#8A8A86] uppercase tracking-[0.2em] block mb-1">
                ATELIER LOCATION
              </span>
              <div className="font-editorial text-xl sm:text-2xl text-[#111111] tracking-wide">
                {contactInfo.location || "PUNE, MAHARASHTRA, INDIA"}
              </div>
              <span className="block text-[10px] text-[#8A8A86] mt-0.5">
                {contactInfo.atelierNote || "Koregaon Park North • Available Worldwide for Commission"}
              </span>
            </div>

            {/* Social */}
            <div className="py-4">
              <span className="text-[10px] text-[#8A8A86] uppercase tracking-[0.2em] block mb-2">
                SOCIAL ARCHIVES
              </span>
              <div className="flex flex-wrap gap-6 font-mono text-xs text-[#111111]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#666666] inline-flex items-center gap-1 transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#666666] inline-flex items-center gap-1 transition-colors"
                >
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#666666] inline-flex items-center gap-1 transition-colors"
                >
                  <span>BEHANCE</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Asymmetrical Architectural Contact Image (Requirement #12) */}
          <div className="relative pt-4">
            <div
              data-cursor="VIEW"
              className="relative w-full aspect-[16/10] bg-[#E9E9E6] border border-[#D7D7D2] overflow-hidden group shadow-xs"
            >
              {/* Architectural Concrete / Stone Shadow study (strictly NO flowers/plants) */}
              <img
                src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85"
                alt="Apex Light Studio Architectural Stone & Light Geometry"
                className="w-full h-full object-cover object-center grayscale contrast-105 brightness-95 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/45 via-transparent to-transparent pointer-events-none" />

              {/* Floating Translucent Label (Requirement #12) */}
              <div className="absolute bottom-4 left-4 p-3 bg-[#FFFFFF]/85 backdrop-blur-md border border-[#D7D7D2] text-[#111111]">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8A8A86] block">
                  PRIMARY BASE
                </span>
                <span className="font-editorial text-sm sm:text-base font-medium tracking-wide block">
                  BASED IN PUNE, INDIA
                </span>
                <span className="font-mono text-[9px] text-[#666666] block">
                  18.5362° N, 73.8958° E
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (Cols 6-12): SEND A MESSAGE / LET'S TALK FORM (Req #9, #10)*/}
        {/* ======================================================================= */}
        <div className="lg:col-span-7">
          <div id="contact-form-section" className="scroll-mt-24">
            {submittedInquiry ? (
              /* Confirmation Docket */
              <div className="py-12 px-6 sm:px-10 bg-[#FFFFFF] border border-[#D7D7D2] text-[#111111] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#D7D7D2] mb-6 font-mono text-xs">
                  <span className="tracking-[0.2em] uppercase text-[#8A8A86]">
                    COMMISSION DOCKET #{submittedInquiry.id}
                  </span>
                  <span>{submittedInquiry.dateSubmitted}</span>
                </div>

                <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#111111] mb-4">
                  Inquiry Brief Received.
                </h3>

                <p className="text-[#666666] text-sm sm:text-base font-light leading-relaxed mb-8">
                  Thank you, {submittedInquiry.summary.fullName}. Your inquiry for the{' '}
                  <span className="text-[#111111] font-medium">{selectedCategoryObj.name}</span>{' '}
                  session has been routed to our Pune studio. We review light, scheduling, and
                  deliverables, and confirm your slot within 4 hours.
                </p>

                <div className="border-t border-b border-[#D7D7D2] py-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8A8A86] uppercase">Focus Category</span>
                    <span className="text-[#111111]">{selectedCategoryObj.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8A86] uppercase">Duration</span>
                    <span className="text-[#111111]">
                      {submittedInquiry.summary.durationHours} Hours (~{estimatedDeliverables} Hand-Retouched Masters)
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E9E9E6]">
                    <span className="text-[#8A8A86] uppercase">Formal Proposal</span>
                    <span className="text-sm font-mono text-[#111111]">
                      Dispatched to {submittedInquiry.summary.email} within 4 hours
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 font-mono text-xs">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-6 py-3.5 border border-[#D7D7D2] hover:border-[#111111] uppercase tracking-[0.16em] text-[#111111] transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={onOpenRatingModal}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-[#222222] text-[#F6F6F4] uppercase tracking-[0.16em] transition-colors cursor-pointer"
                  >
                    Rate Studio Experience
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Form Header */}
                <div className="mb-10">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8A8A86] block mb-2">
                    SEND A MESSAGE
                  </span>
                  <h3 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#111111] uppercase tracking-tight leading-[0.95]">
                    LET&apos;S TALK.
                  </h3>
                  <p className="text-[#666666] text-xs sm:text-sm font-light mt-2">
                    Fill out our architectural commission brief below. Tailored proposals and shoot itineraries are prepared upon brief review.
                  </p>
                </div>

                {/* Form with Thin Horizontal Lines (Requirement #9 & #10) */}
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* FIELD: YOUR NAME */}
                  <div className="group">
                    <label className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8A8A86] block group-focus-within:text-[#111111] group-focus-within:translate-x-1 transition-all duration-300">
                      YOUR NAME *
                    </label>
                    <input
                      id="input-full-name"
                      type="text"
                      placeholder="e.g. Maya Krishnan"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      className={`w-full bg-transparent border-0 border-b ${
                        errors.fullName ? 'border-[#B8B8B3]' : 'border-[#D7D7D2]'
                      } focus:border-[#111111] py-3 text-lg sm:text-xl text-[#111111] placeholder-[#D7D7D2] focus:outline-none transition-all duration-300 font-editorial`}
                    />
                    {errors.fullName && (
                      <span className="font-mono text-[11px] text-[#111111] mt-1 block">
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  {/* FIELD: YOUR EMAIL & CONTACT NUMBER */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8A8A86] block group-focus-within:text-[#111111] group-focus-within:translate-x-1 transition-all duration-300">
                        YOUR EMAIL *
                      </label>
                      <input
                        id="input-email"
                        type="email"
                        placeholder="maya@atelier.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        className={`w-full bg-transparent border-0 border-b ${
                          errors.email ? 'border-[#B8B8B3]' : 'border-[#D7D7D2]'
                        } focus:border-[#111111] py-3 text-base sm:text-lg text-[#111111] placeholder-[#D7D7D2] focus:outline-none transition-all duration-300 font-grotesk`}
                      />
                      {errors.email && (
                        <span className="font-mono text-[11px] text-[#111111] mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="group">
                      <label className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8A8A86] block group-focus-within:text-[#111111] group-focus-within:translate-x-1 transition-all duration-300">
                        PHONE NUMBER *
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
                          errors.phone ? 'border-[#B8B8B3]' : 'border-[#D7D7D2]'
                        } focus:border-[#111111] py-3 text-base sm:text-lg text-[#111111] placeholder-[#D7D7D2] focus:outline-none transition-all duration-300 font-grotesk`}
                      />
                      {errors.phone && (
                        <span className="font-mono text-[11px] text-[#111111] mt-1 block">
                          {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FIELD: PROJECT TYPE (Requirement #9) */}
                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8A8A86]">
                        PROJECT TYPE *
                      </label>
                      <span className="font-mono text-[10px] text-[#8A8A86]">
                        SELECT COMMISSION GENRE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {PHOTOGRAPHY_CATEGORIES.map((cat) => {
                        const isSelected = formData.category === cat.id;
                        const genreSubtitle =
                          cat.id === 'portrait'
                            ? 'Studio & Character'
                            : cat.id === 'wedding'
                            ? 'Full Day Narrative'
                            : cat.id === 'editorial'
                            ? 'Fashion & Lookbook'
                            : cat.id === 'commercial'
                            ? 'Product & Luxury'
                            : cat.id === 'event'
                            ? 'Candid Documentary'
                            : 'Architectural Survey';

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, category: cat.id }));
                              if (onCategoryChange) onCategoryChange(cat.id);
                            }}
                            className={`p-3 text-left border text-xs font-mono transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'border-[#111111] bg-[#111111] text-[#F6F6F4]'
                                : 'border-[#D7D7D2] text-[#666666] hover:border-[#111111] hover:text-[#111111] bg-[#FFFFFF]/50'
                            }`}
                          >
                            <div className="font-medium text-[11px] truncate">{cat.name}</div>
                            <div
                              className={`text-[10px] mt-1 ${
                                isSelected ? 'text-[#B8B8B3]' : 'text-[#8A8A86]'
                              }`}
                            >
                              {genreSubtitle}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customizer Drawer Trigger (Clean minimal accordions) */}
                  <div className="border border-[#D7D7D2] p-4 bg-[#FFFFFF]/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111] font-medium block">
                          SESSION SPECS & DURATION
                        </span>
                        <span className="text-[11px] font-mono text-[#8A8A86]">
                          {formData.durationHours} Hours • ~{estimatedDeliverables} Hand-Retouched Deliverables • {(formData.locationType || 'studio').toUpperCase()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowConfigurator(!showConfigurator)}
                        className="text-xs font-mono uppercase tracking-wider text-[#111111] underline hover:text-[#666666] cursor-pointer"
                      >
                        {showConfigurator ? 'Collapse [-]' : 'Adjust Specs [+]'}
                      </button>
                    </div>

                    {showConfigurator && (
                      <div className="pt-5 mt-4 border-t border-[#D7D7D2] space-y-6 animate-in fade-in duration-200">
                        {/* Duration Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-2">
                            <span className="text-[#666666] uppercase">Session Duration:</span>
                            <span className="font-semibold text-[#111111]">
                              {formData.durationHours} Hours
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            step="1"
                            value={formData.durationHours}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                durationHours: Number(e.target.value),
                              }))
                            }
                            className="w-full accent-[#111111] cursor-pointer"
                          />
                        </div>

                        {/* Location Type */}
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A86] block mb-2">
                            Location Staging
                          </span>
                          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                            {[
                              { id: 'studio', label: 'Pune Studio' },
                              { id: 'on_location', label: 'On-Location' },
                              { id: 'destination', label: 'Destination' },
                            ].map((loc) => (
                              <button
                                key={loc.id}
                                type="button"
                                onClick={() =>
                                   setFormData((prev) => ({
                                    ...prev,
                                    locationType: loc.id as any,
                                  }))
                                }
                                className={`p-2 text-center border text-[11px] transition-colors cursor-pointer ${
                                  formData.locationType === loc.id
                                    ? 'border-[#111111] bg-[#111111] text-[#F6F6F4]'
                                    : 'border-[#D7D7D2] text-[#666666] hover:border-[#111111]'
                                }`}
                              >
                                {loc.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Add-ons */}
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A86] block mb-2">
                            Add-on Services
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                            {CONTACT_ADDONS.map((addon) => {
                              const checked = formData.addons.includes(addon.id);
                              return (
                                <button
                                  key={addon.id}
                                  type="button"
                                  onClick={() => toggleAddon(addon.id)}
                                  className={`p-2.5 text-left border flex items-center justify-between transition-colors cursor-pointer ${
                                    checked
                                      ? 'border-[#111111] bg-[#111111] text-[#F6F6F4]'
                                      : 'border-[#D7D7D2] text-[#666666] hover:border-[#111111]'
                                  }`}
                                >
                                  <span className="text-[11px] truncate">{addon.name}</span>
                                  <span className="text-[10px] uppercase tracking-wider opacity-80">
                                    {checked ? 'Included' : 'Optional +'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FIELD: TELL US ABOUT YOUR PROJECT (Requirement #9) */}
                  <div className="group">
                    <label className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8A8A86] block group-focus-within:text-[#111111] group-focus-within:translate-x-1 transition-all duration-300">
                      TELL US ABOUT YOUR PROJECT *
                    </label>
                    <textarea
                      id="input-vision-notes"
                      rows={4}
                      placeholder="Brief description of the space, subject, preferred dates, or desired emotional tone..."
                      value={formData.visionNotes}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, visionNotes: e.target.value }));
                        if (errors.visionNotes) setErrors((prev) => ({ ...prev, visionNotes: '' }));
                      }}
                      className={`w-full bg-transparent border-0 border-b ${
                        errors.visionNotes ? 'border-[#B8B8B3]' : 'border-[#D7D7D2]'
                      } focus:border-[#111111] py-3 text-base sm:text-lg text-[#111111] placeholder-[#D7D7D2] focus:outline-none transition-all duration-300 resize-none font-editorial`}
                    />
                    {errors.visionNotes && (
                      <span className="font-mono text-[11px] text-[#111111] mt-1 block">
                        {errors.visionNotes}
                      </span>
                    )}
                  </div>

                  {/* Commission Brief Specifications Ledger (No Price) */}
                  <div className="pt-6 border-t border-[#D7D7D2] space-y-4 font-mono">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A86] block">
                          COMMISSION SCOPE SPECIFICATION
                        </span>
                        <div className="text-xl sm:text-2xl font-editorial font-medium text-[#111111] mt-1">
                          {selectedCategoryObj.name} — {formData.durationHours} Hours Session
                        </div>
                        <span className="text-[11px] text-[#8A8A86] block mt-1">
                          Estimated ~{estimatedDeliverables} Hand-Retouched Medium Format Masters • Staging: {(formData.locationType || 'studio').toUpperCase()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyBriefText}
                        className="inline-flex items-center gap-1.5 text-xs text-[#8A8A86] hover:text-[#111111] underline transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedQuote ? 'Copied Brief' : 'Copy Project Brief'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 bg-[#E9E9E6]/70 border border-[#D7D7D2] text-[11px] text-[#666666] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#111111]" />
                        <span>100MP Medium Format Masters • Commercial Usage Rights • Private Web Vault</span>
                      </div>
                      <span className="text-[#111111] font-medium tracking-wide">
                        Bespoke Proposal within 4 Hours
                      </span>
                    </div>
                  </div>

                  {/* SEND BUTTON (Requirement #11: Premium black/charcoal rectangular button, arrow moves 8-12px, magnetic) */}
                  <div className="pt-4">
                    <button
                      ref={magneticBtnRef}
                      type="submit"
                      disabled={isSubmitting}
                      onMouseMove={handleMagneticMouseMove}
                      onMouseLeave={handleMagneticMouseLeave}
                      style={{
                        transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
                        transition:
                          magneticOffset.x === 0 && magneticOffset.y === 0
                            ? 'transform 0.4s ease-out'
                            : 'none',
                      }}
                      className="group w-full sm:w-auto px-10 py-5 bg-[#111111] hover:bg-[#222222] text-[#F6F6F4] text-xs uppercase tracking-[0.22em] font-mono transition-colors duration-300 inline-flex items-center justify-between sm:justify-start gap-6 cursor-pointer shadow-xs"
                    >
                      <span>
                        {isSubmitting ? 'TRANSMITTING BRIEF...' : 'SEND MESSAGE'}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-3" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
