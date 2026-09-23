"use client";

import React, { useEffect, useRef, useState } from 'react';

export const InteractiveSculpture: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTargetRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationX = 0.35;
    let rotationY = 0.2;
    let rotationZ = 0.1;

    // Generate points for an organic architectural ribbon / Mobius ring
    const segmentsU = 64;
    const segmentsV = 16;
    const radius = 100;
    const tubeRadius = 24;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      // Smoothly interpolate mouse target
      currentMouseRef.current.x +=
        (mouseTargetRef.current.x - currentMouseRef.current.x) * 0.04;
      currentMouseRef.current.y +=
        (mouseTargetRef.current.y - currentMouseRef.current.y) * 0.04;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Slow organic rotation with subtle mouse parallax
      rotationY += 0.005;
      rotationX = 0.4 + currentMouseRef.current.y * 0.35;
      const effectiveRotY = rotationY + currentMouseRef.current.x * 0.4;

      const centerX = width / 2;
      const centerY = height / 2;

      // Soft ground contact shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY + 105 + currentMouseRef.current.y * 10,
        100,
        18,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(215, 215, 210, 0.35)';
      ctx.filter = 'blur(12px)';
      ctx.fill();
      ctx.restore();

      // Parametric curves with matte stone/gypsum shading
      const lines = [];

      for (let j = 0; j <= segmentsV; j += 2) {
        const v = (j / segmentsV) * Math.PI * 2;
        const polyline = [];

        for (let i = 0; i <= segmentsU; i++) {
          const u = (i / segmentsU) * Math.PI * 2;

          // Trefoil knot / organic architectural continuous loop
          const p = 2;
          const q = 3;
          const r =
            radius * (0.75 + 0.25 * Math.cos(q * u)) +
            tubeRadius * Math.cos(v);
          const x0 = r * Math.cos(p * u);
          const y0 = r * Math.sin(p * u);
          const z0 =
            radius * 0.4 * Math.sin(q * u) + tubeRadius * Math.sin(v);

          // 3D rotation matrix
          // Rotate X
          const cosX = Math.cos(rotationX);
          const sinX = Math.sin(rotationX);
          const y1 = y0 * cosX - z0 * sinX;
          const z1 = y0 * sinX + z0 * cosX;

          // Rotate Y
          const cosY = Math.cos(effectiveRotY);
          const sinY = Math.sin(effectiveRotY);
          const x2 = x0 * cosY + z1 * sinY;
          const z2 = -x0 * sinY + z1 * cosY;

          // Camera projection
          const fov = 380;
          const distance = 420;
          const scale = fov / (distance + z2);

          const projX = centerX + x2 * scale;
          const projY = centerY + y1 * scale;

          // Soft light source from top-left (matte white sculpture)
          const lightFactor = (y1 * -0.5 + x2 * 0.3 + z2 * 0.4) / 100;
          const normLight = Math.max(0.15, Math.min(0.9, 0.55 + lightFactor * 0.45));

          polyline.push({
            x: projX,
            y: projY,
            z: z2,
            light: normLight,
          });
        }
        lines.push(polyline);
      }

      // Draw lines sorted or styled with delicate architectural strokes
      lines.forEach((line) => {
        for (let k = 0; k < line.length - 1; k++) {
          const p1 = line[k];
          const p2 = line[k + 1];

          // Shade between pure white and warm grey
          const greyVal = Math.round(180 + p1.light * 65);
          const strokeAlpha = Math.max(0.2, Math.min(0.85, 0.4 + p1.light * 0.5));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${greyVal}, ${greyVal}, ${Math.round(
            greyVal * 0.98
          )}, ${strokeAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });

      // Subtle cross-contour rings
      for (let i = 0; i < segmentsU; i += 6) {
        ctx.beginPath();
        for (let j = 0; j < lines.length; j++) {
          const p = lines[j][i];
          if (p) {
            if (j === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = 'rgba(215, 215, 210, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] flex items-center justify-center select-none pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[440px] max-h-[380px]"
      />
      {/* Editorial sculpture caption label */}
      <div className="absolute bottom-1 right-2 text-right">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A8A86] block">
          OPTICAL SCULPTURE NO. 01
        </span>
        <span className="text-[10px] tracking-wider text-[#666666]">
          Continuous Light Geometry / Responsive
        </span>
      </div>
    </div>
  );
};
