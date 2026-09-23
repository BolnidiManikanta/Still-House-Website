"use client";

import React from 'react';
import { PORTFOLIO_IMAGES, PortfolioImage } from '../data/portfolioData';
import { Eye, ArrowUpRight } from 'lucide-react';

interface FeaturedPortfolioProps {
  onImageClick: (image: PortfolioImage) => void;
  onCategoryClick: (categoryKey: string) => void;
}

export const FeaturedPortfolio: React.FC<FeaturedPortfolioProps> = ({
  onImageClick,
  onCategoryClick,
}) => {
  const featuredImages = PORTFOLIO_IMAGES.filter((img) => img.featured);

  return (
    <section id="featured" className="py-16 sm:py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-black/10 gap-6">
        <div>
          <span className="text-[10px] sm:text-[11px] tracking-[0.3em] font-semibold uppercase text-black/50 block mb-2">
            Curated Highlights • 2024–2025
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] font-serif leading-tight">
            Stories That Stay With You
          </h2>
        </div>
        <p className="text-sm sm:text-base text-black/60 font-light font-serif italic max-w-md leading-relaxed">
          &ldquo;From intimate beginnings to grand celebrations, every story deserves to be remembered beautifully.&rdquo;
        </p>
      </div>

      {/* Editorial Rhythm Grid (Asymmetrical Magazine Spread) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Item 1: Large Dominant Portrait (Col 1-7, Span 7) */}
        {featuredImages[0] && (
          <div
            id={`featured-card-${featuredImages[0].id}`}
            onClick={() => onImageClick(featuredImages[0])}
            className="md:col-span-7 group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5 transition-all duration-500"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
              <img
                src={featuredImages[0].imageUrl}
                alt={featuredImages[0].alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white pointer-events-none">
                <div className="flex justify-between items-start">
                  <span className="inline-block px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/20 text-[9px] tracking-[0.25em] uppercase font-medium">
                    {featuredImages[0].categoryName}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 block mb-1">
                    {featuredImages[0].location}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light font-serif italic text-white mb-2 leading-snug">
                    {featuredImages[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-light max-w-lg leading-relaxed line-clamp-2">
                    {featuredImages[0].storyCaption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Stack: Two Medium Vertical Images (Col 8-12, Span 5) */}
        <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
          {featuredImages[1] && (
            <div
              id={`featured-card-${featuredImages[1].id}`}
              onClick={() => onImageClick(featuredImages[1])}
              className="group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5 transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={featuredImages[1].imageUrl}
                  alt={featuredImages[1].alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-2.5 py-0.5 bg-black/40 backdrop-blur-sm border border-white/20 text-[9px] tracking-[0.2em] uppercase font-medium">
                      {featuredImages[1].categoryName}
                    </span>
                    <Eye className="w-4 h-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div>
                    <h3 className="text-xl font-light font-serif italic text-white mb-1">
                      {featuredImages[1].title}
                    </h3>
                    <p className="text-xs text-white/80 font-light line-clamp-2">
                      {featuredImages[1].storyCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Minimal Editorial Quote Box */}
          <div className="p-6 sm:p-8 bg-[#F7F5F0] border border-black/5 flex flex-col justify-center">
            <span className="text-[9px] tracking-[0.3em] uppercase text-black/50 block mb-2 font-semibold">
              The Krishna Philosophy
            </span>
            <p className="text-base font-serif italic text-[#1A1A1A] leading-relaxed mb-4">
              &ldquo;We step lightly, listen intently, and let your sacred moments unfold without interruption.&rdquo;
            </p>
            <span className="text-[10px] tracking-[0.2em] uppercase text-black/40">
              Krishna Studio • Visakhapatnam
            </span>
          </div>
        </div>

        {/* Item 3: Full-width Cinematic Panorama (Span 12) */}
        {featuredImages[2] && (
          <div
            id={`featured-card-${featuredImages[2].id}`}
            onClick={() => onImageClick(featuredImages[2])}
            className="md:col-span-12 group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5 transition-all duration-500 mt-2"
          >
            <div className="relative aspect-[16/8] sm:aspect-[21/9] overflow-hidden">
              <img
                src={featuredImages[2].imageUrl}
                alt={featuredImages[2].alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between text-white pointer-events-none">
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/20 text-[9px] tracking-[0.25em] uppercase font-medium">
                    {featuredImages[2].categoryName} • Cinematic Horizon
                  </span>
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Story</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="max-w-2xl">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 block mb-1">
                    {featuredImages[2].location} • {featuredImages[2].year}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-light font-serif italic text-white mb-2 leading-tight">
                    {featuredImages[2].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed max-w-xl">
                    {featuredImages[2].storyCaption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items 4, 5, 6: 3 Balanced Editorial Columns (Col 1-4, 5-8, 9-12) */}
        {featuredImages.slice(3, 6).map((img, idx) => (
          <div
            key={img.id}
            id={`featured-card-${img.id}`}
            onClick={() => onImageClick(img)}
            className="md:col-span-4 group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5 transition-all duration-500"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={img.imageUrl}
                alt={img.alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white pointer-events-none">
                <div className="flex justify-between items-start">
                  <span className="inline-block px-2 py-0.5 bg-black/40 backdrop-blur-sm border border-white/20 text-[9px] tracking-[0.18em] uppercase font-medium">
                    {img.categoryName}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <h3 className="text-lg font-light font-serif italic text-white mb-1">
                    {img.title}
                  </h3>
                  <p className="text-[11px] text-white/80 font-light line-clamp-2">
                    {img.storyCaption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
