"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ImageRevealContainerProps {
  src: string;
  alt: string;
  aspect: string;
  caption?: string;
  cursorState?: string;
}

export default function ImageRevealContainer({
  src,
  alt,
  aspect,
  caption,
  cursorState = "VIEW",
}: ImageRevealContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const img = imageRef.current;
    if (!container || !img) return;

    // 5X Exaggerated Scene Entrance (opacity 0 -> 1, blur 40px -> 0, scale 1.2 -> 1.0)
    gsap.fromTo(
      container,
      {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0,
        filter: "blur(40px)",
        scale: 1.2,
      },
      {
        clipPath: "inset(0% 0 0 0)",
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

    // 5X Exaggerated Scene Exit (opacity 1 -> 0, blur 0 -> 40px, scale 1.0 -> 0.90)
    gsap.to(container, {
      opacity: 0,
      filter: "blur(40px)",
      scale: 0.90,
      ease: "power2.in",
      scrollTrigger: {
        trigger: container,
        start: "bottom 15%",
        end: "bottom top",
        scrub: true,
      },
    });

    // 5X Viewport Scroll Scrub (scale 1.0 -> 1.15, translateY 0 -> -250px)
    gsap.to(img, {
      scale: 1.15,
      y: -250,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // 5X Image Float Exaggeration (40px vertical movement over 8s loop)
    const randomDuration = 8 + Math.random() * 4;
    const randomDelay = Math.random() * 3;
    gsap.to(container, {
      y: "+=80",
      duration: randomDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: randomDelay,
    });

    // 5X 3D Mouse Tilt (rotateX/Y ±15deg)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y / rect.height - 0.5) * -15;
      const rotateY = (x / rect.width - 0.5) * 15;

      gsap.to(container, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 1500,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="group w-full" data-cursor={cursorState} data-cursor-size="large">
      <div
        ref={containerRef}
        className={`clip-mask-container relative w-full ${aspect} bg-[#EAE6DF] overflow-hidden rounded-none shadow-none`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div ref={imageRef} className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="art-image-museum object-cover object-center"
          />
        </div>
      </div>
      {caption && <p className="mt-6 museum-label">{caption}</p>}
    </div>
  );
}
