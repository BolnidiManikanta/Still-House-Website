"use client";

import React from 'react';
import { STUDIO_AWARDS, CLIENT_LIST } from '@/lib/film/projectsData';
import { Trophy, Star, ShieldCheck } from 'lucide-react';

export const MissionSection: React.FC = () => {
  return (
    <section
      id="mission"
      className="relative w-full py-28 px-6 sm:px-14 md:px-20 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto pointer-events-auto space-y-24">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-black/15">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] tracking-[0.3em] font-bold text-[#888888] uppercase">
                05 / Recognition
              </span>
              <div className="w-8 h-px bg-black/20"></div>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-[#1A1A1A] font-light">
              Accolades & craft
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#555555] max-w-md font-light leading-relaxed">
            Honored consistently by international juries for pushing the visual, technical, and interactive boundaries of the web.
          </p>
        </div>

        {/* Stats Grid with Bas-Relief Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: '28×', label: 'Awwwards Site of Day/Month' },
            { value: '19×', label: 'FWA of the Day & Month' },
            { value: '03×', label: 'Cannes Lions Awards' },
            { value: '10+', label: 'Years Studio Innovation' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl relief-card-hover border border-black/10 flex flex-col justify-between"
            >
              <div className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] font-light">
                {stat.value}
              </div>
              <p className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#777777] mt-4">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Client Wall */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.26em] font-bold text-[#666666]">
            <ShieldCheck className="w-4 h-4 text-[#222222]" />
            <span>Select Brand Partners</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CLIENT_LIST.map((client, idx) => (
              <div
                key={idx}
                className="py-5 px-6 rounded-xl border border-black/10 relief-pill flex items-center justify-center text-center font-display-cinzel text-xs sm:text-sm tracking-[0.18em] font-semibold text-[#333333] hover:border-black/30 hover:text-black transition-all"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
