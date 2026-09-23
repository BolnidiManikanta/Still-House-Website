"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CameraSVG from "./CameraSVG";
import { usePageTransition } from "./PageTransition";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";
import { getTypographyStyles } from "@/lib/admin/styleHelpers";

export default function Hero() {
  const { triggerTransition } = usePageTransition();
  const { config } = useSiteConfig();
  const workData = config.work;

  const heroSectionRef = useRef<HTMLElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const dreamRef = useRef<HTMLHeadingElement>(null);
  const scapesRef = useRef<HTMLHeadingElement>(null);
  const slashRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. CAMERA SVG FLOATING MOTION & ENTRANCE REVEAL
      if (cameraRef.current) {
        gsap.to(cameraRef.current, {
          y: -15,
          duration: 12,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.fromTo(
          cameraRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1.0, duration: 2.0, ease: "power4.out" }
        );
      }

      // 2. EDITORIAL LINE-BASED HEADING ENTRANCES
      if (dreamRef.current) {
        gsap.fromTo(
          dreamRef.current,
          { opacity: 0, yPercent: 60 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 1.4,
            ease: "power4.out",
          }
        );
      }

      if (scapesRef.current) {
        gsap.fromTo(
          scapesRef.current,
          { opacity: 0, yPercent: 60 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 1.4,
            delay: 0.15,
            ease: "power4.out",
          }
        );
      }

      if (slashRef.current) {
        gsap.fromTo(
          slashRef.current,
          { opacity: 0, scaleY: 0 },
          { opacity: 0.7, scaleY: 1, duration: 1.2, delay: 0.2, ease: "power3.out" }
        );
      }

      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.4, ease: "power4.out" }
        );
      }

      // 3. MULTI-LAYERED HERO SCROLL PARALLAX SCRUB
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (dreamRef.current) {
        heroTimeline.to(dreamRef.current, { y: -90, opacity: 0.88, ease: "none" }, 0);
      }

      if (scapesRef.current) {
        heroTimeline.to(scapesRef.current, { y: -60, opacity: 0.88, ease: "none" }, 0);
      }

      if (cameraRef.current) {
        heroTimeline.to(cameraRef.current, { y: -140, opacity: 0.85, ease: "none" }, 0);
      }

      if (slashRef.current) {
        heroTimeline.to(slashRef.current, { y: -60, opacity: 0.4, ease: "none" }, 0);
      }

      if (metaRef.current) {
        heroTimeline.to(metaRef.current, { y: -40, opacity: 0.88, ease: "none" }, 0);
      }
    }, heroSectionRef);

    // Subtle Mouse Parallax Shift
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const normX = clientX / window.innerWidth - 0.5;
      const normY = clientY / window.innerHeight - 0.5;

      const titleX = normX * 4;
      const titleY = normY * 3;
      const cameraX = normX * 12;
      const cameraY = normY * 8;

      if (dreamRef.current) {
        gsap.to(dreamRef.current, { x: titleX, y: titleY, duration: 1.2, ease: "power2.out" });
      }
      if (scapesRef.current) {
        gsap.to(scapesRef.current, { x: -titleX, y: titleY, duration: 1.2, ease: "power2.out" });
      }
      if (cameraRef.current) {
        gsap.to(cameraRef.current, { x: cameraX, y: cameraY, duration: 1.2, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroSectionRef}
      className="hero relative w-full h-screen min-h-[100vh] flex flex-col justify-between px-[24px] md:px-[48px] lg:px-[80px] pt-28 pb-14 overflow-hidden bg-[#F5F2ED] text-[#151515] select-none"
    >
      {/* SUBTLE 3% FILM GRAIN */}
      <div ref={grainRef} className="grain texture-film-grain opacity-[0.03] pointer-events-none z-0" />

      {/* Z-INDEX 10: HIGH CONTRAST CAMERA WIREFRAME SVG LAYER */}
      <div
        ref={cameraRef}
        className="camera-wireframe absolute inset-0 flex items-center justify-center pointer-events-none z-[10]"
      >
        <CameraSVG />
      </div>

      {/* Z-INDEX 20: HIGH-CONTRAST EDITORIAL DISPLAY SERIF TYPOGRAPHY (PROPORTIONATE CLAMP SCALE) */}
      <div className="relative w-full h-full z-20 pointer-events-none my-auto" style={{ perspective: "1200px" }}>

        {/* PROJECT / DREAM */}
        <div className="absolute top-[22%] left-[6%] pointer-events-auto overflow-hidden">
          <h1
            ref={dreamRef}
            style={getTypographyStyles(workData.titleTypography)}
            className="font-serif font-light text-[clamp(75px,8.5vw,150px)] leading-[0.85] tracking-[-0.035em] text-[#151515] uppercase inline-block cursor-default transition-all duration-200"
          >
            {workData.heroTitleLine1}
          </h1>
        </div>

        {/* Diagonal Slash / */}
        <div className="absolute top-[44%] left-[47%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <span
            ref={slashRef}
            className="font-serif font-light text-[clamp(65px,7.5vw,130px)] leading-none text-[#151515] opacity-70 inline-block transform rotate-[15deg]"
          >
            {workData.heroSlash}
          </span>
        </div>

        {/* SCAPES */}
        <div className="absolute top-[54%] right-[7%] pointer-events-auto overflow-hidden">
          <h1
            ref={scapesRef}
            style={getTypographyStyles(workData.titleTypography)}
            className="font-serif font-light text-[clamp(75px,8.5vw,150px)] leading-[0.85] tracking-[-0.035em] text-[#151515] uppercase inline-block cursor-default transition-all duration-200"
          >
            {workData.heroTitleLine2}
          </h1>
        </div>

      </div>

      {/* Z-INDEX 30: BOTTOM METADATA & OVERVIEW */}
      <div ref={metaRef} className="relative z-30 border-t border-[#151515]/25 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end">
        {/* Bottom Left Overview Teaser */}
        <div className="mb-4 sm:mb-0">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[rgba(21,21,21,0.75)] font-mono block mb-1">
            {workData.overviewTag}
          </span>
          <p className="text-[15px] md:text-[16px] leading-[1.75] text-[#151515] max-w-[480px] font-sans font-normal">
            {workData.overviewDescription}
          </p>
        </div>

        {/* Bottom Right: VOLUME ONE */}
        <div className="text-right">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[rgba(21,21,21,0.75)] font-mono block mb-1">
            {workData.volumeTag}
          </span>
          <div className="font-serif text-[clamp(26px,2.2vw,50px)] text-[#151515] uppercase font-light tracking-[0.08em] leading-none">
            {workData.volumeTitle}
          </div>
        </div>
      </div>
    </section>
  );
}
