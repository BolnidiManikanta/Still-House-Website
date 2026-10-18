"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface MotionContextType {
  lenis: Lenis | null;
  scrollProgress: number;
  scrollVelocity: number;
  scrollDirection: number;
  getScrollValues: () => { progress: number; velocity: number; direction: number };
}

const MotionContext = createContext<MotionContextType>({
  lenis: null,
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollDirection: 1,
  getScrollValues: () => ({ progress: 0, velocity: 0, direction: 1 }),
});

export const useMotion = () => useContext(MotionContext);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollValuesRef = useRef({
    progress: 0,
    velocity: 0,
    direction: 1,
  });

  useEffect(() => {
    let isMounted = true;
    let updateTicker: ((time: number) => void) | null = null;
    let activeLenis: Lenis | null = null;

    import("lenis").then(({ default: LenisClass }) => {
      if (!isMounted) return;
      gsap.registerPlugin(ScrollTrigger);

      // Optimized Weighted Inertia Smooth Scroll Engine (Lenis)
      const lenis = new LenisClass({
        duration: 1.2,
        lerp: 0.08,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      activeLenis = lenis;
      lenisRef.current = lenis;

      // Sync Lenis scroll updates with GSAP ScrollTrigger via mutable ref (zero React state re-render lag)
      lenis.on("scroll", (e: { progress: number; velocity: number; direction: number }) => {
        ScrollTrigger.update();
        scrollValuesRef.current.progress = e.progress || 0;
        scrollValuesRef.current.velocity = e.velocity || 0;
        scrollValuesRef.current.direction = e.direction || 1;
      });

      // Sync GSAP ticker with Lenis RAF (Single synchronized 60fps loop)
      updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      isMounted = false;
      if (updateTicker) {
        gsap.ticker.remove(updateTicker);
      }
      if (activeLenis) {
        activeLenis.destroy();
      }
      lenisRef.current = null;
    };
  }, []);

  return (
    <MotionContext.Provider
      value={{
        lenis: lenisRef.current,
        get scrollProgress() {
          return scrollValuesRef.current.progress;
        },
        get scrollVelocity() {
          return scrollValuesRef.current.velocity;
        },
        get scrollDirection() {
          return scrollValuesRef.current.direction;
        },
        getScrollValues: () => scrollValuesRef.current,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}
