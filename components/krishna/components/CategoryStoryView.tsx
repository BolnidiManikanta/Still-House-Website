"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CategoryInfo, PortfolioImage, CATEGORIES } from '../data/portfolioData';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';

interface CategoryStoryViewProps {
  category: CategoryInfo;
  images: PortfolioImage[];
  onBack: () => void;
  onSelectCategory: (key: string) => void;
  onImageClick: (image: PortfolioImage) => void;
  onInquire: (categoryLabel: string) => void;
}

export const CategoryStoryView: React.FC<CategoryStoryViewProps> = ({
  category,
  images,
  onBack,
  onSelectCategory,
  onImageClick,
  onInquire,
}) => {
  // Scroll to top when category story opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category.key]);

  // Find next and prev category
  const currentIndex = CATEGORIES.findIndex((c) => c.key === category.key);
  const nextCategory = CATEGORIES[(currentIndex + 1) % CATEGORIES.length];

  const heroImage = images[0];
  const secondaryImages = images.slice(1);

  return (
    <div
      id={`story-view-${category.key}`}
      className="min-h-screen bg-[#ECE8E8] text-[#1F1F1F] transition-opacity duration-700 animate-fadeIn relative"
    >
      {/* Sticky Story Navigation Bar */}
      <nav
        id="story-nav"
        className="sticky top-0 z-40 bg-[#ECE8E8]/90 backdrop-blur-md border-b border-[#1F1F1F]/10 px-4 sm:px-10 py-3.5 flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/"
            prefetch={true}
            id="story-home-btn"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1F1F1F]/20 hover:border-[#1F1F1F] bg-white/70 hover:bg-[#1F1F1F] text-[#1F1F1F] hover:text-[#ECE8E8] text-[9.5px] sm:text-[10px] tracking-[0.14em] uppercase transition-all cursor-pointer shadow-2xs font-sans font-medium"
            title="Return to Still Studio Home"
          >
            <span className="text-[11px] group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>STILL <span className="opacity-60 font-normal">/ STUDIO</span></span>
          </Link>

          <button
            id="btn-return-sculpture"
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium text-[#6B6565] hover:text-black transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Return to Exhibition</span>
            <span className="sm:hidden">Exhibition</span>
          </button>
        </div>

        {/* Minimal Central Title */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] tracking-[0.25em] text-[#7D7676] font-semibold">
              CHAPTER {category.num}
            </span>
            <span className="text-[#ADAAAA]">•</span>
            <h1 className="text-sm sm:text-base font-serif italic text-[#1F1F1F] tracking-[0.16em] uppercase">
              {category.label}
            </h1>
          </div>
          <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-[#8C8484] mt-0.5">
            Krishna Visual Archive & Monograph
          </span>
        </div>

        {/* Next Category Link & Inquire */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectCategory(nextCategory.key)}
            className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-[#7D7676] hover:text-[#1F1F1F] transition-colors cursor-pointer group"
          >
            <span>Next: {nextCategory.label}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onInquire(category.label)}
            className="px-3.5 py-1.5 bg-[#1F1F1F] text-[#ECE8E8] text-[9px] tracking-[0.22em] uppercase font-semibold hover:bg-black transition-colors cursor-pointer shadow-xs"
          >
            Inquire
          </button>
        </div>
      </nav>

      {/* Cinematic Hero Opening Frame with subtle living motion */}
      {heroImage && (
        <section className="relative w-full h-[75vh] sm:h-[85vh] overflow-hidden group z-10">
          <img
            src={heroImage.imageUrl}
            alt={heroImage.alt}
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105 cursor-pointer animate-photo-drift-1 group-hover:scale-105 transition-transform duration-1000 ease-out"
            onClick={() => onImageClick(heroImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

          {/* Opening Narrative Badge - Classic Monograph Title Presentation */}
          <div className="absolute bottom-8 sm:bottom-14 left-6 sm:left-12 right-6 sm:right-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl">
              {/* Curatorial Header Plate */}
              <div className="flex items-center gap-3 text-[9.5px] tracking-[0.35em] uppercase text-white/80 mb-2.5 font-mono">
                <span>KRISHNA MONOGRAPH</span>
                <span className="text-white/30">•</span>
                <span>CHAPTER {category.num}</span>
                <span className="text-white/30">•</span>
                <span>PLATE I (HERO FOLIO)</span>
              </div>

              {/* Classic Serif Title */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic text-white leading-[1.08] mb-3.5 drop-shadow-sm tracking-tight font-normal">
                {heroImage.title}
              </h2>

              {/* Literary Story Quote */}
              {heroImage.storyCaption && (
                <p className="text-sm sm:text-base text-white/95 font-serif italic max-w-xl leading-relaxed drop-shadow-xs font-normal border-l-2 border-white/40 pl-3.5 mb-3">
                  “{heroImage.storyCaption}”
                </p>
              )}

              {/* Curatorial Archival Imprint */}
              <div className="flex items-center gap-3 text-[8.5px] font-mono tracking-[0.25em] uppercase text-white/70">
                <span>FORMAT: ARCHIVAL PIGMENT</span>
                <span className="text-white/30">•</span>
                <span>PROVENANCE: {heroImage.location || 'VISAKHAPATNAM'}</span>
                <span className="text-white/30">•</span>
                <span>YEAR {heroImage.year || '2024'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onImageClick(heroImage)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md border border-stone-300 text-stone-900 text-[10px] tracking-[0.22em] uppercase hover:bg-stone-900 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Examine Folio</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Chapter Quote Banner */}
      <div className="max-w-3xl mx-auto text-center pt-20 pb-6 px-6">
        <div className="inline-flex items-center gap-3 text-[9px] tracking-[0.35em] uppercase text-[#7A7373] font-mono mb-4">
          <span className="w-8 h-px bg-[#7A7373]/40" />
          <span>Chapter {category.num} • Curated Monograph</span>
          <span className="w-8 h-px bg-[#7A7373]/40" />
        </div>
        <p className="text-xl sm:text-2xl text-stone-900 font-serif italic font-normal leading-relaxed">
          &ldquo;{category.quote || category.description}&rdquo;
        </p>
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8C8484] block mt-4">
          Visakhapatnam & Global Commissions
        </span>
      </div>

      {/* Editorial Photographic Journey Spreads */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24 space-y-24 sm:space-y-36">
        {/* Spread 1: Asymmetric Staggered Pair */}
        {secondaryImages.length >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Large Frame */}
            <div
              className="md:col-span-7 group cursor-pointer relative overflow-hidden bg-white p-2.5 sm:p-3 border border-stone-300/80 shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_26px_55px_rgba(0,0,0,0.16)] transition-all duration-500"
              onClick={() => onImageClick(secondaryImages[0])}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ECE8E8]">
                <img
                  src={secondaryImages[0].imageUrl}
                  alt={secondaryImages[0].alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-xs text-stone-900 text-[9px] font-mono tracking-[0.25em] uppercase">
                    <Eye className="w-3 h-3" />
                    <span>View Archival Folio</span>
                  </div>
                </div>
              </div>

              {/* Classic Archival Museum Caption Plate */}
              <div className="pt-3.5 pb-1 px-2.5 border-t border-stone-200/90 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-stone-500 mb-1">
                    <span>PLATE II</span>
                    <span className="text-stone-300">•</span>
                    <span>FIG. 1.1</span>
                    <span className="text-stone-300">•</span>
                    <span>{secondaryImages[0].location || 'Visakhapatnam'}</span>
                  </div>
                  <h3 className="font-serif italic text-lg sm:text-xl text-stone-900 tracking-wide font-normal">
                    {secondaryImages[0].title}
                  </h3>
                  {secondaryImages[0].storyCaption && (
                    <p className="font-serif italic text-xs text-stone-600 font-light mt-1 max-w-md line-clamp-2">
                      “{secondaryImages[0].storyCaption}”
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="font-mono text-[8.5px] tracking-[0.22em] uppercase text-stone-500 block">
                    {secondaryImages[0].year || '2024'} EDITION
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-stone-400 block mt-0.5">
                    FINE ART PRINT
                  </span>
                </div>
              </div>
            </div>

            {/* Right Offset Frames */}
            <div className="md:col-span-5 flex flex-col gap-8 md:translate-y-8">
              <div
                className="group cursor-pointer relative overflow-hidden bg-white p-2.5 sm:p-3 border border-stone-300/80 shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_26px_55px_rgba(0,0,0,0.16)] transition-all duration-500"
                onClick={() => onImageClick(secondaryImages[1])}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE8E8]">
                  <img
                    src={secondaryImages[1].imageUrl}
                    alt={secondaryImages[1].alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-stone-900 text-[8.5px] font-mono tracking-[0.22em] uppercase">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Inspect</span>
                    </div>
                  </div>
                </div>

                {/* Classic Archival Museum Caption Plate */}
                <div className="pt-3 pb-1 px-2 border-t border-stone-200/90 flex items-baseline justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[8.5px] tracking-[0.28em] uppercase text-stone-500 mb-0.5">
                      <span>PLATE III</span>
                      <span className="text-stone-300">•</span>
                      <span>FIG. 1.2</span>
                    </div>
                    <h3 className="font-serif italic text-base text-stone-900 tracking-wide font-normal">
                      {secondaryImages[1].title}
                    </h3>
                  </div>
                  <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-stone-400 shrink-0">
                    {secondaryImages[1].location || 'Visakhapatnam'}
                  </span>
                </div>
              </div>

              {secondaryImages.length > 2 && (
                <div
                  className="group cursor-pointer relative overflow-hidden bg-white p-2.5 sm:p-3 border border-stone-300/80 shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_26px_55px_rgba(0,0,0,0.16)] transition-all duration-500"
                  onClick={() => onImageClick(secondaryImages[2])}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE8E8]">
                    <img
                      src={secondaryImages[2].imageUrl}
                      alt={secondaryImages[2].alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = 'true';
                          target.src = 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1200';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-stone-900 text-[8.5px] font-mono tracking-[0.22em] uppercase">
                        <Eye className="w-2.5 h-2.5" />
                        <span>Inspect</span>
                      </div>
                    </div>
                  </div>

                  {/* Classic Archival Museum Caption Plate */}
                  <div className="pt-3 pb-1 px-2 border-t border-stone-200/90 flex items-baseline justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-[8.5px] tracking-[0.28em] uppercase text-stone-500 mb-0.5">
                        <span>PLATE IV</span>
                        <span className="text-stone-300">•</span>
                        <span>FIG. 1.3</span>
                      </div>
                      <h3 className="font-serif italic text-base text-stone-900 tracking-wide font-normal">
                        {secondaryImages[2].title}
                      </h3>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-stone-400 shrink-0">
                      {secondaryImages[2].location || 'Visakhapatnam'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spread 2: Full-Bleed Panoramic Moment */}
        {secondaryImages.length >= 4 && (
          <div
            className="group cursor-pointer relative overflow-hidden bg-white p-2.5 sm:p-3.5 border border-stone-300/80 shadow-[0_20px_45px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_65px_rgba(0,0,0,0.18)] transition-all duration-500"
            onClick={() => onImageClick(secondaryImages[3])}
          >
            <div className="relative aspect-[16/8] sm:aspect-[21/9] overflow-hidden bg-[#ECE8E8]">
              <img
                src={secondaryImages[3].imageUrl}
                alt={secondaryImages[3].alt}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1400';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-[9px] font-mono tracking-[0.32em] uppercase text-white/90 bg-black/60 px-3 py-1 self-start border border-white/20 mb-2">
                  {category.label} • WIDE FOLIO
                </span>

                <div className="max-w-xl">
                  <h3 className="text-2xl sm:text-4xl font-serif italic mb-1 text-white tracking-tight">
                    {secondaryImages[3].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 font-serif italic font-light leading-relaxed">
                    {secondaryImages[3].storyCaption}
                  </p>
                </div>
              </div>
            </div>

            {/* Classic Archival Panoramic Caption Plate */}
            <div className="pt-3.5 pb-1 px-3 border-t border-stone-200/90 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.32em] uppercase text-stone-500 mb-1">
                  <span>FOLIO V</span>
                  <span className="text-stone-300">•</span>
                  <span>PANORAMIC CHRONICLE</span>
                  <span className="text-stone-300">•</span>
                  <span>CHAPTER {category.num}</span>
                </div>
                <h3 className="font-serif italic text-xl sm:text-2xl text-stone-900 tracking-wide font-normal">
                  {secondaryImages[3].title}
                </h3>
                {secondaryImages[3].storyCaption && (
                  <p className="font-serif italic text-xs sm:text-sm text-stone-600 font-light mt-1.5 max-w-2xl leading-relaxed">
                    “{secondaryImages[3].storyCaption}”
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-stone-600 block">
                  {secondaryImages[3].location || 'Visakhapatnam'}
                </span>
                <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-stone-400 block mt-0.5">
                  65MM COMPOSITION • MMXXIV
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Spread 3: Remaining Gallery frames */}
        {secondaryImages.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {secondaryImages.slice(4).map((img, idx) => (
              <div
                key={img.id}
                className="group cursor-pointer relative overflow-hidden bg-white p-2.5 sm:p-3 border border-stone-300/80 shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_22px_45px_rgba(0,0,0,0.16)] transition-all duration-500"
                onClick={() => onImageClick(img)}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#ECE8E8]">
                  <img
                    src={img.imageUrl}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=1200';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-stone-900 text-[8px] font-mono tracking-[0.22em] uppercase">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Examine Frame</span>
                    </div>
                  </div>
                </div>

                {/* Classic Archival Folio Caption Plate */}
                <div className="pt-2.5 pb-1 px-2 border-t border-stone-200/90 flex items-baseline justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[8.5px] tracking-[0.28em] uppercase text-stone-500 mb-0.5">
                      <span>FIG. 0{idx + 5}</span>
                      <span className="text-stone-300">•</span>
                      <span>{img.location || 'Studio Archive'}</span>
                    </div>
                    <h3 className="font-serif italic text-base text-stone-900 tracking-wide font-normal line-clamp-1">
                      {img.title}
                    </h3>
                    {img.storyCaption && (
                      <p className="font-serif italic text-[11px] text-stone-500 font-light line-clamp-1 mt-0.5">
                        “{img.storyCaption}”
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-stone-400 shrink-0 self-start mt-0.5">
                    {img.year || '2024'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Chapter Outro & Nav Links */}
      <section className="relative z-10 py-20 border-t border-[#1F1F1F]/15 px-6 sm:px-12 max-w-5xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.38em] uppercase text-[#7A7373] block mb-2 font-mono">
          End of Chapter {category.num}
        </span>
        <h3 className="text-2xl sm:text-4xl font-serif italic text-[#1F1F1F] mb-3 tracking-tight">
          Continue Through The Exhibition
        </h3>
        <p className="text-xs sm:text-sm text-[#736B6B] font-serif italic mb-8 max-w-md mx-auto">
          Explore the next chapter of visual archives or return to the main architectural installation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            prefetch={true}
            className="w-full sm:w-auto px-7 py-3.5 border border-[#1F1F1F]/30 hover:border-[#1F1F1F] bg-white/70 hover:bg-[#1F1F1F] text-[#1F1F1F] hover:text-[#ECE8E8] text-[10px] tracking-[0.22em] uppercase font-medium transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>STILL / STUDIO HOME</span>
          </Link>

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-7 py-3.5 border border-[#1F1F1F] text-[#1F1F1F] text-[10px] tracking-[0.25em] uppercase font-medium hover:bg-[#1F1F1F] hover:text-[#ECE8E8] transition-all cursor-pointer shadow-xs"
          >
            Return to Exhibition
          </button>

          <button
            onClick={() => onSelectCategory(nextCategory.key)}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#1F1F1F] text-[#ECE8E8] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Next: {nextCategory.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
