"use client";

import React from 'react';
import { CATEGORIES } from '../data/portfolioData';
import { Instagram, Youtube, Facebook, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (key: string) => void;
  onOpenInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenInquiry }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="bg-[#F7F5F0] border-t border-black/10 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-black/10">
          {/* Col 1: Studio Identity (Span 5) */}
          <div className="md:col-span-5">
            <span className="text-[10px] tracking-[0.35em] font-semibold uppercase text-black/50 block mb-2">
              Fine Art Photography
            </span>
            <h3 className="text-3xl sm:text-4xl font-light font-serif italic text-black mb-4">
              Krishna Photography
            </h3>
            <p className="text-xs sm:text-sm text-black/60 font-light max-w-sm leading-relaxed mb-6 font-serif">
              Documenting life&apos;s sacred ceremonies, quiet intimacies, and grand celebrations with artistic vision, authentic storytelling, and cinematic elegance.
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-black/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-black/40" />
                <span>Visakhapatnam & Hyderabad, India • Available Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-black/40" />
                <a href="tel:+919030943166" className="hover:text-black underline-offset-2 hover:underline">
                  +91 90309 43166
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-black/40" />
                <a href="mailto:contact@krishnaphotography.com" className="hover:text-black underline-offset-2 hover:underline">
                  contact@krishnaphotography.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: All 8 Categories List (Span 4) */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase text-black/50 mb-4">
              Portfolio Categories
            </h4>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] tracking-[0.15em] uppercase font-medium">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => onSelectCategory(cat.key)}
                  className="text-left text-black/60 hover:text-black transition-colors cursor-pointer"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Experience & Connect (Span 3) */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase text-black/50 mb-4">
                Studio Connect
              </h4>
              <div className="flex items-center gap-4 mb-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Krishna Photography on Instagram"
                  className="w-9 h-9 border border-black/15 flex items-center justify-center text-black/60 hover:text-black hover:border-black transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Krishna Photography on YouTube"
                  className="w-9 h-9 border border-black/15 flex items-center justify-center text-black/60 hover:text-black hover:border-black transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Krishna Photography on Facebook"
                  className="w-9 h-9 border border-black/15 flex items-center justify-center text-black/60 hover:text-black hover:border-black transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <button
                onClick={onOpenInquiry}
                className="w-full py-2.5 px-4 bg-black text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-neutral-800 transition-colors text-center cursor-pointer"
              >
                Inquire For Dates
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-black/40">
          <div>
            © {new Date().getFullYear()} Krishna Photography Studio. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="https://krishnaphotographycom.mypixieset.com/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
              Client Galleries (Pixieset)
            </a>
            <span className="text-black/20">•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-black transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
