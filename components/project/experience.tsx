"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, clamp, lerp, smoothstep } from "@/lib/project/motion"
import Preloader from "./preloader"
import WebglScene from "./webgl-scene"
import ScrollDots from "./scroll-dots"
import Cursor from "./cursor"
import Sections from "./sections"

gsap.registerPlugin(ScrollTrigger)

const lerpColor = (t: number) => {
  // #030303 (ink dark) -> #e8e8e8 (ink light). We want INK = inverse of bg,
  // so as darkness (t) rises, ink brightens.
  const r = Math.round(lerp(3, 232, t))
  return `rgb(${r},${r},${r})`
}

export default function Experience() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  const onPreloadDone = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    motion.reduced = reduced

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on("scroll", () => ScrollTrigger.update())
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // ---- reveals ------------------------------------------------------------
    const ctx = gsap.context(() => {
      // line-masked headings
      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        const lines = el.querySelectorAll<HTMLElement>(".pr-line-inner")
        gsap.set(lines, { yPercent: 115 })
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(lines, {
              yPercent: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
            }),
        })
      })

      // fade / rise blocks
      gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
        gsap.set(el, { y: 40, autoAlpha: 0 })
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => gsap.to(el, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out" }),
        })
      })

      // media reveal (image scales down into a settled frame)
      gsap.utils.toArray<HTMLElement>("[data-media]").forEach((el) => {
        const img = el.querySelector<HTMLElement>(".pr-media-img")
        gsap.set(el, { clipPath: "inset(8% 8% 8% 8%)", autoAlpha: 0.4 })
        if (img) gsap.set(img, { scale: 1.25 })
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 1.3, ease: "expo.out" })
            if (img) gsap.to(img, { scale: 1, duration: 1.6, ease: "expo.out" })
          },
        })
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

    // ---- master clock: feeds the render-free motion store -------------------
    let tickRaf = 0
    const tick = () => {
      tickRaf = requestAnimationFrame(tick)
      const nativeScroll = window.scrollY || document.documentElement.scrollTop || 0
      const scroll = Math.max(lenis.scroll || 0, nativeScroll)
      const limit =
        (lenis as any).limit || document.documentElement.scrollHeight - window.innerHeight
      const progress = clamp(scroll / (limit || 1))
      motion.scroll = scroll
      motion.progress = progress
      const v = clamp(Math.abs((lenis as any).velocity || 0) / 45)
      motion.velocity = lerp(motion.velocity, v, 0.2)
      if ((lenis as any).velocity) motion.scrollDir = Math.sign((lenis as any).velocity)

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
      gsap.ticker.remove(raf)
      ctx.revert()
      ScrollTrigger.getAll().forEach((s) => s.kill())
      lenis.destroy()
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
      {!loaded && <Preloader onDone={onPreloadDone} />}

      <WebglScene />
      <ScrollDots />
      <Cursor />

      <div
        id="top"
        ref={rootRef}
        className="relative"
        style={{ color: "var(--ink, #030303)" }}
      >
        {/* fixed header */}
        <header className="fixed inset-x-0 top-0 z-30 mix-blend-difference">
          <div className="grid grid-cols-12 gap-x-4 px-4 py-4 md:px-6">
            <a
              href="#top"
              data-cursor="link"
              className="col-span-6 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#e8e8e8]"
            >
              Immersive
            </a>
            <div className="col-span-6 flex justify-end">
              <button
                type="button"
                data-cursor="link"
                onClick={() => setSoundOn((s) => !s)}
                className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#e8e8e8]"
                aria-pressed={soundOn}
              >
                Sound {soundOn ? "On" : "Off"}
              </button>
            </div>
          </div>
        </header>

        <Sections />

        {/* fine grain overlay */}
        <div className="pr-grain pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />
      </div>
    </>
  )
}
