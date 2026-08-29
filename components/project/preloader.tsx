"use client"

import { useEffect, useRef, useState } from "react"

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [hidden, setHidden] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let n = 0
    const id = window.setInterval(() => {
      n += Math.random() * 7 + 7
      if (n >= 100) {
        n = 100
        window.clearInterval(id)
        window.setTimeout(() => {
          setHidden(true)
          window.setTimeout(onDone, 900)
        }, 350)
      }
      setCount(Math.floor(n))
    }, 95)
    return () => window.clearInterval(id)
  }, [onDone])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-[#e8e8e8] px-4 py-4 transition-[clip-path,opacity] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] md:px-6 md:py-6"
      style={{
        clipPath: hidden ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
      }}
      aria-hidden={hidden}
    >
      <div className="flex items-center justify-between font-sans text-[11px] uppercase tracking-[0.22em] text-[#030303]">
        <span>Immersive Studio</span>
        <span>Loading Environment</span>
      </div>

      <div className="flex flex-1 items-center">
        <p className="max-w-[14ch] font-serif text-[12vw] leading-[0.9] text-[#030303] md:text-[8vw]">
          Constellation
        </p>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#030303]">
          Digital Experience
        </span>
        <span className="font-serif text-[18vw] leading-[0.8] tabular-nums text-[#030303] md:text-[9vw]">
          {String(count).padStart(3, "0")}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px bg-[#030303] transition-[width] duration-150 ease-out" style={{ width: `${count}%` }} />
    </div>
  )
}
