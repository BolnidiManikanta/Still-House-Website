"use client";

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../data/portfolioData';
import { X, ArrowUpRight } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (key: string) => void;
  onOpenInquiry: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onOpenInquiry,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="navigation-drawer-overlay"
      className="fixed inset-0 z-50 bg-[#161412]/92 backdrop-blur-xl text-[#EAE6DE] flex flex-col justify-between p-8 sm:p-14 overflow-y-auto animate-fadeIn select-none"
    >
      {/* Top Bar inside drawer */}
      <div className="flex items-center justify-between border-b border-stone-700/60 pb-6">
        <div>
          <span className="text-xs tracking-[0.38em] font-sans font-medium uppercase text-white block">
            Krishna Photography
          </span>
          <span className="text-[10px] font-mono tracking-[0.25em] text-stone-400 uppercase mt-1 block">
            Visual Archive & Fine Art Studio
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch={true}
            id="drawer-home-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-600/70 hover:border-white hover:bg-white hover:text-stone-950 text-[11px] font-sans tracking-[0.14em] text-stone-200 uppercase transition-all duration-200 cursor-pointer shadow-xs"
          >
            <span>←</span>
            <span className="font-medium">
              STILL <span className="opacity-60 font-normal">/ STUDIO</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 border border-stone-700 hover:border-white text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center 8 Chapters Grid */}
      <div className="my-10 max-w-5xl mx-auto w-full">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-stone-400">
            Exhibition Directory — 08 Chapters
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-stone-500">
            Select to Explore
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                onSelectCategory(cat.key);
                onClose();
              }}
              className="group p-5 bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 hover:border-stone-500 text-left transition-all duration-300 flex flex-col justify-between h-36 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] tracking-[0.25em] text-stone-500 group-hover:text-white transition-colors">
                  CHAPTER {cat.num}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div>
                <h3 className="font-serif italic text-base sm:text-lg text-stone-200 group-hover:text-white tracking-wide">
                  {cat.label}
                </h3>
                <p className="text-[9.5px] font-mono text-stone-400 tracking-[0.22em] uppercase line-clamp-1 mt-1">
                  {cat.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-stone-700/60 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] font-mono tracking-[0.25em] text-stone-400 uppercase">
        <div>
          <span>Available Worldwide & Across India</span>
          <span className="mx-3 text-stone-600">•</span>
          <span>Destination Weddings & Editorial</span>
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenInquiry();
          }}
          className="border border-stone-400 text-white hover:bg-white hover:text-black px-6 py-2.5 transition-colors cursor-pointer"
        >
          Book an Exhibition Consultation ↗
        </button>
      </div>
    </div>
  );
};
