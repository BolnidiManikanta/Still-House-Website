"use client";

import React from 'react';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

interface CTASectionProps {
  onOpenInquiry: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenInquiry }) => {
  return (
    <section
      id="contact-cta"
      className="relative bg-[#1A1A1A] text-white py-20 sm:py-28 px-6 sm:px-8 lg:px-12 overflow-hidden"
    >
      {/* Subtle ambient luxury backdrop */}
      <div className="absolute inset-0 bg-radial-at-c from-neutral-800/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-[10px] sm:text-[11px] tracking-[0.35em] font-semibold uppercase text-white/50 block mb-4">
          Reserve Your Date
        </span>

        <h2
          id="cta-heading"
          className="text-3xl sm:text-5xl lg:text-6xl font-light font-serif italic text-white tracking-tight leading-tight mb-5"
        >
          Your Story Deserves to Be Remembered.
        </h2>

        <p
          id="cta-subheading"
          className="text-sm sm:text-base text-white/70 font-light max-w-xl mx-auto leading-relaxed mb-10 font-serif"
        >
          Let&apos;s create photographs that feel as meaningful years from now as they do today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            id="btn-cta-get-in-touch"
            onClick={onOpenInquiry}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1A1A1A] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-4 h-4 text-black/70" />
          </button>

          <a
            id="btn-cta-call-direct"
            href="tel:+919030943166"
            className="w-full sm:w-auto px-8 py-3.5 border border-white/30 text-white hover:bg-white/10 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-white/70" />
            <span>+91 90309 43166</span>
          </a>
        </div>

        {/* Minimalist Studio Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10 text-center sm:text-left text-white/60">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 text-white text-[11px] tracking-[0.18em] uppercase font-medium">
              <MapPin className="w-3.5 h-3.5 text-white/60" />
              <span>Studio Bases</span>
            </div>
            <p className="text-xs text-white/50 font-light">
              Visakhapatnam & Hyderabad. Available worldwide for destination weddings.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 text-white text-[11px] tracking-[0.18em] uppercase font-medium">
              <Phone className="w-3.5 h-3.5 text-white/60" />
              <span>Direct Inquiries</span>
            </div>
            <p className="text-xs text-white/50 font-light">
              +91 90309 43166 • WhatsApp enabled for instantaneous consultations.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 text-white text-[11px] tracking-[0.18em] uppercase font-medium">
              <Mail className="w-3.5 h-3.5 text-white/60" />
              <span>Booking Window</span>
            </div>
            <p className="text-xs text-white/50 font-light">
              Now accepting dates for 2024–2026 wedding & portrait calendars.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
