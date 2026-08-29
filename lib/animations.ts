import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Exact easing & duration specified in instructions:
// Duration: 1.4s, Ease: power4.out, TranslateY: 100px -> 0, Opacity 0 -> 1
export const EASE_POWER4_OUT = "power4.out";
export const TEXT_DURATION = 1.4;

export const textRevealAnimation = (element: HTMLElement | null, delay: number = 0) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      y: 100,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: TEXT_DURATION,
      delay,
      ease: EASE_POWER4_OUT,
    }
  );
};

export const initImageParallaxAndReveal = (containerRef: HTMLElement | null, imageRef: HTMLElement | null) => {
  if (!containerRef || !imageRef) return;

  // Reveal: Opacity 0 -> 1, Scale 1.08 -> 1
  gsap.fromTo(
    imageRef,
    {
      scale: 1.08,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  );
};

// Framer Motion Variants for Declarative Components
export const textMaskVariants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.4,
      ease: [0.25, 1, 0.5, 1], // power4.out cubic-bezier equivalent
      delay: i * 0.1,
    },
  }),
};

export const imageEntranceVariants = {
  hidden: {
    scale: 1.08,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};
