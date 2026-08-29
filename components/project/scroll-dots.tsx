"use client"

import { useEffect, useRef } from "react"
import { motion, clamp } from "@/lib/project/motion"

// A very subtle dot field that only wakes up during fast scrolling.
export default function ScrollDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const COUNT = window.matchMedia("(max-width: 768px)").matches ? 60 : 110
    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio, 2)

    type Dot = { x: number; y: number; r: number; drift: number; phase: number }
    let dots: Dot[] = []

    const build = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.4,
        drift: 8 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
      }))
    }
    build()
    window.addEventListener("resize", build)

    let raf = 0
    let shown = 0
    let t = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      t += 0.016
      // dots become visible with scroll velocity
      const target = clamp((motion.velocity - 0.12) * 1.8)
      shown += (target - shown) * 0.08
      ctx.clearRect(0, 0, w, h)
      if (shown < 0.01) return

      const ink = motion.darkness > 0.5 ? "232,232,232" : "3,3,3"
      const dir = Math.sign(motion.scrollDir || 1)
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        const yy = d.y - dir * Math.sin(t + d.phase) * d.drift * shown
        const a = shown * (0.25 + 0.35 * Math.sin(t * 1.3 + d.phase)) * 0.6
        ctx.beginPath()
        ctx.fillStyle = `rgba(${ink},${clamp(a, 0, 0.5)})`
        ctx.arc(d.x, ((yy % h) + h) % h, d.r * (0.6 + shown), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", build)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  )
}
