"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingGlassOrb from "./canvas/FloatingGlassOrb";
import { usePageTransition } from "./PageTransition";
import { VolumeX, Volume2, ArrowUpRight } from "lucide-react";

export default function HomeHero() {
  const { triggerTransition } = usePageTransition();
  const heroRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);
  const orbWrapperRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const workBtnRef = useRef<HTMLButtonElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const headlineText = "CREATING THE UNEXPECTED";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. CHARACTER-BY-CHARACTER ENTRANCE REVEAL
      if (charRefs.current.length > 0) {
        gsap.fromTo(
          charRefs.current.filter(Boolean),
          { opacity: 0, y: 70, rotateX: 20 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.4,
            stagger: 0.035,
            ease: "power4.out",
          }
        );
      }

      // SUBTITLE & WORK BUTTON ENTRANCES
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.4, delay: 0.3, ease: "power4.out" }
        );
      }

      if (workBtnRef.current) {
        gsap.fromTo(
          workBtnRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.6, delay: 0.6, ease: "power4.out" }
        );
      }

      // 2. IDLE INDIVIDUAL LETTER FLOATING MOTION (translateY -2px to +2px)
      charRefs.current.forEach((char, idx) => {
        if (!char) return;
        gsap.to(char, {
          y: -3,
          duration: 6 + (idx % 5) * 0.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (idx % 7) * 0.15,
        });
      });

      // 3. BACKGROUND IMAGE SLOW CINEMATIC ZOOM (1.05 -> 1.09 scale over 18s)
      if (bgImgRef.current) {
        gsap.to(bgImgRef.current, {
          scale: 1.09,
          duration: 18,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 4. FLOATING GLASS SPHERE IDLE MOTION
      if (orbWrapperRef.current) {
        gsap.to(orbWrapperRef.current, {
          y: -12,
          duration: 7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, heroRef);

    // 5. MOUSE PARALLAX & RIPPLE PROXIMITY WAVE SYSTEM ACROSS INDIVIDUAL LETTERS
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const normX = clientX / window.innerWidth - 0.5; // -0.5 to +0.5
      const normY = clientY / window.innerHeight - 0.5;

      // Layer 1: Background Image direct mouse follow (20-40px range)
      if (bgImgRef.current) {
        gsap.to(bgImgRef.current, {
          x: normX * 35,
          y: normY * 35,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      // Layer 2: Floating Glass Orb intermediate movement
      if (orbWrapperRef.current) {
        gsap.to(orbWrapperRef.current, {
          x: normX * 22,
          y: normY * 16,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      // Layer 3: WORK Button magnetic response
      if (workBtnRef.current) {
        gsap.to(workBtnRef.current, {
          x: normX * 12,
          y: normY * 8,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Layer 4: Letter-by-Letter Proximity Wave & Elastic Jump Effect
      charRefs.current.forEach((char) => {
        if (!char) return;
        const rect = char.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const distX = clientX - charCenterX;
        const distY = clientY - charCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        const maxDist = 200; // 200px proximity radius
        if (distance < maxDist) {
          const proximity = (1 - distance / maxDist); // 0.0 to 1.0
          const jumpY = -proximity * 22; // max -22px jump
          const rot = (distX > 0 ? -3 : 3) * proximity; // -3deg to +3deg
          const scaleVal = 1 + proximity * 0.12;

          gsap.to(char, {
            y: jumpY,
            rotate: rot,
            scale: scaleVal,
            duration: 0.4,
            ease: "back.out(2.2)",
            overwrite: "auto",
          });
        } else {
          // Smooth return to idle position
          gsap.to(char, {
            y: 0,
            rotate: 0,
            scale: 1.0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ctx.revert();
    };
  }, []);

  // 6. WORK BUTTON LUXURY HOVER EFFECTS & CLICK TRANSITION
  const handleWorkBtnMouseEnter = () => {
    if (!workBtnRef.current) return;
    gsap.to(workBtnRef.current, {
      y: -6,
      scale: 1.08,
      rotate: 1,
      boxShadow: "0 0 32px rgba(255, 255, 255, 0.55), 0 14px 40px rgba(0, 0, 0, 0.20)",
      borderColor: "rgba(10, 10, 10, 0.70)",
      duration: 0.4,
      ease: "back.out(1.8)",
    });
  };

  const handleWorkBtnMouseLeave = () => {
    if (!workBtnRef.current) return;
    gsap.to(workBtnRef.current, {
      y: 0,
      scale: 1.0,
      rotate: 0,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
      borderColor: "rgba(10, 10, 10, 0.25)",
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleWorkButtonClick = () => {
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(12px)",
        duration: 1.2,
        ease: "power3.inOut",
      });
    }

    triggerTransition("/work");
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[100vh] flex flex-col justify-between items-center px-[24px] md:px-[48px] lg:px-[80px] pt-28 pb-12 overflow-hidden bg-[#EBE7E1] text-[#0A0A0A] select-none text-center"
    >
      {/* LAYER 1: ULTRA HD BACKGROUND IMAGE WITH HIGH CONTRAST & ZERO WHITE HAZE */}
      <div
        ref={bgImgRef}
        className="absolute inset-[-60px] z-0 overflow-hidden pointer-events-none opacity-90 transition-transform duration-75"
        style={{ filter: "contrast(1.22) saturate(1.12) brightness(0.92)" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2600&q=98"
          alt="Ultra HD Fine Art Hero Background"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EBE7E1]/40 via-transparent to-[#EBE7E1]/60" />
      </div>

      {/* 35mm Film Grain Overlay */}
      <div className="grain texture-film-grain opacity-[0.03] pointer-events-none z-0" />

      {/* LAYER 2: FLOATING GLASS SPHERE WRAPPER (Z-15) */}
      <div ref={orbWrapperRef} className="absolute inset-0 pointer-events-none z-15">
        <FloatingGlassOrb />
      </div>

      {/* PERSISTENT CINEMATIC HOMEPAGE NAVIGATION (EXCLUSIVELY ONE WORK BUTTON ON PAGE) */}
      <header className="fixed top-0 left-0 w-full z-40 py-6 px-[24px] md:px-[48px] lg:px-[80px] flex justify-between items-center pointer-events-none">
        {/* Left: Brand Pill Button */}
        <div className="pointer-events-auto">
          <button
            onClick={() => triggerTransition("/")}
            data-magnetic
            className="glass-capsule px-5 py-2.5 rounded-full text-left group focus:outline-none"
          >
            <span className="block text-[11px] uppercase tracking-[0.25em] font-medium text-[#0A0A0A] font-mono">
              STILL STUDIO <span className="text-[rgba(10,10,10,0.55)] font-normal">/ DREAMSCAPES</span>
            </span>
          </button>
        </div>

        {/* Right: AUDIO TOGGLE ONLY (ZERO RIGHT-SIDE WORK BUTTONS) */}
        <div className="pointer-events-auto flex items-center space-x-3">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            data-magnetic
            className="glass-capsule px-5 py-2.5 rounded-full flex items-center space-x-2 text-[11px] uppercase tracking-[0.20em] text-[#0A0A0A] font-medium focus:outline-none font-mono"
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[rgba(10,10,10,0.55)]" />
                <span className="hidden sm:inline">AUDIO [OFF]</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#0A0A0A]" />
                <span className="hidden sm:inline">AUDIO [ON]</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* LAYER 3 & 4: EDITORIAL CHARACTER HEADLINE & EXACT CENTERED SINGLE WORK PILL BUTTON (Z-20) */}
      <div className="relative z-20 my-auto w-full max-w-[1300px] flex flex-col items-center justify-center text-center">
        {/* DREAMSCAPES SUBTITLE */}
        <div ref={subtitleRef} className="flex items-center justify-center space-x-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[rgba(10,10,10,0.65)] font-mono">
            DREAMSCAPES
          </span>
          <span className="w-12 h-[1px] bg-[#0A0A0A]/25" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[rgba(10,10,10,0.55)] font-mono">
            MONOGRAPH VOL. 01
          </span>
        </div>

        {/* "CREATING THE UNEXPECTED" CHARACTER-BY-CHARACTER EDITORIAL HEADLINE */}
        <h1
          ref={titleContainerRef}
          className="font-serif font-light text-[clamp(52px,8vw,140px)] leading-[0.88] tracking-[-0.04em] text-[#0A0A0A] uppercase max-w-[1250px] mb-10 mx-auto select-none"
        >
          {headlineText.split("").map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                charRefs.current[index] = el;
              }}
              className={`hero-char inline-block will-change-transform ${
                char === " " ? "w-[0.28em]" : ""
              }`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* SINGLE EXACT VISUAL CENTER WORK LUXURY PILL BUTTON ON ENTIRE PAGE */}
        <div className="flex items-center justify-center pt-2">
          <button
            ref={workBtnRef}
            data-magnetic
            onClick={handleWorkButtonClick}
            onMouseEnter={handleWorkBtnMouseEnter}
            onMouseLeave={handleWorkBtnMouseLeave}
            className="w-[130px] h-[42px] rounded-full flex items-center justify-center space-x-2 text-[11px] uppercase tracking-[0.22em] font-medium font-mono text-[#0A0A0A] bg-white/70 backdrop-blur-md border border-[#0A0A0A]/25 shadow-[0_6px_20px_rgba(0,0,0,0.08)] focus:outline-none pointer-events-auto transition-all duration-300"
          >
            <span>WORK</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* HERO FOOTER METADATA (Z-20) */}
      <div className="relative z-20 w-full flex flex-col md:flex-row justify-between items-center md:items-end border-t border-[#0A0A0A]/15 pt-6 text-[11px] uppercase tracking-[0.25em] font-mono text-[rgba(10,10,10,0.65)]">
        <div>
          <span className="block text-[rgba(10,10,10,0.45)] mb-0.5">LOCATION</span>
          <span className="text-[#0A0A0A] font-medium">KYOTO — REYKJAVIK — TOKYO</span>
        </div>

        <div className="mt-4 md:mt-0 text-center md:text-right">
          <span className="block text-[rgba(10,10,10,0.45)] mb-0.5">EXHIBITION</span>
          <span className="text-[#0A0A0A] font-medium">PUBLISHED SPRING 2026</span>
        </div>
      </div>
    </section>
  );
}
