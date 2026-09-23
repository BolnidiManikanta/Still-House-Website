"use client";

import React from 'react';

interface NavigationProps {
  onOpenMenu: () => void;
  onOpenProjects: () => void;
  scrollProgress: number;
}

export const Navigation: React.FC<NavigationProps> = () => {

  return (
    <header
      id="main-navigation-header"
      className="fixed top-[72px] sm:top-[80px] left-0 w-full z-40 px-6 sm:px-10 py-2.5 flex items-center justify-between text-[#181818] pointer-events-none"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <a
          id="nav-brand-link"
          href="#hero"
          className="group flex items-center gap-2 font-display-cinzel tracking-[0.24em] text-xs font-semibold uppercase hover:opacity-75 transition-opacity bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm"
        >
          <div className="w-4 h-4 rounded flex items-center justify-center border border-black/30 text-[10px] font-serif font-bold text-[#1A1A1A]">
            U
          </div>
          <span className="tracking-widest text-[#1A1A1A] font-semibold text-[11px]">IMMERSIVE GARDEN</span>
        </a>
        <span className="hidden sm:inline-flex items-center text-[9px] uppercase tracking-[0.26em] font-semibold px-3 py-1 rounded-full relief-pill border border-black/15 text-[#3A352E] bg-white/60 backdrop-blur-sm">
          STUDIO RELIEF
        </span>
      </div>

      {/* Center Studio Cities */}
      <div className="hidden lg:flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] font-semibold text-[#3A352E] bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-black/10 pointer-events-auto">
        <span>PARIS</span>
        <span className="text-[#88837A]">•</span>
        <span>TOKYO</span>
        <span className="text-[#88837A]">•</span>
        <span>NEW YORK</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
      </div>
    </header>
  );
};
