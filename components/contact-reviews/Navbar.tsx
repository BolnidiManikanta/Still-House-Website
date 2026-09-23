"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  onOpenRatingModal: () => void;
  activeSection: 'contact' | 'reviews';
  reviewCount: number;
  averageRating: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRatingModal,
  activeSection,
  reviewCount,
  averageRating,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D7D7D2] bg-[#F6F6F4]/90 backdrop-blur-md transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand identity & Back Link */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-[0.2em] uppercase text-[#111111]/70 hover:text-[#111111] px-3 py-1.5 rounded-full border border-[#D7D7D2] hover:border-[#111111] transition-all bg-white"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>STILL STUDIO</span>
          </Link>
          <div className="hidden md:flex items-baseline gap-3 border-l border-[#D7D7D2] pl-4">
            <span className="font-editorial text-2xl tracking-[0.18em] uppercase text-[#111111] font-semibold">
              APEX LIGHT
            </span>
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A8A86]">
              / CONTACT & REVIEWS
            </span>
          </div>
        </div>

        {/* Minimal editorial navigation */}
        <nav className="flex items-center gap-8 text-xs tracking-[0.18em] uppercase text-[#666666]">
          <button
            id="nav-contact-button"
            onClick={() => scrollTo('contact-section')}
            className={`group relative py-1 transition-colors cursor-pointer ${
              activeSection === 'contact' ? 'text-[#111111] font-medium' : 'hover:text-[#111111]'
            }`}
          >
            <span className="text-[10px] text-[#8A8A86] mr-1.5 font-mono">01</span>
            <span>Inquiry</span>
            <span
              className={`absolute bottom-0 left-0 w-full h-px bg-[#111111] transition-transform duration-300 origin-left ${
                activeSection === 'contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </button>

          <button
            id="nav-reviews-button"
            onClick={() => scrollTo('reviews-section')}
            className={`group relative py-1 transition-colors cursor-pointer ${
              activeSection === 'reviews' ? 'text-[#111111] font-medium' : 'hover:text-[#111111]'
            }`}
          >
            <span className="text-[10px] text-[#8A8A86] mr-1.5 font-mono">02</span>
            <span>Words</span>
            <span className="ml-1 text-[11px] text-[#8A8A86] font-mono">
              ({reviewCount})
            </span>
            <span
              className={`absolute bottom-0 left-0 w-full h-px bg-[#111111] transition-transform duration-300 origin-left ${
                activeSection === 'reviews' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </button>
        </nav>

        {/* Rate Photography button */}
        <div className="flex items-center gap-4">
          <button
            id="header-rate-photography-button"
            onClick={onOpenRatingModal}
            className="group inline-flex items-center gap-2 text-xs font-mono tracking-[0.16em] uppercase text-[#111111] border border-[#D7D7D2] hover:border-[#111111] px-4 py-2.5 transition-all duration-300 bg-[#FFFFFF] hover:bg-[#111111] hover:text-[#F6F6F4] cursor-pointer"
          >
            <span>Rate Studio ({averageRating.toFixed(1)})</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
