"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CinematicImageBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const imageWrapper = imageWrapperRef.current;
    const image = imageRef.current;
    if (!container || !imageWrapper || !image) return;

    // 1. Initial state for clip-path reveal and scale
    gsap.set(imageWrapper, {
      clipPath: 'inset(100% 0 0 0)',
    });
    gsap.set(image, {
      scale: 1.15,
      yPercent: -4,
    });

    // 2. Custom Reveal Animation on Enter Viewport
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'top 35%',
        scrub: 1.2,
      },
    });

    revealTl.to(imageWrapper, {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'power3.out',
    });

    // 3. Continuous Parallax & Scale during scroll through
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    parallaxTl.to(image, {
      scale: 1.0,
      yPercent: 6,
      ease: 'none',
    });

    return () => {
      revealTl.kill();
      parallaxTl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-cursor="VIEW"
      className="relative my-20 sm:my-32 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden select-none"
    >
      {/* Editorial Category Eyebrow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between text-[11px] font-mono text-[#8A8A86]">
        <div className="flex items-center gap-2">
          <span>PLATE NO. 04</span>
          <span>/</span>
          <span className="text-[#111111] uppercase tracking-wider">
            ARCHITECTURAL MONOLITH & CONCRETE STUDY
          </span>
        </div>
        <span className="hidden sm:inline">PUNE, IN • HASSELBLAD H6D-100C • NATURAL SHADOW</span>
      </div>

      {/* Masked Image Container with GSAP clip-path reveal */}
      <div
        ref={imageWrapperRef}
        className="relative w-full h-[55vh] sm:h-[68vh] md:h-[78vh] bg-[#E9E9E6] overflow-hidden border-t border-b border-[#D7D7D2]"
        style={{ willChange: 'clip-path' }}
      >
        {/* Architectural brutalist concrete & shadow (No flowers, grayscale, muted) */}
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
          alt="Apex Light Studio Architectural Concrete Monolith"
          className="w-full h-full object-cover object-center grayscale contrast-110 brightness-95"
          style={{ willChange: 'transform' }}
          loading="lazy"
        />

        {/* Subtle high-fashion vignette overlay (white/grey softness) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/45 via-transparent to-[#111111]/15 pointer-events-none" />

        {/* Fine Architectural Grid markings over the image */}
        <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between pointer-events-none text-[#FFFFFF]">
          <div className="flex justify-between items-start font-mono text-[10px] tracking-[0.25em] uppercase opacity-85">
            <span>FIGURE 04-A</span>
            <span>SHADOW STUDY / CHRONOLOGY</span>
          </div>

          <div className="max-w-xl space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-80 block">
              SPATIAL TONALITY
            </span>
            <p className="font-editorial text-2xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight uppercase">
              Light shapes volume.
              <br />
              Shadow reveals truth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
