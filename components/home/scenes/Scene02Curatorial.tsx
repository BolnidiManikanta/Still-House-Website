"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";

export default function Scene02Curatorial() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);

  const { config } = useSiteConfig();
  const cur = config.home.curatorial;

  // Typography Refs
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineWordsRef = useRef<HTMLHeadingElement>(null);
  const narrativeBlockRef = useRef<HTMLDivElement>(null);
  const metadataGridRef = useRef<HTMLDivElement>(null);

  // Photographic Plate Refs
  const imagePlateRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  // Scene Progress Pill
  const progressPillRef = useRef<HTMLDivElement>(null);

  const words = cur.headlineWords && cur.headlineWords.length > 0
    ? cur.headlineWords
    : ["AN", "EXPLORATION", "OF", "ATMOSPHERIC", "LIGHT,", "SILENCE,", "AND", "ARCHITECTURAL", "MONOLITHS."];

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
        progressPillRef.current.innerText = `SCENE 02 · ${pct.toString().padStart(2, "0")}%`;
      }

      // 2. Section Eyebrow Header
      if (eyebrowRef.current) {
        const eyeOpacity = Math.min(1, p * 6);
        const eyeY = Math.max(0, (1 - p * 4) * 20);
        eyebrowRef.current.style.opacity = eyeOpacity.toFixed(3);
        eyebrowRef.current.style.transform = `translate3d(0, ${eyeY.toFixed(1)}px, 0)`;
      }

      // 3. Kinetic Headline Words Scrub (0.0 -> 0.45)
      // Words enter from opposing directions, blur sharpens, then headline shifts up & shrinks
      if (headlineWordsRef.current) {
        const wordEls = headlineWordsRef.current.querySelectorAll<HTMLElement>(".curatorial-word");

        if (p <= 0.35) {
          const t = p / 0.35;
          wordEls.forEach((el, idx) => {
            const dir = idx % 2 === 0 ? -1 : 1;
            const transX = (1 - t) * (dir * 80);
            const transY = (1 - t) * 40;
            const wordOpacity = Math.min(1, t * 1.6);
            const wordBlur = (1 - t) * 6;

            el.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0)`;
            el.style.opacity = wordOpacity.toFixed(3);
            el.style.filter = wordBlur > 0.1 ? `blur(${wordBlur.toFixed(1)}px)` : "none";
          });

          headlineWordsRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
        } else if (p <= 0.70) {
          // Headline moves up to make space for narrative paragraphs
          const t = (p - 0.35) / 0.35;
          const shiftY = -t * 60;
          const scale = 1.0 - t * 0.18;
          headlineWordsRef.current.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          headlineWordsRef.current.style.transformOrigin = "top left";
        } else {
          // Headline exits as scene transitions
          const t = (p - 0.70) / 0.30;
          const shiftY = -60 - t * 80;
          const opacity = Math.max(0, 1 - t * 1.5);
          headlineWordsRef.current.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0) scale(0.82)`;
          headlineWordsRef.current.style.opacity = opacity.toFixed(3);
        }
      }

      // 4. Photographic Plate (Tokyo Sanctuary Void)
      // Enters from bottom-right, expands, scales, and eventually morphs into full aperture
      if (imagePlateRef.current) {
        const isMobile = window.innerWidth < 768;

        if (p <= 0.25) {
          const t = p / 0.25;
          const transY = (1 - t) * 120;
          const transX = isMobile ? 0 : (1 - t) * 40;
          const opacity = t;
          const scale = 0.88 + t * 0.12;

          imagePlateRef.current.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          imagePlateRef.current.style.opacity = opacity.toFixed(3);
          imagePlateRef.current.style.clipPath = `inset(${(10 * (1 - t)).toFixed(1)}% round 16px)`;
        } else if (p <= 0.70) {
          // Pinned dominant right-half monograph plate
          const t = (p - 0.25) / 0.45;
          const floatY = -t * 30;
          imagePlateRef.current.style.transform = `translate3d(0, ${floatY.toFixed(1)}px, 0) scale(1.0)`;
          imagePlateRef.current.style.opacity = "1";
          imagePlateRef.current.style.clipPath = "inset(0% round 16px)";
        } else {
          // Plate expands to prepare for Scene 03 take-over
          const t = (p - 0.70) / 0.30;
          const scale = 1.0 + t * 0.12;
          imagePlateRef.current.style.transform = `translate3d(0, -30px, 0) scale(${scale.toFixed(3)})`;
          imagePlateRef.current.style.opacity = (1 - t * 0.2).toFixed(3);
        }
      }

      // Inner image parallax drift
      if (imageInnerRef.current) {
        const innerY = -p * 50;
        const innerScale = 1.05 + p * 0.10;
        imageInnerRef.current.style.transform = `translate3d(0, ${innerY.toFixed(1)}px, 0) scale(${innerScale.toFixed(3)})`;
      }

      // 5. Narrative Text Block
      // Slides in from left as headline shifts up
      if (narrativeBlockRef.current) {
        if (p < 0.25) {
          narrativeBlockRef.current.style.opacity = "0";
          narrativeBlockRef.current.style.transform = "translate3d(-40px, 40px, 0)";
        } else if (p <= 0.65) {
          const t = (p - 0.25) / 0.40;
          const opacity = t;
          const transX = -40 * (1 - t);
          const transY = 40 * (1 - t);
          narrativeBlockRef.current.style.opacity = opacity.toFixed(3);
          narrativeBlockRef.current.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0)`;
        } else {
          const t = (p - 0.65) / 0.35;
          const opacity = Math.max(0, 1 - t * 1.5);
          const transX = -t * 60;
          narrativeBlockRef.current.style.opacity = opacity.toFixed(3);
          narrativeBlockRef.current.style.transform = `translate3d(${transX.toFixed(1)}px, 0, 0)`;
        }
      }

      // 6. Metadata Grid
      // Appears in Phase 2
      if (metadataGridRef.current) {
        if (p < 0.38) {
          metadataGridRef.current.style.opacity = "0";
          metadataGridRef.current.style.transform = "translate3d(0, 30px, 0)";
        } else if (p <= 0.70) {
          const t = (p - 0.38) / 0.32;
          const opacity = t;
          const transY = 30 * (1 - t);
          metadataGridRef.current.style.opacity = opacity.toFixed(3);
          metadataGridRef.current.style.transform = `translate3d(0, ${transY.toFixed(1)}px, 0)`;
        } else {
          const t = (p - 0.70) / 0.30;
          const opacity = Math.max(0, 1 - t * 1.5);
          metadataGridRef.current.style.opacity = opacity.toFixed(3);
        }
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
      id="scene-02-curatorial"
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#EBE7E1] text-[#110F0E] z-10"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-16 md:py-20 px-6 md:px-12 lg:px-20 select-none border-b border-[#110F0E]/10"
      >
        {/* Dynamic Progress Indicator */}
        <div className="absolute top-20 right-6 md:right-12 z-30 pointer-events-none">
          <div
            ref={progressPillRef}
            className="glass-capsule px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] text-[#110F0E]/80 shadow-sm"
          >
            SCENE 02 · 00%
          </div>
        </div>

        {/* Top Section Header & Index */}
        <div
          ref={eyebrowRef}
          className="flex items-center justify-between border-b border-[#110F0E]/15 pb-4 will-change-transform z-20"
        >
          <div className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
            <span className="text-[#110F0E] font-medium">{cur.eyebrowNumber}</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>{cur.eyebrowTitle}</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/50 hidden sm:inline-block">
            {cur.eyebrowSub}
          </span>
        </div>

        {/* Central Spatial Stage (Headline, Narrative, and Pinned Photographic Plate) */}
        <div className="relative my-auto w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-10">
          {/* Left Column: Headline, Narrative, and Curatorial Specs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Massive Display Headline */}
            <h2
              ref={headlineWordsRef}
              className="font-serif font-light text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] leading-[0.95] tracking-[-0.035em] text-[#110F0E] mb-6 md:mb-8 will-change-transform"
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  className="curatorial-word inline-block mr-[0.25em] will-change-transform"
                >
                  {w}
                </span>
              ))}
            </h2>

            {/* Narrative Paragraphs */}
            <div
              ref={narrativeBlockRef}
              className="space-y-4 max-w-[580px] will-change-transform opacity-0"
            >
              <p className="font-sans font-light text-[16px] md:text-[19px] leading-[1.6] text-[#110F0E]/90">
                {cur.paragraph1}
              </p>
              <p className="font-sans font-light text-[14px] md:text-[15px] leading-[1.7] text-[#110F0E]/70">
                {cur.paragraph2}
              </p>
            </div>

            {/* Museum Curatorial Specs Grid */}
            <div
              ref={metadataGridRef}
              className="pt-6 mt-6 border-t border-[#110F0E]/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/75 will-change-transform opacity-0"
            >
              <div>
                <span className="block text-[#110F0E]/45 mb-0.5">CHRONOLOGY</span>
                <span className="text-[#110F0E] font-medium block">{cur.chronology}</span>
              </div>
              <div>
                <span className="block text-[#110F0E]/45 mb-0.5">MEDIUM</span>
                <span className="text-[#110F0E] font-medium block">{cur.medium}</span>
              </div>
              <div>
                <span className="block text-[#110F0E]/45 mb-0.5">FIELD STATIONS</span>
                <span className="text-[#110F0E] font-medium block">{cur.fieldStations}</span>
              </div>
              <div>
                <span className="block text-[#110F0E]/45 mb-0.5">CURATOR</span>
                <span className="text-[#110F0E] font-medium block">{cur.curator}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scrub-Morphing Photographic Monograph Plate */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div
              ref={imagePlateRef}
              className="relative w-full max-w-[520px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#110F0E]/15 will-change-transform bg-[#1B1917]"
            >
              <div
                ref={imageInnerRef}
                className="relative w-full h-[120%] -top-[10%] will-change-transform"
              >
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=98"
                  alt="Concrete Sanctuary Void in Tokyo"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover object-center filter contrast-[1.12]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>

              {/* In-plate Plate Caption */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/70 block mb-1">
                  PLATE 01.1 — SPATIAL MONOGRAPH
                </span>
                <h4 className="font-serif font-light text-xl text-white">
                  Concrete Sanctuary Void
                </h4>
                <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.2em] text-white/50 mt-2 pt-2 border-t border-white/15">
                  <span>TOKYO, JAPAN</span>
                  <span>2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Border */}
        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/50 border-t border-[#110F0E]/10 pt-4 z-20">
          <span>ATMOSPHERIC SURVEY VOL. 01</span>
          <span>TRANSITIONING TO FEATURED MONOGRAPHS</span>
        </div>
      </div>
    </section>
  );
}
