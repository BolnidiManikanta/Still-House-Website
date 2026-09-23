"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenRatingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRatingModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t border-[#D7D7D2] bg-[#F6F6F4] text-[#111111] pt-16 sm:pt-24 pb-14 sm:pb-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Minimal Editorial Footer Grid (Requirement #19) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[#D7D7D2] items-baseline">
          {/* Brand & Studio Identity */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-editorial text-3xl sm:text-4xl tracking-[0.16em] uppercase font-medium block">
              STILL HOUSE
            </span>
            <p className="font-mono text-[11px] text-[#8A8A86] tracking-widest uppercase">
              APEX LIGHT • FINE ARCHITECTURAL PHOTOGRAPHY & DOCUMENTARY
            </p>
          </div>

          {/* Navigation Links (Requirement #19: WORK, ABOUT, SERVICES, CONTACT) */}
          <div className="md:col-span-3 space-y-1 font-mono text-xs text-[#666666]">
            <span className="text-[10px] text-[#8A8A86] uppercase tracking-[0.2em] block mb-2">
              INDEX
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => scrollTo('hero-section')}
                className="text-left hover:text-[#111111] transition-colors cursor-pointer uppercase tracking-wider"
              >
                WORK & PORTFOLIO
              </button>
              <button
                type="button"
                onClick={() => scrollTo('reviews-section')}
                className="text-left hover:text-[#111111] transition-colors cursor-pointer uppercase tracking-wider"
              >
                ABOUT & REPUTATION
              </button>
              <button
                type="button"
                onClick={() => scrollTo('contact-section')}
                className="text-left hover:text-[#111111] transition-colors cursor-pointer uppercase tracking-wider"
              >
                SERVICES & COMMISSIONS
              </button>
              <button
                type="button"
                onClick={() => scrollTo('contact-form-section')}
                className="text-left text-[#111111] font-semibold hover:text-[#666666] transition-colors cursor-pointer uppercase tracking-wider"
              >
                CONTACT & BRIEF
              </button>
            </div>
          </div>

          {/* Social Links (Requirement #19: SOCIAL LINKS) */}
          <div className="md:col-span-3 space-y-1 font-mono text-xs text-[#666666]">
            <span className="text-[10px] text-[#8A8A86] uppercase tracking-[0.2em] block mb-2">
              SOCIAL ARCHIVE
            </span>
            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#111111] inline-flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                <span>INSTAGRAM</span>
                <ArrowUpRight className="w-3 h-3 text-[#8A8A86]" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#111111] inline-flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                <span>LINKEDIN</span>
                <ArrowUpRight className="w-3 h-3 text-[#8A8A86]" />
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#111111] inline-flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                <span>BEHANCE</span>
                <ArrowUpRight className="w-3 h-3 text-[#8A8A86]" />
              </a>
            </div>
          </div>

          {/* Quick Actions & Scroll to top */}
          <div className="md:col-span-2 flex flex-col items-start md:items-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={onOpenRatingModal}
              className="text-[#111111] hover:text-[#666666] uppercase tracking-wider underline transition-colors cursor-pointer"
            >
              Rate Studio
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="text-[#8A8A86] hover:text-[#111111] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>

        {/* Thin Divider & Generous Whitespace Copyright Row (Requirement #19) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#8A8A86]">
          <span>
            © {new Date().getFullYear()} STILL HOUSE / APEX LIGHT STUDIO ATELIER. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-6">
            <span>PUNE • MUMBAI • GLOBAL</span>
            <span className="text-[#D7D7D2]">•</span>
            <span>HASSELBLAD OPTICS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
