"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePageTransition } from "../PageTransition";

interface FloatingGlassSphereProps {
  size?: number;
  refraction?: number;
  cursorFollow?: boolean;
}

export default function FloatingGlassSphere({
  size = 180,
  refraction = 1.3,
  cursorFollow = true,
}: FloatingGlassSphereProps) {
  const { transitionStage } = usePageTransition();
  const sphereRef = useRef<HTMLDivElement>(null);

  // Transition Stage 2 Glass Orb Expansion
  useEffect(() => {
    if (transitionStage === 2 && sphereRef.current) {
      gsap.to(sphereRef.current, {
        scale: 3.5,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [transitionStage]);

  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Layer 5 Particles / Glass Orb moves at 50-60% Parallax (0.55x)
      targetX = (mouseX - centerX) * 0.55 * 0.1;
      targetY = (mouseY - centerY) * 0.55 * 0.1;
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (sphere && transitionStage < 2) {
        sphere.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scale(${ (1 + Math.abs(currentX) * 0.002).toFixed(3) }) rotate(${ (currentX * 0.2).toFixed(2) }deg)`;
      }

      animId = requestAnimationFrame(render);
    };

    // Micro floating drift loop
    gsap.to(sphere, {
      y: "-=18",
      duration: 3.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    if (cursorFollow) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    animId = requestAnimationFrame(render);

    return () => {
      if (cursorFollow) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animId);
    };
  }, [cursorFollow, transitionStage]);

  return (
    <div
      ref={sphereRef}
      className="absolute top-[45%] right-[30%] z-20 pointer-events-none select-none rounded-full transition-shadow duration-500"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.85) 0%, rgba(240, 230, 220, 0.35) 45%, rgba(180, 170, 160, 0.15) 75%, transparent 100%)`,
        backdropFilter: `blur(${refraction * 16}px)`,
        WebkitBackdropFilter: `blur(${refraction * 16}px)`,
        border: "1px solid rgba(255, 255, 255, 0.65)",
        boxShadow: "inset 0 12px 28px rgba(255, 255, 255, 0.9), inset 0 -12px 28px rgba(0, 0, 0, 0.15), 0 35px 90px rgba(0, 0, 0, 0.22)",
      }}
    >
      {/* Curved Refraction Specular Highlight */}
      <div className="absolute top-4 left-6 w-20 h-10 rounded-full bg-gradient-to-b from-white/90 to-transparent blur-[0.5px] transform -rotate-45" />
      {/* Bottom Soft Shadow Ring */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full bg-black/15 filter blur-[8px]" />
    </div>
  );
}
