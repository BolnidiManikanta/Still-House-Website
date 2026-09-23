"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeImageReveal from "./HomeImageReveal";
import { usePageTransition } from "../PageTransition";

interface ArchiveItem {
  id: string;
  title: string;
  medium: string;
  year: string;
  location: string;
  image: string;
  aspect: string;
  link: string;
}

const archiveItems: ArchiveItem[] = [
  {
    id: "01",
    title: "CONCRETE SANCTUARY",
    medium: "120MM COLOR REVERSAL",
    year: "2025",
    location: "TOKYO, JAPAN",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
    aspect: "aspect-[4/5]",
    link: "/project/blueyard",
  },
  {
    id: "02",
    title: "MONUMENT OF SILENCE",
    medium: "MEDIUM FORMAT ANALOG",
    year: "2026",
    location: "KYOTO, JAPAN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=90",
    aspect: "aspect-[16/10]",
    link: "/work",
  },
  {
    id: "03",
    title: "MIST & PLATEAU",
    medium: "HIGH RES DIGITAL SENSOR",
    year: "2025",
    location: "REYKJAVIK, ICELAND",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=90",
    aspect: "aspect-[3/4]",
    link: "/work",
  },
  {
    id: "04",
    title: "SILENT PROFILE",
    medium: "SILVER GELATIN PRINT",
    year: "2025",
    location: "ZURICH, SWITZERLAND",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=90",
    aspect: "aspect-[4/5]",
    link: "/work",
  },
];

export default function HomeExhibitionArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      const cards = section.querySelectorAll(".archive-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0.3 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            delay: (i % 2) * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
          }
        );
      });
    }
  }, []);

  return (
    <section
      id="exhibition-archive"
      ref={sectionRef}
      className="relative w-full bg-[#EBE7E1] text-[#110F0E] py-28 md:py-40 lg:py-48 px-[24px] md:px-[48px] lg:px-[80px] border-b border-[#110F0E]/12 z-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#110F0E]/15 pb-6 mb-20 md:mb-28 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
          <div className="flex items-center space-x-3">
            <span className="text-[#110F0E] font-medium">03</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>EXHIBITION CATALOGUE</span>
          </div>
          <span className="text-[#110F0E]/50">[ 04 ARCHIVED MONOGRAPHS ]</span>
        </div>

        {/* Section Title */}
        <div className="mb-20 md:mb-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h2 className="font-serif font-light text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[-0.035em] leading-[0.88] text-[#110F0E]">
            ARCHIVED WORKS
          </h2>
          <p className="font-sans font-light text-[15px] leading-[1.7] text-[#110F0E]/75 max-w-[420px]">
            Limited edition monographs and exhibition prints available for institutional acquisition and private collectors.
          </p>
        </div>

        {/* 2-Column Staggered Exhibition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 lg:gap-32 items-start">
          {archiveItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => triggerTransition(item.link)}
              className={`archive-card cursor-pointer group ${
                idx % 2 === 1 ? "md:translate-y-24" : ""
              }`}
            >
              <HomeImageReveal
                src={item.image}
                alt={item.title}
                aspect={item.aspect}
                cursorLabel="OPEN"
              />

              <div className="mt-6 flex justify-between items-baseline border-b border-[#110F0E]/15 pb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.28em] font-mono text-[#110F0E]/50 block mb-1">
                    {item.id} — {item.medium}
                  </span>
                  <h4 className="font-serif text-2xl font-light text-[#110F0E] tracking-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                    {item.title}
                  </h4>
                </div>
                <div className="text-right text-[11px] uppercase tracking-[0.22em] font-mono">
                  <span className="block text-[#110F0E] font-medium">{item.year}</span>
                  <span className="block text-[#110F0E]/50 text-[10px]">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
