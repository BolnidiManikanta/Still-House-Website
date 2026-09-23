"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface EditorialTitleProps {
  children: string;
  className?: string;
  as?: "h2" | "h1" | "h3";
}

export default function EditorialTitle({
  children,
  className = "",
  as: Component = "h2",
}: EditorialTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(container.querySelectorAll(".editorial-word"));

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(words, { opacity: 1, y: 0 });
        return;
      }

      // STEP 8: TYPOGRAPHY MOVEMENT TIED TO SCROLL PROGRESS
      // While entering: y: 30px -> 0, opacity: 0 -> 1
      // While exiting: y: 0 -> -20px
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 95%",
          end: "bottom 15%",
          scrub: 0.8,
        },
      });

      titleTl
        .fromTo(
          words,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.03,
            ease: "power2.out",
            duration: 0.5,
          }
        )
        .to(words, {
          y: -20,
          opacity: 0.85,
          ease: "power1.in",
          duration: 0.5,
        });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const words = children.split(" ");

  return (
    <Component ref={containerRef} className={`${className} select-none`}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.26em] align-top leading-[inherit]">
          <span className="editorial-word inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
