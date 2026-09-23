"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HomeImageRevealProps {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  caption?: string;
  category?: string;
  location?: string;
  year?: string;
  cursorLabel?: string;
  priority?: boolean;
  borderAccent?: boolean;
}

export default function HomeImageReveal({
  src,
  alt,
  aspect = "aspect-[4/5]",
  className = "",
  caption,
  category,
  location,
  year,
  cursorLabel = "VIEW",
  priority = false,
  borderAccent = true,
}: HomeImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mask = maskRef.current;
    const imgWrapper = imgWrapperRef.current;
    if (!mask || !imgWrapper) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion) {
      gsap.fromTo(
        mask,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: mask,
            start: "top 85%",
          },
        }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // 1. SCROLL-SCRUBBED EDITORIAL CLIP-PATH & SCALE REVEAL (Reversible on scroll up)
      gsap.fromTo(
        mask,
        {
          clipPath: "inset(16% 8% 16% 8%)",
          opacity: 0.25,
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: mask,
            start: "top 92%",
            end: "top 35%",
            scrub: 1,
          },
        }
      );

      // 2. SYNCHRONIZED INNER SCALE & PARALLAX (1.14 -> 1.00)
      gsap.fromTo(
        imgWrapper,
        {
          scale: 1.14,
          yPercent: 7,
        },
        {
          scale: 1.00,
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: mask,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, mask);

    // 3. SUBTLE MOUSE HOVER MICRO-MOVEMENT (Desktop only, restrained 8px counter-shift)
    let cleanupMouse: (() => void) | undefined;
    if (!isTouch) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = mask.getBoundingClientRect();
        // Cursor moves left -> image shifts right (normX * -8px)
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(imgWrapper, {
          x: -normX * 8,
          y: -normY * 6,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(imgWrapper, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        });
      };

      mask.addEventListener("mousemove", onMouseMove);
      mask.addEventListener("mouseleave", onMouseLeave);

      cleanupMouse = () => {
        mask.removeEventListener("mousemove", onMouseMove);
        mask.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    return () => {
      ctx.revert();
      if (cleanupMouse) cleanupMouse();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`group relative w-full ${className}`}
      data-cursor={cursorLabel}
    >
      <div
        ref={maskRef}
        className={`relative w-full ${aspect} overflow-hidden bg-[#E6E2DA] ${
          borderAccent ? "border border-[#110F0E]/10" : ""
        } transition-all duration-500`}
        style={{ willChange: "clip-path, opacity" }}
      >
        <div
          ref={imgWrapperRef}
          className="relative w-full h-full will-change-transform"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1400px"
            className="object-cover object-center filter contrast-[1.12] saturate-[1.05]"
          />
        </div>

        {/* Ambient subtle vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Optional Metadata / Caption Footer */}
      {(caption || category || location || year) && (
        <div className="mt-4 flex justify-between items-baseline border-b border-[#110F0E]/10 pb-3 text-[11px] uppercase tracking-[0.22em] font-mono text-[#110F0E]/75">
          <div>
            {category && <span className="block text-[#110F0E]/50 mb-0.5">{category}</span>}
            {caption && <span className="font-sans font-light text-[15px] tracking-tight text-[#110F0E] normal-case block">{caption}</span>}
          </div>
          <div className="text-right">
            {year && <span className="block text-[#110F0E] font-medium">{year}</span>}
            {location && <span className="block text-[#110F0E]/50 text-[10px]">{location}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
