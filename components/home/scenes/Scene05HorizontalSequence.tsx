"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";

interface SuiteItem {
  id: string;
  number: string;
  title: string;
  medium: string;
  location: string;
  year: string;
  description: string;
  image: string;
  aspect: string;
  link: string;
}

const suites: SuiteItem[] = [
  {
    id: "01",
    number: "SUITE 01",
    title: "MONOLITH OF SILENCE",
    medium: "120MM COLOR REVERSAL",
    location: "KYOTO, JAPAN",
    year: "2026",
    description: "Tectonic shadows cast by concrete monoliths under raking low-temperature dawn light.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[16/10] w-[85vw] sm:w-[540px] md:w-[680px]",
    link: "/work",
  },
  {
    id: "02",
    number: "SUITE 02",
    title: "CONCRETE SANCTUARY",
    medium: "MEDIUM FORMAT ANALOG",
    location: "TOKYO, JAPAN",
    year: "2025",
    description: "Architectural void and sacred geometries isolating atmospheric silence from urban density.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[4/5] w-[75vw] sm:w-[420px] md:w-[500px]",
    link: "/project/blueyard",
  },
  {
    id: "03",
    number: "SUITE 03",
    title: "ETHER & GLACIER",
    medium: "HIGH-DYNAMIC SENSOR",
    location: "REYKJAVIK, ICELAND",
    year: "2025",
    description: "Atmospheric horizon and geothermal mist across sub-zero highland plateaus at 05:40 AM.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[16/9] w-[85vw] sm:w-[560px] md:w-[720px]",
    link: "/work",
  },
  {
    id: "04",
    number: "SUITE 04",
    title: "DRAPE & SHADOW",
    medium: "SILVER GELATIN PRINT",
    location: "PARIS, FRANCE",
    year: "2024",
    description: "Sculptural textile studies translating silk volumes into monumental architectural forms.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[4/5] w-[75vw] sm:w-[420px] md:w-[500px]",
    link: "/portfolio",
  },
];

export default function Scene05HorizontalSequence() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressPillRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(1);
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(trackWidth - windowWidth + (windowWidth < 768 ? 40 : 120));
    };

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Scrub track horizontally
        const totalX = getScrollAmount();
        track.style.transform = `translate3d(${(p * totalX).toFixed(1)}px, 0, 0)`;

        // Update active index (1 to 4)
        const currentSuite = Math.min(4, Math.max(1, Math.floor(p * 4) + 1));
        setActiveIdx(currentSuite);

        // Progress indicators
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
        }
        if (progressPillRef.current) {
          const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
          progressPillRef.current.innerText = `SCENE 05 · ${pct.toString().padStart(2, "0")}%`;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      id="scene-05-horizontal-sequence"
      ref={containerRef}
      className="relative w-full h-[360vh] bg-[#1B1917] text-[#F5F3EE] z-10"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-10 md:py-14 px-6 md:px-12 lg:px-16 select-none bg-[#141312]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4 z-20">
          <div className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-mono text-white/75">
            <span className="text-white font-medium">04</span>
            <span className="w-8 h-[1px] bg-white/30" />
            <span>HORIZONTAL PHOTOGRAPHIC SEQUENCE</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-white/70 hidden sm:block">
              VERTICAL SCROLL DRIVES HORIZONTAL TRAVEL
            </div>
            <div
              ref={progressPillRef}
              className="glass-capsule px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] text-black bg-white/90 shadow-sm"
            >
              SCENE 05 · 00%
            </div>
          </div>
        </div>

        {/* Horizontal Moving Track */}
        <div className="relative my-auto w-full overflow-visible z-10">
          <div
            ref={trackRef}
            className="flex items-center space-x-8 md:space-x-16 pl-4 md:pl-10 will-change-transform"
          >
            {suites.map((item, index) => {
              const isActive = activeIdx === index + 1;
              return (
                <div
                  key={item.id}
                  onClick={() => triggerTransition(item.link)}
                  data-cursor="OPEN"
                  data-magnetic
                  className={`relative flex-shrink-0 group cursor-pointer transition-all duration-500 ${
                    isActive ? "opacity-100 scale-100" : "opacity-60 scale-[0.96]"
                  }`}
                >
                  {/* Large Parallax Roman Index */}
                  <span className="absolute -top-12 -left-4 text-[clamp(60px,10vw,120px)] font-serif font-light text-white/[0.07] select-none pointer-events-none leading-none">
                    0{index + 1}
                  </span>

                  {/* Photographic Frame */}
                  <div
                    className={`relative ${item.aspect} rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#201E1B] transition-transform duration-500 group-hover:scale-[1.02]`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 85vw, 60vw"
                      className="object-cover object-center filter contrast-[1.12] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* In-Frame Plate Details */}
                    <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.25em] text-white/70 mb-1.5">
                        <span>{item.number}</span>
                        <span>{item.year}</span>
                      </div>
                      <h3 className="font-serif font-light text-2xl md:text-3xl text-white uppercase tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 font-sans font-light text-xs md:text-sm text-white/80 max-w-[420px] line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.2em] text-white/50 mt-3 pt-2.5 border-t border-white/20">
                        <span>{item.location}</span>
                        <span>{item.medium}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Horizontal Timeline & Navigation */}
        <div className="relative z-20 pt-4 border-t border-white/15 flex flex-col space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] font-mono text-white/60">
            <span>SUITE {activeIdx} OF 4 ACTIVE</span>
            <span>SCROLL DOWN TO ADVANCE HORIZONTALLY</span>
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
