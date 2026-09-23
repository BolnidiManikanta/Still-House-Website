"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { usePageTransition } from "@/components/PageTransition";
import AmbientAudio from "@/components/AmbientAudio";
import ArchitecturalImagePlate from "./ArchitecturalImagePlate";
import EditorialTitle from "./EditorialTitle";

export default function DreamscapesExperience() {
  const { triggerTransition } = usePageTransition();
  const containerRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const nextProjectTitleRef = useRef<HTMLHeadingElement>(null);
  const blueyardSectionRef = useRef<HTMLElement>(null);
  const blueyardImageInnerRef = useRef<HTMLDivElement>(null);
  const blueyardLightSweepRef = useRef<HTMLDivElement>(null);
  const blueyardLabelRef = useRef<HTMLSpanElement>(null);
  const blueyardHintRef = useRef<HTMLSpanElement>(null);
  const blueyardMaskRef = useRef<HTMLDivElement>(null);
  const [isPlayingAudio] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const sections = Array.from(container.querySelectorAll("section.monograph-scene"));

      sections.forEach((section) => {
        // Continuous subtle scene travel
        if (!prefersReducedMotion) {
          gsap.to(section, {
            y: -24,
            opacity: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 85%",
              end: "bottom top",
              scrub: 1.0,
            },
          });
        }

        // STEP 8: Continuous editorial metadata & label scroll motion
        const labels = Array.from(section.querySelectorAll(".mono-label"));
        labels.forEach((label) => {
          if (!prefersReducedMotion) {
            gsap.timeline({
              scrollTrigger: {
                trigger: label,
                start: "top 95%",
                end: "bottom 15%",
                scrub: 0.8,
              },
            })
              .fromTo(label, { opacity: 0.2, y: 18 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.5 })
              .to(label, { y: -12, opacity: 0.8, ease: "power1.in", duration: 0.5 });
          } else {
            gsap.set(label, { opacity: 1, y: 0 });
          }
        });

        // STEP 8: Continuous editorial paragraph scroll motion
        const paragraphs = Array.from(section.querySelectorAll(".editorial-desc"));
        paragraphs.forEach((p) => {
          if (!prefersReducedMotion) {
            gsap.timeline({
              scrollTrigger: {
                trigger: p,
                start: "top 95%",
                end: "bottom 15%",
                scrub: 0.8,
              },
            })
              .fromTo(p, { opacity: 0.2, y: 22 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.5 })
              .to(p, { y: -16, opacity: 0.8, ease: "power1.in", duration: 0.5 });
          } else {
            gsap.set(p, { opacity: 1, y: 0 });
          }
        });
      });

      // =========================================================================
      // STEP 11 — BLUEYARD / FEATURE PROJECT CONTINUOUS SCROLL ENGINE
      // Strongest animation on the page
      // IMAGE: scale 1.08 -> 1.00 -> 1.05
      // IMAGE: yPercent 8 -> 0 -> -8
      // LIGHT: left -> center -> right
      // TITLE: y 30 -> 0 -> -20
      // IMAGE MASK: center opening -> full image (clip-path: inset(0 50% 0 50%) -> inset(0 0% 0 0%))
      // =========================================================================
      const blueyardSec = blueyardSectionRef.current;
      const blueyardImg = blueyardImageInnerRef.current;
      const blueyardMask = blueyardMaskRef.current;
      const blueyardLight = blueyardLightSweepRef.current;
      const blueyardTitle = nextProjectTitleRef.current;
      const blueyardLabel = blueyardLabelRef.current;
      const blueyardHint = blueyardHintRef.current;

      if (blueyardSec && !prefersReducedMotion) {
        // 11.1 Continuous Center Clip-Path Opening on Blueyard Background Mask
        if (blueyardMask) {
          gsap.fromTo(
            blueyardMask,
            { clipPath: "inset(0% 50% 0% 50%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: blueyardSec,
                start: "top 95%",
                end: "top 45%",
                scrub: 0.8,
              },
            }
          );
        }

        // 11.2 Continuous Camera Push-In & Parallax on Blueyard Image
        if (blueyardImg) {
          const imgTl = gsap.timeline({
            scrollTrigger: {
              trigger: blueyardSec,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.0,
            },
          });

          imgTl
            .fromTo(
              blueyardImg,
              { scale: 1.08, yPercent: 8 },
              { scale: 1.00, yPercent: 0, ease: "none", duration: 0.5 }
            )
            .to(blueyardImg, { scale: 1.05, yPercent: -8, ease: "none", duration: 0.5 });
        }

        // 11.3 Moving Architectural Light Sweep across Blueyard
        if (blueyardLight) {
          const lightTl = gsap.timeline({
            scrollTrigger: {
              trigger: blueyardSec,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          });

          lightTl
            .fromTo(
              blueyardLight,
              { xPercent: -120, opacity: 0.1 },
              { xPercent: 0, opacity: 0.45, ease: "none", duration: 0.5 }
            )
            .to(blueyardLight, { xPercent: 120, opacity: 0.1, ease: "none", duration: 0.5 });
        }

        // 11.4 Continuous Title Depth Movement: y 30 -> 0 -> -20
        if (blueyardTitle) {
          const titleTl = gsap.timeline({
            scrollTrigger: {
              trigger: blueyardSec,
              start: "top 90%",
              end: "bottom 10%",
              scrub: 0.8,
            },
          });

          titleTl
            .fromTo(
              blueyardTitle,
              { y: 30, opacity: 0.2 },
              { y: 0, opacity: 1, ease: "power2.out", duration: 0.5 }
            )
            .to(blueyardTitle, { y: -20, opacity: 0.85, ease: "power1.in", duration: 0.5 });
        }

        // Label and hint subtle parallax
        if (blueyardLabel) {
          gsap.timeline({
            scrollTrigger: {
              trigger: blueyardSec,
              start: "top 92%",
              end: "bottom 15%",
              scrub: 0.8,
            },
          })
            .fromTo(blueyardLabel, { y: 20, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.5 })
            .to(blueyardLabel, { y: -10, duration: 0.5 });
        }

        if (blueyardHint) {
          gsap.timeline({
            scrollTrigger: {
              trigger: blueyardSec,
              start: "top 88%",
              end: "bottom 15%",
              scrub: 0.8,
            },
          })
            .fromTo(blueyardHint, { y: 20, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.5 })
            .to(blueyardHint, { y: -10, duration: 0.5 });
        }
      }

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

      // Synchronize all ScrollTrigger geometry
      ScrollTrigger.refresh();
    }, containerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="work-page relative w-full bg-[#F5F2ED] min-h-screen text-[#151515] overflow-x-hidden select-none font-sans"
    >
      {/* Ambient Soundscape */}
      <AmbientAudio isPlaying={isPlayingAudio} />

      {/* 10. ATMOSPHERIC DEPTH: ORGANIC 35MM FILM GRAIN OVERLAY (OPACITY 2%) */}
      <div className="grain texture-film-grain opacity-[0.02] pointer-events-none z-0" />

      {/* 10. ATMOSPHERIC DEPTH: ULTRA-SUBTLE ARCHITECTURAL HAZE VEIL (OPACITY 1.5%) */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.015] mix-blend-soft-light bg-gradient-to-b from-transparent via-[#E8E2D8] to-transparent" />

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

        {/* SECTION 01 — ISOLATION REFLECTIONS (THREE-IMAGE COMPOSITION WITH DISTINCT DEPTH PARALLAX & WIPES) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex flex-col items-center justify-center border-b border-[#151515]/15">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-[40px] md:gap-[60px]">
            <ArchitecturalImagePlate
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=98"
              alt="Isolation Reflections Monograph Image 1"
              className="w-full md:w-[32%]"
              aspectClass="aspect-[3/4]"
              priority
              showWipe
              parallaxSpeed={16}
            />

            <ArchitecturalImagePlate
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=98"
              alt="Isolation Reflections Monograph Image 2"
              className="w-full md:w-[32%] md:mt-[120px]"
              aspectClass="aspect-[3/4]"
              priority
              parallaxSpeed={24}
            />

            <ArchitecturalImagePlate
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=98"
              alt="Isolation Reflections Monograph Image 3"
              className="w-full md:w-[32%] md:-mt-[60px]"
              aspectClass="aspect-[3/4]"
              priority
              showWipe
              parallaxSpeed={18}
            />
          </div>
        </section>

        {/* SECTION 02 — OVERVIEW (ASYMMETRIC SPLIT LAYOUT WITH ARCHITECTURAL CLIP EXPANSION & EDITORIAL ENTRANCE) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full min-h-[85vh] flex flex-col md:flex-row items-center justify-between gap-[6%] border-b border-[#151515]/15 -mt-[100px]">
          <ArchitecturalImagePlate
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=98"
            alt="Section 02 Overview Image Left"
            className="w-full md:w-[46%] mb-12 md:mb-0"
            aspectClass="aspect-[4/5]"
            clipExpansion
            showWipe
            parallaxSpeed={20}
          />

          <div className="w-full md:w-[34%] flex flex-col space-y-[32px]">
            <span className="mono-label text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#151515]/75 font-mono font-medium block">
              01 / OVERVIEW
            </span>
            <EditorialTitle className="font-serif font-light text-[34px] md:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-0.035em] text-[#151515]">
              Atmospheric Light & Brutalist Geometry
            </EditorialTitle>
            <p className="editorial-desc text-[15px] md:text-[16px] leading-[1.75] font-normal text-[#151515]/90 max-w-[440px]">
              Volume One examines the intersection between concrete permanence and atmospheric transience across desert plateaus in Kyoto and Reykjavik.
            </p>
          </div>
        </section>

        {/* SECTION 03 — SPATIAL STUDY (REVERSE ASYMMETRIC SPLIT LAYOUT WITH CLIP EXPANSION & OVERLAP) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full min-h-[85vh] flex flex-col-reverse md:flex-row items-center justify-between gap-[6%] border-b border-[#151515]/15 -mt-[100px]">
          <div className="w-full md:w-[34%] flex flex-col space-y-[32px] mb-12 md:mb-0">
            <span className="mono-label text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#151515]/75 font-mono font-medium block">
              02 / SPATIAL STUDY
            </span>
            <EditorialTitle className="font-serif font-light text-[34px] md:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-0.035em] text-[#151515]">
              Transient Light Patterns & Overgrown Forms
            </EditorialTitle>
            <p className="editorial-desc text-[15px] md:text-[16px] leading-[1.75] font-normal text-[#151515]/90 max-w-[440px]">
              Light within brutalist sanctuaries behaves as a physical medium, tracing concrete perimeters and overgrown flora over six hours.
            </p>
          </div>

          <ArchitecturalImagePlate
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=98"
            alt="Section 03 Spatial Study Image Right"
            className="w-full md:w-[46%]"
            aspectClass="aspect-[4/5]"
            clipExpansion
            showWipe
            parallaxSpeed={20}
          />
        </section>

        {/* SECTION 04 — POOLSIDES (TWO-IMAGE STAGGERED EXHIBITION GALLERY WITH OVERLAP) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex flex-col md:flex-row items-center justify-between gap-[40px] md:gap-[60px] border-b border-[#151515]/15 -mt-[100px]">
          <ArchitecturalImagePlate
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=98"
            alt="Poolsides Monograph Image 1"
            className="w-full md:w-[48%]"
            aspectClass="aspect-[4/5]"
            parallaxSpeed={16}
          />

          <ArchitecturalImagePlate
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=98"
            alt="Poolsides Monograph Image 2"
            className="w-full md:w-[48%] md:mt-[140px]"
            aspectClass="aspect-[4/5]"
            showWipe
            parallaxSpeed={24}
          />
        </section>

        {/* SECTION 05 — MONUMENTAL SCALE & (REALLY) REMOTE WORKING */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full border-b border-[#151515]/15 -mt-[100px]">
          <div className="flex flex-col md:flex-row justify-between items-start mb-[80px] md:mb-[140px] gap-8">
            <div>
              <span className="mono-label text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-[#151515]/75 font-mono font-medium block mb-4">
                03 / ARCHITECTURAL ARCHIVE
              </span>
              <EditorialTitle className="font-serif font-light text-[34px] md:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-0.035em] max-w-[480px] text-[#151515]">
                Monumental Scale & (Really) Remote Working
              </EditorialTitle>
            </div>
            <p className="editorial-desc text-[15px] md:text-[16px] leading-[1.75] font-normal max-w-[440px] text-[#151515]/90 md:self-end">
              Each structure is designed as an architectural anchor—a static form contrasting against shifting cloud formations and isolated work spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] md:gap-[60px]">
            <ArchitecturalImagePlate
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=98"
              alt="Section 05 Archive Image 1"
              className="w-full"
              aspectClass="aspect-[3/4]"
              showWipe
              parallaxSpeed={16}
            />

            <ArchitecturalImagePlate
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=98"
              alt="Section 05 Archive Image 2"
              className="w-full"
              aspectClass="aspect-[3/4]"
              parallaxSpeed={22}
            />

            <ArchitecturalImagePlate
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=98"
              alt="Section 05 Archive Image 3"
              className="w-full"
              aspectClass="aspect-[3/4]"
              showWipe
              parallaxSpeed={18}
            />
          </div>
        </section>

        {/* SECTION 06 — CENTERED EXHIBITION FEATURE (65VW ASPECT 16/10 WITH CLIP EXPANSION & WIPE) */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex justify-center border-b border-[#151515]/15 -mt-[100px]">
          <ArchitecturalImagePlate
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2600&q=98"
            alt="Section 06 Centered Feature Image"
            className="w-full md:w-[65vw]"
            aspectClass="aspect-[16/10]"
            clipExpansion
            showWipe
            parallaxSpeed={22}
          />
        </section>

        {/* SECTION 07 — FULL-WIDTH STANDALONE FINAL MONOGRAPH IMAGE */}
        <section className="monograph-scene py-[80px] md:py-[140px] lg:py-[180px] w-full flex justify-center border-b border-[#151515]/15 -mt-[100px]">
          <ArchitecturalImagePlate
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2600&q=98"
            alt="Section 07 Standalone Final Monograph Image"
            className="w-full md:w-[70vw]"
            aspectClass="aspect-[16/9]"
            clipExpansion
            showWipe
            parallaxSpeed={24}
          />
        </section>

        {/* 11. NEXT MONOGRAPH TEASER SECTION (BLUEYARD / LARGE FEATURE PROJECT) */}
        <section
          ref={blueyardSectionRef}
          className="monograph-scene relative py-48 px-[24px] md:px-[48px] lg:px-[80px] w-full text-center overflow-hidden border-t border-[#151515]/15 -mt-[100px]"
        >
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <span
              ref={blueyardLabelRef}
              className="mono-label text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#151515]/75 font-mono block"
            >
              NEXT MONOGRAPH
            </span>

            <button
              onClick={() => triggerTransition("/project/blueyard")}
              data-magnetic
              data-cursor="VIEW PROJECT ↗"
              className="group focus:outline-none cursor-pointer"
            >
              <h2
                ref={nextProjectTitleRef}
                className="font-serif font-light text-6xl md:text-8xl lg:text-[9vw] text-[#151515] uppercase tracking-[0.08em] leading-[0.80] group-hover:scale-[1.03] transition-all duration-700 hover:tracking-[0.10em]"
              >
                BLUEYARD
              </h2>
            </button>

            <span
              ref={blueyardHintRef}
              className="mono-label text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#151515]/75 block mt-4 font-mono"
            >
              (KEEP SCROLLING)
            </span>
          </div>

          <div
            ref={blueyardMaskRef}
            className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden will-change-transform"
          >
            <div
              ref={blueyardImageInnerRef}
              className="w-full h-[120%] -top-[10%] relative will-change-transform"
            >
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2600&q=98"
                alt="Next Project Teaser Background Image"
                fill
                className="object-cover object-center filter contrast-[1.15] saturate-[1.08]"
              />
              {/* STEP 11.3: Natural light sweep moving across the Blueyard background */}
              <div
                ref={blueyardLightSweepRef}
                className="light-sweep pointer-events-none absolute -inset-[40%] w-[180%] h-[180%] z-[2]"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 28%, rgba(255, 252, 245, 0.05) 38%, rgba(255, 250, 240, 0.45) 50%, rgba(255, 252, 245, 0.05) 62%, transparent 72%)",
                  filter: "blur(32px)",
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
