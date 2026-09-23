"use client";

import React, { useEffect, useRef } from 'react';

interface AtmosphericBackgroundProps {
  mousePosition?: { x: number; y: number };
}

/**
 * AtmosphericBackground
 * Recreates the exact luxury white-grey architectural background and interactive
 * effects inspired by 25 Residences (25residences.com / Unseen Studio).
 */
export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ mousePosition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameIdRef = useRef<number | null>(null);

  // Passive direct mouse listener with zero React re-render overhead
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Sync if prop is provided
  useEffect(() => {
    if (mousePosition) {
      targetMouseRef.current = {
        x: (mousePosition.x + 1) * 0.5,
        y: (mousePosition.y + 1) * 0.5,
      };
    }
  }, [mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Cache pre-computed grain pattern for maximum 60fps performance
    const grainCanvas = document.createElement('canvas');
    const grainSize = 256;
    grainCanvas.width = grainSize;
    grainCanvas.height = grainSize;
    const grainCtx = grainCanvas.getContext('2d');

    if (grainCtx) {
      const imgData = grainCtx.createImageData(grainSize, grainSize);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        // Delicate monochrome luminance noise
        const val = Math.floor(Math.random() * 255);
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
        d[i + 3] = 16; // Subtle opacity (approx 6%)
      }
      grainCtx.putImageData(imgData, 0, 0);
    }

    let grainPattern: CanvasPattern | null = null;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (grainCtx) {
        grainPattern = ctx.createPattern(grainCanvas, 'repeat');
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Animation Loop: Smooth Cursor Interpolation & Ambient Sheen
    const render = () => {
      // Lerp mouse coordinates for fluid, silky lag (inertia physics)
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.055;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.055;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Base 25 Residences White-Grey Gradient Canvas (#ECE8E8 to #E5E0DF)
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#F0ECEB');
      baseGrad.addColorStop(0.45, '#ECE8E8'); // Signature 25 Residences --white1
      baseGrad.addColorStop(1, '#E4DFDD');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive Fluid Ambient Light Wash (Follows Cursor with Easing)
      const mouseX = currentMouseRef.current.x * width;
      const mouseY = currentMouseRef.current.y * height;
      const spotRadius = Math.max(width, height) * 0.75;

      const lightGlow = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        spotRadius
      );
      lightGlow.addColorStop(0, 'rgba(255, 255, 255, 0.65)'); // Luminous white apex
      lightGlow.addColorStop(0.3, 'rgba(255, 255, 255, 0.35)');
      lightGlow.addColorStop(0.65, 'rgba(240, 236, 235, 0.12)');
      lightGlow.addColorStop(1, 'rgba(230, 224, 222, 0)');

      ctx.fillStyle = lightGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Architectural Drafting Datum Columns (25 Residences signature grid)
      // 5 subtle vertical structural lines across the screen with parallax shift
      const parallaxShiftX = (currentMouseRef.current.x - 0.5) * 14;
      const parallaxShiftY = (currentMouseRef.current.y - 0.5) * 10;

      ctx.strokeStyle = 'rgba(31, 31, 31, 0.04)';
      ctx.lineWidth = 1;

      const columnPositions = [0.12, 0.28, 0.5, 0.72, 0.88];
      columnPositions.forEach((colFraction) => {
        const x = Math.floor(width * colFraction + parallaxShiftX * 0.5) + 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });

      // Horizontal Architectural Datum Lines
      const horizontalDatums = [0.18, 0.82];
      horizontalDatums.forEach((rowFraction) => {
        const y = Math.floor(height * rowFraction + parallaxShiftY * 0.5) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      });

      // Delicate Crosshair Registration Markers (+) at intersections
      ctx.strokeStyle = 'rgba(31, 31, 31, 0.18)';
      ctx.lineWidth = 1;
      const crossSize = 3;

      columnPositions.forEach((colFraction) => {
        horizontalDatums.forEach((rowFraction) => {
          const cx = Math.floor(width * colFraction + parallaxShiftX * 0.5) + 0.5;
          const cy = Math.floor(height * rowFraction + parallaxShiftY * 0.5) + 0.5;

          ctx.beginPath();
          ctx.moveTo(cx - crossSize, cy);
          ctx.lineTo(cx + crossSize, cy);
          ctx.moveTo(cx, cy - crossSize);
          ctx.lineTo(cx, cy + crossSize);
          ctx.stroke();
        });
      });

      // 4. Fine Matte Architectural Paper / Concrete Grain
      if (grainPattern) {
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
      }

      // 5. Subtle Architectural Vignette & Border Shading
      const edgeVignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.45,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      edgeVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      edgeVignette.addColorStop(1, 'rgba(28, 24, 22, 0.045)');
      ctx.fillStyle = edgeVignette;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Interactive 25 Residences Canvas with Grain & Ambient Light */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* 2. Precision Architectural Corner Drafting Brackets (4 corners) */}
      <div className="absolute top-6 left-6 w-3.5 h-3.5 border-t border-l border-[#1F1F1F]/20" />
      <div className="absolute top-6 right-6 w-3.5 h-3.5 border-t border-r border-[#1F1F1F]/20" />
      <div className="absolute bottom-6 left-6 w-3.5 h-3.5 border-b border-l border-[#1F1F1F]/20" />
      <div className="absolute bottom-6 right-6 w-3.5 h-3.5 border-b border-r border-[#1F1F1F]/20" />

      {/* 3. Subtle Horizon Baseline Line */}
      <div className="absolute bottom-16 inset-x-0 h-px bg-[#1F1F1F]/[0.035]" />
    </div>
  );
};
