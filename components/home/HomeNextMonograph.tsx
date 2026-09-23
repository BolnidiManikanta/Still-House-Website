"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "../PageTransition";

export default function HomeNextMonograph() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardFrameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const cardFrame = cardFrameRef.current;
    const title = titleRef.current;
    if (!section || !cardFrame || !title) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. SCROLL-SCRUBBED APERTURE EXPANSION (Card expands smoothly as user scrolls)
      gsap.fromTo(
        cardFrame,
        {
          clipPath: "inset(14% 10% 14% 10% round 24px)",
          scale: 0.94,
          opacity: 0.5,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1.00,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // 2. SCROLL-SCRUBBED TITLE SHARPENING & ELEVATION
      gsap.fromTo(
        title,
        {
          y: 45,
          opacity: 0.25,
          filter: "blur(6px)",
          letterSpacing: "-0.06em",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          letterSpacing: "-0.03em",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "center 45%",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="next-monograph"
      ref={sectionRef}
      className="relative w-full min-h-[90vh] flex flex-col justify-between py-24 md:py-36 px-[24px] md:px-[48px] lg:px-[80px] bg-[#E2DED6] text-[#110F0E] overflow-hidden z-20"
    >
      {/* Scroll-Scrubbed Expanding Background Photographic Plate */}
      <div
        ref={cardFrameRef}
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2600&q=98"
          alt="Next Project Background Preview"
          fill
          sizes="100vw"
          className="object-cover object-center filter contrast-[1.15] saturate-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#E2DED6] via-[#E2DED6]/60 to-[#E2DED6]/75" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full flex flex-col justify-between h-full flex-1">
        {/* Eyebrow Header */}
        <div className="flex items-center justify-between border-b border-[#110F0E]/15 pb-6 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
          <div className="flex items-center space-x-3">
            <span className="text-[#110F0E] font-medium">05</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>CONTINUING MONOGRAPH</span>
          </div>
          <span className="text-[#110F0E]/50">STILL / STUDIO 2026</span>
        </div>

        {/* Center Interactive Teaser */}
        <div className="my-auto py-16 md:py-24 text-center flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-[0.35em] font-mono text-[#110F0E]/60 block mb-6">
            NEXT EXHIBITION PROJECT
          </span>

          <button
            onClick={() => triggerTransition("/project/blueyard")}
            data-cursor="OPEN"
            data-magnetic
            className="group cursor-pointer focus:outline-none"
          >
            <h2
              ref={titleRef}
              className="font-serif font-light text-[clamp(48px,10vw,150px)] leading-[0.85] text-[#110F0E] uppercase will-change-transform transition-colors duration-500 group-hover:text-black"
            >
              BLUEYARD
            </h2>
          </button>

          <p className="mt-8 font-sans font-light text-[15px] md:text-[18px] text-[#110F0E]/80 max-w-[500px]">
            Spatial monography exploring concrete geometries, isolated lightwells, and quiet architectural landscapes.
          </p>

          {/* Quick Route Links */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => triggerTransition("/work")}
              className="glass-capsule px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.16em] font-medium text-[#110F0E] cursor-pointer hover:bg-black/10 transition-colors"
              data-cursor="OPEN"
            >
              BROWSE ALL ARCHIVES
            </button>
            <button
              onClick={() => triggerTransition("/project/blueyard")}
              className="bg-[#110F0E] text-[#F5F3EE] px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.16em] font-medium cursor-pointer hover:bg-black transition-colors"
              data-cursor="OPEN"
            >
              EXPLORE BLUEYARD →
            </button>
          </div>
        </div>

        {/* Footer Monograph Metadata */}
        <div className="border-t border-[#110F0E]/15 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/60">
          <span>MONOGRAPH VOL. 02 — FORTHCOMING</span>
          <span className="mt-2 md:mt-0">TOKYO · KYOTO · REYKJAVIK · PARIS</span>
        </div>
      </div>
    </section>
  );
}
