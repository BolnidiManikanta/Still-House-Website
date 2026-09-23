"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "../PageTransition";

interface ProjectItem {
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

const projects: ProjectItem[] = [
  {
    id: "01",
    number: "PROJECT 01",
    title: "MONOLITH OF SILENCE",
    medium: "120MM COLOR REVERSAL",
    location: "KYOTO, JAPAN",
    year: "2026",
    description: "Tectonic shadows cast by concrete monoliths under raking low-temperature dawn light.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[16/10] md:w-[720px]",
    link: "/work",
  },
  {
    id: "02",
    number: "PROJECT 02",
    title: "CONCRETE SANCTUARY",
    medium: "MEDIUM FORMAT ANALOG",
    location: "TOKYO, JAPAN",
    year: "2025",
    description: "Architectural void and sacred geometries isolating atmospheric silence from urban density.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[4/5] md:w-[540px]",
    link: "/project/blueyard",
  },
  {
    id: "03",
    number: "PROJECT 03",
    title: "ETHER & GLACIER",
    medium: "HIGH-DYNAMIC SENSOR",
    location: "REYKJAVIK, ICELAND",
    year: "2025",
    description: "Atmospheric horizon and geothermal mist across sub-zero highland plateaus at 05:40 AM.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[16/9] md:w-[780px]",
    link: "/work",
  },
  {
    id: "04",
    number: "PROJECT 04",
    title: "DRAPE & SHADOW",
    medium: "SILVER GELATIN PRINT",
    location: "PARIS, FRANCE",
    year: "2024",
    description: "Sculptural textile studies translating silk volumes into monumental architectural forms.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=95",
    aspect: "aspect-[4/5] md:w-[540px]",
    link: "/portfolio",
  },
];

export default function HomeHorizontalSequence() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(1);
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Calculate total horizontal travel distance
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        return -(trackWidth - windowWidth + (windowWidth < 768 ? 40 : 120));
      };

      // 1. VERTICAL-TO-HORIZONTAL CONTINUOUS SCRUB TIMELINE
      const horizontalTween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            // Update active project index (1 to 4)
            const currentProject = Math.min(4, Math.max(1, Math.floor(p * 4) + 1));
            setActiveIdx(currentProject);

            // Update scrub progress line
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
            }
          },
        },
      });

      // 2. INNER PARALLAX FOR EACH PHOTOGRAPHIC CARD (Counter-drift)
      const images = track.querySelectorAll(".horizontal-plate-img");
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="horizontal-monographs"
      ref={containerRef}
      className="relative w-full h-[380vh] bg-[#110F0E] text-[#F5F3EE] z-20"
    >
      {/* Pinned Sticky Stage — Viewport pinned while vertical scroll scrubs horizontal track */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between py-10 md:py-14 px-6 md:px-16 select-none bg-[#110F0E]"
      >
        {/* Top Editorial Navigation & Live Project Counter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 text-[11px] uppercase tracking-[0.25em] font-mono text-white/60">
          <div className="flex items-center space-x-3">
            <span className="text-[#F5F3EE] font-medium">02</span>
            <span className="w-8 h-[1px] bg-white/20" />
            <span>HORIZONTAL MONOGRAPH SEQUENCE</span>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center space-x-6">
            <span className="text-white/40 hidden md:inline-block">
              VERTICAL SCROLL SCRUBS GALLERY
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-[#F5F3EE] font-medium text-[12px]">
                0{activeIdx}
              </span>
              <span className="text-white/30">/</span>
              <span className="text-white/40">04</span>
            </div>
          </div>
        </div>

        {/* Live Scrub Progress Line */}
        <div className="w-full h-[1px] bg-white/10 relative -mt-3 overflow-hidden">
          <div
            ref={progressLineRef}
            className="absolute inset-y-0 left-0 w-full bg-[#F5F3EE] origin-left will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* HORIZONTAL CAROUSEL TRACK (Scroll-scrubbed) */}
        <div className="relative w-full my-auto overflow-visible py-4">
          <div
            ref={trackRef}
            className="flex flex-nowrap items-center h-[58vh] md:h-[64vh] gap-10 md:gap-20 will-change-transform"
            style={{ width: "max-content" }}
          >
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => triggerTransition(proj.link)}
                className="group relative flex-shrink-0 cursor-pointer flex flex-col justify-between h-full"
                data-cursor="OPEN"
              >
                {/* Photographic Plate Container */}
                <div
                  className={`relative overflow-hidden bg-[#1a1918] border border-white/10 rounded-sm ${proj.aspect} flex-1 max-h-[48vh] md:max-h-[52vh]`}
                >
                  <div className="relative w-[120%] h-full -left-[10%] horizontal-plate-img will-change-transform">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 800px"
                      className="object-cover object-center filter contrast-[1.12] saturate-[1.05] transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  {/* Subtle Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Editorial Metadata Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-baseline text-[11px] uppercase tracking-[0.22em] font-mono text-white/70">
                  <div>
                    <span className="text-[10px] text-white/40 block mb-0.5">
                      {proj.number} · {proj.medium}
                    </span>
                    <h3 className="font-serif font-light text-2xl md:text-3xl tracking-tight text-[#F5F3EE] normal-case group-hover:text-white transition-colors">
                      {proj.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[#F5F3EE] font-medium block">{proj.year}</span>
                    <span className="text-[10px] text-white/40 block">{proj.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Editorial Caption & Navigation Cue */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.25em] font-mono text-white/50">
          <span>DREAMSCAPES ARCHITECTURAL MONOGRAPH ARCHIVE</span>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <span>SCROLL TO CONTINUE</span>
            <span className="animate-pulse">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
