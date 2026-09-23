"use client";

import { useEffect, useRef, useState } from "react";

export default function Preloader({
  title = "Blueyard",
  onDone,
}: {
  title?: string;
  onDone: () => void;
}) {
  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ultra-fast responsive loader to meet the user's requirement of millisecond loading
    let current = 0;
    const interval = window.setInterval(() => {
      current += 25;
      if (current >= 100) {
        current = 100;
        window.clearInterval(interval);
        setCount(100);
        setHidden(true);
        onDone();
      } else {
        setCount(current);
      }
    }, 40);

    return () => window.clearInterval(interval);
  }, [onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[90] flex flex-col justify-between bg-[#e8e8e8] px-4 py-4 transition-all duration-300 pointer-events-none md:px-6 md:py-6 ${
        hidden ? "opacity-0 -translate-y-4" : "opacity-100"
      }`}
      aria-hidden={hidden}
    >
      <div className="flex items-center justify-between font-sans text-[11px] uppercase tracking-[0.22em] text-[#030303]">
        <span>Still Studio</span>
        <span>Loading Exhibition</span>
      </div>

      <div className="flex flex-1 items-center">
        <p className="max-w-[14ch] font-serif text-[12vw] leading-[0.9] text-[#030303] md:text-[8vw] uppercase">
          {title}
        </p>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#030303]">
          Spatial Monograph
        </span>
        <span className="font-serif text-[18vw] leading-[0.8] tabular-nums text-[#030303] md:text-[9vw]">
          {String(count).padStart(3, "0")}
        </span>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-[#030303] transition-[width] duration-75 ease-out"
        style={{ width: `${count}%` }}
      />
    </div>
  );
}
