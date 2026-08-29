"use client";

import { useEffect, useRef } from "react";
import ImageRevealContainer from "./ImageRevealContainer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SeriesSectionProps {
  number: string;
  title: string;
  category: string;
  description: string;
  layout: "full" | "paired" | "stacked" | "asymmetric";
  images: { src: string; alt: string; aspect: string; caption?: string }[];
}

const seriesData: SeriesSectionProps[] = [
  {
    number: "SERIES 01",
    title: "MONOLITHIC FORMS",
    category: "BRUTALIST SHADOW STUDIES",
    description: "Stark architectural monoliths, raw concrete sanctuaries, and geometric shadow studies softened by morning fog.",
    layout: "paired",
    images: [
      {
        src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
        alt: "Concrete Monolith Study I",
        aspect: "aspect-[4/5]",
        caption: "FIG 01.1 — BRUTALIST CONCRETE VOID / TOKYO",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
        alt: "Shadow Study II",
        aspect: "aspect-[4/5]",
        caption: "FIG 01.2 — AMBIENT LIGHT SHADOW STUDY / ZURICH",
      },
    ],
  },
  {
    number: "SERIES 02",
    title: "HORIZON & MIST",
    category: "ATMOSPHERIC LANDSCAPES",
    description: "Glacial rivers, volcanic valleys under pale dawn mist, and the vast geometry of silence captured across remote terrain.",
    layout: "full",
    images: [
      {
        src: "/images/hero.jpg",
        alt: "Horizon Study I - Glacial Mist Monolith",
        aspect: "aspect-[21/9]",
        caption: "FIG 02.1 — REYKJAVIK HIGHLANDS AT DAWN",
      },
    ],
  },
  {
    number: "SERIES 03",
    title: "SILENT SILHOUETTES",
    category: "MEDIUM FORMAT ANALOG",
    description: "Intimate medium-format analog studies isolating human drape, quiet presence, and architectural light.",
    layout: "asymmetric",
    images: [
      {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1800&q=85",
        alt: "Silent Profile Monograph",
        aspect: "aspect-[16/10]",
        caption: "FIG 03.1 — MEDIUM FORMAT 80MM / KYOTO",
      },
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=85",
        alt: "Silhouette Form Study",
        aspect: "aspect-[4/5]",
        caption: "FIG 03.2 — GALLERY EXHIBITION SHADOW STUDY",
      },
    ],
  },
  {
    number: "SERIES 04",
    title: "ECHOES OF SILK",
    category: "EDITORIAL DRAPE & TEXTURE",
    description: "High fashion editorial monograph focusing on fabric texture, silhouette drape, and sculptured gallery lighting.",
    layout: "stacked",
    images: [
      {
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85",
        alt: "Commercial Silk Drape I",
        aspect: "aspect-[16/9]",
        caption: "FIG 04.1 — EDITORIAL MONOGRAPH / PARIS",
      },
      {
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85",
        alt: "Commercial Silk Drape II",
        aspect: "aspect-[3/4]",
        caption: "FIG 04.2 — SILHOUETTE DRAPE STUDY",
      },
    ],
  },
];

export default function Series() {
  const containerRef = useRef<HTMLDivElement>(null);

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

      // Metadata Parallax speed 0.03
      const metas = containerRef.current?.querySelectorAll(".metadata-label");
      metas?.forEach((meta) => {
        gsap.to(meta, {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: meta,
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
    <section id="series" ref={containerRef} className="w-full bg-[#F5F3EE]">
      {seriesData.map((series, idx) => (
        <div key={idx} className="w-full section-padding-museum border-t border-[#D8D4CB]/40">
          {/* Section Header */}
          <div className="max-w-[1600px] mx-auto mb-24 md:mb-40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
              <div>
                <span className="metadata-label block mb-3">
                  {series.number} — {series.category}
                </span>
                <h3 className="heading-exact text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[-0.07em] leading-[0.78] text-[#111111]">
                  {series.title}
                </h3>
              </div>
              <p className="max-w-[38ch] body-exact text-[18px] leading-[1.7] mt-6 md:mt-0">
                {series.description}
              </p>
            </div>
          </div>

          {/* Gallery Exhibition Rhythm Layout */}
          <div className="max-w-[1600px] mx-auto">
            {series.layout === "full" && (
              <div className="w-full">
                {series.images.map((img, imgIdx) => (
                  <ImageRevealContainer
                    key={imgIdx}
                    src={img.src}
                    alt={img.alt}
                    aspect={img.aspect}
                    caption={img.caption}
                    cursorState="VIEW"
                  />
                ))}
              </div>
            )}

            {series.layout === "paired" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-36 items-center">
                {series.images.map((img, imgIdx) => (
                  <div key={imgIdx} className={imgIdx === 1 ? "md:translate-y-36" : ""}>
                    <ImageRevealContainer
                      src={img.src}
                      alt={img.alt}
                      aspect={img.aspect}
                      caption={img.caption}
                      cursorState="VIEW"
                    />
                  </div>
                ))}
              </div>
            )}

            {series.layout === "asymmetric" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-28 items-center">
                <div className="lg:col-span-8">
                  <ImageRevealContainer
                    src={series.images[0].src}
                    alt={series.images[0].alt}
                    aspect={series.images[0].aspect}
                    caption={series.images[0].caption}
                    cursorState="VIEW"
                  />
                </div>

                <div className="lg:col-span-4 mt-12 lg:mt-48">
                  <ImageRevealContainer
                    src={series.images[1].src}
                    alt={series.images[1].alt}
                    aspect={series.images[1].aspect}
                    caption={series.images[1].caption}
                    cursorState="VIEW"
                  />
                </div>
              </div>
            )}

            {series.layout === "stacked" && (
              <div className="flex flex-col space-y-36 md:space-y-64">
                <div className="w-full">
                  <ImageRevealContainer
                    src={series.images[0].src}
                    alt={series.images[0].alt}
                    aspect={series.images[0].aspect}
                    caption={series.images[0].caption}
                    cursorState="VIEW"
                  />
                </div>

                <div className="w-full md:w-3/4 mx-auto">
                  <ImageRevealContainer
                    src={series.images[1].src}
                    alt={series.images[1].aspect}
                    aspect={series.images[1].aspect}
                    caption={series.images[1].caption}
                    cursorState="VIEW"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
