"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeImageReveal from "./HomeImageReveal";

export default function HomeCuratorialOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const pinnedPlateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. SCROLL-SCRUBBED EDITORIAL HEADLINE (Word-by-word blur-to-sharp & translate)
      const words = headline.querySelectorAll(".editorial-word");
      gsap.fromTo(
        words,
        {
          opacity: 0.15,
          y: 28,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: headline,
            start: "top 88%",
            end: "top 35%",
            scrub: 1,
          },
        }
      );

      // 2. SCROLL-SCRUBBED SUPPORTING TEXT & CURATORIAL SPECS
      if (textColRef.current) {
        gsap.fromTo(
          textColRef.current.children,
          {
            opacity: 0.2,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: textColRef.current,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

      // 3. PINNED ARCHITECTURAL PLATE SUBTLE SCRUB (Scale & Elevation Depth)
      if (pinnedPlateRef.current) {
        gsap.fromTo(
          pinnedPlateRef.current,
          {
            y: 40,
            scale: 0.97,
          },
          {
            y: -30,
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const headlineText = "AN EXPLORATION OF ATMOSPHERIC LIGHT, SILENCE, AND ARCHITECTURAL MONOLITHS.";

  return (
    <section
      id="curatorial-overview"
      ref={sectionRef}
      className="relative w-full bg-[#EBE7E1] text-[#110F0E] py-28 md:py-40 lg:py-48 px-[24px] md:px-[48px] lg:px-[80px] border-b border-[#110F0E]/12 z-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Index & Eyebrow */}
        <div className="flex items-center justify-between border-b border-[#110F0E]/15 pb-6 mb-16 md:mb-24 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
          <div className="flex items-center space-x-3">
            <span className="text-[#110F0E] font-medium">01</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>CURATORIAL OVERVIEW</span>
          </div>
          <span className="hidden sm:inline-block text-[#110F0E]/50">
            DREAMSCAPES ARCHIVE
          </span>
        </div>

        {/* Main Editorial Headline — Scroll-Scrubbed */}
        <h2
          ref={headlineRef}
          className="font-serif font-light text-[34px] sm:text-[46px] md:text-[62px] lg:text-[76px] leading-[0.94] tracking-[-0.035em] text-[#110F0E] max-w-[1380px] mb-20 md:mb-32 select-none"
        >
          {headlineText.split(" ").map((word, i) => (
            <span
              key={i}
              className="editorial-word inline-block mr-[0.28em] will-change-transform"
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Asymmetric Split: Narrative & Strategic Pinned Photographic Feature Plate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Narrative & Technical Specs */}
          <div ref={textColRef} className="lg:col-span-6 flex flex-col space-y-10">
            <p className="font-sans font-light text-[17px] md:text-[20px] leading-[1.65] text-[#110F0E]/90 max-w-[580px]">
              DREAMSCAPES documents the tension between permanent brutalist geometry
              and ephemeral meteorological phenomena. Captured across six seasons
              between the highland plateaus of Reykjavik and the concrete sanctuaries
              of Kyoto and Tokyo.
            </p>

            <p className="font-sans font-light text-[15px] md:text-[16px] leading-[1.75] text-[#110F0E]/70 max-w-[540px]">
              Each exposure prioritizes natural atmospheric gradation over artificial correction.
              Photographed on medium-format analog film and ultra-high dynamic range digital sensors,
              the collection isolates the tactile silence that occurs when human form withdraws
              from monumental space.
            </p>

            {/* Museum Curatorial Metadata Grid */}
            <div className="pt-8 border-t border-[#110F0E]/15 grid grid-cols-2 gap-6 text-[11px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/75">
              <div>
                <span className="block text-[#110F0E]/45 mb-1">CHRONOLOGY</span>
                <span className="text-[#110F0E] font-medium block">2024 — 2026</span>
              </div>
              <div>
                <span className="block text-[#110F0E]/45 mb-1">MEDIUM</span>
                <span className="text-[#110F0E] font-medium block">ANALOG & DIGITAL</span>
              </div>
              <div>
                <span className="block text-[#110F0E]/45 mb-1">FIELD STATIONS</span>
                <span className="text-[#110F0E] font-medium block">KYOTO · REYKJAVIK</span>
              </div>
              <div>
                <span className="block text-[#110F0E]/45 mb-1">CURATOR</span>
                <span className="text-[#110F0E] font-medium block">STILL STUDIO</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pinned Architectural Monograph Plate with Scrubbed Aperture & Parallax */}
          <div ref={pinnedPlateRef} className="lg:col-span-6 lg:pl-8 sticky top-24 will-change-transform">
            <HomeImageReveal
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=98"
              alt="Concrete Sanctuary Void in Tokyo"
              aspect="aspect-[4/5]"
              category="FIG 01.1 — SPATIAL MONOGRAPH"
              caption="Concrete Sanctuary Void"
              location="TOKYO, JAPAN"
              year="2025"
              cursorLabel="EXPLORE"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
