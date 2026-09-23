"use client";

import React from 'react';
import { CategoryInfo, PortfolioImage } from '../data/portfolioData';
import { Eye, ArrowUpRight, Calendar, MapPin } from 'lucide-react';

interface CategorySectionProps {
  category: CategoryInfo;
  images: PortfolioImage[];
  onImageClick: (image: PortfolioImage) => void;
  onInquireCategory: (categoryKey: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  images,
  onImageClick,
  onInquireCategory,
}) => {
  return (
    <section
      id={`category-section-${category.key}`}
      className="py-16 sm:py-24 border-t border-black/10 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Category Header with Editorial Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono font-medium tracking-[0.2em] text-black/40">
                {category.num}
              </span>
              <span className="w-8 h-px bg-black/20" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] font-medium uppercase text-black/50">
                {category.subtitle}
              </span>
            </div>

            <h2
              id={`heading-${category.key}`}
              className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] font-serif tracking-tight uppercase leading-tight"
            >
              {category.label}
            </h2>

            <p className="text-sm sm:text-base text-black/65 font-light leading-relaxed mt-3 max-w-xl">
              {category.description}
            </p>
          </div>

          {/* Category Action Link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              id={`btn-inquire-${category.key}`}
              onClick={() => onInquireCategory(category.label)}
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium text-black border-b border-black pb-1 hover:opacity-60 transition-opacity cursor-pointer"
            >
              <span>Enquire for {category.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editorial Layout: Asymmetric Rhythm Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Prominent Portrait (Col 1-5 or 1-6) */}
          {images[0] && (
            <div
              id={`image-card-${images[0].id}`}
              onClick={() => onImageClick(images[0])}
              className="md:col-span-6 lg:col-span-5 group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={images[0].imageUrl}
                  alt={images[0].alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/80 bg-black/30 backdrop-blur-sm px-2.5 py-1 border border-white/10">
                      {category.label}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div>
                    {images[0].location && (
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 block mb-1">
                        {images[0].location}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-light font-serif italic text-white mb-1">
                      {images[0].title}
                    </h3>
                    <p className="text-xs text-white/80 font-light line-clamp-2">
                      {images[0].storyCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 2 & 3: Stacked Right Grid (Col 7-12) */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            {images[1] && (
              <div
                id={`image-card-${images[1].id}`}
                onClick={() => onImageClick(images[1])}
                className="group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5"
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                  <img
                    src={images[1].imageUrl}
                    alt={images[1].alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white pointer-events-none">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] tracking-[0.2em] uppercase text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 border border-white/10">
                        {category.label}
                      </span>
                      <Eye className="w-4 h-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div>
                      {images[1].location && (
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 block mb-1">
                          {images[1].location}
                        </span>
                      )}
                      <h3 className="text-xl font-light font-serif italic text-white mb-1">
                        {images[1].title}
                      </h3>
                      <p className="text-xs text-white/80 font-light line-clamp-2">
                        {images[1].storyCaption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Split row for Card 3 & Category Quote card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {images[2] && (
                <div
                  id={`image-card-${images[2].id}`}
                  onClick={() => onImageClick(images[2])}
                  className="group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={images[2].imageUrl}
                      alt={images[2].alt}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white pointer-events-none">
                      <h3 className="text-base font-light font-serif italic text-white mb-0.5">
                        {images[2].title}
                      </h3>
                      <p className="text-[11px] text-white/75 font-light line-clamp-1">
                        {images[2].storyCaption}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Editorial Quote Card */}
              <div className="p-6 bg-[#F8F6F2] border border-black/5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-black/40 block mb-3 font-semibold">
                    Studio Note • {category.label}
                  </span>
                  <p className="text-sm sm:text-base font-serif italic text-[#1A1A1A] leading-relaxed">
                    &ldquo;{category.quote || category.description}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] tracking-[0.15em] uppercase text-black/50">
                  <span>Krishna Photography</span>
                  <button
                    onClick={() => onInquireCategory(category.label)}
                    className="hover:text-black transition-colors underline cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 (Cinematic / Full width if present) */}
          {images[3] && (
            <div
              id={`image-card-${images[3].id}`}
              onClick={() => onImageClick(images[3])}
              className="md:col-span-12 group cursor-pointer relative overflow-hidden bg-stone-100 border border-black/5 mt-2"
            >
              <div className="relative aspect-[16/8] sm:aspect-[21/8] overflow-hidden">
                <img
                  src={images[3].imageUrl}
                  alt={images[3].alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 border border-white/20">
                      {category.label} • Frame
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Expand Lightbox</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="max-w-xl">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 block mb-1">
                      {images[3].location} • Krishna Studio
                    </span>
                    <h3 className="text-xl sm:text-2xl font-light font-serif italic text-white mb-1">
                      {images[3].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 font-light">
                      {images[3].storyCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
