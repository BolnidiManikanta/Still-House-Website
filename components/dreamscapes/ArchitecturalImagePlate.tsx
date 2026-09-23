"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/components/PageTransition";

interface ArchitecturalImagePlateProps {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  priority?: boolean;
  clipExpansion?: boolean;
  showWipe?: boolean;
  parallaxSpeed?: number;
  dataCursor?: string;
  onClick?: () => void;
}

export default function ArchitecturalImagePlate({
  src,
  alt,
  aspectClass = "aspect-[3/4]",
  className = "",
  priority = false,
  clipExpansion = false,
  showWipe = true,
  parallaxSpeed = 24,
  dataCursor = "VIEW PROJECT ↗",
  onClick,
}: ArchitecturalImagePlateProps) {
  const { triggerTransition } = usePageTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const transitionPlaneRef = useRef<HTMLDivElement>(null);

  const handlePlateClick = () => {
    if (onClick) {
      onClick();
    } else {
      triggerTransition("/project/blueyard");
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const cameraWrap = cameraWrapRef.current;
    const imgWrapper = imgRef.current;
    const lightSweep = lightSweepRef.current;
    const transitionPlane = transitionPlaneRef.current;

    if (!container || !cameraWrap || !imgWrapper) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(container, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(cameraWrap, { scale: 1, yPercent: 0 });
        gsap.set(imgWrapper, { opacity: 1, filter: "none" });
        return;
      }

      // =========================================================================
      // STEP 4 — CONTINUOUS CLIP-PATH REVEAL (PHYSICALLY OPENS FROM CENTER ON SCROLL)
      // =========================================================================
      gsap.fromTo(
        container,
        { clipPath: "inset(0% 50% 0% 50%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 96%",
            end: "top 45%",
            scrub: 0.8,
          },
        }
      );

      // =========================================================================
      // STEPS 3 & 5 — CONTINUOUS SCROLL CAMERA PUSH-IN & LARGE IMAGE PARALLAX
      // ENTER: scale 1.08, yPercent 8 (or y: +40px)
      // CENTER: scale 1.00, yPercent 0
      // EXIT: scale 1.05, yPercent -8 (or y: -30px)
      // =========================================================================
      const cameraTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.0,
        },
      });

      // From enter to center
      cameraTl
        .fromTo(
          cameraWrap,
          {
            scale: 1.08,
            yPercent: 8,
          },
          {
            scale: 1.00,
            yPercent: 0,
            ease: "none",
            duration: 0.5,
          }
        )
        // From center to exit
        .to(cameraWrap, {
          scale: 1.05,
          yPercent: -8,
          ease: "none",
          duration: 0.5,
        });

      // =========================================================================
      // STEP 3 — CONTINUOUS BLUR & OPACITY FOCUS THROUGH SCROLL PROGRESS
      // ENTER: blur(6px), opacity 0.75
      // CENTER: blur(0px), opacity 1.0
      // =========================================================================
      const focusTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 95%",
          end: "top 45%",
          scrub: 0.8,
        },
      });

      focusTl.fromTo(
        imgWrapper,
        {
          opacity: 0.75,
          filter: "blur(6px) contrast(1.15) saturate(1.08)",
        },
        {
          opacity: 1.0,
          filter: "blur(0px) contrast(1.15) saturate(1.08)",
          ease: "none",
        }
      );

      // =========================================================================
      // STEP 6 — MOVING ARCHITECTURAL LIGHT SWEEP ACROSS PHOTOGRAPH
      // Connect X position to ScrollTrigger (left -> center -> right)
      // =========================================================================
      if (lightSweep) {
        const lightTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        });

        lightTl.fromTo(
          lightSweep,
          {
            xPercent: -120,
            opacity: 0.1,
          },
          {
            xPercent: 0,
            opacity: 0.45,
            ease: "none",
            duration: 0.5,
          }
        ).to(lightSweep, {
          xPercent: 120,
          opacity: 0.1,
          ease: "none",
          duration: 0.5,
        });
      }

      // =========================================================================
      // STEP 7 — VERTICAL ARCHITECTURAL TRANSITION PLANE (GLASS + SUNLIGHT WALL)
      // Moves: xPercent -100 -> 0 -> 100 during scene entrance
      // =========================================================================
      if (transitionPlane && showWipe) {
        gsap.fromTo(
          transitionPlane,
          {
            xPercent: -120,
            opacity: 0.85,
          },
          {
            xPercent: 320,
            opacity: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top 95%",
              end: "top 40%",
              scrub: 0.8,
            },
          }
        );
      }

      // =========================================================================
      // STEP 9 — SMOOTH DESKTOP HOVER INTERACTION (IMAGE SUBTLY FOLLOWS CURSOR)
      // x: -12px -> +12px, y: -8px -> +8px, scale: 1.00 -> 1.025
      // =========================================================================
      if (!isTouch) {
        const xTo = gsap.quickTo(imgWrapper, "x", { duration: 0.5, ease: "power2.out" });
        const yTo = gsap.quickTo(imgWrapper, "y", { duration: 0.5, ease: "power2.out" });
        const scaleTo = gsap.quickTo(imgWrapper, "scale", { duration: 0.5, ease: "power2.out" });

        const onMouseMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          xTo(normX * 24); // -12px to +12px
          yTo(normY * 16); // -8px to +8px
          scaleTo(1.025);
        };

        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
          scaleTo(1.0);
        };

        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseleave", onMouseLeave);

        return () => {
          container.removeEventListener("mousemove", onMouseMove);
          container.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    }, container);

    // Ensure ScrollTrigger evaluates geometry accurately
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [clipExpansion, showWipe, parallaxSpeed]);

  return (
    <div
      ref={containerRef}
      onClick={handlePlateClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePlateClick();
        }
      }}
      className={`image-mask relative overflow-hidden rounded-none shadow-sm cursor-pointer border border-black/5 select-none will-change-transform ${aspectClass} ${className}`}
      data-cursor={dataCursor}
    >
      {/* STEP 3 & 5: Camera Push-In & Parallax Frame */}
      <div
        ref={cameraWrapRef}
        className="w-full h-full relative overflow-hidden will-change-transform"
      >
        {/* STEP 3 & 9: Photographic Element with Blur/Opacity Focus & Cursor Following */}
        <div
          ref={imgRef}
          className="w-full h-full relative will-change-transform"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover object-center pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* STEP 6: Moving Architectural Light Sweep (Scrubbed Left -> Center -> Right) */}
        <div
          ref={lightSweepRef}
          className="light-sweep pointer-events-none absolute -inset-[60%] w-[220%] h-[220%] z-[6]"
          style={{
            background:
              "linear-gradient(110deg, transparent 28%, rgba(255, 252, 245, 0.05) 38%, rgba(255, 250, 240, 0.42) 50%, rgba(255, 252, 245, 0.05) 62%, transparent 72%)",
            filter: "blur(32px)",
            mixBlendMode: "screen",
          }}
        />

        {/* STEP 7: Vertical Architectural Transition Plane (Glass + Sunlight Wall) */}
        <div
          ref={transitionPlaneRef}
          className="project-transition-plane pointer-events-none absolute inset-y-0 w-[120px] z-[8] -left-[140px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 20%, rgba(250, 248, 245, 0.7) 50%, rgba(255, 255, 255, 0.2) 80%, transparent 100%)",
            mixBlendMode: "screen",
            borderRight: "1px solid rgba(255, 255, 255, 0.85)",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
}

