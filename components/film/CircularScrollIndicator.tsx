"use client";

import React from 'react';

interface CircularScrollIndicatorProps {
  progress: number; // 0 to 1
  onClick?: () => void;
}

export const CircularScrollIndicator: React.FC<CircularScrollIndicatorProps> = ({
  progress,
  onClick,
}) => {
  const size = 52;
  const strokeWidth = 1.8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      id="circular-scroll-indicator"
      onClick={onClick}
      className="fixed bottom-8 right-8 z-40 cursor-pointer group flex items-center justify-center rounded-full transition-all duration-300 text-[#1A1A1A] relief-pill p-1 border border-black/10 bg-[#ECE8E0]"
      title="Scroll Progress Indicator"
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 transition-transform duration-300 group-hover:scale-110"
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-15"
        />
        {/* Live progress stroke circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>

      {/* Center inner dot / percentage */}
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium tracking-tighter">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
};
