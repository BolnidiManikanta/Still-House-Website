"use client";

import { useRef, useEffect } from "react";
import ImageRevealContainer from "./ImageRevealContainer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface GalleryProject {
  id: string;
  title: string;
  category: string;
  year: string;
  location: string;
  image: string;
  aspect: string;
}

const projects: GalleryProject[] = [
  {
    id: "01",
    title: "MONOLITH OF SILENCE",
    category: "ARCHITECTURAL SHADOW STUDY",
    year: "2026",
    location: "KYOTO, JAPAN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
    aspect: "aspect-[4/5]",
  },
  {
    id: "02",
    title: "ETHER & GLACIER",
    category: "ATMOSPHERIC LANDSCAPE",
    year: "2025",
    location: "REYKJAVIK, ICELAND",
    image: "/images/hero.jpg",
    aspect: "aspect-[16/10]",
  },
  {
    id: "03",
    title: "SILENT PROFILE",
    category: "MEDIUM FORMAT ANALOG",
    year: "2025",
    location: "ZURICH, SWITZERLAND",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
    aspect: "aspect-[3/4]",
  },
  {
    id: "04",
    title: "CONCRETE SANCTUARY",
    category: "SPATIAL MONOGRAPH",
    year: "2024",
    location: "TOKYO, JAPAN",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    aspect: "aspect-[4/5]",
  },
  {
    id: "05",
    title: "DRAPE & SHADOW",
    category: "HAUTE COUTURE CAMPAIGN",
    year: "2024",
    location: "PARIS, FRANCE",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
    aspect: "aspect-[16/10]",
  },
];

export default function Gallery() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Headings Parallax speed 0.08
      const headings = containerRef.current?.querySelectorAll(".heading-exact");
      headings?.forEach((heading) => {
        gsap.to(heading, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: heading,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="w-full bg-[#F5F3EE] section-padding-museum border-t border-[#D8D4CB]/40"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-36">
          <div>
            <span className="metadata-label block mb-3">EXHIBITION ARCHIVE</span>
            <h2 className="heading-exact text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[-0.07em] leading-[0.78] text-[#111111]">
              SELECTED WORK
            </h2>
          </div>
          <span className="text-[12px] tracking-[0.30em] uppercase text-[#111111] font-light mt-4 md:mt-0 opacity-85">
            [ 05 ARCHIVED MONOGRAPHS ]
          </span>
        </div>

        {/* Gallery Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-44 items-start">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className={`gallery-card group cursor-pointer ${
                idx % 2 === 1 ? "md:translate-y-44" : ""
              }`}
            >
              <ImageRevealContainer
                src={proj.image}
                alt={proj.title}
                aspect={proj.aspect}
                cursorState="OPEN"
              />

              {/* Card Metadata Footer */}
              <div className="mt-8 flex justify-between items-baseline border-b border-[#D8D4CB]/40 pb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <span className="museum-label block mb-1">
                    {proj.id} — {proj.category}
                  </span>
                  <h4 className="text-2xl font-light text-[#111111] tracking-[-0.03em] transition-transform duration-300 group-hover:-translate-y-1">
                    {proj.title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[12px] tracking-[0.30em] uppercase text-[#111111] block font-light">
                    {proj.year}
                  </span>
                  <span className="museum-label block">
                    {proj.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
