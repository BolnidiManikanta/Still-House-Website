"use client";

import React, { useState } from 'react';
import { Eye, Layers, Compass, Sparkles } from 'lucide-react';

export const ApproachSection: React.FC = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      num: '01',
      title: 'Sensory Scenography',
      icon: Eye,
      tagline: 'Tactile digital materiality and emotional resonance.',
      desc: 'We transform traditional two-dimensional browsing into physical bas-relief worlds where light, texture, and physical contact awaken visceral human senses.',
    },
    {
      num: '02',
      title: 'Technical Audacity',
      icon: Layers,
      tagline: 'High-performance WebGL and bespoke shader pipelines.',
      desc: 'Executing multi-million polygon displacement simulations, custom procedural plaster shading, and 60 FPS real-time render loops without sacrificing accessibility.',
    },
    {
      num: '03',
      title: 'Strategic Elevation',
      icon: Compass,
      tagline: 'Enduring cultural prestige for global luxury leaders.',
      desc: 'Every interaction, transition, and micro-gesture is deliberately calculated to establish timeless authority, narrative depth, and commercial distinction.',
    },
  ];

  return (
    <section
      id="approach"
      className="relative w-full min-h-[90vh] flex flex-col justify-center px-6 sm:px-14 md:px-24 py-28 pointer-events-none"
    >
      <div className="max-w-6xl w-full mx-auto pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-black/15">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] tracking-[0.3em] font-bold text-[#888888] uppercase">
                02 / Philosophy
              </span>
              <div className="w-8 h-px bg-black/20"></div>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-[#1A1A1A] font-light">
              Our approach
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-[#555555] max-w-lg font-light leading-relaxed">
            A global leader in groundbreaking digital design and strategy, we help forward-thinking clients achieve impact and growth.
          </p>
        </div>

        {/* 3 Interactive Pillars with Sculptural Relief Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSelected = activePillar === idx;

            return (
              <div
                key={pillar.num}
                id={`approach-pillar-${idx}`}
                onClick={() => setActivePillar(idx)}
                className={`cursor-pointer rounded-2xl p-7 sm:p-8 transition-all duration-300 border ${
                  isSelected
                    ? 'relief-concave border-black/20 scale-[0.99]'
                    : 'relief-card-hover border-black/10 hover:border-black/25'
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display-cinzel text-xs text-[#888888] font-bold tracking-[0.2em]">
                    {pillar.num}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-[#E8E8E8] shadow-md'
                        : 'relief-pill border border-black/10 text-[#444444]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1A1A1A] mb-3 font-normal">
                  {pillar.title}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#777777] mb-4">
                  {pillar.tagline}
                </p>
                <p className="text-sm text-[#4A4A4A] font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
