"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingGlassOrb from "@/components/canvas/FloatingGlassOrb";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";
import { getTypographyStyles, getImageFilterStyles } from "@/lib/admin/styleHelpers";

export default function Scene01Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);

  const { config } = useSiteConfig();
  const heroData = config.home.hero;

  // Photographic Canvas Elements
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const imageAWrapperRef = useRef<HTMLDivElement>(null);
  const imageBWrapperRef = useRef<HTMLDivElement>(null);

  // Typography Elements
  const dreamscapesTitleRef = useRef<HTMLHeadingElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const monographTagRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  const metadataLeftRef = useRef<HTMLDivElement>(null);
  const metadataRightRef = useRef<HTMLDivElement>(null);

  // Floating Elements & Indicators
  const orbWrapperRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const progressPillRef = useRef<HTMLDivElement>(null);

  // Incoming Scene 02 Teaser Text inside Hero
  const teaserCuratorialRef = useRef<HTMLDivElement>(null);

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
        progressPillRef.current.innerText = `SCENE 01 · ${pct.toString().padStart(2, "0")}%`;
      }

      // 2. Scroll Prompt & Floating Orb Fade
      if (scrollPromptRef.current) {
        const promptOpacity = Math.max(0, 1 - p * 8); // Fades by p ≈ 0.12
        scrollPromptRef.current.style.opacity = promptOpacity.toFixed(3);
      }
      if (orbWrapperRef.current) {
        const orbOpacity = Math.max(0, 1 - p * 3.5);
        orbWrapperRef.current.style.opacity = orbOpacity.toFixed(3);
      }

      // 3. Hero Frame Morph & Insetting
      // At p = 0: 100% full bleed, 0 radius
      // At p = 0.20: insets into an architectural plate (92% width, 88vh, 20px radius)
      // At p = 0.45: shifts to left-asymmetric framing (50% width on desktop, 86vh)
      // At p = 0.75: Image B takes over
      // At p = 1.00: Image B expands to 100% bleed
      if (heroFrameRef.current) {
        const isMobile = window.innerWidth < 768;

        if (p <= 0.22) {
          const t = p / 0.22;
          const targetW = isMobile ? 94 : 92;
          const targetH = isMobile ? 90 : 88;
          const targetRadius = isMobile ? 14 : 20;

          const w = 100 - t * (100 - targetW);
          const h = 100 - t * (100 - targetH);
          const r = t * targetRadius;
          const shadow = t * 0.22;

          heroFrameRef.current.style.width = `${w.toFixed(2)}%`;
          heroFrameRef.current.style.height = `${h.toFixed(2)}vh`;
          heroFrameRef.current.style.borderRadius = `${r.toFixed(1)}px`;
          heroFrameRef.current.style.transform = `translate3d(0, 0, 0)`;
          heroFrameRef.current.style.boxShadow = `0 ${Math.round(shadow * 80)}px ${Math.round(shadow * 140)}px rgba(0,0,0,${shadow.toFixed(3)})`;
        } else if (p <= 0.55) {
          const t = (p - 0.22) / 0.33;
          const baseW = isMobile ? 94 : 92;
          const targetW = isMobile ? 94 : 48; // Shift to left column on desktop
          const baseH = isMobile ? 90 : 88;
          const targetH = isMobile ? 45 : 86;
          const targetX = isMobile ? 0 : -24; // Translate slightly left

          const w = baseW - t * (baseW - targetW);
          const h = baseH - t * (baseH - targetH);
          const x = t * targetX;

          heroFrameRef.current.style.width = `${w.toFixed(2)}%`;
          heroFrameRef.current.style.height = `${h.toFixed(2)}vh`;
          heroFrameRef.current.style.borderRadius = `20px`;
          heroFrameRef.current.style.transform = `translate3d(${x.toFixed(1)}%, 0, 0)`;
          heroFrameRef.current.style.boxShadow = `0 24px 60px rgba(0,0,0,0.22)`;
        } else if (p <= 0.85) {
          // Plate A shrinks back as Plate B takes center stage
          const t = (p - 0.55) / 0.30;
          const curOpacity = Math.max(0, 1 - t * 1.2);
          const curScale = 1 - t * 0.15;
          const curY = -t * 40;

          heroFrameRef.current.style.opacity = curOpacity.toFixed(3);
          heroFrameRef.current.style.transform = `translate3d(-24%, ${curY.toFixed(1)}px, 0) scale(${curScale.toFixed(3)})`;
        } else {
          heroFrameRef.current.style.opacity = "0";
        }
      }

      // 4. Image A Zoom & Focal Shift (Inside Hero Frame)
      if (imageAWrapperRef.current) {
        let scaleA = 1.0;
        let transYA = 0;
        let transXA = 0;

        if (p <= 0.30) {
          const t = p / 0.30;
          scaleA = 1.00 + t * 0.12; // 1.00 -> 1.12
          transYA = -t * 25;
          transXA = t * 10;
        } else if (p <= 0.60) {
          const t = (p - 0.30) / 0.30;
          scaleA = 1.12 + t * 0.08;
          transYA = -25 - t * 30;
          transXA = 10 - t * 5;
        } else {
          scaleA = 1.20;
          transYA = -55;
          transXA = 5;
        }

        imageAWrapperRef.current.style.transform = `translate3d(${transXA.toFixed(1)}px, ${transYA.toFixed(1)}px, 0) scale(${scaleA.toFixed(4)})`;
      }

      // 5. Image B (Incoming Tokyo Concrete Void Plate)
      if (imageBWrapperRef.current) {
        const isMobile = window.innerWidth < 768;

        if (p < 0.35) {
          imageBWrapperRef.current.style.opacity = "0";
          imageBWrapperRef.current.style.transform = `translate3d(${isMobile ? "0" : "50%"}, 80px, 0) scale(0.9)`;
          imageBWrapperRef.current.style.clipPath = "inset(15% 15% 15% 15% round 24px)";
        } else if (p <= 0.70) {
          const t = (p - 0.35) / 0.35;
          const opacity = t;
          const scale = 0.90 + t * 0.15; // 0.90 -> 1.05
          const transY = 80 - t * 80; // 80 -> 0px
          const transX = isMobile ? 0 : 50 - t * 25; // 50% -> 25%
          const inset = Math.round(15 * (1 - t));

          imageBWrapperRef.current.style.opacity = opacity.toFixed(3);
          imageBWrapperRef.current.style.transform = `translate3d(${transX.toFixed(1)}%, ${transY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          imageBWrapperRef.current.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${Math.round(24 * (1 - t))}px)`;
        } else {
          // Expands to dominant / full bleed
          const t = (p - 0.70) / 0.30;
          const scale = 1.05 - t * 0.05; // 1.05 -> 1.00
          const transX = isMobile ? 0 : 25 * (1 - t); // Centers

          imageBWrapperRef.current.style.opacity = "1";
          imageBWrapperRef.current.style.transform = `translate3d(${transX.toFixed(1)}%, 0, 0) scale(${scale.toFixed(3)})`;
          imageBWrapperRef.current.style.clipPath = "inset(0% 0% 0% 0% round 0px)";
          imageBWrapperRef.current.style.width = `${(isMobile ? 100 : 50 + t * 50).toFixed(1)}%`;
        }
      }

      // 6. Typography: "DREAMSCAPES"
      // At p = 0: Large center title
      // At p = 0.20: Moves upward (-60px), letter-spacing widens
      // At p = 0.45: Transforms to upper-left monograph header
      // At p = 0.70+: Fades as Scene 02 begins
      if (dreamscapesTitleRef.current) {
        if (p <= 0.20) {
          const t = p / 0.20;
          const y = -t * 50;
          const scale = 1.00 - t * 0.05;
          const tracking = 0.02 + t * 0.08;

          dreamscapesTitleRef.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          dreamscapesTitleRef.current.style.letterSpacing = `${tracking.toFixed(3)}em`;
          dreamscapesTitleRef.current.style.opacity = "1";
        } else if (p <= 0.55) {
          const t = (p - 0.20) / 0.35;
          const y = -50 - t * 120;
          const scale = 0.95 - t * 0.25; // Scales down toward header size
          const x = -t * 80;
          const opacity = 1.0 - t * 0.4;

          dreamscapesTitleRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          dreamscapesTitleRef.current.style.opacity = opacity.toFixed(3);
        } else {
          const t = (p - 0.55) / 0.25;
          dreamscapesTitleRef.current.style.opacity = Math.max(0, 0.6 - t * 0.6).toFixed(3);
          dreamscapesTitleRef.current.style.transform = `translate3d(-80px, -200px, 0) scale(0.7)`;
        }
      }

      // 7. Typography: "CREATING THE UNEXPECTED"
      // Moves with independent speed, translates right/down into the negative space
      if (headlineRef.current) {
        if (p <= 0.25) {
          const t = p / 0.25;
          const y = -t * 80;
          const x = t * 30;
          const scale = 1.0 - t * 0.04;
          headlineRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          headlineRef.current.style.opacity = "1";
        } else if (p <= 0.60) {
          const t = (p - 0.25) / 0.35;
          const y = -80 - t * 110;
          const x = 30 + t * 60; // Drifts into right column
          const opacity = 1.0 - t * 0.7;
          headlineRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
          headlineRef.current.style.opacity = opacity.toFixed(3);
        } else {
          headlineRef.current.style.opacity = "0";
        }
      }

      // 8. Monograph Description Tag
      if (monographTagRef.current) {
        if (p <= 0.20) {
          const t = p / 0.20;
          monographTagRef.current.style.transform = `translate3d(0, ${(-t * 40).toFixed(1)}px, 0)`;
          monographTagRef.current.style.opacity = (1 - t * 0.2).toFixed(3);
        } else if (p <= 0.45) {
          const t = (p - 0.20) / 0.25;
          monographTagRef.current.style.transform = `translate3d(0, ${(-40 - t * 60).toFixed(1)}px, 0)`;
          monographTagRef.current.style.opacity = Math.max(0, 0.8 - t * 0.8).toFixed(3);
        } else {
          monographTagRef.current.style.opacity = "0";
        }
      }

      // 8b. Contact & Review Hero Action Button
      if (ctaBtnRef.current) {
        if (p <= 0.15) {
          const t = p / 0.15;
          ctaBtnRef.current.style.opacity = (1 - t).toFixed(3);
          ctaBtnRef.current.style.transform = `translate3d(0, ${(-t * 24).toFixed(1)}px, 0)`;
          ctaBtnRef.current.style.pointerEvents = t > 0.8 ? "none" : "auto";
        } else {
          ctaBtnRef.current.style.opacity = "0";
          ctaBtnRef.current.style.pointerEvents = "none";
        }
      }

      // 9. Location & Exhibition Metadata
      if (metadataLeftRef.current) {
        const leftOpacity = Math.max(0, 1 - p * 3.5);
        const leftY = -p * 60;
        metadataLeftRef.current.style.opacity = leftOpacity.toFixed(3);
        metadataLeftRef.current.style.transform = `translate3d(0, ${leftY.toFixed(1)}px, 0)`;
      }
      if (metadataRightRef.current) {
        const rightOpacity = Math.max(0, 1 - p * 3.5);
        const rightY = -p * 60;
        metadataRightRef.current.style.opacity = rightOpacity.toFixed(3);
        metadataRightRef.current.style.transform = `translate3d(0, ${rightY.toFixed(1)}px, 0)`;
      }

      // 10. Incoming Curatorial Teaser Overlay (Reveals during Phase 3 & 4)
      if (teaserCuratorialRef.current) {
        if (p >= 0.50 && p <= 0.90) {
          const t = (p - 0.50) / 0.40;
          teaserCuratorialRef.current.style.opacity = t.toFixed(3);
          teaserCuratorialRef.current.style.transform = `translate3d(0, ${(30 - t * 30).toFixed(1)}px, 0)`;
        } else if (p > 0.90) {
          const t = (p - 0.90) / 0.10;
          teaserCuratorialRef.current.style.opacity = (1 - t * 0.5).toFixed(3);
        } else {
          teaserCuratorialRef.current.style.opacity = "0";
        }
      }
    };

    // Initialize at scroll 0
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
      id="scene-01-hero"
      ref={containerRef}
      className="relative w-full h-[320vh] bg-[#EBE7E1] z-10"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none"
      >
        {/* Ambient 3D Three.js Glass Orb */}
        <div
          ref={orbWrapperRef}
          className="absolute inset-0 z-20 pointer-events-none will-change-transform"
        >
          <FloatingGlassOrb />
        </div>

        {/* Dynamic Scrub Progress Pill */}
        <div className="absolute top-24 left-6 md:left-12 z-40 pointer-events-none">
          <div
            ref={progressPillRef}
            className="glass-capsule px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] text-[#110F0E]/80 shadow-sm"
          >
            SCENE 01 · 00%
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PLATE A: HERO PHOTOGRAPHIC CANVAS (Kyoto Dawn Monolith)            */}
        {/* ------------------------------------------------------------------ */}
        <div
          ref={heroFrameRef}
          className="relative w-full h-full overflow-hidden will-change-transform border border-[#110F0E]/15 flex items-center justify-center bg-[#2A2724]"
        >
          {/* Inner Image Container (Free to zoom, pan, and crop) */}
          <div
            ref={imageAWrapperRef}
            className="absolute -inset-[12%] w-[124%] h-[124%] will-change-transform"
          >
            <Image
              src={heroData.plate01Image}
              alt={heroData.plate01Title}
              fill
              priority
              sizes="100vw"
              unoptimized={heroData.plate01Image.startsWith("data:")}
              style={getImageFilterStyles(heroData.plate01Style)}
              className="object-cover object-center transition-all duration-300"
            />
            {/* Cinematic Gradient Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/45" />
          </div>

          {/* Vignette & Optical Film Border */}
          <div className="absolute inset-0 border border-white/10 pointer-events-none" />

          {/* In-frame Corner Plate Stamps */}
          <div className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.25em] font-mono text-white/60 pointer-events-none z-10">
            <span>{heroData.plate01Title}</span>
          </div>
          <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.25em] font-mono text-white/60 pointer-events-none z-10">
            <span>{heroData.plate01Camera}</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PLATE B: INCOMING PHOTOGRAPHIC SUITE (Tokyo Concrete Void)         */}
        {/* Reveals during scroll phases 3, 4, 5, taking over as Scene 02 opens*/}
        {/* ------------------------------------------------------------------ */}
        <div
          ref={imageBWrapperRef}
          className="absolute right-6 md:right-12 w-[88%] md:w-[48%] h-[60vh] md:h-[84vh] overflow-hidden will-change-transform z-20 border border-[#110F0E]/20 shadow-2xl bg-[#1C1A18] opacity-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={heroData.plate02Image}
              alt={heroData.plate02Title}
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              unoptimized={heroData.plate02Image.startsWith("data:")}
              style={getImageFilterStyles(heroData.plate02Style)}
              className="object-cover object-center transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
            
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/65 block mb-2">
                TRANSITIONING · SUITE 02
              </span>
              <h3 className="font-serif font-light text-2xl md:text-3xl text-white tracking-tight">
                {heroData.plate02Title}
              </h3>
              <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-white/50 block mt-1">
                {heroData.plate02Location}
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TYPOGRAPHY & EDITORIAL OVERLAY                                     */}
        {/* ------------------------------------------------------------------ */}
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 md:p-12 lg:p-16">
          {/* Top Monograph Identifier & Status */}
          <div className="flex justify-between items-start pt-16 md:pt-14">
            <div
              ref={metadataLeftRef}
              className="will-change-transform text-[11px] uppercase tracking-[0.25em] font-mono text-white/85 drop-shadow-md"
            >
              <span className="block font-medium">{heroData.volumeTag}</span>
              <span className="text-white/60 block mt-0.5">{heroData.publishedDate}</span>
            </div>

            <div
              ref={metadataRightRef}
              className="will-change-transform text-right text-[11px] uppercase tracking-[0.25em] font-mono text-white/85 drop-shadow-md hidden sm:block"
            >
              <span className="block font-medium">{heroData.locationArchive}</span>
              <span className="text-white/60 block mt-0.5">{heroData.archiveLabel}</span>
            </div>
          </div>

          {/* Center Display Typography: DREAMSCAPES + CREATING THE UNEXPECTED */}
          <div className="my-auto text-center flex flex-col items-center max-w-[1400px] mx-auto w-full px-4">
            <h1
              ref={dreamscapesTitleRef}
              style={getTypographyStyles(heroData.titleTypography)}
              className="font-serif font-light text-[clamp(52px,12vw,170px)] leading-[0.84] text-[#F5F3EE] uppercase will-change-transform tracking-[-0.03em] drop-shadow-2xl transition-all duration-200"
            >
              {heroData.monographTitle}
            </h1>

            <div
              ref={headlineRef}
              className="mt-6 md:mt-8 will-change-transform flex items-center justify-center space-x-3 md:space-x-6"
            >
              <span className="w-8 md:w-16 h-[1px] bg-white/40" />
              <h2 className="font-sans font-light text-[13px] sm:text-[16px] md:text-[20px] uppercase tracking-[0.32em] text-white/90 drop-shadow-md">
                CREATING THE UNEXPECTED
              </h2>
              <span className="w-8 md:w-16 h-[1px] bg-white/40" />
            </div>

            <p
              ref={monographTagRef}
              className="mt-4 md:mt-6 font-sans font-light text-[12px] md:text-[14px] uppercase tracking-[0.22em] text-white/70 max-w-[620px] text-center will-change-transform"
            >
              {heroData.headlineSecondary}
            </p>

            {/* Prominent Contact & Review Button */}
            <div
              ref={ctaBtnRef}
              className="mt-6 md:mt-8 pointer-events-auto flex items-center justify-center will-change-transform z-40"
            >
              <Link
                id="hero-contact-reviews-button"
                href={heroData.ctaButtonLink || "/contact-reviews"}
                prefetch={true}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/95 hover:bg-white text-[#111111] backdrop-blur-md text-[11px] font-mono uppercase tracking-[0.2em] font-semibold transition-all duration-200 active:scale-95 shadow-xl hover:shadow-2xl border border-white/50 cursor-pointer"
                data-cursor="OPEN"
                data-magnetic
              >
                <span>{heroData.ctaButtonText || "CONTACT & REVIEW"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Bottom Stage Bar: Scroll Prompt & Exhibition Specs */}
          <div className="flex justify-between items-end pb-2 md:pb-4">
            <div
              ref={scrollPromptRef}
              className="will-change-transform flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-mono text-white/75"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{heroData.scrollPrompt || "SCROLL TO EXPLORE EXHIBITION"}</span>
            </div>

            <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-white/60 hidden md:block">
              <span>01 / 07 MONOGRAPH SCENES</span>
            </div>
          </div>
        </div>

        {/* Teaser Curatorial Text that floats into view during late hero scroll */}
        <div
          ref={teaserCuratorialRef}
          className="absolute bottom-16 left-8 md:left-16 max-w-[560px] z-30 pointer-events-none opacity-0 will-change-transform"
        >
          <div className="border-l-2 border-white/60 pl-6 py-2 bg-black/40 backdrop-blur-md p-4 rounded-r-lg">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/70 block mb-1">
              CURATORIAL OVERVIEW
            </span>
            <p className="font-serif font-light text-lg md:text-xl text-white leading-snug">
              &ldquo;An exploration of atmospheric light, silence, and architectural monoliths.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
