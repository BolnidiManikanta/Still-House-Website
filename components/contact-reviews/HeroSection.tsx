"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Clock, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenRatingModal: () => void;
  reviewCount: number;
  averageRating: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRatingModal,
  reviewCount,
  averageRating,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const heroRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imageInnerRef = useRef<HTMLImageElement | null>(null);
  const microTextRef = useRef<HTMLDivElement | null>(null);

  // Live IST atelier clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Sequential Load Animation (Requirement #7)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Label appears
      if (labelRef.current) {
        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.8 }
        );
      }

      // 2. Headline lines reveal sequentially (Y: 60px -> 0, opacity: 0 -> 1)
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll('.hero-headline-line');
        tl.fromTo(
          lines,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out' },
          '-=0.4'
        );
      }

      // 3. Supporting text reveals
      if (paragraphRef.current) {
        tl.fromTo(
          paragraphRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        );
      }

      // 4. Hero image reveals with clip-path inset & scale (1.08 -> 1)
      if (imageContainerRef.current && imageInnerRef.current) {
        tl.fromTo(
          imageContainerRef.current,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.out' },
          '-=0.8'
        );
        tl.fromTo(
          imageInnerRef.current,
          { scale: 1.08 },
          { scale: 1.0, duration: 1.6, ease: 'power3.out' },
          '-=1.4'
        );
      }

      // 5. Scroll cue & micro typography fade in
      if (scrollCueRef.current) {
        tl.fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          '-=0.5'
        );
      }

      if (microTextRef.current) {
        const items = microTextRef.current.querySelectorAll('.micro-typo-item');
        tl.fromTo(
          items,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          '-=0.6'
        );
      }
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Parallax on the hero image while scrolling through hero
  useEffect(() => {
    if (!imageInnerRef.current || !heroRef.current) return;

    const st = gsap.to(imageInnerRef.current, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const headlineLines = ['LET\'S', 'CREATE', 'SOMETHING', 'MEANINGFUL.'];

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="relative min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between pt-6 sm:pt-10 pb-12 sm:pb-16"
    >
      {/* 1. Header Metadata Bar (Requirement #4) */}
      <div
        ref={labelRef}
        className="flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-[#D7D7D2] mb-8 sm:mb-12 text-xs text-[#666666]"
      >
        <div className="flex items-center gap-3 font-mono">
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#111111] font-semibold">
            CONTACT / 06
          </span>
          <span className="text-[#D7D7D2]">•</span>
          <span className="text-[11px] tracking-[0.18em] uppercase text-[#666666] hidden sm:inline">
            STUDIO ATELIER & ARCHIVAL COMMISSIONS
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-[#666666]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-pulse" />
            <span className="uppercase tracking-wider">BOOKING Q4 2026 & 2027</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[#111111]">
            <Clock className="w-3.5 h-3.5 text-[#666666]" />
            <span>{currentTime || '12:00:00 IST'}</span>
          </div>
        </div>
      </div>

      {/* 2. Main 12-Column Hero Grid (Asymmetric Editorial Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">
        {/* Left Column (Cols 1-6): 45-50% Width Huge Editorial Headline */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full py-2">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8A8A86] mb-3">
              PRIMARY DIRECTIVE
            </div>

            <h1
              ref={headlineRef}
              className="font-editorial text-[#111111] tracking-[-0.035em] uppercase select-none leading-[0.85] text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] xl:text-[9.2rem]"
            >
              {headlineLines.map((line, idx) => (
                <div key={idx} className="overflow-hidden">
                  <div className="hero-headline-line block transform-gpu">
                    {line}
                  </div>
                </div>
              ))}
            </h1>
          </div>

          {/* Supporting Paragraph & Action Triggers (Requirement #4) */}
          <div ref={paragraphRef} className="mt-8 sm:mt-12 space-y-6 max-w-xl">
            <p className="text-[#666666] text-sm sm:text-base font-light leading-relaxed">
              Have an idea, an architectural project, or simply want to start a conversation?
              We specialize in medium-format architectural portraiture, natural illumination campaigns,
              and spatial documentation. Available worldwide from our Pune atelier.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('contact-form-section')}
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-[#111111] text-[#F6F6F4] hover:bg-[#222222] text-xs uppercase tracking-[0.2em] font-mono transition-all duration-300 cursor-pointer shadow-xs"
              >
                <span>Initiate Brief</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <button
                type="button"
                onClick={onOpenRatingModal}
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#D7D7D2] hover:border-[#111111] text-xs uppercase tracking-[0.16em] text-[#111111] font-mono transition-all duration-300 bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-[#111111]" />
                <span>Critiques ({averageRating.toFixed(1)})</span>
                <ArrowUpRight className="w-3 h-3 text-[#8A8A86]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Cols 7-12): Multi-Layered Grayscale Architectural Hero Image (Requirements #5 & #6) */}
        <div className="lg:col-span-6 relative mt-8 lg:mt-0 flex justify-center lg:justify-end">
          {/* Layer 1: Soft Grey Shadow & Blurred Atmosphere */}
          <div className="absolute -inset-4 sm:-inset-6 bg-[#D7D7D2]/40 rounded-sm filter blur-2xl pointer-events-none -z-10" />

          {/* Layer 2: Main Image Wrapper with Clip-Path Reveal */}
          <div
            ref={imageContainerRef}
            data-cursor="VIEW"
            className="relative w-full max-w-lg lg:max-w-xl aspect-[4/5] bg-[#E9E9E6] overflow-hidden border border-[#D7D7D2] shadow-xs group"
            style={{ willChange: 'clip-path' }}
          >
            {/* Grayscale Architectural / Sculptural Image (No flowers, no plants, muted contrast) */}
            <img
              ref={imageInnerRef}
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85"
              alt="Apex Light Studio Brutalist Architecture & Shadow Study"
              className="w-full h-full object-cover object-center grayscale contrast-105 brightness-98 transition-transform duration-700 group-hover:scale-105"
              style={{ willChange: 'transform' }}
            />

            {/* Subtle atmospheric overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/45 via-transparent to-[#111111]/10 pointer-events-none" />

            {/* Layer 3: Floating Transparent Text Panel (Requirement #6) */}
            <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-5 bg-[#FFFFFF]/85 backdrop-blur-md border border-[#D7D7D2]/80 text-[#111111] transition-transform duration-300 group-hover:-translate-y-1">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#8A8A86] pb-2 border-b border-[#D7D7D2]/60 uppercase">
                <span>MONOCHROME STUDY • 01</span>
                <span>PUNE ATELIER</span>
              </div>
              <div className="pt-2 flex items-baseline justify-between">
                <span className="font-editorial text-lg sm:text-xl font-medium tracking-wide">
                  Architectural Forms & Light
                </span>
                <span className="font-mono text-[11px] text-[#666666]">
                  100MP Hasselblad
                </span>
              </div>
            </div>

            {/* Micro-typography stamp top right */}
            <div className="absolute top-4 right-4 font-mono text-[9px] tracking-[0.25em] uppercase text-[#F6F6F4] bg-[#111111]/60 px-2 py-1 backdrop-blur-xs">
              HASSELBLAD / 80MM
            </div>
          </div>
        </div>
      </div>

      {/* 3. Floating Micro Typography Blocks (Requirement #8) */}
      <div
        ref={microTextRef}
        className="relative z-10 pt-10 sm:pt-14 border-t border-[#D7D7D2] mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-[11px] font-mono text-[#666666]"
      >
        {/* Block A */}
        <div className="micro-typo-item space-y-1">
          <span className="text-[#8A8A86] block text-[10px] uppercase tracking-[0.2em]">
            MANIFESTO
          </span>
          <div className="text-[#111111] font-medium tracking-widest text-[11px] uppercase">
            IDEAS / PEOPLE / STORIES / ALWAYS.
          </div>
        </div>

        {/* Block B */}
        <div className="micro-typo-item space-y-1">
          <span className="text-[#8A8A86] block text-[10px] uppercase tracking-[0.2em]">
            LOCATION / COORDINATES
          </span>
          <div className="text-[#111111] tracking-wider">
            18.5362° N, 73.8958° E • PUNE
          </div>
        </div>

        {/* Block C */}
        <div className="micro-typo-item space-y-1 hidden md:block">
          <span className="text-[#8A8A86] block text-[10px] uppercase tracking-[0.2em]">
            MEDIUM & METHOD
          </span>
          <div className="text-[#111111] tracking-wider">
            NATURAL LIGHT & MEDIUM FORMAT
          </div>
        </div>

        {/* Block D / Scroll Cue (Requirement #4) */}
        <div ref={scrollCueRef} className="micro-typo-item flex items-center md:justify-end">
          <button
            type="button"
            onClick={() => scrollToSection('contact-section')}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-[#111111] hover:text-[#666666] transition-colors cursor-pointer"
          >
            <span>SCROLL DOWN</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
