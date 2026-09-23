"use client";

import React, { useMemo, useRef, useEffect } from 'react';
import { CategoryInfo, PortfolioImage, CATEGORIES, PORTFOLIO_IMAGES } from '../data/portfolioData';
import { Eye } from 'lucide-react';

interface CentralExhibitionShowcaseProps {
  selectedCategoryKey: string;
  onSelectCategory: (key: string) => void;
  hoveredCategory: string | null;
  onOpenLightbox: (image: PortfolioImage) => void;
  onEnterStory?: (categoryKey: string) => void;
  mousePosition?: { x: number; y: number };
}

export const CentralExhibitionShowcase: React.FC<CentralExhibitionShowcaseProps> = ({
  selectedCategoryKey,
  onSelectCategory: _onSelectCategory,
  hoveredCategory,
  onOpenLightbox,
  onEnterStory: _onEnterStory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Decoupled GPU-accelerated cursor tracking: sets CSS variables directly on container element
  // with zero React component re-renders!
  useEffect(() => {
    let animFrame: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (!animFrame) {
        animFrame = requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.setProperty('--nx', targetX.toFixed(4));
            containerRef.current.style.setProperty('--ny', targetY.toFixed(4));
          }
          animFrame = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  // Active chapter information
  const activeKey = hoveredCategory || selectedCategoryKey;
  const categoryInfo: CategoryInfo =
    CATEGORIES.find((c) => c.key === activeKey) || CATEGORIES[0];

  // Images for this category
  const categoryImages = useMemo(() => {
    return PORTFOLIO_IMAGES.filter((img) => img.category === categoryInfo.key);
  }, [categoryInfo.key]);

  // Complement with curated portfolio images so all 7 slots are populated with 100% distinct images
  const displayImages = useMemo(() => {
    const list: PortfolioImage[] = [];
    const seenIds = new Set<string>();
    const seenUrls = new Set<string>();

    const addImage = (img: PortfolioImage) => {
      if (!seenIds.has(img.id) && !seenUrls.has(img.imageUrl)) {
        seenIds.add(img.id);
        seenUrls.add(img.imageUrl);
        list.push(img);
        return true;
      }
      return false;
    };

    // 1. Primary category images first
    for (const img of categoryImages) {
      addImage(img);
    }

    // 2. Complement with other distinct portfolio images until we have at least 7 unique frames
    if (list.length < 7) {
      for (const img of PORTFOLIO_IMAGES) {
        addImage(img);
        if (list.length >= 7) break;
      }
    }

    return list;
  }, [categoryImages]);

  // Assign images to the 7 key compositional positions with guaranteed distinct photos
  const imgLeftArch = displayImages[0];
  const imgTopCenterSquare = displayImages[1];
  const imgTopRightVertical = displayImages[2];
  const imgBottomRightGrand = displayImages[3];
  const imgMidRightAmbient = displayImages[4];
  const imgTopLeftPeek = displayImages[5];
  const imgBottomCenterPeek = displayImages[6];

  return (
    <div
      ref={containerRef}
      id="central-exhibition-showcase"
      className="relative w-full h-full min-h-screen overflow-hidden flex items-center justify-center select-none"
    >
      {/* ============================================================
          SCATTERED FLOATING IMAGES (MATCHING 25 RESIDENCES DOWNTOWN)
          ============================================================ */}

      {/* 1. TOP-LEFT PEEK FRAME (Subtle architectural header crop) */}
      {imgTopLeftPeek && (
        <div
          style={{
            transform: 'translate3d(calc(var(--nx, 0) * -24px), calc(var(--ny, 0) * -18px), 0)',
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute left-[1%] sm:left-[2.5%] top-[8%] sm:top-[10%] lg:top-[12%] z-10 pointer-events-auto"
        >
          <div
            onClick={() => onOpenLightbox(imgTopLeftPeek)}
            className="animate-float-3 group cursor-pointer w-28 sm:w-40 md:w-48 lg:w-56 aspect-[16/10] bg-white p-1.5 sm:p-2 border border-[#1F1F1F]/10 shadow-[0_12px_28px_rgba(31,31,31,0.06)] hover:shadow-[0_22px_45px_rgba(31,31,31,0.16)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#ECE8E8]">
              <img
                src={imgTopLeftPeek.imageUrl}
                alt={imgTopLeftPeek.alt}
                loading="eager"
                className="w-full h-full object-cover filter brightness-[0.98] animate-photo-drift-1 group-hover:scale-108 group-hover:animate-none transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
                  }
                }}
              />
              {/* Classic Archival Museum Placard */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-between p-2.5 sm:p-3 opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-between text-white/80 font-mono text-[7px] sm:text-[7.5px] tracking-[0.25em] uppercase">
                  <span>PL. 01 / VIII</span>
                  <span>CH. {categoryInfo.num}</span>
                </div>
                <div>
                  <h4 className="font-serif italic text-white text-[10px] sm:text-xs drop-shadow-xs line-clamp-1 font-normal">
                    {imgTopLeftPeek.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-white/75 font-mono text-[6.5px] sm:text-[7px] tracking-[0.2em] uppercase mt-1 pt-1 border-t border-white/20">
                    <Eye className="w-2.5 h-2.5" />
                    <span>Inspect Folio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEFT ARCHED ART DECO FRAME (Matches iconic arched interior in 25 Residences screenshot) */}
      {imgLeftArch && (
        <div
          style={{
            transform: 'translate3d(calc(var(--nx, 0) * -36px), calc(var(--ny, 0) * 26px), 0)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute left-[3%] sm:left-[8%] lg:left-[11%] xl:left-[13%] bottom-[12%] sm:bottom-[16%] lg:bottom-[18%] z-15 pointer-events-auto"
        >
          <div
            onClick={() => onOpenLightbox(imgLeftArch)}
            className="animate-float-1 group cursor-pointer w-44 sm:w-56 md:w-64 lg:w-72 aspect-[3/4] bg-white p-2.5 sm:p-3 border border-[#1F1F1F]/12 shadow-[0_24px_55px_rgba(31,31,31,0.09)] hover:shadow-[0_36px_75px_rgba(31,31,31,0.20)] hover:scale-[1.025] active:scale-95 transition-all duration-300 rounded-t-[70px] sm:rounded-t-[90px] md:rounded-t-[110px]"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#ECE8E8] rounded-t-[60px] sm:rounded-t-[80px] md:rounded-t-[100px]">
              <img
                src={imgLeftArch.imageUrl}
                alt={imgLeftArch.alt}
                loading="eager"
                className="w-full h-full object-cover filter brightness-[0.98] animate-photo-drift-2 group-hover:scale-108 group-hover:animate-none transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200';
                  }
                }}
              />
              {/* Classic Archival Museum Placard */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-between p-4 sm:p-5 opacity-0 group-hover:opacity-100 rounded-t-[60px] sm:rounded-t-[80px] md:rounded-t-[100px]">
                <div className="flex items-center justify-between text-white/80 font-mono text-[8px] sm:text-[8.5px] tracking-[0.28em] uppercase pt-2">
                  <span>PLATE II • ARCHIVAL</span>
                  <span>CH. {categoryInfo.num}</span>
                </div>
                <div>
                  <h4 className="font-serif italic text-white text-sm sm:text-base drop-shadow-xs font-normal leading-snug">
                    {imgLeftArch.title}
                  </h4>
                  <p className="text-[8.5px] font-mono tracking-[0.24em] uppercase text-white/70 mt-1">
                    {imgLeftArch.location || 'Visakhapatnam'} • {imgLeftArch.year || '2024'}
                  </p>
                  <div className="flex items-center gap-1.5 text-white/85 font-mono text-[8px] tracking-[0.22em] uppercase mt-2.5 pt-2 border-t border-white/20">
                    <Eye className="w-3 h-3" />
                    <span>Examine Archival Print</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 3. TOP-CENTER SQUARE FRAMED WORK (Matches upper middle framed room in screenshot) */}
      {imgTopCenterSquare && (
        <div
          style={{
            transform: 'translate3d(calc(-50% + var(--nx, 0) * 22px), calc(var(--ny, 0) * -28px), 0)',
            transition: 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute left-1/2 top-[10%] sm:top-[12%] lg:top-[14%] z-10 pointer-events-auto"
        >
          <div
            onClick={() => onOpenLightbox(imgTopCenterSquare)}
            className="animate-float-2 group cursor-pointer w-36 sm:w-48 md:w-56 lg:w-60 aspect-square bg-white p-2 sm:p-2.5 border border-[#1F1F1F]/10 shadow-[0_16px_40px_rgba(31,31,31,0.07)] hover:shadow-[0_28px_55px_rgba(31,31,31,0.18)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#ECE8E8]">
              <img
                src={imgTopCenterSquare.imageUrl}
                alt={imgTopCenterSquare.alt}
                loading="eager"
                className="w-full h-full object-cover filter brightness-[0.98] animate-photo-drift-3 group-hover:scale-108 group-hover:animate-none transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200';
                  }
                }}
              />
              {/* Classic Archival Museum Placard */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-between text-white/80 font-mono text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase">
                  <span>PLATE III</span>
                  <span>ED. MMXXIV</span>
                </div>
                <div>
                  <h4 className="font-serif italic text-white text-xs sm:text-sm drop-shadow-xs line-clamp-1 font-normal">
                    {imgTopCenterSquare.title}
                  </h4>
                  <div className="flex items-center justify-between text-white/70 font-mono text-[7.5px] tracking-[0.2em] uppercase mt-1 pt-1 border-t border-white/20">
                    <span>{imgTopCenterSquare.location || 'Visakhapatnam'}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Inspect</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOP-RIGHT VERTICAL TALL FRAME (Matches bedroom/window frame in screenshot) */}
      {imgTopRightVertical && (
        <div
          style={{
            transform: 'translate3d(calc(var(--nx, 0) * 30px), calc(var(--ny, 0) * -22px), 0)',
            transition: 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute right-[8%] sm:right-[14%] lg:right-[18%] top-[8%] sm:top-[11%] lg:top-[13%] z-10 pointer-events-auto"
        >
          <div
            onClick={() => onOpenLightbox(imgTopRightVertical)}
            className="animate-float-4 group cursor-pointer w-32 sm:w-40 md:w-48 lg:w-52 aspect-[3/4] bg-white p-2 sm:p-2.5 border border-[#1F1F1F]/10 shadow-[0_18px_45px_rgba(31,31,31,0.08)] hover:shadow-[0_30px_60px_rgba(31,31,31,0.18)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#ECE8E8]">
              <img
                src={imgTopRightVertical.imageUrl}
                alt={imgTopRightVertical.alt}
                loading="eager"
                className="w-full h-full object-cover filter brightness-[0.98] animate-photo-drift-1 group-hover:scale-108 group-hover:animate-none transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200';
                  }
                }}
              />
              {/* Classic Archival Museum Placard */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-between text-white/80 font-mono text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase">
                  <span>PLATE IV</span>
                  <span>CH. {categoryInfo.num}</span>
                </div>
                <div>
                  <h4 className="font-serif italic text-white text-xs sm:text-sm drop-shadow-xs line-clamp-1 font-normal">
                    {imgTopRightVertical.title}
                  </h4>
                  <div className="flex items-center justify-between text-white/70 font-mono text-[7.5px] tracking-[0.2em] uppercase mt-1 pt-1 border-t border-white/20">
                    <span>{imgTopRightVertical.location || 'Visakhapatnam'}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Inspect</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MID-RIGHT AMBIENT FRAME (Atmospheric receding depth) */}
      {imgMidRightAmbient && (
        <div
          style={{
            transform: 'translate3d(calc(var(--nx, 0) * 18px), calc(var(--ny, 0) * 18px), 0)',
            transition: 'transform 0.52s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="hidden sm:block absolute right-[22%] sm:right-[26%] lg:right-[28%] xl:right-[32%] top-[38%] lg:top-[40%] xl:top-[44%] z-5 pointer-events-auto opacity-80 hover:opacity-100 transition-opacity"
        >
          <div
            onClick={() => onOpenLightbox(imgMidRightAmbient)}
            className="animate-float-3 group cursor-pointer w-24 sm:w-28 lg:w-36 aspect-[3/4] bg-white p-1.5 border border-[#1F1F1F]/8 shadow-[0_12px_30px_rgba(31,31,31,0.05)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#ECE8E8]">
              <img
                src={imgMidRightAmbient.imageUrl}
                alt={imgMidRightAmbient.alt}
                loading="lazy"
                className="w-full h-full object-cover filter brightness-[0.95] animate-photo-drift-2 group-hover:scale-108 group-hover:animate-none transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=1200';
                  }
                }}
              />
              {/* Classic Archival Museum Placard */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-between p-2.5 opacity-0 group-hover:opacity-100">
                <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/80">PL. V</span>
                <h4 className="font-serif italic text-white text-[10px] sm:text-xs line-clamp-1 font-normal">
                  {imgMidRightAmbient.title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. BOTTOM-RIGHT GRAND VERTICAL ENTRANCE (Matches large hallway on right overlapping title) */}
      {imgBottomRightGrand && (
        <div
          style={{
            transform: 'translate3d(calc(var(--nx, 0) * 36px), calc(var(--ny, 0) * 28px), 0)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute right-[4%] sm:right-[7%] lg:right-[9%] xl:right-[11%] bottom-[6%] sm:bottom-[9%] lg:bottom-[11%] z-25 pointer-events-auto"
        >
          <div
            onClick={() => onOpenLightbox(imgBottomRightGrand)}
            className="animate-float-2 group cursor-pointer w-44 sm:w-56 md:w-68 lg:w-80 xl:w-92 aspect-[2/3] bg-white p-2.5 sm:p-3.5 border border-[#1F1F1F]/14 shadow-[0_28px_65px_rgba(31,31,31,0.12)] hover:shadow-[0_42px_85px_rgba(31,31,31,0.24)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#ECE8E8]">
              <img
                src={imgBottomRightGrand.imageUrl}
                alt={imgBottomRightGrand.alt}
                loading="eager"
                className="w-full h-full object-cover filter brightness-[0.98] animate-photo-drift-3 group-hover:scale-108 group-hover:animate-none transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200';
                  }
                }}
              />
              {/* Classic Archival Museum Placard */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/65 transition-all duration-300 flex flex-col justify-between p-4 sm:p-6 opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-between text-white/90 font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.3em] uppercase">
                  <span>PLATE VI • GRAND FOLIO</span>
                  <span>EDITION MMXXIV</span>
                </div>
                <div>
                  <span className="text-[8px] sm:text-[8.5px] font-mono tracking-[0.25em] uppercase text-white/70 block mb-1">
                    {categoryInfo.label} • CHAPTER {categoryInfo.num}
                  </span>
                  <h4 className="font-serif italic text-white text-base sm:text-xl drop-shadow-xs leading-snug font-normal">
                    {imgBottomRightGrand.title}
                  </h4>
                  {imgBottomRightGrand.storyCaption && (
                    <p className="font-serif italic text-white/85 text-[11px] sm:text-xs mt-1.5 line-clamp-2 leading-relaxed font-light">
                      “{imgBottomRightGrand.storyCaption}”
                    </p>
                  )}
                  <div className="flex items-center justify-between text-white/70 font-mono text-[8px] tracking-[0.22em] uppercase mt-3 pt-2.5 border-t border-white/20">
                    <span>{imgBottomRightGrand.location || 'Visakhapatnam'}</span>
                    <span className="flex items-center gap-1.5 text-white">
                      <Eye className="w-3 h-3" />
                      <span>Expand Folio</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM-CENTER PEEK FRAME (Architectural floor / bottom element) */}
      {imgBottomCenterPeek && (
        <div
          style={{
            transform: 'translate3d(calc(-50% + var(--nx, 0) * 16px), calc(var(--ny, 0) * 30px), 0)',
            transition: 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute left-1/2 bottom-[-4%] sm:bottom-[-2%] lg:bottom-[0%] z-10 pointer-events-auto"
        >
          <div
            onClick={() => onOpenLightbox(imgBottomCenterPeek)}
            className="animate-float-1 group cursor-pointer w-40 sm:w-52 md:w-60 lg:w-68 aspect-[16/7] bg-white p-1.5 sm:p-2 border border-[#1F1F1F]/10 shadow-[0_14px_35px_rgba(31,31,31,0.06)] hover:shadow-[0_26px_50px_rgba(31,31,31,0.14)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#ECE8E8]">
              <img
                src={imgBottomCenterPeek.imageUrl}
                alt={imgBottomCenterPeek.alt}
                loading="eager"
                className="w-full h-full object-cover filter brightness-[0.98] animate-photo-drift-1 group-hover:scale-108 group-hover:animate-none transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000';
                  }
                }}
              />
              {/* Classic Archival Museum Placard */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-between p-2.5 sm:p-3 opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-between text-white/80 font-mono text-[7.5px] tracking-[0.25em] uppercase">
                  <span>PLATE VII</span>
                  <span>{imgBottomCenterPeek.location || 'Visakhapatnam'}</span>
                </div>
                <h4 className="font-serif italic text-white text-xs sm:text-sm drop-shadow-xs line-clamp-1 font-normal">
                  {imgBottomCenterPeek.title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
