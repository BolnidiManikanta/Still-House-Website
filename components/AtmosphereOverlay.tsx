"use client";

import { useEffect, useRef } from "react";
import FloatingParticlesCanvas from "./FloatingParticlesCanvas";
import ThreeCanvasEngine from "./canvas/ThreeCanvasEngine";

export default function AtmosphereOverlay() {
  const fog1Ref = useRef<HTMLDivElement>(null);
  const lightRaysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const animateAtmosphere = () => {
      time += 0.004;

      if (fog1Ref.current) {
        const x1 = Math.sin(time * 0.4) * 30;
        const y1 = Math.cos(time * 0.3) * 20;
        fog1Ref.current.style.transform = `translate3d(${x1}px, ${y1}px, 0)`;
      }

      if (lightRaysRef.current) {
        const opacity = 0.015 + Math.sin(time * 0.5) * 0.008;
        const rotate = Math.sin(time * 0.2) * 3;
        lightRaysRef.current.style.opacity = opacity.toString();
        lightRaysRef.current.style.transform = `rotate(${rotate}deg)`;
      }

      animationFrameId = requestAnimationFrame(animateAtmosphere);
    };

    animationFrameId = requestAnimationFrame(animateAtmosphere);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      {/* WebGL Three.js Shader Canvas Engine */}
      <div className="opacity-15 pointer-events-none">
        <ThreeCanvasEngine />
      </div>

      {/* Floating Dust Particles Canvas */}
      <FloatingParticlesCanvas />

      {/* Subtle Film Grain */}
      <div className="texture-film-grain opacity-[0.02] pointer-events-none" />

      {/* Extremely Subtle Moving Atmosphere (Opacity 1.5% - Zero White Wash Overlay) */}
      <div
        ref={fog1Ref}
        className="fixed inset-0 pointer-events-none z-[25] opacity-[0.015] filter blur-[100px]"
        style={{
          background: "radial-gradient(circle at 40% 30%, rgba(200,195,185,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Subtle Light Ray Drift */}
      <div
        ref={lightRaysRef}
        className="fixed -top-[20%] -left-[20%] w-[140vw] h-[140vh] pointer-events-none z-[26] opacity-[0.015] transition-transform duration-1000"
        style={{
          background: "linear-gradient(135deg, rgba(240,235,225,0.4) 0%, rgba(240,235,225,0.05) 40%, transparent 80%)",
        }}
      />

      {/* Vignette Layer for Deep Shadow Corners */}
      <div className="texture-vignette opacity-40 pointer-events-none" />
    </>
  );
}
