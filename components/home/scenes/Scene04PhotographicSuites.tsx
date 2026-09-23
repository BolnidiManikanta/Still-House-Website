"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Scene04PhotographicSuites() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);

  // Opposing Speed Typography Lines
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);

  // 3 Staggered Exhibition Plates
  const plateARef = useRef<HTMLDivElement>(null);
  const plateBRef = useRef<HTMLDivElement>(null);
  const plateCRef = useRef<HTMLDivElement>(null);

  // Progress indicator
  const progressPillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const applyScrub = (p: number) => {
      // 1. Progress Indicator Pill
      if (progressPillRef.current) {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        progressPillRef.current.innerText = `SCENE 04 · ${pct.toString().padStart(2, "0")}%`;
      }

      // 2. Opposing Speed Kinetic Typography
      // Line 1 moves right, Line 2 moves left
      if (line1Ref.current) {
        const transX = -20 + p * 40; // -20% -> +20%
        line1Ref.current.style.transform = `translate3d(${transX.toFixed(1)}%, 0, 0)`;
      }
      if (line2Ref.current) {
        const transX = 20 - p * 40; // +20% -> -20%
        line2Ref.current.style.transform = `translate3d(${transX.toFixed(1)}%, 0, 0)`;
      }

      // 3. Staggered 3-Plate Parallax Scrubbing
      // Plate A (Left)
      if (plateARef.current) {
        const transY = 60 - p * 120; // 60px -> -60px
        const scale = 0.94 + p * 0.08;
        plateARef.current.style.transform = `translate3d(0, ${transY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      }

      // Plate B (Center Dominant)
      if (plateBRef.current) {
        const transY = -40 + p * 80;
        const scale = 1.04 - Math.abs(p - 0.5) * 0.12;
        plateBRef.current.style.transform = `translate3d(0, ${transY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      }

      // Plate C (Right)
      if (plateCRef.current) {
        const transY = 80 - p * 140;
        const scale = 0.92 + p * 0.10;
        plateCRef.current.style.transform = `translate3d(0, ${transY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      }
    };

    applyScrub(0);

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => applyScrub(self.progress),
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      id="scene-04-photographic-suites"
      ref={containerRef}
      className="relative w-full h-[280vh] bg-[#EBE7E1] text-[#110F0E] z-10"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 md:py-16 px-6 md:px-12 lg:px-16 select-none border-b border-[#110F0E]/10"
      >
        {/* Top Eyebrow Header */}
        <div className="flex items-center justify-between border-b border-[#110F0E]/15 pb-4 z-20">
          <div className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
            <span className="text-[#110F0E] font-medium">03</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>PHOTOGRAPHIC SUITES & EXHIBITION CATALOGUE</span>
          </div>

          <div
            ref={progressPillRef}
            className="glass-capsule px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] text-[#110F0E]/80 shadow-sm"
          >
            SCENE 04 · 00%
          </div>
        </div>

        {/* Background Opposing Typography */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-[0.06] overflow-hidden z-0">
          <h2
            ref={line1Ref}
            className="font-serif font-light text-[clamp(60px,14vw,220px)] whitespace-nowrap leading-none tracking-tight will-change-transform"
          >
            CREATING THE UNEXPECTED
          </h2>
          <h2
            ref={line2Ref}
            className="font-serif font-light text-[clamp(60px,14vw,220px)] whitespace-nowrap leading-none tracking-tight will-change-transform"
          >
            ARCHITECTURAL MONOGRAPHS
          </h2>
        </div>

        {/* Central 3-Plate Architectural Spread */}
        <div className="relative my-auto w-full max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center z-10">
          {/* Plate A: Left Column (Monolith Perimeter) */}
          <div
            ref={plateARef}
            className="hidden md:block md:col-span-3 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-[#110F0E]/15 will-change-transform bg-[#1C1A18]"
          >
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=95"
                alt="Monolith Perimeter"
                fill
                sizes="25vw"
                className="object-cover object-center filter contrast-[1.1]"
              />
              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-white/70 block">
                  PLATE 02.A
                </span>
                <span className="font-serif font-light text-base text-white block">
                  Monolith Perimeter
                </span>
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-white/50 block">
                  KYOTO · 120MM
                </span>
              </div>
            </div>
          </div>

          {/* Plate B: Center Dominant (Tokyo Concrete Void) */}
          <div
            ref={plateBRef}
            className="col-span-1 md:col-span-6 aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#110F0E]/20 will-change-transform bg-[#1B1917]"
          >
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=95"
                alt="Concrete Sanctuary Void"
                fill
                sizes="50vw"
                className="object-cover object-center filter contrast-[1.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/70 block mb-1">
                  PLATE 02.B — PRIMARY EXHIBIT
                </span>
                <h3 className="font-serif font-light text-2xl md:text-4xl text-white">
                  Concrete Sanctuary Void
                </h3>
                <p className="mt-2 font-sans font-light text-xs md:text-sm text-white/80 max-w-[440px]">
                  Brutalist geometries isolating atmospheric silence from urban density. Exposure captured on medium format analog.
                </p>
                <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.2em] text-white/50 mt-4 pt-3 border-t border-white/20">
                  <span>TOKYO, JAPAN</span>
                  <span>f/8 · 1/60s · ISO 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plate C: Right Column (Silent Profile Portrait) */}
          <div
            ref={plateCRef}
            className="hidden md:block md:col-span-3 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-[#110F0E]/15 will-change-transform bg-[#1C1A18]"
          >
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=95"
                alt="Silent Profile in Zurich"
                fill
                sizes="25vw"
                className="object-cover object-center filter contrast-[1.12]"
              />
              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-white/70 block">
                  PLATE 02.C
                </span>
                <span className="font-serif font-light text-base text-white block">
                  Silent Profile
                </span>
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-white/50 block">
                  ZURICH · SILVER GELATIN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Specs Bar */}
        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/50 border-t border-[#110F0E]/10 pt-4 z-20">
          <span>CATALOGUE RAISONNÉ 2026</span>
          <span>TRANSITIONING TO HORIZONTAL SEQUENCE</span>
        </div>
      </div>
    </section>
  );
}
