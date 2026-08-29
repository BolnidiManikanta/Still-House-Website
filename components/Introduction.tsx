"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // Scene Entrance & Exit Transitions (blur 20px -> 0 -> 20px, scale 1.05 -> 1 -> 0.96)
      gsap.fromTo(
        section,
        { opacity: 0, filter: "blur(20px)", scale: 1.05 },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1.0,
          duration: 1.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );

      gsap.to(section, {
        opacity: 0,
        filter: "blur(20px)",
        scale: 0.96,
        ease: "power2.in",
        scrollTrigger: {
          trigger: section,
          start: "bottom 20%",
          end: "bottom top",
          scrub: true,
        },
      });

      // Line Mask Typography Reveal
      const lines = section.querySelectorAll(".line-mask-element");
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: 120, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.6,
            stagger: 0.04,
            ease: "power4.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="w-full bg-[#F5F3EE] section-padding-museum border-t border-[#D8D4CB]/40 relative z-10"
      data-cursor="EXPLORE"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left Metadata Column (depth 0.5) */}
        <div data-depth="0.5" className="lg:col-span-4 flex flex-col space-y-6">
          <div>
            <span className="metadata-label block mb-2">MONOGRAPH OVERVIEW</span>
            <span className="text-[12px] tracking-[0.30em] uppercase text-[#111111] font-light opacity-80">
              STILL STUDIO MONOGRAPH
            </span>
          </div>

          <div className="pt-8 border-t border-[#D8D4CB]/40 grid grid-cols-2 gap-6 text-[12px] uppercase tracking-[0.25em] text-[#777777] font-light">
            <div>
              <span className="block opacity-60 mb-1">YEAR</span>
              <span className="text-[#111111]">2024 — 2026</span>
            </div>
            <div>
              <span className="block opacity-60 mb-1">MEDIUM</span>
              <span className="text-[#111111]">ANALOG & DIGITAL</span>
            </div>
            <div>
              <span className="block opacity-60 mb-1">LOCATION</span>
              <span className="text-[#111111]">KYOTO / REYKJAVIK</span>
            </div>
            <div>
              <span className="block opacity-60 mb-1">EXHIBITION</span>
              <span className="text-[#111111]">UNSEEN STUDIO</span>
            </div>
          </div>
        </div>

        {/* Right Editorial Narrative Block (depth 1.0) */}
        <div data-depth="1.0" className="lg:col-span-8">
          <h2
            ref={titleRef}
            className="heading-exact text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[-0.07em] leading-[0.82] text-[#111111] mb-12"
          >
            <span className="line-mask-wrapper">
              <span className="line-mask-element">AN EXPLORATION OF ATMOSPHERIC</span>
            </span>
            <span className="line-mask-wrapper">
              <span className="line-mask-element">LIGHT, SILENCE, AND ARCHITECTURAL</span>
            </span>
            <span className="line-mask-wrapper">
              <span className="line-mask-element">MONOLITHS.</span>
            </span>
          </h2>

          <div ref={textRef} className="space-y-8">
            <p className="body-exact text-[18px] leading-[1.7]">
              Dreamscapes is a multi-year fine art photography monograph documenting quiet architectural monuments, atmospheric mist, and brutalist geometries across Japan, Switzerland, and Iceland.
            </p>
            <p className="body-exact text-[18px] leading-[1.7]">
              Every image captures subtle light falloff, museum softness, and environmental transience—presenting space not as static structure, but as a living atmosphere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
