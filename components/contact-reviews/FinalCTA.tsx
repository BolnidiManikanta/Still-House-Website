"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  onOpenRatingModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenRatingModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  const scrollToContact = () => {
    const el = document.getElementById('contact-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const heading = headingRef.current;
    const line = lineRef.current;
    const bgImage = bgImageRef.current;
    if (!container || !heading || !line) return;

    const ctx = gsap.context(() => {
      // 1. Heading upward reveal
      gsap.fromTo(
        heading,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
          },
        }
      );

      // 2. Horizontal line draws across
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
          },
        }
      );

      // 3. Subtle background parallax movement
      if (bgImage) {
        gsap.to(bgImage, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-28 sm:py-44 border-t border-[#D7D7D2] overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* Large Architectural Abstract Background Image with Off-White Overlay     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          ref={bgImageRef}
          src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=2200&q=80"
          alt="Architectural structure"
          className="w-full h-[120%] object-cover object-center grayscale contrast-105 opacity-15 filter blur-xs"
          style={{ willChange: 'transform' }}
        />
        {/* Soft white/off-white gradient overlay keeping typography ultra-readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F6F4] via-[#F6F6F4]/90 to-[#F6F6F4]/80" />
      </div>

      <div className="relative z-10 flex flex-col items-start justify-between">
        {/* Editorial Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#8A8A86]">
            EPILOGUE / 03
          </span>
          <div className="w-12 h-px bg-[#D7D7D2]" />
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#666666] font-mono">
            THE COMMISSIONS DESK
          </span>
        </div>

        {/* Massive Climax Headline: HAVE A PROJECT IN MIND? (Requirement #17) */}
        <h2
          ref={headingRef}
          className="font-editorial text-6xl sm:text-8xl md:text-[9.5rem] lg:text-[11rem] xl:text-[12.5rem] text-[#111111] uppercase tracking-[-0.035em] leading-[0.84] mb-12 sm:mb-16"
        >
          HAVE A PROJECT
          <br />
          IN MIND?
        </h2>

        {/* Animated Horizontal Line (Requirement #18) */}
        <div ref={lineRef} className="w-full h-px bg-[#D7D7D2] mb-8" />

        {/* Climax Trigger: LET'S TALK → */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
          <button
            type="button"
            data-cursor="TALK"
            onClick={scrollToContact}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group inline-flex items-center gap-4 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial text-[#111111] hover:text-[#666666] tracking-tight uppercase transition-colors duration-300 cursor-pointer"
          >
            <span>LET&apos;S TALK</span>
            <div className="overflow-hidden w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
              <ArrowRight
                className={`w-10 sm:w-16 h-10 sm:h-16 transform transition-transform duration-300 ${
                  isHovered ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          <div className="space-y-2 text-left sm:text-right font-mono text-xs text-[#666666]">
            <p className="uppercase tracking-wider text-[#111111]">
              PUNE STUDIO • COMMISSIONS OPEN Q4 2026
            </p>
            <p className="text-[#8A8A86]">
              Direct Inquiries: hello@apexlightphoto.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
