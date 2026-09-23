"use client";

import React from 'react';
import { X, ArrowUpRight, Sparkles } from 'lucide-react';
import { soundscape } from '@/lib/film/audioSynthesizer';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const links = [
    { num: '01', title: 'Home / Hero', id: 'hero' },
    { num: '02', title: 'Studio Manifesto', id: 'statement' },
    { num: '03', title: 'Our Approach', id: 'approach' },
    { num: '04', title: 'Selected Projects', id: 'selected-projects' },
    { num: '05', title: 'Project Directory', id: 'directory' },
    { num: '06', title: 'Studio & Awards', id: 'mission' },
    { num: '07', title: 'Contact & Inquiries', id: 'final-black-footer' },
  ];

  return (
    <div
      id="fullscreen-menu-overlay"
      className="fixed inset-0 z-50 bg-[#E8E8E8]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12 md:p-16 text-[#181818] animate-fade-in"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 font-display-cinzel tracking-[0.26em] text-xs uppercase font-semibold text-[#1A1A1A]">
          <span className="w-2 h-2 rounded-full bg-[#222222]" />
          <span>Studio Index & Directory</span>
        </div>

        <span
          id="close-menu-btn"
          onClick={() => {
            soundscape.playHoverChime();
            onClose();
          }}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] font-semibold py-2 px-4 rounded-full relief-pill border border-black/15 hover:border-black/30 text-[#1A1A1A] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </span>
      </div>

      {/* Center navigation links */}
      <div className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="divide-y divide-black/10 border-y border-black/15">
          {links.map((link) => (
            <div
              key={link.id}
              onClick={() => {
                soundscape.playHoverChime();
                onNavigate(link.id);
                onClose();
              }}
              className="group w-full py-4 sm:py-5 flex items-center justify-between text-left hover:px-4 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-6 sm:gap-12">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#888888] font-mono">
                  {link.num}
                </span>
                <span className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl text-[#1A1A1A] group-hover:italic transition-all">
                  {link.title}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full relief-pill border border-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-black group-hover:bg-[#1A1A1A] group-hover:text-[#E8E8E8] transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.26em] font-semibold text-[#777777] pt-6 border-t border-black/15">
        <div>Paris • Tokyo • New York</div>
        <div>hello@immersive-garden.com</div>
      </div>
    </div>
  );
};
