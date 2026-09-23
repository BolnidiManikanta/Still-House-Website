"use client";

import React from 'react';
import { CATEGORIES } from '../data/portfolioData';
import { Grid } from 'lucide-react';

interface LeftChaptersControlProps {
  activeCategory: string | null;
  onSelectCategory: (key: string) => void;
  hoveredCategory?: string | null;
  setHoveredCategory?: (key: string | null) => void;
}

export const LeftChaptersControl: React.FC<LeftChaptersControlProps> = ({
  activeCategory,
  onSelectCategory,
  hoveredCategory,
  setHoveredCategory,
}) => {
  return (
    <div
      id="chapters-left-navigation"
      className="fixed left-8 sm:left-12 top-[26%] z-30 select-none pointer-events-auto hidden md:block"
    >
      {/* 1. CHAPTERS 08 Badge Button */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#1F1F1F] text-[#ECE8E8] text-[10px] tracking-[0.28em] font-mono shadow-xs border border-[#1F1F1F]">
          <Grid className="w-3 h-3 text-[#ADAAAA]" />
          <span className="font-medium tracking-[0.28em]">CHAPTERS</span>
          <span className="text-[#ADAAAA] font-mono tracking-widest text-[9.5px]">/ 08</span>
        </div>
      </div>

      {/* 2. Category Chapters List with elevated editorial typography */}
      <div className="relative py-1">
        <div className="space-y-3.5">
          {CATEGORIES.map((cat) => {
            const isHovered = hoveredCategory === cat.key;
            const isActive = activeCategory === cat.key;

            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                onMouseEnter={() => setHoveredCategory && setHoveredCategory(cat.key)}
                onMouseLeave={() => setHoveredCategory && setHoveredCategory(null)}
                className="group flex items-center gap-3 text-left cursor-pointer focus:outline-none transition-all duration-300 py-0.5"
              >
                {/* Number 01 - 08 */}
                <span
                  className={`font-mono text-[10px] tracking-[0.25em] transition-colors duration-300 ${
                    isActive
                      ? 'text-[#1F1F1F] font-bold'
                      : isHovered
                      ? 'text-[#1F1F1F] font-semibold'
                      : 'text-[#9A9393] group-hover:text-[#1F1F1F]'
                  }`}
                >
                  {cat.num}
                </span>

                {/* Delicate connecting rule */}
                <span
                  className={`h-px transition-all duration-300 ${
                    isActive
                      ? 'w-3.5 bg-[#1F1F1F]'
                      : isHovered
                      ? 'w-2.5 bg-[#1F1F1F]/60'
                      : 'w-1 bg-[#1F1F1F]/15 group-hover:w-2 group-hover:bg-[#1F1F1F]/40'
                  }`}
                />

                {/* Chapter Title */}
                <span
                  className={`text-[11px] tracking-[0.24em] font-sans uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-[#1F1F1F] font-semibold translate-x-0.5'
                      : isHovered
                      ? 'text-[#1F1F1F] font-medium translate-x-0.5'
                      : 'text-[#7D7676] group-hover:text-[#1F1F1F]'
                  }`}
                >
                  {cat.label}
                </span>

                {/* Subtle active / hover serif tag */}
                <span
                  className={`font-serif italic text-[11px] text-[#635E5E] tracking-normal transition-all duration-300 overflow-hidden whitespace-nowrap hidden lg:inline ${
                    isActive || isHovered
                      ? 'opacity-100 max-w-28 translate-x-0'
                      : 'opacity-0 max-w-0 -translate-x-1'
                  }`}
                >
                  — {cat.subtitle.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
