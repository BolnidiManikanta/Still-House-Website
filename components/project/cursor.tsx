"use client"

import { useEffect, useRef, useState } from "react"
import { motion, lerp } from "@/lib/project/motion"

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    if (!fine) return
    setEnabled(true)

    let px = window.innerWidth / 2
    let py = window.innerHeight / 2
    let rx = px
    let ry = py
    let lastX = px
    let lastY = py
    let lastT = performance.now()

    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      motion.pointerX = px
      motion.pointerY = py
      motion.mouseX = (px / window.innerWidth) * 2 - 1
      motion.mouseY = -((py / window.innerHeight) * 2 - 1)

      const now = performance.now()
      const dt = Math.max(now - lastT, 16)
      const v = Math.hypot(px - lastX, py - lastY) / dt
      motion.mouseVelocity = v
      lastX = px
      lastY = py
      lastT = now

      // resolve cursor state from the hovered element
      const el = e.target as HTMLElement | null
      const interactive = el?.closest("[data-cursor]") as HTMLElement | null
      motion.cursor = (interactive?.dataset.cursor as any) || "default"
      motion.hovering3d = motion.cursor === "object"
    }

    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      rx = lerp(rx, px, 0.14)
      ry = lerp(ry, py, 0.14)
      const dot = dotRef.current
      const ring = ringRef.current
      if (dot) dot.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`
      if (ring) {
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
        const st = motion.cursor
        const scale = st === "view" || st === "object" ? 2.9 : st === "link" ? 1.7 : 1
        ring.style.scale = String(scale)
        ring.style.borderColor =
          motion.darkness > 0.5 ? "rgba(232,232,232,0.6)" : "rgba(3,3,3,0.5)"
        ring.style.background =
          (st === "view" || st === "object") && motion.darkness > 0.5
            ? "rgba(232,232,232,0.08)"
            : st === "view" || st === "object"
              ? "rgba(3,3,3,0.05)"
              : "transparent"
      }
      if (dot)
        dot.style.background = motion.darkness > 0.5 ? "#e8e8e8" : "#030303"
      const label = labelRef.current
      if (label) {
        const show = motion.cursor === "view" || motion.cursor === "object"
        label.style.opacity = show ? "1" : "0"
        label.textContent = motion.cursor === "object" ? "DRAG" : "VIEW"
        label.style.color = motion.darkness > 0.5 ? "#030303" : "#e8e8e8"
      }
    }
    loop()

    window.addEventListener("pointermove", onMove)
    document.documentElement.style.cursor = "none"
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.style.cursor = ""
    }
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border transition-[scale,background-color] duration-300 ease-out will-change-transform"
      >
        <span
          ref={labelRef}
          className="font-sans text-[9px] font-medium tracking-[0.18em] opacity-0 transition-opacity duration-200"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full will-change-transform"
      />
    </div>
  )
}
