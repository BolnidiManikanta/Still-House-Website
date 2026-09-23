"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteConfig } from '@/lib/admin/siteConfigStore';
import { getTypographyStyles } from '@/lib/admin/styleHelpers';

interface ExhibitionHeaderProps {
  onOpenInquiry: () => void;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
  isInsideStory: boolean;
  onBackToSculpture: () => void;
}

export const ExhibitionHeader: React.FC<ExhibitionHeaderProps> = ({
  onOpenInquiry,
  onToggleMenu,
  isMenuOpen,
  isInsideStory,
  onBackToSculpture,
}) => {
  const { config } = useSiteConfig();
  const krishna = config.krishna;

  return (
    <header
      id="exhibition-header"
      className="fixed top-0 left-0 right-0 z-40 px-8 sm:px-12 pt-8 pb-4 flex items-center justify-between select-none pointer-events-auto"
    >
      {/* Left Wordmark: KRISHNA PHOTOGRAPHY */}
      <button
        onClick={() => {
          if (isInsideStory) {
            onBackToSculpture();
          }
        }}
        className="text-left group cursor-pointer focus:outline-none"
      >
        <span
          style={getTypographyStyles(krishna.titleTypography)}
          className="text-xs sm:text-[13px] tracking-[0.38em] font-sans font-medium uppercase text-[#1F1F1F] transition-all duration-200 block"
        >
          {krishna.brandTitle} {krishna.brandSubtitle && <span className="opacity-70 font-light">· {krishna.brandSubtitle}</span>}
        </span>
      </button>

      {/* Right Controls: INQUIRE ↗ & Hamburger menu */}
      <div className="flex items-center gap-6 sm:gap-8">
        {isInsideStory && (
          <button
            onClick={onBackToSculpture}
            className="text-[10px] tracking-[0.25em] font-mono uppercase text-[#928B8B] hover:text-[#1F1F1F] transition-colors cursor-pointer mr-2"
          >
            ← Back to Exhibition
          </button>
        )}

        {/* INQUIRE ↗ Button */}
        <button
          id="btn-header-inquire"
          onClick={onOpenInquiry}
          className="border border-[#1F1F1F] text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-[#ECE8E8] px-5 sm:px-6 py-2 sm:py-2.5 text-[10.5px] tracking-[0.25em] font-mono uppercase transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <span>Inquire</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {/* Hamburger Icon: Two horizontal bars */}
        <button
          id="btn-header-menu"
          onClick={onToggleMenu}
          aria-label="Toggle Navigation Menu"
          className="flex flex-col justify-center gap-1.5 w-7 h-7 cursor-pointer group focus:outline-none"
        >
          <span
            className={`w-6 h-[1.5px] bg-[#1F1F1F] block transition-transform duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1' : 'group-hover:w-7'
            }`}
          />
          <span
            className={`w-6 h-[1.5px] bg-[#1F1F1F] block transition-transform duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1' : 'group-hover:w-5'
            }`}
          />
        </button>
      </div>
    </header>
  );
};
