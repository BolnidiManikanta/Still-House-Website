"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function CinematicLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 0% -> 100% Counter Animation
    const duration = 2000;
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, Math.floor(prev + increment));
      });
    }, intervalTime);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.0, delay: 0.2 }
      )
        .to(textRef.current, { opacity: 0, y: -20, duration: 0.8, delay: 1.2 })
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 1.6,
          ease: "power4.inOut",
        });
    }, loaderRef);

    return () => {
      clearInterval(timer);
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
