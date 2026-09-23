"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeImageReveal from "./HomeImageReveal";

export default function HomeSeriesShowcase() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      // CONTINUOUS OVERLAPPING FLOW (Section parallax scrub)
      const sections = container.querySelectorAll(".series-block");
      sections.forEach((sec) => {
        const title = sec.querySelector(".series-title");
        if (title) {
          gsap.fromTo(
            title,
            { y: 35, opacity: 0.2 },
            {
              y: -15,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sec,
                start: "top 90%",
                end: "bottom 20%",
                scrub: 1.2,
              },
            }
          );
        }
      });
    }
  }, []);

  return (
    <section
      id="series-showcase"
      ref={containerRef}
      className="relative w-full bg-[#F5F3EE] text-[#110F0E] py-28 md:py-40 lg:py-48 px-[24px] md:px-[48px] lg:px-[80px] border-b border-[#110F0E]/12 z-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#110F0E]/15 pb-6 mb-20 md:mb-32 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
          <div className="flex items-center space-x-3">
            <span className="text-[#110F0E] font-medium">02</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>FEATURED MONOGRAPH SERIES</span>
          </div>
          <span className="text-[#110F0E]/50">[ 03 CURATED SUITES ]</span>
        </div>

        {/* SUITE 01 — MONOLITH OF SILENCE (Asymmetric Staggered Pair) */}
        <div className="series-block mb-36 md:mb-52">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-[#110F0E]/10 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.30em] text-[#110F0E]/50 font-mono block mb-1">
                SUITE 01
              </span>
              <h3 className="series-title font-serif font-light text-3xl md:text-5xl lg:text-6xl tracking-[-0.03em] text-[#110F0E]">
                Monolith of Silence
              </h3>
            </div>
            <span className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/60 mt-2 md:mt-0">
              KYOTO & ZURICH — 2025/2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="md:col-span-7">
              <HomeImageReveal
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=98"
                alt="Monolith of Silence in Kyoto"
                aspect="aspect-[4/5]"
                category="PLATE 01.A — SHADOW STUDY"
                caption="Monolith Perimeter"
                location="KYOTO, JAPAN"
                year="2026"
                cursorLabel="VIEW"
              />
            </div>

            <div className="md:col-span-5 md:pt-28">
              <HomeImageReveal
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=98"
                alt="Silent Profile in Zurich"
                aspect="aspect-[3/4]"
                category="PLATE 01.B — ANALOG PORTRAIT"
                caption="Silent Profile"
                location="ZURICH, SWITZERLAND"
                year="2025"
                cursorLabel="VIEW"
              />
              <p className="mt-8 font-sans font-light text-[14px] md:text-[15px] leading-[1.7] text-[#110F0E]/70 max-w-[380px]">
                Investigating the emotional resonance of monolithic surfaces under sharp solar angles and low-temperature studio light.
              </p>
            </div>
          </div>
        </div>

        {/* SUITE 02 — ETHER & GLACIER (Cinematic Panoramic Full-Bleed Plate) */}
        <div className="series-block mb-36 md:mb-52">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-[#110F0E]/10 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.30em] text-[#110F0E]/50 font-mono block mb-1">
                SUITE 02
              </span>
              <h3 className="series-title font-serif font-light text-3xl md:text-5xl lg:text-6xl tracking-[-0.03em] text-[#110F0E]">
                Ether & Glacier
              </h3>
            </div>
            <span className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/60 mt-2 md:mt-0">
              REYKJAVIK HIGHLANDS — 2025
            </span>
          </div>

          <div className="w-full">
            <HomeImageReveal
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=98"
              alt="Ether & Glacier in Reykjavik"
              aspect="aspect-[16/9] md:aspect-[21/9]"
              category="PLATE 02.A — ATMOSPHERIC LANDSCAPE"
              caption="Glacial Horizon at 05:40 AM"
              location="REYKJAVIK, ICELAND"
              year="2025"
              cursorLabel="EXPLORE"
            />
          </div>
        </div>

        {/* SUITE 03 — DRAPE & SHADOW (Haute Couture Architectural Form) */}
        <div className="series-block">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-[#110F0E]/10 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.30em] text-[#110F0E]/50 font-mono block mb-1">
                SUITE 03
              </span>
              <h3 className="series-title font-serif font-light text-3xl md:text-5xl lg:text-6xl tracking-[-0.03em] text-[#110F0E]">
                Drape & Shadow
              </h3>
            </div>
            <span className="text-[11px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/60 mt-2 md:mt-0">
              PARIS CAMPAIGN — 2024
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-5 order-2 md:order-1 flex flex-col space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/50">
                SCULPTURAL TEXTURE STUDY
              </span>
              <h4 className="font-serif font-light text-2xl md:text-4xl text-[#110F0E] leading-tight">
                Textural fluidity meeting sharp cast shadows.
              </h4>
              <p className="font-sans font-light text-[15px] leading-[1.75] text-[#110F0E]/75 max-w-[420px]">
                The series translates textiles as architectural volumes, rendering the delicate tension between dense shadow and illuminated silk under single-source directional tungsten lighting.
              </p>
            </div>

            <div className="md:col-span-7 order-1 md:order-2">
              <HomeImageReveal
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=98"
                alt="Drape and Shadow Haute Couture Study in Paris"
                aspect="aspect-[4/5] md:aspect-[16/10]"
                category="PLATE 03.A — HAUTE COUTURE"
                caption="Silk Volume & Gradient Cast"
                location="PARIS, FRANCE"
                year="2024"
                cursorLabel="VIEW"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
