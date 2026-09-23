"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function CinematicLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if reduced motion or already loaded in session
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      if (loaderRef.current) loaderRef.current.style.display = "none";
      window.dispatchEvent(new CustomEvent("cinematic-loader-complete"));
      return;
    }

    // 0% -> 25% -> 60% -> 100% Smooth Counter Progression (~850ms total)
    const duration = 850;
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Non-linear easing (starts smooth, quick jump at 25%, 60%, completes cleanly at 100%)
      const eased = Math.pow(t, 1.4);
      const currentVal = Math.min(100, Math.floor(eased * 100));
      setProgress(currentVal);

      if (t < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setProgress(100);
      }
    };

    const animId = requestAnimationFrame(updateCounter);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("cinematic-loader-complete"));
        },
      });

      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
      )
        .to(textRef.current, { opacity: 0, y: -15, duration: 0.35, delay: 0.5 })
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
        }, "-=0.1");
    }, loaderRef);

    return () => {
      cancelAnimationFrame(animId);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] bg-[#111111] text-[#F5F3EE] flex flex-col items-center justify-center pointer-events-none"
    >
      <div ref={textRef} className="text-center flex flex-col items-center">
        <span className="text-[12px] uppercase tracking-[0.35em] font-light text-[#777777] block mb-3">
          EXHIBITION MONOGRAPH
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-[-0.045em] text-[#F5F3EE] mb-6">
          DREAMSCAPES
        </h1>
        <div className="flex items-center space-x-3 text-[12px] uppercase tracking-[0.25em] text-[#777777]">
          <span ref={counterRef} className="text-[#F5F3EE] font-mono w-10 text-right">
            {progress}%
          </span>
          <div className="w-24 h-[1px] bg-[#333333] relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#F5F3EE] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
