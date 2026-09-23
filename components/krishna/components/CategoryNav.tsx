"use client";

import React, { useRef } from 'react';
import { CATEGORIES } from '../data/portfolioData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (categoryKey: string) => void;
  viewMode: 'all' | 'filtered';
  onToggleViewMode: (mode: 'all' | 'filtered') => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  viewMode,
  onToggleViewMode,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="category-navigation-section"
      className="sticky top-20 z-30 bg-[#FDFCFB]/95 backdrop-blur-md border-t border-b border-black/10 py-3 sm:py-4 px-4 sm:px-8 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Scroll Left Button for Mobile */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Scroll categories left"
          className="sm:hidden p-1 text-black/40 hover:text-black focus:outline-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Categories List */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* "ALL" option */}
          <button
            id="cat-nav-all"
            onClick={() => {
              onSelectCategory('all');
              onToggleViewMode('all');
            }}
            className={`flex-none text-[10px] sm:text-[11px] tracking-[0.18em] uppercase transition-all duration-200 cursor-pointer whitespace-nowrap pb-1 ${
              activeCategory === 'all'
                ? 'font-bold text-black border-b-2 border-black opacity-100'
                : 'font-medium text-black/45 hover:text-black/80 hover:opacity-100'
            }`}
          >
            All Stories
          </button>

          {/* 8 Specific Categories */}
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                id={`cat-nav-${cat.key}`}
                onClick={() => {
                  onSelectCategory(cat.key);
                }}
                className={`flex-none text-[10px] sm:text-[11px] tracking-[0.18em] uppercase transition-all duration-200 cursor-pointer whitespace-nowrap pb-1 flex items-center gap-1.5 ${
                  isActive
                    ? 'font-bold text-black border-b-2 border-black opacity-100'
                    : 'font-medium text-black/45 hover:text-black/80 hover:opacity-100'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[8px] font-sans transition-opacity ${
                    isActive ? 'opacity-80 text-black' : 'opacity-40 text-black/40'
                  }`}
                >
                  {cat.num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button for Mobile */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Scroll categories right"
          className="sm:hidden p-1 text-black/40 hover:text-black focus:outline-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Filter / Jump Mode Toggle */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-black/10 text-[9px] tracking-[0.2em] uppercase text-black/50">
          <span className="font-sans">Index</span>
          <span className="text-black/25">/</span>
          <span className="text-black/80 font-medium">8 Categories</span>
        </div>
      </div>
    </nav>
  );
};
