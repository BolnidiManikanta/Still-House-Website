"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { usePageTransition } from "@/components/PageTransition";
import AmbientAudio from "@/components/AmbientAudio";
import { useMotion } from "@/components/MotionProvider";

export default function DreamscapesPage() {
  const { triggerTransition } = usePageTransition();
  const { lenis, scrollVelocity } = useMotion();
  const containerRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const nextProjectTitleRef = useRef<HTMLHeadingElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const sections = Array.from(containerRef.current?.querySelectorAll("section.monograph-scene") || []);

      sections.forEach((section, index) => {
        // CONTINUOUS OVERLAPPING SECTION CHOREOGRAPHY (SECTION A MOVES OUT + SECTION B ENTERS)
        if (!prefersReducedMotion) {
          gsap.to(section, {
            y: -50,
            opacity: 0.75,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 80%",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        // LAYER 4 — MAIN TYPOGRAPHY SCROLL PARALLAX (RATIO 0.25x)
        const headings = section.querySelectorAll("h2");
        headings.forEach((heading) => {
          if (!prefersReducedMotion) {
            gsap.fromTo(
              heading,
              { opacity: 0.2, yPercent: 45, xPercent: -3 },
              {
                opacity: 1,
                yPercent: -25,
                xPercent: 2,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 95%",
                  end: "bottom 15%",
                  scrub: 1.2,
                },
              }
            );
          }
        });

        // LAYER 5 — METADATA & SECTION LABELS PARALLAX (RATIO 0.08x)
        const labels = section.querySelectorAll(".mono-label");
        labels.forEach((label) => {
          if (!prefersReducedMotion) {
            gsap.fromTo(
              label,
              { opacity: 0.3, yPercent: 25, x: -20 },
              {
                opacity: 1,
                yPercent: -15,
                x: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 95%",
                  end: "bottom 15%",
                  scrub: 1.2,
                },
              }
            );
          }
        });

        // LAYER 5 — PARAGRAPH TEXT PARALLAX (RATIO 0.08x)
        const paragraphs = section.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (!prefersReducedMotion) {
            gsap.fromTo(
              p,
              { opacity: 0.3, yPercent: 35 },
              {
                opacity: 1,
                yPercent: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 95%",
                  end: "bottom 15%",
                  scrub: 1.2,
                },
              }
            );
          }
        });

        // LAYER 2 — DETERMINISTIC SCROLL-LINKED MASK REVEAL & WRAPPER PARALLAX
        const imageMasks = section.querySelectorAll(".image-mask");
        imageMasks.forEach((mask, maskIdx) => {
          const img = mask.querySelector("img");
          const isLarge = mask.classList.contains("w-[65vw]") || mask.classList.contains("w-[70vw]");
          const isMedium = mask.classList.contains("w-[46%]") || mask.classList.contains("w-[48%]");

          if (!prefersReducedMotion) {
            gsap.fromTo(
              mask,
              { clipPath: "inset(12% 12% 12% 12%)", opacity: 0.3 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1.0,
                ease: "none",
                scrollTrigger: {
                  trigger: mask,
                  start: "top 95%",
                  end: "top 40%",
                  scrub: 1.2,
                },
              }
            );

            // SECTION 01 THREE-IMAGE COMPOSITION — 3 DISTINCT PARALLAX VECTORS & SPEEDS
            let wrapperParallaxY = isLarge ? -95 : isMedium ? -70 : -50;
            let wrapperParallaxX = 0;

            if (index === 0) {
              if (maskIdx === 0) {
                wrapperParallaxX = -30;
                wrapperParallaxY = -60;
              } else if (maskIdx === 1) {
                wrapperParallaxX = 0;
                wrapperParallaxY = -130;
              } else if (maskIdx === 2) {
                wrapperParallaxX = 30;
                wrapperParallaxY = -85;
              }
            }

            // LAYER 2 — IMAGE CONTAINER WRAPPER PARALLAX SCRUB (RATIO 1.00x)
            gsap.to(mask, {
              y: wrapperParallaxY,
              x: wrapperParallaxX,
              ease: "none",
              scrollTrigger: {
                trigger: mask,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
              },
            });

            // LAYER 2.5 — DUAL CAMERA DEPTH: INNER IMAGE CONTENT MOVES IN OPPOSITE VECTOR (RATIO 1.20x)
            if (img) {
              gsap.fromTo(
                img,
                { scale: 1.08, yPercent: 14 },
                {
                  scale: 1.00,
                  yPercent: -14,
                  ease: "none",
                  scrollTrigger: {
                    trigger: mask,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.4,
                  },
                }
              );

              // Restrained Image Hover Breathe & Mouse Movement (X: ±12px, Y: ±8px)
              mask.addEventListener("mousemove", (e: Event) => {
                const mouseEvt = e as MouseEvent;
                const rect = mask.getBoundingClientRect();
                const normX = (mouseEvt.clientX - rect.left) / rect.width - 0.5;
                const normY = (mouseEvt.clientY - rect.top) / rect.height - 0.5;

                gsap.to(img, {
                  x: normX * 12,
                  y: normY * 8,
                  scale: 1.025,
                  duration: 0.6,
                  ease: "power2.out",
                });
              });

              mask.addEventListener("mouseleave", () => {
                gsap.to(img, {
                  x: 0,
                  y: 0,
                  scale: 1.0,
                  duration: 0.8,
                  ease: "power2.out",
                });
              });
            }
          }
        });
      });

      // READING PROGRESS INDICATOR BAR
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main ref={containerRef} className="work-page relative w-full bg-[#F5F2ED] min-h-screen text-[#151515] overflow-x-hidden select-none font-sans">
      {/* Ambient Soundscape */}
      <AmbientAudio isPlaying={isPlayingAudio} />

      {/* ORGANIC 35MM FILM GRAIN OVERLAY (OPACITY 3%) */}
      <div className="grain texture-film-grain opacity-[0.03] pointer-events-none z-0" />

      {/* Reading Progress Indicator Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[99999] pointer-events-none bg-black/10">
        <div
          ref={progressBarRef}
          className="h-full bg-[#151515] origin-left transition-transform duration-75 will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* 1. MOUNTED HERO WITH HIGH CONTRAST & ASYMMETRIC PROJECT TYPOGRAPHY */}
      <Hero />

      {/* MAIN MONOGRAPH EXHIBITION CANVAS WITH CONTINUOUS OVERLAPPING SCENES */}
      <div className="w-[85vw] max-w-[1600px] mx-auto pt-8">

        {/* SECTION 01 — ISOLATION REFLECTIONS (THREE-IMAGE COMPOSITION WITH 3 DISTINCT PARALLAX RATES & VECTORS) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex flex-col items-center justify-center border-b border-[#151515]/15">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-[40px] md:gap-[60px]">
            <div className="image-mask relative w-full md:w-[32%] aspect-[3/4] overflow-hidden rounded-none shadow-sm cursor-pointer border border-black/5" data-cursor="VIEW">
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=98"
                alt="Isolation Reflections Monograph Image 1"
                fill
                priority
                className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
              />
            </div>

            <div className="image-mask relative w-full md:w-[32%] aspect-[3/4] overflow-hidden rounded-none shadow-sm cursor-pointer md:mt-[120px] border border-black/5" data-cursor="VIEW">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=98"
                alt="Isolation Reflections Monograph Image 2"
                fill
                priority
                className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
              />
            </div>

            <div className="image-mask relative w-full md:w-[32%] aspect-[3/4] overflow-hidden rounded-none shadow-sm cursor-pointer md:-mt-[60px] border border-black/5" data-cursor="VIEW">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=98"
                alt="Isolation Reflections Monograph Image 3"
                fill
                priority
                className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* SECTION 02 — OVERVIEW (ASYMMETRIC SPLIT LAYOUT WITH CONTINUOUS OVERLAP) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full min-h-[85vh] flex flex-col md:flex-row items-center justify-between gap-[6%] border-b border-[#151515]/15 -mt-[100px]">
          <div className="image-mask w-full md:w-[46%] relative aspect-[4/5] overflow-hidden rounded-none shadow-sm cursor-pointer mb-12 md:mb-0 border border-black/5" data-cursor="VIEW">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=98"
              alt="Section 02 Overview Image Left"
              fill
              className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
            />
          </div>

          <div className="w-full md:w-[34%] flex flex-col space-y-[32px]">
            <span className="mono-label text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#151515]/75 font-mono font-medium block">
              01 / OVERVIEW
            </span>
            <h2 className="font-serif font-light text-[34px] md:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-0.035em] text-[#151515]">
              Atmospheric Light & Brutalist Geometry
            </h2>
            <p className="text-[15px] md:text-[16px] leading-[1.75] font-normal text-[#151515]/90 max-w-[440px]">
              Volume One examines the intersection between concrete permanence and atmospheric transience across desert plateaus in Kyoto and Reykjavik.
            </p>
          </div>
        </section>

        {/* SECTION 03 — SPATIAL STUDY (REVERSE ASYMMETRIC SPLIT LAYOUT WITH OVERLAP) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full min-h-[85vh] flex flex-col-reverse md:flex-row items-center justify-between gap-[6%] border-b border-[#151515]/15 -mt-[100px]">
          <div className="w-full md:w-[34%] flex flex-col space-y-[32px] mb-12 md:mb-0">
            <span className="mono-label text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#151515]/75 font-mono font-medium block">
              02 / SPATIAL STUDY
            </span>
            <h2 className="font-serif font-light text-[34px] md:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-0.035em] text-[#151515]">
              Transient Light Patterns & Overgrown Forms
            </h2>
            <p className="text-[15px] md:text-[16px] leading-[1.75] font-normal text-[#151515]/90 max-w-[440px]">
              Light within brutalist sanctuaries behaves as a physical medium, tracing concrete perimeters and overgrown flora over six hours.
            </p>
          </div>

          <div className="image-mask w-full md:w-[46%] relative aspect-[4/5] overflow-hidden rounded-none shadow-sm cursor-pointer border border-black/5" data-cursor="VIEW">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=98"
              alt="Section 03 Spatial Study Image Right"
              fill
              className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
            />
          </div>
        </section>

        {/* SECTION 04 — POOLSIDES (TWO-IMAGE STAGGERED EXHIBITION GALLERY WITH OVERLAP) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex flex-col md:flex-row items-center justify-between gap-[40px] md:gap-[60px] border-b border-[#151515]/15 -mt-[100px]">
          <div className="image-mask w-full md:w-[48%] relative aspect-[4/5] overflow-hidden rounded-none shadow-sm cursor-pointer border border-black/5" data-cursor="VIEW">
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=98"
              alt="Poolsides Monograph Image 1"
              fill
              className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
            />
          </div>

          <div className="image-mask w-full md:w-[48%] relative aspect-[4/5] overflow-hidden rounded-none shadow-sm cursor-pointer md:mt-[140px] border border-black/5" data-cursor="VIEW">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=98"
              alt="Poolsides Monograph Image 2"
              fill
              className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
            />
          </div>
        </section>

        {/* SECTION 05 — MONUMENTAL SCALE & (REALLY) REMOTE WORKING */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full border-b border-[#151515]/15 -mt-[100px]">
          <div className="flex flex-col md:flex-row justify-between items-start mb-[80px] md:mb-[140px] gap-8">
            <div>
              <span className="mono-label text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#151515]/75 font-mono font-medium block mb-4">
                03 / ARCHITECTURAL ARCHIVE
              </span>
              <h2 className="font-serif font-light text-[34px] md:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-0.035em] max-w-[480px] text-[#151515]">
                Monumental Scale & (Really) Remote Working
              </h2>
            </div>
            <p className="text-[15px] md:text-[16px] leading-[1.75] font-normal max-w-[440px] text-[#151515]/90 md:self-end">
              Each structure is designed as an architectural anchor—a static form contrasting against shifting cloud formations and isolated work spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] md:gap-[60px]">
            <div className="image-mask relative aspect-[3/4] overflow-hidden rounded-none shadow-sm cursor-pointer border border-black/5" data-cursor="VIEW">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=98"
                alt="Section 05 Archive Image 1"
                fill
                className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
              />
            </div>

            <div className="image-mask relative aspect-[3/4] overflow-hidden rounded-none shadow-sm cursor-pointer border border-black/5" data-cursor="VIEW">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=98"
                alt="Section 05 Archive Image 2"
                fill
                className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
              />
            </div>

            <div className="image-mask relative aspect-[3/4] overflow-hidden rounded-none shadow-sm cursor-pointer border border-black/5" data-cursor="VIEW">
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=98"
                alt="Section 05 Archive Image 3"
                fill
                className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* SECTION 06 — CENTERED EXHIBITION FEATURE (65VW ASPECT 16/10) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex justify-center border-b border-[#151515]/15 -mt-[100px]">
          <div className="image-mask w-full md:w-[65vw] relative aspect-[16/10] overflow-hidden rounded-none shadow-md cursor-pointer border border-black/5" data-cursor="VIEW">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2600&q=98"
              alt="Section 06 Centered Feature Image"
              fill
              className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
            />
          </div>
        </section>

        {/* SECTION 07 — FULL-WIDTH STANDALONE FINAL MONOGRAPH IMAGE */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex justify-center border-b border-[#151515]/15 -mt-[100px]">
          <div className="image-mask w-full md:w-[70vw] relative aspect-[16/9] overflow-hidden rounded-none shadow-md cursor-pointer border border-black/5" data-cursor="VIEW">
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2600&q=98"
              alt="Section 07 Standalone Final Monograph Image"
              fill
              className="object-cover object-center filter contrast-[1.15] saturate-[1.08] transition-transform duration-700"
            />
          </div>
        </section>

        {/* NEXT MONOGRAPH TEASER SECTION */}
        <section className="monograph-scene relative py-48 px-[24px] md:px-[48px] lg:px-[80px] w-full text-center overflow-hidden border-t border-[#151515]/15 -mt-[100px]">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <span className="mono-label text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#151515]/75 font-mono block">
              NEXT MONOGRAPH
            </span>

            <button
              onClick={() => triggerTransition("/project/blueyard")}
              data-magnetic
              className="group focus:outline-none cursor-pointer"
            >
              <h2
                ref={nextProjectTitleRef}
                className="font-serif font-light text-6xl md:text-8xl lg:text-[9vw] text-[#151515] uppercase tracking-[0.08em] leading-[0.80] group-hover:scale-[1.04] transition-transform duration-700 hover:tracking-[0.10em]"
              >
                BLUEYARD
              </h2>
            </button>

            <span className="mono-label text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#151515]/75 block mt-4 font-mono">
              (KEEP SCROLLING)
            </span>
          </div>

          <div className="image-mask absolute inset-0 pointer-events-none opacity-25 z-0">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2600&q=98"
              alt="Next Project Teaser Background Image"
              fill
              className="object-cover object-center filter contrast-[1.15] saturate-[1.08]"
            />
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
