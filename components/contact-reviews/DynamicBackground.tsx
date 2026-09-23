"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const DynamicBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layer1Ref = useRef<HTMLDivElement | null>(null);
  const layer2Ref = useRef<HTMLDivElement | null>(null);
  const layer3Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    const layer3 = layer3Ref.current;
    if (!layer1 || !layer2 || !layer3) return;

    // Layer 1: Very slow parallax reaction to scroll
    const st1 = gsap.to(layer1, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // Layer 2: Medium slow parallax reaction
    const st2 = gsap.to(layer2, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });

    // Layer 3: Subtle foreground architectural movement
    const st3 = gsap.to(layer3, {
      yPercent: 26,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.0,
      },
    });

    return () => {
      st1.kill();
      st2.kill();
      st3.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#F6F6F4]"
    >
      {/* ========================================================================= */}
      {/* LAYER 1: Deep Base, Fine Paper Grain & Architectural Plaster Noise        */}
      {/* ========================================================================= */}
      <div
        ref={layer1Ref}
        className="absolute -top-[15%] -left-[10%] w-[120%] h-[130%] pointer-events-none"
      >
        {/* Fine SVG Fractal Grain (Paper / Plaster tactile grain) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.038] mix-blend-multiply pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="tactile-plaster-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tactile-plaster-grain)" />
        </svg>

        {/* Soft Fog & Atmospheric Plaster Field (Off-white / pale mist) */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.95) 0%, rgba(246,246,244,0) 65%), radial-gradient(ellipse at 75% 70%, rgba(233,233,230,0.8) 0%, rgba(246,246,244,0) 60%)',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: Evolving Light & Soft Blurred Organic Shadow Fields              */}
      {/* ========================================================================= */}
      <div
        ref={layer2Ref}
        className="absolute -top-[20%] -left-[15%] w-[130%] h-[140%] pointer-events-none"
      >
        {/* Primary Soft Moving Light Field: Simulating natural morning window light */}
        <div
          className="absolute top-[5%] left-[10%] w-[65vw] h-[65vw] rounded-full opacity-50 mix-blend-soft-light filter blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(246,246,244,0.4) 45%, transparent 70%)',
            animation: 'driftLightPlasterA 38s ease-in-out infinite alternate',
          }}
        />

        {/* Secondary Soft Grey Shadow Field: Simulating soft architectural shadow cast */}
        <div
          className="absolute top-[40%] right-[5%] w-[55vw] h-[55vw] rounded-full opacity-35 mix-blend-multiply filter blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(220,220,215,0.4) 0%, rgba(240,240,237,0.1) 50%, transparent 70%)',
            animation: 'driftShadowPlasterB 42s ease-in-out infinite alternate',
          }}
        />

        {/* Tertiary Subtle Ambient Glow */}
        <div
          className="absolute bottom-[5%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-45 mix-blend-soft-light filter blur-2xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(246,246,244,0) 65%)',
            animation: 'driftLightPlasterC 34s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: Architectural Grid Hairlines & Subtle Foreground Movement        */}
      {/* ========================================================================= */}
      <div
        ref={layer3Ref}
        className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none"
      >
        <div className="h-full w-full grid grid-cols-6 lg:grid-cols-12 gap-6 opacity-25">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full border-r border-[#D7D7D2] ${
                idx % 2 !== 0 ? 'hidden sm:block' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Subtle paper dot matrix texture */}
      <div className="absolute inset-0 bg-paper-grain opacity-35 pointer-events-none" />

      {/* Continuous atmospheric animation keyframes */}
      <style>{`
        @keyframes driftLightPlasterA {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(5%, 4%, 0) scale(1.06);
          }
          100% {
            transform: translate3d(-3%, -2%, 0) scale(0.96);
          }
        }
        @keyframes driftShadowPlasterB {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-4%, 3%, 0) scale(1.04);
          }
          100% {
            transform: translate3d(3%, -5%, 0) scale(0.95);
          }
        }
        @keyframes driftLightPlasterC {
          0% {
            transform: translate3d(0, 0, 0) scale(0.98);
          }
          50% {
            transform: translate3d(-3%, -4%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(4%, 3%, 0) scale(1.0);
          }
        }
      `}</style>
    </div>
  );
};
