"use client"

import Image from "next/image"
import type { ReactNode } from "react"
import { usePageTransition } from "@/components/PageTransition"
import { useSiteConfig } from "@/lib/admin/siteConfigStore"
import { getTypographyStyles, getImageFilterStyles } from "@/lib/admin/styleHelpers"

/* ------------------------------ primitives ------------------------------ */

function Grid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-12 gap-x-4 px-4 md:px-6 ${className}`}>{children}</div>
  )
}

function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-sans text-[10px] uppercase leading-relaxed tracking-[0.22em] opacity-70 md:text-[11px] ${className}`}
    >
      {children}
    </span>
  )
}

// Line-masked serif statement. Each line reveals from below.
function Statement({
  lines,
  className = "",
}: {
  lines: string[]
  className?: string
}) {
  return (
    <h2
      data-reveal="lines"
      className={`font-serif font-light leading-[0.98] tracking-[-0.02em] text-pretty ${className}`}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span className="pr-line-inner block">{line}</span>
        </span>
      ))}
    </h2>
  )
}

function Copy({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      data-reveal="up"
      className={`font-sans text-[15px] leading-relaxed opacity-80 md:text-[17px] ${className}`}
    >
      {children}
    </p>
  )
}

function Media({
  src,
  alt,
  speed = 12,
  className = "",
  priority = false,
  customStyle,
}: {
  src: string
  alt: string
  speed?: number
  className?: string
  priority?: boolean
  customStyle?: React.CSSProperties
}) {
  return (
    <figure
      data-media
      data-cursor="view"
      className={`relative overflow-hidden ${className}`}
    >
      <div data-parallax data-speed={speed} className="relative h-full w-full will-change-transform">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={priority}
          unoptimized={typeof src === "string" && src.startsWith("data:")}
          style={customStyle}
          className="pr-media-img object-cover transition-all duration-300"
        />
      </div>
    </figure>
  )
}

/* ------------------------------- sections ------------------------------- */

export default function Sections({ slug }: { slug?: string } = {}) {
  const { triggerTransition } = usePageTransition()
  const { config } = useSiteConfig()
  const proj = config.project

  return (
    <div className="relative z-20">
      {/* 01 — HERO ------------------------------------------------------- */}
      <section className="relative flex min-h-[100svh] flex-col justify-between pb-6 pt-16 md:pt-20">
        <Grid>
          <div className="col-span-6 flex items-start gap-6 md:col-span-4">
            <Label>
              Project / Digital Experience
              <br />
              Interactive · WebGL
            </Label>
          </div>
          <div className="col-span-6 flex justify-end md:col-span-8">
            <Label>{proj.locationYear || "2026"}</Label>
          </div>
        </Grid>

        <Grid className="items-end">
          <div className="col-span-12 md:col-span-11">
            <h1 data-reveal="lines" className="font-serif font-light leading-[0.86] tracking-[-0.03em]">
              <span className="block overflow-hidden">
                <span
                  style={getTypographyStyles(proj.titleTypography)}
                  className="pr-line-inner block text-[14vw] md:text-[13vw] transition-all duration-200"
                >
                  {proj.title}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="pr-line-inner block pl-[0.02em] text-[9vw] italic md:text-[6vw]">
                  {proj.eyebrow}
                </span>
              </span>
            </h1>
          </div>
        </Grid>

        <Grid className="items-end">
          <div className="col-span-6 md:col-span-4">
            <Label>01 — Project</Label>
          </div>
          <div className="col-span-6 flex justify-end md:col-span-8">
            <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.22em] opacity-70 md:text-[11px]">
              Scroll to explore
              <span className="pr-scroll-hint inline-block">↓</span>
            </span>
          </div>
        </Grid>
      </section>

      {/* 02 — INTRO ------------------------------------------------------ */}
      <section className="py-[16vh] md:py-[22vh]">
        <Grid className="gap-y-10">
          <div className="col-span-12 md:col-span-3">
            <Label>Introduction</Label>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-4">
            <Statement
              className="text-[7vw] md:text-[3.6vw]"
              lines={[
                proj.statementLine1 || "An environment that behaves",
                proj.statementLine2 || "like a material — catching light",
              ]}
            />
            {proj.narrativeBody && (
              <p className="mt-8 font-sans text-[16px] leading-relaxed opacity-80 max-w-xl">
                {proj.narrativeBody}
              </p>
            )}
          </div>
        </Grid>
      </section>

      {/* 03 — FULL MEDIA ------------------------------------------------- */}
      <section className="py-[8vh]">
        <div className="px-4 md:px-6">
          <Media
            src={proj.primaryImage || "/media/plaster-relief.png"}
            alt={proj.title || "Project plate"}
            speed={16}
            priority
            customStyle={getImageFilterStyles(proj.primaryImageStyle)}
            className="h-[78vh] w-full md:h-[92vh]"
          />
        </div>
        <Grid className="mt-4">
          <div className="col-span-6 md:col-span-4">
            <Label>Plate 01 — {proj.title}</Label>
          </div>
          <div className="col-span-6 flex justify-end md:col-span-8">
            <Label>Studio capture · 01/06</Label>
          </div>
        </Grid>
      </section>

      {/* 04 — EDITORIAL + OFFSET MEDIA ----------------------------------- */}
      <section className="py-[16vh] md:py-[22vh]">
        <Grid className="items-center gap-y-12">
          <div className="col-span-12 md:col-span-5">
            <Media
              src={proj.secondaryImage || "/media/ceramic-form.png"}
              alt="Detail of spatial volume"
              speed={20}
              customStyle={getImageFilterStyles(proj.secondaryImageStyle)}
              className="aspect-[4/5] w-full"
            />
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <Label className="mb-6 block">Art Direction</Label>
            <Statement className="text-[8vw] md:text-[3.2vw]" lines={["Form before", "interface."]} />
            <Copy className="mt-8 max-w-[42ch]">
              The object is never a decoration behind the content. It is the content — a sculptural
              placeholder that responds to the cursor, to velocity, and to the reader&apos;s position
              on the page.
            </Copy>
          </div>
        </Grid>
      </section>

      {/* 05 — SMALL + LARGE COMPOSITION ---------------------------------- */}
      <section className="py-[10vh]">
        <Grid className="items-end gap-y-12">
          <div className="col-span-7 md:col-span-4">
            <Media
              src="/media/paper-fold.png"
              alt="Folded matte paper relief with soft ridges"
              speed={24}
              className="aspect-[3/4] w-full"
            />
            <Label className="mt-3 block">Plate 02 — Paper</Label>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-6">
            <Media
              src="/media/plaster-relief.png"
              alt="Detail of plaster relief in soft studio light"
              speed={14}
              className="aspect-[16/10] w-full"
            />
            <div className="mt-3 flex justify-between">
              <Label>Plate 03 — Relief</Label>
              <Label>02/06</Label>
            </div>
          </div>
        </Grid>
      </section>

      {/* 06 — DETAILS ---------------------------------------------------- */}
      <section className="py-[16vh] md:py-[22vh]">
        <Grid className="gap-y-10">
          <div className="col-span-12 md:col-span-4">
            <Statement className="text-[9vw] md:text-[3vw]" lines={["Project", "details"]} />
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <dl className="divide-y divide-current/15">
              {[
                ["Client", "Immersive Gallery"],
                ["Discipline", "Creative Technology, WebGL"],
                ["Role", "Art Direction · Interaction · Shaders"],
                ["Year", "2026"],
                ["Stack", "Three.js · GSAP · Lenis"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  data-reveal="up"
                  className="flex items-baseline justify-between gap-6 py-4"
                >
                  <dt className="font-sans text-[11px] uppercase tracking-[0.2em] opacity-60">
                    {k}
                  </dt>
                  <dd className="text-right font-serif text-[18px] md:text-[22px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Grid>
      </section>

      {/* 07 — FULL WIDTH DARK MEDIA -------------------------------------- */}
      <section className="py-[8vh]">
        <Media
          src="/media/dark-sculpture.png"
          alt="Abstract charcoal plaster sculpture under dramatic low-key light"
          speed={18}
          className="h-[90vh] w-full"
        />
      </section>

      {/* 08 — DARK EDITORIAL STATEMENT ----------------------------------- */}
      <section className="py-[18vh] md:py-[26vh]">
        <Grid>
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <Statement
              className="text-center text-[8vw] md:text-[4.4vw]"
              lines={["As you descend, the light", "leaves the room and the", "material turns to shadow."]}
            />
          </div>
        </Grid>
      </section>

      {/* 09 — GALLERY ---------------------------------------------------- */}
      <section className="py-[10vh]">
        <Grid className="gap-y-16">
          <div className="col-span-12 md:col-span-7">
            <Media src="/media/dark-sculpture.png" alt="Charcoal sculpture, frontal" speed={16} className="aspect-[4/3] w-full" />
          </div>
          <div className="col-span-8 md:col-span-4 md:col-start-9 md:self-end">
            <Media src="/media/next-project.png" alt="Dark monolith in soft fog" speed={26} className="aspect-[3/4] w-full" />
            <Label className="mt-3 block">03/06 — Environment</Label>
          </div>
        </Grid>
      </section>

      {/* 10 — NEXT PROJECT ---------------------------------------------- */}
      <section className="relative min-h-[100svh] py-6" data-cursor="link">
        <Grid className="h-full">
          <div className="col-span-12">
            <Label>Next Project</Label>
          </div>
        </Grid>

        <div className="flex min-h-[70svh] items-center">
          <Grid className="w-full">
            <button onClick={() => triggerTransition("/portfolio")} className="col-span-12 block text-left" data-cursor="view">
              <div data-reveal="lines" className="font-serif font-light leading-[0.86] tracking-[-0.03em]">
                <span className="block overflow-hidden">
                  <span className="pr-line-inner block text-[15vw] md:text-[11vw]">Meridian</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="pr-line-inner block text-[7vw] italic opacity-70 md:text-[4vw]">
                    view next portfolio →
                  </span>
                </span>
              </div>
            </button>
          </Grid>
        </div>

        <Grid>
          <div className="col-span-6">
            <Label>Immersive Studio © 2026</Label>
          </div>
          <div className="col-span-6 flex justify-end">
            <Label>Back to top ↑</Label>
          </div>
        </Grid>
      </section>
    </div>
  )
}
