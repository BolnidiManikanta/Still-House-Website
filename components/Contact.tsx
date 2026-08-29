"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      // Scene Entrance (opacity 0 -> 1, blur 20px -> 0, scale 1.05 -> 1.0)
      gsap.fromTo(
        container,
        { opacity: 0, filter: "blur(20px)", scale: 1.05 },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1.0,
          duration: 1.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
          },
        }
      );

      // Line Mask Typography Reveals
      const lines = container.querySelectorAll(".line-mask-element");
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: 140, opacity: 0 },
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="w-full bg-[#F5F3EE] section-padding-museum border-t border-[#D8D4CB]/40 relative z-10"
      data-cursor="EXPLORE"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left Column (depth 0.5) */}
        <div data-depth="0.5" className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            <span className="metadata-label block mb-2">INQUIRIES & ACQUISITION</span>
            <h2 className="heading-exact text-3xl md:text-5xl font-extralight tracking-[-0.07em] text-[#111111]">
              STUDIO MONOGRAPH
            </h2>
          </div>

          <p className="body-exact text-[18px] leading-[1.7] max-w-[36ch]">
            For fine art print acquisitions, gallery monograph licensing, or exhibition inquiries, contact Still Studio.
          </p>

          <div className="pt-8 border-t border-[#D8D4CB]/40 space-y-3">
            <span className="museum-label block">DIRECT INQUIRIES</span>
            <a
              href="mailto:inquiries@stillstudio.co"
              className="text-xl md:text-2xl font-light text-[#111111] hover:opacity-60 transition-opacity block tracking-[-0.02em]"
              data-cursor="OPEN"
              data-magnetic
            >
              inquiries@stillstudio.co
            </a>
          </div>
        </div>

        {/* Right Column Title (depth 1.0) */}
        <div data-depth="1.0" className="lg:col-span-7 flex flex-col justify-between h-full">
          <h2
            ref={titleRef}
            className="hero-title-monumental text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[-0.07em] leading-[0.78] text-[#111111] mb-16"
          >
            <span className="line-mask-wrapper">
              <span className="line-mask-element">STILL STUDIO</span>
            </span>
            <span className="line-mask-wrapper">
              <span className="line-mask-element">© 2026</span>
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-8 border-t border-[#D8D4CB]/40 text-[12px] uppercase tracking-[0.25em] text-[#777777] font-light">
            <span className="mb-2 sm:mb-0">UNSEEN STUDIO RECREATION</span>
            <span>NEUE MONTREAL / HELVETICA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
