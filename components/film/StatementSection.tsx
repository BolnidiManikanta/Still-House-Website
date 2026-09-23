"use client";

import React from 'react';

export const StatementSection: React.FC = () => {
  return (
    <section
      id="statement"
      className="relative w-full min-h-[90vh] flex flex-col justify-center px-6 sm:px-14 md:px-24 py-28 pointer-events-none"
    >
      <div className="max-w-5xl pointer-events-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] tracking-[0.3em] font-bold text-[#888888] uppercase">
            01 / Studio Manifesto
          </span>
          <div className="w-8 h-px bg-black/20"></div>
        </div>

        <h2
          id="statement-manifesto-text"
          className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] font-light text-[#1A1A1A] tracking-normal"
        >
          Transcend anything <br className="hidden sm:inline" />
          <span className="italic font-serif-luxury text-[#222222]">seen or felt before</span> <br />
          by crafting unparalleled <br className="hidden sm:inline" />
          experiences for ambitious brands.
        </h2>

        <div className="mt-12 pt-8 border-t border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-xs sm:text-sm uppercase tracking-[0.22em] font-medium text-[#666666] max-w-md leading-relaxed">
            Where sculpted digital material meets cutting-edge spatial WebGL architecture.
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] font-semibold text-[#4A4A4A]">
            <span className="px-3 py-1 rounded-full relief-pill border border-black/10">Sensory Design</span>
            <span className="px-3 py-1 rounded-full relief-pill border border-black/10">Real-time 3D</span>
            <span className="px-3 py-1 rounded-full relief-pill border border-black/10">Bespoke Audio</span>
          </div>
        </div>
      </div>
    </section>
  );
};
