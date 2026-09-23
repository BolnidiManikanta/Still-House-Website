"use client";

import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
    isHovering: false,
    isVisible: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;

      if (!mousePos.current.isVisible) {
        mousePos.current.isVisible = true;
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
        if (containerRef.current) {
          containerRef.current.style.opacity = '1';
        }
      }

      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest('button, a, input, [role="button"], .cursor-pointer');
      mousePos.current.isHovering = isInteractive;

      if (followerRef.current) {
        if (isInteractive) {
          followerRef.current.classList.add('scale-125', 'bg-black/5', 'border-black/50');
          followerRef.current.classList.remove('scale-100');
        } else {
          followerRef.current.classList.remove('scale-125', 'bg-black/5', 'border-black/50');
          followerRef.current.classList.add('scale-100');
        }
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      mousePos.current.isVisible = false;
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let rafId: number;
    const updateFollower = () => {
      const state = mousePos.current;
      if (state.isVisible && followerRef.current) {
        state.x += (state.targetX - state.x) * 0.18;
        state.y += (state.targetY - state.y) * 0.18;
        followerRef.current.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      }
      rafId = requestAnimationFrame(updateFollower);
    };
    rafId = requestAnimationFrame(updateFollower);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden md:block pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-0 transition-opacity duration-300"
    >
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-black dark:bg-white"
        style={{ willChange: 'transform' }}
      />

      {/* Lagging Follower Ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border border-black/30 dark:border-white/40 transition-[width,height,transform,border-color,background-color] duration-200"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
