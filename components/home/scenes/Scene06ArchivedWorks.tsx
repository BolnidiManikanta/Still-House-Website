"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";

interface ArchiveWork {
  id: string;
  number: string;
  title: string;
  medium: string;
  year: string;
  location: string;
  image: string;
  link: string;
}

const archiveWorks: ArchiveWork[] = [
  {
    id: "01",
    number: "ARC 01",
    title: "CONCRETE SANCTUARY",
    medium: "120MM COLOR REVERSAL",
    year: "2025",
    location: "TOKYO, JAPAN",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
    link: "/project/blueyard",
  },
  {
    id: "02",
    number: "ARC 02",
    title: "MONUMENT OF SILENCE",
    medium: "MEDIUM FORMAT ANALOG",
    year: "2026",
    location: "KYOTO, JAPAN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=90",
    link: "/work",
  },
  {
    id: "03",
    number: "ARC 03",
    title: "MIST & PLATEAU",
    medium: "HIGH RES DIGITAL SENSOR",
    year: "2025",
    location: "REYKJAVIK, ICELAND",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=90",
    link: "/work",
  },
  {
    id: "04",
    number: "ARC 04",
    title: "SILENT PROFILE",
    medium: "SILVER GELATIN PRINT",
    year: "2025",
    location: "ZURICH, SWITZERLAND",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=90",
    link: "/work",
  },
];

export default function Scene06ArchivedWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressPillRef = useRef<HTMLDivElement>(null);
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Apply exact scroll scrub calculation
    const applyScrub = (p: number) => {
      // 1. Progress Indicator Pill
      if (progressPillRef.current) {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        progressPillRef.current.innerText = `SCENE 06 · ${pct.toString().padStart(2, "0")}%`;
      }

      // 2. Active Card Determination (0 -> 4)
      const currentActive = Math.min(3, Math.floor(p * 4));
      setActiveWorkIndex(currentActive);

      // 3. Transform the 4 Cards Dynamically
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;

        // Calculate card's distance from focal scrub center
        const cardCenterProgress = (idx + 0.5) / 4;
        const dist = Math.abs(p - cardCenterProgress) * 4; // 0 when directly active, increases up to ~3

        const isDominant = dist < 0.7;
        const dominanceT = Math.max(0, 1 - dist); // 1.0 when active, down to 0

        // Active card enlarges, comes forward, gains deep shadow
        const scale = 0.88 + dominanceT * 0.24; // 0.88 -> 1.12
        const opacity = 0.35 + dominanceT * 0.65; // 0.35 -> 1.00
        const blur = (1 - dominanceT) * 3; // 3px blur for receding cards
        const zIndex = Math.round(dominanceT * 30) + 10;

        // Differential Parallax Shift based on position
        const parallaxY = (p - 0.5) * (idx % 2 === 0 ? -60 : 60);

        card.style.transform = `translate3d(0, ${parallaxY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
        card.style.zIndex = zIndex.toString();
        card.style.boxShadow = isDominant
          ? "0 30px 80px rgba(0,0,0,0.35)"
          : "0 10px 30px rgba(0,0,0,0.12)";
      });
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

  const activeWork = archiveWorks[activeWorkIndex] || archiveWorks[0];

  return (
    <section
      id="scene-06-archived-works"
      ref={containerRef}
      className="relative w-full h-[360vh] bg-[#EBE7E1] text-[#110F0E] z-10"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-10 md:py-14 px-6 md:px-12 lg:px-16 select-none border-b border-[#110F0E]/10"
      >
        {/* Top Eyebrow Header */}
        <div className="flex items-center justify-between border-b border-[#110F0E]/15 pb-4 z-30">
          <div className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
            <span className="text-[#110F0E] font-medium">05</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>ARCHIVED WORKS — LIVING EXHIBITION MATRIX</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/60 hidden sm:block">
              [ 04 MONUMENTAL SURVEYS ]
            </span>
            <div
              ref={progressPillRef}
              className="glass-capsule px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] text-[#110F0E]/80 shadow-sm"
            >
              SCENE 06 · 00%
            </div>
          </div>
        </div>

        {/* Central Spatial Stage: 4 Living Asymmetric Cards */}
        <div className="relative my-auto w-full max-w-[1500px] mx-auto h-[66vh] md:h-[72vh] grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-center z-10">
          {archiveWorks.map((work, idx) => (
            <div
              key={work.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onClick={() => triggerTransition(work.link)}
              data-cursor="OPEN"
              data-magnetic
              className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden border border-[#110F0E]/15 cursor-pointer will-change-transform bg-[#1B1917] group"
            >
              <Image
                src={work.image}
                alt={work.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center filter contrast-[1.12] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

              {/* In-Card Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-[0.25em] text-white/70 mb-1">
                  <span>{work.number}</span>
                  <span>{work.year}</span>
                </div>
                <h4 className="font-serif font-light text-base sm:text-lg md:text-xl text-white uppercase tracking-tight leading-snug">
                  {work.title}
                </h4>
                <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-[0.2em] text-white/50 mt-2 pt-2 border-t border-white/20">
                  <span>{work.location}</span>
                  <span className="hidden sm:inline">{work.medium}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Living Spec HUD */}
        <div className="relative z-30 pt-4 border-t border-[#110F0E]/15 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/80">
          <div className="flex items-center space-x-3 mb-2 md:mb-0">
            <span className="w-2 h-2 rounded-full bg-[#110F0E] animate-pulse" />
            <span className="font-medium">{activeWork.number} ACTIVE:</span>
            <span>{activeWork.title} — {activeWork.location}</span>
          </div>

          <div className="flex items-center space-x-4 text-[#110F0E]/60 text-[10px]">
            <span>MEDIUM: {activeWork.medium}</span>
            <span>YEAR: {activeWork.year}</span>
            <button
              onClick={() => triggerTransition(activeWork.link)}
              className="text-[#110F0E] underline font-medium hover:text-black cursor-pointer"
            >
              EXPLORE MONOGRAPH →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
