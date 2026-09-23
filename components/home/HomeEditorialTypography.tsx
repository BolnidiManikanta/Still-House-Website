"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "../PageTransition";

export default function HomeEditorialTypography() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. KINETIC OPPOSING TYPOGRAPHY SCRUB (Line 1 moves right, Line 2 moves left)
      if (line1Ref.current) {
        gsap.fromTo(
          line1Ref.current,
          { xPercent: -15, opacity: 0.35 },
          {
            xPercent: 15,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }

      if (line2Ref.current) {
        gsap.fromTo(
          line2Ref.current,
          { xPercent: 15, opacity: 0.35 },
          {
            xPercent: -15,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }

      // 2. CENTRAL PHOTOGRAPHIC PLATE REVEAL (Scale & Progressive Aperture)
      if (imageCardRef.current) {
        gsap.fromTo(
          imageCardRef.current,
          {
            scale: 0.88,
            clipPath: "inset(18% 10% 18% 10% round 20px)",
            opacity: 0.2,
          },
          {
            scale: 1.02,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }

      // 3. CURATORIAL QUOTE OPACITY & TRACKING
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "center 70%",
              end: "bottom 90%",
              scrub: 1,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="editorial-manifesto"
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#EBE7E1] text-[#110F0E] z-20 border-b border-[#110F0E]/12"
    >
      {/* Pinned Sticky Stage */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between items-center py-12 md:py-16 px-6 select-none bg-[#EBE7E1]"
      >
        {/* Eyebrow Label */}
        <div className="w-full max-w-[1600px] flex justify-between items-center border-b border-[#110F0E]/15 pb-4 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
          <div className="flex items-center space-x-3">
            <span className="text-[#110F0E] font-medium">03</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>EDITORIAL MANIFESTO</span>
          </div>
          <span className="hidden sm:inline-block text-[#110F0E]/50">
            STILL / STUDIO KYOTO
          </span>
        </div>

        {/* Central Kinetic Typography & Photographic Plate Composition */}
        <div className="relative w-full max-w-[1700px] my-auto flex flex-col items-center justify-center">
          {/* Opposing Scrubbed Display Line 1 */}
          <h2
            ref={line1Ref}
            className="font-serif font-light text-[clamp(42px,8vw,144px)] tracking-[-0.04em] leading-[0.84] text-[#110F0E] uppercase text-center whitespace-nowrap will-change-transform z-10"
          >
            ATMOSPHERIC SILENCE
          </h2>

          {/* Center Emerging Monograph Plate */}
          <div
            ref={imageCardRef}
            onClick={() => triggerTransition("/work")}
            className="relative my-4 md:-my-8 z-20 w-[260px] sm:w-[320px] md:w-[420px] aspect-[3/4] bg-[#dedad2] overflow-hidden shadow-2xl border border-black/15 cursor-pointer will-change-transform group"
            data-cursor="VIEW"
          >
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=98"
              alt="Silent Profile in Zurich"
              fill
              sizes="(max-width: 768px) 70vw, 420px"
              className="object-cover object-center filter contrast-[1.12] saturate-[1.05] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 inset-x-4 flex justify-between items-baseline text-[10px] uppercase font-mono tracking-[0.25em] text-[#F5F3EE]">
              <span>SILENT PROFILE</span>
              <span>ZURICH · 2025</span>
            </div>
          </div>

          {/* Opposing Scrubbed Display Line 2 */}
          <h2
            ref={line2Ref}
            className="font-serif font-light text-[clamp(42px,8vw,144px)] tracking-[-0.04em] leading-[0.84] text-[#110F0E] uppercase text-center whitespace-nowrap will-change-transform z-10"
          >
            MONUMENTAL FORM
          </h2>
        </div>

        {/* Curatorial Quote Footer */}
        <div
          ref={quoteRef}
          className="w-full max-w-[700px] text-center will-change-transform"
        >
          <p className="font-sans font-light text-[14px] md:text-[16px] leading-[1.7] text-[#110F0E]/80">
            &ldquo;The photograph does not capture physical space; it isolates the exact tactile silence before space is named.&rdquo;
          </p>
          <span className="text-[10px] uppercase tracking-[0.30em] font-mono text-[#110F0E]/50 block mt-2">
            STILL STUDIO ARCHIVES — SPRING 2026
          </span>
        </div>
      </div>
    </section>
  );
}
