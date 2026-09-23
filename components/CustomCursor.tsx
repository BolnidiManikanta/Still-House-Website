"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { usePageTransition } from "./PageTransition";

export default function CustomCursor() {
  const { isTransitioning } = usePageTransition();
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHover, setIsImageHover] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const activeMagneticRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");
    document.body.style.cursor = "none";

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      if (isTransitioning) return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDotRef.current) {
        gsap.set(cursorDotRef.current, {
          x: mouseX,
          y: mouseY,
        });
      }

      // Magnetic Attraction on elements with [data-magnetic]
      const magneticTarget = (e.target as HTMLElement).closest("[data-magnetic]") as HTMLElement | null;
      if (magneticTarget) {
        activeMagneticRef.current = magneticTarget;
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.25;
        const deltaY = (e.clientY - centerY) * 0.25;

        gsap.to(magneticTarget, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (activeMagneticRef.current) {
        gsap.to(activeMagneticRef.current, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
        activeMagneticRef.current = null;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const render = () => {
      if (!isTransitioning) {
        circleX += (mouseX - circleX) * 0.13;
        circleY += (mouseY - circleY) * 0.13;

        if (cursorRingRef.current) {
          gsap.set(cursorRingRef.current, {
            x: circleX,
            y: circleY,
          });
        }
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor], a, button, img");
      if (target) {
        setIsHovered(true);
        const cursorAttr = target.getAttribute("data-cursor");
        const isImg = target.tagName.toLowerCase() === "img" || target.querySelector("img") !== null;

        if (cursorAttr) {
          setIsImageHover(cursorAttr.includes("VIEW") || cursorAttr.includes("PROJECT"));
          setCursorText(cursorAttr);
        } else if (isImg) {
          setIsImageHover(true);
          setCursorText("VIEW PROJECT ↗");
        } else {
          setIsImageHover(false);
          setCursorText("");
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor], a, button, img");
      if (target) {
        setIsHovered(false);
        setIsImageHover(false);
        setCursorText("");
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.body.classList.remove("custom-cursor-active");
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      document.body.style.cursor = "auto";
    };
  }, [isTransitioning]);

  return (
    <>
      {/* Normal center dot: ● */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 bg-[#110F0E] rounded-full pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isTransitioning || isImageHover ? "opacity-0 scale-50" : "opacity-100 scale-100"
        }`}
      />

      {/* Outer Circle that morphs into Project Indicator on project hover: ( VIEW PROJECT ↗ ) */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 pointer-events-none z-[999998] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 ease-out will-change-transform ${
          isTransitioning ? "opacity-0 scale-50" : "opacity-100"
        } ${
          isImageHover
            ? "w-[84px] h-[84px] bg-[#110F0E] text-[#F5F2ED] border border-[#110F0E] shadow-md"
            : isHovered
            ? "w-11 h-11 bg-[#110F0E]/10 border border-[#110F0E]/40"
            : "w-7 h-7 border border-[#110F0E]/30 bg-transparent"
        }`}
      >
        {isImageHover && (
          <span className="text-[8.5px] uppercase tracking-[0.18em] font-mono text-[#F5F2ED] font-medium text-center px-1.5 select-none leading-tight">
            VIEW PROJECT ↗
          </span>
        )}
      </div>
    </>
  );
}
