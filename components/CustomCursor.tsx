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
        circleX += (mouseX - circleX) * 0.18;
        circleY += (mouseY - circleY) * 0.18;

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

        if (isImg) {
          setIsImageHover(true);
          setCursorText("VIEW");
        } else if (cursorAttr) {
          setIsImageHover(false);
          setCursorText(cursorAttr);
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
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isTransitioning]);

  return (
    <>
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 bg-[#0A0A0A] rounded-full pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 pointer-events-none z-[999998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0A0A0A]/40 flex items-center justify-center transition-all duration-300 ease-out ${
          isTransitioning ? "opacity-0 scale-50" : "opacity-100"
        } ${
          isHovered
            ? isImageHover
              ? "w-20 h-20 bg-white/40 backdrop-blur-md border-[#0A0A0A]"
              : "w-14 h-14 bg-[#0A0A0A]/10 border-[#0A0A0A]"
            : "w-10 h-10"
        }`}
      >
        {cursorText && (
          <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#0A0A0A] font-medium">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
