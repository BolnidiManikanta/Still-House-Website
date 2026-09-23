"use client";

import React from 'react';

interface ExhibitionPeripheralsProps {
  currentCategoryIndex: number;
  totalCategories: number;
  onNavigateSection?: (section: string) => void;
}

export const ExhibitionPeripherals: React.FC<ExhibitionPeripheralsProps> = ({
  currentCategoryIndex,
  totalCategories,
  onNavigateSection,
}) => {
  const formattedIndex = String(currentCategoryIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalCategories).padStart(2, '0');

  return (
    <>
      {/* 1. Top-Right Vertical Editorial Links (Exact placement from image.png) */}
      <div
        id="top-right-editorial-links"
        className="fixed top-28 right-8 sm:right-12 z-30 select-none text-right hidden lg:block pointer-events-auto"
      >
        <div className="flex flex-col items-end space-y-2.5 font-mono text-[9.5px] tracking-[0.28em] uppercase text-[#928B8B]">
          <button
            onClick={() => onNavigateSection && onNavigateSection('photographs')}
            className="hover:text-[#1F1F1F] transition-colors cursor-pointer text-right"
          >
            Photographs
          </button>
          <button
            onClick={() => onNavigateSection && onNavigateSection('stories')}
            className="hover:text-[#1F1F1F] transition-colors cursor-pointer text-right"
          >
            Stories
          </button>
          <button
            onClick={() => onNavigateSection && onNavigateSection('people')}
            className="hover:text-[#1F1F1F] transition-colors cursor-pointer text-right"
          >
            People
          </button>
          <button
            onClick={() => onNavigateSection && onNavigateSection('places')}
            className="hover:text-[#1F1F1F] transition-colors cursor-pointer text-right"
          >
            Places
          </button>
        </div>
        {/* Subtle underline below links */}
        <div className="mt-3.5 w-10 h-px bg-[#1F1F1F]/25 ml-auto" />
      </div>

      {/* 2. Bottom-Left Visual Archive Caption */}
      <div
        id="bottom-left-caption"
        className="fixed bottom-8 left-8 sm:left-12 z-30 select-none pointer-events-none"
      >
        <p className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.3em] uppercase text-[#928B8B] leading-relaxed">
          Visual Archive
          <br />
          For a Lifetime
        </p>
      </div>

      {/* 4. Bottom-Right Chapter Counter */}
      <div
        id="bottom-right-counter"
        className="fixed bottom-8 right-8 sm:right-12 z-30 select-none pointer-events-none flex items-center gap-3 sm:gap-4"
      >
        <span className="font-mono text-[9px] tracking-[0.32em] uppercase text-[#8C8484] hidden sm:inline">
          CHAPTER
        </span>
        <span className="font-mono text-[11px] tracking-[0.28em] text-[#1F1F1F] font-medium">
          {formattedIndex} / {formattedTotal}
        </span>
        <div className="w-12 sm:w-16 h-px bg-[#1F1F1F]/25" />
      </div>
    </>
  );
};
