"use client";

import React, { useEffect, useRef } from 'react';

const heroBackground = "/images/hero-background.png";

/**
 * Authentic camera sculpture coordinates corresponding to the physical bas-relief
 * composition in src/assets/hero-background.png.
 */
interface SculptureZone {
  name: string;
  x: string;
  y: string;
  rx: string;
  ry: string;
}

const SCULPTURE_ZONES: SculptureZone[] = [
  { name: 'top-left-camera', x: '16%', y: '20%', rx: '260px', ry: '220px' },
  { name: 'left-mechanical-camera', x: '13%', y: '46%', rx: '250px', ry: '230px' },
  { name: 'upper-middle-camera', x: '50%', y: '16%', rx: '260px', ry: '200px' },
  { name: 'upper-right-large-camera', x: '85%', y: '22%', rx: '290px', ry: '240px' },
  { name: 'right-telephoto-lens', x: '87%', y: '50%', rx: '250px', ry: '240px' },
  { name: 'bottom-left-lens-shelf', x: '17%', y: '78%', rx: '280px', ry: '230px' },
  { name: 'bottom-center-camera', x: '50%', y: '85%', rx: '270px', ry: '210px' },
  { name: 'bottom-right-camera', x: '84%', y: '80%', rx: '270px', ry: '230px' },
  { name: 'left-gimbal-sculpture', x: '34%', y: '36%', rx: '240px', ry: '220px' },
  { name: 'right-gimbal-sculpture', x: '66%', y: '40%', rx: '240px', ry: '220px' },
  { name: 'center-left-small-cameras', x: '28%', y: '60%', rx: '230px', ry: '210px' },
  { name: 'center-right-shelf-camera', x: '72%', y: '62%', rx: '240px', ry: '220px' },
  { name: 'upper-center-left-lens', x: '32%', y: '18%', rx: '230px', ry: '200px' },
  { name: 'upper-center-right-lens', x: '68%', y: '18%', rx: '240px', ry: '210px' },
];

/**
 * Global Fixed Background System
 *
 * Implements a three-tier visibility architecture using the exact artwork in hero-background.png:
 *
 * 1. BASE STATE (Layer 1):
 *    Subtle, quiet architectural presence at approximately 0%–3% visual strength (opacity 0.02).
 *
 * 2. AUTOMATIC ACTIVE AREAS (Layer 2):
 *    Continuous, asynchronous autonomous emergence of existing camera sculptures when idle.
 *    - 2–4 localized areas noticeably active at any given moment
 *    - Peak visibility reaches 35%–60% (opacity 0.38 to 0.55)
 *    - Asynchronous organic lifecycles (fade-in 2–5s, hold 2–5s, fade-out 3–6s, randomized wait)
 *    - Soft feathered elliptical masks following physical sculpture geometry
 *    - Runs continuously and independently of cursor movement
 *
 * 3. CURSOR ACTIVE AREA (Layer 3):
 *    Cursor-controlled reveal at 90%–100% full visual strength within soft feathered mask.
 *    Cursor always maintains dominant visual priority.
 */
export default function HeroBackground() {
  // Concurrent autonomous reveal slots to maintain 2–4 localized areas active simultaneously
  const slotRef1 = useRef<HTMLImageElement>(null);
  const slotRef2 = useRef<HTMLImageElement>(null);
  const slotRef3 = useRef<HTMLImageElement>(null);

  const cursorRevealRef = useRef<HTMLImageElement>(null);
  const animFrameId = useRef<number | null>(null);

  // Tracks active zone indices across slots to avoid collisions
  const activeZoneIndices = useRef<number[]>([-1, -1, -1]);

  // Position and opacity tracking for fluid cursor interpolation (lerp)
  // Operates completely outside React state to maintain pristine 60/120 FPS performance
  const cursorState = useRef({
    targetX: -999,
    targetY: -999,
    currentX: -999,
    currentY: -999,
    targetOpacity: 0,
    currentOpacity: 0,
    isHoverSupported: false,
    hasInitialized: false,
  });

  // =========================================================================
  // 1. CURSOR REVEAL INTERACTION (Preserved Exactly)
  // =========================================================================
  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    cursorState.current.isHoverSupported = hoverQuery.matches;

    const handleMediaChange = (e: MediaQueryListEvent) => {
      cursorState.current.isHoverSupported = e.matches;
      if (!e.matches && cursorRevealRef.current) {
        cursorState.current.targetOpacity = 0;
        cursorState.current.currentOpacity = 0;
        cursorRevealRef.current.style.opacity = '0';
      }
    };

    if (hoverQuery.addEventListener) {
      hoverQuery.addEventListener('change', handleMediaChange);
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!cursorState.current.isHoverSupported) return;

      cursorState.current.targetX = e.clientX;
      cursorState.current.targetY = e.clientY;
      cursorState.current.targetOpacity = 1;

      if (!cursorState.current.hasInitialized) {
        cursorState.current.currentX = e.clientX;
        cursorState.current.currentY = e.clientY;
        cursorState.current.hasInitialized = true;
      }
    };

    const handlePointerLeave = () => {
      cursorState.current.targetOpacity = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave, { passive: true });

    const updateCursorLoop = () => {
      const s = cursorState.current;
      const revealEl = cursorRevealRef.current;

      if (revealEl && s.isHoverSupported) {
        // Fluid position lerp (factor 0.14)
        const dx = s.targetX - s.currentX;
        const dy = s.targetY - s.currentY;
        s.currentX += dx * 0.14;
        s.currentY += dy * 0.14;

        // Smooth asymmetric opacity lerp:
        // Enter: ~150-300ms (factor 0.12)
        // Leave: ~400-800ms (factor 0.045)
        const dOpacity = s.targetOpacity - s.currentOpacity;
        const opacityLerpFactor = dOpacity > 0 ? 0.12 : 0.045;
        s.currentOpacity += dOpacity * opacityLerpFactor;

        if (s.currentOpacity < 0.005) {
          revealEl.style.opacity = '0';
        } else {
          revealEl.style.opacity = s.currentOpacity.toFixed(3);

          // Soft feathered radial reveal mask centered around cursor (diameter ~440px)
          const mask = `radial-gradient(circle 220px at ${s.currentX.toFixed(1)}px ${s.currentY.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 22%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.18) 75%, transparent 100%)`;
          revealEl.style.webkitMaskImage = mask;
          revealEl.style.maskImage = mask;
        }
      }

      animFrameId.current = requestAnimationFrame(updateCursorLoop);
    };

    animFrameId.current = requestAnimationFrame(updateCursorLoop);

    return () => {
      if (hoverQuery.removeEventListener) {
        hoverQuery.removeEventListener('change', handleMediaChange);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  // =========================================================================
  // 2. AUTOMATIC ASYNCHRONOUS LOCALIZED REVEALS (Continuous Motion)
  // =========================================================================
  useEffect(() => {
    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];

    // Helper to run an independent organic reveal lifecycle for a slot
    const runSlotLifecycle = (
      slotIndex: number,
      elementRef: React.RefObject<HTMLImageElement | null>
    ) => {
      if (!isMounted || !elementRef.current) return;

      // Select a zone not currently occupied by other slots
      const availableZones: number[] = [];
      for (let i = 0; i < SCULPTURE_ZONES.length; i++) {
        if (!activeZoneIndices.current.includes(i)) {
          availableZones.push(i);
        }
      }

      const chosenIndex =
        availableZones.length > 0
          ? availableZones[Math.floor(Math.random() * availableZones.length)]
          : Math.floor(Math.random() * SCULPTURE_ZONES.length);

      activeZoneIndices.current[slotIndex] = chosenIndex;
      const zone = SCULPTURE_ZONES[chosenIndex];

      // Randomized natural timings conforming to 35–60% visibility specification:
      // Fade in: 2.2 – 4.5 seconds
      const fadeInDuration = +(2.2 + Math.random() * 2.3).toFixed(2);
      // Hold: 2.0 – 4.5 seconds
      const holdDuration = +(2.0 + Math.random() * 2.5).toFixed(2);
      // Fade out: 3.0 – 5.5 seconds
      const fadeOutDuration = +(3.0 + Math.random() * 2.5).toFixed(2);
      // Gap before next emergence: 1.5 – 4.0 seconds
      const gapDelay = +(1.5 + Math.random() * 2.5).toFixed(2);

      // Distinct, clearly visible localized peak: 38% to 54% (within 35–60% range)
      const peakOpacity = +(0.38 + Math.random() * 0.16).toFixed(3);

      const el = elementRef.current;

      // Soft feathered mask around the specific sculpture (no artificial spotlight circle)
      const mask = `radial-gradient(ellipse ${zone.rx} ${zone.ry} at ${zone.x} ${zone.y}, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 32%, rgba(0,0,0,0.45) 65%, transparent 100%)`;
      el.style.webkitMaskImage = mask;
      el.style.maskImage = mask;

      // Step A: Slow organic fade in
      el.style.transition = `opacity ${fadeInDuration}s ease-in-out`;
      el.style.opacity = peakOpacity.toString();

      // Step B: Hold at peak visibility
      const t1 = setTimeout(() => {
        if (!isMounted || !elementRef.current) return;

        const t2 = setTimeout(() => {
          if (!isMounted || !elementRef.current) return;

          // Step C: Slow organic fade out
          el.style.transition = `opacity ${fadeOutDuration}s ease-in-out`;
          el.style.opacity = '0';

          const t3 = setTimeout(() => {
            if (!isMounted) return;
            activeZoneIndices.current[slotIndex] = -1;

            // Step D: Gap before next cycle begins for this slot
            const t4 = setTimeout(() => {
              if (isMounted) {
                runSlotLifecycle(slotIndex, elementRef);
              }
            }, gapDelay * 1000);
            timeouts.push(t4);
          }, fadeOutDuration * 1000);
          timeouts.push(t3);
        }, holdDuration * 1000);
        timeouts.push(t2);
      }, fadeInDuration * 1000);
      timeouts.push(t1);
    };

    // Staggered launch across the 3 slots to ensure 2–4 regions are actively visible simultaneously
    // Slot 0: Starts almost immediately (0.6s)
    const initTimer0 = setTimeout(() => {
      runSlotLifecycle(0, slotRef1);
    }, 600);

    // Slot 1: Starts at 3.2s
    const initTimer1 = setTimeout(() => {
      runSlotLifecycle(1, slotRef2);
    }, 3200);

    // Slot 2: Starts at 6.8s
    const initTimer2 = setTimeout(() => {
      runSlotLifecycle(2, slotRef3);
    }, 6800);

    timeouts.push(initTimer0, initTimer1, initTimer2);

    return () => {
      isMounted = false;
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div
      id="global-hero-background-system"
      aria-hidden="true"
      className="global-bg-container"
    >
      {/* ========================================================================= */}
      {/* LAYER 1: Base Background                                                  */}
      {/* Quiet, elegant resting state at 0%–3% visual presence (opacity 0.02)      */}
      {/* ========================================================================= */}
      <img
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="global-bg-img global-bg-base"
      />

      {/* ========================================================================= */}
      {/* LAYER 2: Automatic Organic Localized Reveals                              */}
      {/* 3 concurrent asynchronous slots revealing authentic camera sculptures     */}
      {/* at 35%–60% peak visibility without cursor movement                        */}
      {/* ========================================================================= */}
      <img
        ref={slotRef1}
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="global-bg-img global-bg-auto-reveal"
      />
      <img
        ref={slotRef2}
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="global-bg-img global-bg-auto-reveal"
      />
      <img
        ref={slotRef3}
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="global-bg-img global-bg-auto-reveal"
      />

      {/* ========================================================================= */}
      {/* LAYER 3: Cursor-Controlled Reveal (Main Interaction)                      */}
      {/* Reveals original camera sculpture artwork at 90%–100% full visual strength*/}
      {/* beneath cursor with soft feathered mask. Always has dominant priority.    */}
      {/* ========================================================================= */}
      <img
        ref={cursorRevealRef}
        src={heroBackground}
        alt=""
        aria-hidden="true"
        className="global-bg-img global-bg-cursor-reveal"
      />
    </div>
  );
}
