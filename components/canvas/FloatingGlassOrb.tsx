"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FloatingGlassOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let orbX = 0;
    let orbY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      orbX = (mouseX - centerX) * 0.05;
      orbY = (mouseY - centerY) * 0.05;
    };

    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (orbX - currentX) * 0.06;
      currentY += (orbY - currentY) * 0.06;

      if (orb) {
        orb.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotate(${ (currentX * 0.1).toFixed(2) }deg)`;
      }

      animId = requestAnimationFrame(render);
    };

    // Continuous floating breathing animation
    const tween = gsap.to(orb, {
      y: "-=15",
      duration: 3.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animId = requestAnimationFrame(render);

    return () => {
      tween.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={orbRef}
      className="absolute top-[28%] right-[18%] z-15 w-48 h-48 md:w-64 md:h-64 rounded-full pointer-events-none select-none mix-blend-soft-light shadow-[0_30px_90px_rgba(0,0,0,0.18)] transition-all duration-700"
      style={{
        background: "radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.7) 0%, rgba(245, 235, 225, 0.3) 40%, rgba(200, 190, 180, 0.15) 70%, transparent 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.55)",
        boxShadow: "inset 0 10px 25px rgba(255, 255, 255, 0.8), inset 0 -10px 25px rgba(0, 0, 0, 0.15), 0 35px 80px rgba(0, 0, 0, 0.18)",
      }}
    >
      {/* Refractive Inner Highlight Arc */}
      <div className="absolute top-4 left-6 w-20 h-10 rounded-full bg-gradient-to-b from-white/80 to-transparent blur-[1px] transform -rotate-45" />
    </div>
  );
}
