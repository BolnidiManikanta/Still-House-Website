"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";

export default function Scene07NextMonograph() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const cardFrameRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const teaserContentRef = useRef<HTMLDivElement>(null);
  const navButtonsRef = useRef<HTMLDivElement>(null);
  const progressPillRef = useRef<HTMLDivElement>(null);
  const { triggerTransition } = usePageTransition();

  const { config } = useSiteConfig();
  const nextData = config.home.nextMonograph;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const applyScrub = (p: number) => {
      // 1. Progress Indicator Pill
      if (progressPillRef.current) {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        progressPillRef.current.innerText = `SCENE 07 · ${pct.toString().padStart(2, "0")}%`;
      }

      // 2. Cinematic Expanding Aperture Frame (0.0 -> 1.0)
      if (cardFrameRef.current) {
        if (p <= 0.45) {
          const t = p / 0.45;
          const insetY = 16 * (1 - t) + 4; // 20% -> 4%
          const insetX = 12 * (1 - t) + 4; // 16% -> 4%
          const radius = Math.round(24 * (1 - t));
          const scale = 0.92 + t * 0.05;

          cardFrameRef.current.style.clipPath = `inset(${insetY.toFixed(1)}% ${insetX.toFixed(1)}% ${insetY.toFixed(1)}% ${insetX.toFixed(1)}% round ${radius}px)`;
          cardFrameRef.current.style.transform = `scale(${scale.toFixed(3)})`;
        } else {
          const t = (p - 0.45) / 0.55;
          const insetY = Math.max(0, 4 * (1 - t));
          const insetX = Math.max(0, 4 * (1 - t));
          const scale = 0.97 + t * 0.03; // 0.97 -> 1.00

          cardFrameRef.current.style.clipPath = `inset(${insetY.toFixed(1)}% ${insetX.toFixed(1)}% ${insetY.toFixed(1)}% ${insetX.toFixed(1)}% round 0px)`;
          cardFrameRef.current.style.transform = `scale(${scale.toFixed(3)})`;
        }
      }

      // Inner image subtle zoom
      if (imageInnerRef.current) {
        const imgScale = 1.05 + p * 0.12;
        imageInnerRef.current.style.transform = `scale(${imgScale.toFixed(3)})`;
      }

      // 3. Title "BLUEYARD" Scroll-Driven Elevation & Sharpening
      if (titleRef.current) {
        if (p <= 0.40) {
          const t = p / 0.40;
          const transY = 60 * (1 - t);
          const blur = 8 * (1 - t);
          const opacity = 0.3 + t * 0.7;
          titleRef.current.style.transform = `translate3d(0, ${transY.toFixed(1)}px, 0)`;
          titleRef.current.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
          titleRef.current.style.opacity = opacity.toFixed(3);
        } else {
          titleRef.current.style.transform = "translate3d(0, 0, 0)";
          titleRef.current.style.filter = "none";
          titleRef.current.style.opacity = "1";
        }
      }

      // 4. Teaser Paragraph
      if (teaserContentRef.current) {
        if (p < 0.25) {
          teaserContentRef.current.style.opacity = "0";
          teaserContentRef.current.style.transform = "translate3d(0, 30px, 0)";
        } else if (p <= 0.65) {
          const t = (p - 0.25) / 0.40;
          teaserContentRef.current.style.opacity = t.toFixed(3);
          teaserContentRef.current.style.transform = `translate3d(0, ${(30 * (1 - t)).toFixed(1)}px, 0)`;
        } else {
          teaserContentRef.current.style.opacity = "1";
          teaserContentRef.current.style.transform = "translate3d(0, 0, 0)";
        }
      }

      // 5. Final Navigation Buttons
      if (navButtonsRef.current) {
        if (p < 0.55) {
          navButtonsRef.current.style.opacity = "0";
          navButtonsRef.current.style.transform = "translate3d(0, 30px, 0)";
          navButtonsRef.current.style.pointerEvents = "none";
        } else {
          const t = (p - 0.55) / 0.45;
          navButtonsRef.current.style.opacity = t.toFixed(3);
          navButtonsRef.current.style.transform = `translate3d(0, ${(30 * (1 - t)).toFixed(1)}px, 0)`;
          navButtonsRef.current.style.pointerEvents = "auto";
        }
      }
    };

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
      id="scene-07-next-monograph"
      ref={containerRef}
      className="relative w-full h-[280vh] bg-[#E2DED6] text-[#110F0E] z-10"
    >
      {/* Pinned Viewport Stage */}
      <div
        ref={stickyStageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 md:py-16 px-6 md:px-12 lg:px-16 select-none bg-[#E2DED6]"
      >
        {/* Dynamic Expanding Background Photographic Plate */}
        <div
          ref={cardFrameRef}
          className="absolute inset-0 z-0 will-change-transform bg-[#1B1917]"
        >
          <div ref={imageInnerRef} className="relative w-full h-full will-change-transform">
            <Image
              src={nextData.bannerImage}
              alt={nextData.title}
              fill
              sizes="100vw"
              unoptimized={nextData.bannerImage.startsWith("data:")}
              className="object-cover object-center filter contrast-[1.15] saturate-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#E2DED6] via-[#E2DED6]/65 to-[#E2DED6]/80" />
          </div>
        </div>

        {/* Top Eyebrow Header */}
        <div className="relative z-20 flex items-center justify-between border-b border-[#110F0E]/15 pb-4">
          <div className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/70">
            <span className="text-[#110F0E] font-medium">{nextData.volumeTag}</span>
            <span className="w-8 h-[1px] bg-[#110F0E]/30" />
            <span>{nextData.launchDate}</span>
          </div>

          <div
            ref={progressPillRef}
            className="glass-capsule px-4 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-[0.2em] text-[#110F0E]/80 shadow-sm"
          >
            SCENE 07 · 00%
          </div>
        </div>

        {/* Central Cinematic Finale Content */}
        <div className="relative z-20 my-auto py-12 text-center flex flex-col items-center max-w-[900px] mx-auto w-full">
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
              className="font-serif font-light text-[clamp(52px,12vw,160px)] leading-[0.84] text-[#110F0E] uppercase will-change-transform transition-colors duration-500 group-hover:text-black tracking-tight"
            >
              {nextData.title}
            </h2>
          </button>

          <p
            ref={teaserContentRef}
            className="mt-8 font-sans font-light text-[15px] md:text-[18px] text-[#110F0E]/80 max-w-[540px] leading-relaxed will-change-transform opacity-0"
          >
            {nextData.teaserParagraph}
          </p>

          {/* Action CTAs */}
          <div
            ref={navButtonsRef}
            className="mt-10 flex flex-wrap justify-center gap-4 will-change-transform opacity-0 pointer-events-none"
          >
            <button
              onClick={() => triggerTransition("/work")}
              className="glass-capsule px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.16em] font-medium text-[#110F0E] cursor-pointer hover:bg-black/10 transition-colors"
              data-cursor="OPEN"
              data-magnetic
            >
              BROWSE ALL ARCHIVES
            </button>
            <button
              onClick={() => triggerTransition("/project/blueyard")}
              className="bg-[#110F0E] text-[#F5F3EE] px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.16em] font-medium cursor-pointer hover:bg-black transition-colors shadow-lg"
              data-cursor="OPEN"
              data-magnetic
            >
              {nextData.ctaText || "EXPLORE CASE STUDY →"}
            </button>
          </div>
        </div>

        {/* Bottom Exhibition Monograph Credits */}
        <div className="relative z-20 border-t border-[#110F0E]/15 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.25em] font-mono text-[#110F0E]/60">
          <span>MONOGRAPH VOL. 02 — FORTHCOMING 2026</span>
          <span className="mt-2 md:mt-0">TOKYO · KYOTO · REYKJAVIK · PARIS</span>
        </div>
      </div>
    </section>
  );
}
