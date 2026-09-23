"use client";

import React from 'react';
import { ArrowDown, MapPin, Sparkles } from 'lucide-react';

interface PortfolioHeroProps {
  onExploreClick: () => void;
  onSelectCategory: (category: string) => void;
}

export const PortfolioHero: React.FC<PortfolioHeroProps> = ({ onExploreClick, onSelectCategory }) => {
  return (
    <section
      id="portfolio-hero"
      className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Editorial Header Block */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="w-6 h-px bg-black/30"></span>
          <span
            id="hero-eyebrow"
            className="text-[10px] sm:text-[11px] tracking-[0.35em] font-semibold uppercase text-black/60"
          >
            PORTFOLIO
          </span>
          <span className="w-6 h-px bg-black/30"></span>
        </div>

        <h1
          id="hero-main-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#1A1A1A] font-serif leading-[1.12] mb-4 sm:mb-5"
        >
          Stories, Beautifully Preserved.
        </h1>

        <p
          id="hero-supporting-text"
          className="text-sm sm:text-base text-black/60 font-light max-w-xl leading-relaxed italic font-serif"
        >
          A collection of celebrations, connections and quiet moments captured with intention.
        </p>
      </div>

      {/* Hero Visual Composition - Editorial Magazine Layout */}
      <div
        id="hero-visual-frame"
        className="relative w-full rounded-none overflow-hidden bg-stone-100 border border-black/5"
      >
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=2000"
            alt="Hero wedding couple portrait captured with cinematic light by Krishna Photography"
            className="w-full h-full object-cover object-center filter brightness-[0.93] contrast-[1.03] transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            loading="eager"
          />

          {/* Gentle cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Editorial Corner Tags */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 text-white/90 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-medium drop-shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Krishna Photography Studio</span>
          </div>

          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 hidden sm:flex items-center gap-1.5 text-white/80 text-[10px] tracking-[0.2em] uppercase font-light">
            <MapPin className="w-3 h-3 text-white/70" />
            <span>Vizag • Hyderabad • Destinations</span>
          </div>

          {/* Hero Bottom Narrative Overlay */}
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="max-w-md">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 block mb-1">
                Selected Work • 2024–2025
              </span>
              <p className="text-sm sm:text-base font-serif italic text-white/95 leading-snug">
                &ldquo;We do not merely photograph what it looks like. We preserve what it felt like.&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                id="btn-hero-explore"
                onClick={onExploreClick}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1A1A1A] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-white/90 transition-colors shadow-sm cursor-pointer"
              >
                <span>Explore Stories</span>
                <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Sub-bar */}
        <div className="bg-[#FAF8F5] border-t border-black/5 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-black/60">
          <div className="flex items-center gap-6">
            <span>8 Specialized Categories</span>
            <span className="hidden sm:inline text-black/20">•</span>
            <span className="hidden sm:inline">Candid & Cinematic Direction</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-700/60" />
            <span className="text-black/80 font-medium">Authentic Indian Celebrations & Portraits</span>
          </div>
        </div>
      </div>
    </section>
  );
};
