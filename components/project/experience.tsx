"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, clamp, lerp, smoothstep } from "@/lib/project/motion"
import Preloader from "./preloader"
import ScrollDots from "./scroll-dots"
import Cursor from "./cursor"
import Sections from "./sections"

const WebglScene = dynamic(() => import("./webgl-scene"), {
  ssr: false,
})

gsap.registerPlugin(ScrollTrigger)

const lerpColor = (t: number) => {
  // #030303 (ink dark) -> #e8e8e8 (ink light). We want INK = inverse of bg,
  // so as darkness (t) rises, ink brightens.
  const r = Math.round(lerp(3, 232, t))
  return `rgb(${r},${r},${r})`
}

export default function Experience({ slug = "blueyard" }: { slug?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)

  const onPreloadDone = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let tickRaf = 0
    let ctx: any = null

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    motion.reduced = reduced

    // ---- reveals ------------------------------------------------------------
    ctx = gsap.context(() => {
      // line-masked headings
      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        const lines = el.querySelectorAll<HTMLElement>(".pr-line-inner")
        const rect = el.getBoundingClientRect()
        const isNearTop = rect.top < window.innerHeight * 0.85

        if (isNearTop) {
          gsap.fromTo(
            lines,
            { yPercent: 40, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }
          )
        } else {
          gsap.set(lines, { yPercent: 100, opacity: 0 })
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () =>
              gsap.to(lines, {
                yPercent: 0,
                opacity: 1,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.09,
              }),
          })
        }
      })

      // fade / rise blocks
      gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const isNearTop = rect.top < window.innerHeight * 0.85

        if (isNearTop) {
          gsap.fromTo(el, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out" })
        } else {
          gsap.set(el, { y: 30, autoAlpha: 0 })
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () => gsap.to(el, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out" }),
          })
        }
      })

      // media reveal (image scales down into a settled frame)
      gsap.utils.toArray<HTMLElement>("[data-media]").forEach((el) => {
        const img = el.querySelector<HTMLElement>(".pr-media-img")
        const rect = el.getBoundingClientRect()
        const isNearTop = rect.top < window.innerHeight * 0.85

        if (isNearTop) {
          gsap.fromTo(el, { autoAlpha: 0.4 }, { autoAlpha: 1, duration: 1.0, ease: "expo.out" })
        } else {
          gsap.set(el, { clipPath: "inset(4% 4% 4% 4%)", autoAlpha: 0.5 })
          if (img) gsap.set(img, { scale: 1.15 })
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () => {
              gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 1.2, ease: "expo.out" })
              if (img) gsap.to(img, { scale: 1, duration: 1.4, ease: "expo.out" })
            },
          })
        }
      })

      // continuous media parallax
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.speed || 12)
        gsap.fromTo(
          el,
          { yPercent: -speed / 2 },
          {
            yPercent: speed / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        )
      })
    }, root)

    let lastScroll = 0
    const tick = () => {
      tickRaf = requestAnimationFrame(tick)
      const scroll = window.scrollY || document.documentElement.scrollTop || 0
      const limit = document.documentElement.scrollHeight - window.innerHeight
      const progress = clamp(scroll / (limit || 1))
      motion.scroll = scroll
      motion.progress = progress
      const velocity = Math.abs(scroll - lastScroll)
      motion.velocity = lerp(motion.velocity, clamp(velocity / 45), 0.2)
      if (velocity > 0) motion.scrollDir = Math.sign(scroll - lastScroll)
      lastScroll = scroll

      // environment darkness ramps in the lower third of the page
      motion.darkness = smoothstep(0.58, 0.9, progress)

      // ink = inverse of the WebGL background so DOM text always reads
      root.style.setProperty("--ink", lerpColor(motion.darkness))
      root.style.setProperty("--ink-soft", lerpColor(motion.darkness))
    }
    tick()

    setReady(true)

    return () => {
      cancelAnimationFrame(tickRaf)
      if (ctx) ctx.revert()
    }
  }, [])

  // refresh triggers once the preloader clears (layout is now final)
  useEffect(() => {
    if (loaded && ready) {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [loaded, ready])

  return (
    <>
      {!loaded && (
        <Preloader
          title={slug === "blueyard" ? "Blueyard" : "Constellation"}
          onDone={onPreloadDone}
        />
      )}

      <WebglScene />
      <ScrollDots />
      <Cursor />

      <div
        id="top"
        ref={rootRef}
        className="relative"
        style={{ color: "var(--ink, #030303)" }}
      >
        <Sections slug={slug} />

        {/* fine grain overlay */}
        <div className="pr-grain pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />
      </div>
    </>
  )
}
