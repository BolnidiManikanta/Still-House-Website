"use client";

import React from 'react';
import { useSiteConfig } from "@/lib/admin/siteConfigStore";

interface HeroSectionProps {
  onSeeAllProjects: () => void;
  onScrollDown: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSeeAllProjects,
  onScrollDown,
}) => {
  const { config } = useSiteConfig();
  const hero = config.film.hero;

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[640px] flex flex-col justify-between px-6 sm:px-12 md:px-16 pt-24 pb-10 pointer-events-none"
    >
      {/* Top micro-meta */}
      <div className="relative z-20 flex justify-between items-start w-full pt-2 pointer-events-auto">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.3em] font-semibold text-[#555048] uppercase mb-1">
            {hero.topTag}
          </span>
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#3A352E] font-medium">
            {hero.topSub}
          </p>
        </div>
      </div>

      {/* Main Center Editorial Composition */}
      <div className="relative z-20 w-full my-auto py-2 flex flex-col items-center justify-center text-center pointer-events-auto px-4">
        {/* Editorial Subtitle with delicate flanking hairline lines */}
        <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
          <div className="w-8 sm:w-10 h-px bg-[#4E483E]/30" />
          <p className="text-[12px] sm:text-[13px] md:text-[14px] italic font-serif-luxury text-[#4E483E] tracking-wide">
            {hero.subtitleItalic}
          </p>
          <div className="w-8 sm:w-10 h-px bg-[#4E483E]/30" />
        </div>

        {/* Small pill badge positioned with clean separation above headline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 sm:mb-5 rounded-full relief-pill border border-black/15 text-[10px] uppercase tracking-[0.28em] font-semibold text-[#2E2922] bg-[#EDEAE4]/80 backdrop-blur-xs">
          <span className="text-[12px] text-[#1A1A1A] leading-none">✳</span>
          <span>{hero.badgeText}</span>
        </div>

        {/* Center Hero Headline */}
        <h1
          id="hero-main-title"
          className="font-serif-headline text-4xl sm:text-6xl md:text-7xl lg:text-[78px] xl:text-[84px] tracking-tight text-[#141414] font-normal leading-[0.98] sm:leading-[1.02] max-w-[780px] mx-auto select-none"
          style={{
            position: 'relative',
            zIndex: 30,
            color: '#141414',
            fontFamily: "'Playfair Display', 'Newsreader', 'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            display: 'block',
            visibility: 'visible',
            opacity: 1,
          }}
        >
          <span className="block">{hero.mainTitleLine1}</span>
          <span className="block">{hero.mainTitleLine2}</span>
        </h1>
      </div>

      {/* Bottom Row / Transition Zone */}
      <div className="relative z-20 w-full flex justify-between items-end pointer-events-auto pt-2">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#4A453E] font-medium">
            © IMMERSIVE GARDEN
          </span>
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#6A655E] font-normal">
            ALL RIGHTS RESERVED
          </span>
        </div>

        {/* Scroll down indicator with fine vertical line and dot */}
        <div className="hidden sm:flex flex-col items-center gap-1.5 pr-20 md:pr-24">
          <span className="text-[10px] tracking-[0.2em] font-medium text-[#4A453E]">
            Scroll down
          </span>
          <div className="w-px h-8 bg-[#333333]/40" />
          <span className="w-1 h-1 rounded-full bg-[#333333]" />
        </div>
      </div>
    </section>
  );
};
