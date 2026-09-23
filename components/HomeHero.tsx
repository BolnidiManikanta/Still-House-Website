"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingGlassOrb from "./canvas/FloatingGlassOrb";

export default function HomeHero() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);

  // Layer 1: Photographic Canvas & Framing Containers
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const imageARef = useRef<HTMLDivElement>(null);
  const imageBRef = useRef<HTMLDivElement>(null);

  // Layer 2: DREAMSCAPES Monograph Subtitle
  const subtitleRef = useRef<HTMLDivElement>(null);

  // Layer 3: CREATING THE UNEXPECTED Display Headline
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Layer 4: Sub-tag Monograph Description
  const subTagRef = useRef<HTMLParagraphElement>(null);

  // Layer 5: Location & Exhibition Metadata
  const metadataRef = useRef<HTMLDivElement>(null);

  // Layer 6: Ambient Orb & Scroll Prompt
  const orbWrapperRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  // Secondary Plate Content (Enters during Stage 3 & 4)
  const plateBContentRef = useRef<HTMLDivElement>(null);
  const progressBadgeRef = useRef<HTMLDivElement>(null);

  const headlineText = "CREATING THE UNEXPECTED";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (heroFrameRef.current) {
        heroFrameRef.current.style.width = "92%";
        heroFrameRef.current.style.height = "86vh";
        heroFrameRef.current.style.borderRadius = "20px";
      }
      return;
    }

    // HIGH PRECISION SCROLL-SCRUBBED MULTI-STAGE MOTION ENGINE
    // Pure function of scroll progress p (0.000 -> 1.000) over 350vh scroll distance
    const applyScrub = (p: number) => {
      // ----------------------------------------------------------------------
      // 1. DYNAMIC TIMELINE BADGE (Reflecting Stage Progress 0% -> 100%)
      // ----------------------------------------------------------------------
      if (progressBadgeRef.current) {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        progressBadgeRef.current.innerText = `${pct.toString().padStart(2, "0")}%`;
      }

      // ----------------------------------------------------------------------
      // 2. LAYER 1: HERO PHOTOGRAPH FRAME (PHYSICAL SCENIC INSETTING & MORPH)
      // ----------------------------------------------------------------------
      // Stage 1 (0-20%): Full bleed (100% / 100vh) with subtle cinematic drift
      // Stage 2 (20-40%): Frames gracefully into an architectural plate (94% / 90vh, 20px radius)
      // Stage 3-4 (40-80%): Morphing from Image A to Image B
      // Stage 5 (80-100%): Seamlessly transitions into next monograph section
      if (heroFrameRef.current) {
        const isMobile = window.innerWidth < 768;
        const targetWidth = isMobile ? 94 : 90;
        const targetHeight = isMobile ? 88 : 84;
        const targetRadius = isMobile ? 16 : 24;

        let curW = 100;
        let curH = 100;
        let curRadius = 0;
        let shadowAlpha = 0;
        let borderAlpha = 0;

        if (p < 0.20) {
          curW = 100;
          curH = 100;
          curRadius = 0;
          shadowAlpha = 0;
          borderAlpha = 0;
        } else if (p < 0.50) {
          const t = (p - 0.20) / 0.30;
          curW = 100 - t * (100 - targetWidth);
          curH = 100 - t * (100 - targetHeight);
          curRadius = t * targetRadius;
          shadowAlpha = t * 0.24;
          borderAlpha = t * 0.15;
        } else if (p < 0.80) {
          // Plate stays framed during cross-aperture transition
          curW = targetWidth;
          curH = targetHeight;
          curRadius = targetRadius;
          shadowAlpha = 0.24;
          borderAlpha = 0.15;
        } else {
          // Smoothly expands back to integrate with the downstream section
          const t = (p - 0.80) / 0.20;
          curW = targetWidth + t * (100 - targetWidth);
          curH = targetHeight + t * (100 - targetHeight);
          curRadius = targetRadius * (1 - t);
          shadowAlpha = 0.24 * (1 - t);
          borderAlpha = 0.15 * (1 - t);
        }

        heroFrameRef.current.style.width = `${curW.toFixed(2)}%`;
        heroFrameRef.current.style.height = `${curH.toFixed(2)}vh`;
        heroFrameRef.current.style.borderRadius = `${curRadius.toFixed(1)}px`;
        heroFrameRef.current.style.borderColor = `rgba(17, 15, 14, ${borderAlpha.toFixed(3)})`;
        heroFrameRef.current.style.boxShadow = `0 ${Math.round(shadowAlpha * 120)}px ${Math.round(
          shadowAlpha * 200
        )}px -20px rgba(0,0,0, ${shadowAlpha.toFixed(3)})`;
      }

      // ----------------------------------------------------------------------
      // 3. IMAGE A: CONTINUOUS MULTI-STAGE SCALE, CROP & APERTURE TRANSITION
      // ----------------------------------------------------------------------
      // Stage 1 (0-20%): scale 1.00 -> 1.04, drift
      // Stage 2 (20-40%): scale 1.04 -> 1.10
      // Stage 3 (40-60%): scale 1.10 -> 1.16, opacity eases down
      // Stage 4 (60-80%): Image A transitions into Image B with clip-path and opacity
      // Stage 5 (80-100%): Image A is completely exited
      if (imageARef.current) {
        let scaleA = 1.00;
        let transYA = 0;
        let transXA = 0;
        let opacityA = 1.0;
        let clipA = "inset(0% 0% 0% 0%)";

        if (p <= 0.20) {
          const t = p / 0.20;
          scaleA = 1.00 + t * 0.04;
          transYA = -t * 15;
          transXA = t * 8;
          opacityA = 1.0;
        } else if (p <= 0.40) {
          const t = (p - 0.20) / 0.20;
          scaleA = 1.04 + t * 0.06;
          transYA = -15 - t * 25;
          transXA = 8 - t * 4;
          opacityA = 1.0;
        } else if (p <= 0.60) {
          const t = (p - 0.40) / 0.20;
          scaleA = 1.10 + t * 0.06;
          transYA = -40 - t * 30;
          transXA = 4 - t * 4;
          opacityA = 1.0 - t * 0.45; // 1.0 -> 0.55
        } else if (p <= 0.80) {
          const t = (p - 0.60) / 0.20;
          scaleA = 1.16 + t * 0.08;
          transYA = -70 - t * 30;
          opacityA = Math.max(0, 0.55 - t * 0.55); // 0.55 -> 0.0
          const insetY = Math.round(t * 20);
          const insetX = Math.round(t * 15);
          clipA = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
        } else {
          scaleA = 1.24;
          opacityA = 0;
          clipA = "inset(25% 20% 25% 20%)";
        }

        imageARef.current.style.transform = `translate3d(${transXA.toFixed(1)}px, ${transYA.toFixed(
          1
        )}px, 0) scale(${scaleA.toFixed(4)})`;
        imageARef.current.style.opacity = opacityA.toFixed(3);
        imageARef.current.style.clipPath = clipA;
      }

      // ----------------------------------------------------------------------
      // 4. IMAGE B (NEXT MONOGRAPH VISUAL): PROGRESSIVE REVEAL & TAKEOVER
      // ----------------------------------------------------------------------
      // Stage 1 & 2 (0-40%): Hidden
      // Stage 3 (40-60%): Begins appearing underneath with expanding aperture mask & scale
      // Stage 4 (60-80%): Main takeover, clips out to full frame
      // Stage 5 (80-100%): Dominant, crisp, settles to scale 1.00
      if (imageBRef.current) {
        let opacityB = 0;
        let scaleB = 1.16;
        let clipB = "inset(24% 16% 24% 16% round 24px)";

        if (p < 0.38) {
          opacityB = 0;
          scaleB = 1.18;
          clipB = "inset(26% 18% 26% 18% round 24px)";
        } else if (p <= 0.60) {
          const t = (p - 0.38) / 0.22;
          opacityB = t * 0.75;
          scaleB = 1.16 - t * 0.08; // 1.16 -> 1.08
          const curInsetY = Math.round(24 - t * 14); // 24% -> 10%
          const curInsetX = Math.round(16 - t * 10); // 16% -> 6%
          clipB = `inset(${curInsetY}% ${curInsetX}% ${curInsetY}% ${curInsetX}% round 24px)`;
        } else if (p <= 0.80) {
          const t = (p - 0.60) / 0.20;
          opacityB = 0.75 + t * 0.25; // 0.75 -> 1.00
          scaleB = 1.08 - t * 0.06; // 1.08 -> 1.02
          const curInsetY = Math.round(10 * (1 - t)); // 10% -> 0%
          const curInsetX = Math.round(6 * (1 - t)); // 6% -> 0%
          clipB = `inset(${curInsetY}% ${curInsetX}% ${curInsetY}% ${curInsetX}% round ${Math.round(
            24 * (1 - t)
          )}px)`;
        } else {
          const t = (p - 0.80) / 0.20;
          opacityB = 1.0;
          scaleB = 1.02 - t * 0.02; // 1.02 -> 1.00
          clipB = "inset(0% 0% 0% 0% round 0px)";
        }

        imageBRef.current.style.opacity = opacityB.toFixed(3);
        imageBRef.current.style.transform = `translate3d(0, 0, 0) scale(${scaleB.toFixed(4)})`;
        imageBRef.current.style.clipPath = clipB;
      }

      // ----------------------------------------------------------------------
      // 5. LAYER 2: "DREAMSCAPES" MONOGRAPH SUBTITLE (INDEPENDENT VELOCITY)
      // ----------------------------------------------------------------------
      // Stage 1 (0-20%): moves upward (-45px), subtle letter spacing shift
      // Stage 2 (20-40%): scales slightly (1.02), moves to -120px
      // Stage 3 (40-60%): leaves original position, moves to -220px, fades to 0.1
      // Stage 4+ (60-100%): faded
      if (subtitleRef.current) {
        let subY = 0;
        let subOpacity = 1.0;
        let subScale = 1.0;

        if (p <= 0.20) {
          const t = p / 0.20;
          subY = -t * 45;
          subOpacity = 1.0;
          subScale = 1.0 + t * 0.02;
        } else if (p <= 0.40) {
          const t = (p - 0.20) / 0.20;
          subY = -45 - t * 75; // -45 -> -120px
          subOpacity = 1.0 - t * 0.35; // 1.0 -> 0.65
          subScale = 1.02 + t * 0.02;
        } else if (p <= 0.60) {
          const t = (p - 0.40) / 0.20;
          subY = -120 - t * 100; // -120 -> -220px
          subOpacity = Math.max(0, 0.65 - t * 0.65);
          subScale = 1.04 - t * 0.06;
        } else {
          subY = -240;
          subOpacity = 0;
        }

        subtitleRef.current.style.transform = `translate3d(0, ${subY.toFixed(1)}px, 0) scale(${subScale.toFixed(3)})`;
        subtitleRef.current.style.opacity = subOpacity.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // 6. LAYER 3: "CREATING THE UNEXPECTED" HEADLINE (FASTER DEPTH VELOCITY)
      // ----------------------------------------------------------------------
      // Stage 1 (0-20%): moves upward at different rate (-85px)
      // Stage 2 (20-40%): moves upward faster (-210px), scales slightly down (0.95)
      // Stage 3 (40-60%): blurs progressively (0px -> 8px), moves to -340px, fades
      // Stage 4+ (60-100%): faded completely
      if (headlineRef.current) {
        let headY = 0;
        let headScale = 1.0;
        let headBlur = 0;
        let headOpacity = 1.0;

        if (p <= 0.20) {
          const t = p / 0.20;
          headY = -t * 85;
          headScale = 1.0 - t * 0.02;
          headOpacity = 1.0;
          headBlur = 0;
        } else if (p <= 0.40) {
          const t = (p - 0.20) / 0.20;
          headY = -85 - t * 125; // -85 -> -210px
          headScale = 0.98 - t * 0.04;
          headOpacity = 1.0 - t * 0.55; // 1.0 -> 0.45
          headBlur = t * 2.5;
        } else if (p <= 0.60) {
          const t = (p - 0.40) / 0.20;
          headY = -210 - t * 130; // -210 -> -340px
          headScale = 0.94 - t * 0.06;
          headOpacity = Math.max(0, 0.45 - t * 0.45);
          headBlur = 2.5 + t * 5.5; // up to 8px
        } else {
          headY = -360;
          headOpacity = 0;
          headBlur = 8;
        }

        headlineRef.current.style.transform = `translate3d(0, ${headY.toFixed(1)}px, 0) scale(${headScale.toFixed(3)})`;
        headlineRef.current.style.opacity = headOpacity.toFixed(3);
        headlineRef.current.style.filter = headBlur > 0 ? `blur(${headBlur.toFixed(1)}px)` : "none";
      }

      // ----------------------------------------------------------------------
      // 7. LAYER 4: SUB-TAG MONOGRAPH DESCRIPTION
      // ----------------------------------------------------------------------
      if (subTagRef.current) {
        let tagY = 0;
        let tagOpacity = 1.0;

        if (p <= 0.20) {
          const t = p / 0.20;
          tagY = -t * 45;
          tagOpacity = 1.0;
        } else if (p <= 0.45) {
          const t = (p - 0.20) / 0.25;
          tagY = -45 - t * 85;
          tagOpacity = Math.max(0, 1.0 - t * 1.0);
        } else {
          tagY = -140;
          tagOpacity = 0;
        }

        subTagRef.current.style.transform = `translate3d(0, ${tagY.toFixed(1)}px, 0)`;
        subTagRef.current.style.opacity = tagOpacity.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // 8. LAYER 5: LOCATION & EXHIBITION METADATA
      // ----------------------------------------------------------------------
      // Stage 1 (0-20%): subtle shift (-35px)
      // Stage 2 (20-40%): fades and shifts (-35 -> -90px, opacity 0.85 -> 0.2)
      // Stage 3+ (40-100%): faded
      if (metadataRef.current) {
        let metaY = 0;
        let metaOpacity = 1.0;

        if (p <= 0.20) {
          const t = p / 0.20;
          metaY = -t * 35;
          metaOpacity = 1.0 - t * 0.15;
        } else if (p <= 0.40) {
          const t = (p - 0.20) / 0.20;
          metaY = -35 - t * 55;
          metaOpacity = Math.max(0, 0.85 - t * 0.85);
        } else {
          metaY = -100;
          metaOpacity = 0;
        }

        metadataRef.current.style.transform = `translate3d(0, ${metaY.toFixed(1)}px, 0)`;
        metadataRef.current.style.opacity = metaOpacity.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // 9. LAYER 6: SCROLL PROMPT & FLOATING GLASS ORB
      // ----------------------------------------------------------------------
      if (scrollPromptRef.current) {
        const promptOpacity = Math.max(0, 1.0 - p * 6.5); // Fades by p ≈ 0.15
        scrollPromptRef.current.style.opacity = promptOpacity.toFixed(3);
      }

      if (orbWrapperRef.current) {
        const orbOpacity = Math.max(0, 1.0 - p * 2.8);
        orbWrapperRef.current.style.opacity = orbOpacity.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // 10. PLATE B CURATORIAL CONTENT OVERLAY (EMERGES IN STAGE 3, 4, 5)
      // ----------------------------------------------------------------------
      if (plateBContentRef.current) {
        let bContentOpacity = 0;
        let bContentY = 40;

        if (p >= 0.45 && p < 0.70) {
          const t = (p - 0.45) / 0.25;
          bContentOpacity = t * 0.9;
          bContentY = 40 - t * 30; // 40 -> 10px
        } else if (p >= 0.70) {
          const t = Math.min(1, (p - 0.70) / 0.25);
          bContentOpacity = 0.9 + t * 0.1;
          bContentY = 10 - t * 10; // 10 -> 0px
        } else {
          bContentOpacity = 0;
          bContentY = 40;
        }

        plateBContentRef.current.style.opacity = bContentOpacity.toFixed(3);
        plateBContentRef.current.style.transform = `translate3d(0, ${bContentY.toFixed(1)}px, 0)`;
      }
    };

    // Initialize at scroll 0
    applyScrub(0);

    // BIND DIRECTLY TO SCROLL WITH GSAP SCROLLTRIGGER (100% Scrubbed & Reversible)
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        applyScrub(self.progress);
      },
    });

    // Also attach high-speed window scroll listener for zero-latency frame scrub
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll > 0) {
        const currentScroll = -rect.top;
        const p = Math.min(1, Math.max(0, currentScroll / totalScroll));
        applyScrub(p);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      st.kill();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[350vh] bg-[#EBE7E1] z-10"
      id="hero"
    >
      {/* Pinned Sticky Stage — Fixed to viewport during entire 350vh scroll distance */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#EBE7E1] text-[#110F0E] select-none text-center"
      >
        {/* LIVE SCROLL TIMELINE BADGE (Top-Right Micro-Indicator) */}
        <div className="absolute top-7 right-8 md:right-16 z-40 pointer-events-none hidden sm:flex items-center space-x-2 text-[10px] uppercase font-mono tracking-[0.25em] text-[#110F0E]/50">
          <span>SCENE 01 / HERO</span>
          <span className="w-4 h-[1px] bg-[#110F0E]/30" />
          <span ref={progressBadgeRef} className="text-[#110F0E] font-medium w-7 text-right">
            00%
          </span>
        </div>

        {/* HERO IMAGE CONTAINER — Physically transforms, insets, frames & morphs */}
        <div
          ref={heroFrameRef}
          className="relative flex items-center justify-center overflow-hidden will-change-transform border border-transparent"
          style={{
            width: "100%",
            height: "100vh",
            borderRadius: "0px",
            boxShadow: "0 0 0 transparent",
            transform: "translate3d(0, 0, 0)",
            willChange: "transform, width, height, border-radius, box-shadow",
          }}
        >
          {/* IMAGE A: Main Monograph Hero Photograph */}
          <div
            ref={imageARef}
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ willChange: "transform, opacity, clip-path" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2600&q=98"
              alt="Krishna Photography Monograph Hero — Monolith of Silence"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Gradient Veil for Typographic Contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#EBE7E1]/40 via-transparent to-[#EBE7E1]/65 pointer-events-none" />
          </div>

          {/* IMAGE B: Next Monograph Visual (Reveals during Stage 3 & 4) */}
          <div
            ref={imageBRef}
            className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
            style={{
              opacity: 0,
              transform: "translate3d(0, 0, 0) scale(1.16)",
              clipPath: "inset(24% 16% 24% 16% round 24px)",
              willChange: "transform, opacity, clip-path",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2600&q=98"
              alt="Monograph Plate 01.1 — Concrete Sanctuary Void"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter contrast-[1.14] saturate-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#110F0E]/60 via-[#110F0E]/15 to-transparent pointer-events-none" />
          </div>

          {/* Hairline Frame Accent Border */}
          <div className="absolute inset-0 border border-black/10 rounded-[inherit] pointer-events-none z-10" />

          {/* PLATE B CURATORIAL CONTENT OVERLAY (Emerges inside the frame during Stage 3 & 4) */}
          <div
            ref={plateBContentRef}
            className="absolute inset-x-8 md:inset-x-16 bottom-10 md:bottom-14 z-20 pointer-events-none flex flex-col md:flex-row justify-between items-start md:items-end text-left opacity-0 text-[#F5F3EE]"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="max-w-xl">
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-mono text-[#F5F3EE]/80 block mb-2">
                FIG 01.1 — SPATIAL MONOGRAPH
              </span>
              <h2 className="font-serif font-light text-2xl sm:text-4xl md:text-5xl tracking-[-0.03em] leading-tight text-[#F5F3EE]">
                Concrete Sanctuary Void
              </h2>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#F5F3EE]/75">
              <span className="block text-[#F5F3EE]">TOKYO, JAPAN · 2025</span>
              <span className="block text-[#F5F3EE]/60 text-[10px]">120MM COLOR REVERSAL</span>
            </div>
          </div>
        </div>

        {/* 35mm Film Grain Overlay */}
        <div className="grain texture-film-grain opacity-[0.03] pointer-events-none z-15" />

        {/* Floating Glass Orb (Micro-breathing artifact) */}
        <div
          ref={orbWrapperRef}
          className="absolute inset-0 pointer-events-none z-20 will-change-transform"
        >
          <FloatingGlassOrb />
        </div>

        {/* CENTRAL TYPOGRAPHIC HIERARCHY (MULTI-LAYER DEPTH ENGINE) */}
        <div className="absolute inset-0 z-25 flex flex-col items-center justify-center pointer-events-none px-6 text-center select-none">
          {/* Layer 2: Subtitle Monograph Label ("DREAMSCAPES") */}
          <div
            ref={subtitleRef}
            className="flex items-center justify-center space-x-3 mb-6 will-change-transform"
          >
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#110F0E]/80 font-mono font-medium">
              DREAMSCAPES
            </span>
            <span className="w-12 h-[1px] bg-[#110F0E]/30" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#110F0E]/65 font-mono">
              MONOGRAPH VOL. 01
            </span>
          </div>

          {/* Layer 3: "CREATING THE UNEXPECTED" Main Editorial Headline */}
          <h1
            ref={headlineRef}
            className="font-serif font-light text-[clamp(44px,7.5vw,136px)] leading-[0.88] tracking-[-0.04em] text-[#110F0E] uppercase max-w-[1280px] mb-8 mx-auto select-none will-change-transform"
          >
            {headlineText.split("").map((char, index) => (
              <span
                key={index}
                className={`inline-block ${
                  char === " " ? "w-[0.28em]" : ""
                }`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Layer 4: Sub-tag Monograph Description */}
          <p
            ref={subTagRef}
            className="font-sans font-light text-[13px] md:text-[15px] tracking-[0.08em] text-[#110F0E]/75 uppercase max-w-[520px] will-change-transform"
          >
            ARCHITECTURAL MONOGRAPHS & ATMOSPHERIC LIGHT PHENOMENA
          </p>
        </div>

        {/* Layer 6: Scroll To Explore Indicator */}
        <div
          ref={scrollPromptRef}
          className="absolute bottom-20 z-25 pointer-events-none"
        >
          <span className="text-[10px] uppercase tracking-[0.30em] font-mono text-[#110F0E]/60 flex items-center space-x-2">
            <span>SCROLL TO EXPLORE MONOGRAPH</span>
            <span className="animate-bounce">↓</span>
          </span>
        </div>

        {/* Layer 5: Hero Footer Metadata Strip */}
        <div
          ref={metadataRef}
          className="absolute bottom-6 inset-x-6 md:inset-x-16 z-25 flex flex-col md:flex-row justify-between items-center md:items-end border-t border-[#110F0E]/15 pt-4 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70 pointer-events-none will-change-transform"
        >
          <div className="text-left">
            <span className="block text-[#110F0E]/45 mb-0.5 text-[10px]">LOCATION</span>
            <span className="text-[#110F0E] font-medium">KYOTO — REYKJAVIK — TOKYO</span>
          </div>

          <div className="mt-3 md:mt-0 text-center md:text-right">
            <span className="block text-[#110F0E]/45 mb-0.5 text-[10px]">EXHIBITION</span>
            <span className="text-[#110F0E] font-medium">PUBLISHED SPRING 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
