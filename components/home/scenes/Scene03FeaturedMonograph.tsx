"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";

interface MonographItem {
  id: string;
  suiteNum: string;
  title: string;
  medium: string;
  location: string;
  year: string;
  description: string;
  image: string;
  link: string;
}

const monographs: MonographItem[] = [
  {
    id: "01",
    suiteNum: "SUITE 01 / 03",
    title: "MONOLITH OF SILENCE",
    medium: "120MM COLOR REVERSAL",
    location: "KYOTO, JAPAN",
    year: "2026",
    description:
      "Tectonic shadows cast by concrete monoliths under raking low-temperature dawn light. An isolation of silent brutalist mass.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2600&q=98",
    link: "/work",
  },
  {
    id: "02",
    suiteNum: "SUITE 02 / 03",
    title: "ETHER & GLACIER",
    medium: "HIGH-DYNAMIC SENSOR",
    location: "REYKJAVIK, ICELAND",
    year: "2025",
    description:
      "Atmospheric horizon and geothermal mist across sub-zero highland plateaus at 05:40 AM. Gradation between earth and ether.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2600&q=98",
    link: "/work",
  },
  {
    id: "03",
    suiteNum: "SUITE 03 / 03",
    title: "DRAPE & SHADOW",
    medium: "SILVER GELATIN PRINT",
    location: "PARIS, FRANCE",
    year: "2024",
    description:
      "Sculptural textile studies translating silk volumes into monumental architectural forms. Shadows etched into silver salts.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2600&q=98",
    link: "/portfolio",
  },
];

export default function Scene03FeaturedMonograph() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const { triggerTransition } = usePageTransition();

  // Plate Container Refs (3 plates that morph & overlap continuously)
  const plate1Ref = useRef<HTMLDivElement>(null);
  const plate2Ref = useRef<HTMLDivElement>(null);
  const plate3Ref = useRef<HTMLDivElement>(null);

  // Inner Image Refs (for parallax scale/translation)
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);

  // Text Overlay Refs for the 3 Suites
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  // HUD & Indicators
  const progressPillRef = useRef<HTMLDivElement>(null);
  const suiteCounterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Apply Scrubbed Continuous Morph (0.0 to 1.0)
    const applyScrub = (p: number) => {
      // 1. Progress Indicator & Bar
      if (progressPillRef.current) {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        progressPillRef.current.innerText = `SCENE 03 · ${pct.toString().padStart(2, "0")}%`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
      }

      // 2. Active Suite Counter Label
      if (suiteCounterRef.current) {
        if (p < 0.33) {
          suiteCounterRef.current.innerText = "01 / 03 — MONOLITH OF SILENCE";
        } else if (p < 0.66) {
          suiteCounterRef.current.innerText = "02 / 03 — ETHER & GLACIER";
        } else {
          suiteCounterRef.current.innerText = "03 / 03 — DRAPE & SHADOW";
        }
      }

      // ====================================================================
      // CONTINUOUS IMAGE-TO-IMAGE TRANSITION ENGINE (User Instruction 11)
      // ====================================================================

      // --- STAGE 1 (p: 0.0 -> 0.33): PLATE 1 ACTIVE, SCALES, EXITS; PLATE 2 EMERGES ---
      if (p <= 0.33) {
        const localP = p / 0.33; // 0.0 -> 1.0 within stage 1

        // Plate 1 is dominant at start, scales, then drifts left and shrinks
        if (plate1Ref.current && img1Ref.current) {
          const p1Scale = 1.0 - localP * 0.12; // 1.0 -> 0.88
          const p1TransX = -localP * 60; // 0 -> -60%
          const p1Opacity = localP < 0.6 ? 1 : Math.max(0, 1 - (localP - 0.6) / 0.4);
          const p1Blur = localP > 0.6 ? (localP - 0.6) * 12 : 0;

          plate1Ref.current.style.transform = `translate3d(${p1TransX.toFixed(1)}%, 0, 0) scale(${p1Scale.toFixed(3)})`;
          plate1Ref.current.style.opacity = p1Opacity.toFixed(3);
          plate1Ref.current.style.filter = p1Blur > 0 ? `blur(${p1Blur.toFixed(1)}px)` : "none";
          plate1Ref.current.style.zIndex = "10";

          // Inner image zoom
          const imgScale = 1.05 + localP * 0.15;
          img1Ref.current.style.transform = `scale(${imgScale.toFixed(3)})`;
        }

        // Text 1 moves up and tracks out, then fades
        if (text1Ref.current) {
          const t1Y = -localP * 80;
          const t1Opacity = localP < 0.5 ? 1 : Math.max(0, 1 - (localP - 0.5) / 0.5);
          text1Ref.current.style.transform = `translate3d(0, ${t1Y.toFixed(1)}px, 0)`;
          text1Ref.current.style.opacity = t1Opacity.toFixed(3);
        }

        // Plate 2 begins appearing behind/overlapping in late stage 1 (localP 0.4 -> 1.0)
        if (plate2Ref.current && img2Ref.current) {
          if (localP < 0.4) {
            plate2Ref.current.style.opacity = "0";
            plate2Ref.current.style.transform = "translate3d(40%, 0, 0) scale(0.9)";
          } else {
            const t2 = (localP - 0.4) / 0.6; // 0.0 -> 1.0
            const p2TransX = 40 * (1 - t2); // 40% -> 0%
            const p2Scale = 0.90 + t2 * 0.10; // 0.90 -> 1.00
            const p2Inset = Math.round(16 * (1 - t2));

            plate2Ref.current.style.opacity = t2.toFixed(3);
            plate2Ref.current.style.transform = `translate3d(${p2TransX.toFixed(1)}%, 0, 0) scale(${p2Scale.toFixed(3)})`;
            plate2Ref.current.style.clipPath = `inset(${p2Inset}% ${p2Inset}% ${p2Inset}% ${p2Inset}% round ${Math.round(20 * (1 - t2))}px)`;
            plate2Ref.current.style.zIndex = "20";
          }
        }

        // Text 2 hidden in Stage 1
        if (text2Ref.current) text2Ref.current.style.opacity = "0";
        if (plate3Ref.current) plate3Ref.current.style.opacity = "0";
        if (text3Ref.current) text3Ref.current.style.opacity = "0";
      }

      // --- STAGE 2 (p: 0.33 -> 0.66): PLATE 2 DOMINANT, SCALES, EXITS; PLATE 3 EMERGES ---
      else if (p <= 0.66) {
        const localP = (p - 0.33) / 0.33; // 0.0 -> 1.0 within stage 2

        if (plate1Ref.current) plate1Ref.current.style.opacity = "0";
        if (text1Ref.current) text1Ref.current.style.opacity = "0";

        // Plate 2 dominates, then scales and shifts
        if (plate2Ref.current && img2Ref.current) {
          const p2Scale = 1.0 - localP * 0.12;
          const p2TransX = -localP * 60;
          const p2Opacity = localP < 0.6 ? 1 : Math.max(0, 1 - (localP - 0.6) / 0.4);
          const p2Blur = localP > 0.6 ? (localP - 0.6) * 12 : 0;

          plate2Ref.current.style.transform = `translate3d(${p2TransX.toFixed(1)}%, 0, 0) scale(${p2Scale.toFixed(3)})`;
          plate2Ref.current.style.opacity = p2Opacity.toFixed(3);
          plate2Ref.current.style.clipPath = "inset(0% 0% 0% 0% round 0px)";
          plate2Ref.current.style.filter = p2Blur > 0 ? `blur(${p2Blur.toFixed(1)}px)` : "none";
          plate2Ref.current.style.zIndex = "10";

          const imgScale = 1.05 + localP * 0.15;
          img2Ref.current.style.transform = `scale(${imgScale.toFixed(3)})`;
        }

        // Text 2 enters from right, takes over, then fades
        if (text2Ref.current) {
          const t2X = localP < 0.2 ? (1 - localP / 0.2) * 50 : 0;
          const t2Y = localP > 0.4 ? -(localP - 0.4) * 80 : 0;
          const t2Opacity = localP < 0.2 ? localP / 0.2 : localP < 0.6 ? 1 : Math.max(0, 1 - (localP - 0.6) / 0.4);

          text2Ref.current.style.transform = `translate3d(${t2X.toFixed(1)}px, ${t2Y.toFixed(1)}px, 0)`;
          text2Ref.current.style.opacity = t2Opacity.toFixed(3);
        }

        // Plate 3 begins appearing behind/overlapping in late stage 2
        if (plate3Ref.current && img3Ref.current) {
          if (localP < 0.4) {
            plate3Ref.current.style.opacity = "0";
            plate3Ref.current.style.transform = "translate3d(40%, 0, 0) scale(0.9)";
          } else {
            const t3 = (localP - 0.4) / 0.6;
            const p3TransX = 40 * (1 - t3);
            const p3Scale = 0.90 + t3 * 0.10;
            const p3Inset = Math.round(16 * (1 - t3));

            plate3Ref.current.style.opacity = t3.toFixed(3);
            plate3Ref.current.style.transform = `translate3d(${p3TransX.toFixed(1)}%, 0, 0) scale(${p3Scale.toFixed(3)})`;
            plate3Ref.current.style.clipPath = `inset(${p3Inset}% ${p3Inset}% ${p3Inset}% ${p3Inset}% round ${Math.round(20 * (1 - t3))}px)`;
            plate3Ref.current.style.zIndex = "20";
          }
        }

        if (text3Ref.current) text3Ref.current.style.opacity = "0";
      }

      // --- STAGE 3 (p: 0.66 -> 1.00): PLATE 3 EXPANDS & DOMINATES ---
      else {
        const localP = (p - 0.66) / 0.34; // 0.0 -> 1.0 within stage 3

        if (plate1Ref.current) plate1Ref.current.style.opacity = "0";
        if (plate2Ref.current) plate2Ref.current.style.opacity = "0";
        if (text1Ref.current) text1Ref.current.style.opacity = "0";
        if (text2Ref.current) text2Ref.current.style.opacity = "0";

        // Plate 3 expands to full bleed
        if (plate3Ref.current && img3Ref.current) {
          const p3Scale = 1.0 + localP * 0.05;
          plate3Ref.current.style.transform = `translate3d(0, 0, 0) scale(${p3Scale.toFixed(3)})`;
          plate3Ref.current.style.opacity = "1";
          plate3Ref.current.style.clipPath = "inset(0% 0% 0% 0% round 0px)";
          plate3Ref.current.style.zIndex = "20";

          const imgScale = 1.05 + localP * 0.10;
          img3Ref.current.style.transform = `scale(${imgScale.toFixed(3)})`;
        }

        // Text 3 enters smoothly and anchors
        if (text3Ref.current) {
          const t3X = localP < 0.25 ? (1 - localP / 0.25) * 50 : 0;
          const t3Opacity = Math.min(1, localP * 3);
          text3Ref.current.style.transform = `translate3d(${t3X.toFixed(1)}px, 0, 0)`;
          text3Ref.current.style.opacity = t3Opacity.toFixed(3);
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
      id="scene-03-featured-monographs"
      ref={containerRef}
      className="relative w-full h-[420vh] bg-[#161514] text-[#F5F3EE] z-10"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 md:p-12 lg:p-16 select-none bg-[#110F0E]"
      >
        {/* Dynamic Progress Indicator & Top Bar */}
        <div className="relative flex items-center justify-between z-30 pb-4 border-b border-white/15">
          <div className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-mono text-white/75">
            <span className="text-white font-medium">02</span>
            <span className="w-8 h-[1px] bg-white/30" />
            <span>FEATURED MONOGRAPH SERIES</span>
          </div>

          <div className="flex items-center space-x-6">
            <div
              ref={suiteCounterRef}
              className="text-[11px] uppercase tracking-[0.22em] font-mono text-white/80 hidden sm:block"
            >
              01 / 03 — MONOLITH OF SILENCE
            </div>

            <div
              ref={progressPillRef}
              className="glass-capsule px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] text-black bg-white/90 shadow-sm"
            >
              SCENE 03 · 00%
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CONTINUOUS MORPHING PHOTOGRAPHIC PLATES (3 Stacked Viewports)     */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative my-auto w-full h-[72vh] md:h-[78vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black">
          {/* PLATE 1: MONOLITH OF SILENCE */}
          <div
            ref={plate1Ref}
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform z-10"
          >
            <div ref={img1Ref} className="relative w-full h-full will-change-transform">
              <Image
                src={monographs[0].image}
                alt={monographs[0].title}
                fill
                sizes="100vw"
                priority
                className="object-cover object-center filter contrast-[1.12]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
            </div>

            {/* Overlaid Typography Suite 1 */}
            <div
              ref={text1Ref}
              className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-14 text-white will-change-transform"
            >
              <span className="text-[11px] uppercase font-mono tracking-[0.3em] text-white/70 block mb-2">
                {monographs[0].suiteNum} · {monographs[0].location}
              </span>
              <h3 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] uppercase max-w-[1000px]">
                {monographs[0].title}
              </h3>
              <p className="mt-4 font-sans font-light text-sm sm:text-base md:text-lg text-white/80 max-w-[560px] leading-relaxed">
                {monographs[0].description}
              </p>
              <div className="mt-6 flex items-center space-x-6 text-[10px] uppercase font-mono tracking-[0.25em] text-white/60">
                <span>MEDIUM: {monographs[0].medium}</span>
                <span>YEAR: {monographs[0].year}</span>
              </div>
            </div>
          </div>

          {/* PLATE 2: ETHER & GLACIER */}
          <div
            ref={plate2Ref}
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform opacity-0 z-20"
          >
            <div ref={img2Ref} className="relative w-full h-full will-change-transform">
              <Image
                src={monographs[1].image}
                alt={monographs[1].title}
                fill
                sizes="100vw"
                className="object-cover object-center filter contrast-[1.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
            </div>

            {/* Overlaid Typography Suite 2 */}
            <div
              ref={text2Ref}
              className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-14 text-white will-change-transform opacity-0"
            >
              <span className="text-[11px] uppercase font-mono tracking-[0.3em] text-white/70 block mb-2">
                {monographs[1].suiteNum} · {monographs[1].location}
              </span>
              <h3 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] uppercase max-w-[1000px]">
                {monographs[1].title}
              </h3>
              <p className="mt-4 font-sans font-light text-sm sm:text-base md:text-lg text-white/80 max-w-[560px] leading-relaxed">
                {monographs[1].description}
              </p>
              <div className="mt-6 flex items-center space-x-6 text-[10px] uppercase font-mono tracking-[0.25em] text-white/60">
                <span>MEDIUM: {monographs[1].medium}</span>
                <span>YEAR: {monographs[1].year}</span>
              </div>
            </div>
          </div>

          {/* PLATE 3: DRAPE & SHADOW */}
          <div
            ref={plate3Ref}
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform opacity-0 z-30"
          >
            <div ref={img3Ref} className="relative w-full h-full will-change-transform">
              <Image
                src={monographs[2].image}
                alt={monographs[2].title}
                fill
                sizes="100vw"
                className="object-cover object-center filter contrast-[1.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
            </div>

            {/* Overlaid Typography Suite 3 */}
            <div
              ref={text3Ref}
              className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-14 text-white will-change-transform opacity-0"
            >
              <span className="text-[11px] uppercase font-mono tracking-[0.3em] text-white/70 block mb-2">
                {monographs[2].suiteNum} · {monographs[2].location}
              </span>
              <h3 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] uppercase max-w-[1000px]">
                {monographs[2].title}
              </h3>
              <p className="mt-4 font-sans font-light text-sm sm:text-base md:text-lg text-white/80 max-w-[560px] leading-relaxed">
                {monographs[2].description}
              </p>
              <div className="mt-6 flex items-center space-x-6 text-[10px] uppercase font-mono tracking-[0.25em] text-white/60">
                <span>MEDIUM: {monographs[2].medium}</span>
                <span>YEAR: {monographs[2].year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Scrub Progress Line */}
        <div className="relative z-30 pt-4 border-t border-white/15 flex flex-col space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] font-mono text-white/50">
            <span>SUITE PROGRESSION SCRUB</span>
            <span>CONTINUOUS EXHIBITION FLOW</span>
          </div>
          <div className="w-full h-[2px] bg-white/15 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-white origin-left will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
